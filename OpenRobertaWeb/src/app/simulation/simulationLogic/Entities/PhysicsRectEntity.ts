import { Bodies, Body } from "matter-js";
import { BodyHelper } from "../Robot/BodyHelper";
import { Scene } from "../Scene/Scene";
import { Utils } from "../Utils";
import { DrawablePhysicsEntity } from "./DrawablePhysicsEntity";
import { IPhysicsBodyOptions, RectEntityOptions } from "./Entity";

export class PhysicsRectEntity<Drawable extends PIXI.DisplayObject = PIXI.DisplayObject> extends DrawablePhysicsEntity<Drawable> {

	protected body: Body;

	protected constructor(scene: Scene, x: number, y: number, width: number, height: number, drawable: Drawable, opts: RectEntityOptions) {
		super(scene, drawable);

		if(!opts.relativeToCenter) {
			x += width/2;
			y += height/2;
		}

		this.body = Bodies.rectangle(x, y, width, height);
		BodyHelper.setPhysicsBodyOptions(this.body, opts.physics)
	}

	getPhysicsBody() {
		return this.body
	}

	/**
	 * Create the graphics with center (0,0)
	 */
	private static createGraphics(width: number, height: number, options: RectEntityOptions): PIXI.Graphics {

		const graphics = new PIXI.Graphics();

		graphics.lineStyle(options.strokeWidth, options.strokeColor, options.strokeAlpha, options.strokeAlignment);
		graphics.beginFill(options.color, options.alpha);
		graphics.drawRoundedRect(-width/2, -height/2, width, height, options.roundingRadius);
		graphics.endFill();

		return graphics
	}

	static create(scene: Scene, x: number, y: number, width: number, height: number, opts?: Partial<RectEntityOptions>): PhysicsRectEntity<PIXI.Graphics> {
		[x, y, width, height] = scene.unit.getLengths([x, y, width, height])
		const options = Utils.getOptions(RectEntityOptions, opts);
		const graphics = PhysicsRectEntity.createGraphics(width, height, options)
		return new PhysicsRectEntity(scene, x, y, width, height, graphics, options);
	}

	static createWithContainer(scene: Scene, x: number, y: number, width: number, height: number, opts?: Partial<RectEntityOptions>): PhysicsRectEntity<PIXI.Container> {
		[x, y, width, height] = scene.unit.getLengths([x, y, width, height])
		const options = Utils.getOptions(RectEntityOptions, opts);
		const graphics = PhysicsRectEntity.createGraphics(width, height, options)
		const container = new PIXI.Container()
		container.addChild(graphics)
		return new PhysicsRectEntity<PIXI.Container>(scene, x, y, width, height, graphics, options);
	}


	static createTexture(scene: Scene, x: number, y: number, texture: PIXI.Texture, alpha: number, relativeToCenter:boolean = false, bodyOptions?: IPhysicsBodyOptions): PhysicsRectEntity<PIXI.DisplayObject> {
		return new PhysicsRectEntity(scene, x, y, texture.width, texture.height, new PIXI.DisplayObject(), Utils.getOptions(RectEntityOptions, {physics: bodyOptions}));
		// TODO
	}


}