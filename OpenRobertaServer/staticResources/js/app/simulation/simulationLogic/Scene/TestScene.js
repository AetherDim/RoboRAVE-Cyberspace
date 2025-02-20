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
define(["require", "exports", "matter-js", "../Geometry/LineSegment", "../Geometry/Polygon", "../Robot/ElectricMotor", "../Robot/Robot", "../ScrollView", "../Unit", "./Scene", "../Utils", "../Entities/PhysicsRectEntity"], function (require, exports, matter_js_1, LineSegment_1, Polygon_1, ElectricMotor_1, Robot_1, ScrollView_1, Unit_1, Scene_1, Utils_1, PhysicsRectEntity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestScene = void 0;
    var TestScene = /** @class */ (function (_super) {
        __extends(TestScene, _super);
        function TestScene() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.interactionEventHandlers = [];
            return _this;
        }
        /**
         * called to load resources
         *
         * @override from Scene
         */
        TestScene.prototype.onLoadAssets = function (chain) {
            setTimeout(function () {
                //this.setScore(266);
                //this.showScoreScreen(10);
                chain.next();
            }, 0);
        };
        TestScene.prototype.onInteractionEvent = function (ev) {
            this.interactionEventHandlers.forEach(function (handler) {
                handler(ev);
            });
        };
        TestScene.prototype.getUnitConverter = function () {
            return new Unit_1.Unit({ m: 1000 });
        };
        /**
         * called after resource loading on Init
         *
         * @override from Scene
         */
        TestScene.prototype.onInit = function (chain) {
            // create dynamic debug gui
            this.initDynamicDebugGui();
            // use 0.001 for EV3
            var scale = 0.001;
            var unit = this.unit;
            // (<any>Resolver)._restingThresh = 4 * scale;
            // (<any>Resolver)._restingThreshTangent = 6 * scale;
            // (<any>Sleeping)._motionWakeThreshold = 0.18 * scale;
            // (<any>Sleeping)._motionSleepThreshold = 0.08 * scale;
            // (<any>Constraint)._minLength = 0.000001 * scale;
            //this.sceneRenderer.setRenderingScaleAndOffset(1 / scale, Vector.create())
            // add some background elements
            this.getContainers().groundContainer.addChild(new PIXI.Graphics().beginFill(0xFF0000).drawRect(100, 200, 30, 60).endFill());
            var useEV3 = true;
            var robot = useEV3 ? Robot_1.Robot.EV3(this) : Robot_1.Robot.default(this, scale);
            this.addRobot(robot);
            var robot2 = useEV3 ? Robot_1.Robot.EV3(this) : Robot_1.Robot.default(this, scale);
            this.addRobot(robot2); // second robot
            var robotComposite = robot.physicsComposite;
            //World.add(this.engine.world, robotComposite);
            matter_js_1.Composite.translate(robotComposite, unit.getPositionVec(100 * scale, 100 * scale));
            var polygon = new Polygon_1.Polygon([
                matter_js_1.Vector.create(0, 0),
                matter_js_1.Vector.create(100, 0),
                matter_js_1.Vector.create(100, 50),
                matter_js_1.Vector.create(0, 100),
                matter_js_1.Vector.create(50, 50)
            ].map(function (v) { return unit.getPosition(matter_js_1.Vector.mult(Utils_1.Utils.vectorAdd(v, matter_js_1.Vector.create(200, 200)), scale)); }));
            var polygonGraphics = new PIXI.Graphics();
            polygonGraphics.beginFill(0xFF0000);
            polygonGraphics.moveTo(polygon.vertices[0].x, polygon.vertices[0].y);
            polygon.vertices.forEach(function (v) { return polygonGraphics.lineTo(v.x, v.y); });
            polygonGraphics.closePath();
            polygonGraphics.endFill();
            function makePoint(color) {
                return setToPoint(new PIXI.Graphics(), color);
            }
            function setToPoint(graphics, color) {
                return graphics
                    .clear()
                    .beginFill(color)
                    .drawRect(-5, -5, 10, 10)
                    .endFill();
            }
            var mousePointGraphics = makePoint(0x00FF00);
            var nearestPointGraphics = makePoint(0x0000FF);
            var lineSegmentGraphics = new PIXI.Graphics()
                .lineStyle(2)
                .moveTo(0, 0)
                .lineTo(20, 100);
            var intersectionPointGraphics = [];
            var container = new PIXI.Container();
            container.addChild(polygonGraphics, nearestPointGraphics, mousePointGraphics, lineSegmentGraphics);
            this.getContainers().topContainer.addChild(container);
            this.interactionEventHandlers.push(function (event) {
                var mousePosData = event.data.getCurrentLocalPosition();
                var mousePos = matter_js_1.Vector.create(mousePosData.x, mousePosData.y);
                mousePointGraphics.position.set(mousePos.x, mousePos.y);
                var pos = polygon.nearestPointTo(mousePos);
                if (pos) {
                    nearestPointGraphics.position.set(pos.x, pos.y);
                }
                if (polygon.containsPoint(mousePos)) {
                    setToPoint(mousePointGraphics, 0x0044FF);
                }
                else {
                    setToPoint(mousePointGraphics, 0x00FF00);
                }
                if (event.type == ScrollView_1.EventType.DRAG) {
                    var ls = new LineSegment_1.LineSegment(mousePos, Utils_1.Utils.vectorAdd(mousePos, matter_js_1.Vector.create(20, 100)));
                    lineSegmentGraphics.position.set(mousePos.x, mousePos.y);
                    var intersectionPoints = polygon.intersectionPointsWithLine(ls);
                    intersectionPointGraphics.forEach(function (g) {
                        container.removeChild(g);
                        g.destroy();
                    });
                    intersectionPointGraphics = intersectionPoints.map(function (p) {
                        var graphics = makePoint(0x00FF00);
                        graphics.position.set(p.x, p.y);
                        container.addChild(graphics);
                        return graphics;
                    });
                }
            });
            this.engine.world.gravity.y = 0.0;
            var body = robot.body;
            body.enableMouseInteraction = true;
            robot2.body.enableMouseInteraction = true;
            var keyDownList = [];
            document.onkeydown = function (event) {
                if (!keyDownList.includes(event.key)) {
                    keyDownList.push(event.key);
                }
            };
            document.onkeyup = function (event) {
                keyDownList = keyDownList.filter(function (key) { return key != event.key; });
            };
            function updateKeysActions() {
                // $('#notConstantValue').html('');
                // $("#notConstantValue").append('<div><label>Test</label><span>' + keyDownList + '</span></div>');    
                var leftForce = 0;
                var rightForce = 0;
                var factor = keyDownList.includes("s") ? -1 : 1;
                keyDownList.forEach(function (key) {
                    switch (key) {
                        case 'w':
                            leftForce += 1;
                            rightForce += 1;
                            break;
                        case 's':
                            leftForce += -1;
                            rightForce += -1;
                            break;
                        case 'a':
                            leftForce += -1 * factor;
                            rightForce += 1 * factor;
                            break;
                        case 'd':
                            leftForce += 1 * factor;
                            rightForce += -1 * factor;
                            break;
                    }
                });
                var vec = matter_js_1.Vector.create(Math.cos(body.angle), Math.sin(body.angle));
                var force = matter_js_1.Vector.mult(vec, 0.0001 * 1000 * 1000 * 1000 * 1000);
                var normalVec = matter_js_1.Vector.mult(matter_js_1.Vector.create(-vec.y, vec.x), 10);
                var forcePos = Utils_1.Utils.vectorAdd(body.position, matter_js_1.Vector.mult(vec, -40));
                var maxTorque = unit.getTorque(100 * 1000 * 1000 * Math.pow(scale, 3.5));
                var motor = useEV3 ? ElectricMotor_1.ElectricMotor.EV3(unit) : new ElectricMotor_1.ElectricMotor(unit, 120, maxTorque);
                robot.leftDrivingWheel.applyTorqueFromMotor(motor, leftForce);
                robot.rightDrivingWheel.applyTorqueFromMotor(motor, rightForce);
            }
            matter_js_1.Events.on(this.engine, 'beforeUpdate', function () {
                updateKeysActions();
            });
            var t = this;
            function makeRect(x, y, w, h, opt) {
                return PhysicsRectEntity_1.PhysicsRectEntity.create(t, scale * x, scale * y, scale * w, scale * h, { physics: opt });
            }
            var bodies = [
                // blocks
                makeRect(200, 100, 60, 60, { frictionAir: 0.001 }),
                makeRect(400, 100, 60, 60, { frictionAir: 0.05 }),
                makeRect(600, 100, 60, 60, { frictionAir: 0.1 }),
                // walls
                makeRect(400, -25, 800, 50, { isStatic: true }),
                makeRect(400, 600, 800, 50, { isStatic: true }),
                makeRect(800, 300, 50, 600, { isStatic: true }),
                makeRect(-25, 300, 50, 600, { isStatic: true })
            ];
            bodies.forEach(function (b) { return t.addEntity(b); });
            // const allBodies = Composite.allBodies(world)
            // allBodies.forEach(body => body.slop *= scale)
            chain.next();
        };
        return TestScene;
    }(Scene_1.Scene));
    exports.TestScene = TestScene;
});
