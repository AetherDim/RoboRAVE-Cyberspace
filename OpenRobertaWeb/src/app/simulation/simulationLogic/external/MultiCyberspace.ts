import { Cyberspace } from "../Cyberspace/Cyberspace"
import { clearDebugGuiRoot, DebugGuiRoot, initGlobalDebug } from "../GlobalDebug"
import { RobertaRobotSetupData } from "../Robot/RobertaRobotSetupData"
import { RobotProgramGenerator } from "../Robot/RobotProgramGenerator"
import { UIManager } from "../UI/UIManager"
import { Utils } from "../Utils"
import { cyberspaceScenes, sceneIDMap } from "./SceneDesciptorList"
import { sendProgramRequest, ProgramsRequestResult, ResultErrorType, sendSetScoreRequest } from "./RESTApi"
import PROGRAM_MODEL = require("../program.model")
import GUISTATE_MODEL = require("../guiState.model")
import { RRCScoreScene } from "../RRC/Scene/RRCScoreScene"
import { KeyManager } from "../KeyManager"


const cyberspaceDataList: CyberspaceData[] = []

initGlobalDebug()
KeyManager.setup()

const simDiv = document.getElementById("simDiv")!
if (simDiv == null) {
	console.error("There is no 'simDiv' element.")
}

const multiCyberspaceDiv = document.createElement("div")
multiCyberspaceDiv.style.backgroundColor = "rgb(50, 50, 50)"
multiCyberspaceDiv.style.width = "100%"
multiCyberspaceDiv.style.height = "100%"
simDiv.appendChild(multiCyberspaceDiv)

//simDiv.style.backgroundColor = "black"
const sceneDescriptors = cyberspaceScenes

class CyberspaceData {
	cyberspace: Cyberspace
	divElement: HTMLElement
	groupNameStyle: CSSStyleDeclaration

	constructor(cyberspace: Cyberspace, divElement: HTMLElement, groupNameStyle: CSSStyleDeclaration) {
		this.cyberspace = cyberspace
		this.divElement = divElement
		this.groupNameStyle = groupNameStyle
	}
}

function everyScoreSceneIsFinished(): boolean {
	return cyberspaceDataList.every(c => {
		const scene = c.cyberspace.getScene()
		if (scene instanceof RRCScoreScene) {
			return scene.getRobotManager().allProgramsTerminated()
		} else {
			return true
		}
	})
}

function setCSSnoUserDragAndSelect(style: CSSStyleDeclaration) {
	// no text selection
	// see https://stackoverflow.com/questions/3779534/how-do-i-disable-text-selection-with-css-or-javascript
	style.setProperty("-webkit-touch-callout", "none") /* iOS Safari */
	style.setProperty("-webkit-user-select", "none") /* Safari */
	style.setProperty("-khtml-user-select", "none") /* Konqueror HTML */
	style.setProperty("-moz-user-select", "none") /* Firefox */
	style.setProperty("-ms-user-select", "none") /* Internet Explorer/Edge */
	style.setProperty("user-select", "none") /* Non-prefixed version, currently supported by Chrome and Opera */
	// no text dragging
	style.setProperty("user-drag", "none")
	style.setProperty("-webkit-user-drag", "none")
}

