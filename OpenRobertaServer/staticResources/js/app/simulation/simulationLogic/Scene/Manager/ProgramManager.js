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
define(["require", "exports", "./../../interpreter.interpreter", "../../EventManager/EventManager", "../../BlocklyDebug", "../../Robot/RobotSimBehaviour"], function (require, exports, interpreter_interpreter_1, EventManager_1, BlocklyDebug_1, RobotSimBehaviour_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgramManager = exports.Program = void 0;
    var Program = /** @class */ (function () {
        function Program(program, unit) {
            this.programState = "terminated";
            this.debugManager = BlocklyDebug_1.BlocklyDebug.getInstance();
            this.eventManager = EventManager_1.EventManager.init({
                onStartProgram: EventManager_1.ParameterTypes.none,
                onPauseProgram: EventManager_1.ParameterTypes.none,
                onStopProgram: EventManager_1.ParameterTypes.none
            });
            this.unit = unit;
            this.programString = program.javaScriptProgram;
            this.programObject = JSON.parse(program.javaScriptProgram);
        }
        Program.prototype.removeAllEventHandlers = function () {
            this.eventManager.removeAllEventHandlers();
        };
        Program.prototype.init = function () {
            var _this = this;
            // Think about the consequences of changing this function!!!
            if (this.programState == "terminated") {
                console.log("Init program manager!");
                this.instruction = new RobotSimBehaviour_1.RobotSimBehaviour(this.unit);
                this.interpreter = new interpreter_interpreter_1.Interpreter(this.programObject, this.instruction, function () { return _this.pauseProgram(); }, function () { return _this.interpreterTerminated(); }, this.debugManager.getBreakpointIDs());
                this.programState = "initialized";
            }
            this.debugManager.updateDebugMode();
        };
        Program.prototype.interpreterTerminated = function () {
            this.clearInterpretersAndStop();
        };
        Program.prototype.startProgram = function () {
            this.init();
            this.programState = "running";
            this.eventManager.onStartProgramCallHandlers();
        };
        Program.prototype.pauseProgram = function () {
            this.programState = "paused";
            this.eventManager.onPauseProgramCallHandlers();
        };
        Program.prototype.stopProgram = function () {
            this.clearInterpretersAndStop();
        };
        Program.prototype.clearInterpretersAndStop = function () {
            // remove all highlights from breakpoints
            this.interpreter.removeHighlights();
            // reset interpreters
            this.interpreter = undefined;
            this.programState = "terminated";
            // call event handlers
            this.eventManager.onStopProgramCallHandlers();
        };
        Program.prototype.getSimVariables = function () {
            var _a, _b;
            return (_b = (_a = this.interpreter) === null || _a === void 0 ? void 0 : _a.getVariables()) !== null && _b !== void 0 ? _b : {};
        };
        Program.prototype.isTerminated = function () {
            return this.programState == "terminated";
        };
        /** adds an event to the interpreters */
        Program.prototype.interpreterAddEvent = function (mode) {
            this.interpreter.addEvent(mode);
        };
        /** removes an event to the interpreters */
        Program.prototype.interpreterRemoveEvent = function (mode) {
            this.interpreter.removeEvent(mode);
        };
        return Program;
    }());
    exports.Program = Program;
    var ProgramManager = /** @class */ (function () {
        function ProgramManager() {
            this.programs = [];
            this.eventManager = EventManager_1.EventManager.init({
                onStartProgram: EventManager_1.ParameterTypes.none,
                onPauseProgram: EventManager_1.ParameterTypes.none,
                onStopProgram: EventManager_1.ParameterTypes.none
            });
        }
        ProgramManager.prototype.firstProgram = function () {
            return this.programs.length > 0 ? this.programs[0] : undefined;
        };
        ProgramManager.prototype.removeAllEventHandlers = function () {
            this.eventManager.removeAllEventHandlers();
        };
        ProgramManager.prototype.setPrograms = function (robotPrograms, unit) {
            // save programs
            this.programs = robotPrograms.map(function (p) { return new Program(p, unit); });
        };
        ProgramManager.prototype.startPrograms = function () {
            this.programs.forEach(function (program) { return program.startProgram(); });
            this.eventManager.onStartProgramCallHandlers();
        };
        ProgramManager.prototype.pausePrograms = function () {
            this.programs.forEach(function (program) { return program.pauseProgram(); });
            this.eventManager.onPauseProgramCallHandlers();
        };
        ProgramManager.prototype.stopPrograms = function () {
            this.programs.forEach(function (program) { return program.stopProgram(); });
            this.eventManager.onStopProgramCallHandlers();
        };
        ProgramManager.prototype.allProgramsTerminated = function () {
            var e_1, _a;
            try {
                for (var _b = __values(this.programs), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var program = _c.value;
                    if (!program.isTerminated()) {
                        return false;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return true;
        };
        return ProgramManager;
    }());
    exports.ProgramManager = ProgramManager;
});
