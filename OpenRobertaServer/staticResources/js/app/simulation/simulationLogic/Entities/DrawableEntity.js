define(["require", "exports", "../Utils", "./Entity"], function (require, exports, Utils_1, Entity_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DrawableEntity = void 0;
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
            var options = Utils_1.Utils.getOptions(Entity_1.RectOptions, opts);
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
