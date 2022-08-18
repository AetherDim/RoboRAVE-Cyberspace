import {Scene} from "../Scene/Scene";
import {Body, Composite, Constraint, Bodies, IChamferableBodyDefinition} from "matter-js";
import { Utils } from "../Utils";


export class Meta<T> {
	name: keyof T
	constructor(name: keyof T) {
		this.name = name
	}

	isSupertypeOf(value: any): value is T {
		if (this.name in value) {
			return true
		}
		return false
	}
}

export class Type {
	static readonly IEntity = new Meta<IEntity>("IEntity")
	static readonly IUpdatableEntity = new Meta<IUpdatableEntity>("IUpdatableEntity")
	static readonly IDrawableEntity = new Meta<IDrawableEntity>("IDrawableEntity")
	static readonly IPhysicsEntity = new Meta<IPhysicsEntity>("IPhysicsEntity")
	static readonly IPhysicsCompositeEntity = new Meta<IPhysicsCompositeEntity>("IPhysicsCompositeEntity")
	static readonly IDrawablePhysicsEntity = new Meta<IDrawablePhysicsEntity>("IDrawablePhysicsEntity")
	static readonly IContainerEntity = new Meta<IContainerEntity>("IContainerEntity")
}



export interface IEntity {

	getScene(): Scene;

	getParent(): IContainerEntity | undefined
	_setParent(containerEntity: IContainerEntity | undefined): void

	IEntity(): void
}

export interface IUpdatableEntity extends IEntity {

	IUpdatableEntity(): void

	/**
	 * called once per engine update
	 */
	update(dt: number): void;

}


export interface IDrawableEntity extends IEntity {

	IDrawableEntity(): void

	/**
	 * returns a drawable for this entity
	 */
	getDrawable(): PIXI.DisplayObject;

	/**
	 * get container to register graphics
	 * if function is undefined, the entity layer of the `Scene` will be used
	 */
	getContainer(): PIXI.Container | undefined;

}

export interface IPhysicsEntity extends IEntity {

	IPhysicsEntity(): void

	/**
	 * returns the physics object of this entity
	 */
	getPhysicsObject(): Body | Constraint | Composite;

}

export interface IPhysicsBodyEntity extends IPhysicsEntity {

	/**
	 * returns the physics object of this entity
	 */
	getPhysicsBody(): Body;

}

export interface IPhysicsCompositeEntity extends IPhysicsEntity {

	IPhysicsCompositeEntity(): void

	/**
	 * returns the physics object of this entity
	 */
	getPhysicsComposite(): Composite;

}

export interface IPhysicsConstraintEntity extends IPhysicsEntity {

	/**
	 * returns the physics object of this entity
	 */
	getPhysicsConstraint(): Constraint;

}

export interface IDrawablePhysicsEntity extends IDrawableEntity, IPhysicsBodyEntity {

	IDrawablePhysicsEntity(): void

	/**
	 * update position of physics entity to the drawable part
	 */
	updateDrawablePosition(): void;

}


export interface IContainerEntity extends IEntity {

	IContainerEntity(): void

	getChildren(): IEntity[]

	removeChild(child: IEntity): void
	addChild(child: IEntity): void

}

//
//
//



export class DrawSettings {

	color: number = 0xFFFFFF;
	alpha: number = 1;
	strokeColor?: number// = 0x000000;
	strokeAlpha?: number// = 1;
	strokeWidth?: number// = 2;
	/**
	 * 0: inner, 0.5: middle, 1: outer (default middle)
	 */
	strokeAlignment?: number

}

export class RectOptions extends DrawSettings {
	roundingRadius: number = 0
	relativeToCenter: boolean = true
}

//
// Specialized Entities
//

// TODO: Add more options (see IBodyDefinition of matter js)
export interface IPhysicsBodyOptions {
	angle?: number
	mass?: number
	frictionAir?: number
	isStatic?: boolean
}

export class RectEntityOptions extends RectOptions {
	physics: IPhysicsBodyOptions = {}
}