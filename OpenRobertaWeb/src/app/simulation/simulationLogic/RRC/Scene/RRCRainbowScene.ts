import {RRCScene, wp} from "./RRCScene";
import {AgeGroup} from "../AgeGroup";
import * as RRC from "../RRAssetLoader";
import {AsyncChain} from "../../Scene/AsyncChain";
import {randomBool, randomWeightedBool} from "../../Random";
import { SharedAssetLoader, SpriteAsset} from "../../SharedAssetLoader";
import {WaypointList} from "../../Waypoints/WaypointList";
import {ScoreWaypoint} from "../../Waypoints/ScoreWaypoint";
import { Vector } from "matter-js";
import { Utils } from "../../Utils";


type ObstacleData = {x: number, y: number, w: number, h: number, rot?: number }

export class RRCRainbowScene extends RRCScene {

	version = 2

	// colours
	readonly red = {
		r: 228,
		g: 3,
		b: 3
	}

	readonly orange = {
		r: 255,
		g: 140,
		b: 0
	}

	readonly yellow = {
		r: 255,
		g: 237,
		b: 0
	}

	readonly green = {
		r: 0,
		g: 128,
		b: 38
	}

	readonly blue = {
		r: 0,
		g: 77,
		b: 255
	}

	readonly purple = {
		r: 117,
		g: 7,
		b: 135
	}


	// colour order
	readonly colourES_MS = [
		this.red,
		this.yellow,
		this.green,
		this.blue
	]

	readonly colourHS = [
		this.red,
		this.orange,
		this.yellow,
		this.green,
		this.blue,
		this.purple
	]

	readonly bigWaypointSize = 70

	// Waypoints for MS and ES

	// ES_MS: version 1

	readonly topWaypoints = [
		wp(400, 177, 10),
		wp(402, 71, 0),
		wp(480, 72, 0),
		wp(479, 119, 0),
		wp(520, 117, 0),
		wp(520, 181, 0),
		wp(611, 178, 0),
		wp(762, 178, 10, this.bigWaypointSize),
	]

	readonly rightWaypoints = [
		wp(505, 270, 10),
		wp(620, 270, 0),
		wp(730, 272, 0),
		wp(730, 345, 0),
		wp(730, 410, 0),
		wp(610, 411, 0),
		wp(492, 408, 0),
		wp(490, 503, 10, this.bigWaypointSize),
	]

	readonly downWaypoints = [
		wp(400, 362, 10),
		wp(400, 415, 0),
		wp(400, 470, 0),
		wp(286, 470, 0),
		wp(210, 470, 0),
		wp(120, 470, 0),
		wp(120, 423, 0),
		wp(68, 423, 0),
		wp(68, 360, 0),
		wp(180, 360, 0),
		wp(297, 360, 10, this.bigWaypointSize),
	]

	readonly leftWaypoints = [
		wp(280, 268, 10),
		wp(280, 182, 0),
		wp(280, 112, 0),
		wp(174, 112, 0),
		wp(72, 112, 0),
		wp(72, 185, 0),
		wp(72, 270, 0),
		wp(130, 270, 0),
		wp(188, 270, 0),
		wp(188, 183, 10, this.bigWaypointSize),
	]

	readonly waypointsListES_MS = [
		this.topWaypoints,
		this.rightWaypoints,
		this.downWaypoints,
		this.leftWaypoints
	]

	// ES_MS: version 2

