define(["require", "exports", "../Utils"], function (require, exports, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UIElement = void 0;
    var UIElement = /** @class */ (function () {
        function UIElement(arg) {
            if (Utils_1.Utils.containsAllKeys(arg, ["id"])) {
                this.jQueryString = "#" + arg.id;
                this.jQueryHTMLElement = $(this.jQueryString);
            }
            else if (Utils_1.Utils.containsAllKeys(arg, ["jQuery"])) {
                this.jQueryString = arg.jQueryString;
                this.jQueryHTMLElement = arg.jQuery;
            }
            else if (Utils_1.Utils.containsAllKeys(arg, ["jQueryString"])) {
                this.jQueryString = arg.jQueryString;
                this.jQueryHTMLElement = $(this.jQueryString);
            }
            else {
                throw "Missing state";
            }
        }
        UIElement.prototype.hide = function () {
            this.jQueryHTMLElement.addClass("hide");
        };
        UIElement.prototype.show = function () {
            this.jQueryHTMLElement.removeClass("hide");
        };
        return UIElement;
    }());
    exports.UIElement = UIElement;
});
