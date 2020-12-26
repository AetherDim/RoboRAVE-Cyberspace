define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ElectricMotor = void 0;
    var ElectricMotor = /** @class */ (function () {
        function ElectricMotor(maxRPM, maxTorque) {
            this.maxTorque = maxTorque;
            this.maxAngularVelocity = maxRPM * Math.PI * 2;
        }
        ElectricMotor.prototype.getMaxRPM = function () {
            return this.maxAngularVelocity / (Math.PI * 2);
        };
        ElectricMotor.prototype.getAbsTorqueForAngularVelocity = function (angularVelocity) {
            var absAngularVelocity = Math.abs(angularVelocity);
            if (absAngularVelocity >= this.maxAngularVelocity) {
                return 0;
            }
            return this.maxTorque * (1 - absAngularVelocity / this.maxAngularVelocity);
        };
        /**
         * A Lego EV3 motor.
         *
         * The data was taken from a plot on https://www.philohome.com/motors/motorcomp.htm (EV3 Large).
         */
        ElectricMotor.EV3 = function () {
            return new ElectricMotor(170, 0.43);
        };
        return ElectricMotor;
    }());
    exports.ElectricMotor = ElectricMotor;
});
