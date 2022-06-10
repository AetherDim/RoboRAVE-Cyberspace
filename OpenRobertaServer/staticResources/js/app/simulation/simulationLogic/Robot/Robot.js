var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
define(["require", "exports", "matter-js", "./ElectricMotor", "../interpreter.constants", "./Wheel", "./Sensors/ColorSensor", "../Geometry/Ray", "../Entity", "../Utils", "./../GlobalDebug", "./BodyHelper", "../Color", "./RobotLED", "../Scene/Manager/ProgramManager", "../ExtendedMatter"], function (require, exports, matter_js_1, ElectricMotor_1, interpreter_constants_1, Wheel_1, ColorSensor_1, Ray_1, Entity_1, Utils_1, GlobalDebug_1, BodyHelper_1, Color_1, RobotLED_1, ProgramManager_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Robot = exports.sensorTypeStrings = void 0;
    exports.sensorTypeStrings = ["TOUCH", "GYRO", "COLOR", "ULTRASONIC", "INFRARED", "SOUND", "COMPASS",
        // german description: "HT Infrarotsensor"
        "IRSEEKER",
        // does not work in RobertaLab?!
        "HT_COLOR",
    ];
    var Robot = /** @class */ (function () {
        function Robot(robot) {
            this.usePseudoWheelPhysics = false;
            this.pseudoMotorTorqueMultiplier = 6.0;
            this.updateSensorGraphics = true;
            /**
             * The color sensors of the robot where the key is the port.
             */
            this.colorSensors = new Map();
            /**
             * The ultrasonic sensors of the robot where the key is the port.
             */
            this.ultrasonicSensors = new Map();
            /**
             * The touch sensors of the robot where the key is the port.
             */
            this.touchSensors = new Map();
            /**
             * The gyro sensors of the robot where the key is the port.
             */
            this.gyroSensors = new Map();
            this.LEDs = [];
            this.programManager = new ProgramManager_1.ProgramManager();
            /**
             * Time to wait until the next command should be executed (in internal units)
             */
            this.delay = 0;
            /**
             * Settings for the usage of `endEncoder`
             */
            this.endEncoderSettings = {
                /**
                 * Maximum encoder angle difference in radians.
                 * End condition: `abs(encoder - endEncoder) < angleAccuracy`
                 */
                maxAngleDifference: 0.02,
                /**
                 * Maximum encoder angular velocity accuracy in radians/'internal seconds' of the driving wheels.
                 * End condition: `abs(wheel.angularVelocity) < maxAngularVelocity`
                 */
                maxAngularVelocity: 0.02,
                /**
                 * Given the encoder difference `encoderDiff = endEncoder - encoder`, use
                 * `Utils.continuousSign(encoderDiff, maxForceControlEncoderDifference)`
                 * as multiplier to the maximum force.
                 */
                maxForceControlEncoderDifference: 0.2,
                /**
                 * The factor before the angular velocity in the force calculation
                 */
                encoderAngleDampingFactor: 0
            };
            /**
             * For given value `vGiven` calculate the actual one `v = vGiven * factor`
             */
            this.calibrationParameters = Robot.realPhysicsCalibrationParameters;
            this.timeSinceProgramStart = 0;
            /**
             * robot type
             */
            this.type = 'default';
            this.transferWheelForcesToRobotBody = false;
            this.children = [];
            /**
             * The torque multiplier for the left wheel
             */
            this.leftForce = 0;
            /**
             * The torque multiplier for the right wheel
             */
            this.rightForce = 0;
            this.encoder = {
                left: 0,
                right: 0
            };
            this.wheelDriveFriction = 0.03;
            this.wheelSlideFriction = 0.07;
            this.needsNewCommands = true;
            this.scene = robot.scene;
            this.bodyEntity = robot.body;
            this.body = robot.body.getPhysicsBody();
            this.leftDrivingWheel = robot.leftDrivingWheel;
            this.rightDrivingWheel = robot.rightDrivingWheel;
            this.wheelsList = [this.leftDrivingWheel, this.rightDrivingWheel].concat(robot.otherWheels);
            this.bodyContainer = this.bodyEntity.getDrawable();
            this.physicsWheelsList = [];
            this.physicsComposite = matter_js_1.Composite.create();
            this.updatePhysicsObject();
            this.addChild(this.bodyEntity);
            var t = this;
            this.wheelsList.forEach(function (wheel) { return t.addChild(wheel); });
            this.addDebugSettings();
            this.init();
        }
        Robot.prototype.getTimeSinceProgramStart = function () {
            return this.timeSinceProgramStart;
        };
        Robot.prototype.setRobotType = function (type) {
            this.type = type;
            // TODO: change things
        };
        Robot.prototype.addDebugSettings = function () {
            var _this = this;
            var DebugGui = this.scene.getDebugGuiDynamic();
            if (DebugGui) {
                var robotFolder_1 = DebugGui.addFolder('Robot');
                var pos = robotFolder_1.addFolder('Position');
                pos.addUpdatable('x', function () { return String(_this.body.position.x); });
                pos.addUpdatable('y', function () { return String(_this.body.position.y); });
                robotFolder_1.add(this, "transferWheelForcesToRobotBody");
                robotFolder_1.add(this, "pseudoMotorTorqueMultiplier", 1, 20);
                robotFolder_1.add(this, "usePseudoWheelPhysics");
                var wheelFolder_1 = robotFolder_1.addFolder('Wheels');
                wheelFolder_1.add(this.endEncoderSettings, "maxAngleDifference", 0, 0.3);
                wheelFolder_1.add(this.endEncoderSettings, "maxAngularVelocity", 0, 0.3);
                wheelFolder_1.add(this.endEncoderSettings, "maxForceControlEncoderDifference", 0, 3);
                wheelFolder_1.add(this.endEncoderSettings, "encoderAngleDampingFactor", 0, 100);
                var control = {
                    alongStepFunctionWidth: 0.1,
                    orthStepFunctionWidth: 0.1,
                    rollingFriction: this.wheelsList[0].rollingFriction,
                    slideFriction: this.wheelsList[0].slideFriction,
                    pseudoSlideFriction: this.wheelsList[0].pseudoSlideFriction,
                    pseudoRollingFriction: this.wheelsList[0].pseudoRollingFriction
                };
                robotFolder_1.add(control, 'pseudoSlideFriction', 0, 10).onChange(function (value) {
                    _this.wheelsList.forEach(function (wheel) { return wheel.pseudoSlideFriction = value; });
                    robotFolder_1.updateDisplay();
                });
                robotFolder_1.add(control, 'pseudoRollingFriction', 0, 10).onChange(function (value) {
                    _this.wheelsList.forEach(function (wheel) { return wheel.pseudoRollingFriction = value; });
                    robotFolder_1.updateDisplay();
                });
                wheelFolder_1.add(control, 'alongStepFunctionWidth', 0, 0.1).onChange(function (value) {
                    _this.wheelsList.forEach(function (wheel) { return wheel.alongStepFunctionWidth = value; });
                    wheelFolder_1.updateDisplay();
                });
                wheelFolder_1.add(control, 'orthStepFunctionWidth', 0, 0.1).onChange(function (value) {
                    _this.wheelsList.forEach(function (wheel) { return wheel.orthStepFunctionWidth = value; });
                    wheelFolder_1.updateDisplay();
                });
                wheelFolder_1.add(control, 'rollingFriction').onChange(function (value) {
                    _this.wheelsList.forEach(function (wheel) { return wheel.rollingFriction = value; });
                    wheelFolder_1.updateDisplay();
                });
                wheelFolder_1.add(control, 'slideFriction').onChange(function (value) {
                    _this.wheelsList.forEach(function (wheel) { return wheel.slideFriction = value; });
                    wheelFolder_1.updateDisplay();
                });
                this.wheelsList[0]._addDebugGui(wheelFolder_1.addFolder('Wheel Left'));
                this.wheelsList[1]._addDebugGui(wheelFolder_1.addFolder('Wheel Right'));
                this.wheelsList[2]._addDebugGui(wheelFolder_1.addFolder('Wheel Back'));
                var program = robotFolder_1.addFolder('Program Manager');
                var pm = this.programManager;
                // TODO:
                /*program.add(pm, 'programPaused')
                program.addUpdatable('debugMode', createReflectionGetter(pm, 'debugManager.debugMode'))
                program.addUpdatable('debugObservers', () => Object.keys((pm as any).debugManager.observers).length)
                program.addUpdatable('initialized', createReflectionGetter(pm, 'initialized'))
                program.addButton('Print breakpoint IDs', () => {
                    //window.alert((pm as any).debugManager.breakpointIDs)
                    console.log((pm as any).debugManager.breakpointIDs)
                })
                program.addButton('Print observers IDs', () => {
                    //window.alert((pm as any).debugManager.breakpointIDs)
                    console.log((pm as any).debugManager.observers)
                })*/
                DebugGui.addButton("Download Program (JSON)", function () {
                    return (0, GlobalDebug_1.downloadFile)("program.json", [JSON.stringify(_this.programManager.getPrograms(), undefined, "\t")]);
                });
            }
        };
        Robot.prototype.updatePhysicsObject = function () {
            var _this = this;
            this.physicsWheelsList = this.wheelsList.map(function (wheel) { return wheel.physicsBody; });
            var wheels = this.physicsWheelsList;
            this.physicsComposite = matter_js_1.Composite.create({ bodies: [this.body].concat(wheels) });
            // set friction
            wheels.forEach(function (wheel) {
                wheel.frictionAir = 0.0;
                // const constraint1 = new CustomConstraint(
                //     this.body, wheel,
                //     Utils.vectorSub(wheel.position, this.body.position), Vector.create(), {
                //         angularFrequency: 2 * Math.PI * 0.6,
                //         damping: 1.0,
                //         length: 0//Vector.magnitude(Utils.vectorSub(this.body.position, wheel.position))
                //     })
                // const constraint2 = new CustomConstraint(
                //     this.body, wheel,
                //     Vector.create(), Utils.vectorSub(this.body.position, wheel.position), {
                //         angularFrequency: 2 * Math.PI * 0.6,
                //         damping: 1.0,
                //         length: 0//Vector.magnitude(Utils.vectorSub(this.body.position, wheel.position))
                //     })
                // this.customConstraints.push(constraint1)
                // this.customConstraints.push(constraint2)
                _this.physicsComposite.addRigidBodyConstraints(_this.body, wheel, 0.1, 0.1);
            });
            this.body.frictionAir = 0.0;
        };
        Robot.prototype.IEntity = function () { };
        Robot.prototype.getScene = function () {
            return this.scene;
        };
        Robot.prototype.getParent = function () {
            return this.parent;
        };
        Robot.prototype._setParent = function (parent) {
            this.parent = parent;
        };
        Robot.prototype.IPhysicsEntity = function () { };
        Robot.prototype.getPhysicsObject = function () {
            return this.physicsComposite;
        };
        Robot.prototype.IPhysicsCompositeEntity = function () { };
        Robot.prototype.getPhysicsComposite = function () {
            return this.physicsComposite;
        };
        Robot.prototype.IContainerEntity = function () { };
        Robot.prototype.getChildren = function () {
            return this.children;
        };
        Robot.prototype.addChild = function (child) {
            var _a;
            (_a = child.getParent()) === null || _a === void 0 ? void 0 : _a.removeChild(child);
            child._setParent(this);
            this.children.push(child);
            if (this.scene.getEntityManager().containsEntity(this)) {
                this.scene.addEntity(child);
            }
        };
        Robot.prototype.removeChild = function (child) {
            child._setParent(undefined);
            Utils_1.Utils.removeFromArray(this.children, child);
            this.scene.removeEntity(child);
        };
        /**
         * Sets the position and rotation of the robot. (Body, wheels and sensors)
         *
         * @param position Position of the robot body in meters
         * @param rotation Rotation of the robot body in radians
         */
        Robot.prototype.setPose = function (position, rotation, inRadians) {
            if (inRadians === void 0) { inRadians = true; }
            matter_js_1.Composite.translate(this.physicsComposite, Utils_1.Utils.vectorSub(position, this.body.position));
            if (!inRadians) {
                rotation *= 2 * Math.PI / 360;
            }
            matter_js_1.Composite.rotate(this.physicsComposite, rotation - this.body.angle, this.body.position);
        };
        Robot.prototype.removeAllSensors = function () {
            this.getColorSensors().forEach(function (c) { return c.removeGraphicsFromParent(); });
            this.getUltrasonicSensors().forEach(function (u) { return u.removeGraphicsFromParent(); });
            this.getTouchSensors().forEach(function (t) { return t.scene.removeEntity(t); });
            this.colorSensors.clear();
            this.ultrasonicSensors.clear();
            this.touchSensors.clear();
            this.gyroSensors.clear();
        };
        /**
         * Returns the color sensor which can be `undefined`
         */
        Robot.prototype.getColorSensors = function () {
            return Array.from(this.colorSensors.values());
        };
        /**
         * Adds the color sensor specified by `opts`
         *
         * @param port the port of the sensor
         * @param opts is either `ColorSensor` or an object of type `{ x: number, y: number, graphicsRadius: number }` where `x` and `y` are position of the sensor in meters and `graphicsRadius` is the radius of the circle graphic in meters
         * @returns false if a color sensor at `port` already exists and a new color sensor was not added
         */
        Robot.prototype.addColorSensor = function (port, opts) {
            if (this.colorSensors.has(port)) {
                return false;
            }
            var colorSensor = opts instanceof ColorSensor_1.ColorSensor ? opts : new ColorSensor_1.ColorSensor(this.scene.unit, matter_js_1.Vector.create(opts.x, opts.y), opts.graphicsRadius);
            this.colorSensors.set(port, colorSensor);
            this.bodyContainer.addChild(colorSensor.graphics);
            return true;
        };
        Robot.prototype.getUltrasonicSensors = function () {
            return Array.from(this.ultrasonicSensors.values());
        };
        Robot.prototype.addUltrasonicSensor = function (port, ultrasonicSensor) {
            if (this.ultrasonicSensors.has(port)) {
                return false;
            }
            this.ultrasonicSensors.set(port, ultrasonicSensor);
            this.bodyContainer.addChild(ultrasonicSensor.graphics);
            return true;
        };
        Robot.prototype.getTouchSensors = function () {
            return Array.from(this.touchSensors.values());
        };
        Robot.prototype.addGyroSensor = function (port, gyroSensor) {
            if (this.gyroSensors.has(port)) {
                return false;
            }
            this.gyroSensors.set(port, gyroSensor);
            return true;
        };
        /**
         * Adds `touchSensor` to `this.touchSensors` if the port is not occupied
         *
         * @param port The port of the touch sensor
         * @param touchSensor The touch sensor which will be added
         * @returns false if a touch sensor at `port` already exists and the new touch sensor was not added
         */
        Robot.prototype.addTouchSensor = function (port, touchSensor) {
            if (this.touchSensors.has(port)) {
                return false;
            }
            this.addChild(touchSensor);
            var sensorBody = touchSensor.physicsBody;
            matter_js_1.Body.rotate(sensorBody, this.body.angle);
            matter_js_1.Body.setPosition(sensorBody, matter_js_1.Vector.add(this.body.position, matter_js_1.Vector.rotate(touchSensor.physicsBody.position, this.body.angle)));
            matter_js_1.Composite.add(this.physicsComposite, sensorBody);
            this.physicsComposite.addRigidBodyConstraints(this.body, sensorBody, 0.3, 0.3);
            this.touchSensors.set(port, touchSensor);
            return true;
        };
        Robot.prototype.getLEDs = function () {
            return this.LEDs;
        };
        Robot.prototype.addLED = function (led) {
            this.LEDs.push(led);
            this.bodyContainer.addChild(led.graphics);
        };
        Robot.prototype.setWheels = function (wheels) {
            this.leftDrivingWheel = wheels.leftDrivingWheel;
            this.rightDrivingWheel = wheels.rightDrivingWheel;
            this.wheelsList = [this.leftDrivingWheel, this.rightDrivingWheel].concat(wheels.otherWheels);
            this.updatePhysicsObject();
        };
        Robot.prototype.vectorAlongBody = function (body, length) {
            if (length === void 0) { length = 1; }
            return matter_js_1.Vector.create(length * Math.cos(body.angle), length * Math.sin(body.angle));
        };
        Robot.prototype.driveWithWheel = function (wheel, forwardForce) {
            var force = this.vectorAlongBody(wheel, forwardForce);
            matter_js_1.Body.applyForce(wheel, wheel.position, force);
        };
        Robot.prototype.velocityAlongBody = function (body) {
            return matter_js_1.Vector.dot(body.velocity, this.vectorAlongBody(body));
        };
        Robot.prototype.init = function () {
            this.resetInternalState();
        };
        // TODO: (Remove) it is an old but simpler implementation than `Wheel`
        Robot.prototype.updateWheelVelocity = function (wheel, dt) {
            var vec = this.vectorAlongBody(wheel);
            var velocityAlongBody = matter_js_1.Vector.mult(vec, matter_js_1.Vector.dot(vec, wheel.velocity));
            var velocityOrthBody = Utils_1.Utils.vectorSub(wheel.velocity, velocityAlongBody);
            var velocityChange = Utils_1.Utils.vectorAdd(matter_js_1.Vector.mult(velocityAlongBody, -this.wheelDriveFriction), matter_js_1.Vector.mult(velocityOrthBody, -this.wheelSlideFriction));
            // divide two times by `dt` since the simulation calculates velocity changes by adding
            // force/mass * dt
            matter_js_1.Body.applyForce(wheel, wheel.position, matter_js_1.Vector.mult(velocityChange, wheel.mass / dt));
        };
        /**
         * Reset the internal state of the robot. E.g. `endEncoder`, `leftForce`, `timeSinceProgramStart`
         */
        Robot.prototype.resetInternalState = function () {
            // reset program related variables
            this.timeSinceProgramStart = 0;
            this.needsNewCommands = true;
            this.endEncoder = undefined;
            this.leftForce = 0;
            this.rightForce = 0;
            // reset led state
            this.LEDs.forEach(function (LED) { return LED.resetState(); });
        };
        // IUpdatableEntity
        Robot.prototype.IUpdatableEntity = function () { };
        Robot.prototype.update = function (dt) {
            var e_1, _a;
            var _this = this;
            // update the forces and torques of all wheels
            var gravitationalAcceleration = this.scene.unit.getAcceleration(9.81);
            var robotBodyGravitationalForce = gravitationalAcceleration * this.body.mass / this.wheelsList.length;
            this.wheelsList.forEach(function (wheel) {
                wheel.applyNormalForce(robotBodyGravitationalForce + wheel.physicsBody.mass * gravitationalAcceleration);
                if (_this.usePseudoWheelPhysics) {
                    wheel.pseudoPhysicsUpdate(dt);
                }
                else {
                    wheel.update(dt);
                }
                if (_this.transferWheelForcesToRobotBody) {
                    var force = wheel._wheelForceVector;
                    matter_js_1.Body.applyForce(wheel.physicsBody, wheel.physicsBody.position, matter_js_1.Vector.neg(force));
                    matter_js_1.Body.applyForce(_this.body, wheel.physicsBody.position, force);
                }
            });
            // update internal encoders
            this.encoder.left = this.leftDrivingWheel.wheelAngle;
            this.encoder.right = this.rightDrivingWheel.wheelAngle;
            try {
                for (var _b = __values(this.programManager.getPrograms()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var program = _c.value;
                    this._update(dt, program);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        /**
         * Updates the robot with time step 'dt'.
         * @param dt The time step in internal units
         */
        Robot.prototype._update = function (dt, program) {
            var robotBehaviour = program.instruction;
            // update sensors
            this.updateRobotBehaviourHardwareStateSensors(program);
            // update LEDs
            var LEDActionState = robotBehaviour === null || robotBehaviour === void 0 ? void 0 : robotBehaviour.getActionState("led", true);
            var LEDAction = Utils_1.Utils.flatMapOptional(LEDActionState, function (action) {
                var _a;
                return {
                    color: Utils_1.Utils.flatMapOptional((_a = action.color) === null || _a === void 0 ? void 0 : _a.toUpperCase(), function (color) {
                        if (Utils_1.Utils.listIncludesValue(RobotLED_1.robotLEDColors, color)) {
                            return color;
                        }
                        else {
                            console.warn("The robot LED color ('".concat(color, "') is not typed as 'RobotLEDColor'"));
                            return undefined;
                        }
                    }),
                    mode: action.mode.toUpperCase()
                };
            });
            this.LEDs.forEach(function (LED) { return LED.update(dt, LEDAction); });
            if (!program.interpreter) {
                this.resetInternalState(); // TODO: check
                return;
            }
            this.timeSinceProgramStart += dt;
            if (this.delay > 0) {
                this.delay -= dt; // reduce delay by dt each tick
            }
            else {
                if (program.isTerminated()) {
                    this.resetInternalState();
                }
                else if (program.isRunning() && this.needsNewCommands) {
                    // get delay from operation and convert seconds to internal time unit
                    this.delay = this.scene.getUnitConverter().getTime(program.runNOperations(1000) / 1000);
                }
            }
            var t = this;
            /**
             * Uses `encoder` to reach the values of `endEncoder` by setting the appropriate values
             *
             * @param speedLeft Use magnitude as maximum left speed (can be negative)
             * @param speedRight Use magnitude as maximum right speed (can be negative)
             */
            function useEndEncoder(speedLeft, speedRight) {
                if (t.endEncoder == undefined) {
                    return;
                }
                var encoderDifference = {
                    left: t.endEncoder.left - t.encoder.left,
                    right: t.endEncoder.right - t.encoder.right
                };
                var stopEncoder = Math.abs(encoderDifference.left) < t.endEncoderSettings.maxAngleDifference &&
                    Math.abs(encoderDifference.right) < t.endEncoderSettings.maxAngleDifference &&
                    Math.abs(t.leftDrivingWheel.angularVelocity) < t.endEncoderSettings.maxAngularVelocity &&
                    Math.abs(t.rightDrivingWheel.angularVelocity) < t.endEncoderSettings.maxAngularVelocity;
                if (stopEncoder) {
                    // on end
                    t.endEncoder = undefined;
                    robotBehaviour === null || robotBehaviour === void 0 ? void 0 : robotBehaviour.resetCommands();
                    t.needsNewCommands = true;
                }
                else {
                    var maxDifference = t.endEncoderSettings.maxForceControlEncoderDifference;
                    var dampingFactor = t.endEncoderSettings.encoderAngleDampingFactor;
                    t.leftForce = Utils_1.Utils.continuousSign(encoderDifference.left - t.leftDrivingWheel.angularVelocity * dampingFactor * dt, maxDifference) * Math.abs(speedLeft);
                    t.rightForce = Utils_1.Utils.continuousSign(encoderDifference.right - t.rightDrivingWheel.angularVelocity * dampingFactor * dt, maxDifference) * Math.abs(speedRight);
                }
            }
            var driveData = robotBehaviour === null || robotBehaviour === void 0 ? void 0 : robotBehaviour.drive;
            if (driveData) {
                // handle `driveAction` and `curveAction`
                if (driveData.distance && driveData.speed) {
                    // on start
                    if (this.endEncoder == undefined) {
                        this.needsNewCommands = false;
                        var averageSpeed = 0.5 * (Math.abs(driveData.speed.left) + Math.abs(driveData.speed.right));
                        var driveFactor = 1 / this.calibrationParameters.driveForwardDistanceFactor;
                        this.endEncoder = {
                            left: this.encoder.left + driveData.distance / this.leftDrivingWheel.wheelRadius * driveData.speed.left / averageSpeed * driveFactor,
                            right: this.encoder.right + driveData.distance / this.rightDrivingWheel.wheelRadius * driveData.speed.right / averageSpeed * driveFactor
                        };
                    }
                    useEndEncoder(driveData.speed.left, driveData.speed.right);
                }
                if (driveData.speed && driveData.distance == undefined) {
                    this.leftForce = driveData.speed.left;
                    this.rightForce = driveData.speed.right;
                    robotBehaviour.drive = undefined;
                }
            }
            var rotateData = robotBehaviour === null || robotBehaviour === void 0 ? void 0 : robotBehaviour.rotate;
            if (rotateData) {
                if (rotateData.angle) {
                    if (this.endEncoder == undefined) {
                        this.needsNewCommands = false;
                        /** also wheel distance */
                        var axleLength = Utils_1.Utils.vectorDistance(this.leftDrivingWheel.physicsBody.position, this.rightDrivingWheel.physicsBody.position);
                        var wheelDrivingDistance = rotateData.angle * 0.5 * axleLength;
                        // left rotation for `angle * speed > 0`
                        var rotationFactor = Math.sign(rotateData.speed) / this.calibrationParameters.rotationAngleFactor;
                        this.endEncoder = {
                            left: this.encoder.left - wheelDrivingDistance / this.leftDrivingWheel.wheelRadius * rotationFactor,
                            right: this.encoder.right + wheelDrivingDistance / this.rightDrivingWheel.wheelRadius * rotationFactor
                        };
                    }
                    useEndEncoder(rotateData.speed, rotateData.speed);
                }
                else {
                    var rotationSpeed = Math.abs(rotateData.speed);
                    if (rotateData.rotateLeft) {
                        this.leftForce = -rotationSpeed;
                        this.rightForce = rotationSpeed;
                    }
                    else {
                        this.leftForce = rotationSpeed;
                        this.rightForce = -rotationSpeed;
                    }
                    robotBehaviour.rotate = undefined;
                }
            }
            // update pose
            var motors = robotBehaviour === null || robotBehaviour === void 0 ? void 0 : robotBehaviour.getActionState("motors", true);
            if (motors) {
                var maxForce = true ? 0.01 : interpreter_constants_1.MAXPOWER;
                var left = motors.c;
                if (left !== undefined) {
                    if (left > 100) {
                        left = 100;
                    }
                    else if (left < -100) {
                        left = -100;
                    }
                    this.leftForce = left * maxForce;
                }
                var right = motors.b;
                if (right !== undefined) {
                    if (right > 100) {
                        right = 100;
                    }
                    else if (right < -100) {
                        right = -100;
                    }
                    this.rightForce = right * maxForce;
                }
            }
            if (this.usePseudoWheelPhysics) {
                this.leftForce *= this.pseudoMotorTorqueMultiplier;
                this.rightForce *= this.pseudoMotorTorqueMultiplier;
            }
            this.leftDrivingWheel.applyTorqueFromMotor(ElectricMotor_1.ElectricMotor.EV3(this.scene.unit), this.leftForce);
            this.rightDrivingWheel.applyTorqueFromMotor(ElectricMotor_1.ElectricMotor.EV3(this.scene.unit), this.rightForce);
            // reset internal encoder values if necessary
            var encoder = robotBehaviour === null || robotBehaviour === void 0 ? void 0 : robotBehaviour.getActionState("encoder", true);
            if (encoder) {
                if (encoder.leftReset) {
                    this.encoder.left = 0;
                }
                if (encoder.rightReset) {
                    this.encoder.right = 0;
                }
            }
            // if (this.frontLeft.bumped && this.left > 0) {
            //     tempLeft *= -1;
            // }
            // if (this.backLeft.bumped && this.left < 0) {
            //     tempLeft *= -1;
            // }
            // if (this.frontRight.bumped && this.right > 0) {
            //     tempRight *= -1;
            // }
            // if (this.backRight.bumped && this.right < 0) {
            //     tempRight *= -1;
            // }
            // if (tempRight == tempLeft) {
            //     var moveXY = tempRight * SIM.getDt();
            //     var mX = Math.cos(this.pose.theta) * moveXY;
            //     var mY = Math.sqrt(Math.pow(moveXY, 2) - Math.pow(mX, 2));
            //     this.pose.x += mX;
            //     if (moveXY >= 0) {
            //         if (this.pose.theta < Math.PI) {
            //             this.pose.y += mY;
            //         } else {
            //             this.pose.y -= mY;
            //         }
            //     } else {
            //         if (this.pose.theta > Math.PI) {
            //             this.pose.y += mY;
            //         } else {
            //             this.pose.y -= mY;
            //         }
            //     }
            //     this.pose.thetaDiff = 0;
            // } else {
            //     var R = C.TRACKWIDTH / 2 * ((tempLeft + tempRight) / (tempLeft - tempRight));
            //     var rot = (tempLeft - tempRight) / C.TRACKWIDTH;
            //     var iccX = this.pose.x - (R * Math.sin(this.pose.theta));
            //     var iccY = this.pose.y + (R * Math.cos(this.pose.theta));
            //     this.pose.x = (Math.cos(rot * SIM.getDt()) * (this.pose.x - iccX) - Math.sin(rot * SIM.getDt()) * (this.pose.y - iccY)) + iccX;
            //     this.pose.y = (Math.sin(rot * SIM.getDt()) * (this.pose.x - iccX) + Math.cos(rot * SIM.getDt()) * (this.pose.y - iccY)) + iccY;
            //     this.pose.thetaDiff = rot * SIM.getDt();
            //     this.pose.theta = this.pose.theta + this.pose.thetaDiff;
            // }
            // var sin = Math.sin(this.pose.theta);
            // var cos = Math.cos(this.pose.theta);
            // this.frontRight = this.translate(sin, cos, this.frontRight);
            // this.frontLeft = this.translate(sin, cos, this.frontLeft);
            // this.backRight = this.translate(sin, cos, this.backRight);
            // this.backLeft = this.translate(sin, cos, this.backLeft);
            // this.backMiddle = this.translate(sin, cos, this.backMiddle);
            // for (var s in this.touchSensor) {
            //     this.touchSensor[s] = this.translate(sin, cos, this.touchSensor[s]);
            // }
            // for (var s in this.colorSensor) {
            //     this.colorSensor[s] = this.translate(sin, cos, this.colorSensor[s]);
            // }
            // for (var s in this.ultraSensor) {
            //     this.ultraSensor[s] = this.translate(sin, cos, this.ultraSensor[s]);
            // }
            // this.mouse = this.translate(sin, cos, this.mouse);
            // for (var s in this.touchSensor) {
            //     this.touchSensor[s].x1 = this.frontRight.rx;
            //     this.touchSensor[s].y1 = this.frontRight.ry;
            //     this.touchSensor[s].x2 = this.frontLeft.rx;
            //     this.touchSensor[s].y2 = this.frontLeft.ry;
            // }
            //update led(s)
            // var led = this.robotBehaviour.getActionState("led", true);
            // if (led) {
            //     var color = led.color;
            //     var mode = led.mode;
            //     if (color) {
            //         this.led.color = color.toUpperCase();
            //         this.led.blinkColor = color.toUpperCase();
            //     }
            //     switch (mode) {
            //         case C.OFF:
            //             this.led.timer = 0;
            //             this.led.blink = 0;
            //             this.led.color = 'LIGHTGRAY';
            //             break;
            //         case C.ON:
            //             this.led.timer = 0;
            //             this.led.blink = 0;
            //             break;
            //         case C.FLASH:
            //             this.led.blink = 2;
            //             break;
            //         case C.DOUBLE_FLASH:
            //             this.led.blink = 4;
            //             break;
            //     }
            // }
            // if (this.led.blink > 0) {
            //     if (this.led.timer > 0.5 && this.led.blink == 2) {
            //         this.led.color = this.led.blinkColor;
            //     } else if (this.led.blink == 4 && (this.led.timer > 0.5 && this.led.timer < 0.67 || this.led.timer > 0.83)) {
            //         this.led.color = this.led.blinkColor;
            //     } else {
            //         this.led.color = 'LIGHTGRAY';
            //     }
            //     this.led.timer += SIM.getDt();
            //     if (this.led.timer > 1.0) {
            //         this.led.timer = 0;
            //     }
            // }
            // $("#led" + this.id).attr("fill", "url('#" + this.led.color + this.id + "')");
            // update display
            // var display = this.robotBehaviour.getActionState("display", true);
            // if (display) {
            //     var text = display.text;
            //     var x = display.x;
            //     var y = display.y;
            //     if (text) {
            //         $("#display" + this.id).html($("#display" + this.id).html() + '<text x=' + x * 10 + ' y=' + (y + 1) * 16 + '>' + text + '</text>');
            //     }
            //     if (display.picture) {
            //         $("#display" + this.id).html(this.display[display.picture]);
            //     }
            //     if (display.clear) {
            //         $("#display" + this.id).html('');
            //     }
            // }
            // update tone
            // var volume = this.robotBehaviour.getActionState("volume", true);
            // if ((volume || volume === 0) && this.webAudio.context) {
            //     this.webAudio.volume = volume / 100.0;
            // }
            // var tone = this.robotBehaviour.getActionState("tone", true);
            // if (tone && this.webAudio.context) {
            //     var cT = this.webAudio.context.currentTime;
            //     if (tone.frequency && tone.duration > 0) {
            //         var oscillator = this.webAudio.context.createOscillator();
            //         oscillator.type = 'square';
            //         oscillator.connect(this.webAudio.context.destination);
            //         var that = this;
            //         function oscillatorFinish() {
            //             that.tone.finished = true;
            //             oscillator.disconnect(that.webAudio.context.destination);
            //             delete oscillator;
            //         }
            //         oscillator.onended = function(e) {
            //             oscillatorFinish();
            //         };
            //         oscillator.frequency.value = tone.frequency;
            //         oscillator.start(cT);
            //         oscillator.stop(cT + tone.duration / 1000.0);
            //     }
            //     if (tone.file !== undefined) {
            //         this.tone.file[tone.file](this.webAudio);
            //     }
            // }
            // update sayText
            // this.sayText.language = GUISTATE_C.getLanguage(); // reset language
            // var language = this.robotBehaviour.getActionState("language", true);
            // if (language !== null && language !== undefined && window.speechSynthesis) {
            //     this.sayText.language = language;
            // }
            // var sayText = this.robotBehaviour.getActionState("sayText", true);
            // if (sayText && window.speechSynthesis) {
            //     if (sayText.text !== undefined) {
            //         this.sayText.say(sayText.text, this.sayText.language, sayText.speed, sayText.pitch);
            //     }
            // }
            // update timer
            // var timer = this.robotBehaviour.getActionState("timer", false);
            // if (timer) {
            //     for (var key in timer) {
            //         if (timer[key] == 'reset') {
            //             this.timer[key] = 0;
            //         }
            //     }
            // }
        };
        ;
        Robot.prototype.addHTMLSensorValuesTo = function (list) {
            var e_2, _a, e_3, _b, e_4, _c, e_5, _d, e_6, _e;
            var _f, _g, _h, _j;
            var s = this.scene;
            var appendAny = function (label, value) { list.push({ label: label, value: value }); };
            var append = function (label, value, end) {
                list.push({ label: label, value: Math.round(value * 1000000) / 1000000 + (end !== null && end !== void 0 ? end : "") });
            };
            append("Robot X", this.body.position.x);
            append("Robot Y", this.body.position.y);
            append("Robot θ", this.body.angle * 180 / Math.PI, "°");
            try {
                for (var _k = __values(this.programManager.getPrograms()), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var program = _l.value;
                    var sensors = program.instruction.getHardwareStateSensors();
                    append("Motor left", Utils_1.Utils.toDegrees((_g = (_f = sensors.encoder) === null || _f === void 0 ? void 0 : _f.left) !== null && _g !== void 0 ? _g : 0), "°");
                    append("Motor right", Utils_1.Utils.toDegrees((_j = (_h = sensors.encoder) === null || _h === void 0 ? void 0 : _h.right) !== null && _j !== void 0 ? _j : 0), "°");
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_a = _k.return)) _a.call(_k);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                for (var _m = __values(this.touchSensors), _o = _m.next(); !_o.done; _o = _m.next()) {
                    var _p = __read(_o.value, 2), port = _p[0], touchSensor = _p[1];
                    appendAny("Touch Sensor " + port, touchSensor.getIsTouched());
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_o && !_o.done && (_b = _m.return)) _b.call(_m);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var _q = __values(this.colorSensors), _r = _q.next(); !_r.done; _r = _q.next()) {
                    var _s = __read(_r.value, 2), port = _s[0], colorSensor = _s[1];
                    append("Light Sensor " + port, colorSensor.getDetectedBrightness() * 100, "%");
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_r && !_r.done && (_c = _q.return)) _c.call(_q);
                }
                finally { if (e_4) throw e_4.error; }
            }
            try {
                for (var _t = __values(this.colorSensors), _u = _t.next(); !_u.done; _u = _t.next()) {
                    var _v = __read(_u.value, 2), port = _v[0], colorSensor = _v[1];
                    appendAny("Color Sensor " + port, "<span style=\"width: 20px; background-color:" + colorSensor.getColorHexValueString() + "\">&nbsp;</span>");
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_u && !_u.done && (_d = _t.return)) _d.call(_t);
                }
                finally { if (e_5) throw e_5.error; }
            }
            try {
                for (var _w = __values(this.ultrasonicSensors), _x = _w.next(); !_x.done; _x = _w.next()) {
                    var _y = __read(_x.value, 2), port = _y[0], ultrasonicSensor = _y[1];
                    append("Ultra Sensor " + port, 100 * s.unit.fromLength(ultrasonicSensor.getMeasuredDistance()), "cm");
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_x && !_x.done && (_e = _w.return)) _e.call(_w);
                }
                finally { if (e_6) throw e_6.error; }
            }
        };
        /**
         * Returns the absolute position relative to `this.body`
         */
        Robot.prototype.getAbsolutePosition = function (relativePosition) {
            return Utils_1.Utils.vectorAdd(this.body.position, matter_js_1.Vector.rotate(relativePosition, this.body.angle));
        };
        Robot.prototype.updateRobotBehaviourHardwareStateSensors = function (program) {
            var e_7, _a, e_8, _b, e_9, _c, e_10, _d;
            var _e, _f;
            var robotBehaviour = program.instruction;
            var sensors = robotBehaviour.getHardwareStateSensors();
            // encoder
            sensors.encoder = {
                left: this.encoder.left,
                right: this.encoder.right
            };
            // gyo sensor
            // Note: OpenRoberta has a bug for the gyro.rate where they calculate it by
            // angleDifference * timeDifference but it should be angleDifference / timeDifference
            var gyroData = (_e = sensors.gyro) !== null && _e !== void 0 ? _e : {};
            var gyroRate = Utils_1.Utils.toDegrees(this.body.angularVelocity);
            var gyroAngleDifference = Utils_1.Utils.toDegrees(this.body.angle - this.body.anglePrev);
            var dt = this.scene.getDT();
            try {
                for (var _g = __values(this.gyroSensors), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var _j = __read(_h.value, 2), port = _j[0], gyroSensor = _j[1];
                    var referenceAngle = (_f = robotBehaviour.getGyroReferenceAngle(port)) !== null && _f !== void 0 ? _f : 0;
                    var angle = Utils_1.Utils.toDegrees(this.body.angle);
                    gyroSensor.update(angle, referenceAngle, dt);
                    // gyroData uses the 'true' angle instead of '' since the referenceAngle/"angleReset" is used
                    // in 'RobotSimBehaviour.getSensorValue'
                    gyroData[port] = {
                        angle: angle,
                        rate: gyroRate
                    };
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_a = _g.return)) _a.call(_g);
                }
                finally { if (e_7) throw e_7.error; }
            }
            sensors.gyro = gyroData;
            var robotBodies = this.getTouchSensors().map(function (touchSensor) { return touchSensor.getPhysicsBody(); })
                .concat(this.physicsWheelsList, this.body);
            // color
            if (!sensors.color) {
                sensors.color = {};
            }
            try {
                for (var _k = __values(this.colorSensors), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var _m = __read(_l.value, 2), port = _m[0], colorSensor = _m[1];
                    var colorSensorPosition = this.getAbsolutePosition(colorSensor.position);
                    // the color array might be of length 4 or 16 (rgba with image size 1x1 or 2x2)
                    var color = this.scene.getContainers().getGroundImageData(colorSensorPosition.x, colorSensorPosition.y, 1, 1);
                    var r = color[0], g = color[1], b = color[2];
                    colorSensor.setDetectedColor(r, g, b, this.updateSensorGraphics);
                    var hsv = (0, Color_1.rgbToHsv)(r, g, b);
                    var colour = (0, Color_1.hsvToColorName)(hsv);
                    sensors.color[port] = {
                        ambientlight: 0,
                        colorValue: colour,
                        colour: colour,
                        light: ((r + g + b) / 3 / 2.55),
                        rgb: [r, g, b]
                    };
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_b = _k.return)) _b.call(_k);
                }
                finally { if (e_8) throw e_8.error; }
            }
            var allBodies = this.scene.getAllPhysicsBodies();
            // ultrasonic sensor
            if (!sensors.ultrasonic) {
                sensors.ultrasonic = {};
            }
            if (!sensors.infrared) {
                sensors.infrared = {};
            }
            var _loop_1 = function (port, ultrasonicSensor) {
                var sensorPosition = this_1.getAbsolutePosition(ultrasonicSensor.position);
                var ultrasonicDistance = void 0;
                var nearestPoint;
                if (BodyHelper_1.BodyHelper.someBodyContains(sensorPosition, allBodies, robotBodies)) {
                    ultrasonicDistance = 0;
                }
                else {
                    var halfAngle = ultrasonicSensor.angularRange / 2;
                    var angle = ultrasonicSensor.angle;
                    var rays = [
                        matter_js_1.Vector.rotate(matter_js_1.Vector.create(1, 0), angle + halfAngle + this_1.body.angle),
                        matter_js_1.Vector.rotate(matter_js_1.Vector.create(1, 0), angle - halfAngle + this_1.body.angle)
                    ]
                        .map(function (v) { return new Ray_1.Ray(sensorPosition, v); });
                    // (point - sensorPos) * vec > 0
                    var vectors_1 = rays.map(function (r) { return matter_js_1.Vector.perp(r.directionVector); });
                    var dotProducts_1 = vectors_1.map(function (v) { return matter_js_1.Vector.dot(v, sensorPosition); });
                    nearestPoint = BodyHelper_1.BodyHelper.getNearestPointTo(sensorPosition, allBodies, robotBodies, function (point) {
                        return matter_js_1.Vector.dot(point, vectors_1[0]) < dotProducts_1[0]
                            && matter_js_1.Vector.dot(point, vectors_1[1]) > dotProducts_1[1];
                    });
                    var minDistanceSquared_1 = nearestPoint ? Utils_1.Utils.vectorDistanceSquared(nearestPoint, sensorPosition) : Infinity;
                    var intersectionPoints = BodyHelper_1.BodyHelper.intersectionPointsWithLine(rays[0], allBodies, robotBodies).concat(BodyHelper_1.BodyHelper.intersectionPointsWithLine(rays[1], allBodies, robotBodies));
                    intersectionPoints.forEach(function (intersectionPoint) {
                        var distanceSquared = Utils_1.Utils.vectorDistanceSquared(intersectionPoint, sensorPosition);
                        if (distanceSquared < minDistanceSquared_1) {
                            minDistanceSquared_1 = distanceSquared;
                            nearestPoint = intersectionPoint;
                        }
                    });
                    ultrasonicDistance = nearestPoint ? Utils_1.Utils.vectorDistance(nearestPoint, sensorPosition) : Infinity;
                }
                ultrasonicSensor.setMeasuredDistance(ultrasonicDistance, this_1.updateSensorGraphics);
                if (this_1.updateSensorGraphics) {
                    // update nearestPoint
                    if (nearestPoint != undefined) {
                        if (!this_1.debugGraphics) {
                            this_1.debugGraphics = new PIXI.Graphics()
                                .beginFill(0xFF0000)
                                .drawRect(-5, -5, 10, 10)
                                .endFill();
                            this_1.bodyContainer.parent.addChild(this_1.debugGraphics);
                        }
                        this_1.debugGraphics.position.set(nearestPoint.x, nearestPoint.y);
                        this_1.debugGraphics.visible = ultrasonicDistance <= ultrasonicSensor.maximumMeasurableDistance;
                    }
                    else if (this_1.debugGraphics != undefined) {
                        this_1.debugGraphics.visible = false;
                    }
                }
                ultrasonicDistance = this_1.scene.unit.fromLength(ultrasonicDistance);
                sensors.ultrasonic[port] = {
                    // `distance` is in cm
                    distance: Math.min(ultrasonicDistance, ultrasonicSensor.maximumMeasurableDistance) * 100,
                    presence: false
                };
                // infrared sensor (use ultrasonic distance)
                sensors.infrared[port] = {
                    // `distance` is in cm and at maximum 70cm
                    distance: Math.min(ultrasonicDistance, 0.7) * 100,
                    presence: false
                };
            };
            var this_1 = this;
            try {
                for (var _o = __values(this.ultrasonicSensors), _p = _o.next(); !_p.done; _p = _o.next()) {
                    var _q = __read(_p.value, 2), port = _q[0], ultrasonicSensor = _q[1];
                    _loop_1(port, ultrasonicSensor);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_p && !_p.done && (_c = _o.return)) _c.call(_o);
                }
                finally { if (e_9) throw e_9.error; }
            }
            // touch sensor
            if (!sensors.touch) {
                sensors.touch = {};
            }
            try {
                for (var _r = __values(this.touchSensors), _s = _r.next(); !_s.done; _s = _r.next()) {
                    var _t = __read(_s.value, 2), port = _t[0], touchSensor = _t[1];
                    touchSensor.setIsTouched(BodyHelper_1.BodyHelper.bodyIntersectsOther(touchSensor.physicsBody, allBodies));
                    sensors.touch[port] = touchSensor.getIsTouched();
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_s && !_s.done && (_d = _r.return)) _d.call(_r);
                }
                finally { if (e_10) throw e_10.error; }
            }
        };
        /**
         * LEGO EV3 like robot with 2 main wheels and one with less friction (e.g. swivel wheel)
         *
         * @param scale scale of the robot
         */
        Robot.default = function (scene, scale) {
            if (scale === void 0) { scale = 1; }
            var frontWheel = Wheel_1.Wheel.create(scene, 27 * scale, 0, 10 * scale, 10 * scale);
            frontWheel.slideFriction = 0.1;
            frontWheel.rollingFriction = 0.0;
            return new Robot({
                scene: scene,
                body: Entity_1.PhysicsRectEntity.createWithContainer(scene, 0, 0, 40 * scale, 30 * scale),
                leftDrivingWheel: Wheel_1.Wheel.create(scene, -0, -22 * scale, 20 * scale, 10 * scale),
                rightDrivingWheel: Wheel_1.Wheel.create(scene, -0, 22 * scale, 20 * scale, 10 * scale),
                otherWheels: [
                    frontWheel
                ]
            });
        };
        /**
         * Long robot with 4 wheels
         */
        Robot.default2 = function (scene) {
            return new Robot({
                scene: scene,
                body: Entity_1.PhysicsRectEntity.createWithContainer(scene, 0, 0, 40, 30),
                leftDrivingWheel: Wheel_1.Wheel.create(scene, -50, -20, 20, 10),
                rightDrivingWheel: Wheel_1.Wheel.create(scene, -50, 20, 20, 10),
                otherWheels: [
                    Wheel_1.Wheel.create(scene, 50, -15, 20, 10),
                    Wheel_1.Wheel.create(scene, 50, 15, 20, 10)
                ]
            });
        };
        // TODO: Use real robot parameters
        /**
         * Similar to the EV3 LEGO robot
         *
         * Real dimensions:
         * - brick: (xSize: 0.11m, ySize: 0.072m, mass: 0.268kg)
         * - wheel: (diameter: 0.043m, width: 0.022m, mass: 0.013kg, rollingFriction: 1.1°, slideFriction: 47.3°)
         * - motor: (mass: 0.080kg)
         * - 100% speed: (1m ca. 3.19s)
         * - total mass: 0.611kg
         */
        Robot.EV3 = function (scene) {
            var wheel = { diameter: 0.05, width: 0.02 };
            // TODO: Constraints are broken, if the front wheel has less mass (front wheel mass may be 0.030)
            var backWheel = Wheel_1.Wheel.create(scene, -0.09, 0, wheel.width, wheel.width, 0.30);
            backWheel.slideFriction = 0.05;
            backWheel.rollingFriction = 0.03;
            var robotBody = Entity_1.PhysicsRectEntity.createWithContainer(scene, 0, 0, 0.15, 0.10, { color: 0xf97306, strokeColor: 0xffffff, strokeWidth: 1, strokeAlpha: 0.5, strokeAlignment: 1 });
            matter_js_1.Body.setMass(robotBody.getPhysicsBody(), scene.unit.getMass(0.300));
            var robot = new Robot({
                scene: scene,
                body: robotBody,
                leftDrivingWheel: Wheel_1.Wheel.create(scene, 0, -0.07, wheel.diameter, wheel.width, 0.050),
                rightDrivingWheel: Wheel_1.Wheel.create(scene, 0, 0.07, wheel.diameter, wheel.width, 0.050),
                otherWheels: [
                    backWheel
                ]
            });
            robot.addLED(new RobotLED_1.RobotLED(scene.unit, { x: 0, y: 0 }, 0.01));
            return robot;
        };
        Robot.realPhysicsCalibrationParameters = {
            /**
             * Works for all speeds with an error of ±1.2%
             */
            rotationAngleFactor: 0.6333,
            /**
             * Valid for motor force below 84%. At 100% the error is about 10%.
             */
            driveForwardDistanceFactor: 0.76
        };
        return Robot;
    }());
    exports.Robot = Robot;
    /**
     * Damped spring constraint.
     */
    var CustomConstraint = /** @class */ (function () {
        function CustomConstraint(bodyA, bodyB, positionA, positionB, options) {
            this.bodyA = bodyA;
            this.bodyB = bodyB;
            this.positionA = positionA;
            this.positionB = positionB;
            this.angleA = bodyA.angle;
            this.angleB = bodyB.angle;
            this.length = options.length || 0;
            this.angularFrequency = options.angularFrequency || 1;
            this.damping = options.damping || 1;
        }
        CustomConstraint.prototype.update = function () {
            var rotatedPositionA = matter_js_1.Vector.rotate(this.positionA, this.bodyA.angle - this.angleA);
            var rotatedPositionB = matter_js_1.Vector.rotate(this.positionB, this.bodyB.angle - this.angleB);
            /** positionA in world space */
            var pointA = Utils_1.Utils.vectorAdd(this.bodyA.position, rotatedPositionA);
            /** positionB in world space */
            var pointB = Utils_1.Utils.vectorAdd(this.bodyB.position, rotatedPositionB);
            var relativePosition = Utils_1.Utils.vectorSub(pointB, pointA);
            var length = matter_js_1.Vector.magnitude(relativePosition);
            var unitRelativePosition = matter_js_1.Vector.mult(relativePosition, 1 / (length > 0 ? length : 1e-10));
            var lengthDelta = length - this.length;
            /** velocity of positionA in world space */
            var velocityA = Utils_1.Utils.vectorAdd(this.bodyA.velocity, matter_js_1.Vector.mult(matter_js_1.Vector.perp(rotatedPositionA), this.bodyA.angularVelocity));
            /** velocity of positionB in world space */
            var velocityB = Utils_1.Utils.vectorAdd(this.bodyB.velocity, matter_js_1.Vector.mult(matter_js_1.Vector.perp(rotatedPositionB), this.bodyB.angularVelocity));
            var relativeVelocity = Utils_1.Utils.vectorSub(velocityB, velocityA);
            var velocity = matter_js_1.Vector.dot(unitRelativePosition, relativeVelocity);
            // see Wikipedia https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator
            var acceleration = -this.angularFrequency * (this.angularFrequency * lengthDelta + 2 * this.damping * velocity);
            var accelerationVec = matter_js_1.Vector.mult(unitRelativePosition, acceleration);
            var mass = 1 / (this.bodyA.inverseMass + this.bodyB.inverseMass);
            var forceVec = matter_js_1.Vector.mult(accelerationVec, mass);
            matter_js_1.Body.applyForce(this.bodyA, pointA, matter_js_1.Vector.neg(forceVec));
            matter_js_1.Body.applyForce(this.bodyB, pointB, forceVec);
        };
        return CustomConstraint;
    }());
});
