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
define(["require", "exports", "../AgeGroup", "./RRCScene", "../RRAssetLoader", "../../Entity", "matter-js", "../../Waypoints/WaypointList"], function (require, exports, AgeGroup_1, RRCScene_1, RRC, Entity_1, matter_js_1, WaypointList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RRCLabyrinthScene = void 0;
    var LabyrinthRect = /** @class */ (function () {
        function LabyrinthRect(labyrinthRect) {
            this.x = labyrinthRect.x;
            this.y = labyrinthRect.y;
            this.w = labyrinthRect.w;
            this.h = labyrinthRect.h;
            this.rotation = labyrinthRect.rotation;
            this.color = labyrinthRect.color;
        }
        return LabyrinthRect;
    }());
    var RRCLabyrinthScene = /** @class */ (function (_super) {
        __extends(RRCLabyrinthScene, _super);
        function RRCLabyrinthScene() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.MazeObstacleList_ES = [{
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
            _this.MazeObstacleList_MS = [{
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
            _this.MazeObstacleList_HS = [{
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
            _this.waypointES_MS = [
                {
                    x: 700,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 400,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 400,
                    y: 100,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 600,
                    y: 100,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 600,
                    y: 440,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 300,
                    y: 440,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 300,
                    y: 340,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 500,
                    y: 340,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 500,
                    y: 200,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 300,
                    y: 200,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 300,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 200,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 200,
                    y: 340,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 100,
                    y: 340,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 100,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 0,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 0,
                    y: 440,
                    w: 100,
                    h: 100,
                    score: 10
                }
            ];
            _this.waypointsHS = [
                {
                    x: 700,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 500,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 500,
                    y: 100,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 600,
                    y: 100,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 600,
                    y: 440,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 300,
                    y: 440,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 300,
                    y: 340,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 500,
                    y: 340,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 500,
                    y: 200,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 400,
                    y: 200,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 400,
                    y: 100,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 300,
                    y: 100,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 300,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 200,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 200,
                    y: 340,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 100,
                    y: 340,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 100,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 0,
                    y: 0,
                    w: 100,
                    h: 100,
                    score: 10
                }, {
                    x: 0,
                    y: 440,
                    w: 100,
                    h: 100,
                    score: 10
                }
            ];
            return _this;
        }
        RRCLabyrinthScene.prototype.getWaypoints = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return this.waypointES_MS;
                case AgeGroup_1.AgeGroup.MS:
                    return this.waypointES_MS;
                case AgeGroup_1.AgeGroup.HS:
                    return this.waypointsHS;
            }
        };
        RRCLabyrinthScene.prototype.addLabyrinth = function (labyrinth) {
            var _this = this;
            var unit = this.unit;
            labyrinth.forEach(function (rect) {
                var x = unit.fromLength(rect.x);
                var y = unit.fromLength(rect.y);
                var w = unit.fromLength(rect.w);
                var h = unit.fromLength(rect.h);
                var bodyEntity = Entity_1.PhysicsRectEntity.create(_this, x, y, w, h, { color: rect.color, strokeColor: rect.color, relativeToCenter: false });
                _this.addEntity(bodyEntity);
                matter_js_1.Body.setStatic(bodyEntity.getPhysicsBody(), true);
            });
        };
        RRCLabyrinthScene.prototype.onLoadAssets = function (chain) {
            RRC.loader.load(function () {
                chain.next();
            }, this.getAsset());
        };
        RRCLabyrinthScene.prototype.getAsset = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return RRC.LABYRINTH_BLANK_BACKGROUND_ES;
                case AgeGroup_1.AgeGroup.MS:
                    return RRC.LABYRINTH_BLANK_BACKGROUND_MS;
                case AgeGroup_1.AgeGroup.HS:
                    return RRC.LABYRINTH_BLANK_BACKGROUND_HS;
            }
        };
        RRCLabyrinthScene.prototype.onInit = function (chain) {
            var _this = this;
            this.initRobot({ position: { x: 752, y: 490 }, rotation: -90 });
            var goal = RRC.loader.get(this.getAsset()).texture;
            this.goalSprite = new PIXI.Sprite(goal);
            this.getContainers().groundContainer.addChild(this.goalSprite);
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    this.addLabyrinth(this.MazeObstacleList_ES);
                    break;
                case AgeGroup_1.AgeGroup.MS:
                    this.addLabyrinth(this.MazeObstacleList_MS);
                    break;
                case AgeGroup_1.AgeGroup.HS:
                    this.addLabyrinth(this.MazeObstacleList_HS);
                    break;
            }
            // TODO: Change the waypoints
            var waypointList = new WaypointList_1.WaypointList();
            var waypoints = this.getWaypoints();
            waypoints.forEach(function (waypoint) {
                var x = waypoint.x + waypoint.w / 2;
                var y = waypoint.y + waypoint.h / 2;
                var r = Math.sqrt(Math.pow(waypoint.w, 2) + Math.pow(waypoint.h, 2)) * 0.5;
                var wp = _this.makeWaypoint({ x: x, y: y }, waypoint.score, r);
                waypointList.appendWaypoints(wp);
            });
            this.setWaypointList(waypointList);
            this.addWalls(true);
            chain.next();
        };
        return RRCLabyrinthScene;
    }(RRCScene_1.RRCScene));
    exports.RRCLabyrinthScene = RRCLabyrinthScene;
});
