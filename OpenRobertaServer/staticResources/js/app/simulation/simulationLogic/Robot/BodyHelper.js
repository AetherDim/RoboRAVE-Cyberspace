define(["require", "exports", "matter-js", "../Geometry/Polygon", "../Utils"], function (require, exports, matter_js_1, Polygon_1, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BodyHelper = void 0;
    var BodyHelper = /** @class */ (function () {
        function BodyHelper() {
        }
        BodyHelper.forEachBodyPartVertices = function (bodies, code) {
            for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                // TODO: Use body.bounds for faster execution
                for (var j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
                    var part = body.parts[j];
                    code(part.vertices);
                }
            }
        };
        BodyHelper.getNearestPointTo = function (point, bodies, includePoint) {
            var nearestPoint;
            var minDistanceSquared = Infinity;
            BodyHelper.forEachBodyPartVertices(bodies, function (vertices) {
                var nearestBodyPoint = new Polygon_1.Polygon(vertices).nearestPointToPoint(point, includePoint);
                if (nearestBodyPoint) {
                    var distanceSquared = Utils_1.Utils.vectorDistanceSquared(point, nearestBodyPoint);
                    if (distanceSquared < minDistanceSquared) {
                        minDistanceSquared = distanceSquared;
                        nearestPoint = nearestBodyPoint;
                    }
                }
            });
            return nearestPoint;
        };
        BodyHelper.intersectionPointsWithLine = function (line, bodies) {
            var result = [];
            this.forEachBodyPartVertices(bodies, function (vertices) {
                var newIntersectionPoints = new Polygon_1.Polygon(vertices).intersectionPointsWithLine(line);
                for (var i = 0; i < newIntersectionPoints.length; i++) {
                    result.push(newIntersectionPoints[i]);
                }
            });
            return result;
        };
        BodyHelper.bodyIntersectsOther = function (body, bodies) {
            // `body` collides with itself
            return matter_js_1.Query.collides(body, bodies).length > (bodies.includes(body) ? 1 : 0);
        };
        BodyHelper.someBodyContains = function (point, bodies) {
            var bodiesContainingPoint = matter_js_1.Query.point(bodies, point);
            return bodiesContainingPoint.length > 0;
        };
        return BodyHelper;
    }());
    exports.BodyHelper = BodyHelper;
});