	readonly topWaypointsES_MS2 = [
		// wp(400, 270, 10),
		wp(400, 180, 0),
		wp(400, 130, 0),
		wp(470, 130, 0),
		wp(470, 50, 0),
		wp(540, 50, 0),
		wp(540, 130, 10, this.bigWaypointSize)
	]
	readonly rightWaypointsES_MS2 = [
		wp(500, 270, 10),
		wp(590, 270, 0),
		wp(590, 200, 0),
		wp(730, 200, 0),
		wp(730, 340, 0),
		wp(510, 340, 0),
		wp(510, 400, 10, this.bigWaypointSize),
	]
	readonly downWaypointsES_MS2 = [
		wp(400, 350, 10),
		wp(400, 390, 0),
		wp(290, 390, 0),
		wp(290, 340, 0),
		wp(90, 340, 0),
		wp(90, 400, 0),
		wp(210, 410, 0),
		wp(210, 470, 0),
		wp(380, 470, 10, this.bigWaypointSize),
	]
	readonly leftWaypointsES_MS2 = [
		wp(320, 270, 10),
		wp(290, 270, 0),
		wp(280, 190, 0),
		wp(210, 190, 0),
		wp(210, 260, 0),
		wp(80, 260, 0),
		wp(80, 130, 0),
		wp(300, 120, 10, this.bigWaypointSize),
	]

	readonly waypointsListES_MS2 = [
		this.topWaypointsES_MS2,
		this.rightWaypointsES_MS2,
		this.downWaypointsES_MS2,
		this.leftWaypointsES_MS2
	]


	// Waypoints for HS
	readonly topLeftWaypoints = [
		wp(357, 196, 10),
		wp(207, 196, 0),
		wp(62, 196, 0),
		wp(62, 100, 0),
		wp(207, 100, 0),
		wp(279, 100, 0),
		wp(360, 60, 0),
		wp(387, 90, 0),
		wp(389, 128, 10, this.bigWaypointSize),	
	]
	readonly topRightWaypoints = [
		wp(445, 190, 10),
		wp(460, 165, 0),
		wp(463, 138, 0),
		wp(501, 100, 0),
		wp(560, 100, 0),
		wp(543, 61, 0),
		wp(592, 61, 10, this.bigWaypointSize),
	]

	readonly middleRightWaypoint = [
		wp(500, 268, 10),
		wp(591, 180, 0),
		wp(740, 180, 0),
		wp(740, 270, 0),
		wp(740, 400, 0),
		wp(712, 392, 0),
		wp(604, 270, 0),
		wp(682, 270, 10, this.bigWaypointSize),	
	]

	readonly downRightWaypoints = [
		wp(441, 344, 10),
		wp(456, 369, 0),
		wp(589, 351, 0),
		wp(611, 389, 0),
		wp(559, 420, 0),
		wp(469, 449, 0),
		wp(469, 490, 10, this.bigWaypointSize),
	]

	readonly downLeftWaypoints = [
		wp(357, 341, 10),
		wp(341, 369, 0),
		wp(389, 450, 0),
		wp(301, 469, 0),
		wp(142, 469, 0),
		wp(84, 410, 0),
		wp(297, 410, 10, this.bigWaypointSize),
	]

	readonly middleLeftWaypoints = [
		wp(317, 270, 10),
		wp(281, 270, 0),
		wp(281, 339, 0),
		wp(187, 339, 0),
		wp(83, 339, 0),
		wp(159, 251, 0),
		wp(47, 251, 10, this.bigWaypointSize),
	]

	// version 2

	readonly topLeftWaypointsHS2 = [
		wp(350, 190, 10),
		wp(280, 210, 0),
		wp(150, 120, 0),
		wp(270, 120, 0),
		wp(390, 150, 0),
		wp(350, 80, 10, this.bigWaypointSize),
	]
	readonly topRightWaypointsHS2 = [
		wp(450, 190, 10),
		wp(450, 90, 0),
		wp(520, 50, 0),
		wp(550, 110, 0),
		wp(500, 130, 0),
		wp(500, 200, 10, this.bigWaypointSize),
	]
	readonly rightWaypointsHS2 = [
		wp(490, 270, 10),
		wp(560, 310, 0),
		wp(730, 310, 0),
		wp(730, 200, 0),
		wp(540, 240, 0),
		wp(590, 270, 0),
		wp(680, 270, 10, this.bigWaypointSize),
	]
	readonly bottomRightWaypointsHS2 = [
		wp(450, 350, 10),
		wp(460, 400, 0),
		wp(590, 360, 0),
		wp(570, 410, 0),
		wp(470, 440, 0),
		wp(470, 490, 10, this.bigWaypointSize),
	]
	readonly bottomLeftWaypointsHS2 = [
		wp(360, 350, 10),
		wp(290, 390, 0),
		wp(140, 410, 0),
		wp(170, 450, 0),
		wp(360, 440, 0),
		wp(320, 480, 0),
		wp(180, 490, 10, this.bigWaypointSize),
	]
	readonly leftWaypointsHS2 = [
		wp(310, 270, 10),
		wp(210, 340, 0),
		wp(80, 300, 0),
		wp(90, 230, 0),
		wp(200, 270, 0),
		wp(210, 230, 10, this.bigWaypointSize),
	]

