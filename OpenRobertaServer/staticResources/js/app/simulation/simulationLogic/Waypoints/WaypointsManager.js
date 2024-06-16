define(["require", "exports", "matter-js", "../ScrollView", "../Utils", "./WaypointList", "../KeyManager", "./ScoreWaypoint"], function (require, exports, matter_js_1, ScrollView_1, Utils_1, WaypointList_1, KeyManager_1, ScoreWaypoint_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WaypointsManager = void 0;
    /**
     * Manages a `WaypointList<W>` where each waypoint is checked one by one.
     *
     * Call `update(objectPosition: Vector)` continuously and `reset()` to reset the `waypointIndex`.
     */
    var WaypointsManager = /** @class */ (function () {
        function WaypointsManager(waypointList, waypointEvent) {
            var _this = this;
            if (waypointList === void 0) { waypointList = new WaypointList_1.WaypointList([]); }
            if (waypointEvent === void 0) { waypointEvent = function (_) { }; }
            this.waypointVisibilityBehavior = "showNext";
            this.waypointRasterSize = 0;
            this.userCanModifyWaypoints = false;
            this.waypointList = waypointList;
            this.waypointEvent = waypointEvent;
            KeyManager_1.KeyManager.keyDownHandler.push(function (event) {
                var _a, _b;
                if (_this.userCanModifyWaypoints && _this.selectedWaypoint != undefined) {
                    if (event.key == "Backspace") {
                        _this.selectedWaypoint.getScene().removeEntity(_this.selectedWaypoint);
                        _this.waypointList.remove(_this.selectedWaypoint);
                        _this.selectWaypoint(undefined);
                        (_a = _this.onWaypointsDidChange) === null || _a === void 0 ? void 0 : _a.call(_this);
                    }
                    else if (_this.selectedWaypoint instanceof ScoreWaypoint_1.ScoreWaypoint) {
                        var anyChange = true;
                        switch (event.key) {
                            case "+":
                                _this.selectedWaypoint.maxDistance += 10;
                                break;
                            case "-":
                                _this.selectedWaypoint.maxDistance -= 10;
                                break;
                            case "ArrowUp":
                                _this.selectedWaypoint.score += 10;
                                break;
                            case "ArrowDown":
                                _this.selectedWaypoint.score -= 10;
                                break;
                            default: anyChange = false;
                        }
                        if (anyChange) {
                            _this.selectedWaypoint.maxDistance = Math.max(0, _this.selectedWaypoint.maxDistance);
                            _this.selectedWaypoint.score = Math.max(0, _this.selectedWaypoint.score);
                            _this.selectedWaypoint.updateGraphics();
                            (_b = _this.onWaypointsDidChange) === null || _b === void 0 ? void 0 : _b.call(_this);
                        }
                    }
                }
            });
        }
        WaypointsManager.prototype.getSelectedWaypoint = function () {
            return this.selectedWaypoint;
        };
        WaypointsManager.prototype.getWaypoints = function () {
            return this.waypointList.getWaypoints();
        };
        /**
         * Sets `waypointList` and `waypointEvent` and resets `waypointIndex` to `undefined`. It also removes the current waypoints from the scene and add the new ones to their scenes.
         *
         * @param waypointList
         * @param waypointEvent
         */
        WaypointsManager.prototype.resetListAndEvent = function (waypointList, waypointEvent) {
            var _a;
            this.waypointList.getWaypoints().forEach(function (waypoint) {
                waypoint.getScene().removeEntity(waypoint);
            });
            waypointList.getWaypoints().forEach(function (waypoint) {
                waypoint.getScene().addEntity(waypoint);
            });
            this.waypointList = waypointList;
            this.waypointEvent = waypointEvent;
            this.reset();
            (_a = this.onWaypointsDidChange) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        /**
         * Reset the `waypointIndex` and the waypoint graphics
         */
        WaypointsManager.prototype.reset = function () {
            this.waypointIndex = undefined;
            this.updateWaypointVisibility();
        };
        WaypointsManager.prototype.update = function (objectPosition) {
            var _a;
            var nextWaypointIndex = ((_a = this.waypointIndex) !== null && _a !== void 0 ? _a : -1) + 1;
            if (nextWaypointIndex >= this.waypointList.getLength()) {
                return;
            }
            var waypoint = this.waypointList.get(nextWaypointIndex);
            if (Utils_1.Utils.vectorDistanceSquared(waypoint.position, objectPosition) <= waypoint.maxDistance * waypoint.maxDistance) {
                this.waypointIndex = nextWaypointIndex;
                this.waypointEvent(this.waypointIndex, waypoint);
                this.updateWaypointVisibility();
            }
        };
        WaypointsManager.prototype.updateWaypointVisibility = function () {
            var _a;
            var waypointIndex = (_a = this.waypointIndex) !== null && _a !== void 0 ? _a : -1;
            var waypoints = this.waypointList.getWaypoints();
            var isVisible;
            switch (this.waypointVisibilityBehavior) {
                case "hideAll":
                    isVisible = function () { return false; };
                    break;
                case "hideAllPrevious":
                    isVisible = function (index) { return index > waypointIndex; };
                    break;
                case "showAll":
                    isVisible = function () { return true; };
                    break;
                case "showNext":
                    isVisible = function (index) { return index == waypointIndex + 1; };
                    break;
                case "showHalf":
                    isVisible = function (index) { return index < waypoints.length / 2; };
                    break;
                default:
                    Utils_1.Utils.exhaustiveSwitch(this.waypointVisibilityBehavior);
            }
            waypoints.forEach(function (w, index) { return w.graphics.visible = isVisible(index); });
        };
        WaypointsManager.prototype.selectWaypoint = function (newSelection) {
            if (this.selectedWaypoint != undefined) {
                this.selectedWaypoint.lineColor = 0x0000ff;
                this.selectedWaypoint.updateGraphics();
            }
            if (newSelection != undefined) {
                newSelection.lineColor = 0xff0000;
                newSelection.updateGraphics();
            }
            this.selectedWaypoint = newSelection;
        };
        WaypointsManager.prototype.toggleWaypoint = function (newSelection) {
            if (newSelection === this.selectedWaypoint) {
                // if a selected waypoint is pressed, it is deselected
                this.selectWaypoint(undefined);
            }
            else {
                this.selectWaypoint(newSelection);
            }
        };
        WaypointsManager.prototype.addWaypointAfterSelection = function (waypoint) {
            var _a;
            if (this.selectedWaypoint != undefined) {
                var index = this.waypointList.waypoints.indexOf(this.selectedWaypoint);
                if (index >= 0) {
                    this.waypointList.insert(waypoint, index + 1);
                }
                else {
                    this.waypointList.push(waypoint);
                }
            }
            else {
                this.waypointList.push(waypoint);
            }
            waypoint.getScene().addEntity(waypoint);
            this.updateWaypointVisibility();
            (_a = this.onWaypointsDidChange) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        /**
         * Returns the last waypoint (useful for mouse interaction) where `position` is inside and matches the `predicate`
         * @param position The position has to be inside the `Waypoint`
         * @param predicate The `Waypoint` has to match this `predicate`
         * @returns The last waypoint at `position` which matches the `predicate`
         */
        WaypointsManager.prototype.lastWaypointAtPosition = function (position, predicate) {
            for (var i = this.waypointList.getLength() - 1; i >= 0; i--) {
                var waypoint = this.waypointList.get(i);
                if (Utils_1.Utils.vectorDistance(waypoint.position, position) < waypoint.maxDistance && predicate(waypoint)) {
                    return waypoint;
                }
            }
            return undefined;
        };
        WaypointsManager.prototype.onInteractionEvent = function (ev) {
            if (!this.userCanModifyWaypoints) {
                return;
            }
            switch (ev.type) {
                case ScrollView_1.EventType.PRESS:
                    var mousePosition = ev.data.getCurrentLocalPosition();
                    var newSelection = this.lastWaypointAtPosition(mousePosition, function (w) { return w.graphics.visible; });
                    this.toggleWaypoint(newSelection);
                    break;
                case ScrollView_1.EventType.DRAG:
                    var delta = ev.data.getDeltaLocal();
                    if (delta != undefined) {
                        var mousePosition_1 = ev.data.getCurrentLocalPosition();
                        if (this.selectedWaypoint == undefined) {
                            var newSelection_1 = this.lastWaypointAtPosition(mousePosition_1, function (w) { return w.graphics.visible; });
                            if (newSelection_1 != undefined) {
                                this.selectWaypoint(newSelection_1);
                            }
                        }
                        if (this.selectedWaypoint != undefined) {
                            if (this.waypointRasterSize == 0) {
                                // add in-place
                                matter_js_1.Vector.add(this.selectedWaypoint.position, delta, this.selectedWaypoint.position);
                            }
                            else {
                                this.selectedWaypoint.position = {
                                    x: Math.round(mousePosition_1.x / this.waypointRasterSize) * this.waypointRasterSize,
                                    y: Math.round(mousePosition_1.y / this.waypointRasterSize) * this.waypointRasterSize
                                };
                            }
                            this.selectedWaypoint.updateGraphics();
                            ev.cancel();
                        }
                    }
                    break;
            }
        };
        return WaypointsManager;
    }());
    exports.WaypointsManager = WaypointsManager;
});
