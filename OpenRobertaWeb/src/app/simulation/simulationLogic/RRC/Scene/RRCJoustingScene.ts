import {RRCScene, wp} from "./RRCScene";
import { AsyncChain } from "../../Scene/AsyncChain";
import * as RRC from '../RRAssetLoader'
import {AgeGroup} from "../AgeGroup";
import { WaypointList } from "../../Waypoints/WaypointList";
import {ScoreWaypoint} from "../../Waypoints/ScoreWaypoint";
import { Robot } from "../../Robot/Robot";
import { Bodies, Body, Bounds, Composite, Constraint, Vector } from "matter-js";
import { DrawableEntity } from "../../Entities/DrawableEntity";
import { PhysicsRectEntity } from "../../Entities/PhysicsRectEntity";
import { RobotProgramGenerator } from "../../Robot/RobotProgramGenerator";
import { GUIController } from "dat.gui";
import { Utils } from "../../Utils";
import { robot } from "guiState.model";
import { SharedAssetLoader } from "../../SharedAssetLoader";


export class RRCLineJoustingScene extends RRCScene {

	readonly bigWaypointSize = 70

	// Waypoints
	readonly waypointsES = [
		// wp( 62, 470, 0),
		// wp( 62, 360, 0),
	]

	readonly waypointsMS = [
		wp( 62, 470, 0),
		wp( 62, 360, 0),
	]

	readonly waypointsHS = [
		wp( 62, 470, 0),
		wp( 62, 360, 0),
	]

	readonly obstacleColor: number = 0xf68712

	// Walls
	readonly wallES = {
		x: 720,
		y: 50,
		w: 70,
		h: 25
	}

	readonly wallMS = {
		x: 720,
		y: 50,
		w: 70,
		h: 25
	}

