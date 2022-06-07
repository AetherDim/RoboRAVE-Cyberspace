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
define(["require", "exports", "blockly", "./Timer", "./simulation.constants"], function (require, exports, Blockly, Timer_1, CONST) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlocklyDebug = void 0;
    var BlocklyDebug = /** @class */ (function () {
        function BlocklyDebug(programManager, getInterpreters) {
            this.observers = {};
            this.debugMode = false;
            this.breakpointIDs = [];
            /**
             * sleep time before calling blockly update
             */
            this.blocklyUpdateSleepTime = 1 / 10;
            this.programManager = programManager;
            this.getInterpreters = getInterpreters;
            var _this = this;
            this.blocklyTicker = new Timer_1.Timer(this.blocklyUpdateSleepTime, function (delta) {
                // update blockly
                _this.updateBreakpointEvent();
                // update sim variables if some interpreter is running
                var allTerminated = _this.programManager.allInterpretersTerminated();
                if (!allTerminated) {
                    _this.updateSimVariables();
                }
            });
            this.startBlocklyUpdate();
        }
        BlocklyDebug.prototype.getBreakpointIDs = function () {
            return this.breakpointIDs;
        };
        BlocklyDebug.prototype.destroy = function () {
            this.blocklyTicker.stop();
        };
        BlocklyDebug.prototype.startBlocklyUpdate = function () {
            this.blocklyTicker.start();
        };
        BlocklyDebug.prototype.stopBlocklyUpdate = function () {
            this.blocklyTicker.stop();
        };
        BlocklyDebug.prototype.setBlocklyUpdateSleepTime = function (simSleepTime) {
            this.blocklyUpdateSleepTime = simSleepTime;
            this.blocklyTicker.sleepTime = simSleepTime;
        };
        BlocklyDebug.prototype.updateSimVariables = function () {
            if ($("#simVariablesModal").is(':visible')) {
                $("#variableValue").html("");
                var variables = this.programManager.getSimVariables();
                if (Object.keys(variables).length > 0) {
                    for (var v in variables) {
                        var value = variables[v][0];
                        this.addVariableValue(v, value);
                    }
                }
                else {
                    $('#variableValue').append('<div><label> No variables instantiated</label></div>');
                }
            }
        };
        BlocklyDebug.prototype.addVariableValue = function (name, value) {
            switch (typeof value) {
                case "number": {
                    $("#variableValue").append('<div><label>' + name + ' :  </label><span> ' + Math.round(value * 100) / 100 + '</span></div>');
                    break;
                }
                case "string": {
                    $("#variableValue").append('<div><label>' + name + ' :  </label><span> ' + value + '</span></div>');
                    break;
                }
                case "boolean": {
                    $("#variableValue").append('<div><label>' + name + ' :  </label><span> ' + value + '</span></div>');
                    break;
                }
                case "object": {
                    for (var i = 0; i < value.length; i++) {
                        this.addVariableValue(name + " [" + String(i) + "]", value[i]);
                    }
                    break;
                }
            }
        };
        //
        // New debug mode
        //
        /** adds/removes the ability for a block to be a breakpoint to a block */
        BlocklyDebug.prototype.updateBreakpointEvent = function () {
            var _this_1 = this;
            if (!Blockly.getMainWorkspace()) {
                // blockly workspace not initialized
                return;
            }
            var observers = this.observers;
            var removeBreakPoint = function (breakpoint) { return _this_1.removeBreakpoint(breakpoint); };
            var breakpoints = this.breakpointIDs;
            var debugMode = this.isDebugMode();
            if (debugMode) {
                Blockly.getMainWorkspace()
                    .getAllBlocks(false)
                    .forEach(function (block) {
                    if (!$(block.svgGroup_).hasClass('blocklyDisabled')) {
                        if (observers.hasOwnProperty(block.id)) {
                            observers[block.id].disconnect();
                        }
                        var observer = new MutationObserver(function (mutations) {
                            mutations.forEach(function (mutation) {
                                if ($(block.svgGroup_).hasClass('blocklyDisabled')) {
                                    removeBreakPoint(block.id);
                                    $(block.svgPath_).removeClass('breakpoint').removeClass('selectedBreakpoint');
                                }
                                else {
                                    if ($(block.svgGroup_).hasClass('blocklySelected')) {
                                        if ($(block.svgPath_).hasClass('breakpoint')) {
                                            removeBreakPoint(block.id);
                                            $(block.svgPath_).removeClass('breakpoint');
                                        }
                                        else if ($(block.svgPath_).hasClass('selectedBreakpoint')) {
                                            removeBreakPoint(block.id);
                                            $(block.svgPath_).removeClass('selectedBreakpoint').stop(true, true).animate({ 'fill-opacity': '1' }, 0);
                                        }
                                        else {
                                            breakpoints.push(block.id);
                                            $(block.svgPath_).addClass('breakpoint');
                                        }
                                    }
                                }
                            });
                        });
                        observers[block.id] = observer;
                        observer.observe(block.svgGroup_, { attributes: true });
                    }
                });
            }
            else {
                Blockly.getMainWorkspace()
                    .getAllBlocks(true)
                    .forEach(function (block) {
                    if (observers.hasOwnProperty(block.id)) {
                        observers[block.id].disconnect();
                    }
                    $(block.svgPath_).removeClass('breakpoint');
                });
            }
        };
        BlocklyDebug.prototype.isDebugMode = function () {
            return this.debugMode;
        };
        /** updates the debug mode for all interpreters */
        BlocklyDebug.prototype.updateDebugMode = function (mode) {
            var e_1, _a;
            this.debugMode = mode !== null && mode !== void 0 ? mode : this.debugMode;
            try {
                for (var _b = __values(this.getInterpreters()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interpreter = _c.value;
                    interpreter.setDebugMode(this.debugMode);
                    if (!this.debugMode) {
                        interpreter.breakpoints = [];
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
            if (!this.debugMode) {
                var workspace = Blockly.getMainWorkspace();
                if (workspace != null) {
                    workspace.getAllBlocks(false)
                        .forEach(function (block) {
                        $(block.svgPath_).stop(true, true).removeAttr('style');
                    });
                }
                this.breakpointIDs = [];
            }
            this.updateBreakpointEvent();
        };
        /** removes breakpoint with breakpointID */
        BlocklyDebug.prototype.removeBreakpoint = function (breakpointID) {
            var e_2, _a;
            for (var i = 0; i < this.breakpointIDs.length; i++) {
                if (this.breakpointIDs[i] === breakpointID) {
                    this.breakpointIDs.splice(i, 1);
                    i--; // check same index again
                }
            }
            if (this.breakpointIDs.length === 0) {
                try {
                    for (var _b = __values(this.getInterpreters()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var interpreter = _c.value;
                        // disable all breakpoints
                        interpreter.removeEvent(CONST.default.DEBUG_BREAKPOINT);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        BlocklyDebug.prototype.addBreakpoint = function (breakpointID) {
            this.breakpointIDs.push(breakpointID);
        };
        BlocklyDebug.prototype.startDebugging = function () {
            this.updateDebugMode(true);
        };
        BlocklyDebug.prototype.endDebugging = function () {
            this.updateDebugMode(false);
        };
        return BlocklyDebug;
    }());
    exports.BlocklyDebug = BlocklyDebug;
});
