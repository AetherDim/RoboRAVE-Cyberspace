define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ColorSensor = void 0;
    var ColorSensor = /** @class */ (function () {
        /**
         * Creates a new color sensor.
         *
         * @param position Position relative to the robot position in meter
         */
        function ColorSensor(unit, position) {
            /**
             * The color which is detected below the color sensor
             */
            this.detectedColor = { red: 0, green: 0, blue: 0 };
            this.graphics = new PIXI.Graphics();
            this.position = unit.getPosition(position);
            this.updateGraphics();
        }
        /**
         * Returns the color in rgb values from 0 to 255
         */
        ColorSensor.prototype.getDetectedColor = function () {
            return this.detectedColor;
        };
        /**
         * Returns the brightness as a value from 0 to 1
         */
        ColorSensor.prototype.getDetectedBrightness = function () {
            return (this.detectedColor.red + this.detectedColor.green + this.detectedColor.blue) / 3 / 255;
        };
        /**
         * Sets the `detectedColor` and updates its graphics
         *
         * @param r red color value
         * @param g green color value
         * @param b blue color value
         */
        ColorSensor.prototype.setDetectedColor = function (r, g, b, updateGraphics) {
            if (updateGraphics === void 0) { updateGraphics = true; }
            var isDifferentColor = this.detectedColor.red != r || this.detectedColor.green != g || this.detectedColor.blue != b;
            this.detectedColor = { red: r, green: g, blue: b };
            if (updateGraphics && isDifferentColor) {
                this.updateGraphics();
            }
        };
        ColorSensor.prototype.updateGraphics = function () {
            var color = this.detectedColor;
            this.graphics
                .clear()
                .beginFill((color.red * 256 + color.green) * 256 + color.blue)
                .lineStyle(1, 0) // black border
                // pixi.js needs more performance if 'drawCircle' is used
                //.drawRect(-6, -6, 12, 12)
                .drawCircle(0, 0, 6)
                .endFill();
            this.graphics.position.set(this.position.x, this.position.y);
        };
        ColorSensor.prototype.removeGraphicsFromParent = function () {
            this.graphics.parent.removeChild(this.graphics);
        };
        /**
         * Removes the graphics from parent and destroys it
         */
        ColorSensor.prototype.destroy = function () {
            this.removeGraphicsFromParent();
            this.graphics.destroy();
        };
        return ColorSensor;
    }());
    exports.ColorSensor = ColorSensor;
});