	readonly wallHS = {
		x: 720,
		y: 50,
		w: 70,
		h: 25
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

	private robot2yOffset = 70
	private constraintStrength = 0.003
	private maxLancePositionDeviation = 0.5
	private readonly lanceSettings = {
		position: { x: 0.2, y: 0.05 },
		size: { length: 0.4, width: 0.02 },
		mass: 0.1,
		angle: Math.PI / 2 / 3
	}
	private robotToLanceEntity = new Map<Robot, PhysicsRectEntity>()

	private debugState?: GUIController

	onDeInit(chain: AsyncChain): void {

		//this.getDebugGuiStatic()?.remove(this.debugState!)

		chain.next()
	}

	private constraintLine = new DrawableEntity(this, new PIXI.Graphics(), this.containerManager.entityTopContainer)

	onInit(chain: AsyncChain) {
		//const allBitmask = ~0
		//const defaultCategory = 1 << 0
		const lanceCategory = 1 << 1
		const robot1Category = 1 << 2
		const robot2Category = 1 << 3

		const scene = this

		
		this.addEntity(this.constraintLine)

		if (this.debugState == undefined) {
			this.debugState = this.getDebugGuiStatic()?.add(this, "constraintStrength")
			this.getDebugGuiStatic()?.add(this, "maxLancePositionDeviation")
		}

		function addJoustingLance(robot: Robot, robotCategory: number) {
			const joustingLance = PhysicsRectEntity.create(
				robot.getScene(),
				scene.lanceSettings.position.x, scene.lanceSettings.position.y, scene.lanceSettings.size.length, scene.lanceSettings.size.width,
				{ physics: { mass: scene.lanceSettings.mass, angle: scene.lanceSettings.angle }, color: 0x00FF00 }
			)
			scene.robotToLanceEntity.set(robot, joustingLance)
			joustingLance

			robot.setDefaultCollisionCategory(robotCategory)
			// constraint at the start of the lance
			robot.addRelativePhysicsBodyEntity(joustingLance, { defaultConstraints: { 
				constraintStrength: scene.constraintStrength,
				relativePhysicsBodyOffset: { x: -scene.unit.getLength(scene.lanceSettings.size.length) / 2, y: 0 }
			} })

			const lanceCollisionFilter = joustingLance.getPhysicsBody().collisionFilter
			lanceCollisionFilter.category = lanceCategory
			lanceCollisionFilter.mask = ~robotCategory//~robot1Category & ~robot2Category

			robot.programManager.setPrograms([RobotProgramGenerator.generateProgram([
				RobotProgramGenerator.rotateOpCodes(100, Math.random() * 20 - 10, true),
				RobotProgramGenerator.driveForwardOpCodes(100, 10)
			])], robot.getScene().unit)
		}
		this.initRobot({ position: {x: 100, y: 100 }, rotation: 0, modifyRobot: robot => addJoustingLance(robot, robot1Category) });
		this.initRobot({ position: {x: 400, y: 100 + this.robot2yOffset }, rotation: 180, modifyRobot: robot => addJoustingLance(robot, robot2Category) });

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


		// === set waypoints ===

		this.setWaypointList(waypointList)

		// === set graphics ===

		let backgroundAsset = SharedAssetLoader.get(this.getAsset()).texture;
		//this.getContainers().groundContainer.addChild(new PIXI.Sprite(backgroundAsset));

		[
			// white background
			DrawableEntity.rect(this, 0, 0, backgroundAsset.width, backgroundAsset.height, { color: 0xffffff, relativeToCenter: false }),
			// robot1 line
			DrawableEntity.rect(this, 400, 100, 600, 10, { color: 0x000000, relativeToCenter: true }),
			// robot2 line
			DrawableEntity.rect(this, 400, 100 + this.robot2yOffset, 600, 10, { color: 0x000000, relativeToCenter: true })
		].forEach(entity => {
			entity.setContainer(this.containerManager.groundContainer)
			this.addEntity(entity)
		})

		this.addStaticWallInPixels(this.getWall(), {color: this.obstacleColor, strokeColor: this.obstacleColor})

		this.addWalls(true);

		chain.next();
	}

	// onUpdatePrePhysics(): void {

	// 	const robots = this.robotManager.getRobots()
	// 	if (robots.length == 2) {
	// 		const programs1 = robots[0].programManager.getPrograms()
	// 		const programs2 = robots[1].programManager.getPrograms()
	// 		if (programs1.length == 1 && (programs2.length == 0 || programs1[0].programString != programs2[0].programString)) {
	// 			robots[1].programManager.setPrograms([{ javaScriptProgram: programs1[0].programString }], this.unit)
	// 		}
	// 	}
	// }

	onUpdatePostPhysics(): void {

		const graphics = this.constraintLine.getDrawable()
		graphics
			.clear()
			.lineStyle(2)

		this.robotManager.getRobots().forEach(robot => {
			// calculate distance of 
			const body = robot.body
			const originalLancePosition = Vector.add(Vector.rotate({
				x: this.unit.getLength(this.lanceSettings.position.x),
				y: this.unit.getLength(this.lanceSettings.position.y)
			}, body.angle), body.position)
			const lanceBody = this.robotToLanceEntity.get(robot)!.getPhysicsBody()
			const distance = Vector.magnitude(Vector.sub(originalLancePosition, lanceBody.position))

			
			Composite.allConstraints(robot.physicsComposite).forEach(constraint => {
				if (constraint.bodyA === lanceBody || constraint.bodyB === lanceBody) {
					const start = Utils.vectorAdd(constraint.bodyA.position, constraint.pointA)
					const end = Utils.vectorAdd(constraint.bodyB.position, constraint.pointB)
					graphics.moveTo(start.x, start.y)
					graphics.lineTo(end.x, end.y)
				}
			})

			if (distance > this.unit.getLength(this.maxLancePositionDeviation)) {
				// remove all constraints from lance which were added to robot.physicsComposite
				Composite.allConstraints(robot.physicsComposite).forEach(constraint => {
					if (constraint.bodyA === lanceBody || constraint.bodyB === lanceBody) {
						Composite.remove(robot.physicsComposite, constraint, true)
					}
				})
				// lance body can now collide every body including the own robot
				//lanceBody.collisionFilter.mask = ~0
			}
		})
	}
}