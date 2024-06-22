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
define(["require", "exports", "./RRCScene", "../AgeGroup", "../RRAssetLoader", "../../Random", "../../SharedAssetLoader", "../../Waypoints/WaypointList", "../../Utils"], function (require, exports, RRCScene_1, AgeGroup_1, RRC, Random_1, SharedAssetLoader_1, WaypointList_1, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RRCRainbowScene = void 0;
    var RRCRainbowScene = /** @class */ (function (_super) {
        __extends(RRCRainbowScene, _super);
        function RRCRainbowScene() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.version = 2;
            // colours
            _this.red = {
                r: 228,
                g: 3,
                b: 3
            };
            _this.orange = {
                r: 255,
                g: 140,
                b: 0
            };
            _this.yellow = {
                r: 255,
                g: 237,
                b: 0
            };
            _this.green = {
                r: 0,
                g: 128,
                b: 38
            };
            _this.blue = {
                r: 0,
                g: 77,
                b: 255
            };
            _this.purple = {
                r: 117,
                g: 7,
                b: 135
            };
            // colour order
            _this.colourES_MS = [
                _this.red,
                _this.yellow,
                _this.green,
                _this.blue
            ];
            _this.colourHS = [
                _this.red,
                _this.orange,
                _this.yellow,
                _this.green,
                _this.blue,
                _this.purple
            ];
            _this.bigWaypointSize = 70;
            // Waypoints for MS and ES
            // ES_MS: version 1
            _this.topWaypoints = [
                (0, RRCScene_1.wp)(400, 177, 10),
                (0, RRCScene_1.wp)(402, 71, 0),
                (0, RRCScene_1.wp)(480, 72, 0),
                (0, RRCScene_1.wp)(479, 119, 0),
                (0, RRCScene_1.wp)(520, 117, 0),
                (0, RRCScene_1.wp)(520, 181, 0),
                (0, RRCScene_1.wp)(611, 178, 0),
                (0, RRCScene_1.wp)(762, 178, 10, _this.bigWaypointSize),
            ];
            _this.rightWaypoints = [
                (0, RRCScene_1.wp)(505, 270, 10),
                (0, RRCScene_1.wp)(620, 270, 0),
                (0, RRCScene_1.wp)(730, 272, 0),
                (0, RRCScene_1.wp)(730, 345, 0),
                (0, RRCScene_1.wp)(730, 410, 0),
                (0, RRCScene_1.wp)(610, 411, 0),
                (0, RRCScene_1.wp)(492, 408, 0),
                (0, RRCScene_1.wp)(490, 503, 10, _this.bigWaypointSize),
            ];
            _this.downWaypoints = [
                (0, RRCScene_1.wp)(400, 362, 10),
                (0, RRCScene_1.wp)(400, 415, 0),
                (0, RRCScene_1.wp)(400, 470, 0),
                (0, RRCScene_1.wp)(286, 470, 0),
                (0, RRCScene_1.wp)(210, 470, 0),
                (0, RRCScene_1.wp)(120, 470, 0),
                (0, RRCScene_1.wp)(120, 423, 0),
                (0, RRCScene_1.wp)(68, 423, 0),
                (0, RRCScene_1.wp)(68, 360, 0),
                (0, RRCScene_1.wp)(180, 360, 0),
                (0, RRCScene_1.wp)(297, 360, 10, _this.bigWaypointSize),
            ];
            _this.leftWaypoints = [
                (0, RRCScene_1.wp)(280, 268, 10),
                (0, RRCScene_1.wp)(280, 182, 0),
                (0, RRCScene_1.wp)(280, 112, 0),
                (0, RRCScene_1.wp)(174, 112, 0),
                (0, RRCScene_1.wp)(72, 112, 0),
                (0, RRCScene_1.wp)(72, 185, 0),
                (0, RRCScene_1.wp)(72, 270, 0),
                (0, RRCScene_1.wp)(130, 270, 0),
                (0, RRCScene_1.wp)(188, 270, 0),
                (0, RRCScene_1.wp)(188, 183, 10, _this.bigWaypointSize),
            ];
            _this.waypointsListES_MS = [
                _this.topWaypoints,
                _this.rightWaypoints,
                _this.downWaypoints,
                _this.leftWaypoints
            ];
            // ES_MS: version 2
            _this.topWaypointsES_MS2 = [
                // wp(400, 270, 10),
                (0, RRCScene_1.wp)(400, 180, 0),
                (0, RRCScene_1.wp)(400, 130, 0),
                (0, RRCScene_1.wp)(470, 130, 0),
                (0, RRCScene_1.wp)(470, 50, 0),
                (0, RRCScene_1.wp)(540, 50, 0),
                (0, RRCScene_1.wp)(540, 130, 10, _this.bigWaypointSize)
            ];
            _this.rightWaypointsES_MS2 = [
                (0, RRCScene_1.wp)(500, 270, 10),
                (0, RRCScene_1.wp)(590, 270, 0),
                (0, RRCScene_1.wp)(590, 200, 0),
                (0, RRCScene_1.wp)(730, 200, 0),
                (0, RRCScene_1.wp)(730, 340, 0),
                (0, RRCScene_1.wp)(510, 340, 0),
                (0, RRCScene_1.wp)(510, 400, 10, _this.bigWaypointSize),
            ];
            _this.downWaypointsES_MS2 = [
                (0, RRCScene_1.wp)(400, 350, 10),
                (0, RRCScene_1.wp)(400, 390, 0),
                (0, RRCScene_1.wp)(290, 390, 0),
                (0, RRCScene_1.wp)(290, 340, 0),
                (0, RRCScene_1.wp)(90, 340, 0),
                (0, RRCScene_1.wp)(90, 400, 0),
                (0, RRCScene_1.wp)(210, 410, 0),
                (0, RRCScene_1.wp)(210, 470, 0),
                (0, RRCScene_1.wp)(380, 470, 10, _this.bigWaypointSize),
            ];
            _this.leftWaypointsES_MS2 = [
                (0, RRCScene_1.wp)(320, 270, 10),
                (0, RRCScene_1.wp)(290, 270, 0),
                (0, RRCScene_1.wp)(280, 190, 0),
                (0, RRCScene_1.wp)(210, 190, 0),
                (0, RRCScene_1.wp)(210, 260, 0),
                (0, RRCScene_1.wp)(80, 260, 0),
                (0, RRCScene_1.wp)(80, 130, 0),
                (0, RRCScene_1.wp)(300, 120, 10, _this.bigWaypointSize),
            ];
            _this.waypointsListES_MS2 = [
                _this.topWaypointsES_MS2,
                _this.rightWaypointsES_MS2,
                _this.downWaypointsES_MS2,
                _this.leftWaypointsES_MS2
            ];
            // Waypoints for HS
            _this.topLeftWaypoints = [
                (0, RRCScene_1.wp)(357, 196, 10),
                (0, RRCScene_1.wp)(207, 196, 0),
                (0, RRCScene_1.wp)(62, 196, 0),
                (0, RRCScene_1.wp)(62, 100, 0),
                (0, RRCScene_1.wp)(207, 100, 0),
                (0, RRCScene_1.wp)(279, 100, 0),
                (0, RRCScene_1.wp)(360, 60, 0),
                (0, RRCScene_1.wp)(387, 90, 0),
                (0, RRCScene_1.wp)(389, 128, 10, _this.bigWaypointSize),
            ];
            _this.topRightWaypoints = [
                (0, RRCScene_1.wp)(445, 190, 10),
                (0, RRCScene_1.wp)(460, 165, 0),
                (0, RRCScene_1.wp)(463, 138, 0),
                (0, RRCScene_1.wp)(501, 100, 0),
                (0, RRCScene_1.wp)(560, 100, 0),
                (0, RRCScene_1.wp)(543, 61, 0),
                (0, RRCScene_1.wp)(592, 61, 10, _this.bigWaypointSize),
            ];
            _this.middleRightWaypoint = [
                (0, RRCScene_1.wp)(500, 268, 10),
                (0, RRCScene_1.wp)(591, 180, 0),
                (0, RRCScene_1.wp)(740, 180, 0),
                (0, RRCScene_1.wp)(740, 270, 0),
                (0, RRCScene_1.wp)(740, 400, 0),
                (0, RRCScene_1.wp)(712, 392, 0),
                (0, RRCScene_1.wp)(604, 270, 0),
                (0, RRCScene_1.wp)(682, 270, 10, _this.bigWaypointSize),
            ];
            _this.downRightWaypoints = [
                (0, RRCScene_1.wp)(441, 344, 10),
                (0, RRCScene_1.wp)(456, 369, 0),
                (0, RRCScene_1.wp)(589, 351, 0),
                (0, RRCScene_1.wp)(611, 389, 0),
                (0, RRCScene_1.wp)(559, 420, 0),
                (0, RRCScene_1.wp)(469, 449, 0),
                (0, RRCScene_1.wp)(469, 490, 10, _this.bigWaypointSize),
            ];
            _this.downLeftWaypoints = [
                (0, RRCScene_1.wp)(357, 341, 10),
                (0, RRCScene_1.wp)(341, 369, 0),
                (0, RRCScene_1.wp)(389, 450, 0),
                (0, RRCScene_1.wp)(301, 469, 0),
                (0, RRCScene_1.wp)(142, 469, 0),
                (0, RRCScene_1.wp)(84, 410, 0),
                (0, RRCScene_1.wp)(297, 410, 10, _this.bigWaypointSize),
            ];
            _this.middleLeftWaypoints = [
                (0, RRCScene_1.wp)(317, 270, 10),
                (0, RRCScene_1.wp)(281, 270, 0),
                (0, RRCScene_1.wp)(281, 339, 0),
                (0, RRCScene_1.wp)(187, 339, 0),
                (0, RRCScene_1.wp)(83, 339, 0),
                (0, RRCScene_1.wp)(159, 251, 0),
                (0, RRCScene_1.wp)(47, 251, 10, _this.bigWaypointSize),
            ];
            // version 2
            _this.topLeftWaypointsHS2 = [
                (0, RRCScene_1.wp)(350, 190, 10),
                (0, RRCScene_1.wp)(280, 210, 0),
                (0, RRCScene_1.wp)(150, 120, 0),
                (0, RRCScene_1.wp)(270, 120, 0),
                (0, RRCScene_1.wp)(390, 150, 0),
                (0, RRCScene_1.wp)(350, 80, 10, _this.bigWaypointSize),
            ];
            _this.topRightWaypointsHS2 = [
                (0, RRCScene_1.wp)(450, 190, 10),
                (0, RRCScene_1.wp)(450, 90, 0),
                (0, RRCScene_1.wp)(520, 50, 0),
                (0, RRCScene_1.wp)(550, 110, 0),
                (0, RRCScene_1.wp)(500, 130, 0),
                (0, RRCScene_1.wp)(500, 200, 10, _this.bigWaypointSize),
            ];
            _this.rightWaypointsHS2 = [
                (0, RRCScene_1.wp)(490, 270, 10),
                (0, RRCScene_1.wp)(560, 310, 0),
                (0, RRCScene_1.wp)(730, 310, 0),
                (0, RRCScene_1.wp)(730, 200, 0),
                (0, RRCScene_1.wp)(540, 240, 0),
                (0, RRCScene_1.wp)(590, 270, 0),
                (0, RRCScene_1.wp)(680, 270, 10, _this.bigWaypointSize),
            ];
            _this.bottomRightWaypointsHS2 = [
                (0, RRCScene_1.wp)(450, 350, 10),
                (0, RRCScene_1.wp)(460, 400, 0),
                (0, RRCScene_1.wp)(590, 360, 0),
                (0, RRCScene_1.wp)(570, 410, 0),
                (0, RRCScene_1.wp)(470, 440, 0),
                (0, RRCScene_1.wp)(470, 490, 10, _this.bigWaypointSize),
            ];
            _this.bottomLeftWaypointsHS2 = [
                (0, RRCScene_1.wp)(360, 350, 10),
                (0, RRCScene_1.wp)(290, 390, 0),
                (0, RRCScene_1.wp)(140, 410, 0),
                (0, RRCScene_1.wp)(170, 450, 0),
                (0, RRCScene_1.wp)(360, 440, 0),
                (0, RRCScene_1.wp)(320, 480, 0),
                (0, RRCScene_1.wp)(180, 490, 10, _this.bigWaypointSize),
            ];
            _this.leftWaypointsHS2 = [
                (0, RRCScene_1.wp)(310, 270, 10),
                (0, RRCScene_1.wp)(210, 340, 0),
                (0, RRCScene_1.wp)(80, 300, 0),
                (0, RRCScene_1.wp)(90, 230, 0),
                (0, RRCScene_1.wp)(200, 270, 0),
                (0, RRCScene_1.wp)(210, 230, 10, _this.bigWaypointSize),
            ];
            _this.waypointsListHS2 = [
                _this.topLeftWaypointsHS2,
                _this.topRightWaypointsHS2,
                _this.rightWaypointsHS2,
                _this.bottomRightWaypointsHS2,
                _this.bottomLeftWaypointsHS2,
                _this.leftWaypointsHS2
            ];
            _this.waypointsListHS = [
                _this.topLeftWaypoints,
                _this.topRightWaypoints,
                _this.downLeftWaypoints,
                _this.downRightWaypoints,
                _this.middleLeftWaypoints,
                _this.middleRightWaypoint
            ];
            _this.obstacleColor = 0xff00ff;
            _this.obstaclesListES_MS = [{
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
                }];
            _this.obstaclesListHS = [
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
            ];
            _this.obstaclesListES_MS2 = [
                { x: 327, y: 110, w: 25, h: 40 },
                { x: 402, y: 459, w: 25, h: 40 },
                { x: 524, y: 158, w: 40, h: 25 },
                { x: 490, y: 430, w: 40, h: 25 }
            ];
            _this.obstaclesListHS2 = [
                { x: 200, y: 208, w: 20, h: 15 },
                { x: 330, y: 65, w: 20, h: 15, rot: -30 },
                { x: 485, y: 207, w: 20, h: 15 },
                { x: 680, y: 260, w: 15, h: 20 },
                { x: 463, y: 503, w: 20, h: 15 },
                { x: 150, y: 485, w: 15, h: 20 }
            ];
            _this.robotPosition1 = { x: 402, y: 270 };
            _this.robotPosition2 = { x: 402, y: 270 };
            return _this;
        }
        RRCRainbowScene.prototype.getWalls = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return this.obstaclesListES_MS2;
                case AgeGroup_1.AgeGroup.MS:
                    return this.obstaclesListES_MS2;
                case AgeGroup_1.AgeGroup.HS:
                    return this.obstaclesListHS2;
            }
        };
        /**
         * creates a the Waypoint list in the correct order
         */
        RRCRainbowScene.prototype.sortColour = function (robotPosition) {
            var _this = this;
            var finalWaypointList = new WaypointList_1.WaypointList();
            this.getColourOrder().forEach(function (colour) {
                var waypointList = new WaypointList_1.WaypointList();
                _this.getWaypoints().forEach(function (waypoints) {
                    var initialWaypoint = waypoints[0];
                    var waypointColour = _this.getColourFromPosition({ x: initialWaypoint.x, y: initialWaypoint.y });
                    if (waypointColour != undefined) {
                        var dr = colour.r - waypointColour[0];
                        var dg = colour.g - waypointColour[1];
                        var db = colour.b - waypointColour[2];
                        var squareColorDiff = dr * dr + dg * dg + db * db;
                        if (squareColorDiff < 5 * 5) {
                            waypoints.forEach(function (waypoint) {
                                var x = waypoint.x;
                                var y = waypoint.y;
                                var wp = _this.makeWaypoint({ x: x, y: y }, waypoint.score, waypoint.r);
                                waypointList.appendWaypoints(wp);
                            });
                            waypointList.appendReversedWaypoints();
                        }
                    }
                });
                finalWaypointList.append(waypointList);
            });
            finalWaypointList.appendWaypoints(this.makeWaypoint({ x: robotPosition.x, y: robotPosition.y }, 0));
            this.setWaypointList(finalWaypointList);
        };
        /**
         * @returns a one-dimensional array of the colour order for each division
         */
        RRCRainbowScene.prototype.getColourOrder = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return this.colourES_MS;
                case AgeGroup_1.AgeGroup.MS:
                    return this.colourES_MS;
                case AgeGroup_1.AgeGroup.HS:
                    return this.colourHS;
            }
        };
        /**
         * @returns a one-dimensional array of the waypoints
         */
        RRCRainbowScene.prototype.getWaypoints = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return this.waypointsListES_MS2;
                case AgeGroup_1.AgeGroup.MS:
                    return this.waypointsListES_MS2;
                case AgeGroup_1.AgeGroup.HS:
                    return this.waypointsListHS2;
            }
        };
        /**
         * @param pos of the pixel that should be read
         * @returns returns one-dimensional array of the colour (red, green, blue) at pos
         */
        RRCRainbowScene.prototype.getColourFromPosition = function (pos) {
            return this.getContainers().getGroundImageData(pos.x, pos.y, 1, 1);
        };
        RRCRainbowScene.prototype.getAsset = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    if ((0, Random_1.randomBool)()) {
                        return RRC.RAINBOW_BACKGROUND_ES;
                    }
                    else {
                        return RRC.RAINBOW_BACKGROUND_ES_DINO;
                    }
                case AgeGroup_1.AgeGroup.MS:
                    if ((0, Random_1.randomWeightedBool)(RRC.RAINBOW_BACKGROUND_MS_DINO.getNumberOfIDs(), RRC.RAINBOW_BACKGROUND_MS_SPACE_INVADERS.getNumberOfIDs())) {
                        return RRC.RAINBOW_BACKGROUND_MS_DINO.getRandomAsset();
                    }
                    else {
                        return RRC.RAINBOW_BACKGROUND_MS_SPACE_INVADERS.getRandomAsset();
                    }
                case AgeGroup_1.AgeGroup.HS:
                    return RRC.RAINBOW_BACKGROUND_HS_SPACE_INVADERS.getRandomAsset();
            }
        };
        RRCRainbowScene.prototype.onLoadAssets = function (chain) {
            this.backgroundAsset = this.getAsset();
            SharedAssetLoader_1.SharedAssetLoader.load(function () {
                chain.next();
            }, this.backgroundAsset, RRC.GOAL_BACKGROUND);
        };
        RRCRainbowScene.prototype.getMaxRuntime = function () {
            return 60 * 5;
        };
        RRCRainbowScene.prototype.getMaximumTimeBonusScore = function () {
            return 60 * 10;
        };
        RRCRainbowScene.prototype.onInit = function (chain) {
            var _this = this;
            var robotPosition = this.robotPosition2;
            this.initRobot({ position: { x: robotPosition.x, y: robotPosition.y }, rotation: -90 });
            var containers = this.getContainers();
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
            this.getWalls().forEach(function (wall) {
                _this.addStaticWallInPixels(wall, {
                    color: _this.obstacleColor,
                    strokeColor: _this.obstacleColor,
                    physics: { angle: Utils_1.Utils.flatMapOptional(wall.rot, function (r) { return r / 180 * Math.PI; }) }
                });
            });
            this.addWalls(true);
            chain.next();
        };
        return RRCRainbowScene;
    }(RRCScene_1.RRCScene));
    exports.RRCRainbowScene = RRCRainbowScene;
});
