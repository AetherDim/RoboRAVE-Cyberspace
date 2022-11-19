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
define(["require", "exports", "blockly", "./UIElement"], function (require, exports, Blockly, UIElement_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UIManager = exports.UIRobertaToggleStateButton = exports.UIRobertaStateButton = exports.UIRobertaButton = void 0;
    var UIRobertaButton = /** @class */ (function (_super) {
        __extends(UIRobertaButton, _super);
        function UIRobertaButton() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Adds `clickHandler` to the html element as click handler
         *
         * @param clickHandler will be called with the JQuery object of the `HTMLElement`.
         *
         * @returns `this`
         */
        UIRobertaButton.prototype.onClick = function (clickHandler) {
            this.jQueryHTMLElement.onWrap("click", clickHandler, this.jQueryString + " clicked");
            return this;
        };
        return UIRobertaButton;
    }(UIElement_1.UIElement));
    exports.UIRobertaButton = UIRobertaButton;
    var OrderedMap = /** @class */ (function () {
        function OrderedMap(values) {
            this.values = values;
        }
        OrderedMap.prototype.get = function (key) {
            var index = this.indexOfKey(key);
            if (index == -1) {
                return undefined;
            }
            return this.values[index][1];
        };
        OrderedMap.prototype.contains = function (key) {
            return this.indexOfKey(key) != 1;
        };
        OrderedMap.prototype.set = function (key, value) {
            if (this.contains(key)) {
                return;
            }
            this.values.push([key, value]);
        };
        OrderedMap.prototype.indexOfKey = function (key) {
            return this.values.findIndex(function (keyValue) { return keyValue[0] == key; });
        };
        return OrderedMap;
    }());
    var ReadonlyOrderedMap = /** @class */ (function () {
        function ReadonlyOrderedMap(values) {
            this.keyValuePairs = values;
        }
        ReadonlyOrderedMap.prototype.get = function (key) {
            var index = this.indexOfKey(key);
            if (index == -1) {
                return undefined;
            }
            return this.keyValuePairs[index][1];
        };
        ReadonlyOrderedMap.prototype.contains = function (key) {
            return this.indexOfKey(key) != 1;
        };
        ReadonlyOrderedMap.prototype.indexOfKey = function (key) {
            return this.keyValuePairs.findIndex(function (keyValue) { return keyValue[0] == key; });
        };
        return ReadonlyOrderedMap;
    }());
    /**
     * Use the state as an 'action' or actual 'state'. See `onClick`
     */
    var UIRobertaStateButton = /** @class */ (function (_super) {
        __extends(UIRobertaStateButton, _super);
        function UIRobertaStateButton(buttonID, initialState, buttonSettingsState) {
            var _this = _super.call(this, { id: buttonID }) || this;
            /** 'oldState' is equivalent to 'action' */
            _this.clickHandlers = [];
            // TODO: Convert all the 'onWrap' js code to use the 'UIManager'
            // Workaround since 'onWrap' is not loaded initially
            _this.needsOnWrapHandler = true;
            _this.stateMappingObject = new ReadonlyOrderedMap(buttonSettingsState);
            _this.state = initialState;
            _this.initialState = initialState;
            return _this;
            // TODO: Convert all the 'onWrap' js code to use the 'UIManager'
            // call 'setButtonEventHandler' only for buttons on which 'onClick' is called
            //this.setButtonEventHandler()
        }
        UIRobertaStateButton.prototype.getState = function () {
            return this.state;
        };
        /**
         * Tries to set the button event handler as long 'onWrap' is not definied for `JQuery`.
         */
        UIRobertaStateButton.prototype.setButtonEventHandler = function () {
            var _this = this;
            if (!this.needsOnWrapHandler) {
                return;
            }
            if (this.jQueryHTMLElement.onWrap !== undefined) {
                this.jQueryHTMLElement.onWrap("click", function () {
                    var _a, _b;
                    var oldState = _this.state;
                    var newState = (_b = (_a = _this.stateChangeHandler) === null || _a === void 0 ? void 0 : _a.call(_this, oldState)) !== null && _b !== void 0 ? _b : oldState;
                    _this.state = newState;
                    _this.clickHandlers.forEach(function (handler) { return handler(oldState, newState); });
                    _this.update();
                }, this.jQueryString + " clicked");
            }
            else {
                // workaround for onWrap not loaded
                setTimeout(function () { return _this.setButtonEventHandler(); }, 200);
            }
        };
        UIRobertaStateButton.prototype.setInitialState = function () {
            this.setState(this.initialState);
        };
        /**
         * Set the state change handler.
         *
         * @param stateChangeHandler will be called with the state in which the button is in **before** the state change.
         * It returns the new button state.
         *
         * @returns `this`
         */
        UIRobertaStateButton.prototype.setStateChangeHandler = function (stateChangeHandler) {
            this.stateChangeHandler = stateChangeHandler;
            return this;
        };
        /**
         * Adds `onClickHandler` to the click handler list.
         * One can use the 'action' which is the 'oldState' as a button action, or use 'newState' as the actual state.
         *
         * @param onClickHandler will be called with the state in which the button is in **before** the state change.
         *
         * @returns `this`
         */
        UIRobertaStateButton.prototype.onClick = function (onClickHandler) {
            // TODO: 'setButtonEventHandler' to the constructor if all 'onWrap' code is converted to TypeScript 
            this.setButtonEventHandler();
            this.clickHandlers.push(onClickHandler);
            return this;
        };
        UIRobertaStateButton.prototype.update = function () {
            var _this = this;
            var _a;
            // remove all classes in 'stateMappingObject'
            this.stateMappingObject.keyValuePairs.forEach(function (value) {
                return _this.jQueryHTMLElement.removeClass(value[1].class);
            });
            // add the state class
            var buttonSettings = this.stateMappingObject.get(this.state);
            if (buttonSettings != undefined) {
                this.jQueryHTMLElement.addClass(buttonSettings.class);
                this.jQueryHTMLElement.attr("data-original-title", (_a = buttonSettings.tooltip) !== null && _a !== void 0 ? _a : "");
            }
        };
        UIRobertaStateButton.prototype.setState = function (state) {
            this.state = state;
            this.update();
        };
        return UIRobertaStateButton;
    }(UIElement_1.UIElement));
    exports.UIRobertaStateButton = UIRobertaStateButton;
    var UIRobertaToggleStateButton = /** @class */ (function (_super) {
        __extends(UIRobertaToggleStateButton, _super);
        function UIRobertaToggleStateButton() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UIRobertaToggleStateButton.make = function (buttonID, initialState, buttonSettingsState) {
            var newButton = new UIRobertaToggleStateButton(buttonID, initialState, buttonSettingsState);
            newButton.setStateChangeHandler(function (state) {
                var index = newButton.stateMappingObject.indexOfKey(state) + 1;
                var values = newButton.stateMappingObject.keyValuePairs;
                return values[index % values.length][0];
            });
            newButton.setState(initialState);
            return newButton;
        };
        return UIRobertaToggleStateButton;
    }(UIRobertaStateButton));
    exports.UIRobertaToggleStateButton = UIRobertaToggleStateButton;
    var BlocklyMsg = Blockly.Msg;
    var UIManager = /** @class */ (function () {
        function UIManager() {
        }
        UIManager.programControlButton = UIRobertaToggleStateButton.make("simControl", "start", [
            ["start", { class: "typcn-media-play", tooltip: BlocklyMsg.MENU_SIM_START_TOOLTIP }],
            ["stop", { class: "typcn-media-stop", tooltip: BlocklyMsg.MENU_SIM_STOP_TOOLTIP }]
        ]);
        UIManager.physicsSimControlButton = UIRobertaToggleStateButton.make("simFLowControl", "stop", [
            ["start", { class: "typcn-flash-outline", tooltip: "Start simulation" }],
            ["stop", { class: "typcn-flash", tooltip: "Stop simulation" }]
        ]);
        UIManager.showScoreButton = UIRobertaToggleStateButton.make("simScore", "showScore", [
            ["showScore", { class: "typcn-star" }],
            ["hideScore", { class: "typcn-star-outline" }],
        ]);
        UIManager.simSpeedUpButton = UIRobertaToggleStateButton.make("simSpeedUp", "fastForward", [
            ["normalSpeed", { class: "typcn-media-fast-forward-outline" }],
            ["fastForward", { class: "typcn-media-fast-forward" }],
            ["ultraFast", { class: "typcn-infinity-outline" }]
        ]);
        // simResetPose is handled by roberta itself
        UIManager.resetSceneButton = new UIRobertaButton({ id: "simResetPose" });
        UIManager.zoomOutButton = new UIRobertaButton({ id: "zoomOut" });
        UIManager.zoomInButton = new UIRobertaButton({ id: "zoomIn" });
        UIManager.zoomResetButton = new UIRobertaButton({ id: "zoomReset" });
        UIManager.switchSceneButton = new UIRobertaButton({ id: "simScene" });
        // used for simDebugView and debugVariables view
        UIManager.closeParentsButton = new UIRobertaButton({ jQueryString: ".simWindow .close" });
        UIManager.simDebugViewButton = new UIRobertaButton({ id: "simValues" });
        UIManager.simDebugMode = new UIRobertaButton({ id: "debugMode" });
        UIManager.debugStepOverButton = new UIRobertaButton({ id: "simControlStepOver" });
        UIManager.debugStepIntoButton = new UIRobertaButton({ id: "simControlStepInto" });
        UIManager.debugStepBreakPointButton = new UIRobertaButton({ id: "simControlBreakPoint" });
        UIManager.debugVariablesButton = new UIRobertaButton({ id: "simVariables" });
        UIManager.simViewButton = UIRobertaToggleStateButton.make("simButton", "open", [
            ["closed", { class: "" }],
            ["open", { class: "" }]
        ]);
        return UIManager;
    }());
    exports.UIManager = UIManager;
});
