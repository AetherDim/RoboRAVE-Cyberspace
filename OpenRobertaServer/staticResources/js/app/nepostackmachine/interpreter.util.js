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
define(["require", "exports", "./interpreter.constants", "./Utils"], function (require, exports, C, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getInfoResult = exports.info = exports.debug = exports.opLog = exports.loggingEnabled = exports.expectExc = exports.dbcException = exports.dbc = void 0;
    function dbc(expected, actual) {
        if (expected !== actual) {
            var msg = 'DBC. Expected: ' + expected + ' but got: ' + actual;
            console.trace(msg);
            throw msg;
        }
    }
    exports.dbc = dbc;
    function dbcException(s) {
        console.trace(s);
        throw s;
    }
    exports.dbcException = dbcException;
    function expectExc(fct, cause) {
        try {
            fct();
            var msg = 'DBC. Expected exception was not thrown';
            console.trace(msg);
            throw msg;
        }
        catch (e) {
            if (cause === undefined) {
                Utils_1.Utils.log('expected exception suppressed');
            }
            else {
                dbc(cause, e);
            }
        }
    }
    exports.expectExc = expectExc;
    var opLogEnabled = true;
    var debugEnabled = true;
    var infoResult = '';
    function loggingEnabled(_opLogEnabled, _debugEnabled) {
        opLogEnabled = _opLogEnabled;
        debugEnabled = _debugEnabled;
        infoResult = '';
    }
    exports.loggingEnabled = loggingEnabled;
    /**
     * FOR DEBUGGING: write the actual array of operations to the 'Utils.log'. The actual operation is prefixed by '*'
     *
     * . @param msg the prefix of the message (for easy reading of the logs)
     * . @param operations the array of all operations to be executed
     * . @param pc the program counter
     */
    function opLog(msg, operations, pc) {
        var e_1, _a;
        if (!opLogEnabled) {
            return;
        }
        var opl = '';
        var counter = 0;
        try {
            for (var operations_1 = __values(operations), operations_1_1 = operations_1.next(); !operations_1_1.done; operations_1_1 = operations_1.next()) {
                var op = operations_1_1.value;
                var opc = op[C.OPCODE];
                if (op[C.OPCODE] === C.EXPR) {
                    opc = opc + '[' + op[C.EXPR];
                    if (op[C.EXPR] === C.BINARY) {
                        opc = opc + '-' + op[C.OP];
                    }
                    opc = opc + ']';
                }
                opl = opl + (counter++ == pc ? '*' : '') + opc + ' ';
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (operations_1_1 && !operations_1_1.done && (_a = operations_1.return)) _a.call(operations_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        debug(msg + ' pc:' + pc + ' ' + opl);
    }
    exports.opLog = opLog;
    function debug(s) {
        if (!debugEnabled) {
            return;
        }
        Utils_1.Utils.log(s);
    }
    exports.debug = debug;
    function info(s) {
        Utils_1.Utils.log(s);
        infoResult = infoResult + s + '\n';
    }
    exports.info = info;
    function getInfoResult() {
        return infoResult;
    }
    exports.getInfoResult = getInfoResult;
});
