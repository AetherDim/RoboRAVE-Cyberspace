import { Utils } from "../Utils";
import { RobotProgram } from "./RobotProgram";

export interface OpCode {
	opc: string
	expr?: string
	"+"?: string[]
	"-"?: string[]
	value?: string
	speedOnly?: boolean
	SetTime?: boolean
	name?: string
	driveDirection?: "FOREWARD" | "BACKWARD"
	turnDirection?: "left" | "right" 
}

export class RobotProgramGenerator {

	private constructor() {}

	static generateProgram(operations: OpCode[][], addStopOpCodes: boolean = true): RobotProgram {
		const additionalCodes = addStopOpCodes ? RobotProgramGenerator.programStopOpCodes() : []
		return {
			javaScriptProgram: JSON.stringify({ "ops": Utils.flattenArray(operations.concat(additionalCodes)) }, undefined, "\t")
		}
	}

	static programStopOpCodes(): OpCode[] {
		return [{
			"opc": "stop",
		}]
	}

	/**
	 * @param speed from 0 to 100 (in %)
	 * @param distance in meters
	 */
	static driveForwardOpCodes(speed: number, distance: number): OpCode[] {
		const uuidExpr1 = Utils.genUid()
		const uuidExpr2 = Utils.genUid()
		const uuidDriveAction= Utils.genUid()
		return [
			{
				"opc": "expr",
				"expr": "NUM_CONST",
				"+": [
					uuidExpr1
				],
				// speed
				"value": speed.toString()
			},
			{
				"opc": "expr",
				"expr": "NUM_CONST",
				"+": [
					uuidExpr2
				],
				"-": [
					uuidExpr1
				],
				// distance
				"value": (distance*100).toString()
			},
			{
				"opc": "DriveAction",
				"speedOnly": false,
				"SetTime": false,
				"name": "ev3",
				"+": [
					uuidDriveAction
				],
				// forward/backward
				"driveDirection": "FOREWARD",
				"-": [
					uuidExpr2
				]
			},
			{
				"opc": "stopDrive",
				"name": "ev3",
				"-": [
					uuidDriveAction
				]
			}
		]
	}

	/**
	 * @param speed from 0 to 100 (in %)
	 * @param angle in degree
	 */
	static rotateOpCodes(speed: number, angle: number, right: boolean): OpCode[] {
		const uuidExpr1 = Utils.genUid()
		const uuidExpr2 = Utils.genUid()
		const uuidRotateAction= Utils.genUid()
		const dir = right ? 'right' : 'left'
		return [
			{
				"opc": "expr",
				"expr": "NUM_CONST",
				"+": [
					uuidExpr1
				],
				"value": speed.toString()
			},
			{
				"opc": "expr",
				"expr": "NUM_CONST",
				"+": [
					uuidExpr2
				],
				"-": [
					uuidExpr1
				],
				"value": angle.toString()
			},
			{
				"opc": "TurnAction",
				"speedOnly": false,
				"turnDirection": dir,
				"SetTime": false,
				"name": "ev3",
				"+": [
					uuidRotateAction
				],
				"-": [
					uuidExpr2
				]
			},
			{
				"opc": "stopDrive",
				"name": "ev3",
				"-": [
					uuidRotateAction
				]
			}
		]
	}

}