import Blockly = require("blockly");
import * as CONSTANTS from "./simulation.constants";
import { Interpreter } from "./interpreter.interpreter";
import { Robot } from "./Robot/Robot";
import { Scene } from "./Scene/Scene";

export class ProgramManager {
    
    readonly scene: Scene;
    readonly robots: Robot[];

    private programPaused: boolean = true;

    private debugMode = false;
    private breakpoints: string[] = [];
    private observers: { [key: string]: MutationObserver} = {};
    private interpreters: Interpreter[] = [];
    private initialized = false;

    hasBeenInitialized(): boolean {
        return this.initialized;
    }

    constructor(scene: Scene) {
        this.scene = scene;
        this.robots = scene.getRobots();
    }

    setPrograms(programs: any[], refresh: boolean = false, robotType?: string) {
        if(programs.length < this.robots.length) {
            console.warn("Not enough programs!");
        }

        this.interpreters = [];

        // reset interpreters
        this.robots.forEach(robot => {
            robot.interpreter = undefined;
        });


        for(let i = 0; i < programs.length; i++) {
            if(i >= this.robots.length) {
                console.info('Not enough robots, too many programs!');
                break;
            }
            // I think we can use a single breakpoints array for all interpreters, because 
            // the breakpoint IDs are unique
            this.interpreters.push(this.robots[i].setProgram(programs[i], this.breakpoints));
        }

        this.updateDebugMode(this.debugMode);
        this.setSimRunButton(this.programPaused);


        // TODO:
        // the original simulation.js would replace all robots if refresh is true
        // we will only change the type (The robot should manage anything type related internally)
        if(refresh && robotType) {
            this.robots.forEach(robot => {
                robot.setRobotType(robotType);
            });
        }

        this.initialized = true;
    }

    isProgramPaused(): boolean {
        return this.programPaused;
    }

    isDebugMode(): boolean {
        return this.debugMode;
    }

    setProgramPause(pause: boolean) {
        this.programPaused = pause;
        this.setSimRunButton(pause && !this.debugMode);
    }


    startProgram() {
        this.setProgramPause(false);
        this.setSimRunButton(true);
    }

    stopProgram() {
        this.setProgramPause(true);
        this.setSimRunButton(true);
        
        if (this.debugMode) {
            for (var i = 0; i < this.interpreters.length; i++) {
                this.interpreters[i].removeHighlights();
            }
        }

        this.updateDebugMode(this.debugMode);
    }

    getSimVariables() {
        if (this.interpreters.length >= 1) {
            return this.interpreters[0].getVariables();
        } else {
            return {};
        }
    }

    updateSimVariables() {
        if($("#simVariablesModal").attr('aria-hidden') == "false") {
            $("#variableValue").html("");
            var variables = this.getSimVariables();
            if (Object.keys(variables).length > 0) {
                for (var v in variables) {
                    var value = variables[v][0];
                    this.addVariableValue(v, value);
                }
            } else {
                $('#variableValue').append('<div><label> No variables instantiated</label></div>')
            }
        }
    }

