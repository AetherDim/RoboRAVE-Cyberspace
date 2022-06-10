var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports", "./RobotConfigurationManager", "../../BlocklyDebug"], function (require, exports, RobotConfigurationManager_1, BlocklyDebug_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RobotManager = void 0;
    var RobotManager = /** @class */ (function () {
        function RobotManager(scene) {
            /**
             * Represents the number of robots after this scene has been initialized.
             * The GUI needs this information before the scene has finished loading.
             * @protected
             */
            this.numberOfRobots = 1;
            this.showRobotSensorValues = true;
            /**
             * All programmable robots within the scene.
             * The program flow manager will use the robots internally.
             */
            this.robots = new Array();
            this.configurationManager = new RobotConfigurationManager_1.RobotConfigurationManager(this.robots);
            this.scene = scene;
        }
        RobotManager.prototype.setPrograms = function (programs) {
            var _this = this;
            this.scene.runAfterLoading(function () {
                if (_this.robots.length < programs.length) {
                    console.warn("Too many programs for robots!");
                }
                if (_this.robots.length > programs.length) {
                    console.warn("Not enough programs for robots!");
                }
                for (var i = 0; i < _this.robots.length; i++) {
                    if (i >= programs.length) {
                        break;
                    }
                    _this.robots[i].programManager.setPrograms(programs[i], _this.scene.unit);
                    _this.robots[i].init();
                }
                if (_this.robots.length > 0) {
                    // BlocklyDebug selection
                    var programs_1 = _this.robots[0].programManager.getPrograms();
                    if (programs_1.length > 0) {
                        BlocklyDebug_1.BlocklyDebug.init(programs_1[0]);
                    }
                    else {
                        BlocklyDebug_1.BlocklyDebug.init(undefined);
                    }
                }
            });
        };
        RobotManager.prototype.getRobots = function () {
            return this.robots;
        };
        /**
         * Adds `robot` to scene (to `robots` array and entities)
         */
        RobotManager.prototype.addRobot = function (robot) {
            this.robots.push(robot);
            this.scene.getEntityManager().addEntity(robot);
            this.configurationManager.safeUpdateLastRobot();
        };
        RobotManager.prototype.getNumberOfRobots = function () {
            return this.robots.length;
        };
        RobotManager.prototype.updateSensorValueView = function () {
            // TODO: refactor this, the simulation should not have a html/div dependency
            // update sensor value html
            var _this = this;
            if (this.showRobotSensorValues && $('#simValuesModal').is(':visible')) {
                var htmlElement = $('#notConstantValue');
                htmlElement.html('');
                var elementList_1 = [];
                elementList_1.push({ label: 'Simulation tick rate:', value: this.scene.getCurrentSimTickRate() });
                this.robots.forEach(function (robot) { return robot.addHTMLSensorValuesTo(elementList_1); });
                var htmlString = elementList_1.map(function (element) { return _this.htmlSensorValues(element.label, element.value); }).join("");
                htmlElement.append(htmlString);
            }
        };
        RobotManager.prototype.htmlSensorValues = function (label, value) {
            return "<div><label>".concat(label, "</label><span>").concat(value, "</span></div>");
        };
        RobotManager.prototype.removeAllEventHandlers = function () {
            this.robots.forEach(function (robot) { return robot.programManager.removeAllEventHandlers(); });
        };
        /**
         * remove all robots
         */
        RobotManager.prototype.clear = function () {
            this.robots.length = 0;
        };
        RobotManager.prototype.startPrograms = function () {
            var e_1, _a;
            try {
                for (var _b = __values(this.robots), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var robot = _c.value;
                    robot.programManager.startPrograms();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        RobotManager.prototype.stopPrograms = function () {
            var e_2, _a;
            try {
                for (var _b = __values(this.robots), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var robot = _c.value;
                    robot.programManager.stopPrograms();
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        RobotManager.prototype.resumePrograms = function () {
            var e_3, _a;
            try {
                for (var _b = __values(this.robots), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var robot = _c.value;
                    robot.programManager.startPrograms();
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        };
        RobotManager.prototype.pausePrograms = function () {
            var e_4, _a;
            try {
                for (var _b = __values(this.robots), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var robot = _c.value;
                    robot.programManager.pausePrograms();
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        return RobotManager;
    }());
    exports.RobotManager = RobotManager;
});
