import Blockly = require("blockly");
import { Timer } from "./Timer";
import {Program} from "./Scene/Manager/ProgramManager";

type SpecialBlocklyBlock = Blockly.Block & { svgGroup_: any, svgPath_: any }

export class BlocklyDebug {

	private debugMode = false
	private breakpointIDs: string[] = []

	getBreakpointIDs(): string[] {
		return this.breakpointIDs
	}

	private program?: Program

	getWorkspaceProgram() {
		return this.program
	}

	private static readonly instance = new BlocklyDebug()

	// singleton because Blockly is global and two debug manager would mess with stuff
	// debug manager is not destroyed correctly
	static getInstance(): BlocklyDebug {
		return BlocklyDebug.instance
	}

	static init(program?: Program) {
		const obj = BlocklyDebug.instance
		obj.program = program
		return obj
	}

	private registerBlocklyChangeListener() {
		const workspace = Blockly.getMainWorkspace()
		if(workspace) {
			workspace.addChangeListener((event: any) => {
				console.log(event)
				if(event.element == "click") {
					// Toggle breakpoint
					this.toggleBreakpoint(event.blockId)
				}
			})
		} else {
			setTimeout(() => this.registerBlocklyChangeListener(), 200)
		}
	}

	private constructor() {
		const _this = this
		this.blocklyTicker = new Timer(this.blocklyUpdateSleepTime, (delta) => {
			// update sim variables if some interpreter is running
			_this.updateSimVariables()
		});

		this.registerBlocklyChangeListener()

		this.startBlocklyUpdate()
		console.log("Debug manager created!")
	}

	/**
	 * sleep time before calling blockly update
	 */
	private blocklyUpdateSleepTime = 1/2;

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
		if(!this.program || this.program.isTerminated()) {
			return
		}

		if($("#simVariablesModal").is(':visible')) {
			$("#variableValue").html("");
			const variables = this.program.getSimVariables();
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

	toggleBreakpoint(id: string) {
		if(this.breakpointIDs.includes(id)) {
			this.removeBreakpoint(id)
		} else {
			this.addBreakpoint(id)
		}
	}

	isDebugMode(): boolean {
		return this.debugMode
	}

	/** updates the debug mode for all interpreters */
	updateDebugMode(mode?: boolean) {
		this.debugMode = mode ?? this.debugMode;

		if(this.debugMode) {
			this.setInterpreterBreakpointIDs(this.breakpointIDs)
		} else {
			this.setInterpreterBreakpointIDs([])
		}

		// css changes the appearance of the blocks `#blockyl.debug`
		if (this.debugMode) {
			$('#blockly').addClass('debug')
		} else {
			$('#blockly').removeClass('debug')
		}
		const workspace = Blockly.getMainWorkspace()
		if (workspace != null) {
			workspace.getAllBlocks(false)
				.forEach((block) => {
					$((block as SpecialBlocklyBlock).svgPath_).stop(true, true).removeAttr('style')
				})
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
	}

	private setInterpreterBreakpointIDs(breakpointIDs: string[]) {
		if(!this.program || !this.program.interpreter) {
			return
		}
		this.program.interpreter.breakpoints = breakpointIDs
		this.updateDebugUI()
	}

	private updateDebugUI() {
		if(!this.program || !this.program.interpreter) {
			return
		}
		this.program.interpreter.setDebugMode(this.debugMode)
	}

	/** removes breakpoint with breakpointID */
	removeBreakpoint(breakpointID: string) {
		console.log("remove breakpoint: " + breakpointID)

		for (let i = 0; i < this.breakpointIDs.length; i++) {
			if (this.breakpointIDs[i] === breakpointID) {
				this.breakpointIDs.splice(i, 1);
				i--; // check same index again
			}
		}
		this.updateDebugUI()
	}

	addBreakpoint(breakpointID: string) {
		console.log("add breakpoint: " + breakpointID)
		// TODO: double includes if called from event
		if(!this.breakpointIDs.includes(breakpointID)) {
			this.breakpointIDs.push(breakpointID)
			this.updateDebugUI()
		}
	}

}