import * as WebFont from 'webfontloader'
import './pixijs'
import {randomIntBetween} from "./Random";
import { Utils } from "./Utils"

export class Asset {

	constructor(path: string, name?: string) {
		this.path = path;
		if(name) {
			this.name = name;
		} else {
			this.name = path;
		}
	}

	readonly name: string;
	readonly path: string;
}

export class SpriteAsset extends Asset {

	readonly xScaling: number = 1;
	readonly yScaling: number = 1;

	constructor(path: string, name?: string, xScaling?: number, yScaling?: number) {
		super(path, name);

		if(xScaling) this.xScaling = xScaling;
		if(yScaling) this.yScaling = yScaling;
	}

	newSprite(): PIXI.Sprite {
		let sprite = new PIXI.Sprite(SharedAssetLoader.get(this).texture);
		sprite.scale.set(this.xScaling, this.yScaling);
		return sprite;
	}

}

export class FontAsset {

	readonly families: string[];
	readonly css: string;
	readonly name: string;

	constructor(css: string, families: string[], name?: string) {
		this.families = families;
		this.css = css;
		if(name) {
			this.name = name;
		} else {
			this.name = css; // => the same as path
		}
	}


}

export class MultiSpriteAsset {

	readonly xScaling: number = 1;
	readonly yScaling: number = 1;

	constructor(prefix: string, postfix: string, idStart: number, idEnd:number, name?: string, xScaling?: number, yScaling?: number) {
		this.prefix = prefix;
		this.postfix = postfix;
		this.idStart = idStart;
		this.idEnd = idEnd;
		this.name = name;

		if(xScaling) this.xScaling = xScaling;
		if(yScaling) this.yScaling = yScaling;
	}

	readonly prefix: string;
	readonly postfix: string;
	readonly idStart:number;
	readonly idEnd: number;
	readonly name?: string;

	getAsset(id: number): SpriteAsset | undefined {
		if(id >= this.idStart && id <= this.idEnd) {
			let assetPath = this.prefix + id + this.postfix;
			let assetName = this.getAssetName(id);
			return new SpriteAsset(assetPath, assetName, this.xScaling, this.yScaling);
		} else {
			return undefined;
		}

	}

	getAssetName(id: number): string | undefined {
		if(id >= this.idStart && id <= this.idEnd && this.name) {
			return this.name + '_' + id;
		} else {
			return undefined;
		}
	}

	getRandomAsset(): SpriteAsset | undefined {
		return this.getAsset(this.getRandomAssetID());
	}

	getRandomAssetID(): number {
		return randomIntBetween(this.idStart, this.idEnd);
	}

	getNumberOfIDs() {
		return this.idEnd - this.idStart + 1;
	}

}

export class SharedAssetLoader {

	private static readonly loader = new PIXI.Loader(); // you can also create your own if you want
	private static readonly fontMap = new Map<string, FontAsset>();

	static get(asset: Asset): PIXI.LoaderResource {
		return this.loader.resources[asset.name];
	}

	static load(callback:() => void, ...assets: (Asset|FontAsset|undefined)[]) {
		let fontsToLoad: FontAsset[] = <FontAsset[]>assets.filter(asset => {
			return (asset instanceof FontAsset) && !SharedAssetLoader.fontMap.get(asset.name);
		});

		const assetsToLoad = Utils.mapNotNull(assets, asset => {

			let assetToLoad: Asset | null = null;
			if(asset == undefined || asset instanceof FontAsset) {
				return null;
			} else {
				assetToLoad = asset;
			}

			if(this.get(assetToLoad)) {
				console.log('asset found!');
				return null;
			} else {
				console.log('asset not found, loading ...');
				return assetToLoad;
			}
		});

		let countToLoad = 1 + fontsToLoad.length;

		// check whether we have anything to load
		if((assetsToLoad.length + fontsToLoad.length) == 0) {
			console.log('nothing to load.')
			callback();
			return;
		}


		fontsToLoad.forEach(font => {
			if(!SharedAssetLoader.fontMap.has(font.name)) {
				SharedAssetLoader.fontMap.set(font.name, font);
				WebFont.load({
					inactive: () => {
						console.warn('Font inactive');
						countToLoad --;
						if(countToLoad == 0) {
							callback();
						}
					},
					active: () => {
						countToLoad --;
						if(countToLoad == 0) {
							callback();
						}
					},
					custom: {
						families: font.families,
						urls: [font.css],
					}
				});
			} else {
				countToLoad --;
				if(countToLoad == 0) {
					callback();
				}
			}
		});

		assetsToLoad.forEach(asset => {
			if(asset) {
				this.loader.add(asset.name, asset.path);
			}
		})

		this.loader.load(() => {
			countToLoad --;
			if(countToLoad == 0) {
				callback();
			}
		});
	}

}