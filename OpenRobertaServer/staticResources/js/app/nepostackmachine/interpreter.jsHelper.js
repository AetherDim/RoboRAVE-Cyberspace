define(["require", "exports", "blockly"], function (require, exports, Blockly) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getJqueryObject = exports.getBlockById = void 0;
    //This file contains function which allow the interpreter to communicate with the simulation.
    function getBlockById(id) {
        return Blockly.getMainWorkspace().getBlockById(id);
    }
    exports.getBlockById = getBlockById;
    function getJqueryObject(object) {
        return $(object);
    }
    exports.getJqueryObject = getJqueryObject;
});
