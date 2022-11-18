import { ARobotBehaviour } from "../interpreter.aRobotBehaviour";
import { State } from "../interpreter.state";
import * as C from "../interpreter.constants";
import * as U from "../interpreter.util";
import { Unit } from "../Unit";
import { HardwareState, SensorMode, SensorName } from "./RobotHardwareState";
import { KeysOfUnion, Utils } from "../Utils";

export class RobotSimBehaviour extends ARobotBehaviour {

	private readonly unit: Unit

	/**
	 * Drive action of the robot
	 */
	drive?: {
		distance?: number,
		/** speed in the interval [-1, 1] */
		speed?: { left: number, right: number },
		time?: number
	}

	/**
	 * Rotation action which rotates left iff `angle * speed > 0`.
	 */
	rotate?: {
		/** In radians. A positive angle indicates a left rotation (right hand rule) for positive speeds. */
		angle?: number,
		/** always the actual rotation direction */
		rotateLeft: boolean,
		/** Speed in the interval [-1, 1]. The magnitude of speed might be used if `angle` is null */
		speed: number
	}

	constructor(unit: Unit) {
		super();
		this.unit = unit
		this.hardwareState.motors = {};
		U.loggingEnabled(false, false);
	}

	getHardwareStateSensors() {
		return this.hardwareState.sensors
	}

	/**
	 * Returns the reference angle of the gyro sensor
	 * 
	 * @param port port of the gyro sensor
	 * @returns `this.hardwareState["angleReset"][port]`
	 */
	getGyroReferenceAngle(port: string): number | undefined {
		return this.hardwareState["angleReset"]?.[port]
	}

	resetCommands() {
		this.rotate = undefined
		this.drive = undefined
	}

	private clampSpeed(speed: number): number {
		return Math.min(100, Math.max(-100, speed))
	}

	public getSample(s: State, name: string, sensor: SensorName, port: number | string, mode: SensorMode) {
		var robotText = 'robot: ' + name + ', port: ' + port + ', mode: ' + mode;
		U.debug(robotText + ' getsample from ' + sensor);
		var sensorName = sensor;

		if (sensorName == C.TIMER) {
			Utils.assertTypeOf(port, "number")
			s.push(this.timerGet(port));
		} else if (sensorName == C.ENCODER_SENSOR_SAMPLE) {
			s.push(this.getEncoderValue(mode, port + ""));
		} else {
			//workaround due to mbots sensor names
			if (name == 'mbot') {
				port = 'ORT_' + port;
			}
			s.push(this.getSensorValue(sensorName, port + "", mode));
		}
	}

	private getEncoderValue(mode: string, port: string): number | "undefined" {
		const sensor = this.hardwareState.sensors.encoder;
		const realPort = port == C.MOTOR_LEFT ? C.LEFT : C.RIGHT;
		const v = sensor?.[realPort];
		if (v === undefined) {
			return 'undefined';
		} else {
			return this.rotation2Unit(v, mode);
		}
	}

	// InterpreterConst["DEGREE" | "ROTATIONS" | "DISTANCE"]
	private rotation2Unit(value: number, unit: string): number {
		switch (unit) {
			case C.DEGREE:
				return value;
			case C.ROTATIONS:
				return value / 360.0;
			case C.DISTANCE:
				return (value * C.WHEEL_DIAMETER * Math.PI) / 360.0;
			default:
				return 0;
		}
	}

	private getSensorValue(sensorName: SensorName, port: string, mode: SensorMode) {
		const sensor = (this.hardwareState.sensors as any)[sensorName];
		if (sensor === undefined) {
			return 'undefined';
		}
		let v: string | number | undefined;
		if (mode != undefined) {
			if (port != undefined) {
				v = sensor[port]?.[mode]
				if (sensorName === 'gyro' && mode === 'angle') {
					v = this.hardwareState.sensors[sensorName]?.[port]?.[mode]
					var reset = this.hardwareState['angleReset'];
					if (v != undefined && reset != undefined) {
						var resetValue = reset[port];
						if (resetValue != undefined) {
							let value: number = +v;
							value = value - resetValue;
							// TODO: Maybe use mathematical modulo instead
							// if (value < 0) {
							// 	value = value + 360;
							// }
							v = '' + value;
						}
					}
				}
			} else {
				v = sensor[mode];
			}
		} else if (port != undefined) {
			if (mode === undefined) {
				v = sensor[port];
			}
		} else {
			return sensor;
		}
		if (v === undefined) {
			return false;
		} else {
			return v;
		}
	}

