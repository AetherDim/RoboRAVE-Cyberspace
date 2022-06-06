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
define(["require", "exports", "./Random"], function (require, exports, Random_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Utils = exports.asUniqueArray = void 0;
    var asUniqueArray = function (a) { return a; };
    exports.asUniqueArray = asUniqueArray;
    function applyRestrictedKey(type, key) {
        return type[key];
    }
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.safeIndexing = function (value, index) {
            if (value == undefined) {
                return undefined;
            }
            else {
                return value[index];
            }
        };
        /**
         * Equality into the object.
         *
         * @see https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects
         */
        Utils.deepEqual = function (x, y) {
            return (x && y && typeof x === 'object' && typeof y === 'object') ?
                (Object.keys(x).length === Object.keys(y).length) &&
                    Object.keys(x).reduce(function (isEqual, key) {
                        return isEqual && Utils.deepEqual(x[key], y[key]);
                    }, true) : (x === y);
        };
        /**
         * Returns an array of numbers starting from 'start' to (inclusive) 'end' with a step size 'step'
         *
         * @param start inclusive start of range
         * @param end inclusive end of range
         * @param step the step size of the range
         */
        Utils.closedRange = function (start, end, step) {
            if (step === void 0) { step = 1; }
            var ans = [];
            for (var i = start; i <= end; i += step) {
                ans.push(i);
            }
            return ans;
        };
        /**
         * Returns an array of numbers starting from 'start' to (exclusive) 'end' with a step size 'step'
         *
         * @param start inclusive start of range
         * @param end exclusive end of range
         * @param step the step size of the range
         */
        Utils.range = function (start, end, step) {
            if (step === void 0) { step = 1; }
            var ans = [];
            for (var i = start; i < end; i += step) {
                ans.push(i);
            }
            return ans;
        };
        /**
         * Convert radians to degrees
         */
        Utils.toDegrees = function (radians) {
            return radians / Math.PI * 180;
        };
        /**
         * Convert degrees to radians
         */
        Utils.toRadians = function (degrees) {
            return degrees / 180 * Math.PI;
        };
        /**
         * Returns `sign(x)` if `abs(x) <= width` otherwise `x/width`.
         *
         * @param x the number
         * @param width the width of the linear region
         */
        Utils.continuousSign = function (x, width) {
            if (Math.abs(x) >= width) {
                return Math.sign(x);
            }
            return x / width;
        };
        /**
         * Use this function in the `default` block of a `switch` to check that `value` is of type `never` i.e. this function is never reached.
         *
         * @param value the value which is switched over
         */
        Utils.exhaustiveSwitch = function (value) {
            throw new Error("The value ".concat(value, " was not exhaustively switched over"));
        };
        /**
         * Returns `list.includes(value)` and narrows the type of 'value'.
         *
         * @example
         * const list: readonly ["A", "B"] = ["A", "B"] as const
         * const value = "C"
         * if (Utils.listIncludesValue(list, value)) {
         *     value // is of type "A" | "B"
         * }
         */
        Utils.listIncludesValue = function (list, value) {
            return list.includes(value);
        };
        /**
         * Shuffles array in place. ES6 version
         * @param {Array} a items An array containing the items.
         * @returns in-place shuffled array
         * @see https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
         */
        Utils.shuffle = function (a) {
            var _a;
            for (var i = a.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                _a = __read([a[j], a[i]], 2), a[i] = _a[0], a[j] = _a[1];
            }
            return a;
        };
        /**
         * Maps `value` using `mapping` if `value != undefined` otherwise it returns `undefined`
         */
        Utils.flatMapOptional = function (value, mapping) {
            if (value == undefined) {
                return undefined;
            }
            else {
                return mapping(value);
            }
        };
        /**
         * Generate a unique ID.  This should be globally unique.
         * 87 characters ^ 20 length > 128 bits (better than a UUID).
         * @return {string} A globally unique ID string.
         */
        Utils.genUid = function () {
            var length = 20;
            var soupLength = Utils.soup_.length;
            var id = [];
            for (var i = 0; i < length; i++) {
                id[i] = Utils.soup_.charAt(Math.random() * soupLength);
            }
            return id.join('');
        };
        ;
        /**
         * Generate a unique ID.  This should be globally unique.
         * 87 characters ^ 20 length > 128 bits (better than a UUID).
         * @return {string} A globally unique ID string.
         */
        Utils.genHtmlUid = function () {
            var length = 25;
            var soupLength = Utils.soupHTML_.length;
            var id = [];
            id[0] = Utils.soupAlphabet_.charAt(Math.random() * Utils.soupAlphabet_.length);
            for (var i = 1; i < length; i++) {
                id[i] = Utils.soupHTML_.charAt(Math.random() * soupLength);
            }
            return id.join('');
        };
        ;
        Utils.genHtmlUid2 = function () {
            var uid = 'uid:' + this.idNumber;
            this.idNumber++;
            return uid;
        };
        /**
         * @see https://codepen.io/ImagineProgramming/post/checksum-algorithms-in-javascript-checksum-js-engine
         */
        Utils.checksumFNV32 = function (array, previousChecksum) {
            if (previousChecksum === void 0) { previousChecksum = 0; }
            var len = array.length;
            var fnv = previousChecksum;
            for (var i = 0; i < len; i++) {
                fnv = (fnv + (((fnv << 1) + (fnv << 4) + (fnv << 7) + (fnv << 8) + (fnv << 24)) >>> 0)) ^ (array[i] & 0xff);
            }
            return fnv >>> 0;
        };
        Utils.flattenArray = function (array) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                var count = array[i].length;
                for (var j = 0; j < count; j++) {
                    result.push(array[i][j]);
                }
            }
            return result;
        };
        Utils.pushAll = function (array, otherArray) {
            for (var i = 0; i < otherArray.length; i++) {
                array.push(otherArray[i]);
            }
        };
        Utils.map2D = function (array, mapping) {
            return array.map(function (subArray) { return subArray.map(mapping); });
        };
        Utils.reshape1Dto2D = function (array, maxSubArrayLength) {
            var newArray = [];
            var temp = [];
            var length = array.length;
            for (var i = 0; i < length; i++) {
                var element = array[i];
                if (temp.length < maxSubArrayLength) {
                    temp.push(element);
                }
                else {
                    newArray.push(temp);
                    temp = [element];
                }
            }
            if (temp.length > 0) {
                newArray.push(temp);
            }
            return newArray;
        };
        Utils.reshape2D = function (array, maxSubArrayLength) {
            var newArray = [];
            var temp = [];
            var l1 = array.length;
            for (var i = 0; i < l1; i++) {
                var subArray = array[i];
                var l2 = subArray.length;
                for (var j = 0; j < l2; j++) {
                    var element = subArray[j];
                    if (temp.length < maxSubArrayLength) {
                        temp.push(element);
                    }
                    else {
                        newArray.push(temp);
                        temp = [element];
                    }
                }
            }
            if (temp.length > 0) {
                newArray.push(temp);
            }
            return newArray;
        };
        // // unique tuple elements
        // static test<
        // 	N extends Narrowable,
        // 	A extends ReadonlyArray<N> & UniqueTupleElements<A>
        // >(key: A) {
        // }
        /**
         * Returns a list of all possible tuples/lists whose i-th element is from `list[i]`.
         *
         * i.e.`[[list[0][0],list[1][0], list[2][0],...], [list[0][1],list[1][0], list[2][0],...], ...]`
         */
        Utils.anyTuples = function (list) {
            var e_1, _a;
            if (list.length == 0) {
                return list;
            }
            else if (list.length == 1) {
                return list[0].map(function (e) { return [e]; });
            }
            else {
                var result = [];
                var _loop_1 = function (value) {
                    var val = Utils.anyTuples(list.slice(0, -1)).map(function (tuple) {
                        return tuple.concat(value);
                    });
                    Utils.pushAll(result, val);
                };
                try {
                    for (var _b = __values(list[list.length - 1]), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var value = _c.value;
                        _loop_1(value);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return result;
            }
        };
        /**
         * Returns a list of all possible tuples/lists whose i-th element is from `list[i]`.
         *
         * i.e.`[[list[0][0],list[1][0], list[2][0],...], [list[0][1],list[1][0], list[2][0],...], ...]`
         */
        Utils.tuples = function (list) {
            return Utils.anyTuples(list);
        };
        Utils.strictPropertiesTuples = function (type, keys) {
            for (var i = 0; i < keys.length; i++) {
                for (var j = i + 1; j < keys.length; j++) {
                    if (keys[i] === keys[j]) {
                        console.error("The property name (" + keys[i] + ") is duplicate");
                    }
                }
            }
            var values = keys.map(function (key) { return applyRestrictedKey(type, key); });
            var tuples = Utils.anyTuples(values);
            return tuples.map(function (tuple) {
                var obj = {};
                for (var i = 0; i < keys.length; i++) {
                    obj[keys[i]] = tuple[i];
                }
                return obj;
            });
        };
        Utils.propertiesTuples = function (type, keys) {
            for (var i = 0; i < keys.length; i++) {
                for (var j = i + 1; j < keys.length; j++) {
                    if (keys[i] === keys[j]) {
                        console.error("The property name (" + keys[i] + ") is duplicate");
                    }
                }
            }
            var values = keys.map(function (key) { return applyRestrictedKey(type, key); });
            var tuples = Utils.anyTuples(values);
            return tuples.map(function (tuple) {
                var obj = {};
                for (var i = 0; i < keys.length; i++) {
                    obj[keys[i]] = tuple[i];
                }
                return obj;
            });
        };
        Utils.allPropertiesTuples = function (type) {
            var keys = Object.keys(type);
            return Utils.propertiesTuples(type, keys);
        };
        /**
        * Generates from `values` a list of all multi-sets which has `length` elements.
        *
        * Each element in `value` is assumes to be unique.
        *
        * @example
        * value = [A, B, C]
        * length = 4
        * // generates (up to some ordering)
        * [AAAA, AAAB, AAAC, AABB, AABC, AACC, ..., CCCC]
        *
        * @param values the values which are used to generate the multi-set permutations
        * @param length the number of elements in the multi-set
        */
        Utils.generateMultiSetTuples = function (values, length) {
            /** repeatedValues[valueIndex][count] returns an array where values[valueIndex] is repeated 'count' times */
            var repeatedValues = values.map(function (value) {
                return Utils.closedRange(0, length).map(function (len) {
                    return new Array(len).fill(value);
                });
            });
            var result = [];
            var valueCount = values.length;
            function recursiveFor(maxCount, recursionIndex, intermediateValue) {
                if (recursionIndex >= valueCount) {
                    result.push(intermediateValue);
                }
                else if (recursionIndex == valueCount - 1) {
                    // last value
                    result.push(intermediateValue.concat(repeatedValues[recursionIndex][maxCount]));
                }
                else {
                    for (var i = 0; i <= maxCount; i++) {
                        recursiveFor(maxCount - i, recursionIndex + 1, intermediateValue.concat(repeatedValues[recursionIndex][i]));
                    }
                }
            }
            recursiveFor(length, 0, []);
            return result;
        };
        /**
         * @param time in seconds
         * @see https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
         * @returns A string of the format "HH:MM:SS"
         */
        Utils.toHHMMSS = function (time) {
            var sec_num = time;
            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);
            return [hours, minutes, seconds].map(function (t) { return t < 10 ? "0" + t : String(t); }).join(":");
        };
        /**
         * @param time in seconds
         * @returns A string of the form "4d 5h 6m 7.8s"
         */
        Utils.toTimeString = function (time) {
            var e_2, _a;
            var sec = time;
            var days = Math.floor(sec / 86400);
            sec -= days * 86400;
            var hours = Math.floor(sec / 3600);
            sec -= hours * 3600;
            var minutes = Math.floor(sec / 60);
            sec -= minutes * 60;
            var seconds = sec;
            var string = "";
            var forceAdd = false;
            try {
                for (var _b = __values([[days, "d "], [hours, "h "], [minutes, "m "], [seconds, "s"]]), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var value = _c.value;
                    if (value[0] != 0 || forceAdd) {
                        forceAdd = true;
                        string += value[0] + value[1];
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return string;
        };
        Utils.nonNullObjectValues = function (value) {
            var e_3, _a;
            var values = Object.values(value);
            var result = [];
            try {
                for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                    var element = values_1_1.value;
                    if (element !== undefined && element !== null) {
                        result.push(element);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return result;
        };
        Utils.mapNotNull = function (array, transform) {
            var e_4, _a;
            var result = [];
            try {
                for (var array_1 = __values(array), array_1_1 = array_1.next(); !array_1_1.done; array_1_1 = array_1.next()) {
                    var element = array_1_1.value;
                    var transformedElement = transform(element);
                    if (transformedElement != null && transformedElement != undefined) {
                        result.push(transformedElement);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return result;
        };
        Utils.getOptions = function (init, someOptions) {
            var options = new init();
            if (someOptions != undefined) {
                Object.assign(options, someOptions);
            }
            return options;
        };
        /**
         * @param array Array where the first occurrence of `element` will be removed
         * @param element The element which will bew removed from `array`
         * @returns `true` if the element was removed
         */
        Utils.removeFromArray = function (array, element) {
            var index = array.indexOf(element, 0);
            if (index > -1) {
                array.splice(index, 1);
                return true;
            }
            return false;
        };
        Utils.stringReplaceAll = function (string, searchValue, replacement) {
            return string.split(searchValue).join(string);
        };
        Utils.vectorEqual = function (v1, v2) {
            return v1.x === v2.x && v1.y === v2.y;
        };
        Utils.vectorAdd = function (v1, v2) {
            return { x: v1.x + v2.x, y: v1.y + v2.y };
        };
        Utils.vectorSub = function (v1, v2) {
            return { x: v1.x - v2.x, y: v1.y - v2.y };
        };
        Utils.vectorDistance = function (v1, v2) {
            var dx = v1.x - v2.x;
            var dy = v1.y - v2.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        Utils.vectorDistanceSquared = function (v1, v2) {
            var dx = v1.x - v2.x;
            var dy = v1.y - v2.y;
            return dx * dx + dy * dy;
        };
        /**
         * returns the pixel ratio of this device
         */
        Utils.getPixelRatio = function () {
            return window.devicePixelRatio || 0.75; // 0.75 is default for old browsers
        };
        Utils.cloneVector = function (value) {
            return { x: value.x, y: value.y };
        };
        Utils.randomElement = function (array) {
            if (array.length == 0) {
                return undefined;
            }
            else {
                return array[(0, Random_1.randomIntBetween)(0, array.length - 1)];
            }
        };
        Utils.getRootURL = function (ignorePort) {
            if (ignorePort === void 0) { ignorePort = false; }
            var part = window.location.protocol + '//' + window.location.hostname;
            if (!ignorePort) {
                part += ":" + window.location.port;
            }
            return part;
        };
        /**
         * Legal characters for the unique ID.  Should be all on a US keyboard.
         * No characters that conflict with XML or JSON.  Requests to remove additional
         * 'problematic' characters from this soup will be denied.  That's your failure
         * to properly escape in your own environment.  Issues #251, #625, #682, #1304.
         * @private
         */
        Utils.soup_ = '!#$%()*+,-./:;=?@[]^_`{|}~' +
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        Utils.soupAlphabet_ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        Utils.soupHTML_ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_:';
        Utils.idNumber = 0;
        return Utils;
    }());
    exports.Utils = Utils;
});
