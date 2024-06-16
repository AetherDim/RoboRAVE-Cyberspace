import { AsyncChain } from "../../Scene/AsyncChain";
import { AgeGroup } from "../AgeGroup";
import {RRCScene, wp} from "./RRCScene";
import * as RRC from '../RRAssetLoader'
import { Body } from "matter-js";
import {WaypointList} from "../../Waypoints/WaypointList";
import {ScoreWaypoint} from "../../Waypoints/ScoreWaypoint";
import { PhysicsRectEntity } from "../../Entities/PhysicsRectEntity";
import {SharedAssetLoader} from "../../SharedAssetLoader";
import {Waypoint} from "../../Waypoints/Waypoint";
import {CHESS_PATTERN_LABYRINTH} from "../RRAssetLoader";

class LabyrinthRect {
	x: number;
	y: number;
	w: number;
	h: number;
	rotation: number;
	color: number;

	constructor(labyrinthRect: LabyrinthRect) {
		this.x = labyrinthRect.x
		this.y = labyrinthRect.y
		this.w = labyrinthRect.w
		this.h = labyrinthRect.h
		this.rotation = labyrinthRect.rotation
		this.color = labyrinthRect.color
	}
}

export class RRCLabyrinthScene extends RRCScene {

	readonly MazeObstacleList_ES: LabyrinthRect[] = [
	{ // add obstacles with lists like this
		x: 695,
		y: 100,
		w: 5,
		h: 440,
		rotation: 0,
		color: 0x29c27f
	}, {
		x: 100,
		y: 100,
		w: 595,
		h: 5,
		rotation: 0,
		color: 0x29c27f
	}, {
		x: 0,
		y: 205,
		w: 595,
		h: 5,
		rotation: 0,
		color: 0x29c27f
	}, {
		x: 590,
		y: 210,
		w: 5,
		h: 230,
		rotation: 0,
		color: 0x29c27f
	}, {
		x: 100,
		y: 435,
		w: 495,
		h: 5,
		rotation: 0,
		color: 0x29c27f
	}, {
		x: 100,
		y: 310,
		w: 5,
		h: 125,
		rotation: 0,
		color: 0x29c27f
	}, {
		x: 205,
		y: 210,
		w: 5,
		h: 125,
		rotation: 0,
		color: 0x29c27f
	}, {
		x: 210,
		y: 310,
		w: 280,
		h: 25,
		rotation: 0,
		color: 0x29c27f
	}];

	readonly MazeObstacleList_ES_Waypoints = [
		wp(745.471943488454, 56.41573850292542, 10, 60),
		wp(54.561521089673086, 54.578616428501704, 10, 60),
		wp(56.94166548626347, 153.83907315081825, 10, 60),
		wp(640.4716541853163, 166.74198579286042, 10, 60),
		wp(638.799848429799, 484.23361687525244, 10, 60),
		wp(58.4250132228549, 481.076981352756, 10, 60),
		wp(52.994165084968614, 262.5520455208635, 10, 60),
		wp(151.69025603928773, 265.9632197783464, 10, 60),
		wp(159.02149354104046, 380.94333503837163, 10, 60),
		wp(543.2560713393749, 380.46722869212874, 10, 60),
		wp(540.7526760956091, 267.49897928869785, 10, 60),
		wp(263.35418049687445, 262.51973210027825, 10, 60),
	]


	readonly MazeObstacleList_MS: LabyrinthRect[] = [
		{ // add obstacles with lists like this
			x: 695,
			y: 100,
			w: 5,
			h: 440,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 205,
			y: 100,
			w: 490,
			h: 5,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 100,
			y: 100,
			w: 5,
			h: 105,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 0,
			y: 205,
			w: 595,
			h: 5,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 205,
			y: 435,
			w: 390,
			h: 5,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 100,
			y: 310,
			w: 5,
			h: 130,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 205,
			y: 310,
			w: 5,
			h: 130,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 590,
			y: 210,
			w: 5,
			h: 230,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 210,
			y: 310,
			w: 280,
			h: 25,
			rotation: 0,
			color: 0x29c27f
		}];

	readonly MazeObstacleList_MS_Waypoints = [
		wp(749.9644930779159, 53.57101801235041, 10, 60),
		wp(163.44368626752964, 57.55270502937634, 10, 60),
		wp(158.1736200600906, 159.90933810929084, 10, 60),
		wp(640.592197258446, 154.9823512142699, 10, 60),
		wp(639.6051457735002, 485.8895109324285, 10, 60),
		wp(154.14101385658392, 483.90361435263895, 10, 60),
		wp(157.3926998275401, 267.87910873898966, 10, 60),
		wp(545.788756034993, 390.5184603269341, 10, 60),
		wp(542.5111920355592, 259.5994071096399, 10, 60),
		wp(267.8770860374464, 382.6234479916538, 10, 60),
	]


