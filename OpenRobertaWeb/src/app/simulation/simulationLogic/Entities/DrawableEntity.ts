import { Scene } from "../Scene/Scene"
import { Utils } from "../Utils"
import { IContainerEntity, IDrawableEntity, RectOptions } from "./Entity"

export class DrawableEntity<Drawable extends PIXI.DisplayObject = PIXI.DisplayObject> implements IDrawableEntity {

	private scene: Scene
	private parent?: IContainerEntity
	private drawable: Drawable
	private container?: PIXI.Container

	constructor(scene: Scene, drawable: Drawable, sceneContainer?: PIXI.Container) {
		this.scene = scene
		this.drawable = drawable
		this.container = sceneContainer
	}

	setContainer(container?: PIXI.Container): this {
		this.container = container
		return this
	}

	IEntity(){}

	getScene(): Scene {
		return this.scene
	}

	getParent(): IContainerEntity | undefined {
		return this.parent
	}

	_setParent(parent: IContainerEntity | undefined) {
		this.parent = parent
	}

	IDrawableEntity(){}

	getContainer(): PIXI.Container | undefined {
		return this.container
	}

	getDrawable(): Drawable {
		return this.drawable
	}

	static rect(scene: Scene, x: number, y: number, width: number, height: number, opts?: Partial<RectOptions>): DrawableEntity<PIXI.Graphics> {

		const options = Utils.getOptions(RectOptions, opts)

		let graphicsX = 0
		let graphicsY = 0
		if (options.relativeToCenter) {
			graphicsX -= width/2
			graphicsY -= height/2
		}

		const graphics = new PIXI.Graphics()
			.lineStyle(options.strokeWidth, options.strokeColor, options.strokeAlpha, options.strokeAlignment)
			.beginFill(options.color, options.alpha)
			.drawRoundedRect(graphicsX, graphicsY, width, height, options.roundingRadius)
			.endFill()
		graphics.position.set(x, y)
		
		return new DrawableEntity(scene, graphics)
	}

}