	readonly waypointsListHS2 = [
		this.topLeftWaypointsHS2,
		this.topRightWaypointsHS2,
		this.rightWaypointsHS2,
		this.bottomRightWaypointsHS2,
		this.bottomLeftWaypointsHS2,
		this.leftWaypointsHS2
	]

	readonly waypointsListHS = [
		this.topLeftWaypoints,
		this.topRightWaypoints,
		this.downLeftWaypoints,
		this.downRightWaypoints,
		this.middleLeftWaypoints,
		this.middleRightWaypoint
	]

	readonly obstacleColor: number = 0xff00ff


	readonly obstaclesListES_MS = [{
		x: 285,
		y: 340,
		w: 25,
		h: 40,
	}, {
		x: 171,
		y: 170,
		w: 40,
		h: 25,

	}, {
		x: 750,
		y: 158,
		w: 25,
		h: 40,
	}, {
		x: 470,
		y: 490,
		w: 40,
		h: 25,
	}]

	readonly obstaclesListHS = [
		{
			x: 288,
			y: 401,
			w: 15,
			h: 20,
		}, {
			x: 40,
			y: 241,
			w: 15,
			h: 20,
		}, {
			x: 675,
			y: 263,
			w: 15,
			h: 20,
		}, {
			x: 462,
			y: 480,
			w: 20,
			h: 15,
		}, {
			x: 585,
			y: 51,
			w: 15,
			h: 20,
		}, {
			x: 380,
			y: 120,
			w: 20,
			h: 15,
		}
	]

	readonly obstaclesListES_MS2 = [
		{x: 327, y: 110, w: 25, h: 40 },
		{x: 402, y: 459, w: 25, h: 40 },
		{x: 524, y: 158, w: 40, h: 25 },
		{x: 490, y: 430, w: 40, h: 25 }
	]
	readonly obstaclesListHS2 = [
		{x: 200, y: 208, w: 20, h: 15 },
		{x: 330, y: 65, w: 20, h: 15, rot: -30 },
		{x: 485, y: 207, w: 20, h: 15 },
		{x: 680, y: 260, w: 15, h: 20 },
		{x: 463, y: 503, w: 20, h: 15 },
		{x: 150, y: 485, w: 15, h: 20 }
	]

	

	readonly robotPosition1 = { x: 402, y: 270 }
	readonly robotPosition2 = { x: 402, y: 270 }


