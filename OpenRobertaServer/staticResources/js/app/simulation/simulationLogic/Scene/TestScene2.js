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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
define(["require", "exports", "../RRC/Scene/RRCScene", "../SharedAssetLoader", "../Unit", "../RRC/RRAssetLoader", "../Random", "../Waypoints/WaypointList", "../Utils"], function (require, exports, RRCScene_1, SharedAssetLoader_1, Unit_1, RRC, Random_1, WaypointList_1, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestScene2 = void 0;
    var TestScene2 = /** @class */ (function (_super) {
        __extends(TestScene2, _super);
        function TestScene2(name, ageGroup) {
            var _this = _super.call(this, name, ageGroup) || this;
            _this.assets = [
                RRC.RAINBOW_BACKGROUND_HS_SPACE_INVADERS.getAsset(1),
                RRC.RAINBOW_BACKGROUND_HS_SPACE_INVADERS.getAsset(2),
                RRC.RAINBOW_BACKGROUND_HS_SPACE_INVADERS.getAsset(3),
                RRC.RAINBOW_BACKGROUND_HS_SPACE_INVADERS.getAsset(4)
            ].filter(function (asset) { return asset != undefined; });
            _this.testSensorTypes = ["COLOR", "ULTRASONIC", "TOUCH"];
            _this._sensorTypes = __spreadArray(__spreadArray([], __read(_this.testSensorTypes), false), [undefined], false);
            _this.useMultiSetCombinations = true;
            _this.allSensorConfigurations = _this.useMultiSetCombinations ?
                Utils_1.Utils.generateMultiSetTuples(_this._sensorTypes, 4).map(function (multiSet) {
                    return {
                        1: multiSet[0],
                        2: multiSet[1],
                        3: multiSet[2],
                        4: multiSet[3]
                    };
                }) :
                Utils_1.Utils.allPropertiesTuples({
                    1: _this._sensorTypes,
                    2: _this._sensorTypes,
                    3: _this._sensorTypes,
                    4: _this._sensorTypes
                });
            _this.configurationIndex = 0;
            var debug = _this.getDebugGuiStatic();
            if (debug != undefined) {
                debug.add(_this, "configurationIndex", 0, _this.allSensorConfigurations.length - 1, 1)
                    .onChange(function () { return debug.updateDisplay(); })
                    .onFinishChange(function () { return _this.reset([]); });
                debug.addUpdatable("configurationIndex: ", function () {
                    return _this.configurationIndex + "/" + (_this.allSensorConfigurations.length - 1);
                });
                debug.addUpdatable("configuration: ", function () {
                    return JSON.stringify(_this.allSensorConfigurations[_this.configurationIndex], undefined, "\n");
                });
                debug.addButton("next", function () {
                    if (_this.configurationIndex < _this.allSensorConfigurations.length - 1) {
                        _this.configurationIndex += 1;
                        debug.updateDisplay();
                        _this.reset([]);
                    }
                });
                debug.addButton("previous", function () {
                    if (_this.configurationIndex > 0) {
                        _this.configurationIndex -= 1;
                        debug.updateDisplay();
                        _this.reset([]);
                    }
                });
            }
            return _this;
        }
        TestScene2.prototype.getUnitConverter = function () {
            return new Unit_1.Unit({ m: 1000 });
        };
        TestScene2.prototype.onLoadAssets = function (chain) {
            SharedAssetLoader_1.SharedAssetLoader.load.apply(SharedAssetLoader_1.SharedAssetLoader, __spreadArray(__spreadArray([function () { return chain.next(); }], __read(this.assets), false), [RRC.GOAL_BACKGROUND], false));
        };
        TestScene2.prototype.onInit = function (chain) {
            var _this = this;
            // create dynamic debug gui
            this.initDynamicDebugGui();
            var portToSensorMapping = this.allSensorConfigurations[this.configurationIndex];
            this.robotManager.configurationManager.setRobotConfigurations([
                {
                    TRACKWIDTH: 18,
                    WHEELDIAMETER: 5.6,
                    SENSORS: portToSensorMapping
                }
            ]);
            var textures = this.assets.map(function (asset) { return SharedAssetLoader_1.SharedAssetLoader.get(asset).texture; });
            textures.forEach(function (texture) {
                var sprite = new PIXI.Sprite(texture);
                sprite.position.set((0, Random_1.randomIntBetween)(0, 300), (0, Random_1.randomIntBetween)(0, 300));
                _this.getContainers().groundContainer.addChild(sprite);
            });
            var waypointList = new WaypointList_1.WaypointList([
                this.makeWaypoint({ x: 100, y: 200 }, 10),
                this.makeWaypoint({ x: 400, y: 200 }, 30)
            ]);
            waypointList.appendReversedWaypoints();
            this.setWaypointList(waypointList);
            this.initRobot({
                position: { x: 100, y: 400 },
                rotation: 0
            });
            chain.next();
        };
        return TestScene2;
    }(RRCScene_1.RRCScene));
    exports.TestScene2 = TestScene2;
});
