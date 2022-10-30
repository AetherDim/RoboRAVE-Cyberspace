import { Utils } from "../../Utils";
import {Scene} from "../Scene";

export class ContainerManager {

	private readonly scene: Scene

	constructor(scene: Scene) {
		this.scene = scene
		// setup graphic containers
		this.setupContainers();
	}

	/**
	 * layer 0: ground
	 */
	readonly groundContainer = new PIXI.Container();
	/**
	 * z-index for PIXI, this will define the rendering layer
	 */
	readonly groundContainerZ = 0;

	/**
	 * layer 1: ground animation
	 */
	readonly groundAnimationContainer = new PIXI.Container()
	/**
	 * z-index for PIXI, this will define the rendering layer
	 */
	readonly groundAnimationContainerZ = 10;

	/**
	 * layer 2: entity bottom layer (shadows/effects/...)
	 */
	readonly entityBottomContainer = new PIXI.Container()
	/**
	 * z-index for PIXI, this will define the rendering layer
	 */
	readonly entityBottomContainerZ = 20;

	/**
	 * layer 3: physics/other things <- robots
	 */
	readonly entityContainer = new PIXI.Container()
	/**
	 * z-index for PIXI, this will define the rendering layer
	 */
	readonly entityContainerZ = 30;

	/**
	 * layer 4: for entity descriptions/effects
	 */
	readonly entityTopContainer = new PIXI.Container()
	/**
	 * z-index for PIXI, this will define the rendering layer
	 */
	readonly entityTopContainerZ = 40;

	/**
	 * layer 5: top/text/menus
	 */
	readonly topContainer = new PIXI.Container()
	readonly topContainerZ = 50;


	readonly containerList: PIXI.Container[] = [
		this.groundContainer,
		this.groundAnimationContainer,
		this.entityBottomContainer,
		this.entityContainer,
		this.entityTopContainer,
		this.topContainer
	];

	protected setupContainers() {
		this.groundContainer.zIndex = this.groundContainerZ;
		this.groundAnimationContainer.zIndex = this.groundAnimationContainerZ;
		this.entityBottomContainer.zIndex = this.entityBottomContainerZ;
		this.entityContainer.zIndex = this.entityContainerZ;
		this.entityTopContainer.zIndex = this.entityTopContainerZ;
		this.topContainer.zIndex = this.topContainerZ;
	}

	registerToEngine() {
		const renderer = this.scene.getRenderer()
		if (!renderer) {
			console.warn('No renderer to register containers to!');
			return
		}
		this.containerList.forEach(container => {
			renderer.add(container);
		});
	}

	setVisibility(visible: boolean) {
		this.containerList.forEach(container => {
			container.visible = visible;
		});
	}

	//protected removeTexturesOnUnload = true;
	//protected removeBaseTexturesOnUnload = true;

	private recursiveDestroySomeObjects(displayObject: PIXI.DisplayObject) {
		// Destroy all 'PIXI.Text' objects in order to prevent a large memory leak
		// Note: Do not reuse 'PIXI.Text' objects for this reason
		//
		// maybe also destroy 'PIXI.Graphics' since it could be a minor memory leak
		if (displayObject instanceof PIXI.Text){// || displayObject instanceof PIXI.Graphics) {
			displayObject.destroy(true as any)
		} else if (displayObject instanceof PIXI.Container) {
			displayObject.children.slice().forEach(c => this.recursiveDestroySomeObjects(c))
		}
	}

	private clearContainer(container: PIXI.Container) {
		this.recursiveDestroySomeObjects(container)
		container.removeChildren();
	}


	private _initialGroundDataFunction(x: number, y: number, w: number, h: number): number[] {
		this.updateGroundImageDataFunction()
		return this.getGroundImageData(x, y, w, h) // very hacky
	}

	resetGroundDataFunction() {
		this.getGroundImageData = this._initialGroundDataFunction
	}

	private pixelData = new Uint8Array()
	_getPixelData(): Uint8Array {
		return this.pixelData
	}
	getGroundImageData: (x: number, y: number, w: number, h: number) => number[] = this._initialGroundDataFunction

	updateGroundImageDataFunction() {
		console.log('init color sensor texture')
		const groundVisible = this.groundContainer.visible
		this.groundContainer.visible = true // the container needs to be visible for this to work
	
		const bounds = this.groundContainer.getLocalBounds()
		const width = this.groundContainer.width
		const height = this.groundContainer.height
		const resolution = 1
		// TODO: Test performance of color change of raw pixel data
		// this.groundContainer.removeChild(...this.groundContainer.children.filter(c => c.name == "My Texture"))
		const textureData = this.scene.getRenderer()?.convertToPixels(this.groundContainer, resolution)
		if (textureData != undefined) {
			const pixelData = textureData.data
			this.pixelData = pixelData
			console.log("Ground container pixels checksum of " + this.scene.name + ": "+Utils.checksumFNV32(pixelData))
			// console.time("change array colors")
			// const w = Math.round(width)
			// for (let x = 0; x < textureData.width; x++) {
			// 	for (let y = 0; y < textureData.height; y++) {
			// 		const index = 4 * (x + y * width)
			// 		const r = this.pixelData[index]
			// 		if (r > 100) {
			// 			// this.pixelData.set([0], index)
			// 			//this.pixelData[index] = 0
			// 		}
			// 	}
			// }
			// console.timeEnd("change array colors")
			// console.time("Make sprite")
			// const texture = PIXI.Texture.fromBuffer(this.pixelData, textureData.width, textureData.height)
			// const sprite = new PIXI.Sprite(texture)
			// sprite.name = "My Texture"
			// sprite.scale.set(1/resolution, 1/resolution)
			// this.groundContainer.addChild(sprite)
			// console.timeEnd("Make sprite")
			
			this.getGroundImageData = (x, y, w, h) => {
				const newX = x - bounds.x
				const newY = y - bounds.y
				const index = (Math.round(newX) + Math.round(newY) * Math.round(width)) * 4
				if (
					0 <= newX && newX <= width &&
					0 <= newY && newY <= height &&
					0 <= index && index + 3 < pixelData.length) {
					return [pixelData[index], pixelData[index+1], pixelData[index+2],pixelData[index+3]]
				} else {
					return [0, 0, 0, 0]
				}
			}
		}

		this.groundContainer.visible = groundVisible
	}

	/**
	 * CLear all containers
	 */
	clear() {
		this.containerList.forEach(container => {
			this.clearContainer(container);
		});
	}

}