	readonly MazeObstacleList_HS: LabyrinthRect[] = [
		{ // add obstacles with lists like this
			x: 695,
			y: 100,
			w: 5,
			h: 440,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 205,
			y: 100,
			w: 490,
			h: 5,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 100,
			y: 100,
			w: 5,
			h: 105,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 0,
			y: 205,
			w: 595,
			h: 5,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 205,
			y: 435,
			w: 390,
			h: 5,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 100,
			y: 310,
			w: 5,
			h: 130,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 205,
			y: 205,
			w: 5,
			h: 130,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 590,
			y: 210,
			w: 5,
			h: 230,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 210,
			y: 310,
			w: 180,
			h: 25,
			rotation: 0,
			color: 0x29c27f
		}, {
			x: 500,
			y: 310,
			w: 90,
			h: 25,
			rotation: 0,
			color: 0x29c27f
		}];

	readonly MazeObstacleList_HS_Waypoints = [
		wp(749.9644930779159, 53.57101801235041, 10, 60),
		wp(163.44368626752964, 57.55270502937634, 10, 60),
		wp(158.1736200600906, 159.90933810929084, 10, 60),
		wp(640.592197258446, 154.9823512142699, 10, 60),
		wp(639.6051457735002, 485.8895109324285, 10, 60),
		wp(154.14101385658392, 483.90361435263895, 10, 60),
		wp(164.5985688406025, 383.93544037904775, 10, 60),
		wp(439.03031989566057, 378.9844209582838, 10, 60),
		wp(444.674086629173, 269.35754843765153, 10, 60),
		wp(271.36844579796883, 264.52622828918646, 10, 60),
	]



	setZeroColor<T extends { color: number }>(color: number): (value: T) => T {
		return v => {
			v.color = v.color == 0 ? color : v.color
			return v
		}
	}

	modify<T>(f: (value: T) => void): (value: T) => T {
		return v => {
			f(v)
			return v
		}
	}

	getWaypoints() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return this.MazeObstacleList_ES_Waypoints;

			case AgeGroup.MS:
				return this.MazeObstacleList_MS_Waypoints;

			case AgeGroup.HS:
				return this.MazeObstacleList_HS_Waypoints;
		}
	}


	addLabyrinth(labyrinth: LabyrinthRect[]) {
		const unit = this.unit
		labyrinth.forEach(rect => {
			const x = unit.fromLength(rect.x);
			const y = unit.fromLength(rect.y);
			const w = unit.fromLength(rect.w);
			const h = unit.fromLength(rect.h);
			const bodyEntity = PhysicsRectEntity.create(this, x, y, w, h, {color: rect.color, strokeColor: rect.color, relativeToCenter: false});
			this.addEntity(bodyEntity);
			Body.setStatic(bodyEntity.getPhysicsBody(), true);
		});
	}

	onLoadAssets(chain: AsyncChain) {
		SharedAssetLoader.load(() => {
			chain.next();
		},
			this.getAsset(),
			RRC.GOAL_BACKGROUND,
			CHESS_PATTERN_LABYRINTH,
		);
	}

	getAsset() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return RRC.LABYRINTH_BLANK_BACKGROUND_ES;

			case AgeGroup.MS:
				return RRC.LABYRINTH_BLANK_BACKGROUND_MS;

			case AgeGroup.HS:
				return RRC.LABYRINTH_BLANK_BACKGROUND_HS;
		}
	}

	getMaximumTimeBonusScore() {
		return 60 * 6
	}

	onInit(chain: AsyncChain) {

		this.initRobot({position: {x: 752, y: 490}, rotation: -90});

		let backgroundAsset = SharedAssetLoader.get(this.getAsset()).texture;
		this.getContainers().groundContainer.addChild(new PIXI.Sprite(backgroundAsset));

		let checkerboard = new PIXI.Sprite(SharedAssetLoader.get(CHESS_PATTERN_LABYRINTH).texture)
		this.getContainers().groundContainer.addChild(checkerboard);


		switch (this.ageGroup) {
			case AgeGroup.ES:
				this.addLabyrinth(this.MazeObstacleList_ES);
				checkerboard.setTransform(210, 210, 1 / 11.82, 1 / 11.82);
				break;
		
			case AgeGroup.MS:
				this.addLabyrinth(this.MazeObstacleList_MS);
				checkerboard.setTransform(210, 335, 1 / 11.82, 1 / 11.82);
				break;

			case AgeGroup.HS:
				this.addLabyrinth(this.MazeObstacleList_HS);
				checkerboard.setTransform(210, 210, 1 / 11.82, 1 / 11.82);
				break;
		}

		const waypointList = new WaypointList<ScoreWaypoint>()
		const waypoints = this.getWaypoints()

		waypoints.forEach(waypoint => {
			const x = waypoint.x
			const y = waypoint.y
			const wp = this.makeWaypoint({x: x, y: y}, waypoint.score, waypoint.r)
			waypointList.appendWaypoints(wp)
		})


		this.setWaypointList(waypointList)



		this.addWalls(true);

		chain.next();
	}



}