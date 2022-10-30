import { RobertaRobotSetupData } from "../Robot/RobertaRobotSetupData"
import { SimulationCache } from "./SimulationCache"
import { Scene } from "../Scene/Scene"
import { RRCScoreScene } from "../RRC/Scene/RRCScoreScene"
import { SceneRender } from "../SceneRenderer"
import { SceneDescriptor, SceneManager } from "./SceneManager"
import { EventManager, ParameterTypes } from "../EventManager/EventManager"
import { BlocklyDebug } from "../BlocklyDebug"
import { DebugGuiRoot } from "../GlobalDebug"
import { Timer } from "../Timer"


export class Cyberspace {

	private readonly sceneManager = new SceneManager()
	private readonly renderer: SceneRender

	private simulationCache: SimulationCache = new SimulationCache([], "")

	readonly eventManager = EventManager.init({
		/** will be called after the simulation has been started */
		onStartSimulation: ParameterTypes.none,
		/** will be called after the simulation has been paused */
		onPauseSimulation: ParameterTypes.none,

		/** will be called after the program has been started */
		onStartPrograms: ParameterTypes.none,
		/** will be called after the program has been paused or stopped */
		onPausePrograms: ParameterTypes.none,
		/** will be called after the program has been stopped */
		onStopPrograms: ParameterTypes.none
	})

	readonly specializedEventManager = new class SpecializedEventManager {
		private handlerSetters: ((scene: Scene) => void)[] = []
		/**
		 * Adds the function `setHandler` which is later called in `Cyberspace.resetEventHandlersOfScene(scene)`.
		 * 
		 * @param sceneType The type of the scene
		 * @param setHandler The function which sets the event handlers of a scene of type `sceneType`.
		 */
		addEventHandlerSetter<S extends Scene>(sceneType: new (...args: any) => S, setHandler: (scene: S) => void) {
			this.handlerSetters.push(scene => {
				if (scene instanceof sceneType) {
					setHandler(scene)
				}
			})
		}
		/**
		 * Sets the specified event handlers for `scene`.
		 * 
		 * This method should only be called inside `Cyberspace`.
		 */
		_setEventHandlers(scene: Scene) {
			this.handlerSetters.forEach(handlerSetter => handlerSetter(scene))
		}
	}

	constructor(canvas: HTMLCanvasElement | string, autoResizeTo?: HTMLElement | string, scenes: SceneDescriptor[] = []) {
		this.sceneManager.registerScene(...scenes)
		// empty scene as default
		const emptyScene = new Scene("")
		this.renderer = new SceneRender(emptyScene, canvas, this.simulationCache.toRobotSetupData(), autoResizeTo)

		this.renderer.onSwitchScene(scene => this.resetEventHandlersOfScene(scene))

		this.initDebugGUI()
	}

	destroy() {
		this.sceneManager.destroy()
		this.renderer.destroy()
	}

	private initDebugGUI() {
		if (DebugGuiRoot == undefined) {
			return
		}

		const cyberspaceFolder = DebugGuiRoot.addFolder("Cyberspace")
		cyberspaceFolder.addUpdatable("Scene name", () => this.getScene().name)
		cyberspaceFolder.addButton("Reload 10 times", () => {
			let count = 0
			new Timer(0.1, (_, timer) => {
				if (count < 10) {
					this.resetScene()
					// UIManager.resetSceneButton.jQueryHTMLElement.trigger("click")
				} else {
					timer.stop()
				}
				count++
			}).start()
		})
	}

	/* ############################################################################################ */
	/* ####################################### Scene control ###################################### */
	/* ############################################################################################ */

	private resetEventHandlersOfScene(scene: Scene) {
		scene.removeAllEventHandlers()

		this.specializedEventManager._setEventHandlers(scene)

		const eventHandlerLists = this.eventManager.eventHandlerLists

		scene.eventManager.onFinishedLoading(() => {
			for(const robot of scene.getRobotManager().getRobots()) {
				// FIXME: first program of first robot only?
				const programManagerEventHandlerLists = robot.programManager.eventManager.eventHandlerLists
				programManagerEventHandlerLists.onStartProgram.pushEventHandleList(
					eventHandlerLists.onStartPrograms)
				programManagerEventHandlerLists.onPauseProgram.pushEventHandleList(
					eventHandlerLists.onPausePrograms)
				programManagerEventHandlerLists.onStopProgram.pushEventHandleList(
					eventHandlerLists.onStopPrograms)
			}
		})

		const sceneEventHandlerLists = scene.eventManager.eventHandlerLists
		sceneEventHandlerLists.onStartSimulation.pushEventHandleList(
			eventHandlerLists.onStartSimulation)
		sceneEventHandlerLists.onPauseSimulation.pushEventHandleList(
			eventHandlerLists.onPauseSimulation)
	}

