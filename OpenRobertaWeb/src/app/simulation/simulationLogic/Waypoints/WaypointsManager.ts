import { Vector } from "matter-js";
import { EventType, ScrollViewEvent } from "../ScrollView";
import { Utils } from "../Utils";
import { Waypoint } from "./Waypoint";
import { WaypointList } from "./WaypointList";
import { KeyManager } from "../KeyManager";
import { ScoreWaypoint } from "./ScoreWaypoint";

export type WaypointVisibilityBehavior =
	"hideAll" | "showAll" | "showNext" | "hideAllPrevious" | "showHalf"

/**
 * Manages a `WaypointList<W>` where each waypoint is checked one by one.
 * 
 * Call `update(objectPosition: Vector)` continuously and `reset()` to reset the `waypointIndex`.
 */
export class WaypointsManager<W extends Waypoint> {

	private waypointList: WaypointList<W>

	/**
	 * The index of the last reached waypoint
	 */
	private waypointIndex?: number

	waypointVisibilityBehavior: WaypointVisibilityBehavior = "showNext"

	private waypointEvent: (waypointIndex: number, waypoint: W) => void
	onWaypointsDidChange?: () => void

	/**
	* The the selected waypoint. Only set it using the 'selectWaypoint(...)' function.
	*/
	private selectedWaypoint: W | undefined
	getSelectedWaypoint(): W | undefined {
		return this.selectedWaypoint
	}

	waypointRasterSize = 0
	userCanModifyWaypoints = false

	constructor(waypointList: WaypointList<W> = new WaypointList([]), waypointEvent: (waypointIndex: number, waypoint: W) => void = _ => {}) {
		this.waypointList = waypointList
		this.waypointEvent = waypointEvent

		KeyManager.keyDownHandler.push(event => {
			if (this.userCanModifyWaypoints && this.selectedWaypoint != undefined) {
				if (event.key == "Backspace") {
					this.selectedWaypoint.getScene().removeEntity(this.selectedWaypoint)
					this.waypointList.remove(this.selectedWaypoint)
					this.selectWaypoint(undefined)
					this.onWaypointsDidChange?.()
				} else if (this.selectedWaypoint instanceof ScoreWaypoint) {
					let anyChange = true
					switch (event.key) {
						case "+": this.selectedWaypoint.maxDistance += 10; break
						case "-": this.selectedWaypoint.maxDistance -= 10; break
						case "ArrowUp": this.selectedWaypoint.score += 10; break
						case "ArrowDown": this.selectedWaypoint.score -= 10; break
						default: anyChange = false
					}
					if (anyChange) {
						this.selectedWaypoint.maxDistance = Math.max(0, this.selectedWaypoint.maxDistance)
						this.selectedWaypoint.score = Math.max(0, this.selectedWaypoint.score)
						this.selectedWaypoint.updateGraphics()
						this.onWaypointsDidChange?.()
					}
				}
			}
		})
	}

	getWaypoints(): readonly W[] {
		return this.waypointList.getWaypoints()
	}

	/**
	 * Sets `waypointList` and `waypointEvent` and resets `waypointIndex` to `undefined`. It also removes the current waypoints from the scene and add the new ones to their scenes.
	 * 
	 * @param waypointList 
	 * @param waypointEvent 
	 */
	resetListAndEvent(waypointList: WaypointList<W>, waypointEvent: (waypointIndex: number, waypoint: W) => void) {
		this.waypointList.getWaypoints().forEach(waypoint => {
			waypoint.getScene().removeEntity(waypoint)
		})
		waypointList.getWaypoints().forEach(waypoint => {
			waypoint.getScene().addEntity(waypoint)
		})
		this.waypointList = waypointList
		this.waypointEvent = waypointEvent
		this.reset()

		this.onWaypointsDidChange?.()
	}

	/**
	 * Reset the `waypointIndex` and the waypoint graphics
	 */
	reset() {
		this.waypointIndex = undefined
		this.updateWaypointVisibility()
	}

	update(objectPosition: Vector) {

		const nextWaypointIndex = (this.waypointIndex ?? -1) + 1

		if (nextWaypointIndex >= this.waypointList.getLength()) {
			return
		}

		const waypoint = this.waypointList.get(nextWaypointIndex)

		if (Utils.vectorDistanceSquared(waypoint.position, objectPosition) <= waypoint.maxDistance * waypoint.maxDistance) {
			this.waypointIndex = nextWaypointIndex
			this.waypointEvent(this.waypointIndex, waypoint)

			this.updateWaypointVisibility()
		}

	}

