define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UIElement = void 0;
    var UIElement = /** @class */ (function () {
        function UIElement(jQueryHTMLElement, id) {
            this.jQueryHTMLElement = jQueryHTMLElement;
            this.id = id;
        }
        UIElement.fromID = function (id) {
            return new UIElement($("#" + id));
        };
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
