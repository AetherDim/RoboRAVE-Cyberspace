import dat = require('dat.gui');
import { Scene } from './Scene/Scene';
import { SceneRender } from './SceneRenderer';
import { Timer } from './Timer';

export const DEBUG = true
/**
 * Used in log.js
 */
export const SEND_LOG = false
/**
 * Used in 'wrap.js' to print the error before it is wrapped
 */
export const PRINT_NON_WRAPPED_ERROR = true


const updatableList: dat.GUIController[] = []

export const DEBUG_UPDATE_TIMER = new Timer(0.5, () => updateDebugDisplay())
DEBUG_UPDATE_TIMER.start()

function updateDebugDisplay() {
	updatableList.forEach(element => {
		element.updateDisplay()
	});
}

export function registerDebugUpdatable(controller: dat.GUIController): dat.GUIController {
	const index = updatableList.indexOf(controller, 0);
	if (index < 0) {
		updatableList.push(controller)
	}
	return controller
}


// Debug GUI Root

/**
 * Root debug view.
 */
export let DebugGuiRoot: dat.GUI|undefined;

export function clearDebugGuiRoot() {
	if(DebugGuiRoot) {
		DebugGuiRoot.destroy()
		DebugGuiRoot = undefined

		createDebugGuiRoot()
	}
}

export function createDebugGuiRoot() {
	if(DEBUG && !DebugGuiRoot) {
		DebugGuiRoot = new dat.GUI({name: 'Debug', autoPlace: true, width: 400})
		const parent = DebugGuiRoot.domElement.parentElement
		if (parent) {
			// move debug gui up to be visible
			parent.style.zIndex = '1000000'
		}
		//const style = DebugGuiRoot.domElement.style
		//style.position = 'absolute'
		//style.left = '70%'
		//style.top = '500'
	}
}

createDebugGuiRoot()



export function initGlobalSceneDebug(sceneRenderer: SceneRender) {
	if(!DEBUG) {
		return
	}

	DebugGuiRoot.addUpdatable('FPS', () => sceneRenderer.app.ticker.FPS)

	const renderer = DebugGuiRoot.addFolder('Renderer')
	renderer.addUpdatable('Screen width', () => sceneRenderer.app.screen.width)
	renderer.addUpdatable('Screen height', () => sceneRenderer.app.screen.height)
	renderer.addUpdatable('devicePixelRatio', () => window.devicePixelRatio || 0.75)

	const debug = DebugGuiRoot.addFolder('Special Debug Functions')
	debug.addButton('Add color sensors to robot', () => {
		const robot = sceneRenderer.getScene().getRobotManager().getRobots()[0]
		let count = 0
		const range = 0.2
		for(let x = -range; x < range; x+=0.02) {
			for(let y = -range; y < range; y+=0.02) {
				robot.addColorSensor('SP' + count++, x, y, 0.01)
			}
		}
	})
	
}



export class SceneDebug {

	readonly scene: Scene
	readonly disabled: boolean

	/**
	 * Static debug gui. Only valid while scene is active/selected.
	 * This debug gui is managed by the renderer.
	 */
	debugGuiStatic?: dat.GUI;

	/**
	 * Dynamic debug gui. Only valid while scene is running.
	 * Will be cleared with scene reset.
	 */
	debugGuiDynamic?: dat.GUI;


	constructor(scene: Scene, disabled: boolean) {
		this.disabled = disabled
		this.scene = scene
		this.createDebugGuiStatic()
	}


	clearDebugGuiDynamic() {
		if(this.debugGuiDynamic) {
			this.deleteDebugGuiDynamic()
			this.createDebugGuiDynamic()
		}
	}
	
	createDebugGuiDynamic() {
		if(DEBUG && !this.disabled && this.debugGuiStatic && !this.debugGuiDynamic) {
			this.debugGuiDynamic = this.debugGuiStatic.addFolder('"Runtime" Debugging')
		}
	}
	
	deleteDebugGuiDynamic() {
		if(this.debugGuiDynamic) {
			this.debugGuiStatic?.removeFolder(this.debugGuiDynamic)
			this.debugGuiDynamic = undefined
		}
	}
	
	
	
	clearDebugGuiStatic() {
		if(this.debugGuiStatic) {
			const dynamic = this.debugGuiDynamic !== undefined
		
			this.deleteDebugGuiStatic()
			this.createDebugGuiStatic()
	
			if(dynamic) {
				this.createDebugGuiDynamic()
			}
		}
	}
	
	createDebugGuiStatic() {
		if(DEBUG && !this.disabled && DebugGuiRoot && !this.debugGuiStatic) {
			this.debugGuiStatic = DebugGuiRoot.addFolder(this.scene.getName())
			this.initSceneDebug()
		}
	}
	
	deleteDebugGuiStatic() {
		if(this.debugGuiStatic) {
			DebugGuiRoot?.removeFolder(this.debugGuiStatic)
			this.debugGuiStatic = undefined
			this.debugGuiDynamic = undefined
		}
	}


	destroy() {
		// this will also destroy the runtime gui
		this.deleteDebugGuiStatic()
	}

