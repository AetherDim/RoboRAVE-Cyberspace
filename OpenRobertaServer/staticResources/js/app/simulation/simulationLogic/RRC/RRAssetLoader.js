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
define(["require", "exports", "../SharedAssetLoader"], function (require, exports, SharedAssetLoader_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RAINBOW_BACKGROUND_HS_SPACE_INVADERS = exports.RAINBOW_BACKGROUND_MS_SPACE_INVADERS = exports.RAINBOW_BACKGROUND_MS_DINO = exports.RAINBOW_BACKGROUND_ES = exports.RAINBOW_BACKGROUND_ES_DINO = exports.LINE_FOLLOWING_BACKGROUND_HS = exports.LINE_FOLLOWING_BACKGROUND_MS = exports.LINE_FOLLOWING_BACKGROUND_ES = exports.LABYRINTH_BLANK_BACKGROUND_HS = exports.LABYRINTH_BLANK_BACKGROUND_MS = exports.LABYRINTH_BLANK_BACKGROUND_ES = exports.PROGGY_TINY_FONT = exports.GOAL_BACKGROUND = exports.BLANK_BACKGROUND = exports.RRC_ASSET_PATH = void 0;
    exports.RRC_ASSET_PATH = 'assets/roborave/';
    var RRCAsset = /** @class */ (function (_super) {
        __extends(RRCAsset, _super);
        function RRCAsset(path, name) {
            return _super.call(this, exports.RRC_ASSET_PATH + path, name) || this;
        }
        return RRCAsset;
    }(SharedAssetLoader_1.Asset));
    var RRCSpriteAsset = /** @class */ (function (_super) {
        __extends(RRCSpriteAsset, _super);
        function RRCSpriteAsset(path, name, xScaling, yScaling) {
            return _super.call(this, exports.RRC_ASSET_PATH + path, name, xScaling, yScaling) || this;
        }
        return RRCSpriteAsset;
    }(SharedAssetLoader_1.SpriteAsset));
    var RRCFontAsset = /** @class */ (function (_super) {
        __extends(RRCFontAsset, _super);
        function RRCFontAsset(css, families, name) {
            return _super.call(this, exports.RRC_ASSET_PATH + css, families, name) || this;
        }
        return RRCFontAsset;
    }(SharedAssetLoader_1.FontAsset));
    var RRCMultiAsset = /** @class */ (function (_super) {
        __extends(RRCMultiAsset, _super);
        function RRCMultiAsset(prefix, postfix, idStart, idEnd, name, xScaling, yScaling) {
            return _super.call(this, exports.RRC_ASSET_PATH + prefix, postfix, idStart, idEnd, name, xScaling, yScaling) || this;
        }
        return RRCMultiAsset;
    }(SharedAssetLoader_1.MultiSpriteAsset));
    exports.BLANK_BACKGROUND = new RRCSpriteAsset('blank.svg');
    exports.GOAL_BACKGROUND = new RRCSpriteAsset('goal.svg');
    exports.PROGGY_TINY_FONT = new RRCFontAsset('fonts/ProggyTiny.css', ['ProggyTiny']);
    // Labyrinth
    exports.LABYRINTH_BLANK_BACKGROUND_ES = new RRCSpriteAsset('labyrinth/es/labyrinth.svg');
    exports.LABYRINTH_BLANK_BACKGROUND_MS = new RRCSpriteAsset('labyrinth/ms/labyrinth.svg');
    exports.LABYRINTH_BLANK_BACKGROUND_HS = new RRCSpriteAsset('labyrinth/hs/labyrinth.svg');
    // line-following
    exports.LINE_FOLLOWING_BACKGROUND_ES = new RRCSpriteAsset('line-following/es/linefollowing.jpeg', undefined, 0.25, 0.25);
    exports.LINE_FOLLOWING_BACKGROUND_MS = new RRCSpriteAsset('line-following/ms/linefollowing.jpeg', undefined, 0.25, 0.25);
    exports.LINE_FOLLOWING_BACKGROUND_HS = new RRCSpriteAsset('line-following/hs/linefollowing.jpeg', undefined, 0.25, 0.25);
    // rainbow
    exports.RAINBOW_BACKGROUND_ES_DINO = new RRCSpriteAsset('rainbow/es/dino.jpeg', undefined, 0.25, 0.25);
    exports.RAINBOW_BACKGROUND_ES = new RRCSpriteAsset('rainbow/es/cloud.jpeg', undefined, 0.25, 0.25);
    exports.RAINBOW_BACKGROUND_MS_DINO = new RRCMultiAsset('rainbow/ms/dino', '.png', 0, 23, undefined, 0.25, 0.25);
    exports.RAINBOW_BACKGROUND_MS_SPACE_INVADERS = new RRCMultiAsset('rainbow/ms/cloud', '.png', 0, 23, undefined, 0.25, 0.25);
    exports.RAINBOW_BACKGROUND_HS_SPACE_INVADERS = new RRCMultiAsset('rainbow/hs/rainbow', '.png', 0, 719, undefined, 0.25, 0.25);
});
