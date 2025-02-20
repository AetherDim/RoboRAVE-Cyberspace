define(["require", "exports", "./Color", "./ScrollView", "./Utils", "./GlobalDebug", "./pixijs"], function (require, exports, Color_1, ScrollView_1, Utils_1, GlobalDebug_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SceneRender = void 0;
    // physics and graphics
    var SceneRender = /** @class */ (function () {
        function SceneRender(scene, canvas, robotSetupData, autoResizeTo) {
            var _this = this;
            this.onSwitchSceneEventHandler = [];
            var htmlCanvas = null;
            var resizeTo = null;
            var backgroundColor = $('#simDiv').css('background-color');
            if (canvas instanceof HTMLCanvasElement) {
                htmlCanvas = canvas;
            }
            else {
                htmlCanvas = document.getElementById(canvas);
            }
            if (autoResizeTo) {
                if (autoResizeTo instanceof HTMLElement) {
                    resizeTo = autoResizeTo;
                }
                else {
                    resizeTo = document.getElementById(autoResizeTo);
                }
            }
            this.resizeTo = resizeTo;
            // The application will create a renderer using WebGL, if possible,
            // with a fallback to a canvas render. It will also setup the ticker
            // and the root stage PIXI.Container
            this.app = new PIXI.Application({
                view: htmlCanvas,
                backgroundColor: (0, Color_1.rgbToNumber)(backgroundColor),
                antialias: true,
                resizeTo: resizeTo || undefined,
                autoDensity: true,
                resolution: Utils_1.Utils.getPixelRatio(),
                //forceCanvas: true
            });
            this.app.ticker.maxFPS = 30;
            // add mouse/touch control
            this.scrollView = new ScrollView_1.ScrollView(this.app.stage, this.app.renderer);
            this.scrollView.registerListener(function (ev) {
                if (_this.scene) {
                    _this.scene.interactionEvent(ev);
                }
            });
            if (!robotSetupData) {
                robotSetupData = [];
            }
            // switch to scene
            this.scene = scene;
            this.switchScene(robotSetupData, scene);
            this.app.ticker.add(function (dt) {
                if (_this.scene) {
                    _this.scene.renderTick(dt);
                    if (_this.resizeTo && (_this.app.view.clientWidth != _this.resizeTo.clientWidth ||
                        _this.app.view.clientHeight != _this.resizeTo.clientHeight)) {
                        //resize = true
                        var oldWidth = _this.app.renderer.screen.width;
                        var oldHeight = _this.app.renderer.screen.height;
                        //this.app.queueResize()
                        _this.app.resize();
                        _this.onResize(oldWidth, oldHeight);
                    }
                }
            }, this);
            (0, GlobalDebug_1.initGlobalSceneDebug)(this);
        }
        SceneRender.prototype.rendererPlugins = function () {
            return this.app.renderer.plugins;
        };
        SceneRender.prototype.destroy = function () {
            this.app.stop();
            this.app.destroy();
            this.scene.destroy();
        };
        SceneRender.prototype.onSwitchScene = function (onSwitchSceneHandler) {
            this.onSwitchSceneEventHandler.push(onSwitchSceneHandler);
        };
        SceneRender.prototype.onResize = function (oldWidth, oldHeight) {
            this.scrollView.x += (this.app.renderer.screen.width - oldWidth) / 2;
            this.scrollView.y += (this.app.renderer.screen.height - oldHeight) / 2;
            var zoomX = Math.max(this.app.renderer.screen.width, this.scrollView.minScreenSize.width) / Math.max(oldWidth, this.scrollView.minScreenSize.width);
            //const zoomY = Math.max(this.app.renderer.screen.height, this.scrollView.minScreenSize)/Math.max(oldHeight, this.scrollView.minScreenSize)
            this.scrollView.zoomCenter(zoomX);
        };
        SceneRender.prototype.getScene = function () {
            return this.scene;
        };
        // TODO: check this size
        SceneRender.prototype.getWidth = function () {
            return this.app.view.width;
        };
        SceneRender.prototype.getHeight = function () {
            return this.app.view.height;
        };
        // TODO: check this size
        SceneRender.prototype.getViewWidth = function () {
            return this.scrollView.getBounds().width;
        };
        SceneRender.prototype.getViewHeight = function () {
            return this.scrollView.getBounds().height;
        };
        // new 'convertToPixels' which has an additional resolution parameter
        SceneRender.prototype.newConvertToPixels = function (object, resolution) {
            if (resolution === void 0) { resolution = 1; }
            var renderer = this.app.renderer;
            renderer.clear();
            var bounds = object.getLocalBounds();
            var texture;
            if (false) {
                var region = new PIXI.Rectangle(0, 0, bounds.width * resolution, bounds.height * resolution);
                // minimum texture size is 1x1, 0x0 will throw an error
                // if (region.width === 0) region.width = 1;
                // if (region.height === 0) region.height = 1;
                var renderTexture = PIXI.RenderTexture.create({
                    width: region.width,
                    height: region.height
                });
                var _tempMatrix = new PIXI.Matrix();
                _tempMatrix.tx = -bounds.x;
                _tempMatrix.ty = -bounds.y;
                // _tempMatrix = _tempMatrix.scale(resolution, resolution)
                var displayObject = object;
                var transform = displayObject.transform;
                displayObject.transform = new PIXI.Transform();
                renderer.render(displayObject, renderTexture, false, _tempMatrix, !!displayObject.parent);
                displayObject.transform = transform;
                texture = renderTexture;
            }
            else {
                texture = this.app.renderer.generateTexture(object, PIXI.SCALE_MODES.LINEAR, resolution, new PIXI.Rectangle(0, 0, bounds.width * resolution, bounds.height * resolution));
            }
            renderer.renderTexture.bind(texture);
            var gl = renderer.gl;
            var array = new Uint8Array(4 * texture.width * texture.height);
            // images with alpha should be post divided!!!
            gl.readPixels(0, 0, texture.width, texture.height, gl.RGBA, gl.UNSIGNED_BYTE, array);
            var textureData = { data: array, width: texture.width, height: texture.height };
            texture.destroy();
            return textureData;
        };
        SceneRender.prototype.convertToPixels = function (object, resolution) {
            if (resolution === void 0) { resolution = 1; }
            var bounds = object.getLocalBounds();
            return { data: this.rendererPlugins().extract.pixels(object), width: bounds.width, height: bounds.height };
            // return { data: new Uint8Array(), width: 0, height: 0 }
        };
        SceneRender.prototype.zoomIn = function () {
            this.scrollView.zoomCenter(Math.sqrt(2));
        };
        SceneRender.prototype.zoomOut = function () {
            this.scrollView.zoomCenter(1 / Math.sqrt(2));
        };
        SceneRender.prototype.zoomReset = function () {
            // the scene should never be undefined!
            var size = this.scene.getSize();
            var origin = this.scene.getOrigin();
            this.scrollView.resetCentered(origin.x, origin.y, size.width, size.height);
        };
        SceneRender.prototype.switchScene = function (robotSetupData, scene, noLoad) {
            if (noLoad === void 0) { noLoad = false; }
            if (this.scene == scene) {
                return;
            }
            this.scene.pauseSim();
            this.scene.setSceneRenderer(robotSetupData, undefined); // unregister this renderer
            // remove all children from PIXI renderer
            if (this.scrollView.children.length > 0) {
                //Utils.log('Number of children: ' + this.scrollView.children.length);
                this.scrollView.removeChildren(0, this.scrollView.children.length);
            }
            this.scene = scene;
            scene.setSceneRenderer(robotSetupData, this, noLoad);
            this.onSwitchSceneEventHandler.forEach(function (handler) { return handler(scene); });
        };
        // TODO: remove before add? only add once?
        SceneRender.prototype.addDisplayable = function (displayable) {
            this.scrollView.addChild(displayable);
        };
        SceneRender.prototype.removeDisplayable = function (displayable) {
            this.scrollView.removeChild(displayable);
        };
        SceneRender.prototype.add = function (displayable) {
            this.scrollView.addChild(displayable);
        };
        SceneRender.prototype.remove = function (displayable) {
            this.scrollView.removeChild(displayable);
        };
        SceneRender.prototype.setSpeedUpFactor = function (speedup) {
            this.scene.setSpeedUpFactor(speedup);
        };
        return SceneRender;
    }());
    exports.SceneRender = SceneRender;
});
