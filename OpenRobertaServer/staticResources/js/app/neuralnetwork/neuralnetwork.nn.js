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
define(["require", "exports", "./neuralnetwork.helper", "./util"], function (require, exports, H, U) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Network = exports.Link = exports.Node = exports.NNumber = void 0;
    var NNumber = /** @class */ (function () {
        function NNumber() {
            this.operator = '*';
            this.asNumber = 0.0; // to be used in nn step evaluations
            this.normalizedUserInput = '0'; // to be used in the UI, export/import, ...
            this.separator = '.'; // either ',' or '.'
            this.isFraction = false;
        }
        NNumber.prototype.setAsNumber = function (number) {
            this.operator = '';
            this.asNumber = number;
            this.normalizedUserInput = String(number);
            this.separator = '.';
            this.isFraction = false;
        };
        NNumber.prototype.set = function (userInput) {
            userInput = userInput.trim();
            if (userInput.length == 0) {
                this.operator = '';
                this.asNumber = 0.0;
                this.normalizedUserInput = '0';
                this.separator = '.';
                this.isFraction = false;
                return;
            }
            this.operator = userInput.substr(0, 1);
            if (this.operator === '*' || this.operator === ':' || this.operator === '/') {
                userInput = userInput.substr(1);
                if (this.operator === '*') {
                    this.operator = '';
                }
            }
            else {
                this.operator = '';
            }
            this.asNumber = 0.0;
            if (userInput.indexOf('/') >= 0) {
                // with fraction --> no operators as '*', '/', ':'
                this.isFraction = true;
                this.operator = '';
                this.separator = '.';
                userInput = userInput.replace(NNumber.commaGlobal, '');
                userInput = userInput.replace(NNumber.pointGlobal, '');
                if (userInput.indexOf('-') >= 0) {
                    userInput = '-' + userInput.replace(NNumber.minusGlobal, '');
                }
                var parts = userInput.split('/');
                this.separator = '.';
                if (this.operator !== '' || parts.length !== 2) {
                    this.asNumber = 0.0;
                }
                else {
                    this.asNumber = +parts[0] / +parts[1];
                }
            }
            else {
                // no fraction --> separator can be '.' (e.g. english style) or ',' (e.g. german style)
                this.isFraction = false;
                this.separator = '.';
                if (userInput.indexOf('.') >= 0) {
                    userInput = userInput.replace(NNumber.commaGlobal, '');
                }
                else if (userInput.indexOf(',') >= 0) {
                    this.separator = ',';
                    userInput = userInput.replace(NNumber.pointGlobal, '');
                    userInput = userInput.replace(NNumber.commaGlobal, '.');
                }
                this.asNumber = +userInput;
            }
            if (isNaN(this.asNumber)) {
                this.asNumber = 0.0;
                this.normalizedUserInput = userInput;
                return;
            }
            this.normalizedUserInput = userInput;
            if (this.operator !== '') {
                this.asNumber = 1.0 / this.asNumber;
            }
        };
        NNumber.prototype.get = function () {
            return this.asNumber;
        };
        NNumber.prototype.getWoOp = function () {
            if (this.separator === ',') {
                return this.normalizedUserInput.replace(NNumber.pointGlobal, ',');
            }
            else {
                return this.normalizedUserInput;
            }
        };
        NNumber.prototype.hasFraction = function () {
            return this.isFraction;
        };
        NNumber.prototype.getOp = function () {
            return this.operator;
        };
        NNumber.prototype.getWithPrecision = function (precision, suppressMultOp) {
            var prefix = suppressMultOp && this.operator === '*' ? '' : this.operator;
            var suffix = precision === '*' || this.isFraction ? String(this.normalizedUserInput) : U.toFixedPrecision(this.normalizedUserInput, +precision);
            if (this.separator === ',') {
                suffix = suffix.replace(NNumber.pointGlobal, ',');
            }
            return prefix + suffix;
        };
        NNumber.commaGlobal = /,/g;
        NNumber.pointGlobal = /\./g;
        NNumber.minusGlobal = /-/g;
        return NNumber;
    }());
    exports.NNumber = NNumber;
    /**
     * A node in a neural network. Each node has a state
     * (total input, output, and their respectively derivatives) which changes
     * after every forward and back propagation run.
     */
    var Node = /** @class */ (function () {
        /**
         * Creates a new node with the provided id and activation function.
         */
        function Node(id, activation, initUntil) {
            this.inputLinks = [];
            this.bias = new NNumber();
            this.outputs = [];
            /** Error derivative with respect to this node's output. */
            this.outputDer = 0;
            /** Error derivative with respect to this node's total input. */
            this.inputDer = 0;
            /**
             * Accumulated error derivative with respect to this node's total input since
             * the last update. This derivative equals dE/db where b is the node's
             * bias term.
             */
            this.accInputDer = 0;
            /**
             * Number of accumulated err. derivatives with respect to the total input
             * since the last update.
             */
            this.numAccumulatedDers = 0;
            this.id = id;
            this.activation = activation;
            if (initUntil !== undefined && initUntil !== null) {
                this.bias.setAsNumber(initUntil * Math.random());
            }
        }
        /** Recomputes the node's output and returns it. */
        Node.prototype.updateOutput = function () {
            // Stores total input into the node.
            this.totalInput = this.bias.get();
            for (var j = 0; j < this.inputLinks.length; j++) {
                var link = this.inputLinks[j];
                this.totalInput += link.weight.get() * link.source.output;
            }
            this.output = this.activation.output(this.totalInput);
            return this.output;
        };
        Node.prototype.genMath = function (activationKey) {
            var biasIsZero = this.bias.get() === 0;
            var noInputLinks = this.inputLinks.length === 0;
            var isLinearActivation = activationKey === 'linear';
            var math = isLinearActivation ? '' : activationKey + '( ';
            if (noInputLinks) {
                math += this.bias.get();
                if (!isLinearActivation) {
                    math += ' )';
                }
                return math;
            }
            if (!biasIsZero) {
                math += this.bias.get();
            }
            var firstLink = biasIsZero;
            this.inputLinks.forEach(function (link) {
                var weight = link.weight;
                if (weight.get() !== 0) {
                    var op = weight.getOp();
                    var isPositive = weight.get() >= 0;
                    var source = link.source.id;
                    if (op === ':' || op === '/') {
                        if (isPositive) {
                            if (firstLink) {
                                firstLink = false;
                            }
                            else {
                                math += ' + ';
                            }
                            math += source + '/' + weight.getWoOp();
                        }
                        else {
                            if (firstLink) {
                                math += '0';
                                firstLink = false;
                            }
                            math += ' - ' + source + '/' + -weight.getWoOp();
                        }
                    }
                    else if (isPositive) {
                        if (firstLink) {
                            firstLink = false;
                        }
                        else {
                            math += ' + ';
                        }
                        math += weight.getWoOp() + '*' + source;
                    }
                    else {
                        if (firstLink) {
                            math += '0';
                            firstLink = false;
                        }
                        if (weight.hasFraction()) {
                            math += ' - ' + weight.getWoOp().substr(1) + '*' + source;
                        }
                        else {
                            math += ' - ' + -weight.getWoOp() + '*' + source;
                        }
                    }
                }
            });
            if (firstLink) {
                math += '0';
            }
            if (!isLinearActivation) {
                math += ' )';
            }
            return math;
        };
        return Node;
    }());
    exports.Node = Node;
    /**
     * A link in a neural network. Each link has a weight and a source and
     * destination node. Also it has an internal state (error derivative
     * with respect to a particular input) which gets updated after
     * a run of back propagation.
     */
    var Link = /** @class */ (function () {
        /**
         * Constructs a link in the neural network.
         *
         * @param source The source node.
         * @param dest The destination node.
         * @param regularization The regularization function that computes the
         *     penalty for this weight. If null, there will be no regularization.
         */
        function Link(source, dest, regularization, initUntil) {
            this.weight = new NNumber();
            this.isDead = false;
            /** Error derivative with respect to this weight. */
            this.errorDer = 0;
            /** Accumulated error derivative since the last update. */
            this.accErrorDer = 0;
            /** Number of accumulated derivatives since the last update. */
            this.numAccumulatedDers = 0;
            this.id = source.id + '-' + dest.id;
            this.source = source;
            this.dest = dest;
            this.regularization = regularization;
            if (initUntil !== undefined && initUntil !== null) {
                this.weight.setAsNumber(initUntil * Math.random());
            }
        }
        return Link;
    }());
    exports.Link = Link;
    var Network = /** @class */ (function () {
        /**
         * Builds a neural network from a given network shape
         *
         * @param networkShape The shape of the network. E.g. [1, 2, 3, 1] means
         *   the network will have one input node, 2 nodes in first hidden layer,
         *   3 nodes in second hidden layer and 1 output node.
         * @param activation The activation function of every hidden node.
         * @param outputActivation The activation function for the output nodes.
         * @param regularization The regularization function that computes a penalty
         *     for a given weight (parameter) in the network. If null, there will be
         *     no regularization.
         * @param inputIds List of ids for the input nodes.
         */
        function Network(state) {
            var shape = [state.numInputs].concat(state.networkShape).concat([state.numOutputs]);
            var numLayers = shape.length;
            var id = 1;
            /** List of layers, with each layer being a list of nodes. */
            var network = [];
            for (var layerIdx = 0; layerIdx < numLayers; layerIdx++) {
                var isOutputLayer = layerIdx === numLayers - 1;
                var isInputLayer = layerIdx === 0;
                var currentLayer = [];
                network.push(currentLayer);
                var numNodes = shape[layerIdx];
                for (var i = 0; i < numNodes; i++) {
                    var nodeName = isInputLayer ? state.inputs[i] : isOutputLayer ? state.outputs[i] : 'h' + layerIdx + 'n' + (i + 1);
                    var node = new Node(nodeName, state.activation);
                    currentLayer.push(node);
                    if (layerIdx >= 1) {
                        // Add links from nodes in the previous layer to this node.
                        for (var j = 0; j < network[layerIdx - 1].length; j++) {
                            var prevNode = network[layerIdx - 1][j];
                            var link = new Link(prevNode, node, state.regularization);
                            prevNode.outputs.push(link);
                            node.inputLinks.push(link);
                        }
                    }
                }
            }
            this.network = network;
            this.setWeightsFromArray(state.weights);
            this.setBiasFromArray(state.biases);
        }
        /**
         * Runs a forward propagation of the provided input through the provided
         * network. This method modifies the internal state of the network - the
         * total input and output of each node in the network.
         *
         * @param network The neural network.
         * @param inputs The input array. Its length should match the number of input
         *     nodes in the network.
         */
        Network.prototype.forwardProp = function (inputs) {
            var inputLayer = this.network[0];
            if (inputs.length !== inputLayer.length) {
                throw new Error('The number of inputs must match the number of nodes in' + ' the input layer');
            }
            // Update the input layer.
            for (var i = 0; i < inputLayer.length; i++) {
                var node = inputLayer[i];
                node.output = inputs[i];
            }
            for (var layerIdx = 1; layerIdx < this.network.length; layerIdx++) {
                var currentLayer = this.network[layerIdx];
                // Update all the nodes in this layer.
                for (var i = 0; i < currentLayer.length; i++) {
                    var node = currentLayer[i];
                    node.updateOutput();
                }
            }
        };
        /**
         * LEARNING: Runs a backward propagation using the provided target and the
         * computed output of the previous call to forward propagation.
         * This method modifies the internal state of the network - the error
         * derivatives with respect to each node, and each weight
         * in the network.
         */
        Network.prototype.backProp = function (target, errorFunc) {
            // The output node is a special case. We use the user-defined error
            // function for the derivative.
            var outputNode = this.network[this.network.length - 1][0];
            outputNode.outputDer = errorFunc.der(outputNode.output, target);
            // Go through the layers backwards.
            for (var layerIdx = this.network.length - 1; layerIdx >= 1; layerIdx--) {
                var currentLayer = this.network[layerIdx];
                // Compute the error derivative of each node with respect to:
                // 1) its total input
                // 2) each of its input weights.
                for (var i = 0; i < currentLayer.length; i++) {
                    var node = currentLayer[i];
                    node.inputDer = node.outputDer * node.activation.der(node.totalInput);
                    node.accInputDer += node.inputDer;
                    node.numAccumulatedDers++;
                }
                // Error derivative with respect to each weight coming into the node.
                for (var i = 0; i < currentLayer.length; i++) {
                    var node = currentLayer[i];
                    for (var j = 0; j < node.inputLinks.length; j++) {
                        var link = node.inputLinks[j];
                        if (link.isDead) {
                            continue;
                        }
                        link.errorDer = node.inputDer * link.source.output;
                        link.accErrorDer += link.errorDer;
                        link.numAccumulatedDers++;
                    }
                }
                if (layerIdx === 1) {
                    continue;
                }
                var prevLayer = this.network[layerIdx - 1];
                for (var i = 0; i < prevLayer.length; i++) {
                    var node = prevLayer[i];
                    // Compute the error derivative with respect to each node's output.
                    node.outputDer = 0;
                    for (var j = 0; j < node.outputs.length; j++) {
                        var output = node.outputs[j];
                        node.outputDer += output.weight.get() * output.dest.inputDer;
                    }
                }
            }
        };
        /**
         * LEARNING: Updates the weights of the network using the previously accumulated error
         * derivatives.
         */
        Network.prototype.updateWeights = function (learningRate, regularizationRate) {
            for (var layerIdx = 1; layerIdx < this.network.length; layerIdx++) {
                var currentLayer = this.network[layerIdx];
                for (var i = 0; i < currentLayer.length; i++) {
                    var node = currentLayer[i];
                    // Update the node's bias.
                    if (node.numAccumulatedDers > 0) {
                        node.bias.setAsNumber((learningRate * node.accInputDer) / node.numAccumulatedDers);
                        node.accInputDer = 0;
                        node.numAccumulatedDers = 0;
                    }
                    // Update the weights coming into this node.
                    for (var j = 0; j < node.inputLinks.length; j++) {
                        var link = node.inputLinks[j];
                        if (link.isDead) {
                            continue;
                        }
                        var weightAsNumber = link.weight.get();
                        var regulDer = link.regularization ? link.regularization.der(weightAsNumber) : 0;
                        if (link.numAccumulatedDers > 0) {
                            // Update the weight based on dE/dw.
                            weightAsNumber = weightAsNumber - (learningRate / link.numAccumulatedDers) * link.accErrorDer;
                            // Further update the weight based on regularization.
                            var newLinkWeight = weightAsNumber - learningRate * regularizationRate * regulDer;
                            if (link.regularization === H.RegularizationFunction.L1 && weightAsNumber * newLinkWeight < 0) {
                                // The weight crossed 0 due to the regularization term. Set it to 0.
                                link.weight.setAsNumber(0);
                                link.isDead = true;
                            }
                            else {
                                link.weight.setAsNumber(newLinkWeight);
                            }
                            link.accErrorDer = 0;
                            link.numAccumulatedDers = 0;
                        }
                    }
                }
            }
        };
        /** Iterates over every node in the network */
        Network.prototype.forEachNode = function (ignoreInputs, accessor) {
            for (var layerIdx = ignoreInputs ? 1 : 0; layerIdx < this.network.length; layerIdx++) {
                var currentLayer = this.network[layerIdx];
                for (var i = 0; i < currentLayer.length; i++) {
                    var node = currentLayer[i];
                    accessor(node);
                }
            }
        };
        /** Iterates over every link in the network/ */
        Network.prototype.forEachLink = function (accessor) {
            for (var layerIdx = 0; layerIdx < this.network.length; layerIdx++) {
                var currentLayer = this.network[layerIdx];
                for (var i = 0; i < currentLayer.length; i++) {
                    var node = currentLayer[i];
                    for (var j = 0; j < node.inputLinks.length; j++) {
                        var link = node.inputLinks[j];
                        accessor(link);
                    }
                }
            }
        };
        /**
         * return the representation of the network as array of arrays of Node-s. Should only be used when the network is rendered.
         */
        Network.prototype.getLayerAndNodeArray = function () {
            return this.network;
        };
        Network.prototype.getWeightArray = function () {
            var e_1, _a, e_2, _b, e_3, _c;
            var weightsAllLayers = [];
            if (this.network != null && this.network.length > 0) {
                try {
                    for (var _d = __values(this.network), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var layer = _e.value;
                        var weightsOneLayer = [];
                        try {
                            for (var layer_1 = (e_2 = void 0, __values(layer)), layer_1_1 = layer_1.next(); !layer_1_1.done; layer_1_1 = layer_1.next()) {
                                var node = layer_1_1.value;
                                var weightsOneNode = [];
                                try {
                                    for (var _f = (e_3 = void 0, __values(node.outputs)), _g = _f.next(); !_g.done; _g = _f.next()) {
                                        var link = _g.value;
                                        weightsOneNode.push(link.weight.getOp() + link.weight.getWoOp());
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                                weightsOneLayer.push(weightsOneNode);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (layer_1_1 && !layer_1_1.done && (_b = layer_1.return)) _b.call(layer_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        weightsAllLayers.push(weightsOneLayer);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return weightsAllLayers;
        };
        Network.prototype.getBiasArray = function () {
            var e_4, _a, e_5, _b;
            var biasesAllLayers = [];
            if (this.network != null && this.network.length > 0) {
                try {
                    for (var _c = __values(this.network), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var layer = _d.value;
                        var biasesOneLayer = [];
                        try {
                            for (var layer_2 = (e_5 = void 0, __values(layer)), layer_2_1 = layer_2.next(); !layer_2_1.done; layer_2_1 = layer_2.next()) {
                                var node = layer_2_1.value;
                                biasesOneLayer.push(node.bias.getOp() + node.bias.getWoOp());
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (layer_2_1 && !layer_2_1.done && (_b = layer_2.return)) _b.call(layer_2);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        biasesAllLayers.push(biasesOneLayer);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
            return biasesAllLayers;
        };
        Network.prototype.getOutputNeuronVal = function (id) {
            var node = this.getNeuronById(id);
            return node != null ? node.output : 0;
        };
        /**
         * one step of the neural network. Called from the simulation
         * @param inputData array of values for the input neurons
         * @return the array of values for the output neurons WITH variables
         */
        Network.prototype.oneStep = function (inputData) {
            this.forwardProp(inputData);
            var outputData = [];
            var outputs = this.network[this.network.length - 1];
            for (var j = 0; j < outputs.length; j++) {
                var node = outputs[j];
                outputData.push(node.output);
            }
            return outputData;
        };
        /**
         * finds a link and updates its weight. Called from the simulation
         * @param from id of the source of the link
         * @param to id of the target of the link
         * @param change either 'SET' or 'INCR'
         * @param value update for the weight
         */
        Network.prototype.changeWeight = function (from, to, change, value) {
            var fromNode = this.getNeuronById(from);
            if (fromNode != null) {
                for (var i = 0; i < fromNode.outputs.length; i++) {
                    var link = fromNode.outputs[i];
                    if (link.dest.id === to) {
                        var newVal = change === 'SET' ? value : link.weight.get() + value;
                        link.weight.setAsNumber(newVal);
                        return;
                    }
                }
            }
        };
        /**
         * finds a node and updates its bias. Called from the simulation
         * @param id id of the node
         * @param change either 'SET' or 'INCR'
         * @param value update for the bias
         */
        Network.prototype.changeBias = function (id, change, value) {
            var node = this.getNeuronById(id);
            if (node != null) {
                var newBias = change === 'SET' ? value : node.bias.get() + value;
                node.bias.setAsNumber(newBias);
                return;
            }
        };
        Network.prototype.getNeuronById = function (id) {
            if (this.network != null && this.network.length > 0) {
                for (var i = 0; i < this.network.length; i += 1) {
                    var layer = this.network[i];
                    if (layer == null) {
                        break;
                    }
                    for (var j = 0; j < layer.length; j += 1) {
                        var node = layer[j];
                        if (node.id === id) {
                            return node;
                        }
                    }
                }
            }
            return null;
        };
        Network.prototype.setWeightsFromArray = function (weightsAllLayers) {
            if (this.network != null && this.network.length > 0 && weightsAllLayers != null) {
                for (var i = 0; i < weightsAllLayers.length && i < this.network.length; i += 1) {
                    var layer = this.network[i];
                    var layerWeight = weightsAllLayers[i];
                    if (layer == null || layerWeight == null) {
                        break;
                    }
                    for (var j = 0; j < layerWeight.length && j < layer.length; j += 1) {
                        var node = layer[j];
                        var nodeWeight = layerWeight[j];
                        if (node == null || nodeWeight == null) {
                            break;
                        }
                        for (var k = 0; k < nodeWeight.length && k < node.outputs.length; k += 1) {
                            var link = node.outputs[k];
                            var weight = nodeWeight[k];
                            if (link == null || weight == null) {
                                break;
                            }
                            link.weight.set(weight);
                        }
                    }
                }
            }
        };
        Network.prototype.setBiasFromArray = function (biasesAllLayers) {
            if (this.network != null && this.network.length > 0 && biasesAllLayers != null) {
                for (var i = 0; i < biasesAllLayers.length && i < this.network.length; i += 1) {
                    var layer = this.network[i];
                    var layerBiases = biasesAllLayers[i];
                    if (layer == null || layerBiases == null) {
                        break;
                    }
                    for (var j = 0; j < layerBiases.length && j < layer.length; j += 1) {
                        var node = layer[j];
                        var bias = layerBiases[j];
                        if (node == null || bias == null) {
                            break;
                        }
                        node.bias.set(bias);
                    }
                }
            }
        };
        return Network;
    }());
    exports.Network = Network;
});
