var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define(["require", "exports", "log", "guiState.controller", "neuralnetwork.ui", "jquery", "blockly", "jquery-validate"], function (require, exports, LOG, GUISTATE_C, NN_UI, $, Blockly) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mkNNfromNNStepDataAndRunNNEditor = exports.mkNNfromNNStepData = exports.saveNN2Blockly = exports.init = void 0;
    /**
     * initialize the callbacks needed by the NN tab. Called once at front end init time
     */
    function init() {
        $('#tabNN').onWrap('show.bs.tab', function (e) {
            GUISTATE_C.setView('tabNN');
        }, 'show tabNN');
        $('#tabNN').onWrap('shown.bs.tab', function (e) {
            GUISTATE_C.setProgramSaved(false);
            mkNNfromNNStepDataAndRunNNEditor();
        }, 'shown tabNN');
        $('#tabNN').onWrap('hide.bs.tab', function (e) {
            saveNN2Blockly();
        }, 'hide tabNN');
        $('#tabNN').onWrap('hidden.bs.tab', function (e) { }, 'hidden tabNN');
    }
    exports.init = init;
    /**
     * save the NN to the program XML. Called, when the NN editor or the program terminates.
     */
    function saveNN2Blockly() {
        var nnstepBlock = getTheNNstepBlock();
        if (nnstepBlock !== null) {
            nnstepBlock.data = NN_UI.getStateAsJSONString();
        }
    }
    exports.saveNN2Blockly = saveNN2Blockly;
    /**
     * create the NN from the program XML. Called, when the simulation starts
     */
    function mkNNfromNNStepData() {
        var nnStepBlock = getTheNNstepBlock();
        if (nnStepBlock) {
            if (nnStepBlock.data !== undefined && nnStepBlock.data !== null) {
                var nnStateAsJson = void 0;
                try {
                    nnStateAsJson = JSON.parse(nnStepBlock.data);
                }
                catch (e) {
                    nnStateAsJson = null;
                }
            }
            var inputNeurons = [];
            var outputNeurons = [];
            extractInputOutputNeurons(inputNeurons, outputNeurons, nnStepBlock.getChildren());
            NN_UI.setupNN(nnStateAsJson, inputNeurons, outputNeurons);
        }
        else {
            NN_UI.setupNN(null, [], []);
        }
    }
    exports.mkNNfromNNStepData = mkNNfromNNStepData;
    /**
     * create the NN from the program XML and start the NN editor. Called, when the NN tab is opened
     */
    function mkNNfromNNStepDataAndRunNNEditor() {
        mkNNfromNNStepData();
        NN_UI.runNNEditor();
    }
    exports.mkNNfromNNStepDataAndRunNNEditor = mkNNfromNNStepDataAndRunNNEditor;
    /**
     * @return the NNStep block from the program (blocks). Return null, if no block found.
     */
    function getTheNNstepBlock() {
        var e_1, _a;
        var nnstepBlock = null;
        try {
            for (var _b = __values(Blockly.Workspace.getByContainer('blocklyDiv').getAllBlocks()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var block = _c.value;
                if (block.type === 'robActions_NNstep') {
                    if (nnstepBlock) {
                        LOG.error('more than one NNstep block is invalid');
                    }
                    nnstepBlock = block;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return nnstepBlock;
    }
    /**
     * distribute the input/output neuron declaration of the NNStep stmt to three lists
     * @param inputNeurons inout parameter: filled with the names of the input neurons
     * @param outputNeurons inout parameter: filled with the names of the ouput neurons with vars
     * @param outputNeuronsWoVar inout parameter: filled with the names of ouput neurons without vars
     * @param neurons the sub-block list found in the NNStep block
     */
    function extractInputOutputNeurons(inputNeurons, outputNeurons, neurons) {
        var e_2, _a;
        try {
            for (var neurons_1 = __values(neurons), neurons_1_1 = neurons_1.next(); !neurons_1_1.done; neurons_1_1 = neurons_1.next()) {
                var block = neurons_1_1.value;
                if (block.type === 'robActions_inputneuron') {
                    inputNeurons.push(block.getFieldValue('NAME'));
                }
                else if (block.type === 'robActions_outputneuron' || block.type === 'robActions_outputneuron_wo_var') {
                    outputNeurons.push(block.getFieldValue('NAME'));
                }
                var next = block.getChildren();
                if (next) {
                    extractInputOutputNeurons(inputNeurons, outputNeurons, next);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (neurons_1_1 && !neurons_1_1.done && (_a = neurons_1.return)) _a.call(neurons_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
});