	updateWaypointVisibility() {
		const waypointIndex = this.waypointIndex ?? -1
		const waypoints = this.waypointList.getWaypoints()
		let isVisible: (index: number) => boolean
		switch (this.waypointVisibilityBehavior) {
			case "hideAll":
				isVisible = () => false
				break
			case "hideAllPrevious":
				isVisible = (index) => index > waypointIndex
				break
			case "showAll":
				isVisible = () => true
				break
			case "showNext": 
				isVisible = (index) => index == waypointIndex + 1
				break
			case "showHalf":
				isVisible = (index) => index < waypoints.length/2
				break
			default:
				Utils.exhaustiveSwitch(this.waypointVisibilityBehavior)
		}
		waypoints.forEach((w, index) => w.graphics.visible = isVisible(index))
	}

	private selectWaypoint(newSelection: W | undefined) {
		if (this.selectedWaypoint != undefined) {
			this.selectedWaypoint.lineColor = 0x0000ff
			this.selectedWaypoint.updateGraphics()
		}
		if (newSelection != undefined) {
			newSelection.lineColor = 0xff0000
			newSelection.updateGraphics()
		}
		this.selectedWaypoint = newSelection
	}

	private toggleWaypoint(newSelection: W | undefined) {
		if (newSelection === this.selectedWaypoint) {
			// if a selected waypoint is pressed, it is deselected
			this.selectWaypoint(undefined)
		} else {
			this.selectWaypoint(newSelection)
		}
	}

	addWaypointAfterSelection(waypoint: W) {
		if (this.selectedWaypoint != undefined) {
			const index = this.waypointList.waypoints.indexOf(this.selectedWaypoint)
			if (index >= 0) {
				this.waypointList.insert(waypoint, index + 1)
			} else {
				this.waypointList.push(waypoint)
			}
		} else {
			this.waypointList.push(waypoint)
		}
		waypoint.getScene().addEntity(waypoint)
		this.updateWaypointVisibility()
		this.onWaypointsDidChange?.()
	}

	/**
	 * Returns the last waypoint (useful for mouse interaction) where `position` is inside and matches the `predicate`
	 * @param position The position has to be inside the `Waypoint`
	 * @param predicate The `Waypoint` has to match this `predicate`
	 * @returns The last waypoint at `position` which matches the `predicate`
	 */
	private lastWaypointAtPosition(position: Vector, predicate: (waypoint: W) => boolean): W | undefined {
		for (let i = this.waypointList.getLength() - 1; i >= 0; i--) {
			const waypoint = this.waypointList.get(i)
			if (Utils.vectorDistance(waypoint.position, position) < waypoint.maxDistance && predicate(waypoint)) {
				return waypoint
			}
		}
		return undefined
	}

	onInteractionEvent(ev: ScrollViewEvent) {
		if (!this.userCanModifyWaypoints) {
			return
		}

		switch (ev.type) {
			case EventType.PRESS:
				const mousePosition = ev.data.getCurrentLocalPosition()
				const newSelection = this.lastWaypointAtPosition(mousePosition, w => w.graphics.visible)
				this.toggleWaypoint(newSelection)
				break
			case EventType.DRAG:
				const delta = ev.data.getDeltaLocal()
				if (delta != undefined) {
					const mousePosition = ev.data.getCurrentLocalPosition()
					if (this.selectedWaypoint == undefined) {
						const newSelection = this.lastWaypointAtPosition(mousePosition, w => w.graphics.visible)
						if (newSelection != undefined) {
							this.selectWaypoint(newSelection)
						}
					}
					if (this.selectedWaypoint != undefined) {
						if (this.waypointRasterSize == 0) {
							// add in-place
							Vector.add(this.selectedWaypoint.position, delta, this.selectedWaypoint.position)
						} else {
							this.selectedWaypoint.position = {
								x: Math.round(mousePosition.x / this.waypointRasterSize) * this.waypointRasterSize,
								y: Math.round(mousePosition.y / this.waypointRasterSize) * this.waypointRasterSize
							}
						}
						this.selectedWaypoint.updateGraphics()
						ev.cancel()
					}
				}
				break
		}
	}
}