	public encoderReset(port: string) {
		U.debug('encoderReset for ' + port);
		this.hardwareState.actions.encoder = {};
		if (port == C.MOTOR_LEFT) {
			this.hardwareState.actions.encoder.leftReset = true;
		} else {
			this.hardwareState.actions.encoder.rightReset = true;
		}
	}

	public timerReset(port: number) {
		// TODO: ???
		this.hardwareState.timers[port] = Date.now();
		U.debug('timerReset for ' + port);
	}

	public timerGet(port: number) {
		const now = Date.now();
		var startTime = this.hardwareState.timers[port];
		if (startTime === undefined) {
			startTime = this.hardwareState.timers['start'];
		}
		const delta = now - startTime;
		U.debug('timerGet for ' + port + ' returned ' + delta);
		return delta;
	}

	public ledOnAction(name: string, port: number, color: number) {
		const robotText = 'robot: ' + name + ', port: ' + port;
		U.debug(robotText + ' led on color ' + color);
		this.hardwareState.actions.led = {};
		this.hardwareState.actions.led.color = color;
	}

	public statusLightOffAction(name: string, port: number) {
		const robotText = 'robot: ' + name + ', port: ' + port;
		U.debug(robotText + ' led off');

		if (name === 'mbot') {
			if (!this.hardwareState.actions.leds) {
				this.hardwareState.actions.leds = {};
			}
			this.hardwareState.actions.leds[port] = { mode: C.OFF };
		} else {
			this.hardwareState.actions.led = { mode: C.OFF };
		}
	}

	public toneAction(name: string, frequency: number, duration: number): number {
		U.debug(name + ' piezo: ' + ', frequency: ' + frequency + ', duration: ' + duration);
		this.hardwareState.actions.tone = {
			frequency: frequency,
			duration: duration
		};
		this.setBlocking(duration > 0);
		return 0;
	}

	public playFileAction(file: string): number {
		U.debug('play file: ' + file);
		this.hardwareState.actions.tone = { file: file };
		switch (file) {
			case '0':
				return 1000;
			case '1':
				return 350;
			case '2':
				return 700;
			case '3':
				return 700;
			case '4':
				return 500;
			default:
				throw new Error("Wrong file " + file)
		}
	}

	public setVolumeAction(volume: number): void {
		U.debug('set volume: ' + volume);
		this.hardwareState.actions.volume = Math.max(Math.min(100, volume), 0);
		this.hardwareState.volume = Math.max(Math.min(100, volume), 0);
	}

	public getVolumeAction(s: State): void {
		U.debug('get volume');
		s.push(this.hardwareState.volume);
	}

	public setLanguage(language: string): void {
		U.debug('set language ' + language);
		this.hardwareState.actions.language = language;
	}

	public sayTextAction(text: string, speed: number, pitch: number): number {
		this.hardwareState.actions.sayText = {
			text: text,
			speed: speed,
			pitch: pitch
		}
		this.setBlocking(true);
		return 0;
	}

	public motorOnAction(name: string, port: any, duration: number, speed: number): number {
		const robotText = 'robot: ' + name + ', port: ' + port;
		const durText = duration === undefined ? ' w.o. duration' : ' for ' + duration + ' msec';
		U.debug(robotText + ' motor speed ' + speed + durText);
		if (this.hardwareState.actions.motors == undefined) {
			this.hardwareState.actions.motors = {};
		}
		this.hardwareState.actions.motors[port] = speed;
		this.hardwareState.motors[port] = speed;

		// TODO: duration???

		return 0;
	}

