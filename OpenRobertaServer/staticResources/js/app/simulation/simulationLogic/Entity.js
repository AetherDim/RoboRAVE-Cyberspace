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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
define(["require", "exports", "matter-js", "./Utils"], function (require, exports, matter_js_1, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DrawableEntity = exports.PhysicsRectEntity = exports.RectEntityOptions = exports.RectOptions = exports.DrawSettings = exports.DrawablePhysicsEntity = exports.Type = exports.Meta = void 0;
    var Meta = /** @class */ (function () {
        function Meta(name) {
            this.name = name;
        }
        Meta.prototype.isSupertypeOf = function (value) {
            if (this.name in value) {
                return true;
            }
            return false;
        };
        return Meta;
    }());
    exports.Meta = Meta;
    var Type = /** @class */ (function () {
        function Type() {
        }
        Type.IEntity = new Meta("IEntity");
        Type.IUpdatableEntity = new Meta("IUpdatableEntity");
        Type.IDrawableEntity = new Meta("IDrawableEntity");
        Type.IPhysicsEntity = new Meta("IPhysicsEntity");
        Type.IPhysicsCompositeEntity = new Meta("IPhysicsCompositeEntity");
        Type.IDrawablePhysicsEntity = new Meta("IDrawablePhysicsEntity");
        Type.IContainerEntity = new Meta("IContainerEntity");
        return Type;
    }());
    exports.Type = Type;
    var DrawablePhysicsEntity = /** @class */ (function () {
        function DrawablePhysicsEntity(scene, drawable) {
            this.scene = scene;
            this.drawable = drawable;
        }
        DrawablePhysicsEntity.prototype.IEntity = function () { };
        DrawablePhysicsEntity.prototype.getScene = function () {
            return this.scene;
        };
        DrawablePhysicsEntity.prototype.getParent = function () {
            return this.parent;
        };
        DrawablePhysicsEntity.prototype._setParent = function (parent) {
            this.parent = parent;
        };
        DrawablePhysicsEntity.prototype.IDrawablePhysicsEntity = function () { };
        DrawablePhysicsEntity.prototype.updateDrawablePosition = function () {
            this.drawable.position.copyFrom(this.getPhysicsBody().position);
            this.drawable.rotation = this.getPhysicsBody().angle;
        };
        DrawablePhysicsEntity.prototype.IDrawableEntity = function () { };
        DrawablePhysicsEntity.prototype.getDrawable = function () {
            return this.drawable;
        };
        DrawablePhysicsEntity.prototype.getContainer = function () {
            return undefined;
        };
        DrawablePhysicsEntity.prototype.IPhysicsEntity = function () { };
        DrawablePhysicsEntity.prototype.getPhysicsObject = function () {
            return this.getPhysicsBody();
        };
        return DrawablePhysicsEntity;
    }());
    exports.DrawablePhysicsEntity = DrawablePhysicsEntity;
    //
    //
    //
    var DrawSettings = /** @class */ (function () {
        function DrawSettings() {
            this.color = 0xFFFFFF;
            this.alpha = 1;
        }
        return DrawSettings;
    }());
    exports.DrawSettings = DrawSettings;
    var RectOptions = /** @class */ (function (_super) {
        __extends(RectOptions, _super);
        function RectOptions() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.roundingRadius = 0;
            _this.relativeToCenter = true;
            return _this;
        }
        return RectOptions;
    }(DrawSettings));
    exports.RectOptions = RectOptions;
    var RectEntityOptions = /** @class */ (function (_super) {
        __extends(RectEntityOptions, _super);
        function RectEntityOptions() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.physics = {};
            return _this;
        }
        return RectEntityOptions;
    }(RectOptions));
    exports.RectEntityOptions = RectEntityOptions;
    function setPhysicsBodyOptions(body, opts) {
        if (opts !== undefined) {
            // TODO: Convert more properties using the unit converter
            Utils_1.Utils.flatMapOptional(opts.mass, function (mass) { return matter_js_1.Body.setMass(body, mass); });
            Utils_1.Utils.flatMapOptional(opts.angle, function (angle) { return matter_js_1.Body.setAngle(body, angle); });
            Utils_1.Utils.flatMapOptional(opts.frictionAir, function (friction) { return body.frictionAir = friction; });
            Utils_1.Utils.flatMapOptional(opts.isStatic, function (isStatic) { return matter_js_1.Body.setStatic(body, isStatic); });
        }
    }
    var PhysicsRectEntity = /** @class */ (function (_super) {
        __extends(PhysicsRectEntity, _super);
        function PhysicsRectEntity(scene, x, y, width, height, drawable, opts) {
            var _this = _super.call(this, scene, drawable) || this;
            if (!opts.relativeToCenter) {
                x += width / 2;
                y += height / 2;
            }
            _this.body = matter_js_1.Bodies.rectangle(x, y, width, height);
            setPhysicsBodyOptions(_this.body, opts.physics);
            return _this;
        }
        PhysicsRectEntity.prototype.getPhysicsBody = function () {
            return this.body;
        };
        /**
         * Create the graphics with center (0,0)
         */
        PhysicsRectEntity.createGraphics = function (width, height, options) {
            var graphics = new PIXI.Graphics();
            graphics.lineStyle(options.strokeWidth, options.strokeColor, options.strokeAlpha, options.strokeAlignment);
            graphics.beginFill(options.color, options.alpha);
            graphics.drawRoundedRect(-width / 2, -height / 2, width, height, options.roundingRadius);
            graphics.endFill();
            return graphics;
        };
        PhysicsRectEntity.create = function (scene, x, y, width, height, opts) {
            var _a;
            _a = __read(scene.unit.getLengths([x, y, width, height]), 4), x = _a[0], y = _a[1], width = _a[2], height = _a[3];
            var options = Utils_1.Utils.getOptions(RectEntityOptions, opts);
            var graphics = PhysicsRectEntity.createGraphics(width, height, options);
            return new PhysicsRectEntity(scene, x, y, width, height, graphics, options);
        };
        PhysicsRectEntity.createWithContainer = function (scene, x, y, width, height, opts) {
            var _a;
            _a = __read(scene.unit.getLengths([x, y, width, height]), 4), x = _a[0], y = _a[1], width = _a[2], height = _a[3];
            var options = Utils_1.Utils.getOptions(RectEntityOptions, opts);
            var graphics = PhysicsRectEntity.createGraphics(width, height, options);
            var container = new PIXI.Container();
            container.addChild(graphics);
            return new PhysicsRectEntity(scene, x, y, width, height, graphics, options);
        };
        PhysicsRectEntity.createTexture = function (scene, x, y, texture, alpha, relativeToCenter, bodyOptions) {
            if (relativeToCenter === void 0) { relativeToCenter = false; }
            return new PhysicsRectEntity(scene, x, y, texture.width, texture.height, new PIXI.DisplayObject(), Utils_1.Utils.getOptions(RectEntityOptions, { physics: bodyOptions }));
            // TODO
        };
        return PhysicsRectEntity;
    }(DrawablePhysicsEntity));
    exports.PhysicsRectEntity = PhysicsRectEntity;
    var DrawableEntity = /** @class */ (function () {
        function DrawableEntity(scene, drawable, sceneContainer) {
            this.scene = scene;
            this.drawable = drawable;
            this.container = sceneContainer;
        }
        DrawableEntity.prototype.setContainer = function (container) {
            this.container = container;
            return this;
        };
        DrawableEntity.prototype.IEntity = function () { };
        DrawableEntity.prototype.getScene = function () {
            return this.scene;
        };
        DrawableEntity.prototype.getParent = function () {
            return this.parent;
        };
        DrawableEntity.prototype._setParent = function (parent) {
            this.parent = parent;
        };
        DrawableEntity.prototype.IDrawableEntity = function () { };
        DrawableEntity.prototype.getContainer = function () {
            return this.container;
        };
        DrawableEntity.prototype.getDrawable = function () {
            return this.drawable;
        };
        DrawableEntity.rect = function (scene, x, y, width, height, opts) {
            var options = Utils_1.Utils.getOptions(RectOptions, opts);
            var graphicsX = 0;
            var graphicsY = 0;
            if (options.relativeToCenter) {
                graphicsX -= width / 2;
                graphicsY -= height / 2;
            }
            var graphics = new PIXI.Graphics()
                .lineStyle(options.strokeWidth, options.strokeColor, options.strokeAlpha, options.strokeAlignment)
                .beginFill(options.color, options.alpha)
                .drawRoundedRect(graphicsX, graphicsY, width, height, options.roundingRadius)
                .endFill();
            graphics.position.set(x, y);
            return new DrawableEntity(scene, graphics);
        };
        return DrawableEntity;
    }());
    exports.DrawableEntity = DrawableEntity;
});
