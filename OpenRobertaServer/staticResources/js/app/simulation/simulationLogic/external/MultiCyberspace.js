var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
define(["require", "exports", "../Cyberspace/Cyberspace", "../GlobalDebug", "../Robot/RobotProgramGenerator", "../UI/UIManager", "../Utils", "./SceneDesciptorList", "./RESTApi", "../program.model", "../guiState.model", "../RRC/Scene/RRCScoreScene", "../KeyManager"], function (require, exports, Cyberspace_1, GlobalDebug_1, RobotProgramGenerator_1, UIManager_1, Utils_1, SceneDesciptorList_1, RESTApi_1, PROGRAM_MODEL, GUISTATE_MODEL, RRCScoreScene_1, KeyManager_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initEvents = exports.init = void 0;
    var cyberspaces = [];
    (0, GlobalDebug_1.initGlobalDebug)();
    KeyManager_1.KeyManager.setup();
    var simDiv = document.getElementById("simDiv");
    if (simDiv == null) {
        console.error("There is no 'simDiv' element.");
    }
    var multiCyberspaceDiv = document.createElement("div");
    multiCyberspaceDiv.style.backgroundColor = "rgb(50, 50, 50)";
    multiCyberspaceDiv.style.width = "100%";
    multiCyberspaceDiv.style.height = "100%";
    simDiv.appendChild(multiCyberspaceDiv);
    //simDiv.style.backgroundColor = "black"
    var sceneDescriptors = SceneDesciptorList_1.cyberspaceScenes;
    var CyberspaceData = /** @class */ (function () {
        function CyberspaceData(cyberspace, divElement) {
            this.cyberspace = cyberspace;
            this.divElement = divElement;
        }
        return CyberspaceData;
    }());
    function everyScoreSceneIsFinished() {
        return cyberspaces.every(function (c) {
            var scene = c.getScene();
            if (scene instanceof RRCScoreScene_1.RRCScoreScene) {
                return scene.getRobotManager().allProgramsTerminated();
            }
            else {
                return true;
            }
        });
    }
    function setCSSnoUserDragAndSelect(style) {
        // no text selection
        // see https://stackoverflow.com/questions/3779534/how-do-i-disable-text-selection-with-css-or-javascript
        style.setProperty("-webkit-touch-callout", "none"); /* iOS Safari */
        style.setProperty("-webkit-user-select", "none"); /* Safari */
        style.setProperty("-khtml-user-select", "none"); /* Konqueror HTML */
        style.setProperty("-moz-user-select", "none"); /* Firefox */
        style.setProperty("-ms-user-select", "none"); /* Internet Explorer/Edge */
        style.setProperty("user-select", "none"); /* Non-prefixed version, currently supported by Chrome and Opera */
        // no text dragging
        style.setProperty("user-drag", "none");
        style.setProperty("-webkit-user-drag", "none");
    }
    function scoreSceneAddEventHandler(scoreScene, groupName, programID, secretKey, groupNameStyle, disqualifyButton) {
        disqualifyButton.hidden = false;
        var isDisqualified = false;
        function updateButtonColor() {
            var color = isDisqualified ?
                (disqualifyButton.disabled ? "rgb(200, 0, 0)" : "red") :
                (disqualifyButton.disabled ? "rgb(200, 200, 200)" : "white");
            disqualifyButton.style.backgroundColor = color;
        }
        disqualifyButton.onclick = function () {
            isDisqualified = !isDisqualified;
            disqualifyButton.childNodes[0].remove();
            disqualifyButton.append(isDisqualified ? "Requalify" : "Disqualify");
            updateButtonColor();
        };
        var didSendSetScoreRequest = false;
        function onScoreRequestError() {
            didSendSetScoreRequest = false;
            disqualifyButton.disabled = false;
            groupNameStyle.backgroundColor = "red";
            updateButtonColor();
        }
        scoreScene.scoreEventManager.onShowHideScore(function (state) {
            var _a;
            if (state == "showScore") {
                scoreScene.pauseSim();
            }
            if (state == "showScore" && everyScoreSceneIsFinished()) {
                UIManager_1.UIManager.showScoreButton.setState("hideScore");
                UIManager_1.UIManager.physicsSimControlButton.setState("start");
            }
            if (state == "showScore" && !didSendSetScoreRequest) {
                if (programID == undefined) {
                    return;
                }
                didSendSetScoreRequest = true;
                disqualifyButton.disabled = true;
                updateButtonColor();
                // maximum signed int32 (2^32 - 1)
                // https://dev.mysql.com/doc/refman/5.6/en/integer-types.html
                var maxTime = 2147483647;
                var score = Math.round(scoreScene.score * 1000);
                var time = Math.round((_a = Utils_1.Utils.flatMapOptional(scoreScene.getProgramRuntime(), function (runtime) { return runtime * 1000; })) !== null && _a !== void 0 ? _a : maxTime);
                var comment = "";
                if (isDisqualified) {
                    groupNameStyle.backgroundColor = "red";
                    score = 0;
                    time = maxTime;
                    comment = "This program is disqualified";
                }
                (0, RESTApi_1.sendSetScoreRequest)({
                    secret: { secret: secretKey },
                    programID: programID,
                    score: score,
                    time: time,
                    comment: comment,
                    modifiedBy: scoreScene.name + " " + new Date(),
                }, function (result) {
                    if (!result) {
                        alert("Score set for team ".concat(groupName, " request failed"));
                        onScoreRequestError();
                        return;
                    }
                    if (result.error != RESTApi_1.ResultErrorType.NONE) {
                        alert(result.message);
                        onScoreRequestError();
                        return;
                    }
                    groupNameStyle.backgroundColor = "rgb(0, 200, 0)";
                    console.log("Score for team ".concat(groupName, " [ID: ").concat(programID, "] successfully sent"));
                });
            }
        });
    }
    function createCyberspaceData(sceneID, groupName, programID, secretKey) {
        var canvas = document.createElement("canvas");
        var cyberspaceDiv = document.createElement("div");
        setCSSnoUserDragAndSelect(cyberspaceDiv.style);
        cyberspaceDiv.appendChild(canvas);
        var groupNameDiv = document.createElement("div");
        groupNameDiv.style.position = "absolute";
        groupNameDiv.style.top = "2";
        groupNameDiv.style.left = "2";
        groupNameDiv.style.pointerEvents = "none";
        groupNameDiv.style.zIndex = "100"; // above the canvas
        var groupNameParagraph = document.createElement("p");
        groupNameParagraph.textContent = groupName;
        groupNameDiv.appendChild(groupNameParagraph);
        var paragraphStyle = groupNameParagraph.style;
        paragraphStyle.display = "inline";
        paragraphStyle.backgroundColor = "white";
        paragraphStyle.borderRadius = "5px";
        paragraphStyle.fontSize = "20";
        paragraphStyle.paddingLeft = "3";
        paragraphStyle.paddingRight = "3";
        cyberspaceDiv.appendChild(groupNameDiv);
        var disqualifyButton = document.createElement("button");
        disqualifyButton.append("Disqualify");
        disqualifyButton.hidden = true;
        var disqualifyButtonStyle = disqualifyButton.style;
        disqualifyButtonStyle.position = "absolute";
        disqualifyButtonStyle.top = "2";
        disqualifyButtonStyle.right = "2";
        disqualifyButtonStyle.border = "none";
        disqualifyButtonStyle.borderRadius = "5px";
        disqualifyButtonStyle.backgroundColor = "white";
        cyberspaceDiv.append(disqualifyButton);
        var cyberspace = new Cyberspace_1.Cyberspace(canvas, cyberspaceDiv, sceneDescriptors);
        cyberspace.specializedEventManager
            .addEventHandlerSetter(RRCScoreScene_1.RRCScoreScene, function (scoreScene) { return scoreSceneAddEventHandler(scoreScene, groupName, programID, secretKey, paragraphStyle, disqualifyButton); });
        cyberspace.loadScene(sceneID);
        return new CyberspaceData(cyberspace, cyberspaceDiv);
    }
    function setGridStyle(gridElements, opt) {
        var _a;
        var relativePadding = (_a = opt === null || opt === void 0 ? void 0 : opt.relativePadding) !== null && _a !== void 0 ? _a : 0;
        var heightCount = gridElements.length;
        var height = (100 - relativePadding) / heightCount;
        var heightStr = String(height - relativePadding) + "%";
        for (var y = 0; y < heightCount; y++) {
            var widthCount = gridElements[y].length;
            var width = (100 - relativePadding) / widthCount;
            var widthStr = String(width - relativePadding) + "%";
            var topStr = String(y * height + relativePadding) + "%";
            for (var x = 0; x < widthCount; x++) {
                var style = gridElements[y][x].style;
                style.left = String(x * width + relativePadding) + "%";
                style.top = topStr;
                style.width = widthStr;
                style.height = heightStr;
                style.position = "absolute";
            }
        }
    }
    var sceneCount = 4;
    var aspectRatio = {
        window: 16 / 9,
        scene: 16 / 9
    };
    var debug = GlobalDebug_1.DebugGuiRoot;
    if (debug != undefined) {
        var secretKey_1 = "";
        debug.addButton("Reset and close debug GUI", function () {
            loadScenes(generateRandomMultiSetupData(sceneCount), secretKey_1);
            GlobalDebug_1.DebugGuiRoot === null || GlobalDebug_1.DebugGuiRoot === void 0 ? void 0 : GlobalDebug_1.DebugGuiRoot.close();
        });
        debug.addButton("Reset", function () {
            loadScenes(generateRandomMultiSetupData(sceneCount), secretKey_1);
        });
    }
    function generateDebugRobertaRobotSetupData(count) {
        return Utils_1.Utils.range(0, count).map(function (index) {
            return {
                configuration: {
                    TRACKWIDTH: 18,
                    WHEELDIAMETER: 5.6,
                    SENSORS: {
                        "1": "TOUCH",
                        "3": "COLOR"
                    }
                },
                javaScriptProgram: RobotProgramGenerator_1.RobotProgramGenerator.generateProgram([
                    RobotProgramGenerator_1.RobotProgramGenerator.driveForwardOpCodes(100, 0.1 * index + 0.1)
                ]).javaScriptProgram
            };
        });
    }
    function convertProgramURI(programURI) {
        // old style queries
        var target = decodeURI(programURI).split("&&");
        if (target[0].endsWith("#loadProgram") && target.length >= 4) {
            return {
                robotType: target[1],
                programName: target[2],
                programXML: target[3]
            };
        }
        else {
            console.error("Invalid program");
        }
        return undefined;
    }
    function loadProgramFromXML(name, xml, callback) {
        if (xml.search("<export") === -1) {
            xml = '<export xmlns="http://de.fhg.iais.roberta.blockly"><program>' + xml + '</program><config>' + GUISTATE_MODEL.getConfigurationXML()
                + '</config></export>';
        }
        PROGRAM_MODEL.loadProgramFromXML(name, xml, function (result) {
            if (result.rc !== "ok") {
                alert('Server did not successfully convert program!');
                return;
            }
            var isNamedConfig = false;
            var configName = undefined;
            var language = GUISTATE_MODEL.gui.language;
            PROGRAM_MODEL.runInSim(result.programName, configName, result.progXML, result.confXML, language, function (result) {
                if (result.rc == "ok") {
                    try {
                        callback(result);
                        //SIM.init([result], true, GUISTATE_MODEL.gui.robotGroup);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else {
                    alert('Unable to process program for simulation!');
                }
            });
        });
    }
    function loadScenesFromRequest(result, secretKey) {
        if (!result) {
            alert("Program request failed");
            return;
        }
        if (result.error != RESTApi_1.ResultErrorType.NONE) {
            alert(result.message);
            return;
        }
        var res = result.result;
        if (res) {
            var map_1 = new Map();
            var programCount_1 = res.length;
            res.forEach(function (robotProgramEntry, index) {
                var programURI = robotProgramEntry.program;
                var decodedProgramURI = convertProgramURI(programURI);
                if (decodedProgramURI == undefined) {
                    programCount_1 -= 1;
                    return;
                }
                // TODO: Use other parameters
                var programXML = decodedProgramURI.programXML;
                loadProgramFromXML(decodedProgramURI.programName, programXML, function (setupData) {
                    map_1.set(index, setupData);
                    if (map_1.size == programCount_1) {
                        // if all programs are converted
                        var setupDataList = Utils_1.Utils.mapNotNull(Utils_1.Utils.range(0, map_1.size), function (i) {
                            var ageGroup = String(res[i].agegroup);
                            var challenge = String(res[i].challenge);
                            var programID = res[i].id;
                            if (Object.keys(SceneDesciptorList_1.sceneIDMap).includes(challenge)) {
                                var groups = SceneDesciptorList_1.sceneIDMap[challenge];
                                if (Object.keys(groups).includes(ageGroup)) {
                                    return {
                                        sceneID: groups[ageGroup],
                                        groupName: res[i].name,
                                        robertaRobotSetupData: map_1.get(i),
                                        programID: programID
                                    };
                                }
                                else {
                                    console.error('Unknown age group ID !!!');
                                }
                            }
                            else {
                                console.error('Unknown challenge ID !!!');
                            }
                            return undefined;
                        });
                        loadScenes(setupDataList, secretKey);
                    }
                });
            });
        }
        else {
            console.error("No result for programs request");
        }
    }
    function generateRandomMultiSetupData(count) {
        return generateDebugRobertaRobotSetupData(count).map(function (robertaRobotSetupData, index) {
            return {
                sceneID: Utils_1.Utils.randomElement(SceneDesciptorList_1.cyberspaceScenes).ID,
                groupName: "Test group " + index,
                robertaRobotSetupData: robertaRobotSetupData,
                programID: index
            };
        });
    }
    function startPrograms() {
        cyberspaces.forEach(function (cyberspace) { return cyberspace.startPrograms(); });
    }
    function loadScenes(setupDataList, secretKey) {
        var _a;
        // clear complete debug
        (0, GlobalDebug_1.clearDebugGuiRoot)();
        // add my debug
        var debug = GlobalDebug_1.DebugGuiRoot;
        if (debug != undefined) {
            debug.addButton("Add scene", function () {
                sceneCount += 1;
                loadScenes(generateRandomMultiSetupData(sceneCount), secretKey);
            });
            debug.addButton("Remove scene", function () {
                if (sceneCount > 0) {
                    sceneCount -= 1;
                    loadScenes(generateRandomMultiSetupData(sceneCount), secretKey);
                }
            });
            debug.addButton("Reload", function () {
                loadScenes(generateRandomMultiSetupData(sceneCount), secretKey);
            });
            debug.addButton("Start programs", function () {
                startPrograms();
            });
            debug.add(aspectRatio, "window", 0.1, 2);
            debug.add(aspectRatio, "scene", 0.1, 2);
        }
        var cyberspaceDataList = setupDataList.map(function (setupData) {
            var cyberspaceData = createCyberspaceData(setupData.sceneID, setupData.groupName, setupData.programID, secretKey);
            cyberspaceData.cyberspace.getScene().runAfterLoading(function () {
                cyberspaceData.cyberspace.setRobertaRobotSetupData([setupData.robertaRobotSetupData], ""); // TODO: Robot type???
            });
            return cyberspaceData;
        });
        var divElements = cyberspaceDataList.map(function (data) { return data.divElement; });
        // remove all cyberspace div nodes
        while (multiCyberspaceDiv.hasChildNodes()) {
            (_a = multiCyberspaceDiv.lastChild) === null || _a === void 0 ? void 0 : _a.remove();
        }
        // add new cyberspace div nodes
        divElements.forEach(function (element) {
            return multiCyberspaceDiv.appendChild(element);
        });
        // destroy all cyberspaces
        cyberspaces.forEach(function (cyberspace) {
            cyberspace.destroy();
        });
        cyberspaces.length = 0;
        cyberspaces.push.apply(cyberspaces, __spreadArray([], __read(cyberspaceDataList.map(function (data) { return data.cyberspace; })), false));
        var windowAspectRatio = aspectRatio.window;
        var sceneAspectRatio = aspectRatio.scene;
        // given
        //   - divCount: int
        //   - windowAspectRatio: float
        // unknown
        //   - heightCount: int
        //   - widthCount: int
        //
        // windowAspectRatio = (widthCount * sceneWidth) / (heightCount * sceneHeight)
        //                   = widthCount / heightCount * sceneAspectRatio
        // <=> widthCount = heightCount * windowAspectRatio / sceneAspectRatio
        //
        //     divCount <= heightCount * widthCount
        // <=> divCount <= heightCount * (heightCount * windowAspectRatio / sceneAspectRatio)
        // <=> sqrt(divCount * sceneAspectRatio / windowAspectRatio) <= heightCount
        // or
        // <=> sqrt(divCount / sceneAspectRatio * windowAspectRatio) <= widthCount
        var divCount = divElements.length;
        // const heightCount = Math.ceil(Math.sqrt(divElements.length * sceneAspectRatio / windowAspectRatio))
        // const widthCount = Math.ceil(divCount / heightCount)
        var widthCount = Math.ceil(Math.sqrt(divElements.length / sceneAspectRatio * windowAspectRatio));
        var indices = Utils_1.Utils.range(0, divCount);
        setGridStyle(Utils_1.Utils.map2D(Utils_1.Utils.reshape1Dto2D(indices, widthCount), function (index) { return divElements[index]; }), {
            relativePadding: 1
        });
    }
    //loadScenes(generateRandomMultiSetupData(sceneCount))
    // called only once
    function init(robotSetupDataIDs, secretKey) {
        (0, RESTApi_1.sendProgramRequest)({
            secret: { secret: secretKey },
            programs: robotSetupDataIDs
        }, function (request) { return loadScenesFromRequest(request, secretKey); });
    }
    exports.init = init;
    function forEachCyberspace(block) {
        cyberspaces.forEach(block);
    }
    function setPause(pause) {
        if (pause) {
            forEachCyberspace(function (c) { return c.pausePrograms(); });
        }
        else {
            forEachCyberspace(function (c) { return c.startPrograms(); });
        }
    }
    // TODO: Remove?
    function run(refresh, robotType) {
        console.log("run!");
    }
    /**
     * on stop program
     */
    function stopProgram() {
        forEachCyberspace(function (c) { return c.stopPrograms(); });
    }
    /**
     * Reset robot position and zoom of ScrollView
     */
    function resetPose() {
        forEachCyberspace(function (c) { return c.resetScene(); });
    }
    function sim(run) {
        if (run) {
            forEachCyberspace(function (c) { return c.startSimulation(); });
        }
        else {
            forEachCyberspace(function (c) { return c.pauseSimulation(); });
        }
    }
    function zoomIn() {
        forEachCyberspace(function (c) { return c.zoomViewIn(); });
    }
    function zoomOut() {
        forEachCyberspace(function (c) { return c.zoomViewOut(); });
    }
    function zoomReset() {
        forEachCyberspace(function (c) { return c.resetView(); });
    }
    function setSimSpeed(speedup) {
        forEachCyberspace(function (c) { return c.setSimulationSpeedupFactor(speedup); });
    }
    function setInitialButtonState() {
        // do not set 'simSpeedUpButton' since the state will be preserved
        UIManager_1.UIManager.programControlButton.setInitialState();
        UIManager_1.UIManager.showScoreButton.setInitialState();
        UIManager_1.UIManager.physicsSimControlButton.setInitialState();
    }
    function initEvents() {
        setInitialButtonState();
        UIManager_1.UIManager.programControlButton.onClick(function (state) {
            if (state == "start") {
                // run(true, ...) // cannot get robot type
                setPause(false);
            }
            else {
                // setPause(true) // not needed
                stopProgram();
            }
        });
        UIManager_1.UIManager.showScoreButton.onClick(function (state) {
            var visible = state == "showScore";
            cyberspaces.forEach(function (cyberspace) {
                cyberspace.pauseSimulation();
                var scene = cyberspace.getScene();
                if (scene instanceof RRCScoreScene_1.RRCScoreScene) {
                    scene.showScoreScreen(visible);
                }
            });
            // set to "start" state since the simulation is paused
            UIManager_1.UIManager.physicsSimControlButton.setState("start");
        });
        UIManager_1.UIManager.physicsSimControlButton.onClick(function (state) {
            return sim(state == "start");
        });
        UIManager_1.UIManager.simSpeedUpButton.setState("fastForward");
        UIManager_1.UIManager.simSpeedUpButton.onClick(function (state) {
            return setSimSpeed(state == "fastForward" ? 10 : 1);
        });
        UIManager_1.UIManager.resetSceneButton.onClick(function () {
            setInitialButtonState();
            resetPose();
        });
        UIManager_1.UIManager.zoomOutButton.onClick(zoomOut);
        UIManager_1.UIManager.zoomInButton.onClick(zoomIn);
        UIManager_1.UIManager.zoomResetButton.onClick(zoomReset);
    }
    exports.initEvents = initEvents;
});