	public motorStopAction(name: string, port: any) {
		const robotText = 'robot: ' + name + ', port: ' + port;
		U.debug(robotText + ' motor stop');
		this.motorOnAction(name, port, 0, 0);
	}

	public driveAction(name: string, direction: string, speed: number, distance: number, time: number): number {
		speed = this.clampSpeed(speed)

		const t = true
		if (t) {

			// Handle direction
			if (direction != C.FOREWARD) {
				speed *= -1
			}
			// This is to handle 0 distance being passed in
			if (distance === 0) {
				speed = 0
			}

			this.drive = {
				// convert distance from cm to m
				distance: distance ? this.unit.getLength(distance * 0.01) : undefined,
				// convert speed from precent to fraction
				speed: (speed ? { left: speed * 0.01, right: speed * 0.01} : undefined),
				time: time ? this.unit.getTime(time) : undefined
			}

			return 1
		}
	
		const robotText = 'robot: ' + name + ', direction: ' + direction;
		const durText = distance === undefined ? ' w.o. duration' : ' for ' + distance + ' msec';
		U.debug(robotText + ' motor speed ' + speed + durText);
		if (this.hardwareState.actions.motors == undefined) {
			this.hardwareState.actions.motors = {};
		}
		// This is to handle negative values entered in the distance parameter in the drive block
		if ((direction != C.FOREWARD && distance > 0) || (direction == C.FOREWARD && distance < 0) || (direction != C.FOREWARD && !distance)) {
			speed *= -1;
		}
		// This is to handle 0 distance being passed in
		if (distance === 0) {
			speed = 0;
		}
		this.hardwareState.actions.motors[C.MOTOR_LEFT] = speed;
		this.hardwareState.actions.motors[C.MOTOR_RIGHT] = speed;
		this.hardwareState.motors[C.MOTOR_LEFT] = speed;
		this.hardwareState.motors[C.MOTOR_RIGHT] = speed;

		if (time !== undefined) {
			return time;
		}
		const rotationPerSecond = (C.MAX_ROTATION * Math.abs(speed)) / 100.0;
		if (rotationPerSecond == 0.0 || distance === undefined) {
			return 0;
		} else {
			const rotations = Math.abs(distance) / (C.WHEEL_DIAMETER * Math.PI);
			return (rotations / rotationPerSecond) * 1000;
		}
	}

	public curveAction(name: string, direction: string, speedL: number, speedR: number, distance: number, time: number): number {
		speedL = this.clampSpeed(speedL)
		speedR = this.clampSpeed(speedR)

		const t = true
		if (t) {

			// Handle direction
			if (direction != C.FOREWARD) {
				speedL *= -1
				speedR *= -1
			}
			// This is to handle 0 distance being passed in
			if (distance === 0) {
				speedR = 0
				speedL = 0
			}

			this.drive = {
				// convert distance from cm to m
				distance: distance ? this.unit.getLength(distance * 0.01) : undefined,
				// convert speedL and speedR from precent to fraction
				speed: { left: speedL * 0.01, right: speedR * 0.01},
				time: this.unit.getTime(time) || undefined
			}

			return 1;
		}

		const robotText = 'robot: ' + name + ', direction: ' + direction;
		const durText = distance === undefined ? ' w.o. duration' : ' for ' + distance + ' msec';
		U.debug(robotText + ' left motor speed ' + speedL + ' right motor speed ' + speedR + durText);
		if (this.hardwareState.actions.motors == undefined) {
			this.hardwareState.actions.motors = {};
		}
		// This is to handle negative values entered in the distance parameter in the steer block
		if ((direction != C.FOREWARD && distance > 0) || (direction == C.FOREWARD && distance < 0) || (direction != C.FOREWARD && !distance)) {
			speedL *= -1;
			speedR *= -1;
		}
		// This is to handle 0 distance being passed in
		if (distance === 0) {
			speedR = 0;
			speedL = 0;
		}
		this.hardwareState.actions.motors[C.MOTOR_LEFT] = speedL;
		this.hardwareState.actions.motors[C.MOTOR_RIGHT] = speedR;
		this.hardwareState.motors[C.MOTOR_LEFT] = speedL;
		this.hardwareState.motors[C.MOTOR_RIGHT] = speedR;
		const avgSpeed = 0.5 * (Math.abs(speedL) + Math.abs(speedR));

		if (time !== undefined) {
			return time;
		}
		const rotationPerSecond = (C.MAX_ROTATION * avgSpeed) / 100.0;
		if (rotationPerSecond == 0.0 || distance === undefined) {
			return 0;
		} else {
			const rotations = Math.abs(distance) / (C.WHEEL_DIAMETER * Math.PI);
			return rotations / rotationPerSecond * 1000;
		}
	}

