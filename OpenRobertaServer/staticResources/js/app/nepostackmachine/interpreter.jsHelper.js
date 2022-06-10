define(["require", "exports", "simulation.simulation", "blockly"], function (require, exports, simulation_simulation_1, Blockly) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getJqueryObject = exports.setSimBreak = exports.getBlockById = void 0;
    function getBlockById(id) {
        return Blockly.getMainWorkspace().getBlockById(id);
    }
    exports.getBlockById = getBlockById;
    function setSimBreak() {
        (0, simulation_simulation_1.setPause)();
    }
    exports.setSimBreak = setSimBreak;
    function getJqueryObject(object) {
        return $(object);
    }
    exports.getJqueryObject = getJqueryObject;
});