function scoreSceneAddEventHandler(
	scoreScene: RRCScoreScene,
	groupName: string,
	programID: number | undefined,
	secretKey: string,
	groupNameStyle: CSSStyleDeclaration,
	disqualifyButton: HTMLButtonElement
) {

	disqualifyButton.hidden = false

	let isDisqualified = false
	function updateButtonColor() {
		const color = isDisqualified ? "red" : "white"
		disqualifyButton.style.backgroundColor = color
	}
	disqualifyButton.onclick = () => {
		isDisqualified = !isDisqualified
		disqualifyButton.childNodes[0].remove()
		disqualifyButton.append(isDisqualified ? "Requalify" : "Disqualify")
		updateButtonColor()
	}

	function onScoreRequestError() {
		disqualifyButton.disabled = false
		groupNameStyle.backgroundColor = "red"
		updateButtonColor()
	}
	scoreScene.scoreEventManager.onShowHideScore(state => {
		if (state == "showScore") {
			scoreScene.pauseSim()
		}
		if (state == "showScore" && everyScoreSceneIsFinished()) {
			UIManager.showScoreButton.setState("hideScore")
			UIManager.physicsSimControlButton.setState("start")
		}
		if (state == "showScore") {
			if (programID == undefined) {
				return
			}
			updateButtonColor()
			// maximum signed int32 (2^32 - 1)
			// https://dev.mysql.com/doc/refman/5.6/en/integer-types.html
			const maxTime = 2147483647
			let score = Math.round(scoreScene.score * 1000)
			let time = Math.round(Utils.flatMapOptional(scoreScene.getProgramRuntime(), runtime => runtime * 1000) ?? maxTime)
			let comment = ""
			// reset to white. In case of rescoring we see a brief white
			groupNameStyle.backgroundColor = "white"
			if (isDisqualified) {
				score = 0
				time = maxTime
				comment = "This program is disqualified"
			}
			sendSetScoreRequest({
				secret: { secret: secretKey },
				programID: programID,
				score: score,
				time: time,
				comment: comment,
				modifiedBy: scoreScene.name + " " + new Date(),
			 }, (result) => {

				if(!result) {
					alert(`Score set for team ${groupName} request failed`)
					onScoreRequestError()
					return
				}

				if(result.error != ResultErrorType.NONE) {
					alert(result.message)
					onScoreRequestError()
					return
				}

				groupNameStyle.backgroundColor = "rgb(0, 200, 0)"
				Utils.log(`Score for team ${groupName} [ID: ${programID}] successfully sent`)
			 })
		}
	})
}

function createCyberspaceData(sceneID: string, groupName: string, programID: number | undefined, secretKey: string): CyberspaceData {
	const canvas = document.createElement("canvas")
	const cyberspaceDiv = document.createElement("div")
	setCSSnoUserDragAndSelect(cyberspaceDiv.style)
	cyberspaceDiv.appendChild(canvas)

	const groupNameDiv = document.createElement("div")
	groupNameDiv.style.position = "absolute"
	groupNameDiv.style.top = "2"
	groupNameDiv.style.left = "2"
	groupNameDiv.style.pointerEvents = "none"
	groupNameDiv.style.zIndex = "100" // above the canvas
	const groupNameParagraph = document.createElement("p")
	groupNameParagraph.textContent = groupName
	groupNameDiv.appendChild(groupNameParagraph)
	const groupNameStyle = groupNameParagraph.style
	groupNameStyle.display = "inline"
	groupNameStyle.backgroundColor = "white"
	groupNameStyle.borderRadius = "5px"
	groupNameStyle.fontSize = "20"
	groupNameStyle.paddingLeft = "3"
	groupNameStyle.paddingRight = "3"

	cyberspaceDiv.appendChild(groupNameDiv)

	const disqualifyButton = document.createElement("button")
	disqualifyButton.append("Disqualify")
	disqualifyButton.hidden = true
	const disqualifyButtonStyle = disqualifyButton.style
	disqualifyButtonStyle.position = "absolute"
	disqualifyButtonStyle.top = "2"
	disqualifyButtonStyle.right = "2"
	disqualifyButtonStyle.border = "none"
	disqualifyButtonStyle.borderRadius = "5px"
	disqualifyButtonStyle.backgroundColor = "white"

	cyberspaceDiv.append(disqualifyButton)

	const cyberspace = new Cyberspace(canvas, cyberspaceDiv, sceneDescriptors)
	cyberspace.specializedEventManager
		.addEventHandlerSetter(RRCScoreScene,
			scoreScene => scoreSceneAddEventHandler(scoreScene, groupName, programID, secretKey, groupNameStyle, disqualifyButton)
		)

	cyberspace.loadScene(sceneID)
	
	return new CyberspaceData(cyberspace, cyberspaceDiv, groupNameStyle)
}