	public turnAction(name: string, direction: string, speed: number, angle: number, time: number ): number {
		speed = this.clampSpeed(speed)

		const t = true
		if (t) {
			
			// This is to handle negative values entered in the degree parameter in the turn block
			if (direction != C.LEFT && angle) {
				angle *= -1
			}

			// This is to handle a speed of 0 being passed in
			if (speed === 0) {
				angle = 0;
			}

			this.rotate = {
				// convert angle from degrees to radians
				angle: angle ? angle * Math.PI / 180 : undefined,
				rotateLeft: (angle ? angle > 0 : direction == C.LEFT) == (speed > 0),
				// convert speed from precent to fraction
				speed: speed * 0.01
			}
		}
		
		const robotText = 'robot: ' + name + ', direction: ' + direction;
		const durText = angle === undefined ? ' w.o. duration' : ' for ' + angle + ' msec';
		U.debug(robotText + ' motor speed ' + speed + durText);
		if (this.hardwareState.actions.motors == undefined) {
			this.hardwareState.actions.motors = {};
		}
		// This is to handle negative values entered in the degree parameter in the turn block
		if ((direction == C.LEFT && angle < 0) || (direction == C.RIGHT && angle < 0)) {
			speed *= -1;
		}
		// This is to handle an angle of 0 being passed in
		if (angle === 0) {
			speed = 0;
		}
		this.setTurnSpeed(speed, direction);

		if (time !== undefined) {
			return time;
		}
		const rotationPerSecond = (C.MAX_ROTATION * Math.abs(speed)) / 100.0;
		if (rotationPerSecond == 0.0 || angle === undefined) {
			return 0;
		} else {
			const rotations = C.TURN_RATIO * (Math.abs(angle) / 720);
			return (rotations / rotationPerSecond) * 1000;
		}
	}


	private setTurnSpeed(speed: number, direction: string): void {
		if (direction == C.LEFT) {
			this.hardwareState.actions.motors!![C.MOTOR_LEFT] = -speed;
			this.hardwareState.actions.motors!![C.MOTOR_RIGHT] = speed;
		} else {
			this.hardwareState.actions.motors!![C.MOTOR_LEFT] = speed;
			this.hardwareState.actions.motors!![C.MOTOR_RIGHT] = -speed;
		}
	}

	public driveStop(name: string): void {
		U.debug('robot: ' + name + ' stop motors');
		if (this.hardwareState.actions.motors == undefined) {
			this.hardwareState.actions.motors = {};
		}
		this.hardwareState.actions.motors[C.MOTOR_LEFT] = 0;
		this.hardwareState.actions.motors[C.MOTOR_RIGHT] = 0;
	}

	public getMotorSpeed(s: State, name: string, port: any): void {
		const robotText = 'robot: ' + name + ', port: ' + port;
		U.debug(robotText + ' motor get speed');
		const speed = this.hardwareState.motors[port];
		Utils.assertNonNull(speed)
		s.push(speed);
	}

	public setMotorSpeed(name: string, port: any, speed: number): void {
		speed = this.clampSpeed(speed)

		const robotText = 'robot: ' + name + ', port: ' + port;
		U.debug(robotText + ' motor speed ' + speed);
		if (this.hardwareState.actions.motors == undefined) {
			this.hardwareState.actions.motors = {};
		}
		this.hardwareState.actions.motors[port] = speed;
		this.hardwareState.motors[port] = speed;
	}