	private initSceneDebug() {
		const scene = this.scene
		const gui = this.debugGuiStatic

		gui.add(scene, 'autostartSim')
		gui.add(scene, 'dt').min(0.001).max(0.1).step(0.001).onChange((dt) => scene.setDT(dt))
		gui.add(scene, 'simSleepTime').min(0.001).max(0.1).step(0.001).onChange((s) => scene.setSimSleepTime(s))
		gui.add(scene, 'simSpeedupFactor').min(1).max(10000).step(1).onChange((dt) => scene.setDT(dt))
		gui.add(scene, 'blocklyUpdateSleepTime').min(0.001).max(0.1).step(0.001).onChange((s) => scene.setBlocklyUpdateSleepTime(s))

		const unit = gui.addFolder('unit converter')
		unit.addUpdatable('m', () => scene.unit.getLength(1))
		unit.addUpdatable('kg', () => scene.unit.getMass(1))
		unit.addUpdatable('s', () => scene.unit.getTime(1))

		const loading = gui.addFolder('loading states')
		loading.addUpdatable('currentlyLoading', createReflectionGetter(this.scene, 'currentlyLoading'))
		loading.addUpdatable('resourcesLoaded', createReflectionGetter(this.scene, 'resourcesLoaded'))
		loading.addUpdatable('hasBeenInitialized', createReflectionGetter(this.scene, 'hasBeenInitialized'))
		loading.addUpdatable('hasFinishedLoading', createReflectionGetter(this.scene, 'hasFinishedLoading'))

		loading.addUpdatable('loadingStartTime', createReflectionGetter(this.scene, 'loadingStartTime'))
		loading.addUpdatable('minLoadTime', createReflectionGetter(this.scene, 'minLoadTime'))

		const robot = gui.addFolder('Robot Manager')
		const rm = scene.getRobotManager()

		robot.add(rm, 'numberOfRobots').min(1).step(1).max(1000)
		robot.add(rm, 'showRobotSensorValues')
		robot.addUpdatable('Actual number of robots', () => rm.getRobots().length)

		const program = robot.addFolder('Program Manager')
		const pm = rm.getProgramManager()

		program.add(pm, 'programPaused')
		program.addUpdatable('debugMode', createReflectionGetter(pm, 'debugMode'))
		program.addUpdatable('initialized', createReflectionGetter(pm, 'initialized'))
		program.addUpdatable('allowBlocklyUpdate', createReflectionGetter(pm, 'allowBlocklyUpdate'))

		const entity = gui.addFolder('Entity Manager')
		const em = scene.getEntityManager()
		entity.addUpdatable('Number of entities', () => em.getNumberOfEntities())
		entity.addUpdatable('Number of updatable entities', () => em.getNumberOfUpdatableEntities())
		entity.addUpdatable('Number of drawable physics entities', () => em.getNumberOfDrawablePhysicsEntities())

	}


}


export function createReflectionGetter(param: any, name: string) {
	return () => param[name]
}


/**
 * Dat GUI modifications
 */
declare module 'dat.gui' {

	export interface GUI {

		addButton(name: string, callback: () => void) : dat.GUIController
		addUpdatable(name: string, callback: () => Object) : dat.GUIController

	}

}

dat.GUI.prototype.addButton = function (name: string, callback: () => void) : dat.GUIController {
	const func = {}
	func[name] = callback
	return this.add(func, name)
}

dat.GUI.prototype.addUpdatable = function (name: string, callback: () => Object) : dat.GUIController {
	const func = {}
	func[name] = callback()
	const gui = this.add(func, name) as dat.GUIController
	gui.getValue = function () {
		return callback()
	}
	registerDebugUpdatable(gui)
	return gui
}

export function downloadFile(filename: string, data: BlobPart[], options?: BlobPropertyBag) {
	const blob = new Blob(data, options);
	const link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	link.download = filename;
	link.click();
}

export function downloadJSONFile(filename: string, data: any, prettify: boolean = true) {
	downloadFile(filename, [JSON.stringify(data, undefined, prettify ? "\t" : undefined)])
}

const addFolderFunc = dat.GUI.prototype.addFolder

function addFolderToGUI(gui: dat.GUI, name: string, i: number): dat.GUI {
	const newName = name + ' ' + i
	if(gui.__folders[newName]) {
		return addFolderToGUI(gui, name, i+1)
	} else {
		return addFolderFunc.apply(gui, [newName])
	}
}

dat.GUI.prototype.addFolder = function (name: string): dat.GUI {
	if(this.__folders[name]) {
		return addFolderToGUI(this, name, 1)
	}
	return addFolderFunc.apply(this, [name])
}


function removeControllerFromUpdateTimer(controller: dat.GUIController) {
	const index = updatableList.indexOf(controller, 0);
	if (index > -1) {
		updatableList.splice(index, 1);
		//console.error('Removing dat.GUIController')
	}
}

function removeFolderFromUpdateTimer(folder: dat.GUI) {
	for(const name in folder.__folders) {
		removeFolderFromUpdateTimer(folder.__folders[name])
	}
	folder.__controllers.forEach(controller => removeControllerFromUpdateTimer(controller))
}


const removeFolderFromGui = dat.GUI.prototype.removeFolder

dat.GUI.prototype.removeFolder = function(sub: dat.GUI) {
	removeFolderFromUpdateTimer(sub)
	removeFolderFromGui.call(this, sub)
	//console.log('Removing dat.GUI (Folder)')
}

const removeGUIController = dat.GUI.prototype.remove

dat.GUI.prototype.remove = function(controller: dat.GUIController) {
	removeControllerFromUpdateTimer(controller)
	removeGUIController.call(this, controller)
	//console.log('Removing dat.GUIController')
}

