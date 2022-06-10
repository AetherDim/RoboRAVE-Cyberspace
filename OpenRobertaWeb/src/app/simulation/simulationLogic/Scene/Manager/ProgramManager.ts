import { Interpreter } from "./../../interpreter.interpreter";
import { RobotProgram } from "../../Robot/RobotProgram";
import { EventManager, ParameterTypes } from "../../EventManager/EventManager";
import {BlocklyDebug} from "../../BlocklyDebug";
import { RobotSimBehaviour } from "../../Robot/RobotSimBehaviour";
import { Unit } from "../../Unit";
import { StringMap } from "../../Utils";

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

	private init() {
		// Think about the consequences of changing this function!!!
		if(this.programState == "terminated") {
			console.log("Init program manager!")
			
			this.instruction = new RobotSimBehaviour(this.unit)
			this.interpreter = new Interpreter(
				this.programObject,
				this.instruction,
				() => this.pauseProgram(),
				() => this.interpreterTerminated(),
				this.debugManager.getBreakpointIDs())
			
			this.programState = "initialized"
		}

		this.debugManager.updateDebugMode()
	}

	private interpreterTerminated() {
		this.clearInterpretersAndStop()
	}


	startProgram() {
		this.init()
		this.programState = "running"
		this.eventManager.onStartProgramCallHandlers()
	}

	pauseProgram() {
		this.programState = "paused"
		this.eventManager.onPauseProgramCallHandlers()
	}

	stopProgram() {
		this.clearInterpretersAndStop()
	}

	private clearInterpretersAndStop() {

		// remove all highlights from breakpoints
		this.interpreter?.removeHighlights()


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
	interpreterAddEvent(mode: any) {
		this.interpreter?.addEvent(mode);
	}

	/** removes an event to the interpreters */
	interpreterRemoveEvent(mode: any) {
		this.interpreter?.removeEvent(mode);
	}

	isRunning() {
		return this.programState == "running"
	}

	runNOperations(N: number) : number {
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

	setPrograms(robotPrograms: RobotProgram[], unit: Unit) {
		// save programs
		this.programs = robotPrograms.map(p => new Program(p, unit))
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