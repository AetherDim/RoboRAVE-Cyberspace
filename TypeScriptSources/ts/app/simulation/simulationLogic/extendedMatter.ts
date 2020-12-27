import { Composite, Constraint, Vector, Body, ICompositeDefinition, IBodyDefinition } from "matter-js";
import { Displayable } from "./displayable";

declare module "matter-js" {
    export interface Body {
        displayable?: Displayable;
        debugDisplayable?: Displayable;
    }

    export interface IBodyDefinition {
        displayable?: Displayable;
        debugDisplayable?: Displayable;
    }

    export interface Composite {
        /** 
         * Adds constraints to `this` which constraints `bodyA` and `bodyB` such that their current
         * relative position and orientation is preserved (depending on `stiffness`).
         * 
         * Note: A `rotationStiffness` which is larger than `0.1` may be unstable.
         * 
         * @param composite the `Composite` to which the constraints are added
         * @param bodyA the first `Body` of the constraint
         * @param bodyB the second `Body` of the constraint
         * @param rotationStiffnessA the stiffness of the constraint constraining the rotation of `bodyA` (default: 0.1)
         * @param rotationStiffnessB the stiffness of the constraint constraining the rotation of `bodyB` (default: 0.1)
         * @param offsetA the constraint offset on `bodyA` in its coordinate system (default: (0,0))
         * @param offsetB the constraint offset on `bodyB` in its coordinate system (default: (0,0))
         */ 
        addRigidBodyConstraints(
            bodyA: Body, bodyB: Body,
            rotationStiffnessA?: number,
            rotationStiffnessB?: number,
            offsetA?: Vector,
            offsetB?: Vector): void

        /**
         * Same as `Composite.scale(...)` where constraints are also scaled
         * 
         * @param scaleX scaling in x direction
         * @param scaleY scaling in y direction
         * @param point the point from which the composite is scaled
         * @param recursive include sub composites (default: true)
         */
        scale(
            scaleX: number,
            scaleY: number,
            point: Vector,
            recursive?: boolean)
    }

    interface Body {

        vectorAlongBody(length?: number): Vector
        velocityAlongBody(this: Body): number

    }

}

// === Composite ===

function addRigidBodyConstraints(
    this: Composite,
    bodyA: Body, bodyB: Body,
    rotationStiffnessA: number = 0.1,
    rotationStiffnessB: number = 0.1,
    offsetA: Vector = Vector.create(0, 0),
    offsetB: Vector = Vector.create(0, 0)
    ): void {

    function makeConstraint(posA: Vector, posB: Vector, stiffness: number): Constraint {
        return Constraint.create({
            bodyA: bodyA, bodyB: bodyB,
            pointA: posA, pointB: posB,
            // stiffness larger than 0.1 is sometimes unstable
            stiffness: stiffness
        })
    }

    // add constraints to world or compound body
    [
        makeConstraint(Vector.sub(bodyB.position, bodyA.position), offsetB, rotationStiffnessA),
        makeConstraint(offsetA, Vector.sub(bodyA.position, bodyB.position), rotationStiffnessB)
    ].forEach(constraint => Composite.add(this, constraint))
}


function scale(this: Composite, scaleX: number, scaleY: number, point: Vector, recursive: boolean = true) {
    const constraints = recursive ? Composite.allConstraints(this) : this.constraints
    constraints.forEach(constraint => {
        if (constraint.bodyA) {
            constraint.pointA.x = point.x + (constraint.pointA.x - point.x) * scaleX
            constraint.pointA.y = point.y + (constraint.pointA.y - point.y) * scaleY
        }
        if (constraint.bodyB) {
            constraint.pointB.x = point.x + (constraint.pointB.x - point.x) * scaleX
            constraint.pointB.y = point.y + (constraint.pointB.y - point.y) * scaleY
        }
        // `constraint.length` 
    })

    Composite.scale(this, scaleX, scaleY, point, recursive)
}

const compositePrototype = { addRigidBodyConstraints, scale }
Object.setPrototypeOf(Composite, compositePrototype)

const oldCreate = Composite.create
Composite.create = function (options: ICompositeDefinition = {}): Composite {
    return oldCreate({ ...options, ...compositePrototype})
}



// === Body ===

function vectorAlongBody(this: Body, length: number = 1): Vector {
    return Vector.create(length * Math.cos(this.angle), length * Math.sin(this.angle))
}

function velocityAlongBody(this: Body): number {
    return Vector.dot(this.velocity, this.vectorAlongBody())
}

const bodyPrototype = { vectorAlongBody, velocityAlongBody }

const oldBodyCreate = Body.create
Body.create = function (options: IBodyDefinition) {
    if (!options.density) {
        options.density = 1000
    }
    return oldBodyCreate({...options, ...bodyPrototype})
}
