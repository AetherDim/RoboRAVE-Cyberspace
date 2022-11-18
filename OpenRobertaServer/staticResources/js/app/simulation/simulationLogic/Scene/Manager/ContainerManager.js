define(["require", "exports", "../../Utils"], function (require, exports, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContainerManager = void 0;
    var ContainerManager = /** @class */ (function () {
        function ContainerManager(scene) {
            /**
             * layer 0: ground
             */
            this.groundContainer = new PIXI.Container();
            /**
             * z-index for PIXI, this will define the rendering layer
             */
            this.groundContainerZ = 0;
            /**
             * layer 1: ground animation
             */
            this.groundAnimationContainer = new PIXI.Container();
            /**
             * z-index for PIXI, this will define the rendering layer
             */
            this.groundAnimationContainerZ = 10;
            /**
             * layer 2: entity bottom layer (shadows/effects/...)
             */
            this.entityBottomContainer = new PIXI.Container();
            /**
             * z-index for PIXI, this will define the rendering layer
             */
            this.entityBottomContainerZ = 20;
            /**
             * layer 3: physics/other things <- robots
             */
            this.entityContainer = new PIXI.Container();
            /**
             * z-index for PIXI, this will define the rendering layer
             */
            this.entityContainerZ = 30;
            /**
             * layer 4: for entity descriptions/effects
             */
            this.entityTopContainer = new PIXI.Container();
            /**
             * z-index for PIXI, this will define the rendering layer
             */
            this.entityTopContainerZ = 40;
            /**
             * layer 5: top/text/menus
             */
            this.topContainer = new PIXI.Container();
            this.topContainerZ = 50;
            this.containerList = [
                this.groundContainer,
                this.groundAnimationContainer,
                this.entityBottomContainer,
                this.entityContainer,
                this.entityTopContainer,
                this.topContainer
            ];
            this.pixelData = new Uint8Array();
            this.getGroundImageData = this._initialGroundDataFunction;
            this.scene = scene;
            // setup graphic containers
            this.setupContainers();
        }
        ContainerManager.prototype.setupContainers = function () {
            this.groundContainer.zIndex = this.groundContainerZ;
            this.groundAnimationContainer.zIndex = this.groundAnimationContainerZ;
            this.entityBottomContainer.zIndex = this.entityBottomContainerZ;
            this.entityContainer.zIndex = this.entityContainerZ;
            this.entityTopContainer.zIndex = this.entityTopContainerZ;
            this.topContainer.zIndex = this.topContainerZ;
        };
        ContainerManager.prototype.registerToEngine = function () {
            var renderer = this.scene.getRenderer();
            if (!renderer) {
                console.warn('No renderer to register containers to!');
                return;
            }
            this.containerList.forEach(function (container) {
                renderer.add(container);
            });
        };
        ContainerManager.prototype.setVisibility = function (visible) {
            this.containerList.forEach(function (container) {
                container.visible = visible;
            });
        };
        //protected removeTexturesOnUnload = true;
        //protected removeBaseTexturesOnUnload = true;
        ContainerManager.prototype.recursiveDestroySomeObjects = function (displayObject) {
            var _this = this;
            // Destroy all 'PIXI.Text' objects in order to prevent a large memory leak
            // Note: Do not reuse 'PIXI.Text' objects for this reason
            //
            // maybe also destroy 'PIXI.Graphics' since it could be a minor memory leak
            if (displayObject instanceof PIXI.Text) { // || displayObject instanceof PIXI.Graphics) {
                displayObject.destroy(true);
            }
            else if (displayObject instanceof PIXI.Container) {
                displayObject.children.slice().forEach(function (c) { return _this.recursiveDestroySomeObjects(c); });
            }
        };
        ContainerManager.prototype.clearContainer = function (container) {
            this.recursiveDestroySomeObjects(container);
            container.removeChildren();
        };
        ContainerManager.prototype._initialGroundDataFunction = function (x, y, w, h) {
            this.updateGroundImageDataFunction();
            return this.getGroundImageData(x, y, w, h); // very hacky
        };
        ContainerManager.prototype.resetGroundDataFunction = function () {
            this.getGroundImageData = this._initialGroundDataFunction;
        };
        ContainerManager.prototype._getPixelData = function () {
            return this.pixelData;
        };
        ContainerManager.prototype.updateGroundImageDataFunction = function () {
            var _a;
            Utils_1.Utils.log('init color sensor texture');
            var groundVisible = this.groundContainer.visible;
            this.groundContainer.visible = true; // the container needs to be visible for this to work
            var bounds = this.groundContainer.getLocalBounds();
            var width = this.groundContainer.width;
            var height = this.groundContainer.height;
            var resolution = 1;
            // TODO: Test performance of color change of raw pixel data
            // this.groundContainer.removeChild(...this.groundContainer.children.filter(c => c.name == "My Texture"))
            var textureData = (_a = this.scene.getRenderer()) === null || _a === void 0 ? void 0 : _a.convertToPixels(this.groundContainer, resolution);
            if (textureData != undefined) {
                var pixelData_1 = textureData.data;
                this.pixelData = pixelData_1;
                Utils_1.Utils.log("Ground container pixels checksum of " + this.scene.name + ": " + Utils_1.Utils.checksumFNV32(pixelData_1));
                // console.time("change array colors")
                // const w = Math.round(width)
                // for (let x = 0; x < textureData.width; x++) {
                // 	for (let y = 0; y < textureData.height; y++) {
                // 		const index = 4 * (x + y * width)
                // 		const r = this.pixelData[index]
                // 		if (r > 100) {
                // 			// this.pixelData.set([0], index)
                // 			//this.pixelData[index] = 0
                // 		}
                // 	}
                // }
                // console.timeEnd("change array colors")
                // console.time("Make sprite")
                // const texture = PIXI.Texture.fromBuffer(this.pixelData, textureData.width, textureData.height)
                // const sprite = new PIXI.Sprite(texture)
                // sprite.name = "My Texture"
                // sprite.scale.set(1/resolution, 1/resolution)
                // this.groundContainer.addChild(sprite)
                // console.timeEnd("Make sprite")
                this.getGroundImageData = function (x, y, w, h) {
                    var newX = x - bounds.x;
                    var newY = y - bounds.y;
                    var index = (Math.round(newX) + Math.round(newY) * Math.round(width)) * 4;
                    if (0 <= newX && newX <= width &&
                        0 <= newY && newY <= height &&
                        0 <= index && index + 3 < pixelData_1.length) {
                        return [pixelData_1[index], pixelData_1[index + 1], pixelData_1[index + 2], pixelData_1[index + 3]];
                    }
                    else {
                        return [0, 0, 0, 0];
                    }
                };
            }
            this.groundContainer.visible = groundVisible;
        };
        /**
         * CLear all containers
         */
        ContainerManager.prototype.clear = function () {
            var _this = this;
            this.containerList.forEach(function (container) {
                _this.clearContainer(container);
            });
        };
        return ContainerManager;
    }());
    exports.ContainerManager = ContainerManager;
});
