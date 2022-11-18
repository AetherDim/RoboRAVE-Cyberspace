var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./RRCScene", "../RRAssetLoader", "../AgeGroup", "../../Waypoints/WaypointList", "../../Utils", "../../SharedAssetLoader"], function (require, exports, RRCScene_1, RRC, AgeGroup_1, WaypointList_1, Utils_1, SharedAssetLoader_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RRCLineFollowingScene = void 0;
    var RRCLineFollowingScene = /** @class */ (function (_super) {
        __extends(RRCLineFollowingScene, _super);
        function RRCLineFollowingScene() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.bigWaypointSize = 70;
            // Waypoints
            _this.waypointsES = [
                (0, RRCScene_1.wp)(572, 317, 0),
                (0, RRCScene_1.wp)(630, 317, 0),
                (0, RRCScene_1.wp)(578, 427, 0),
                (0, RRCScene_1.wp)(427, 362, 0),
                (0, RRCScene_1.wp)(462, 284, 0),
                (0, RRCScene_1.wp)(575, 187, 0),
                (0, RRCScene_1.wp)(501, 111, 0),
                (0, RRCScene_1.wp)(372, 106, 0),
                (0, RRCScene_1.wp)(217, 120, 0),
                (0, RRCScene_1.wp)(121, 206, 0),
                (0, RRCScene_1.wp)(111, 290, 0),
                (0, RRCScene_1.wp)(136, 359, 0),
                (0, RRCScene_1.wp)(234, 428, 0),
                (0, RRCScene_1.wp)(324, 365, 0),
                (0, RRCScene_1.wp)(328, 273, 0),
            ];
            _this.waypointsMS = [
                (0, RRCScene_1.wp)(720, 252, 0),
                (0, RRCScene_1.wp)(709, 355, 0),
                (0, RRCScene_1.wp)(605, 418, 0),
                (0, RRCScene_1.wp)(509, 342, 0),
                (0, RRCScene_1.wp)(551, 250, 0),
                (0, RRCScene_1.wp)(644, 172, 0),
                (0, RRCScene_1.wp)(548, 105, 0),
                (0, RRCScene_1.wp)(484, 105, 0),
                (0, RRCScene_1.wp)(361, 101, 0),
                (0, RRCScene_1.wp)(281, 121, 0),
                (0, RRCScene_1.wp)(332, 246, 0),
                (0, RRCScene_1.wp)(178, 237, 0),
                (0, RRCScene_1.wp)(163, 329, 0),
                (0, RRCScene_1.wp)(273, 422, 0),
                (0, RRCScene_1.wp)(344, 393, 0),
                (0, RRCScene_1.wp)(397, 305, 0),
                (0, RRCScene_1.wp)(433, 373, 0),
                (0, RRCScene_1.wp)(432, 445, 0),
            ];
            _this.waypointsHS = [
                (0, RRCScene_1.wp)(397, 272, 0),
                (0, RRCScene_1.wp)(373, 165, 0),
                (0, RRCScene_1.wp)(255, 106, 0),
                (0, RRCScene_1.wp)(187, 134, 0),
                (0, RRCScene_1.wp)(247, 194, 0),
                (0, RRCScene_1.wp)(322, 237, 0),
                (0, RRCScene_1.wp)(258, 268, 0),
                (0, RRCScene_1.wp)(180, 248, 0),
                (0, RRCScene_1.wp)(129, 305, 0),
                (0, RRCScene_1.wp)(155, 368, 0),
                (0, RRCScene_1.wp)(257, 343, 0),
                (0, RRCScene_1.wp)(293, 384, 0),
                (0, RRCScene_1.wp)(262, 434, 0),
                (0, RRCScene_1.wp)(281, 463, 0),
                (0, RRCScene_1.wp)(369, 451, 0),
                (0, RRCScene_1.wp)(440, 386, 0),
                (0, RRCScene_1.wp)(462, 309, 0),
                (0, RRCScene_1.wp)(451, 231, 0),
                (0, RRCScene_1.wp)(476, 171, 0),
                (0, RRCScene_1.wp)(556, 151, 0),
                (0, RRCScene_1.wp)(642, 208, 0),
                (0, RRCScene_1.wp)(642, 264, 0),
                (0, RRCScene_1.wp)(542, 290, 0),
                (0, RRCScene_1.wp)(515, 338, 0),
                (0, RRCScene_1.wp)(540, 396, 0),
                (0, RRCScene_1.wp)(649, 411, 0),
                (0, RRCScene_1.wp)(725, 399, 0),
                (0, RRCScene_1.wp)(737, 324, 0),
                (0, RRCScene_1.wp)(692, 200, 0),
                (0, RRCScene_1.wp)(662, 109, 0),
                (0, RRCScene_1.wp)(731, 100, 0),
            ];
            _this.obstacleColor = 0xf68712;
            // Walls
            _this.wallES = {
                x: 294,
                y: 242,
                w: 70,
                h: 25
            };
            _this.wallMS = {
                x: 397,
                y: 449,
                w: 70,
                h: 25
            };
            _this.wallHS = {
                x: 735,
                y: 65,
                w: 25,
                h: 70
            };
            return _this;
        }
        RRCLineFollowingScene.prototype.getWaypoints = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return this.waypointsES;
                case AgeGroup_1.AgeGroup.MS:
                    return this.waypointsMS;
                case AgeGroup_1.AgeGroup.HS:
                    return this.waypointsHS;
            }
        };
        RRCLineFollowingScene.prototype.getWall = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return this.wallES;
                case AgeGroup_1.AgeGroup.MS:
                    return this.wallMS;
                case AgeGroup_1.AgeGroup.HS:
                    return this.wallHS;
            }
        };
        RRCLineFollowingScene.prototype.getRobotStartPosition = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return { position: { x: 570, y: 314 }, rotation: 0 };
                case AgeGroup_1.AgeGroup.MS:
                    return { position: { x: 718, y: 248 }, rotation: 90 };
                case AgeGroup_1.AgeGroup.HS:
                    return { position: { x: 396, y: 270 }, rotation: -90 };
            }
        };
        RRCLineFollowingScene.prototype.getAsset = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return RRC.LINE_FOLLOWING_BACKGROUND_ES;
                case AgeGroup_1.AgeGroup.MS:
                    return RRC.LINE_FOLLOWING_BACKGROUND_MS;
                case AgeGroup_1.AgeGroup.HS:
                    return RRC.LINE_FOLLOWING_BACKGROUND_HS;
            }
        };
        RRCLineFollowingScene.prototype.onLoadAssets = function (chain) {
            SharedAssetLoader_1.SharedAssetLoader.load(function () {
                chain.next();
            }, this.getAsset(), RRC.GOAL_BACKGROUND);
        };
        RRCLineFollowingScene.prototype.getMaximumTimeBonusScore = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return 4 * 60;
                case AgeGroup_1.AgeGroup.MS:
                    return 5 * 60;
                case AgeGroup_1.AgeGroup.HS:
                    return 6 * 60;
            }
        };
        /**
         * Returns the indices of the waypoints where a junction is
         */
        RRCLineFollowingScene.prototype.junctionIndices = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES: return [];
                case AgeGroup_1.AgeGroup.MS: return [7];
                case AgeGroup_1.AgeGroup.HS: return [6, 25];
                default: Utils_1.Utils.exhaustiveSwitch(this.ageGroup);
            }
        };
        RRCLineFollowingScene.prototype.onInit = function (chain) {
            var _this = this;
            this.initRobot(this.getRobotStartPosition());
            // TODO: Change the waypoints
            var waypointList = new WaypointList_1.WaypointList();
            var waypoints = this.getWaypoints();
            waypoints.forEach(function (waypoint) {
                var x = waypoint.x;
                var y = waypoint.y;
                var r = waypoint.r;
                var wp = _this.makeWaypoint({ x: x, y: y }, waypoint.score, r);
                waypointList.appendWaypoints(wp);
            });
            var reversedWaypoints = waypointList.reversed(false);
            // === set graphics ===
            waypointList.getLastWaypoint().setMaxDistanceInMatterUnits(this.bigWaypointSize);
            reversedWaypoints.getLastWaypoint().setMaxDistanceInMatterUnits(this.bigWaypointSize);
            // === set score ===
            // leaves the starting position 
            waypointList.get(1).score = this.ageGroup == AgeGroup_1.AgeGroup.ES ? 50 : 25;
            // arrives at the "tower"
            waypointList.getLastWaypoint().score = this.ageGroup == AgeGroup_1.AgeGroup.HS ? 50 : 100;
            // on the way back to the starting point
            reversedWaypoints.get(2).score = this.ageGroup == AgeGroup_1.AgeGroup.ES ? 50 : 25;
            // arrives at the starting position
            reversedWaypoints.getLastWaypoint().score = 100;
            // set junction waypoint scores
            var waypointsAfterTheJunction = 2;
            var junctionScore = 25;
            this.junctionIndices().forEach(function (index) {
                waypointList.get(index + waypointsAfterTheJunction).score = junctionScore;
                reversedWaypoints.get((reversedWaypoints.getLength() - 1) - (index - waypointsAfterTheJunction)).score = junctionScore;
            });
            waypointList.append(reversedWaypoints);
            this.setWaypointList(waypointList);
            this.getContainers().groundContainer.addChild(this.getAsset().newSprite());
            this.addStaticWallInPixels(this.getWall(), { color: this.obstacleColor, strokeColor: this.obstacleColor });
            this.addWalls(true);
            chain.next();
        };
        return RRCLineFollowingScene;
    }(RRCScene_1.RRCScene));
    exports.RRCLineFollowingScene = RRCLineFollowingScene;
});
