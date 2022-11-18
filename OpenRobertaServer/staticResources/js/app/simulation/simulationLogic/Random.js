define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.randomWeightedBool = exports.randomBool = exports.randomIntBetween = void 0;
    /**
     *
     * @param start Start number (has to be an integer)
     * @param end End number (has to be an integer)
     * @returns A random integer in the interval `[start, end]`
     * @note If the interval `[start, end]` is empty or `start` or `end` is not an integer it logs an assert
     */
    function randomIntBetween(start, end) {
        console.assert(start <= end);
        console.assert(start == Math.floor(start));
        console.assert(end == Math.floor(end));
        return Math.floor(Math.random() * (end - start + 1)) + start;
    }
    exports.randomIntBetween = randomIntBetween;
    function randomBool() {
        return Math.random() >= 0.5;
    }
    exports.randomBool = randomBool;
    function randomWeightedBool(a, b) {
        return Math.random() < a / (a + b);
    }
    exports.randomWeightedBool = randomWeightedBool;
});
