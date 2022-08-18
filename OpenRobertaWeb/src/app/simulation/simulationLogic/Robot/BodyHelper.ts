import { Vector, Body, Query } from "matter-js"
import { LineBaseClass } from "../Geometry/LineBaseClass"
import { Polygon } from "../Geometry/Polygon"
import { Utils } from "../Utils"

export class BodyHelper {

	private static forEachBodyPartVertices(bodies: Body[], code: (vertices: Vector[]) => void) {
		for (let i = 0; i < bodies.length; i++) {
			const body = bodies[i];
			// TODO: Use body.bounds for faster execution
			for (let j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
				const part = body.parts[j];
				code(part.vertices)
			}
		}
	}

	static getNearestPointTo(point: Vector, bodies: Body[], includePoint: (point: Vector) => boolean): Vector | undefined {
		let nearestPoint: Vector | undefined
		let minDistanceSquared = Infinity

		BodyHelper.forEachBodyPartVertices(bodies, vertices => {
			const nearestBodyPoint = new Polygon(vertices).nearestPointToPoint(point, includePoint)
			if (nearestBodyPoint) {
				const distanceSquared = Utils.vectorDistanceSquared(point, nearestBodyPoint)
				if (distanceSquared < minDistanceSquared) {
					minDistanceSquared = distanceSquared
					nearestPoint = nearestBodyPoint
				}
			}
		})

		return nearestPoint;
	}

	static intersectionPointsWithLine(line: LineBaseClass, bodies: Body[]): Vector[] {
		const result: Vector[] = []
		this.forEachBodyPartVertices(bodies, vertices => {
			const newIntersectionPoints = new Polygon(vertices).intersectionPointsWithLine(line)
			for (let i = 0; i < newIntersectionPoints.length; i++) {
				result.push(newIntersectionPoints[i])
			}
		})
		return result
	}

	static bodyIntersectsOther(body: Body, bodies: Body[]): boolean {
		// `body` collides with itself
		return Query.collides(body, bodies).length > (bodies.includes(body) ? 1 : 0)
	}

	static someBodyContains(point: Vector, bodies: Body[]): boolean {
		const bodiesContainingPoint = Query.point(bodies, point)
		return bodiesContainingPoint.length > 0
	}
}