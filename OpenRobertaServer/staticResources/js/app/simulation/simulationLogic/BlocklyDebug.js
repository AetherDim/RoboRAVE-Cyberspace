define(["require", "exports", "blockly", "./Timer"], function (require, exports, Blockly, Timer_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlocklyDebug = void 0;
    var BlocklyDebug = /** @class */ (function () {
        function BlocklyDebug() {
            this.debugMode = false;
            this.breakpointIDs = [];
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
                        // Toggle breakpoint
                        _this_1.toggleBreakpoint(event.blockId);
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
            this.debugMode = mode !== null && mode !== void 0 ? mode : this.debugMode;
            if (this.debugMode) {
                this.setInterpreterBreakpointIDs(this.breakpointIDs);
            }
            else {
                this.setInterpreterBreakpointIDs([]);
            }
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
                    $(block.svgPath_).stop(true, true).removeAttr('style');
                });
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
        BlocklyDebug.prototype.setInterpreterBreakpointIDs = function (breakpointIDs) {
            if (!this.program || !this.program.interpreter) {
                return;
            }
            this.program.interpreter.breakpoints = breakpointIDs;
            this.updateDebugUI();
        };
        BlocklyDebug.prototype.updateDebugUI = function () {
            if (!this.program || !this.program.interpreter) {
                return;
            }
            this.program.interpreter.setDebugMode(this.debugMode);
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
            this.updateDebugUI();
        };
        BlocklyDebug.prototype.addBreakpoint = function (breakpointID) {
            console.log("add breakpoint: " + breakpointID);
            // TODO: double includes if called from event
            if (!this.breakpointIDs.includes(breakpointID)) {
                this.breakpointIDs.push(breakpointID);
                this.updateDebugUI();
            }
        };
        BlocklyDebug.instance = new BlocklyDebug();
        return BlocklyDebug;
    }());
    exports.BlocklyDebug = BlocklyDebug;
});
