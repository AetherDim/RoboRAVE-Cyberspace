import { Waypoint } from './Waypoint'

/**
 * A list of waypoints with several helper functions to waypoint paths
 */
export class WaypointList<W extends Waypoint> {

	waypoints: W[]

	constructor(waypoints: W[] = []) {
		this.waypoints = waypoints
	}

	getWaypoints(): W[] {
		return this.waypoints
	}

	/**
	 * Get the waypoint at `index`
	 */
	get(index: number): W {
		return this.waypoints[index]
	}

	/**
	 * Push the `waypoint` to the end of the list
	 * @param waypoint The waypoint which is pushed to the end of the list
	 */
	push(waypoint: W) {
		this.waypoints.push(waypoint)
	}

	/**
	 * Insert the `waypoint` at the `index`
	 * @param waypoint The waypoint which is inserted
	 * @param index The index where the waypoint is inserted
	 */
	insert(waypoint: W, index: number) {
		this.waypoints.splice(index, 0, waypoint)
	}

	/**
	 * Remove the waypoint at `index`
	 * @param index Index of the waypoint
	 */
	removeAt(index: number) {
		this.waypoints.splice(index, 1)
	}

	/**
	 * Remove the `waypoint`
	 * @param waypoint The waypoint which will be removed
	 */
	remove(waypoint: W) {
		const index = this.waypoints.indexOf(waypoint)
		if (index >= 0) {
			this.removeAt(index)
		}
	}

	/**
	 * Get the number of waypoints in the list
	 */
	getLength(): number {
		return this.waypoints.length
	}

	getLastWaypointIndex(): number {
		return this.waypoints.length-1
	}

	getLastWaypoint(): W {
		return this.waypoints[this.waypoints.length-1]
	}

	/**
	 * Return a `WaypointList` with reversed waypoints. See `includingTheLast`.
	 * 
	 * @param includingTheLast If `true`: Return all waypoints including the last waypoint of `this`.
	 * If `false` do not add the last waypoint to the list. (default: `false`)
	 */
	reversed(includingTheLast: boolean = true): WaypointList<W> {
		const waypoints: W[] = []
		for(var i = this.waypoints.length - 1 + (includingTheLast ? 0 : -1); i >= 0; i--) {
			// TODO: Find type-safe way to clone an object
			waypoints.push(this.waypoints[i].clone() as W)
		}
		return new WaypointList(waypoints)
	}

	/**
	 * Append (almost) all current waypoints in reverse order to `this`. See `includingTheLast`.
	 * 
	 * @param includingTheLast If `true`: Append all waypoints including the last waypoint.
	 * If `false` do not append the last waypoint. (default: `false`)
	 */
	appendReversedWaypoints(includingTheLast: boolean = false) {
		for(var i = this.waypoints.length - 1 + (includingTheLast ? 0 : -1); i >= 0; i--) {
			// TODO: Find type-safe way to clone an object
			this.waypoints.push(this.waypoints[i].clone() as W)
		}
	}

	/**
	 * Append all waypoints in `list`
	 */
	append(list: WaypointList<W>) {
		list.waypoints.forEach(waypoint => {
			this.waypoints.push(waypoint)
		})
	}

	appendWaypoints(...waypoints: W[]) {
		waypoints.forEach(waypoint => {
			this.waypoints.push(waypoint)
		})
	}

}