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
define(["require", "exports", "../AgeGroup", "./RRCScene", "../RRAssetLoader", "matter-js", "../../Waypoints/WaypointList", "../../Entities/PhysicsRectEntity", "../../SharedAssetLoader", "../RRAssetLoader"], function (require, exports, AgeGroup_1, RRCScene_1, RRC, matter_js_1, WaypointList_1, PhysicsRectEntity_1, SharedAssetLoader_1, RRAssetLoader_1) {
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
            _this.MazeObstacleList_ES = [
                {
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
                }
            ];
            _this.MazeObstacleList_ES_Waypoints = [
                (0, RRCScene_1.wp)(752, 490, 0, 60),
                (0, RRCScene_1.wp)(745.471943488454, 56.41573850292542, 10, 60),
                (0, RRCScene_1.wp)(54.561521089673086, 54.578616428501704, 10, 60),
                (0, RRCScene_1.wp)(56.94166548626347, 153.83907315081825, 10, 60),
                (0, RRCScene_1.wp)(640.4716541853163, 166.74198579286042, 10, 60),
                (0, RRCScene_1.wp)(638.799848429799, 484.23361687525244, 10, 60),
                (0, RRCScene_1.wp)(58.4250132228549, 481.076981352756, 10, 60),
                (0, RRCScene_1.wp)(52.994165084968614, 262.5520455208635, 10, 60),
                (0, RRCScene_1.wp)(151.69025603928773, 265.9632197783464, 10, 60),
                (0, RRCScene_1.wp)(159.02149354104046, 380.94333503837163, 10, 60),
                (0, RRCScene_1.wp)(543.2560713393749, 380.46722869212874, 10, 60),
                (0, RRCScene_1.wp)(540.7526760956091, 267.49897928869785, 10, 60),
                (0, RRCScene_1.wp)(263.35418049687445, 262.51973210027825, 10, 60),
            ];
            _this.MazeObstacleList_MS = [
                {
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
                }
            ];
            _this.MazeObstacleList_MS_Waypoints = [
                (0, RRCScene_1.wp)(752, 490, 0, 60),
                (0, RRCScene_1.wp)(749.9644930779159, 53.57101801235041, 10, 60),
                (0, RRCScene_1.wp)(163.44368626752964, 57.55270502937634, 10, 60),
                (0, RRCScene_1.wp)(158.1736200600906, 159.90933810929084, 10, 60),
                (0, RRCScene_1.wp)(640.592197258446, 154.9823512142699, 10, 60),
                (0, RRCScene_1.wp)(639.6051457735002, 485.8895109324285, 10, 60),
                (0, RRCScene_1.wp)(154.14101385658392, 483.90361435263895, 10, 60),
                (0, RRCScene_1.wp)(157.3926998275401, 267.87910873898966, 10, 60),
                (0, RRCScene_1.wp)(542.5111920355592, 259.5994071096399, 10, 60),
                (0, RRCScene_1.wp)(545.788756034993, 390.5184603269341, 10, 60),
                (0, RRCScene_1.wp)(267.8770860374464, 382.6234479916538, 10, 60),
            ];
            _this.MazeObstacleList_HS = [
                {
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
                }
            ];
            _this.MazeObstacleList_HS_Waypoints = [
                (0, RRCScene_1.wp)(752, 490, 0, 60),
                (0, RRCScene_1.wp)(749.9644930779159, 53.57101801235041, 10, 60),
                (0, RRCScene_1.wp)(163.44368626752964, 57.55270502937634, 10, 60),
                (0, RRCScene_1.wp)(158.1736200600906, 159.90933810929084, 10, 60),
                (0, RRCScene_1.wp)(640.592197258446, 154.9823512142699, 10, 60),
                (0, RRCScene_1.wp)(639.6051457735002, 485.8895109324285, 10, 60),
                (0, RRCScene_1.wp)(154.14101385658392, 483.90361435263895, 10, 60),
                (0, RRCScene_1.wp)(164.5985688406025, 383.93544037904775, 10, 60),
                (0, RRCScene_1.wp)(439.03031989566057, 378.9844209582838, 10, 60),
                (0, RRCScene_1.wp)(444.674086629173, 269.35754843765153, 10, 60),
                (0, RRCScene_1.wp)(271.36844579796883, 264.52622828918646, 10, 60),
            ];
            return _this;
        }
        RRCLabyrinthScene.prototype.setZeroColor = function (color) {
            return function (v) {
                v.color = v.color == 0 ? color : v.color;
                return v;
            };
        };
        RRCLabyrinthScene.prototype.modify = function (f) {
            return function (v) {
                f(v);
                return v;
            };
        };
        RRCLabyrinthScene.prototype.getWaypoints = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return this.MazeObstacleList_ES_Waypoints;
                case AgeGroup_1.AgeGroup.MS:
                    return this.MazeObstacleList_MS_Waypoints;
                case AgeGroup_1.AgeGroup.HS:
                    return this.MazeObstacleList_HS_Waypoints;
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
                var bodyEntity = PhysicsRectEntity_1.PhysicsRectEntity.create(_this, x, y, w, h, { color: rect.color, strokeColor: rect.color, relativeToCenter: false });
                _this.addEntity(bodyEntity);
                matter_js_1.Body.setStatic(bodyEntity.getPhysicsBody(), true);
            });
        };
        RRCLabyrinthScene.prototype.onLoadAssets = function (chain) {
            SharedAssetLoader_1.SharedAssetLoader.load(function () {
                chain.next();
            }, this.getAsset(), RRC.GOAL_BACKGROUND, RRAssetLoader_1.CHESS_PATTERN_LABYRINTH);
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
        RRCLabyrinthScene.prototype.getMaxRuntime = function () {
            return 60 * 3;
        };
        RRCLabyrinthScene.prototype.getMaximumTimeBonusScore = function () {
            return 60 * 6;
        };
        RRCLabyrinthScene.prototype.onInit = function (chain) {
            var _this = this;
            this.initRobot({ position: { x: 752, y: 490 }, rotation: -90 });
            var backgroundAsset = SharedAssetLoader_1.SharedAssetLoader.get(this.getAsset()).texture;
            this.getContainers().groundContainer.addChild(new PIXI.Sprite(backgroundAsset));
            var checkerboard = new PIXI.Sprite(SharedAssetLoader_1.SharedAssetLoader.get(RRAssetLoader_1.CHESS_PATTERN_LABYRINTH).texture);
            this.getContainers().groundContainer.addChild(checkerboard);
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    this.addLabyrinth(this.MazeObstacleList_ES);
                    checkerboard.setTransform(210, 210, 1 / 11.82, 1 / 11.82);
                    break;
                case AgeGroup_1.AgeGroup.MS:
                    this.addLabyrinth(this.MazeObstacleList_MS);
                    checkerboard.setTransform(210, 335, 1 / 11.82, 1 / 11.82);
                    break;
                case AgeGroup_1.AgeGroup.HS:
                    this.addLabyrinth(this.MazeObstacleList_HS);
                    checkerboard.setTransform(210, 210, 1 / 11.82, 1 / 11.82);
                    break;
            }
            var waypointList = new WaypointList_1.WaypointList();
            var waypoints = this.getWaypoints();
            waypoints.forEach(function (waypoint) {
                var x = waypoint.x;
                var y = waypoint.y;
                var wp = _this.makeWaypoint({ x: x, y: y }, waypoint.score, waypoint.r);
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