function setGridStyle(gridElements: HTMLElement[][], opt?: { relativePadding?: number }) {
	const relativePadding = opt?.relativePadding ?? 0

	const heightCount = gridElements.length
	const height = (100 - relativePadding) / heightCount
	const heightStr = String(height - relativePadding) + "%"
	for (let y = 0; y < heightCount; y++) {
		const widthCount = gridElements[y].length
		const width = (100 - relativePadding) / widthCount
		const widthStr = String(width - relativePadding ) + "%"
		const topStr = String(y * height + relativePadding) + "%"
		for (let x = 0; x < widthCount; x++) {
			const style = gridElements[y][x].style
			style.left = String(x * width + relativePadding) + "%"
			style.top = topStr
			style.width = widthStr
			style.height = heightStr
			style.position = "absolute"
		}
	}
}

let sceneCount = 4
const aspectRatio = {
	window: 16/9,
	scene: 16/9
}

const debug = DebugGuiRoot
if (debug != undefined) {
	const secretKey = ""
	debug.addButton("Reset and close debug GUI", () => {
		loadScenes(generateRandomMultiSetupData(sceneCount), secretKey)
		DebugGuiRoot?.close()
	})
	debug.addButton("Reset", () => {
		loadScenes(generateRandomMultiSetupData(sceneCount), secretKey)
	})
}

function generateDebugRobertaRobotSetupData(count: number): RobertaRobotSetupData[] {
	return Utils.range(0, count).map(index => {
		return {
			configuration: {
				TRACKWIDTH: 18,
				WHEELDIAMETER: 5.6,
				SENSORS: {
					"1": "TOUCH",
					"3": "COLOR"
				}
			},
			javaScriptProgram: RobotProgramGenerator.generateProgram([
				RobotProgramGenerator.driveForwardOpCodes(100, 0.1 * index + 0.1)
			]).javaScriptProgram
		}
	})
}

interface MultiCyberspaceSetupData {
	sceneID: string
	groupName: string
	robertaRobotSetupData: RobertaRobotSetupData
	programID?: number
}

//
// The following code is mostly copied from the original open roberta code to preserve as much as possible.
// We do not want to alter the program code in any way.
//

interface DecodedProgramURI {
	robotType: string
	programName: string
	programXML: string
}

function convertProgramURI(programURI: string): DecodedProgramURI | undefined {
	// old style queries
	let target = decodeURI(programURI).split("&&");
	if (target[0].endsWith("#loadProgram") && target.length >= 4) {
		return {
			robotType: target[1], 
			programName: target[2],
			programXML: target[3]
		}
	} else {
		console.error("Invalid program")
	}
	return undefined
}


function loadProgramFromXML(name: string, xml: string, callback: (setupData: RobertaRobotSetupData) => void) {
	if (xml.search("<export") === -1) {
		xml = '<export xmlns="http://de.fhg.iais.roberta.blockly"><program>' + xml + '</program><config>' + GUISTATE_MODEL.getConfigurationXML()
			+ '</config></export>';
	}
	PROGRAM_MODEL.loadProgramFromXML(name, xml, function(result) {

		if(result.rc !== "ok") {
			alert('Server did not successfully convert program!');
			return;
		}

		var isNamedConfig = false;
		var configName = undefined;
		var language = GUISTATE_MODEL.gui.language;


		PROGRAM_MODEL.runInSim(result.programName, configName, result.progXML, result.confXML, language, function(result) {
			if (result.rc == "ok") {
				try {
					callback(result)
					//SIM.init([result], true, GUISTATE_MODEL.gui.robotGroup);
				} catch (e) {
					console.error(e)
				}
			} else {
				alert('Unable to process program for simulation!');
			}
		})

	})
}

