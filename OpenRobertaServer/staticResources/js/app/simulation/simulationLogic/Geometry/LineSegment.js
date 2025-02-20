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
define(["require", "exports", "../Utils", "./LineBaseClass"], function (require, exports, Utils_1, LineBaseClass_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LineSegment = void 0;
    var LineSegment = /** @class */ (function (_super) {
        __extends(LineSegment, _super);
        function LineSegment(point1, point2) {
            var _this = _super.call(this, point1, Utils_1.Utils.vectorSub(point2, point1)) || this;
            _this.point1 = point1;
            _this.point2 = point2;
            return _this;
        }
        LineSegment.prototype.checkIntersectionParameter = function (parameter) {
            return 0 <= parameter && parameter <= 1;
        };
        LineSegment.prototype.nearestPointTo = function (point) {
            var parameter = this.uncheckedNearestParameterTo(point);
            if (parameter <= 0) {
                return this.point1;
            }
            if (parameter >= 1) {
                return this.point2;
            }
            return this.getPoint(parameter);
        };
        LineSegment.prototype.getEndPoints = function () {
            return [this.point1, this.point2];
        };
        return LineSegment;
    }(LineBaseClass_1.LineBaseClass));
    exports.LineSegment = LineSegment;
});
