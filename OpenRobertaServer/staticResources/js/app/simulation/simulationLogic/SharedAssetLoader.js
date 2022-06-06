define(["require", "exports", "webfontloader", "./Random", "./Utils", "./pixijs"], function (require, exports, WebFont, Random_1, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SharedAssetLoader = exports.MultiAsset = exports.FontAsset = exports.Asset = void 0;
    var Asset = /** @class */ (function () {
        function Asset(path, name) {
            this.path = path;
            if (name) {
                this.name = name;
            }
            else {
                this.name = path;
            }
        }
        return Asset;
    }());
    exports.Asset = Asset;
    var FontAsset = /** @class */ (function () {
        function FontAsset(css, families, name) {
            this.families = families;
            this.css = css;
            if (name) {
                this.name = name;
            }
            else {
                this.name = css; // => the same as path
            }
        }
        return FontAsset;
    }());
    exports.FontAsset = FontAsset;
    var MultiAsset = /** @class */ (function () {
        function MultiAsset(prefix, postfix, idStart, idEnd, name) {
            this.prefix = prefix;
            this.postfix = postfix;
            this.idStart = idStart;
            this.idEnd = idEnd;
            this.name = name;
        }
        MultiAsset.prototype.getAsset = function (id) {
            if (id >= this.idStart && id <= this.idEnd) {
                var assetPath = this.prefix + id + this.postfix;
                var assetName = this.getAssetName(id);
                return new Asset(assetPath, assetName);
            }
            else {
                return undefined;
            }
        };
        MultiAsset.prototype.getAssetName = function (id) {
            if (id >= this.idStart && id <= this.idEnd && this.name) {
                return this.name + '_' + id;
            }
            else {
                return undefined;
            }
        };
        MultiAsset.prototype.getRandomAsset = function () {
            return this.getAsset(this.getRandomAssetID());
        };
        MultiAsset.prototype.getRandomAssetID = function () {
            return (0, Random_1.randomIntBetween)(this.idStart, this.idEnd);
        };
        MultiAsset.prototype.getNumberOfIDs = function () {
            return this.idEnd - this.idStart + 1;
        };
        return MultiAsset;
    }());
    exports.MultiAsset = MultiAsset;
    var SharedAssetLoader = /** @class */ (function () {
        function SharedAssetLoader() {
            this.loader = new PIXI.Loader(); // you can also create your own if you want
        }
        SharedAssetLoader.prototype.get = function (asset) {
            return this.loader.resources[asset.name];
        };
        SharedAssetLoader.prototype.load = function (callback) {
            var _this = this;
            var assets = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                assets[_i - 1] = arguments[_i];
            }
            var fontsToLoad = assets.filter(function (asset) {
                return (asset instanceof FontAsset) && !SharedAssetLoader.fontMap.get(asset.name);
            });
            var assetsToLoad = Utils_1.Utils.mapNotNull(assets, function (asset) {
                var assetToLoad = null;
                if (asset == undefined || asset instanceof FontAsset) {
                    return null;
                }
                else {
                    assetToLoad = asset;
                }
                if (_this.get(assetToLoad)) {
                    console.log('asset found!');
                    return null;
                }
                else {
                    console.log('asset not found, loading ...');
                    return assetToLoad;
                }
            });
            var countToLoad = 1 + fontsToLoad.length;
            // check whether we have anything to load
            if ((assetsToLoad.length + fontsToLoad.length) == 0) {
                console.log('nothing to load.');
                callback();
                return;
            }
            fontsToLoad.forEach(function (font) {
                if (!SharedAssetLoader.fontMap.has(font.name)) {
                    SharedAssetLoader.fontMap.set(font.name, font);
                    WebFont.load({
                        inactive: function () {
                            console.warn('Font inactive');
                            countToLoad--;
                            if (countToLoad == 0) {
                                callback();
                            }
                        },
                        active: function () {
                            countToLoad--;
                            if (countToLoad == 0) {
                                callback();
                            }
                        },
                        custom: {
                            families: font.families,
                            urls: [font.css],
                        }
                    });
                }
                else {
                    countToLoad--;
                    if (countToLoad == 0) {
                        callback();
                    }
                }
            });
            assetsToLoad.forEach(function (asset) {
                if (asset) {
                    _this.loader.add(asset.name, asset.path);
                }
            });
            this.loader.load(function () {
                countToLoad--;
                if (countToLoad == 0) {
                    callback();
                }
            });
        };
        SharedAssetLoader.fontMap = new Map();
        return SharedAssetLoader;
    }());
    exports.SharedAssetLoader = SharedAssetLoader;
});
