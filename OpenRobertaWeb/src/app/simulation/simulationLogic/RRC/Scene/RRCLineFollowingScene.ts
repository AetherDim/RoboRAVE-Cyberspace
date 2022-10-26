import {RRCScene, wp} from "./RRCScene";
import { AsyncChain } from "../../Scene/AsyncChain";
import * as RRC from '../RRAssetLoader'
import {AgeGroup} from "../AgeGroup";
import { WaypointList } from "../../Waypoints/WaypointList";
import {ScoreWaypoint} from "../../Waypoints/ScoreWaypoint";
import { Utils } from "../../Utils";
import {SharedAssetLoader} from "../../SharedAssetLoader";

export class RRCLineFollowingScene extends RRCScene {

	readonly bigWaypointSize = 70

	// Waypoints
	readonly waypointsES = [
		wp( 572, 317, 0),
		wp( 630, 317, 0),
		wp( 578, 427, 0),
		wp( 427, 362, 0),
		wp( 462, 284, 0),
		wp(575, 187, 0),
		wp(501, 111, 0),
		wp(372, 106, 0),
		wp(217, 120, 0),
		wp(121, 206, 0),
		wp(111, 290, 0),
		wp(136, 359, 0),
		wp(234, 428, 0),
		wp(324, 365, 0),
		wp(328, 273, 0),
	]

	readonly waypointsMS = [
		wp( 720, 252, 0),
		wp( 709, 355, 0),
		wp( 605, 418, 0),
		wp( 509, 342, 0),
		wp(551, 250, 0),
		wp(644, 172, 0),
		wp(548, 105, 0),
		wp(484, 105, 0), // split
		wp(361, 101, 0),
		wp(281, 121, 0),
		wp(332, 246, 0),
		wp(178, 237, 0),
		wp(163, 329, 0),
		wp(273, 422, 0),
		wp(344, 393, 0),
		wp(397, 305, 0),
		wp(433, 373, 0),
		wp(432, 445, 0),
	]

	readonly waypointsHS = [
		wp( 397, 272, 0),
		wp( 373, 165, 0),
		wp( 255, 106, 0),
		wp( 187, 134, 0),
		wp(247, 194, 0),
		wp(322, 237, 0),
		wp(258, 268, 0), // split
		wp(180, 248, 0),
		wp(129, 305, 0),
		wp(155, 368, 0),
		wp(257, 343, 0),
		wp(293, 384, 0),
		wp(262, 434, 0),
		wp(281, 463, 0),
		wp(369, 451, 0),
		wp(440, 386, 0),
		wp(462, 309, 0),
		wp(451, 231, 0),
		wp(476, 171, 0),
		wp(556, 151, 0),
		wp(642, 208, 0),
		wp(642, 264, 0),
		wp(542, 290, 0),
		wp(515, 338, 0),
		wp(540, 396, 0),
		wp(649, 411, 0), // split
		wp(725, 399, 0),
		wp(737, 324, 0),
		wp(692, 200, 0),
		wp(662, 109, 0),
		wp(731, 100, 0),
	]

	readonly obstacleColor: number = 0xf68712

	// Walls
	readonly wallES = {
		x: 294,
		y: 242,
		w: 70,
		h: 25
	}

	readonly wallMS = {
		x: 397,
		y: 449,
		w: 70,
		h: 25
	}

	readonly wallHS = {
		x: 735,
		y: 65,
		w: 25,
		h: 70
	}

	getWaypoints() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return this.waypointsES;

			case AgeGroup.MS:
				return this.waypointsMS;

			case AgeGroup.HS:
				return this.waypointsHS;
		}
	}

	getWall() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return this.wallES
			case AgeGroup.MS:
				return this.wallMS
			case AgeGroup.HS:
				return this.wallHS
		}
	}

	getRobotStartPosition() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return { position: {x: 570, y: 314 }, rotation: 0 }
			case AgeGroup.MS:
				return { position: {x: 718, y: 248 }, rotation: 90 }
			case AgeGroup.HS:
				return { position: {x: 396, y: 270 }, rotation: -90 }
		}
	}

	getAsset() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return RRC.LINE_FOLLOWING_BACKGROUND_ES;

			case AgeGroup.MS:
				return RRC.LINE_FOLLOWING_BACKGROUND_MS;

			case AgeGroup.HS:
				return RRC.LINE_FOLLOWING_BACKGROUND_HS;
		}
	}


	onLoadAssets(chain: AsyncChain) {
		SharedAssetLoader.load(() => {
			chain.next();
		},
			this.getAsset(),
			RRC.GOAL_BACKGROUND
		);
	}

	getMaximumTimeBonusScore() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return 4*60;

			case AgeGroup.MS:
				return 5*60;

			case AgeGroup.HS:
				return 6*60;
		}
	}

	/**
	 * Returns the indices of the waypoints where a junction is
	 */
	junctionIndices(): number[] {
		switch (this.ageGroup) {
		case AgeGroup.ES: return []
		case AgeGroup.MS: return [7]
		case AgeGroup.HS: return [6, 25]
		default: Utils.exhaustiveSwitch(this.ageGroup)
		}
	}

	onInit(chain: AsyncChain) {
		this.initRobot(this.getRobotStartPosition());

		// TODO: Change the waypoints
		const waypointList = new WaypointList<ScoreWaypoint>()
		const waypoints = this.getWaypoints()

		waypoints.forEach(waypoint => {
			const x = waypoint.x
			const y = waypoint.y
			const r = waypoint.r
			const wp = this.makeWaypoint({x: x, y: y}, waypoint.score, r)
			waypointList.appendWaypoints(wp)
		})

		const reversedWaypoints = waypointList.reversed(false)

		// === set graphics ===
		waypointList.getLastWaypoint().setMaxDistanceInMatterUnits(this.bigWaypointSize)
		reversedWaypoints.getLastWaypoint().setMaxDistanceInMatterUnits(this.bigWaypointSize)

		// === set score ===

		// leaves the starting position 
		waypointList.get(1).score = this.ageGroup == AgeGroup.ES ? 50 : 25
		// arrives at the "tower"
		waypointList.getLastWaypoint().score = this.ageGroup == AgeGroup.HS ? 50 : 100

		// on the way back to the starting point
		reversedWaypoints.get(2).score = this.ageGroup == AgeGroup.ES ? 50 : 25
		// arrives at the starting position
		reversedWaypoints.getLastWaypoint().score = 100

		// set junction waypoint scores
		const waypointsAfterTheJunction = 2
		const junctionScore = 25
		this.junctionIndices().forEach(index => {
			waypointList.get(index + waypointsAfterTheJunction).score = junctionScore
			reversedWaypoints.get((reversedWaypoints.getLength() - 1) - (index - waypointsAfterTheJunction)).score = junctionScore
		})

		waypointList.append(reversedWaypoints)


		this.setWaypointList(waypointList)

		this.getContainers().groundContainer.addChild(this.getAsset().newSprite());

		this.addStaticWallInPixels(this.getWall(), {color: this.obstacleColor, strokeColor: this.obstacleColor})

		this.addWalls(true);

		chain.next();
	}
}