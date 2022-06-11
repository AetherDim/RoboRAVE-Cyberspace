var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../interpreter.aRobotBehaviour", "../interpreter.constants", "../interpreter.util", "../Utils"], function (require, exports, interpreter_aRobotBehaviour_1, C, U, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RobotSimBehaviour = void 0;
    var RobotSimBehaviour = /** @class */ (function (_super) {
        __extends(RobotSimBehaviour, _super);
        function RobotSimBehaviour(unit) {
            var _this = _super.call(this) || this;
            _this.unit = unit;
            _this.hardwareState.motors = {};
            U.loggingEnabled(false, false);
            return _this;
        }
        RobotSimBehaviour.prototype.getHardwareStateSensors = function () {
            return this.hardwareState.sensors;
        };
        /**
         * Returns the reference angle of the gyro sensor
         *
         * @param port port of the gyro sensor
         * @returns `this.hardwareState["angleReset"][port]`
         */
        RobotSimBehaviour.prototype.getGyroReferenceAngle = function (port) {
            var _a;
            return (_a = this.hardwareState["angleReset"]) === null || _a === void 0 ? void 0 : _a[port];
        };
        RobotSimBehaviour.prototype.resetCommands = function () {
            this.rotate = undefined;
            this.drive = undefined;
        };
        RobotSimBehaviour.prototype.clampSpeed = function (speed) {
            return Math.min(100, Math.max(-100, speed));
        };
        RobotSimBehaviour.prototype.getSample = function (s, name, sensor, port, mode) {
            var robotText = 'robot: ' + name + ', port: ' + port + ', mode: ' + mode;
            U.debug(robotText + ' getsample from ' + sensor);
            var sensorName = sensor;
            if (sensorName == C.TIMER) {
                Utils_1.Utils.assertTypeOf(port, "number");
                s.push(this.timerGet(port));
            }
            else if (sensorName == C.ENCODER_SENSOR_SAMPLE) {
                s.push(this.getEncoderValue(mode, port + ""));
            }
            else {
                //workaround due to mbots sensor names
                if (name == 'mbot') {
                    port = 'ORT_' + port;
                }
                s.push(this.getSensorValue(sensorName, port + "", mode));
            }
        };
        RobotSimBehaviour.prototype.getEncoderValue = function (mode, port) {
            var sensor = this.hardwareState.sensors.encoder;
            var realPort = port == C.MOTOR_LEFT ? C.LEFT : C.RIGHT;
            var v = sensor === null || sensor === void 0 ? void 0 : sensor[realPort];
            if (v === undefined) {
                return 'undefined';
            }
            else {
                return this.rotation2Unit(v, mode);
            }
        };
        // InterpreterConst["DEGREE" | "ROTATIONS" | "DISTANCE"]
        RobotSimBehaviour.prototype.rotation2Unit = function (value, unit) {
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
        };
        RobotSimBehaviour.prototype.getSensorValue = function (sensorName, port, mode) {
            var _a, _b, _c;
            var sensor = this.hardwareState.sensors[sensorName];
            if (sensor === undefined) {
                return 'undefined';
            }
            var v;
            if (mode != undefined) {
                if (port != undefined) {
                    v = (_a = sensor[port]) === null || _a === void 0 ? void 0 : _a[mode];
                    if (sensorName === 'gyro' && mode === 'angle') {
                        v = (_c = (_b = this.hardwareState.sensors[sensorName]) === null || _b === void 0 ? void 0 : _b[port]) === null || _c === void 0 ? void 0 : _c[mode];
                        var reset = this.hardwareState['angleReset'];
                        if (v != undefined && reset != undefined) {
                            var resetValue = reset[port];
                            if (resetValue != undefined) {
                                var value = +v;
                                value = value - resetValue;
                                // TODO: Maybe use mathematical modulo instead
                                // if (value < 0) {
                                // 	value = value + 360;
                                // }
                                v = '' + value;
                            }
                        }
                    }
                }
                else {
                    v = sensor[mode];
                }
            }
            else if (port != undefined) {
                if (mode === undefined) {
                    v = sensor[port];
                }
            }
            else {
                return sensor;
            }
            if (v === undefined) {
                return false;
            }
            else {
                return v;
            }
        };
        RobotSimBehaviour.prototype.encoderReset = function (port) {
            U.debug('encoderReset for ' + port);
            this.hardwareState.actions.encoder = {};
            if (port == C.MOTOR_LEFT) {
                this.hardwareState.actions.encoder.leftReset = true;
            }
            else {
                this.hardwareState.actions.encoder.rightReset = true;
            }
        };
        RobotSimBehaviour.prototype.timerReset = function (port) {
            // TODO: ???
            this.hardwareState.timers[port] = Date.now();
            U.debug('timerReset for ' + port);
        };
        RobotSimBehaviour.prototype.timerGet = function (port) {
            var now = Date.now();
            var startTime = this.hardwareState.timers[port];
            if (startTime === undefined) {
                startTime = this.hardwareState.timers['start'];
            }
            var delta = now - startTime;
            U.debug('timerGet for ' + port + ' returned ' + delta);
            return delta;
        };
        RobotSimBehaviour.prototype.ledOnAction = function (name, port, color) {
            var robotText = 'robot: ' + name + ', port: ' + port;
            U.debug(robotText + ' led on color ' + color);
            this.hardwareState.actions.led = {};
            this.hardwareState.actions.led.color = color;
        };
        RobotSimBehaviour.prototype.statusLightOffAction = function (name, port) {
            var robotText = 'robot: ' + name + ', port: ' + port;
            U.debug(robotText + ' led off');
            if (name === 'mbot') {
                if (!this.hardwareState.actions.leds) {
                    this.hardwareState.actions.leds = {};
                }
                this.hardwareState.actions.leds[port] = { mode: C.OFF };
            }
            else {
                this.hardwareState.actions.led = { mode: C.OFF };
            }
        };
        RobotSimBehaviour.prototype.toneAction = function (name, frequency, duration) {
            U.debug(name + ' piezo: ' + ', frequency: ' + frequency + ', duration: ' + duration);
            this.hardwareState.actions.tone = {
                frequency: frequency,
                duration: duration
            };
            this.setBlocking(duration > 0);
            return 0;
        };
        RobotSimBehaviour.prototype.playFileAction = function (file) {
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
                    throw "Wrong file " + file;
            }
        };
        RobotSimBehaviour.prototype.setVolumeAction = function (volume) {
            U.debug('set volume: ' + volume);
            this.hardwareState.actions.volume = Math.max(Math.min(100, volume), 0);
            this.hardwareState.volume = Math.max(Math.min(100, volume), 0);
        };
        RobotSimBehaviour.prototype.getVolumeAction = function (s) {
            U.debug('get volume');
            s.push(this.hardwareState.volume);
        };
        RobotSimBehaviour.prototype.setLanguage = function (language) {
            U.debug('set language ' + language);
            this.hardwareState.actions.language = language;
        };
        RobotSimBehaviour.prototype.sayTextAction = function (text, speed, pitch) {
            this.hardwareState.actions.sayText = {
                text: text,
                speed: speed,
                pitch: pitch
            };
            this.setBlocking(true);
            return 0;
        };
        RobotSimBehaviour.prototype.motorOnAction = function (name, port, duration, speed) {
            var robotText = 'robot: ' + name + ', port: ' + port;
            var durText = duration === undefined ? ' w.o. duration' : ' for ' + duration + ' msec';
            U.debug(robotText + ' motor speed ' + speed + durText);
            if (this.hardwareState.actions.motors == undefined) {
                this.hardwareState.actions.motors = {};
            }
            this.hardwareState.actions.motors[port] = speed;
            this.hardwareState.motors[port] = speed;
            // TODO: duration???
            return 0;
        };
        RobotSimBehaviour.prototype.motorStopAction = function (name, port) {
            var robotText = 'robot: ' + name + ', port: ' + port;
            U.debug(robotText + ' motor stop');
            this.motorOnAction(name, port, 0, 0);
        };
        RobotSimBehaviour.prototype.driveAction = function (name, direction, speed, distance, time) {
            speed = this.clampSpeed(speed);
            var t = true;
            if (t) {
                // Handle direction
                if (direction != C.FOREWARD) {
                    speed *= -1;
                }
                // This is to handle 0 distance being passed in
                if (distance === 0) {
                    speed = 0;
                }
                this.drive = {
                    // convert distance from cm to m
                    distance: distance ? this.unit.getLength(distance * 0.01) : undefined,
                    // convert speed from precent to fraction
                    speed: (speed ? { left: speed * 0.01, right: speed * 0.01 } : undefined),
                    time: time ? this.unit.getTime(time) : undefined
                };
                return 1;
            }
            var robotText = 'robot: ' + name + ', direction: ' + direction;
            var durText = distance === undefined ? ' w.o. duration' : ' for ' + distance + ' msec';
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
            var rotationPerSecond = (C.MAX_ROTATION * Math.abs(speed)) / 100.0;
            if (rotationPerSecond == 0.0 || distance === undefined) {
                return 0;
            }
            else {
                var rotations = Math.abs(distance) / (C.WHEEL_DIAMETER * Math.PI);
                return (rotations / rotationPerSecond) * 1000;
            }
        };
        RobotSimBehaviour.prototype.curveAction = function (name, direction, speedL, speedR, distance, time) {
            speedL = this.clampSpeed(speedL);
            speedR = this.clampSpeed(speedR);
            var t = true;
            if (t) {
                // Handle direction
                if (direction != C.FOREWARD) {
                    speedL *= -1;
                    speedR *= -1;
                }
                // This is to handle 0 distance being passed in
                if (distance === 0) {
                    speedR = 0;
                    speedL = 0;
                }
                this.drive = {
                    // convert distance from cm to m
                    distance: distance ? this.unit.getLength(distance * 0.01) : undefined,
                    // convert speedL and speedR from precent to fraction
                    speed: { left: speedL * 0.01, right: speedR * 0.01 },
                    time: this.unit.getTime(time) || undefined
                };
                return 1;
            }
            var robotText = 'robot: ' + name + ', direction: ' + direction;
            var durText = distance === undefined ? ' w.o. duration' : ' for ' + distance + ' msec';
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
            var avgSpeed = 0.5 * (Math.abs(speedL) + Math.abs(speedR));
            if (time !== undefined) {
                return time;
            }
            var rotationPerSecond = (C.MAX_ROTATION * avgSpeed) / 100.0;
            if (rotationPerSecond == 0.0 || distance === undefined) {
                return 0;
            }
            else {
                var rotations = Math.abs(distance) / (C.WHEEL_DIAMETER * Math.PI);
                return rotations / rotationPerSecond * 1000;
            }
        };
        RobotSimBehaviour.prototype.turnAction = function (name, direction, speed, angle, time) {
            speed = this.clampSpeed(speed);
            var t = true;
            if (t) {
                // This is to handle negative values entered in the degree parameter in the turn block
                if (direction != C.LEFT && angle) {
                    angle *= -1;
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
                };
            }
            var robotText = 'robot: ' + name + ', direction: ' + direction;
            var durText = angle === undefined ? ' w.o. duration' : ' for ' + angle + ' msec';
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
            var rotationPerSecond = (C.MAX_ROTATION * Math.abs(speed)) / 100.0;
            if (rotationPerSecond == 0.0 || angle === undefined) {
                return 0;
            }
            else {
                var rotations = C.TURN_RATIO * (Math.abs(angle) / 720);
                return (rotations / rotationPerSecond) * 1000;
            }
        };
        RobotSimBehaviour.prototype.setTurnSpeed = function (speed, direction) {
            if (direction == C.LEFT) {
                this.hardwareState.actions.motors[C.MOTOR_LEFT] = -speed;
                this.hardwareState.actions.motors[C.MOTOR_RIGHT] = speed;
            }
            else {
                this.hardwareState.actions.motors[C.MOTOR_LEFT] = speed;
                this.hardwareState.actions.motors[C.MOTOR_RIGHT] = -speed;
            }
        };
        RobotSimBehaviour.prototype.driveStop = function (name) {
            U.debug('robot: ' + name + ' stop motors');
            if (this.hardwareState.actions.motors == undefined) {
                this.hardwareState.actions.motors = {};
            }
            this.hardwareState.actions.motors[C.MOTOR_LEFT] = 0;
            this.hardwareState.actions.motors[C.MOTOR_RIGHT] = 0;
        };
        RobotSimBehaviour.prototype.getMotorSpeed = function (s, name, port) {
            var robotText = 'robot: ' + name + ', port: ' + port;
            U.debug(robotText + ' motor get speed');
            var speed = this.hardwareState.motors[port];
            Utils_1.Utils.assertNonNull(speed);
            s.push(speed);
        };
        RobotSimBehaviour.prototype.setMotorSpeed = function (name, port, speed) {
            speed = this.clampSpeed(speed);
            var robotText = 'robot: ' + name + ', port: ' + port;
            U.debug(robotText + ' motor speed ' + speed);
            if (this.hardwareState.actions.motors == undefined) {
                this.hardwareState.actions.motors = {};
            }
            this.hardwareState.actions.motors[port] = speed;
            this.hardwareState.motors[port] = speed;
        };
        RobotSimBehaviour.prototype.showTextAction = function (text, mode) {
            var showText = '' + text;
            U.debug('***** show "' + showText + '" *****');
            this.hardwareState.actions.display = {};
            this.hardwareState.actions.display[mode.toLowerCase()] = showText;
            this.setBlocking(text.length > 0);
            return 0;
        };
        RobotSimBehaviour.prototype.showTextActionPosition = function (text, x, y) {
            var showText = '' + text;
            U.debug('***** show "' + showText + '" *****');
            this.hardwareState.actions.display = {};
            this.hardwareState.actions.display.text = showText;
            this.hardwareState.actions.display.x = x;
            this.hardwareState.actions.display.y = y;
        };
        RobotSimBehaviour.prototype.showImageAction = function (image, mode) {
            var showImage = '' + image;
            U.debug('***** show "' + showImage + '" *****');
            var imageLen = image.length;
            var duration = 0;
            if (mode == C.ANIMATION) {
                duration = imageLen * 200;
            }
            this.hardwareState.actions.display = {};
            this.hardwareState.actions.display.picture = Utils_1.Utils.clone(image);
            if (mode) {
                this.hardwareState.actions.display.mode = mode.toLowerCase();
            }
            return duration;
        };
        RobotSimBehaviour.prototype.displaySetBrightnessAction = function (value) {
            U.debug('***** set brightness "' + value + '" *****');
            this.hardwareState.actions.display = {};
            this.hardwareState.actions.display[C.BRIGHTNESS] = value;
            return 0;
        };
        RobotSimBehaviour.prototype.lightAction = function (mode, color, port) {
            U.debug('***** light action mode= "' + mode + ' color=' + color + '" *****');
            if (port !== undefined) {
                if (!this.hardwareState.actions.leds) {
                    this.hardwareState.actions.leds = {};
                }
                this.hardwareState.actions.leds[port] = {
                    mode: mode,
                    color: color
                };
            }
            else {
                this.hardwareState.actions.led = {};
                this.hardwareState.actions.led[C.MODE] = mode;
                this.hardwareState.actions.led[C.COLOR] = color;
            }
        };
        RobotSimBehaviour.prototype.displaySetPixelBrightnessAction = function (x, y, brightness) {
            U.debug('***** set pixel x="' + x + ', y=' + y + ', brightness=' + brightness + '" *****');
            this.hardwareState.actions.display = {};
            this.hardwareState.actions.display[C.PIXEL] = {
                x: x,
                y: y,
                brightness: brightness
            };
            return 0;
        };
        RobotSimBehaviour.prototype.displayGetPixelBrightnessAction = function (s, x, y) {
            var _a;
            U.debug('***** get pixel x="' + x + ', y=' + y + '" *****');
            var sensor = (_a = this.hardwareState.sensors[C.DISPLAY]) === null || _a === void 0 ? void 0 : _a[C.PIXEL];
            Utils_1.Utils.assertNonNull(sensor);
            s.push(sensor[y][x]);
        };
        RobotSimBehaviour.prototype.clearDisplay = function () {
            U.debug('clear display');
            this.hardwareState.actions.display = {};
            this.hardwareState.actions.display.clear = true;
        };
        RobotSimBehaviour.prototype.writePinAction = function (pin, mode, value) {
            var pinString = "pin".concat(pin);
            this.hardwareState.actions[pinString] = {};
            this.hardwareState.actions[pinString][mode] = value;
        };
        RobotSimBehaviour.prototype.gyroReset = function (port) {
            var gyro = this.hardwareState.sensors['gyro'];
            if (gyro !== undefined) {
                var value = gyro[port];
                if (value !== undefined) {
                    var angle = value['angle'];
                    if (angle !== undefined) {
                        if (this.hardwareState['angleReset'] == undefined) {
                            this.hardwareState['angleReset'] = {};
                        }
                        this.hardwareState['angleReset'][port] = angle;
                    }
                }
            }
        };
        RobotSimBehaviour.prototype.getState = function () {
            return this.hardwareState;
        };
        RobotSimBehaviour.prototype.debugAction = function (value) {
            U.debug('***** debug action "' + value + '" *****');
            console.log(value);
        };
        RobotSimBehaviour.prototype.assertAction = function (_msg, _left, _op, _right, value) {
            U.debug('***** assert action "' + value + ' ' + _msg + ' ' + _left + ' ' + _op + ' ' + _right + '" *****');
            console.assert(value, _msg + ' ' + _left + ' ' + _op + ' ' + _right);
        };
        RobotSimBehaviour.prototype.close = function () { };
        return RobotSimBehaviour;
    }(interpreter_aRobotBehaviour_1.ARobotBehaviour));
    exports.RobotSimBehaviour = RobotSimBehaviour;
});
