define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DrawablePhysicsEntity = void 0;
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
});
