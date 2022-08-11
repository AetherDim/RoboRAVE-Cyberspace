import Blockly = require("blockly");
import { Timer } from "./Timer";
import {Program} from "./Scene/Manager/ProgramManager";
import * as stackmachineJsHelper from "./interpreter.jsHelper"
import { BlockHighlightManager } from "interpreter.state";
import { Utils } from "./Utils";

type SpecialBlocklyBlock = Blockly.Block & { svgGroup_: any, svgPath_: any }

export class BlocklyDebug implements BlockHighlightManager {

	private debugMode = false
	private readonly breakpointIDs: string[] = []
	private readonly currentBlocks: string[] = []

	getNewCurrentBlockIDs(): string[] {
		this.currentBlocks.splice(0, this.currentBlocks.length)
		return this.currentBlocks
	}

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
		this.program?.interpreter?.setDebugMode(this.debugMode)

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
		this.removeHighlights(this.breakpointIDs)
		if (this.debugMode) {
			this.addHighlights(this.breakpointIDs)
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

	private setBreakpointIDs(breakpointIDs: string[]) {
		this.removeHighlights(this.breakpointIDs)
		this.breakpointIDs.splice(0, this.breakpointIDs.length)
		this.breakpointIDs.push(...breakpointIDs)
		this.addHighlights(this.breakpointIDs)
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
		this.removeHighlights([breakpointID])
	}

	addBreakpoint(breakpointID: string) {
		console.log("add breakpoint: " + breakpointID)
		// TODO: double includes if called from event
		if(!this.breakpointIDs.includes(breakpointID)) {
			this.breakpointIDs.push(breakpointID)
			this.addHighlights([breakpointID])
		}
	}

	highlightBlock(block: SpecialBlocklyBlock) {
		stackmachineJsHelper.getJqueryObject(block.svgPath_).stop(true, true).animate({ 'fill-opacity': '1' }, 0);
	}

	removeBlockHighlight(block: SpecialBlocklyBlock) {
		stackmachineJsHelper.getJqueryObject(block.svgPath_).stop(true, true).animate({ 'fill-opacity': '0.3' }, 50);
	}

	/** Will add highlights from all currently blocks being currently executed and all given Breakpoints
	 * @param breakPoints the array of breakpoint block id's to have their highlights added*/
	private addHighlights(breakPoints: string[]) {
		this.currentBlocks
			.map((blockId) => stackmachineJsHelper.getBlockById(blockId))
			.forEach((block) => {
				Utils.assertNonNull(block)
				this.highlightBlock(block)
			});

		breakPoints.forEach((id) => {
			const block = stackmachineJsHelper.getBlockById(id);
			if (block !== null) {
				if (this.currentBlocks.hasOwnProperty(id)) {
					stackmachineJsHelper.getJqueryObject(block.svgPath_).addClass('selectedBreakpoint');
				} else {
					stackmachineJsHelper.getJqueryObject(block.svgPath_).addClass('breakpoint');
				}
			}
		});
	}

	/** Will remove highlights from all currently blocks being currently executed and all given Breakpoints
	 * @param breakPoints the array of breakpoint block id's to have their highlights removed*/
	removeHighlights(breakPoints: string[]) {
		this.currentBlocks
			.map((blockId) => stackmachineJsHelper.getBlockById(blockId))
			.forEach((block) => {
				if (block !== null) {
					const object = stackmachineJsHelper.getJqueryObject(block);
					if (object.hasClass('selectedBreakpoint')) {
						object.removeClass('selectedBreakpoint').addClass('breakpoint');
					}
					this.removeBlockHighlight(block);
				}
			});

		breakPoints
			.map((blockId) => stackmachineJsHelper.getBlockById(blockId))
			.forEach((block) => {
				if (block !== null) {
					stackmachineJsHelper.getJqueryObject(block.svgPath_).removeClass('breakpoint').removeClass('selectedBreakpoint');
				}
			});
	}

}