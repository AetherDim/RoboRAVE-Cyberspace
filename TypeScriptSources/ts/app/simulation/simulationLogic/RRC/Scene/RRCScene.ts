import { AsyncChain } from "../../Scene/AsyncChain";
import * as RRC from '../RRAssetLoader'
import {AgeGroup} from "../AgeGroup";
import {Robot} from "../../Robot/Robot";
import {Body, Vector, World} from "matter-js";
import { Unit } from "../../Unit";
import {Scene} from "../../Scene/Scene";
import {PhysicsRectEntity} from "../../Entity";
import { ScoreWaypoint } from "../../Waypoints/ScoreWaypoint"
import { WaypointList } from "../../Waypoints/WaypointList";

export class RRCScene extends Scene {

	readonly ageGroup: AgeGroup;

	constructor(ageGroup: AgeGroup) {
		super();

		this.ageGroup = ageGroup;
	}

	/**
	 * @param position The position of the waypoint in matter Units
	 * @param score The score for reaching the waypoint
	 * @param maxDistance The maximum distance which still reaches the waypoint (default: 0.05 meters)
	 */
	makeWaypoint(position: Vector, score: number, maxDistance: number = 50): ScoreWaypoint {
		return new ScoreWaypoint(this.unit, this.unit.fromPosition(position), this.unit.fromLength(maxDistance), score)
	}
	
	setWaypointList(list: WaypointList<ScoreWaypoint>) {
		const t = this
		this.waypointsManager.resetListAndEvent(list, (idx, waypoint) => {
			t.addToScore(waypoint.score)
			if (idx == list.getLastWaypointIndex()) {
				t.showScoreScreen(10)
			}
		})
	}


	loadScoreAssets(chain: AsyncChain) {
		RRC.loader.load(() => {
			chain.next();
		},
		RRC.PROGGY_TINY_FONT,
		RRC.GOAL_BACKGROUND,
		);
	}

	protected goalSprite: PIXI.Sprite;

	scoreText2: PIXI.Text;
	scoreText3: PIXI.Text;
	scoreTextContainer: PIXI.Container = new PIXI.Container();

	initScoreContainer(chain: AsyncChain) {
		this.scoreContainer.zIndex = this.scoreContainerZ;

		let goal = RRC.loader.get(RRC.GOAL_BACKGROUND).texture;
		this.goalSprite = new PIXI.Sprite(goal);
		
		this.scoreContainer.addChild(this.goalSprite);


		// text
		
		this.scoreText = new PIXI.Text("",
		{
			fontFamily : 'ProggyTiny',
			fontSize: 160,
			fill : 0xf48613
		});

		this.scoreText2 = new PIXI.Text("",
		{
			fontFamily : 'ProggyTiny',
			fontSize: 160,
			fill : 0xc00001
		});

		this.scoreText3 = new PIXI.Text("",
		{
			fontFamily : 'ProggyTiny',
			fontSize: 160,
			fill : 0x00cb01
		});

		this.scoreTextContainer.addChild(this.scoreText3, this.scoreText2, this.scoreText);

		this.scoreContainer.addChild(this.scoreTextContainer);

		chain.next();
	}

	updateScoreAnimation(dt: number) {
		this.scoreTextContainer.x = this.goalSprite.width/2;
		this.scoreTextContainer.y = this.goalSprite.height/2;

		this.scoreTextContainer.rotation = 5 * Math.PI / 180 + Math.sin(Date.now()/700)/Math.PI;
	}

	updateScoreText() {
		let text = "Score: " + this.getScore();
		this.scoreText.text = text;
		this.scoreText.position.set(-this.scoreText.width/2, -this.scoreText.height/2);

		this.scoreText2.text = text;
		this.scoreText2.position.set(-this.scoreText.width/2-3, -this.scoreText.height/2);

		this.scoreText3.text = text;
		this.scoreText3.position.set(-this.scoreText.width/2+3, -this.scoreText.height/2);
	}

	getUnitConverter(): Unit {
		// approx 60px = 20cm
		return new Unit({ m: 350 })
	}

	onInit(chain: AsyncChain) {
		this.initRobot();
		this.setScore(266);
		this.showScoreScreen(100);
		chain.next();
	}

	/**
	 * Sets the position (matter units) and rotation (degrees; clockwise) of the robot
	 * @param opt Options of type '{ position?: Vector, rotation?: number }'
	 */
	initRobot(opt?: { position?: Vector, rotation?: number }) {
		let robot = Robot.EV3(this);
		const position = opt?.position ?? Vector.create()

		const unit = this.getUnitConverter();

		position.x = unit.fromLength(position.x);
		position.y = unit.fromLength(position.y);

		robot.setPose(this.unit.getPosition(position), opt?.rotation || 0, false)
		robot.body.enableMouseInteraction = true;
		this.addRobot(robot)
	}

	addWalls(visible: boolean = false) {
		let unit = this.getUnitConverter();

		const t = unit.fromLength(100);
		const x = unit.fromLength(0);
		const y = unit.fromLength(0);
		const w = unit.fromLength(800);
		const h = unit.fromLength(540);

		const top = PhysicsRectEntity.create(this, x - t, y - t, w + 2*t, t, {color: 0x000000, strokeColor: 0x000000, alpha: 0.2, relativeToCenter: false});
		const bottom = PhysicsRectEntity.create(this, x - t, y + h, w + 2*t, t, {color: 0x000000, strokeColor: 0x000000, alpha: 0.2, relativeToCenter: false});
		const left = PhysicsRectEntity.create(this, x - t, y, t, h, {color: 0x000000, strokeColor: 0x000000, alpha: 0.2, relativeToCenter: false});
		const right = PhysicsRectEntity.create(this, x + w, y, t, h, {color: 0x000000, strokeColor: 0x000000, alpha: 0.2, relativeToCenter: false});

		this.addEntity(top);
		this.addEntity(bottom);
		this.addEntity(left);
		this.addEntity(right);
		Body.setStatic(top.getPhysicsBody(), true);
		Body.setStatic(bottom.getPhysicsBody(), true);
		Body.setStatic(left.getPhysicsBody(), true);
		Body.setStatic(right.getPhysicsBody(), true);

		top.getDrawable().visible = visible;
		bottom.getDrawable().visible = visible;
		left.getDrawable().visible = visible;
		right.getDrawable().visible = visible;
	}



}