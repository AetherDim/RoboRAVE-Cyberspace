define(["require", "exports", "../Utils"], function (require, exports, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RobotProgramGenerator = void 0;
    var RobotProgramGenerator = /** @class */ (function () {
        function RobotProgramGenerator() {
        }
        RobotProgramGenerator.generateProgram = function (operations, addStopOpCodes) {
            if (addStopOpCodes === void 0) { addStopOpCodes = true; }
            var additionalCodes = addStopOpCodes ? RobotProgramGenerator.programStopOpCodes() : [];
            return {
                javaScriptProgram: JSON.stringify({ "ops": Utils_1.Utils.flattenArray(operations.concat(additionalCodes)) }, undefined, "\t")
            };
        };
        RobotProgramGenerator.programStopOpCodes = function () {
            return [{
                    "opc": "stop",
                }];
        };
        /**
         * @param speed from 0 to 100 (in %)
         * @param distance in meters
         */
        RobotProgramGenerator.driveForwardOpCodes = function (speed, distance) {
            var uuidExpr1 = Utils_1.Utils.genUid();
            var uuidExpr2 = Utils_1.Utils.genUid();
            var uuidDriveAction = Utils_1.Utils.genUid();
            return [
                {
                    "opc": "expr",
                    "expr": "NUM_CONST",
                    "+": [
                        uuidExpr1
                    ],
                    // speed
                    "value": speed.toString()
                },
                {
                    "opc": "expr",
                    "expr": "NUM_CONST",
                    "+": [
                        uuidExpr2
                    ],
                    "-": [
                        uuidExpr1
                    ],
                    // distance
                    "value": (distance * 100).toString()
                },
                {
                    "opc": "DriveAction",
                    "speedOnly": false,
                    "SetTime": false,
                    "name": "ev3",
                    "+": [
                        uuidDriveAction
                    ],
                    // forward/backward
                    "driveDirection": "FOREWARD",
                    "-": [
                        uuidExpr2
                    ]
                },
                {
                    "opc": "stopDrive",
                    "name": "ev3",
                    "-": [
                        uuidDriveAction
                    ]
                }
            ];
        };
        /**
         * @param speed from 0 to 100 (in %)
         * @param angle in degree
         */
        RobotProgramGenerator.rotateOpCodes = function (speed, angle, right) {
            var uuidExpr1 = Utils_1.Utils.genUid();
            var uuidExpr2 = Utils_1.Utils.genUid();
            var uuidRotateAction = Utils_1.Utils.genUid();
            var dir = right ? 'right' : 'left';
            return [
                {
                    "opc": "expr",
                    "expr": "NUM_CONST",
                    "+": [
                        uuidExpr1
                    ],
                    "value": speed.toString()
                },
                {
                    "opc": "expr",
                    "expr": "NUM_CONST",
                    "+": [
                        uuidExpr2
                    ],
                    "-": [
                        uuidExpr1
                    ],
                    "value": angle.toString()
                },
                {
                    "opc": "TurnAction",
                    "speedOnly": false,
                    "turnDirection": dir,
                    "SetTime": false,
                    "name": "ev3",
                    "+": [
                        uuidRotateAction
                    ],
                    "-": [
                        uuidExpr2
                    ]
                },
                {
                    "opc": "stopDrive",
                    "name": "ev3",
                    "-": [
                        uuidRotateAction
                    ]
                }
            ];
        };
        return RobotProgramGenerator;
    }());
    exports.RobotProgramGenerator = RobotProgramGenerator;
});
