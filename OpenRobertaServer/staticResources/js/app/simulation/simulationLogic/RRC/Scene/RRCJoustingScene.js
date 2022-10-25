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
define(["require", "exports", "./RRCScene", "../RRAssetLoader", "../AgeGroup", "../../Waypoints/WaypointList", "matter-js", "../../Entities/DrawableEntity", "../../Entities/PhysicsRectEntity", "../../Robot/RobotProgramGenerator", "../../Utils"], function (require, exports, RRCScene_1, RRC, AgeGroup_1, WaypointList_1, matter_js_1, DrawableEntity_1, PhysicsRectEntity_1, RobotProgramGenerator_1, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RRCLineJoustingScene = void 0;
    var RRCLineJoustingScene = /** @class */ (function (_super) {
        __extends(RRCLineJoustingScene, _super);
        function RRCLineJoustingScene() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.bigWaypointSize = 70;
            // Waypoints
            _this.waypointsES = [
            // wp( 62, 470, 0),
            // wp( 62, 360, 0),
            ];
            _this.waypointsMS = [
                (0, RRCScene_1.wp)(62, 470, 0),
                (0, RRCScene_1.wp)(62, 360, 0),
            ];
            _this.waypointsHS = [
                (0, RRCScene_1.wp)(62, 470, 0),
                (0, RRCScene_1.wp)(62, 360, 0),
            ];
            _this.obstacleColor = 0xf68712;
            // Walls
            _this.wallES = {
                x: 720,
                y: 50,
                w: 70,
                h: 25
            };
            _this.wallMS = {
                x: 720,
                y: 50,
                w: 70,
                h: 25
            };
            _this.wallHS = {
                x: 720,
                y: 50,
                w: 70,
                h: 25
            };
            _this.robot2yOffset = 70;
            _this.constraintStrength = 0.003;
            _this.maxLancePositionDeviation = 0.5;
            _this.lanceSettings = {
                position: { x: 0.2, y: 0.05 },
                size: { length: 0.4, width: 0.02 },
                mass: 0.1,
                angle: Math.PI / 2 / 3
            };
            _this.robotToLanceEntity = new Map();
            _this.constraintLine = new DrawableEntity_1.DrawableEntity(_this, new PIXI.Graphics(), _this.containerManager.entityTopContainer);
            return _this;
        }
        RRCLineJoustingScene.prototype.getWaypoints = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return this.waypointsES;
                case AgeGroup_1.AgeGroup.MS:
                    return this.waypointsMS;
                case AgeGroup_1.AgeGroup.HS:
                    return this.waypointsHS;
            }
        };
        RRCLineJoustingScene.prototype.getWall = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return this.wallES;
                case AgeGroup_1.AgeGroup.MS:
                    return this.wallMS;
                case AgeGroup_1.AgeGroup.HS:
                    return this.wallHS;
            }
        };
        RRCLineJoustingScene.prototype.getAsset = function () {
            switch (this.ageGroup) {
                case AgeGroup_1.AgeGroup.ES:
                    return RRC.LINE_FOLLOWING_BACKGROUND_ES;
                case AgeGroup_1.AgeGroup.MS:
                    return RRC.LINE_FOLLOWING_BACKGROUND_MS;
                case AgeGroup_1.AgeGroup.HS:
                    return RRC.LINE_FOLLOWING_BACKGROUND_HS;
            }
        };
        RRCLineJoustingScene.prototype.onLoadAssets = function (chain) {
            this.loader.load(function () {
                chain.next();
            }, this.getAsset(), RRC.GOAL_BACKGROUND);
        };
        RRCLineJoustingScene.prototype.onDeInit = function (chain) {
            //this.getDebugGuiStatic()?.remove(this.debugState!)
            chain.next();
        };
        RRCLineJoustingScene.prototype.onInit = function (chain) {
            var _this = this;
            var _a, _b;
            //const allBitmask = ~0
            //const defaultCategory = 1 << 0
            var lanceCategory = 1 << 1;
            var robot1Category = 1 << 2;
            var robot2Category = 1 << 3;
            var scene = this;
            this.addEntity(this.constraintLine);
            if (this.debugState == undefined) {
                this.debugState = (_a = this.getDebugGuiStatic()) === null || _a === void 0 ? void 0 : _a.add(this, "constraintStrength");
                (_b = this.getDebugGuiStatic()) === null || _b === void 0 ? void 0 : _b.add(this, "maxLancePositionDeviation");
            }
            function addJoustingLance(robot, robotCategory) {
                var joustingLance = PhysicsRectEntity_1.PhysicsRectEntity.create(robot.getScene(), scene.lanceSettings.position.x, scene.lanceSettings.position.y, scene.lanceSettings.size.length, scene.lanceSettings.size.width, { physics: { mass: scene.lanceSettings.mass, angle: scene.lanceSettings.angle }, color: 0x00FF00 });
                scene.robotToLanceEntity.set(robot, joustingLance);
                joustingLance;
                robot.setDefaultCollisionCategory(robotCategory);
                // constraint at the start of the lance
                robot.addRelativePhysicsBodyEntity(joustingLance, { defaultConstraints: {
                        constraintStrength: scene.constraintStrength,
                        relativePhysicsBodyOffset: { x: -scene.unit.getLength(scene.lanceSettings.size.length) / 2, y: 0 }
                    } });
                var lanceCollisionFilter = joustingLance.getPhysicsBody().collisionFilter;
                lanceCollisionFilter.category = lanceCategory;
                lanceCollisionFilter.mask = ~robotCategory; //~robot1Category & ~robot2Category
                robot.programManager.setPrograms([RobotProgramGenerator_1.RobotProgramGenerator.generateProgram([
                        RobotProgramGenerator_1.RobotProgramGenerator.rotateOpCodes(100, Math.random() * 20 - 10, true),
                        RobotProgramGenerator_1.RobotProgramGenerator.driveForwardOpCodes(100, 10)
                    ])], robot.getScene().unit);
            }
            this.initRobot({ position: { x: 100, y: 100 }, rotation: 0, modifyRobot: function (robot) { return addJoustingLance(robot, robot1Category); } });
            this.initRobot({ position: { x: 400, y: 100 + this.robot2yOffset }, rotation: 180, modifyRobot: function (robot) { return addJoustingLance(robot, robot2Category); } });
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
            // === set waypoints ===
            this.setWaypointList(waypointList);
            // === set graphics ===
            var backgroundAsset = this.loader.get(this.getAsset()).texture;
            //this.getContainers().groundContainer.addChild(new PIXI.Sprite(backgroundAsset));
            [
                // white background
                DrawableEntity_1.DrawableEntity.rect(this, 0, 0, backgroundAsset.width, backgroundAsset.height, { color: 0xffffff, relativeToCenter: false }),
                // robot1 line
                DrawableEntity_1.DrawableEntity.rect(this, 400, 100, 600, 10, { color: 0x000000, relativeToCenter: true }),
                // robot2 line
                DrawableEntity_1.DrawableEntity.rect(this, 400, 100 + this.robot2yOffset, 600, 10, { color: 0x000000, relativeToCenter: true })
            ].forEach(function (entity) {
                entity.setContainer(_this.containerManager.groundContainer);
                _this.addEntity(entity);
            });
            this.addStaticWallInPixels(this.getWall(), { color: this.obstacleColor, strokeColor: this.obstacleColor });
            this.addWalls(true);
            chain.next();
        };
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
        RRCLineJoustingScene.prototype.onUpdatePostPhysics = function () {
            var _this = this;
            var graphics = this.constraintLine.getDrawable();
            graphics
                .clear()
                .lineStyle(2);
            this.robotManager.getRobots().forEach(function (robot) {
                // calculate distance of 
                var body = robot.body;
                var originalLancePosition = matter_js_1.Vector.add(matter_js_1.Vector.rotate({
                    x: _this.unit.getLength(_this.lanceSettings.position.x),
                    y: _this.unit.getLength(_this.lanceSettings.position.y)
                }, body.angle), body.position);
                var lanceBody = _this.robotToLanceEntity.get(robot).getPhysicsBody();
                var distance = matter_js_1.Vector.magnitude(matter_js_1.Vector.sub(originalLancePosition, lanceBody.position));
                matter_js_1.Composite.allConstraints(robot.physicsComposite).forEach(function (constraint) {
                    if (constraint.bodyA === lanceBody || constraint.bodyB === lanceBody) {
                        var start = Utils_1.Utils.vectorAdd(constraint.bodyA.position, constraint.pointA);
                        var end = Utils_1.Utils.vectorAdd(constraint.bodyB.position, constraint.pointB);
                        graphics.moveTo(start.x, start.y);
                        graphics.lineTo(end.x, end.y);
                    }
                });
                if (distance > _this.unit.getLength(_this.maxLancePositionDeviation)) {
                    // remove all constraints from lance which were added to robot.physicsComposite
                    matter_js_1.Composite.allConstraints(robot.physicsComposite).forEach(function (constraint) {
                        if (constraint.bodyA === lanceBody || constraint.bodyB === lanceBody) {
                            matter_js_1.Composite.remove(robot.physicsComposite, constraint, true);
                        }
                    });
                    // lance body can now collide every body including the own robot
                    //lanceBody.collisionFilter.mask = ~0
                }
            });
        };
        return RRCLineJoustingScene;
    }(RRCScene_1.RRCScene));
    exports.RRCLineJoustingScene = RRCLineJoustingScene;
});
