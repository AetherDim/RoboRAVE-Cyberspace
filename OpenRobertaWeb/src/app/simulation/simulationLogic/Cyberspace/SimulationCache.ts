import { Utils } from "../Utils";
import { RobertaRobotSetupData } from "../Robot/RobertaRobotSetupData";
import { sensorTypeStrings } from "../Robot/Robot";
import { RobotSetupData } from "../Robot/RobotSetupData";

export class SimulationCache {
	
	storedRobertaRobotSetupDataList: RobertaRobotSetupData[] = []
	storedRobotType: string = ""

	constructor(robertaRobotSetupDataList: RobertaRobotSetupData[], robotType: string) {
		
		// check that the configuration values ("TOUCH", "GYRO", ...) are also in `sensorTypeStrings`
		for (const setupData of robertaRobotSetupDataList) {
			const portToSensorMapping = setupData.configuration.SENSORS
			const allKeys = Object.keys(portToSensorMapping)
			const allValues = Utils.nonNullObjectValues(portToSensorMapping)
			const wrongValueCount = allValues.find((e) => !sensorTypeStrings.includes(e))?.length ?? 0
			if (wrongValueCount > 0 || allKeys.filter((e) => typeof e === "number").length > 0) {
				console.error(`The 'configuration' has not the expected type. Configuration: ${portToSensorMapping}`)
			}
		}

		this.storedRobertaRobotSetupDataList = robertaRobotSetupDataList
		this.storedRobotType = robotType
	}

	toRobotSetupData(): RobotSetupData[] {
		return this.storedRobertaRobotSetupDataList.map(setup => {
			return {
				configuration: setup.configuration,
				program: {
					javaScriptProgram: setup.javaScriptProgram
				}
		}})
	}

	hasEqualConfiguration(cache: SimulationCache): boolean {
		function toProgramEqualityObject(data: RobertaRobotSetupData): unknown {
			return {
				configuration: data.configuration
			}
		}
		return Utils.deepEqual(
			this.storedRobertaRobotSetupDataList.map(toProgramEqualityObject),
			cache.storedRobertaRobotSetupDataList.map(toProgramEqualityObject))
	}

}