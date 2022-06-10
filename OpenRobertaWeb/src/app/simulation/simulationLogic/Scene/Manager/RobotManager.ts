import {Robot} from "../../Robot/Robot";
import {ProgramManager} from "./ProgramManager";
import {Scene} from "../Scene";
import { RobotConfigurationManager } from "./RobotConfigurationManager";
import {RobertaRobotSetupData} from "../../Robot/RobertaRobotSetupData";
import {Unit} from "../../Unit";
import {RobotProgram} from "../../Robot/RobotProgram";
import {BlocklyDebug} from "../../BlocklyDebug";


export class RobotManager {

	private readonly scene: Scene

	constructor(scene: Scene) {
		this.scene = scene
	}

	/**
	 * Represents the number of robots after this scene has been initialized.
	 * The GUI needs this information before the scene has finished loading.
	 * @protected
	 */
	protected numberOfRobots = 1;

	private showRobotSensorValues = true

	/**
	 * All programmable robots within the scene.
	 * The program flow manager will use the robots internally.
	 */
	private readonly robots: Array<Robot> = new Array<Robot>();

	readonly configurationManager = new RobotConfigurationManager(this.robots)

	setPrograms(programs: RobotProgram[][]) {

		this.scene.runAfterLoading(() => {

			if(this.robots.length < programs.length) {
				console.warn("Too many programs for robots!")
			}

			if(this.robots.length > programs.length) {
				console.warn("Not enough programs for robots!")
			}

			for (let i = 0; i < this.robots.length; i++) {
				if(i >= programs.length) {
					break;
				}

				this.robots[i].programManager.setPrograms(programs[i], this.scene.unit)
				this.robots[i].init()

			}

			if(this.robots.length > 0) {
				// BlocklyDebug selection
				const programs = this.robots[0].programManager.getPrograms()

				if(programs.length > 0) {
					BlocklyDebug.init(programs[0])
				} else {
					BlocklyDebug.init(undefined)
				}

			}

		})
	}

	getRobots(): Robot[] {
		return this.robots;
	}

	/**
	 * Adds `robot` to scene (to `robots` array and entities)
	 */
	addRobot(robot: Robot) {
		this.robots.push(robot)
		this.scene.getEntityManager().addEntity(robot)
		this.configurationManager.safeUpdateLastRobot()
	}

	getNumberOfRobots(): number {
		return this.robots.length;
	}

	updateSensorValueView() {
		// TODO: refactor this, the simulation should not have a html/div dependency
		// update sensor value html
		
		if (this.showRobotSensorValues && $('#simValuesModal').is(':visible')) {
			const htmlElement = $('#notConstantValue')
			htmlElement.html('');
			const elementList: { label: string, value: any }[] = []

			elementList.push({label: 'Simulation tick rate:', value: this.scene.getCurrentSimTickRate()})

			this.robots.forEach(robot => robot.addHTMLSensorValuesTo(elementList))
			const htmlString = elementList.map(element => this.htmlSensorValues(element.label, element.value)).join("")
			htmlElement.append(htmlString)
		}
	}

	private htmlSensorValues(label: String, value: any): string {
		return `<div><label>${label}</label><span>${value}</span></div>`
	}

	removeAllEventHandlers() {
		this.robots.forEach(robot => robot.programManager.removeAllEventHandlers())
	}

	/**
	 * remove all robots
	 */
	clear() {
		this.robots.length = 0;
	}


	startPrograms() {
		for(const robot of this.robots) {
			robot.programManager.startPrograms()
		}
	}

	stopPrograms() {
		for(const robot of this.robots) {
			robot.programManager.stopPrograms()
		}
	}

	resumePrograms() {
		for(const robot of this.robots) {
			robot.programManager.startPrograms()
		}
	}

	pausePrograms() {
		for(const robot of this.robots) {
			robot.programManager.pausePrograms()
		}
	}
	
}