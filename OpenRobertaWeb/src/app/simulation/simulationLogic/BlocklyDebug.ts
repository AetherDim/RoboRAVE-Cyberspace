import Blockly = require("blockly");
import { Timer } from "./Timer";
import {ProgramManager} from "./Scene/Manager/ProgramManager";
import {Interpreter} from "interpreter.interpreter";
import * as CONST from "./simulation.constants";


export class BlocklyDebug {

	private observers: { [key: string]: MutationObserver} = {}

	private programManager: ProgramManager

	private debugMode = false
	private breakpointIDs: string[] = []

	getBreakpointIDs(): string[] {
		return this.breakpointIDs
	}

	private readonly getInterpreters: () => Interpreter[]

	constructor(programManager: ProgramManager, getInterpreters: () => Interpreter[]) {
		this.programManager = programManager
		this.getInterpreters = getInterpreters

		const _this = this
		this.blocklyTicker = new Timer(this.blocklyUpdateSleepTime, (delta) => {
			// update blockly
			_this.updateBreakpointEvent()

			// update sim variables if some interpreter is running
			const allTerminated = _this.programManager.allInterpretersTerminated()
			if(!allTerminated) {
				_this.updateSimVariables()
			}
		});

		this.startBlocklyUpdate()
	}

	destroy() {
		this.blocklyTicker.stop()
	}

	/**
	 * sleep time before calling blockly update
	 */
	private blocklyUpdateSleepTime = 1/10;

	/**
	 * blockly ticker/timer
	 */
	private readonly blocklyTicker: Timer;

	private startBlocklyUpdate() {
		this.blocklyTicker.start();
	}

	private stopBlocklyUpdate() {
		this.blocklyTicker.stop();
	}

	setBlocklyUpdateSleepTime(simSleepTime: number) {
		this.blocklyUpdateSleepTime = simSleepTime;
		this.blocklyTicker.sleepTime = simSleepTime;
	}


	updateSimVariables() {
		if($("#simVariablesModal").is(':visible')) {
			$("#variableValue").html("");
			const variables = this.programManager.getSimVariables();
			if (Object.keys(variables).length > 0) {
				for (const v in variables) {
					const value = variables[v][0];
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

	//
	// New debug mode
	//


	/** adds/removes the ability for a block to be a breakpoint to a block */
	updateBreakpointEvent() {

		if(!Blockly.getMainWorkspace()) {
			// blockly workspace not initialized
			return;
		}
		type SpecialBlocklyBlock = Blockly.Block & { svgGroup_: any, svgPath_: any }

		const observers = this.observers
		const removeBreakPoint = (breakpoint: string) => this.removeBreakpoint(breakpoint)
		const breakpoints = this.breakpointIDs

		const debugMode = this.isDebugMode()
		if (debugMode) {
			Blockly.getMainWorkspace()
				.getAllBlocks(false)
				.forEach(function (block: SpecialBlocklyBlock) {
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
				.forEach(function (block: SpecialBlocklyBlock) {
					if (observers.hasOwnProperty(block.id)) {
						observers[block.id].disconnect();
					}
					$(block.svgPath_).removeClass('breakpoint');
				});
		}
	}

	isDebugMode(): boolean {
		return this.debugMode
	}

	/** updates the debug mode for all interpreters */
	updateDebugMode(mode?: boolean) {
		this.debugMode = mode ?? this.debugMode;

		for (const interpreter of this.getInterpreters()) {
			interpreter.setDebugMode(mode);

			if(!this.debugMode) {
				interpreter.breakpoints = [];
			}
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

		this.updateBreakpointEvent()
	}

	/** removes breakpoint with breakpointID */
	removeBreakpoint(breakpointID: string) {
		for (let i = 0; i < this.breakpointIDs.length; i++) {
			if (this.breakpointIDs[i] === breakpointID) {
				this.breakpointIDs.splice(i, 1);
				i--; // check same index again
			}
		}

		if (this.breakpointIDs.length === 0) {
			for (const interpreter of this.getInterpreters()) {
				// disable all breakpoints
				interpreter.removeEvent(CONST.default.DEBUG_BREAKPOINT)
			}
		}
	}

	addBreakpoint(breakpointID: string) {
		this.breakpointIDs.push(breakpointID)
	}

	startDebugging() {
		this.updateDebugMode(true)
	}

	endDebugging() {
		this.updateDebugMode(false)
	}

}