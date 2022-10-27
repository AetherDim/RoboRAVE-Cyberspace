import { AsyncChain } from "../../Scene/AsyncChain";
import { AgeGroup } from "../AgeGroup";
import {RRCScene, wp} from "./RRCScene";
import * as RRC from '../RRAssetLoader'
import { Body } from "matter-js";
import {WaypointList} from "../../Waypoints/WaypointList";
import {ScoreWaypoint} from "../../Waypoints/ScoreWaypoint";
import { PhysicsRectEntity } from "../../Entities/PhysicsRectEntity";
import {SharedAssetLoader} from "../../SharedAssetLoader";

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
		x: 500,
		y: 100,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 700,
		y: 100,
		w: 5,
		h: 450,
		rotation: 0,
		color: 0x000000
	}, {
		x: 400,
		y: 0,
		w: 5,
		h: 200,
		rotation: 0,
		color: 0x000000
	}, {
		x: 400,
		y: 200,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 600,
		y: 200,
		w: 5,
		h: 250,
		rotation: 0,
		color: 0x000000
	}, {
		x: 400,
		y: 450,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 300,
		y: 100,
		w: 5,
		h: 450,
		rotation: 0,
		color: 0x000000
	}, {
		x: 300,
		y: 300,
		w: 200,
		h: 50,
		rotation: 0,
		color: 0x111111
	}, {
		x: 200,
		y: 0,
		w: 5,
		h: 350,
		rotation: 0,
		color: 0x000000
	}, {
		x: 100,
		y: 450,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 100,
		y: 100,
		w: 5,
		h: 350,
		rotation: 0,
		color: 0x000000
	}];

	MazeObstacleList_MS: LabyrinthRect[] = [{ // add obstacles with lists like this
		x: 500,
		y: 100,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 700,
		y: 100,
		w: 5,
		h: 450,
		rotation: 0,
		color: 0x000000
	}, {
		x: 400,
		y: 0,
		w: 5,
		h: 200,
		rotation: 0,
		color: 0x000000
	}, {
		x: 400,
		y: 200,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 600,
		y: 200,
		w: 5,
		h: 250,
		rotation: 0,
		color: 0x000000
	}, {
		x: 400,
		y: 450,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 300,
		y: 100,
		w: 5,
		h: 450,
		rotation: 0,
		color: 0x000000
	}, {
		x: 300,
		y: 300,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 400,
		y: 300,
		w: 100,
		h: 50,
		rotation: 0,
		color: 0x111111
	}, {
		x: 200,
		y: 0,
		w: 5,
		h: 350,
		rotation: 0,
		color: 0x000000
	}, {
		x: 100,
		y: 450,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 100,
		y: 100,
		w: 5,
		h: 350,
		rotation: 0,
		color: 0x000000
	}];

	MazeObstacleList_HS: LabyrinthRect[] = [{ // add obstacles with lists like this
		x: 600,
		y: 100,
		w: 100,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 700,
		y: 100,
		w: 5,
		h: 450,
		rotation: 0,
		color: 0x000000
	}, {
		x: 400,
		y: 100,
		w: 100,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 400,
		y: 0,
		w: 5,
		h: 100,
		rotation: 0,
		color: 0x000000
	}, {
		x: 500,
		y: 100,
		w: 5,
		h: 100,
		rotation: 0,
		color: 0x000000
	}, {
		x: 500,
		y: 200,
		w: 100,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 600,
		y: 200,
		w: 5,
		h: 250,
		rotation: 0,
		color: 0x000000
	}, {
		x: 400,
		y: 450,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 300,
		y: 100,
		w: 5,
		h: 450,
		rotation: 0,
		color: 0x000000
	}, {
		x: 300,
		y: 300,
		w: 200,
		h: 50,
		rotation: 0,
		color: 0x111111
	}, {
		x: 300,
		y: 200,
		w: 100,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 200,
		y: 0,
		w: 5,
		h: 350,
		rotation: 0,
		color: 0x000000
	}, {
		x: 100,
		y: 450,
		w: 200,
		h: 5,
		rotation: 0,
		color: 0x000000
	}, {
		x: 100,
		y: 100,
		w: 5,
		h: 350,
		rotation: 0,
		color: 0x000000
	}];


	readonly MazeEnd2: LabyrinthRect[] = [
		{
			x: 200,
			y: 0,
			w: 5,
			h: 250,
			rotation: 0,
			color: 0x000000
		}, {
			x: 100,
			y: 350,
			w: 200,
			h: 5,
			rotation: 0,
			color: 0x000000
		}, {
			x: 100,
			y: 100,
			w: 5,
			h: 250,
			rotation: 0,
			color: 0x000000
		}, {
			x: 0,
			y: 450,
			w: 200,
			h: 5,
			rotation: 0,
			color: 0x000000
		}
	].map(this.setZeroColor(0x00ff00))

	readonly MazeCommon2: LabyrinthRect[] = [
		{
			x: 600,
			y: 200,
			w: 5,
			h: 250,
			rotation: 0,
			color: 0x0000ff
		},
		{
			x: 300,
			y: 100,
			w: 5,
			h: 440,
			rotation: 0,
			color: 0x000000
		}, {
			x: 600,
			y: 100,
			w: 100,
			h: 5,
			rotation: 0,
			color: 0x000000
		}, {
			x: 700,
			y: 100,
			w: 5,
			h: 450,
			rotation: 0,
			color: 0x000000
		}
	].map(this.setZeroColor(0x0000ff)).concat(this.MazeEnd2)

	readonly MazeCommonESandMS2: LabyrinthRect[] = [
		{
			x: 400,
			y: 450,
			w: 200,
			h: 5,
			rotation: 0,
			color: 0x000000
		}, {
			x: 500,
			y: 0,
			w: 5,
			h: 200,
			rotation: 0,
			color: 0x000000
		}, {
			x: 300,
			y: 100,
			w: 100,
			h: 5,
			rotation: 0,
			color: 0x000000
		}, {
			x: 400,
			y: 200,
			w: 200,
			h: 5,
			rotation: 0,
			color: 0x000000
		}
	].map(this.setZeroColor(0xff0000))



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
	


	readonly MazeObstacleList_ES2: LabyrinthRect[] = [
		{
			x: 300,
			y: 300,
			w: 200,
			h: 50,
			rotation: 0,
			color: 0x000000
		}
	].concat(this.MazeCommonESandMS2, this.MazeCommon2);

	MazeObstacleList_MS2: LabyrinthRect[] = [
		{
			x: 300,
			y: 300,
			w: 200,
			h: 5,
			rotation: 0,
			color: 0x000000
		}, {
			x: 400,
			y: 300,
			w: 100,
			h: 50,
			rotation: 0,
			color: 0x000000
		}
	].concat(this.MazeCommonESandMS2, this.MazeCommon2);

	MazeObstacleList_HS2: LabyrinthRect[] = [
		{
			x: 600,
			y: 100,
			w: 100,
			h: 5,
			rotation: 0,
			color: 0x000000
		}, {
			x: 700,
			y: 100,
			w: 5,
			h: 450,
			rotation: 0,
			color: 0x000000
		}, {
			x: 400,
			y: 100,
			w: 100,
			h: 5,
			rotation: 0,
			color: 0x000000
		}, {
			x: 400,
			y: 0,
			w: 5,
			h: 100,
			rotation: 0,
			color: 0x000000
		}, {
			x: 500,
			y: 100,
			w: 5,
			h: 100,
			rotation: 0,
			color: 0x000000
		}, {
			x: 500,
			y: 200,
			w: 100,
			h: 5,
			rotation: 0,
			color: 0x000000
		}, {
			x: 300,
			y: 300,
			w: 200,
			h: 50,
			rotation: 0,
			color: 0x000000
		}, {
			x: 300,
			y: 200,
			w: 100,
			h: 5,
			rotation: 0,
			color: 0x000000
		},
		// lower part
		{
			x: 300,
			y: 450,
			w: 100,
			h: 5,
			rotation: 0,
			color: 0x000000
		},
		{
			x: 500,
			y: 450,
			w: 100,
			h: 5,
			rotation: 0,
			color: 0x000000
		}
	].concat(this.MazeCommon2);

	readonly waypointES_MS = [
		{
			x: 700,
			y: 436,
			w: 100,
			h: 100,
			score: 0
		},
		{
			x: 700,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 400,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 400,
			y: 100,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 600,
			y: 100,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 600,
			y: 440,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 300,
			y: 440,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 300,
			y: 340,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 500,
			y: 340,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 500,
			y: 200,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 300,
			y: 200,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 300,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 200,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 200,
			y: 340,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 100,
			y: 340,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 100,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 0,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 0,
			y: 440,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 200,
			y: 450,
			w: 100,
			h: 100,
			score: 10
		}
	].map(w => {
		const r = Math.sqrt(w.w*w.w + w.h*w.h) / 2
		wp(w.x + w.w/2, w.y + w.h/2, w.score, r)
	})

	readonly waypointsHS = [
		{
			x: 700,
			y: 436,
			w: 100,
			h: 100,
			score: 0
		},
		{
			x: 700,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 500,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 500,
			y: 100,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 600,
			y: 100,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 600,
			y: 440,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 300,
			y: 440,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 300,
			y: 340,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 500,
			y: 340,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 500,
			y: 200,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 400,
			y: 200,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 400,
			y: 100,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 300,
			y: 100,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 300,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 200,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 200,
			y: 340,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 100,
			y: 340,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 100,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 0,
			y: 0,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 0,
			y: 440,
			w: 100,
			h: 100,
			score: 10
		},{
			x: 200,
			y: 450,
			w: 100,
			h: 100,
			score: 10
		}
	].map(w => {
		const r = Math.sqrt(w.w*w.w + w.h*w.h) / 2
		wp(w.x + w.w/2, w.y + w.h/2, w.score, r)
	})

	getWaypoints() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return this.waypointsESandMS2;

			case AgeGroup.MS:
				return this.waypointsESandMS2;

			case AgeGroup.HS:
				return this.waypointsHS2;
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
			RRC.GOAL_BACKGROUND
		);
	}

	private readonly waypointsESandMS2 = [
		wp(750, 500, 0, 70),
		wp(750, 50, 10, 70),
		wp(550, 50, 10, 70),
		wp(550, 150, 10, 70),
		wp(650, 150, 10, 70),
		wp(650, 500, 10, 70),
		wp(350, 500, 10, 70),
		wp(350, 390, 10, 70),
		wp(550, 390, 10, 70),
		wp(550, 250, 10, 70),
		wp(350, 250, 10, 70),
		wp(350, 150, 10, 70),
		wp(450, 150, 10, 70),
		wp(450, 50, 10, 70),
		wp(250, 50, 10, 70),
		wp(250, 300, 10, 70),
		wp(150, 300, 10, 70),
		wp(150, 50, 10, 70),
		wp(50, 50, 10, 70),
		wp(50, 400, 10, 70),
		wp(250, 400, 10, 70),
		wp(250, 500, 10, 70),
		wp(50, 500, 10, 70),
	]

	private readonly waypointsHS2 = [
		wp(750, 500, 0, 70),
		wp(750, 50, 10, 70),
		wp(550, 50, 10, 70),
		wp(550, 150, 10, 70),
		wp(650, 150, 10, 70),
		wp(650, 500, 10, 70),
		wp(450, 500, 10, 70),
		wp(450, 400, 10, 70),
		wp(550, 390, 10, 70),
		wp(550, 250, 10, 70),
		wp(450, 250, 10, 70),
		wp(450, 150, 10, 70),
		wp(350, 150, 10, 70),
		wp(350, 50, 10, 70),
		wp(250, 50, 10, 70),
		wp(250, 300, 10, 70),
		wp(150, 300, 10, 70),
		wp(150, 50, 10, 70),
		wp(50, 50, 10, 70),
		wp(50, 400, 10, 70),
		wp(250, 400, 10, 70),
		wp(250, 500, 10, 70),
		wp(50, 500, 10, 70),
	]

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
		return 60 * 3
	}

	onInit(chain: AsyncChain) {

		this.initRobot({position: {x: 752, y: 490}, rotation: -90});

		let backgroundAsset = SharedAssetLoader.get(this.getAsset()).texture;
		this.getContainers().groundContainer.addChild(new PIXI.Sprite(backgroundAsset));

		switch (this.ageGroup) {
			case AgeGroup.ES:
				this.addLabyrinth(this.MazeObstacleList_ES2);
				break;
		
			case AgeGroup.MS:
				this.addLabyrinth(this.MazeObstacleList_MS2);
				break;

			case AgeGroup.HS:
				this.addLabyrinth(this.MazeObstacleList_HS2);
				break;
		}

		// TODO: Change the waypoints
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