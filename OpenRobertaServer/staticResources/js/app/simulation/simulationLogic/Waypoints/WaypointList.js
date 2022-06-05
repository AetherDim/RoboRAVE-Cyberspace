define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WaypointList = void 0;
    /**
     * A list of waypoints with several helper functions to waypoint paths
     */
    var WaypointList = /** @class */ (function () {
        function WaypointList(waypoints) {
            if (waypoints === void 0) { waypoints = []; }
            this.waypoints = waypoints;
        }
        WaypointList.prototype.getWaypoints = function () {
            return this.waypoints;
        };
        /**
         * Get the waypoint at `index`
         */
        WaypointList.prototype.get = function (index) {
            return this.waypoints[index];
        };
        /**
         * Get the number of waypoints in the list
         */
        WaypointList.prototype.getLength = function () {
            return this.waypoints.length;
        };
        WaypointList.prototype.getLastWaypointIndex = function () {
            return this.waypoints.length - 1;
        };
        WaypointList.prototype.getLastWaypoint = function () {
            return this.waypoints[this.waypoints.length - 1];
        };
        /**
         * Return a `WaypointList` with reversed waypoints. See `includingTheLast`.
         *
         * @param includingTheLast If `true`: Return all waypoints including the last waypoint of `this`.
         * If `false` do not add the last waypoint to the list. (default: `false`)
         */
        WaypointList.prototype.reversed = function (includingTheLast) {
            if (includingTheLast === void 0) { includingTheLast = true; }
            var waypoints = [];
            for (var i = this.waypoints.length - 1 + (includingTheLast ? 0 : -1); i >= 0; i--) {
                // TODO: Find type-safe way to clone an object
                waypoints.push(this.waypoints[i].clone());
            }
            return new WaypointList(waypoints);
        };
        /**
         * Append (almost) all current waypoints in reverse order to `this`. See `includingTheLast`.
         *
         * @param includingTheLast If `true`: Append all waypoints including the last waypoint.
         * If `false` do not append the last waypoint. (default: `false`)
         */
        WaypointList.prototype.appendReversedWaypoints = function (includingTheLast) {
            if (includingTheLast === void 0) { includingTheLast = false; }
            for (var i = this.waypoints.length - 1 + (includingTheLast ? 0 : -1); i >= 0; i--) {
                // TODO: Find type-safe way to clone an object
                this.waypoints.push(this.waypoints[i].clone());
            }
        };
        /**
         * Append all waypoints in `list`
         */
        WaypointList.prototype.append = function (list) {
            var _this = this;
            list.waypoints.forEach(function (waypoint) {
                _this.waypoints.push(waypoint);
            });
        };
        WaypointList.prototype.appendWaypoints = function () {
            var _this = this;
            var waypoints = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                waypoints[_i] = arguments[_i];
            }
            waypoints.forEach(function (waypoint) {
                _this.waypoints.push(waypoint);
            });
        };
        return WaypointList;
    }());
    exports.WaypointList = WaypointList;
});
