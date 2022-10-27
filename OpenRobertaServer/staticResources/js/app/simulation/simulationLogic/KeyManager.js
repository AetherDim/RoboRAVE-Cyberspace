define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KeyManager = void 0;
    var KeyManager = /** @class */ (function () {
        function KeyManager() {
        }
        KeyManager.keyPressed = function (key) {
            return this.keyDownList.includes(key);
        };
        KeyManager.specialKeyPressed = function (key) {
            return this.keyDownList.includes(key);
        };
        KeyManager.setup = function () {
            window.addEventListener("keydown", function (event) {
                if (!KeyManager.keyDownList.includes(event.key)) {
                    KeyManager.keyDownList.push(event.key);
                }
                KeyManager.keyDownHandler.forEach(function (handler) { return handler(event); });
            });
            window.addEventListener("keyup", function (event) {
                KeyManager.keyDownList = KeyManager.keyDownList.filter(function (key) { return key != event.key; });
                KeyManager.keyUpHandler.forEach(function (handler) { return handler(event); });
            });
        };
        KeyManager.keyDownList = new Array();
        KeyManager.keyDownHandler = new Array();
        KeyManager.keyUpHandler = new Array();
        return KeyManager;
    }());
    exports.KeyManager = KeyManager;
});
