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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
define(["require", "exports", "blockly", "./Timer", "./interpreter.jsHelper", "./Utils"], function (require, exports, Blockly, Timer_1, stackmachineJsHelper, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlocklyDebug = void 0;
    var BlocklyDebug = /** @class */ (function () {
        function BlocklyDebug() {
            this.debugMode = false;
            this.breakpointIDs = [];
            this.currentBlocks = [];
            /**
             * sleep time before calling blockly update
             */
            this.blocklyUpdateSleepTime = 1 / 2;
            var _this = this;
            this.blocklyTicker = new Timer_1.Timer(this.blocklyUpdateSleepTime, function (delta) {
                // update sim variables if some interpreter is running
                _this.updateSimVariables();
            });
            this.registerBlocklyChangeListener();
            this.startBlocklyUpdate();
            console.log("Debug manager created!");
        }
        BlocklyDebug.prototype.clearCurrentBlockIDs = function () {
            this.currentBlocks.splice(0, this.currentBlocks.length);
        };
        BlocklyDebug.prototype.getNewCurrentBlockIDs = function () {
            this.clearCurrentBlockIDs();
            return this.currentBlocks;
        };
        BlocklyDebug.prototype.getBreakpointIDs = function () {
            return this.breakpointIDs;
        };
        BlocklyDebug.prototype.getWorkspaceProgram = function () {
            return this.program;
        };
        // singleton because Blockly is global and two debug manager would mess with stuff
        // debug manager is not destroyed correctly
        BlocklyDebug.getInstance = function () {
            return BlocklyDebug.instance;
        };
        BlocklyDebug.init = function (program) {
            var obj = BlocklyDebug.instance;
            obj.program = program;
            return obj;
        };
        BlocklyDebug.prototype.registerBlocklyChangeListener = function () {
            var _this_1 = this;
            var workspace = Blockly.getMainWorkspace();
            if (workspace) {
                workspace.addChangeListener(function (event) {
                    console.log(event);
                    if (event.element == "click") {
                        if (_this_1.debugMode) {
                            // Toggle breakpoint
                            _this_1.toggleBreakpoint(event.blockId);
                        }
                    }
                });
            }
            else {
                setTimeout(function () { return _this_1.registerBlocklyChangeListener(); }, 200);
            }
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
            if (!this.program || this.program.isTerminated()) {
                return;
            }
            if ($("#simVariablesModal").is(':visible')) {
                $("#variableValue").html("");
                var variables = this.program.getSimVariables();
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
        BlocklyDebug.prototype.toggleBreakpoint = function (id) {
            if (this.breakpointIDs.includes(id)) {
                this.removeBreakpoint(id);
            }
            else {
                this.addBreakpoint(id);
            }
        };
        BlocklyDebug.prototype.isDebugMode = function () {
            return this.debugMode;
        };
        /** updates the debug mode for all interpreters */
        BlocklyDebug.prototype.updateDebugMode = function (mode) {
            var _this_1 = this;
            var _a, _b;
            this.debugMode = mode !== null && mode !== void 0 ? mode : this.debugMode;
            (_b = (_a = this.program) === null || _a === void 0 ? void 0 : _a.interpreter) === null || _b === void 0 ? void 0 : _b.setDebugMode(this.debugMode);
            // css changes the appearance of the blocks `#blockyl.debug`
            if (this.debugMode) {
                $('#blockly').addClass('debug');
            }
            else {
                $('#blockly').removeClass('debug');
            }
            var workspace = Blockly.getMainWorkspace();
            if (workspace != null) {
                workspace.getAllBlocks(false)
                    .forEach(function (block) {
                    _this_1.removeBlockStyle(block);
                });
            }
            this.removeHighlights(this.breakpointIDs);
            if (this.debugMode) {
                this.addHighlights(this.breakpointIDs);
            }
            else {
                this.clearCurrentBlockIDs();
            }
            /*for (const interpreter of this.getInterpreters()) {
    
                if(!this.debugMode) {
                    interpreter.breakpoints = []
                } else {
                    interpreter.breakpoints = this.breakpointIDs
                }
    
                //interpreter.setDebugMode(false); // remove highlights, these stack
                interpreter.setDebugMode(this.debugMode);
            }
    
            if(!this.debugMode) {
                const workspace = Blockly.getMainWorkspace()
                if (workspace != null) {
                    workspace.getAllBlocks(false)
                        .forEach((block) => {
                            $((block as any).svgPath_).stop(true, true).removeAttr('style');
                        });
                }
    
                this.breakpointIDs = [];
            }
    
            this.updateBreakpointEvent()*/
        };
        BlocklyDebug.prototype.setBreakpointIDs = function (breakpointIDs) {
            var _a;
            this.removeHighlights(this.breakpointIDs);
            this.breakpointIDs.splice(0, this.breakpointIDs.length);
            (_a = this.breakpointIDs).push.apply(_a, __spreadArray([], __read(breakpointIDs), false));
            this.addHighlights(this.breakpointIDs);
        };
        /** removes breakpoint with breakpointID */
        BlocklyDebug.prototype.removeBreakpoint = function (breakpointID) {
            console.log("remove breakpoint: " + breakpointID);
            for (var i = 0; i < this.breakpointIDs.length; i++) {
                if (this.breakpointIDs[i] === breakpointID) {
                    this.breakpointIDs.splice(i, 1);
                    i--; // check same index again
                }
            }
            this.removeHighlights([breakpointID]);
        };
        BlocklyDebug.prototype.addBreakpoint = function (breakpointID) {
            console.log("add breakpoint: " + breakpointID);
            // TODO: double includes if called from event
            if (!this.breakpointIDs.includes(breakpointID)) {
                this.breakpointIDs.push(breakpointID);
                this.addHighlights([breakpointID]);
            }
        };
        BlocklyDebug.prototype.highlightBlock = function (block) {
            stackmachineJsHelper.getJqueryObject(block.svgPath_).stop(true, true).animate({ 'fill-opacity': '1' }, 0);
        };
        BlocklyDebug.prototype.removeBlockHighlight = function (block) {
            stackmachineJsHelper.getJqueryObject(block.svgPath_).stop(true, true).animate({ 'fill-opacity': '0.3' }, 50);
        };
        BlocklyDebug.prototype.removeBlockStyle = function (block) {
            $(block.svgPath_).stop(true, true).removeAttr('style');
        };
        /** Will add highlights from all currently blocks being currently executed and all given Breakpoints
         * @param breakPoints the array of breakpoint block id's to have their highlights added*/
        BlocklyDebug.prototype.addHighlights = function (breakPoints) {
            var _this_1 = this;
            this.currentBlocks
                .map(function (blockId) { return stackmachineJsHelper.getBlockById(blockId); })
                .forEach(function (block) {
                Utils_1.Utils.assertNonNull(block);
                _this_1.highlightBlock(block);
            });
            breakPoints.forEach(function (id) {
                var block = stackmachineJsHelper.getBlockById(id);
                if (block !== null) {
                    if (_this_1.currentBlocks.hasOwnProperty(id)) {
                        stackmachineJsHelper.getJqueryObject(block.svgPath_).addClass('selectedBreakpoint');
                    }
                    else {
                        stackmachineJsHelper.getJqueryObject(block.svgPath_).addClass('breakpoint');
                    }
                }
            });
        };
        /** Will remove highlights from all currently blocks being currently executed and all given Breakpoints
         * @param breakPoints the array of breakpoint block id's to have their highlights removed*/
        BlocklyDebug.prototype.removeHighlights = function (breakPoints) {
            var _this_1 = this;
            this.currentBlocks
                .map(function (blockId) { return stackmachineJsHelper.getBlockById(blockId); })
                .forEach(function (block) {
                if (block !== null) {
                    var object = stackmachineJsHelper.getJqueryObject(block);
                    if (object.hasClass('selectedBreakpoint')) {
                        object.removeClass('selectedBreakpoint').addClass('breakpoint');
                    }
                    _this_1.removeBlockStyle(block);
                }
            });
            breakPoints
                .map(function (blockId) { return stackmachineJsHelper.getBlockById(blockId); })
                .forEach(function (block) {
                if (block !== null) {
                    stackmachineJsHelper.getJqueryObject(block.svgPath_).removeClass('breakpoint').removeClass('selectedBreakpoint');
                }
            });
        };
        BlocklyDebug.instance = new BlocklyDebug();
        return BlocklyDebug;
    }());
    exports.BlocklyDebug = BlocklyDebug;
});
