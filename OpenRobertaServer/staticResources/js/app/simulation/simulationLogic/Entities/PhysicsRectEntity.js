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
define(["require", "exports", "matter-js", "../Robot/BodyHelper", "../Utils", "./DrawablePhysicsEntity", "./Entity"], function (require, exports, matter_js_1, BodyHelper_1, Utils_1, DrawablePhysicsEntity_1, Entity_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PhysicsRectEntity = void 0;
    var PhysicsRectEntity = /** @class */ (function (_super) {
        __extends(PhysicsRectEntity, _super);
        function PhysicsRectEntity(scene, x, y, width, height, drawable, opts) {
            var _this = _super.call(this, scene, drawable) || this;
            if (!opts.relativeToCenter) {
                x += width / 2;
                y += height / 2;
            }
            _this.body = matter_js_1.Bodies.rectangle(x, y, width, height);
            BodyHelper_1.BodyHelper.setPhysicsBodyOptions(_this.body, opts.physics);
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
            var options = Utils_1.Utils.getOptions(Entity_1.RectEntityOptions, opts);
            var graphics = PhysicsRectEntity.createGraphics(width, height, options);
            return new PhysicsRectEntity(scene, x, y, width, height, graphics, options);
        };
        PhysicsRectEntity.createWithContainer = function (scene, x, y, width, height, opts) {
            var _a;
            _a = __read(scene.unit.getLengths([x, y, width, height]), 4), x = _a[0], y = _a[1], width = _a[2], height = _a[3];
            var options = Utils_1.Utils.getOptions(Entity_1.RectEntityOptions, opts);
            var graphics = PhysicsRectEntity.createGraphics(width, height, options);
            var container = new PIXI.Container();
            container.addChild(graphics);
            return new PhysicsRectEntity(scene, x, y, width, height, graphics, options);
        };
        PhysicsRectEntity.createTexture = function (scene, x, y, texture, alpha, relativeToCenter, bodyOptions) {
            if (relativeToCenter === void 0) { relativeToCenter = false; }
            return new PhysicsRectEntity(scene, x, y, texture.width, texture.height, new PIXI.DisplayObject(), Utils_1.Utils.getOptions(Entity_1.RectEntityOptions, { physics: bodyOptions }));
            // TODO
        };
        return PhysicsRectEntity;
    }(DrawablePhysicsEntity_1.DrawablePhysicsEntity));
    exports.PhysicsRectEntity = PhysicsRectEntity;
});