function loadScenesFromRequest(result: ProgramsRequestResult | undefined, secretKey: string) {

	if(!result) {
		alert("Program request failed")
		return
	}

	if(result.error != ResultErrorType.NONE) {
		alert(result.message)
		return
	}

	const res = result.result
	if (res) {
		
		const map = new Map<number, RobertaRobotSetupData>();
		let programCount = res.length

		res.forEach((robotProgramEntry, index) => {
			const programURI = robotProgramEntry.program
			const decodedProgramURI = convertProgramURI(programURI)
			if (decodedProgramURI == undefined) {
				programCount -= 1
				return
			}
			// TODO: Use other parameters
			const programXML = decodedProgramURI.programXML
			loadProgramFromXML(decodedProgramURI.programName, programXML, setupData => {
				map.set(index, setupData)
				if (map.size == programCount) {

					// if all programs are converted
					const setupDataList = Utils.mapNotNull(Utils.range(0, map.size), i => {

						const ageGroup = String(res[i].agegroup)
						const challenge = String(res[i].challenge)
						const programID = res[i].id
						if(Object.keys(sceneIDMap).includes(challenge)) {
							const groups = (<any>sceneIDMap)[challenge]
							if(Object.keys(groups).includes(ageGroup)) {
								return {
									sceneID: groups[ageGroup],
									groupName: res[i].name,
									robertaRobotSetupData: map.get(i)!,
									programID: programID
								}
							} else {
								console.error('Unknown age group ID !!!')
							}
						} else {
							console.error('Unknown challenge ID !!!')
						}

						return undefined
					})


					loadScenes(setupDataList, secretKey)
				}
			})
		})
		
	} else {
		console.error("No result for programs request")
	}
	
}

function generateRandomMultiSetupData(count: number): MultiCyberspaceSetupData[] {
	return generateDebugRobertaRobotSetupData(count).map((robertaRobotSetupData, index) => {
		return {
			sceneID: Utils.randomElement(cyberspaceScenes)!.ID,
			groupName: "Test group " + index,
			robertaRobotSetupData: robertaRobotSetupData,
			programID: index
		}
	})
}

function startPrograms() {
	forEachCyberspace(cyberspace => cyberspace.startPrograms())
}

function loadScenes(setupDataList: MultiCyberspaceSetupData[], secretKey: string) {

	// clear complete debug
	clearDebugGuiRoot()

	// add my debug
	const debug = DebugGuiRoot
	if (debug != undefined) {
		debug.addButton("Add scene", () => {
			sceneCount += 1
			loadScenes(generateRandomMultiSetupData(sceneCount), secretKey)
		})
		debug.addButton("Remove scene", () => {
			if (sceneCount > 0) {
				sceneCount -= 1
				loadScenes(generateRandomMultiSetupData(sceneCount), secretKey)
			}
		})
		debug.addButton("Reload", () => {
			loadScenes(generateRandomMultiSetupData(sceneCount), secretKey)
		})
		debug.addButton("Start programs", () => {
			startPrograms()
		})
		debug.add(aspectRatio, "window", 0.1, 2)
		debug.add(aspectRatio, "scene", 0.1, 2)
	}


	const newCyberspaceDataList = setupDataList.map(setupData => {
		const cyberspaceData = createCyberspaceData(setupData.sceneID, setupData.groupName, setupData.programID, secretKey)
		cyberspaceData.cyberspace.getScene().runAfterLoading(() => {
			cyberspaceData.cyberspace.setRobertaRobotSetupData([setupData.robertaRobotSetupData], "") // TODO: Robot type???
		})
		return cyberspaceData
	})
	const divElements = newCyberspaceDataList.map(data => data.divElement)
	// remove all cyberspace div nodes
	while (multiCyberspaceDiv.hasChildNodes()) {
		multiCyberspaceDiv.lastChild?.remove()
	}
	// add new cyberspace div nodes
	divElements.forEach(element =>
		multiCyberspaceDiv.appendChild(element)	
	)
	// destroy all cyberspaces
	forEachCyberspace(cyberspace => {
		cyberspace.destroy()
	})
	cyberspaceDataList.length = 0
	cyberspaceDataList.push(...newCyberspaceDataList)

	const windowAspectRatio = aspectRatio.window
	const sceneAspectRatio = aspectRatio.scene
	// given
	//   - divCount: int
	//   - windowAspectRatio: float
	// unknown
	//   - heightCount: int
	//   - widthCount: int
	//
	// windowAspectRatio = (widthCount * sceneWidth) / (heightCount * sceneHeight)
	//                   = widthCount / heightCount * sceneAspectRatio
	// <=> widthCount = heightCount * windowAspectRatio / sceneAspectRatio
	//
	//     divCount <= heightCount * widthCount
	// <=> divCount <= heightCount * (heightCount * windowAspectRatio / sceneAspectRatio)
	// <=> sqrt(divCount * sceneAspectRatio / windowAspectRatio) <= heightCount
	// or
	// <=> sqrt(divCount / sceneAspectRatio * windowAspectRatio) <= widthCount
	const divCount = divElements.length
	// const heightCount = Math.ceil(Math.sqrt(divElements.length * sceneAspectRatio / windowAspectRatio))
	// const widthCount = Math.ceil(divCount / heightCount)
	const widthCount = Math.ceil(Math.sqrt(divElements.length / sceneAspectRatio * windowAspectRatio))

	const indices = Utils.range(0, divCount)
	setGridStyle(
		Utils.map2D(
			Utils.reshape1Dto2D(indices, widthCount)
			, index => divElements[index]
		)
		, {
			relativePadding: 1
		}
	)
}