	public showTextAction(text: any, mode: KeysOfUnion<HardwareState["actions"]["display"]>): number {
		const showText = '' + text;
		U.debug('***** show "' + showText + '" *****');
		this.hardwareState.actions.display = {};
		(this.hardwareState.actions.display as any)[mode.toLowerCase()] = showText;
		this.setBlocking(text.length > 0);
		return 0;
	}

	public showTextActionPosition(text: any, x: number, y: number): void {
		const showText = '' + text;
		U.debug('***** show "' + showText + '" *****');
		this.hardwareState.actions.display = {};
		this.hardwareState.actions.display.text = showText;
		this.hardwareState.actions.display.x = x;
		this.hardwareState.actions.display.y = y;
	}

	public showImageAction(image: any, mode: string): number {
		const showImage = '' + image;
		U.debug('***** show "' + showImage + '" *****');
		const imageLen = image.length;
		let duration = 0;
		if (mode == C.ANIMATION) {
			duration = imageLen * 200;
		}
		this.hardwareState.actions.display = {};
		this.hardwareState.actions.display.picture = Utils.clone(image);
		if (mode) {
			this.hardwareState.actions.display.mode = mode.toLowerCase();
		}
		return duration;
	}

	public displaySetBrightnessAction(value: number): number {
		U.debug('***** set brightness "' + value + '" *****');
		this.hardwareState.actions.display = {};
		this.hardwareState.actions.display[C.BRIGHTNESS] = value;
		return 0;
	}

	public lightAction(mode: "on" | "off", color: string, port: string): void {
		U.debug('***** light action mode= "' + mode + ' color=' + color + '" *****');

		if (port !== undefined) {
			if (!this.hardwareState.actions.leds) {
				this.hardwareState.actions.leds = {};
			}
			this.hardwareState.actions.leds[port] = {
				mode: mode,
				color: color
			};
		} else {
			this.hardwareState.actions.led = {};
			this.hardwareState.actions.led[C.MODE] = mode;
			this.hardwareState.actions.led[C.COLOR] = color;
		}

	}

	public displaySetPixelBrightnessAction(x: number, y: number, brightness: number): number {
		U.debug('***** set pixel x="' + x + ', y=' + y + ', brightness=' + brightness + '" *****');
		this.hardwareState.actions.display = {};
		this.hardwareState.actions.display[C.PIXEL] = {
			x: x,
			y: y,
			brightness: brightness
		};
		return 0;
	}

	public displayGetPixelBrightnessAction(s: State, x: number, y: number): void {
		U.debug('***** get pixel x="' + x + ', y=' + y + '" *****');
		const sensor = this.hardwareState.sensors[C.DISPLAY]?.[C.PIXEL];
		Utils.assertNonNull(sensor)
		s.push(sensor[y][x]);
	}

	public clearDisplay(): void {
		U.debug('clear display');
		this.hardwareState.actions.display = {};
		this.hardwareState.actions.display.clear = true;
	}

	public writePinAction(pin: any, mode: string, value: number): void {
		let pinString = `pin${pin}` as const
		this.hardwareState.actions[pinString] = {};
		this.hardwareState.actions[pinString][mode] = value;
	}

	public gyroReset(port: number): void {
		const gyro = this.hardwareState.sensors['gyro'];
		if (gyro !== undefined) {
			const value = gyro[port];
			if (value !== undefined) {
				const angle = value['angle'];
				if (angle !== undefined) {
					if (this.hardwareState['angleReset'] == undefined) {
						this.hardwareState['angleReset'] = {};
					}
					this.hardwareState['angleReset'][port] = angle;
				}
			}
		}
	}


	public getState(): any {
		return this.hardwareState;
	}

	public debugAction(value: any): void {
		U.debug('***** debug action "' + value + '" *****');
		Utils.log(value);
	}

	public assertAction(_msg: string, _left: any, _op: string, _right: any, value: boolean): void {
		U.debug('***** assert action "' + value + ' ' + _msg + ' ' + _left + ' ' + _op + ' ' + _right + '" *****');
		console.assert(value, _msg + ' ' + _left + ' ' + _op + ' ' + _right);
	}

	public close() {}
}
