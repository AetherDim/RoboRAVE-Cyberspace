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
define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RectEntityOptions = exports.RectOptions = exports.DrawSettings = exports.Type = exports.Meta = void 0;
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
});
