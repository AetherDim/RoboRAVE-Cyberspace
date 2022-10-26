import {Asset, MultiAsset, FontAsset, SpriteAsset} from '../SharedAssetLoader';

export const RRC_ASSET_PATH = 'assets/roborave/';

class RRCAsset extends Asset {
	constructor(path: string, name?: string) {
		super(RRC_ASSET_PATH + path, name);
	}
}

class RRCSpriteAsset extends SpriteAsset {
	constructor(path: string, name?: string, xScaling?: number, yScaling?: number) {
		super(RRC_ASSET_PATH + path, name, xScaling, yScaling);
	}
}

class RRCFontAsset extends FontAsset {
	constructor(css: string, families: string[], name?: string) {
		super(RRC_ASSET_PATH + css, families, name);
	}
}

class RRCMultiAsset extends MultiAsset {
	constructor(prefix: string, postfix: string, idStart: number, idEnd:number, name?: string) {
		super(RRC_ASSET_PATH + prefix, postfix, idStart, idEnd, name);
	}
}

export const BLANK_BACKGROUND = new RRCSpriteAsset('blank.svg');
export const GOAL_BACKGROUND = new RRCSpriteAsset('goal.svg');

export const PROGGY_TINY_FONT = new RRCFontAsset('fonts/ProggyTiny.css', ['ProggyTiny']);

// Labyrinth
export const LABYRINTH_BLANK_BACKGROUND_ES = new RRCSpriteAsset('labyrinth/es/labyrinth.svg');
export const LABYRINTH_BLANK_BACKGROUND_MS = new RRCSpriteAsset('labyrinth/ms/labyrinth.svg');
export const LABYRINTH_BLANK_BACKGROUND_HS = new RRCSpriteAsset('labyrinth/hs/labyrinth.svg');

// line-following
export const LINE_FOLLOWING_BACKGROUND_ES = new RRCSpriteAsset('line-following/es/linefollowing.jpeg', undefined, 0.25, 0.25);
export const LINE_FOLLOWING_BACKGROUND_MS = new RRCSpriteAsset('line-following/ms/linefollowing.jpeg', undefined, 0.25, 0.25);
export const LINE_FOLLOWING_BACKGROUND_HS = new RRCSpriteAsset('line-following/hs/linefollowing.jpeg', undefined, 0.25, 0.25);

// rainbow
export const RAINBOW_BACKGROUND_ES_DINO = new RRCSpriteAsset('rainbow/es/dino.svg');
export const RAINBOW_BACKGROUND_ES = new RRCSpriteAsset('rainbow/es/rainbow.svg');

export const RAINBOW_BACKGROUND_MS_DINO = new RRCMultiAsset('rainbow/ms/dino_', '.svg', 0, 23);
export const RAINBOW_BACKGROUND_MS_SPACE_INVADERS = new RRCMultiAsset('rainbow/ms/rainbow_', '.svg', 0, 23);

export const RAINBOW_BACKGROUND_HS_SPACE_INVADERS = new RRCMultiAsset('rainbow/hs/space_invaders_', '.svg', 0, 719);