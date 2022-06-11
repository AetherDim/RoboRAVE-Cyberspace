import { setPause } from 'simulation.simulation';
import * as Blockly from 'blockly';
import { SpecialBlocklyBlock } from './SpecialBlocklyBlock';

//This file contains function which allow the interpreter to communicate with the simulation.

export function getBlockById(id: string): SpecialBlocklyBlock | null {
	return Blockly.getMainWorkspace().getBlockById(id) as SpecialBlocklyBlock | null;
}

export function setSimBreak() {
	setPause()
}

export function getJqueryObject(object: JQuery.PlainObject) {
	return $(object)
}