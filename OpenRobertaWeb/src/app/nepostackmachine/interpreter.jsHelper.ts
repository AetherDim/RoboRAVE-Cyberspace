import { setPause } from 'simulation.simulation';
import * as Blockly from 'blockly';

//This file contains function which allow the interpreter to communicate with the simulation.

type SpecialBlocklyBlock = Blockly.Block & { svgGroup_: any, svgPath_: any }


export function getBlockById(id: string): SpecialBlocklyBlock {
	return Blockly.getMainWorkspace().getBlockById(id) as SpecialBlocklyBlock;
}

export function setSimBreak() {
	setPause()
}

export function getJqueryObject(object: JQuery.PlainObject) {
	return $(object)
}