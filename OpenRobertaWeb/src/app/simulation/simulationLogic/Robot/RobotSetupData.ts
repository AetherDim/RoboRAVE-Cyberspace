import { RobotConfiguration } from "./RobotConfiguration";
import { RobotProgram } from "./RobotProgram";


export interface RobotSetupData {
	configuration: RobotConfiguration
	programs: RobotProgram[]
}