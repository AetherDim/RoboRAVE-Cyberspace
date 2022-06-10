import { Robot } from "../../Robot/Robot";
import { RobotManager } from "./RobotManager";
import { Interpreter } from "./../../interpreter.interpreter";
import { RobotProgram } from "../../Robot/RobotProgram";
import { EventManager, ParameterTypes } from "../../EventManager/EventManager";
import {BlocklyDebug} from "../../BlocklyDebug";

export class ProgramManager {
	
	readonly robotManager: RobotManager;
	readonly robots: Robot[];

	private programPaused: boolean = true;

	private interpreters: Interpreter[] = [];
	private initialized = false;

	private cachedPrograms: RobotProgram[] = []

	private debugManager = BlocklyDebug.getInstanceAndInit(this, () => this.interpreters)

	readonly eventManager = EventManager.init({
		onStartProgram: ParameterTypes.none,
		onPauseProgram: ParameterTypes.none,
		onStopProgram: ParameterTypes.none
	})

	hasBeenInitialized(): boolean {
		return this.initialized;
	}

	constructor(robotManager: RobotManager) {
		this.robotManager = robotManager;
		this.robots = robotManager.getRobots();
	}

	removeAllEventHandlers() {
		this.eventManager.removeAllEventHandlers()
	}

	setCachedPrograms() {
		this.setPrograms(this.cachedPrograms)
	}

	setPrograms(programs: RobotProgram[]) {
		if(programs.length < this.robots.length) {
			console.warn("Not enough programs!");
		}

		// cache old programs
		this.cachedPrograms = programs

		this.stopProgram() // reset program manager

		this.init()
	}

	private init() {
		if(!this.initialized) {
			console.log("Init program manager!")
			for(let i = 0; i < this.cachedPrograms.length; i++) {
				if(i >= this.robots.length) {
					console.info('Not enough robots, too many programs!')
					break
				}
				// We can use a single breakpoints array for all interpreters, because 
				// the breakpoint IDs are unique
				this.interpreters.push(this.robots[i].setProgram(this.cachedPrograms[i], this.debugManager.getBreakpointIDs()))
			}

			this.initialized = true
		}

		this.debugManager.updateDebugMode()
	}

	isProgramPaused(): boolean {
		return this.programPaused
	}

	private setProgramPause(pause: boolean) {
		this.programPaused = pause
	}

	startProgram() {
		this.init()
		this.setProgramPause(false)
		this.eventManager.onStartProgramCallHandlers()
	}

	pauseProgram() {
		this.setProgramPause(true)
		this.eventManager.onPauseProgramCallHandlers()
	}

	/**
	 * Stops the program and resets all interpreters
	 */
	stopProgram() {

		// remove all highlights from breakpoints
		for (var i = 0; i < this.interpreters.length; i++) {
			this.interpreters[i].removeHighlights();
		}

		this.interpreters = []

		// reset interpreters
		this.robots.forEach(robot => {
			robot.interpreter = undefined
		})

		this.initialized = false
		this.pauseProgram()

		// call event handlers
		this.eventManager.onStopProgramCallHandlers()
	}

	getSimVariables() {
		if (this.interpreters.length >= 1) {
			return this.interpreters[0].getVariables();
		} else {
			return {};
		}
	}
	

	/**
	 * has to be called after one simulation run
	 */
	update() {
		const allTerminated = this.allInterpretersTerminated();
		if(allTerminated && this.initialized) {
			console.log('All programs terminated');
			this.stopProgram();
		}
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

	/** adds an event to the interpreters */
	interpreterAddEvent(mode: any) {
		for (let i = 0; i < this.interpreters.length; i++) {
			if(i < this.robots.length) {
				this.interpreters[i].addEvent(mode);
			}
		}
	}

	/** removes an event to the interpreters */
	interpreterRemoveEvent(mode: any) {
		for (var i = 0; i < this.interpreters.length; i++) {
			if(i < this.robots.length) {
				this.interpreters[i].removeEvent(mode);
			}
		}
	}


	//
	// Debugging
	//

	setDebugMode(debugMode: boolean) {
		this.debugManager.updateDebugMode(debugMode)
	}

	isDebugMode() {
		return this.debugManager.isDebugMode()
	}

}