define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RobotTester = void 0;
    var RobotTester = /** @class */ (function () {
        function RobotTester(robot) {
            this.robot = robot;
        }
        RobotTester.prototype.setWheelFriction = function (wheel, friction) {
            wheel.rollingFriction = friction.rollingFriction;
            wheel.slideFriction = friction.slideFriction;
        };
        RobotTester.prototype.setWheelsFriction = function (options) {
            var _this = this;
            this.setWheelFriction(this.robot.leftDrivingWheel, options.driveWheels);
            this.setWheelFriction(this.robot.rightDrivingWheel, options.driveWheels);
            var t = this;
            this.robot.wheelsList.forEach(function (wheel) {
                if (wheel !== _this.robot.leftDrivingWheel && wheel !== _this.robot.rightDrivingWheel) {
                    _this.setWheelFriction(wheel, options.otherWheels);
                }
            });
        };
        RobotTester.prototype.setWheelsPseudoPhysicsParameters = function (options) {
            var _this = this;
            this.robot.wheelsList.forEach(function (wheel) {
                if (wheel !== _this.robot.leftDrivingWheel && wheel !== _this.robot.rightDrivingWheel) {
                    wheel.pseudoRollingFriction = options.otherWheels.rollingFriction;
                    wheel.slideFriction = options.otherWheels.slideFriction;
                }
                else {
                    wheel.slideFriction = options.driveWheels.slideFriction;
                    wheel.slideFriction = options.driveWheels.slideFriction;
                }
            });
        };
        return RobotTester;
    }());
    exports.RobotTester = RobotTester;
});