//loadScenes(generateRandomMultiSetupData(sceneCount))


// called only once
export function init(robotSetupDataIDs: number[], secretKey: string) {
	sendProgramRequest({
		secret: { secret: secretKey },
		programs: robotSetupDataIDs
	}, request => loadScenesFromRequest(request, secretKey))
}

function forEachCyberspace(block: (cyberspace: Cyberspace) => void) {
	cyberspaceDataList.forEach(data => block(data.cyberspace))
}

function setPause(pause: boolean) {
	if(pause) {
		forEachCyberspace(c => c.pausePrograms())
	} else {
		forEachCyberspace(c => c.startPrograms())
	}
}

// TODO: Remove?
function run(refresh: boolean, robotType: any) {
	Utils.log("run!")
}

/**
 * on stop program
 */
function stopProgram() {
	forEachCyberspace(c => c.stopPrograms())
}

/**
 * Reset robot position and zoom of ScrollView
 */
function resetPose() {
	forEachCyberspace(c => c.resetScene())
}

function sim(run: boolean) {
	if(run) {
		forEachCyberspace(c => c.startSimulation())
	} else {
		forEachCyberspace(c => c.pauseSimulation())
	}
}

function zoomIn() {
	forEachCyberspace(c => c.zoomViewIn())
}

function zoomOut() {
	forEachCyberspace(c => c.zoomViewOut())
}

function zoomReset() {
	forEachCyberspace(c => c.resetView())
}

function setSimSpeed(speedup: number) {
	forEachCyberspace(c => c.setSimulationSpeedupFactor(speedup))
}

function setInitialButtonState() {
	// do not set 'simSpeedUpButton' since the state will be preserved
	UIManager.programControlButton.setInitialState()
	UIManager.showScoreButton.setInitialState()
	UIManager.physicsSimControlButton.setInitialState()
}

export function initEvents() {

	setInitialButtonState()

	UIManager.programControlButton.onClick(state => {
		if (state == "start") {
			// run(true, ...) // cannot get robot type
			setPause(false)
		} else {
			// setPause(true) // not needed
			stopProgram()
		}
	})

	UIManager.showScoreButton.onClick(state => {
		const visible = state == "showScore"
		forEachCyberspace(cyberspace => {
			cyberspace.pauseSimulation()
			const scene = cyberspace.getScene()
			if (scene instanceof RRCScoreScene) {
				scene.showScoreScreen(visible)
			}
		})
		// set to "start" state since the simulation is paused
		UIManager.physicsSimControlButton.setState("start")
	})

	UIManager.physicsSimControlButton.onClick(state =>
		sim(state == "start"))

	UIManager.simSpeedUpButton.setState("fastForward")
	UIManager.simSpeedUpButton.onClick(state =>
		setSimSpeed(state == "fastForward" ? 10 : 1))

	UIManager.resetSceneButton.onClick(() => {
		setInitialButtonState()
		resetPose()
		// reset sim group name style
		cyberspaceDataList.forEach(data => {
			data.groupNameStyle.backgroundColor = "white"
		})
	})
	UIManager.zoomOutButton.onClick(zoomOut)
	UIManager.zoomInButton.onClick(zoomIn)
	UIManager.zoomResetButton.onClick(zoomReset)

}