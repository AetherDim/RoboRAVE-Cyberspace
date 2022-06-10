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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
define(["require", "exports", "./SimulationCache", "../Scene/Scene", "../RRC/Scene/RRCScoreScene", "../SceneRenderer", "./SceneManager", "../EventManager/EventManager", "../BlocklyDebug"], function (require, exports, SimulationCache_1, Scene_1, RRCScoreScene_1, SceneRenderer_1, SceneManager_1, EventManager_1, BlocklyDebug_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cyberspace = void 0;
    var Cyberspace = /** @class */ (function () {
        function Cyberspace(canvas, autoResizeTo, scenes) {
            var _a;
            if (scenes === void 0) { scenes = []; }
            this.sceneManager = new SceneManager_1.SceneManager();
            this.simulationCache = new SimulationCache_1.SimulationCache([], "");
            this.eventManager = EventManager_1.EventManager.init({
                /** will be called after the simulation has been started */
                onStartSimulation: EventManager_1.ParameterTypes.none,
                /** will be called after the simulation has been paused */
                onPauseSimulation: EventManager_1.ParameterTypes.none,
                /** will be called after the program has been started */
                onStartPrograms: EventManager_1.ParameterTypes.none,
                /** will be called after the program has been paused or stopped */
                onPausePrograms: EventManager_1.ParameterTypes.none,
                /** will be called after the program has been stopped */
                onStopPrograms: EventManager_1.ParameterTypes.none
            });
            this.specializedEventManager = new /** @class */ (function () {
                function SpecializedEventManager() {
                    this.handlerSetters = [];
                }
                /**
                 * Adds the function `setHandler` which is later called in `Cyberspace.resetEventHandlersOfScene(scene)`.
                 *
                 * @param sceneType The type of the scene
                 * @param setHandler The function which sets the event handlers of a scene of type `sceneType`.
                 */
                SpecializedEventManager.prototype.addEventHandlerSetter = function (sceneType, setHandler) {
                    this.handlerSetters.push(function (scene) {
                        if (scene instanceof sceneType) {
                            setHandler(scene);
                        }
                    });
                };
                /**
                 * Sets the specified event handlers for `scene`.
                 *
                 * This method should only be called inside `Cyberspace`.
                 */
                SpecializedEventManager.prototype._setEventHandlers = function (scene) {
                    this.handlerSetters.forEach(function (handlerSetter) { return handlerSetter(scene); });
                };
                return SpecializedEventManager;
            }());
            (_a = this.sceneManager).registerScene.apply(_a, __spreadArray([], __read(scenes), false));
            // empty scene as default
            var emptyScene = new Scene_1.Scene("");
            this.renderer = new SceneRenderer_1.SceneRender(emptyScene, canvas, this.simulationCache.toRobotSetupData(), autoResizeTo);
            var t = this;
            this.renderer.onSwitchScene(function (scene) { return t.resetEventHandlersOfScene(scene); });
        }
        Cyberspace.prototype.destroy = function () {
            this.sceneManager.destroy();
            this.renderer.destroy();
        };
        /* ############################################################################################ */
        /* ####################################### Scene control ###################################### */
        /* ############################################################################################ */
        Cyberspace.prototype.resetEventHandlersOfScene = function (scene) {
            var e_1, _a;
            scene.removeAllEventHandlers();
            this.specializedEventManager._setEventHandlers(scene);
            var eventHandlerLists = this.eventManager.eventHandlerLists;
            try {
                for (var _b = __values(this.getScene().getRobotManager().getRobots()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var robot = _c.value;
                    // FIXME: first program of first robot only?
                    var programManagerEventHandlerLists = robot.programManager.eventManager.eventHandlerLists;
                    programManagerEventHandlerLists.onStartProgram.pushEventHandleList(eventHandlerLists.onStartPrograms);
                    programManagerEventHandlerLists.onPauseProgram.pushEventHandleList(eventHandlerLists.onPausePrograms);
                    programManagerEventHandlerLists.onStopProgram.pushEventHandleList(eventHandlerLists.onStopPrograms);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var sceneEventHandlerLists = scene.eventManager.eventHandlerLists;
            sceneEventHandlerLists.onStartSimulation.pushEventHandleList(eventHandlerLists.onStartSimulation);
            sceneEventHandlerLists.onPauseSimulation.pushEventHandleList(eventHandlerLists.onPauseSimulation);
        };
        Cyberspace.prototype.resetScene = function () {
            this.renderer.getScene().reset(this.simulationCache.toRobotSetupData());
        };
        Cyberspace.prototype.fullResetScene = function () {
            this.renderer.getScene().fullReset(this.simulationCache.toRobotSetupData());
        };
        Cyberspace.prototype.getScene = function () {
            return this.renderer.getScene();
        };
        Cyberspace.prototype.getScoreScene = function () {
            var scene = this.renderer.getScene();
            if (scene instanceof RRCScoreScene_1.RRCScoreScene) {
                return scene;
            }
            return undefined;
        };
        Cyberspace.prototype.getScenes = function () {
            return this.sceneManager.getSceneDescriptorList();
        };
        Cyberspace.prototype.switchToScene = function (scene) {
            this.stopPrograms();
            this.renderer.switchScene(this.simulationCache.toRobotSetupData(), scene);
            if (scene.isLoadingComplete()) {
                this.fullResetScene();
            }
        };
        Cyberspace.prototype.loadScene = function (ID, forced) {
            if (forced === void 0) { forced = false; }
            if (this.getScene().isLoadingComplete()) {
                var scene = this.sceneManager.getScene(ID);
                if (scene) {
                    this.sceneManager.setCurrentScene(ID);
                    this.switchToScene(scene);
                }
            }
        };
        /**
         *
         * @param forced whether we should load while the current scene is loading
         */
        Cyberspace.prototype.switchToNextScene = function (forced) {
            if (forced === void 0) { forced = false; }
            if (forced || this.getScene().isLoadingComplete()) {
                var scene = this.sceneManager.getNextScene();
                if (scene != undefined) {
                    this.switchToScene(scene);
                }
            }
            return this.sceneManager.getCurrentSceneDescriptor();
        };
        Cyberspace.prototype.getSceneManager = function () {
            return this.sceneManager;
        };
        Cyberspace.prototype.robotCount = function () {
            return this.getScene().getRobotManager().getNumberOfRobots();
        };
        /* ############################################################################################ */
        /* #################################### Simulation control #################################### */
        /* ############################################################################################ */
        Cyberspace.prototype.startSimulation = function () {
            this.getScene().startSim();
        };
        Cyberspace.prototype.pauseSimulation = function () {
            this.getScene().pauseSim();
        };
        Cyberspace.prototype.resetSimulation = function () {
            this.resetScene();
        };
        Cyberspace.prototype.setSimulationSpeedupFactor = function (speedup) {
            this.getScene().setSpeedUpFactor(speedup);
        };
        /* ############################################################################################ */
        /* ##################################### Program control ###################################### */
        /* ############################################################################################ */
        Cyberspace.prototype.getRobotManager = function () {
            return this.getScene().getRobotManager();
        };
        Cyberspace.prototype.startPrograms = function () {
            this.getRobotManager().startPrograms();
        };
        Cyberspace.prototype.stopPrograms = function () {
            this.getRobotManager().stopPrograms();
        };
        Cyberspace.prototype.resumePrograms = function () {
            this.getRobotManager().startPrograms();
        };
        Cyberspace.prototype.pausePrograms = function () {
            this.getRobotManager().pausePrograms();
        };
        Cyberspace.prototype.setDebugMode = function (state) {
            BlocklyDebug_1.BlocklyDebug.getInstance().updateDebugMode(state);
        };
        Cyberspace.prototype.isDebugMode = function () {
            return BlocklyDebug_1.BlocklyDebug.getInstance().isDebugMode();
        };
        /**
         * Set the RobertaRobotSetupData where the first program in the robertaRobotSetupDataList should be the Blockly
         * workspace program which is used for debugging. If this is not the case, debugging won't be possible.
         * @param robertaRobotSetupDataList
         * @param robotType
         */
        Cyberspace.prototype.setRobertaRobotSetupData = function (robertaRobotSetupDataList, robotType) {
            var newSimulationCache = new SimulationCache_1.SimulationCache(robertaRobotSetupDataList, robotType);
            var oldCache = this.simulationCache;
            this.simulationCache = newSimulationCache;
            if (!newSimulationCache.hasEqualConfiguration(oldCache)) {
                // sets the robot programs and sensor configurations based on 'simulationCache'
                this.resetScene();
            }
            else {
                this.getScene().setPrograms(this.simulationCache.toRobotSetupData());
            }
        };
        /* ############################################################################################ */
        /* #################################### ScrollView control #################################### */
        /* ############################################################################################ */
        /**
         * Reset zoom of ScrollView
         */
        Cyberspace.prototype.resetView = function () {
            this.renderer.zoomReset();
        };
        /**
         * Zoom into ScrollView
         */
        Cyberspace.prototype.zoomViewIn = function () {
            this.renderer.zoomIn();
        };
        /**
         * zoom out of ScrollView
         */
        Cyberspace.prototype.zoomViewOut = function () {
            this.renderer.zoomOut();
        };
        return Cyberspace;
    }());
    exports.Cyberspace = Cyberspace;
});
