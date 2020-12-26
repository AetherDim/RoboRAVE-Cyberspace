define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.COLOR_MAP_XKCD = exports.ColorPalette = exports.Color = exports.rgbToNumber = void 0;
    // https://stackoverflow.com/questions/13070054/convert-rgb-strings-to-hex-in-javascript
    function rgbToNumber(rgb) {
        var raw = rgb.split("(")[1].split(")")[0];
        var numbers = raw.split(',');
        var hexnumber = '0x' + parseInt(numbers[0]).toString(16) + parseInt(numbers[1]).toString(16) + parseInt(numbers[2]).toString(16);
        return parseInt(hexnumber, 16);
    }
    exports.rgbToNumber = rgbToNumber;
    var Color = /** @class */ (function () {
        function Color(color, name) {
            this.name = name;
            this.color = color;
        }
        Color.prototype.toInt = function () {
            return parseInt(this.color.slice(1), 16);
        };
        return Color;
    }());
    exports.Color = Color;
    var ColorPalette = /** @class */ (function () {
        function ColorPalette(colors) {
            if (colors === void 0) { colors = exports.COLOR_MAP_XKCD; }
            this.index = -1; // start at 0
            this.colors = colors;
        }
        ColorPalette.prototype.next = function () {
            this.index++;
            if (this.index >= this.colors.length) {
                this.index = 0;
            }
            return this.colors[this.index];
        };
        return ColorPalette;
    }());
    exports.ColorPalette = ColorPalette;
    // https://blog.xkcd.com/2010/05/03/color-survey-results/
    // https://xkcd.com/color/rgb/   <- first 48 values
    exports.COLOR_MAP_XKCD = [
        { name: 'purple', color: '#7e1e9c' },
        { name: 'green', color: '#15b01a' },
        { name: 'blue', color: '#0343df' },
        { name: 'pink', color: '#ff81c0' },
        { name: 'brown', color: '#653700' },
        { name: 'red', color: '#e50000' },
        { name: 'light blue', color: '#95d0fc' },
        { name: 'teal', color: '#029386' },
        { name: 'orange', color: '#f97306' },
        { name: 'light green', color: '#96f97b' },
        { name: 'magenta', color: '#c20078' },
        { name: 'yellow', color: '#ffff14' },
        { name: 'sky blue', color: '#75bbfd' },
        { name: 'grey', color: '#929591' },
        { name: 'lime green', color: '#89fe05' },
        { name: 'light purple', color: '#bf77f6' },
        { name: 'violet', color: '#9a0eea' },
        { name: 'dark green', color: '#033500' },
        { name: 'turquoise', color: '#06c2ac' },
        { name: 'lavender', color: '#c79fef' },
        { name: 'dark blue', color: '#00035b' },
        { name: 'tan', color: '#d1b26f' },
        { name: 'cyan', color: '#00ffff' },
        { name: 'aqua', color: '#13eac9' },
        { name: 'forest green', color: '#06470c' },
        { name: 'mauve', color: '#ae7181' },
        { name: 'dark purple', color: '#35063e' },
        { name: 'bright green', color: '#01ff07' },
        { name: 'maroon', color: '#650021' },
        { name: 'olive', color: '#6e750e' },
        { name: 'salmon', color: '#ff796c' },
        { name: 'beige', color: '#e6daa6' },
        { name: 'royal blue', color: '#0504aa' },
        { name: 'navy blue', color: '#001146' },
        { name: 'lilac', color: '#cea2fd' },
        { name: 'black', color: '#000000' },
        { name: 'hot pink', color: '#ff028d' },
        { name: 'light brown', color: '#ad8150' },
        { name: 'pale green', color: '#c7fdb5' },
        { name: 'peach', color: '#ffb07c' },
        { name: 'olive green', color: '#677a04' },
        { name: 'dark pink', color: '#cb416b' }
    ].map(function (c) { return new Color(c.color, c.name); });
});