    addVariableValue(name: string, value: any) {
        switch (typeof value) {
            case "number": {
                $("#variableValue").append('<div><label>' + name + ' :  </label><span> ' + Math.round(value*100)/100 + '</span></div>');
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
    }

    setSimRunButton(run: boolean) {
        $('#simControl').removeClass('typcn-media-stop').removeClass('typcn-media-play').removeClass('typcn-media-play-outline');
        if (run) {
            $('#simControl').addClass('typcn-media-play');
            $('#simControl').attr('data-original-title', (<any>Blockly.Msg).MENU_SIM_START_TOOLTIP);
        } else {
            $('#simControl').addClass('typcn-media-stop');
            $('#simControl').attr('data-original-title', (<any>Blockly.Msg).MENU_SIM_STOP_TOOLTIP);
        }
    }
    

    /**
     * has to be called after one simulation run
     */
    update() {
        this.updateBreakpointEvent();

        if(this.allInterpretersTerminated() && !this.programPaused) {
            console.log('All programs terminated');
            this.stopProgram();
        }

        this.updateSimVariables();
        
    }

    allInterpretersTerminated(): boolean {
        let allTerminated = true;
        this.interpreters.forEach(ip => {
            if(!ip.isTerminated()) {
                allTerminated = false;
                return;
            }
        });
        return allTerminated;
    }


    /** adds/removes the ability for a block to be a breakpoint to a block */
    updateBreakpointEvent() {
        let _this = this;

        if(!Blockly.getMainWorkspace()) {
            // blockly workspace not initialized
            return;
        }

        if (this.debugMode) {
            Blockly.getMainWorkspace().getAllBlocks(false).forEach((realBlock) => {
                const block = <any>realBlock
                if (!$(block.svgGroup_).hasClass('blocklyDisabled')) {

                    if (_this.observers.hasOwnProperty(block.id)) {
                        _this.observers[realBlock.id].disconnect();
                    }

                    var observer = new MutationObserver((mutations) => {
                        mutations.forEach(function(mutation) {
                            if ($(block.svgGroup_).hasClass('blocklyDisabled')) {
                                _this.removeBreakPoint(realBlock);
                                $(block.svgPath_).removeClass('breakpoint').removeClass('selectedBreakpoint');
                            } else {
                                if ($(block.svgGroup_).hasClass('blocklySelected')) {
                                    if ($(block.svgPath_).hasClass('breakpoint')) {
                                        _this.removeBreakPoint(realBlock);
                                        $(block.svgPath_).removeClass('breakpoint');
                                    } else if ($(block.svgPath_).hasClass('selectedBreakpoint')) {
                                        _this.removeBreakPoint(realBlock);
                                        $(block.svgPath_).removeClass('selectedBreakpoint').stop(true, true).animate({ 'fill-opacity': '1' }, 0);
                                    } else {
                                        _this.breakpoints.push(realBlock.id);
                                        $(block.svgPath_).addClass('breakpoint');
                                    }
                                }
                            }
                        });
                    });
                    _this.observers[realBlock.id] = observer;
                    observer.observe(block.svgGroup_, { attributes: true });
                }
            });
        } else {
            Blockly.getMainWorkspace().getAllBlocks(false).forEach((block) => {
                if (_this.observers.hasOwnProperty(block.id)) {
                    _this.observers[block.id].disconnect();
                }
                $((<any>block).svgPath_).removeClass('breakpoint');
            });
        }
    }

    /** updates the debug mode for all interpreters */
    updateDebugMode(mode: boolean) {
        this.debugMode = mode;

        for (var i = 0; i < this.interpreters.length; i++) {
            // TODO: do we need this?
            if(i < this.robots.length) {
                this.interpreters[i].setDebugMode(mode);
            }
        }
        this.updateBreakpointEvent();
    }

    /** removes breakpoint block */
    removeBreakPoint(block: Blockly.Block) {
        for (var i = 0; i < this.breakpoints.length; i++) {
            if (this.breakpoints[i] === block.id) {
                this.breakpoints.splice(i, 1);
            }
        }
        if (!(this.breakpoints.length > 0) && this.interpreters !== null) {
            for (var i = 0; i < this.interpreters.length; i++) {
                // TODO: do we need this?
                if(i < this.robots.length) {
                    this.interpreters[i].removeEvent(CONSTANTS.DEBUG_BREAKPOINT);
                }
            }
        }
    }

    /** adds an event to the interpreters */
    interpreterAddEvent(mode: any) {
        this.updateBreakpointEvent();
        for (var i = 0; i < this.interpreters.length; i++) {
            // TODO: do we need this?
            if(i < this.robots.length) {
                this.interpreters[i].addEvent(mode);
            }
        }
    }

    /** called to signify debugging is finished in simulation */
    endDebugging() {
        if (this.interpreters !== null) {
            for (var i = 0; i < this.interpreters.length; i++) {
                // TODO: do we need this?
                if(i < this.robots.length) {
                    this.interpreters[i].setDebugMode(false);
                    this.interpreters[i].breakpoints = [];
                }
            }
        }
        let _this = this;
        Blockly.getMainWorkspace().getAllBlocks(false).forEach((block:any) => {
            if (block.inTask && !block.disabled && !block.getInheritedDisabled()) {
                $(block.svgPath_).stop(true, true).animate({ 'fill-opacity': '1' }, 0);
            }
        });
        this.breakpoints = [];
        this.debugMode = false;
        this.updateBreakpointEvent();
    }

}