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
		wp(200.34844892201156, 581.7628880718204, 0),
		wp(201.05381418950202, 415.9109290560717, 0),
		wp(200.7823137787071, 225.59317349047413, 0),
		wp(277.4160143532946, 119.1773543733446, 0),
		wp(401.85154174062666, 109.40968051563144, 0),
		wp(483.20594077228463, 197.38343642728717, 0),
		wp(470.8343777614985, 311.9822907782569, 0),
		wp(401.0099416367138, 444.63800164222414, 0),
		wp(461.9040499757937, 558.3626241832281, 0),
		wp(597.1109262885617, 579.3261086846604, 0),
		wp(684.5713582627976, 494.86797198528836, 0),
		wp(792.756776273114, 402.03730975739296, 0),
		wp(916.8775164053585, 434.3031763434242, 0),
		wp(1005.810280747585, 527.6915263496352, 0),
		wp(1145.7029890608655, 527.6153048285714, 0),
		wp(1216.2561805353798, 436.10383865795336, 0),
		wp(1191.2514217267408, 315.9933229002004, 0),
		wp(1169.9508771760034, 199.10923021081996, 0),
		wp(1169.0845542327245, 87.23701768225374, 0),
	]

	readonly waypointsMS = [
		wp(151.4375628102969, 580.9113640556752, 0),
		wp(153.25472866293472, 453.4993112217108, 0),
		wp(154.52485858538657, 318.9641801923209, 0),
		wp(189.33561995477527, 184.46475381553958, 0),
		wp(300.281723512223, 129.0779114563726, 0),
		wp(398.0461558979968, 168.07185518659352, 0),
		wp(441.7139561890306, 258.60546495739953, 0),
		wp(422.78339464112736, 348.44845783710804, 0),
		wp(408.87238095694835, 490.6060741506416, 0),
		wp(507.20312779689266, 569.7641172353857, 0),
		wp(642.9214709039957, 536.9863730402715, 0),
		wp(685.9451628126744, 425.7814073434603, 0),
		wp(635.9022811532896, 310.2222349319217, 0),
		wp(637.4752263751304, 191.55609421440826, 0),
		wp(704.7560843812435, 105.32884060597547, 0),
		wp(831.8309031917588, 104.6136347571073, 0),
		wp(958.1478104457618, 140.29992003529924, 0),
		wp(1002.6023181572707, 258.9153943185824, 0),
		wp(951.079956833557, 379.9935851634381, 0),
		wp(971.1774705414703, 501.34475955652806, 0),
		wp(1091.800152498632, 551.644224524681, 0),
		wp(1219.845242053426, 489.816779917294, 0),
		wp(1234.8993954528298, 366.1885232438113, 0),
		wp(1192.0060294418902, 254.90444945877306, 0),
		wp(1193.5125523301483, 164.1141161972689, 0),
		wp(1194.0042870567916, 83.07129304832286, 0),
	]

	readonly waypointsHS = [
		wp(197.89112824111325, 583.9401725614232, 0),
		wp(196.94775150300399, 437.5023686314429, 0),
		wp(199.57838503080174, 267.7290979592269, 0),
		wp(264.24220200403624, 144.189106797676, 0),
		wp(415.21593869187654, 144.6206822440679, 0),
		wp(486.42470788136393, 243.3116533373045, 0),
		wp(492.2125229233826, 364.8639660344868, 0),
		wp(485.3234070681715, 519.6719022135059, 0),
		wp(542.9792426572145, 572.427441639362, 0),
		wp(667.1989973312294, 548.3747086622778, 0),
		wp(731.2580988127842, 450.583359626309, 0),
		wp(698.6773977458435, 345.41267830977915, 0),
		wp(684.2794350116411, 254.91556217057575, 0),
		wp(684.4105604546635, 158.2183480691217, 0),
		wp(740.9132470110502, 103.48120870631091, 0),
		wp(855.6909829621185, 104.6239718601375, 0),
		wp(967.2865896950078, 121.47364985166571, 0),
		wp(1037.4986486274033, 201.72844729832758, 0),
		wp(1023.7346670481227, 322.405452047898, 0),
		wp(1009.8785206934185, 426.87102418440725, 0),
		wp(1068.435010337641, 523.6472591422429, 0),
		wp(1180.5748127020843, 545.414465811674, 0),
		wp(1278.5820319754205, 456.7469864240758, 0),
		wp(1261.658146524431, 323.52390109206874, 0),
		wp(1236.5782034454546, 215.01610822526862, 0),
		wp(1241.3575625184621, 89.34255394141384, 0),
	]

	readonly obstacleColor: number = 0xf68712

	// Walls
	readonly wallES = {
		x: 1126,
		y: 50,
		w: 86,
		h: 25
	}

	readonly wallMS = {
		x: 1152,
		y: 50,
		w: 86,
		h: 25
	}

	readonly wallHS = {
		x: 1197,
		y: 50,
		w: 86,
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

	getRobotStartPosition() {
		switch (this.ageGroup) {
			case AgeGroup.ES:
				return { position: {x: 200, y: 658 }, rotation: -90 }
			case AgeGroup.MS:
				return { position: {x: 154, y: 658 }, rotation: -90 }
			case AgeGroup.HS:
				return { position: {x: 196, y: 658 }, rotation: -90 }
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
		case AgeGroup.MS: return [14]
		case AgeGroup.HS: return [8, 14]
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
		this.scoreBackgroundSprite!.scale.set(this.getContainers().groundContainer.width/this.scoreBackgroundSprite!.width, this.getContainers().groundContainer.height/this.scoreBackgroundSprite!.height);

		this.addStaticWallInPixels(this.getWall(), {color: this.obstacleColor, strokeColor: this.obstacleColor})

		this.addWalls(true, {t: 100, x:0, y:0, w: 4309/3, h: 2155/3});


		chain.next();
	}
}