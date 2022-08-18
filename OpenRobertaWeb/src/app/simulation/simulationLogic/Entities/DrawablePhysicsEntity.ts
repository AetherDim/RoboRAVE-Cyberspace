import { Body } from "matter-js";
import { Scene } from "../Scene/Scene";
import { IContainerEntity, IDrawablePhysicsEntity } from "./Entity";

export abstract class DrawablePhysicsEntity<Drawable extends PIXI.DisplayObject> implements IDrawablePhysicsEntity {

	readonly scene: Scene;

	private parent?: IContainerEntity

	protected drawable: Drawable

	protected constructor(scene: Scene, drawable: Drawable) {
		this.scene = scene;
		this.drawable = drawable
	}

	IEntity(){}
	getScene(): Scene {
		return this.scene;
	}

	getParent() {
		return this.parent
	}

	_setParent(parent: IContainerEntity | undefined) {
		this.parent = parent
	}

	IDrawablePhysicsEntity(){}
	updateDrawablePosition() {
		this.drawable.position.copyFrom(this.getPhysicsBody().position);
		this.drawable.rotation = this.getPhysicsBody().angle;
	}

	IDrawableEntity(){}
	getDrawable(): Drawable {
		return this.drawable
	}
	getContainer(): PIXI.Container | undefined {
		return undefined
	}

	IPhysicsEntity(){}
	getPhysicsObject() {
		return this.getPhysicsBody()
	}

	abstract getPhysicsBody(): Body

}