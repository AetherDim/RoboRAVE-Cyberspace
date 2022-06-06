import { RobotConfiguration } from "./RobotConfiguration";

export interface RobertaRobotSetupData {
	/**
	 * key: `string` which is the port.
	 * value: `SensorType`
	 */
	 configuration: RobotConfiguration
	 javaScriptProgram: string

	// could be optional?
	rc?: string // "ok" or something else
	message?: string // message
}