	getWalls(): ObstacleData[] {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return this.obstaclesListES_MS2;
			case AgeGroup.MS:
				return this.obstaclesListES_MS2;
			case AgeGroup.HS:
				return this.obstaclesListHS2;
		}

	}

	/**
	 * creates a the Waypoint list in the correct order
	 */
	sortColour(robotPosition: Vector) {
		const finalWaypointList = new WaypointList<ScoreWaypoint>()
		this.getColourOrder().forEach(colour => {
			const waypointList = new WaypointList<ScoreWaypoint>()
			this.getWaypoints().forEach(waypoints => {
				const initialWaypoint = waypoints[0]
				let waypointColour = this.getColourFromPosition({x: initialWaypoint.x, y: initialWaypoint.y})
				if (waypointColour != undefined) {
					const dr = colour.r - waypointColour[0]
					const dg = colour.g - waypointColour[1]
					const db = colour.b - waypointColour[2]
					const squareColorDiff = dr*dr + dg*dg + db*db
					if (squareColorDiff < 5*5) {
						waypoints.forEach(waypoint => {
							const x = waypoint.x
							const y = waypoint.y
							const wp = this.makeWaypoint({x: x, y: y}, waypoint.score, waypoint.r)
							waypointList.appendWaypoints(wp)
						})
						waypointList.appendReversedWaypoints()
					}
				}
			})
			finalWaypointList.append(waypointList)
		})
		finalWaypointList.appendWaypoints(this.makeWaypoint({x: robotPosition.x, y: robotPosition.y}, 0))
		this.setWaypointList(finalWaypointList)
	}

	/**
	 * @returns a one-dimensional array of the colour order for each division
	 */
	getColourOrder() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return this.colourES_MS;
			case AgeGroup.MS:
				return this.colourES_MS;
			case AgeGroup.HS:
				return this.colourHS;
		}
	}


	/**
	 * @returns a one-dimensional array of the waypoints
	 */
	getWaypoints() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return this.waypointsListES_MS2;
			case AgeGroup.MS:
				return this.waypointsListES_MS2;
			case AgeGroup.HS:
				return this.waypointsListHS2;
		}
	}

	/**
	 * @param pos of the pixel that should be read
	 * @returns returns one-dimensional array of the colour (red, green, blue) at pos
	 */
	getColourFromPosition(pos: { x: number, y: number }) {
		return this.getContainers().getGroundImageData(pos.x, pos.y, 1, 1)
	}

	getAsset() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				if (randomBool()) {
					return RRC.RAINBOW_BACKGROUND_ES;
				} else {
					return RRC.RAINBOW_BACKGROUND_ES_DINO;
				}

			case AgeGroup.MS:
				if (randomWeightedBool(RRC.RAINBOW_BACKGROUND_MS_DINO.getNumberOfIDs(), RRC.RAINBOW_BACKGROUND_MS_SPACE_INVADERS.getNumberOfIDs())) {
					return RRC.RAINBOW_BACKGROUND_MS_DINO.getRandomAsset();
				} else {
					return RRC.RAINBOW_BACKGROUND_MS_SPACE_INVADERS.getRandomAsset();
				}

			case AgeGroup.HS:
				return RRC.RAINBOW_BACKGROUND_HS_SPACE_INVADERS.getRandomAsset();
		}
	}

	backgroundAsset?: SpriteAsset;

	onLoadAssets(chain: AsyncChain) {
		this.backgroundAsset = this.getAsset();
		SharedAssetLoader.load(() => {
				chain.next();
			},
			this.backgroundAsset,
			RRC.GOAL_BACKGROUND
		);
	}

	getMaximumTimeBonusScore() {
		return 60 * 5
	}

	onInit(chain: AsyncChain) {
		const robotPosition = this.robotPosition2
		this.initRobot({position: { x: robotPosition.x, y: robotPosition.y }, rotation: -90});

		const containers = this.getContainers()

		if (this.backgroundAsset) {
			containers.groundContainer.addChild(this.backgroundAsset.newSprite());
		}

		// Debug show individual waypoints without reversal
		// let waypointList = new WaypointList<ScoreWaypoint>()
		// this.getWaypoints().forEach(ww => {
		// 	ww.forEach(w => {
		// 		waypointList.push(this.makeWaypoint(Vector.create(w.x, w.y), w.score, w.r))
		// 	})
		// })
		// this.setWaypointList(waypointList, "showAll")
		this.sortColour(robotPosition);

		this.getWalls().forEach((wall) => {
				this.addStaticWallInPixels(wall, {
					color: this.obstacleColor,
					strokeColor: this.obstacleColor,
					physics: { angle: Utils.flatMapOptional(wall.rot, r => r/180 * Math.PI) }
				})
			}
		)

		this.addWalls(true);

		chain.next();
	}
}