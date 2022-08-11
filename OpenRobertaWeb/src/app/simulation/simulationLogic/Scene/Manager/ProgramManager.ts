import { Interpreter, InterpreterEvent } from "./../../interpreter.interpreter";
import { RobotProgram } from "../../Robot/RobotProgram";
import { EventManager, ParameterTypes } from "../../EventManager/EventManager";
import {BlocklyDebug} from "../../BlocklyDebug";
import { RobotSimBehaviour } from "../../Robot/RobotSimBehaviour";
import { Unit } from "../../Unit";
import { StringMap } from "../../Utils";

// TODO: Do we need 'initialized'?
export type ProgramState = "initialized" | "running" | "paused" | "terminated"

export class Program {

	interpreter?: Interpreter
	programString: string
	programObject: any

	instruction?: RobotSimBehaviour


	programState: ProgramState = "terminated"

	debugManager = BlocklyDebug.getInstance()

	readonly eventManager = EventManager.init({
		onStartProgram: ParameterTypes.none,
		onPauseProgram: ParameterTypes.none,
		onStopProgram: ParameterTypes.none
	})

	unit: Unit

	constructor(program: RobotProgram, unit: Unit) {
		this.unit = unit
		this.programString = program.javaScriptProgram
		this.programObject= JSON.parse(program.javaScriptProgram)
	}

	removeAllEventHandlers() {
		this.eventManager.removeAllEventHandlers()
	}

	private initIfNecessary() {
		// Think about the consequences of changing this function!!!
		if(this.programState == "terminated") {
			console.log("Init program manager!")
			
			this.instruction = new RobotSimBehaviour(this.unit)
			this.interpreter = new Interpreter(
				this.programObject,
				this.instruction,
				() => this.interpreterTerminated(),
				() => this.pauseProgram(),
				this.debugManager,
				this.debugManager.getBreakpointIDs())
			
			this.programState = "initialized"

			this.debugManager.updateDebugMode()
		}
	}

	private interpreterTerminated() {
		this.clearInterpretersAndStop()
	}


	startProgram() {
		this.initIfNecessary()
		this.programState = "running"
		this.eventManager.onStartProgramCallHandlers()
	}

	/**
	 * This method does not actively pause the program.
	 * 
	 * It sets the `programState` and calls the event handlers.
	 */
	pauseProgram() {
		this.programState = "paused"
		this.eventManager.onPauseProgramCallHandlers()
	}

	stopProgram() {
		this.clearInterpretersAndStop()
	}

	private clearInterpretersAndStop() {

		// remove all highlights from breakpoints
		this.debugManager.removeHighlights([])


		// reset interpreters
		this.interpreter = undefined

		this.programState = "terminated"

		// call event handlers
		this.eventManager.onStopProgramCallHandlers()
	}

	getSimVariables(): StringMap<any> {
		return this.interpreter?.getVariables() ?? {}
	}

	
	isTerminated(): boolean {
		return this.programState == "terminated"
	}

	/** adds an event to the interpreters */
	interpreterAddEvent(mode: InterpreterEvent) {
		this.interpreter?.addEvent(mode);
	}

	/** removes an event to the interpreters */
	interpreterRemoveEvent(mode: InterpreterEvent) {
		this.interpreter?.removeEvent(mode);
	}

	isRunning() {
		return this.programState == "running"
	}

	runNOperations(N: number) : number {
		this.startProgram()
		return this.interpreter?.runNOperations(N) ?? 0
	}
}
export class ProgramManager {

	private programs: Program[] = []

	readonly eventManager = EventManager.init({
		onStartProgram: ParameterTypes.none,
		onPauseProgram: ParameterTypes.none,
		onStopProgram: ParameterTypes.none
	})

	constructor() {
	}

	firstProgram(): Program | undefined {
		return this.programs.length > 0 ? this.programs[0] : undefined
	}

	removeAllEventHandlers() {
		this.eventManager.removeAllEventHandlers()
	}

	/**
	 * Sets the converted `robotPrograms` to `this.programs`.
	 * 
	 * It also removes all event handlers from `this.programs` and adds new event handlers to the new programs.
	 */
	setPrograms(robotPrograms: RobotProgram[], unit: Unit) {
		// remove all event handlers from current programs
		this.programs.forEach(p => p.removeAllEventHandlers())
		// set programs
		this.programs = robotPrograms.map(p => new Program(p, unit))
		// add event handlers to new programs
		this.programs.forEach(p => {
			p.eventManager.onStopProgram(() => {
				if (this.allProgramsTerminated()) {
					this.eventManager.onStopProgramCallHandlers()
				}
			})
		})
	}


	startPrograms() {
		this.programs.forEach(program => program.startProgram())
		this.eventManager.onStartProgramCallHandlers()
	}

	pausePrograms() {
		this.programs.forEach(program => program.pauseProgram())
		this.eventManager.onPauseProgramCallHandlers()
	}

	stopPrograms() {
		this.programs.forEach(program => program.stopProgram())
		this.eventManager.onStopProgramCallHandlers()
	}

	allProgramsTerminated(): boolean {
		for (const program of this.programs) {
			if(!program.isTerminated()) {
				return false
			}
		}
		return true
	}

	getPrograms() {
		return this.programs
	}

    isAnyProgramRunning() {
		for (const program of this.programs) {
			if(program.isRunning()) {
				return true
			}
		}
		return false
    }
}