	resetScene() {
		this.renderer.getScene().reset(this.simulationCache.toRobotSetupData())
	}

	fullResetScene() {
		this.renderer.getScene().fullReset(this.simulationCache.toRobotSetupData())
	}

	getScene(): Scene {
		return this.renderer.getScene()
	}

	getScoreScene(): RRCScoreScene|undefined {
		const scene = this.renderer.getScene()
		if(scene instanceof RRCScoreScene) {
			return scene
		}
		return undefined
	}

	getScenes(): SceneDescriptor[] {
		return this.sceneManager.getSceneDescriptorList()
	}

	private switchToScene(scene: Scene) {
		this.stopPrograms()
		this.renderer.switchScene(this.simulationCache.toRobotSetupData(), scene)
		if (scene.isLoadingComplete()) {
			this.fullResetScene()
		}
	}

	loadScene(ID: string, forced: boolean = false) {
		if(this.getScene().isLoadingComplete()) {
			const scene = this.sceneManager.getScene(ID)
			if(scene) {
				this.sceneManager.setCurrentScene(ID)
				this.switchToScene(scene)
			}
		}
	}

	/**
	 *
	 * @param forced whether we should load while the current scene is loading
	 */
	switchToNextScene(forced: boolean = false): SceneDescriptor {
		if(forced || this.getScene().isLoadingComplete()) {
			const scene = this.sceneManager.getNextScene()
			if(scene != undefined) {
				this.switchToScene(scene)
			}
		}
		return this.sceneManager.getCurrentSceneDescriptor()!
	}

	getSceneManager() {
		return this.sceneManager
	}

	robotCount() {
		return this.getScene().getRobotManager().getNumberOfRobots()
	}

	
	/* ############################################################################################ */
	/* #################################### Simulation control #################################### */
	/* ############################################################################################ */

	startSimulation() {
		this.getScene().startSim()
	}

	pauseSimulation() {
		this.getScene().pauseSim()
	}

	resetSimulation() {
		this.resetScene()
	}

	setSimulationSpeedupFactor(speedup: number) {
		this.getScene().setSpeedUpFactor(speedup)
	}

	
	/* ############################################################################################ */
	/* ##################################### Program control ###################################### */
	/* ############################################################################################ */

	getRobotManager() {
		return this.getScene().getRobotManager()
	}

	startPrograms() {
		this.getRobotManager().startPrograms()
	}

	stopPrograms() {
		this.getRobotManager().stopPrograms()
	}

	resumePrograms() {
		this.getRobotManager().startPrograms()
	}

	pausePrograms() {
		this.getRobotManager().pausePrograms()
	}

	setDebugMode(state: boolean) {
		BlocklyDebug.getInstance().updateDebugMode(state)
	}

	isDebugMode() {
		return BlocklyDebug.getInstance().isDebugMode()
	}


	/**
	 * Set the RobertaRobotSetupData where the first program in the robertaRobotSetupDataList should be the Blockly
	 * workspace program which is used for debugging. If this is not the case, debugging won't be possible.
	 * @param robertaRobotSetupDataList
	 * @param robotType 
	 */
	setRobertaRobotSetupData(robertaRobotSetupDataList: RobertaRobotSetupData[], robotType: string) {
		const newSimulationCache = new SimulationCache(robertaRobotSetupDataList, robotType)
		const oldCache = this.simulationCache
		this.simulationCache = newSimulationCache

		if (!newSimulationCache.hasEqualConfiguration(oldCache)) {
			// sets the robot programs and sensor configurations based on 'simulationCache'
			this.resetScene()
		} else {
			this.getScene().setPrograms(this.simulationCache.toRobotSetupData())
		}
	}


	/* ############################################################################################ */
	/* #################################### ScrollView control #################################### */
	/* ############################################################################################ */

	/**
	 * Reset zoom of ScrollView
	 */
	resetView() {
		this.renderer.zoomReset()
	}

	/**
	 * Zoom into ScrollView
	 */
	zoomViewIn() {
		this.renderer.zoomIn()
	}

	/**
	 * zoom out of ScrollView
	 */
	zoomViewOut() {
		this.renderer.zoomOut()
	}

}