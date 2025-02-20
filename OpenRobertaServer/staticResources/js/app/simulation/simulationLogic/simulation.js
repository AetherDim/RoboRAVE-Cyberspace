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
define(["require", "exports", "./external/SceneDesciptorList", "./Cyberspace/Cyberspace", "./UI/UIManager", "./RRC/Scene/RRCScoreScene", "./external/RESTApi", "blockly", "guiState.controller", "nn.controller", "program.model", "message", "program.controller", "./simulation.constants", "tour.controller", "./util", "./GlobalDebug", "program.controller", "./BlocklyDebug", "./KeyManager", "./pixijs", "./ExtendedMatter"], function (require, exports, SceneDesciptorList_1, Cyberspace_1, UIManager_1, RRCScoreScene_1, RESTApi_1, Blockly, GUISTATE_C, NN_CTRL, PROGRAM, MSG, PROG_C, CONST, TOUR_C, UTIL, GlobalDebug_1, program_controller_1, BlocklyDebug_1, KeyManager_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.init = exports.setPause = void 0;
    //
    // init all components for a simulation
    //
    var cyberspace = new Cyberspace_1.Cyberspace('sceneCanvas', 'simDiv');
    var sceneManager = cyberspace.getSceneManager();
    (0, GlobalDebug_1.initGlobalDebug)();
    KeyManager_1.KeyManager.setup();
    function setInitialButtonState() {
        UIManager_1.UIManager.programControlButton.setInitialState();
        UIManager_1.UIManager.physicsSimControlButton.setInitialState();
        var scene = cyberspace.getScene();
        if (scene.getSpeedUpFactor() > scene.getMinSpeedUpFactor()) {
            UIManager_1.UIManager.simSpeedUpButton.setState("normalSpeed");
        }
        else {
            UIManager_1.UIManager.simSpeedUpButton.setState("fastForward");
        }
        UIManager_1.UIManager.showScoreButton.setInitialState();
    }
    (0, RESTApi_1.sendStateRequest)(function (res) {
        if (res && res.error == RESTApi_1.ResultErrorType.NONE) {
            var result = (res.result);
            if (result.uploadEnabled) {
                $('#head-navigation-upload').css('display', 'inline');
            }
        }
    });
    cyberspace.eventManager
        .onStartPrograms(function () { return UIManager_1.UIManager.programControlButton.setState("stop"); })
        .onStopPrograms(function () { return UIManager_1.UIManager.programControlButton.setState("start"); })
        .onStartSimulation(function () { return UIManager_1.UIManager.physicsSimControlButton.setState("stop"); })
        .onPauseSimulation(function () { return UIManager_1.UIManager.physicsSimControlButton.setState("start"); });
    cyberspace.specializedEventManager
        .addEventHandlerSetter(RRCScoreScene_1.RRCScoreScene, function (scoreScene) {
        return scoreScene.scoreEventManager.onShowHideScore(function (state) {
            return UIManager_1.UIManager.showScoreButton.setState(state == "hideScore" ? "showScore" : "hideScore");
        });
    });
    cyberspace.onSwitchScene(function () {
        setInitialButtonState();
    });
    function setPause() {
        // TODO: Pause of stop?
        cyberspace.pausePrograms();
    }
    exports.setPause = setPause;
    sceneManager.registerScene.apply(sceneManager, __spreadArray([], __read(SceneDesciptorList_1.cyberspaceScenes), false));
    // switch to first scene
    cyberspace.switchToNextScene(true);
    buildSceneMenu();
    /**
     * @param programs
     * @param refresh `true` if "SIM" is pressed, `false` if play is pressed
     * @param robotType
     */
    function init(programs, refresh, robotType) {
        //$('simScene').hide();
        // TODO: prevent clicking run twice
        cyberspace.setRobertaRobotSetupData(programs, robotType);
    }
    exports.init = init;
    //
    // UI Implementation
    //
    function requestSimAssemblyForProgram(callback) {
        var xmlProgram = Blockly.Xml.workspaceToDom(GUISTATE_C.getBlocklyWorkspace());
        var xmlTextProgram = Blockly.Xml.domToText(xmlProgram);
        var isNamedConfig = !GUISTATE_C.isConfigurationStandard() && !GUISTATE_C.isConfigurationAnonymous();
        var configName = isNamedConfig ? GUISTATE_C.getConfigurationName() : undefined;
        var xmlConfigText = GUISTATE_C.isConfigurationAnonymous() ? GUISTATE_C.getConfigurationXML() : undefined;
        var language = GUISTATE_C.getLanguage();
        // Request simulation assembly program from server
        PROGRAM.runInSim(GUISTATE_C.getProgramName(), configName, xmlTextProgram, xmlConfigText, language, function (result) {
            callback(result);
        });
    }
    /**
     * Sets the same `robertaSetupData` for each robot.
     * @param robertaSetupData The roberta setup data
     */
    function setSameSetupData(robertaSetupData) {
        var setupDataList = Array.from({ length: cyberspace.robotCount() }).fill(robertaSetupData);
        cyberspace.setRobertaRobotSetupData(setupDataList, GUISTATE_C.getRobotGroup());
    }
    function simulateProgram(callback) {
        // TODO: use proper 'this' type
        requestSimAssemblyForProgram(function (result) {
            var _this = this;
            if (result.rc == 'ok') {
                MSG.displayMessage('MESSAGE_EDIT_START', 'TOAST', GUISTATE_C.getProgramName(), undefined, undefined);
                setSameSetupData(result);
                // setting the robot data might reset the scene since the configuration has changed
                cyberspace.getScene().runAfterLoading(function () {
                    cyberspace.startPrograms();
                    callback === null || callback === void 0 ? void 0 : callback.call(_this);
                });
            }
            else {
                MSG.displayInformation(result, '', result.message, '', undefined);
            }
        });
    }
    // Button
    UIManager_1.UIManager.programControlButton.onClick(function (state) {
        // TODO: Add proper multi robot support
        if (cyberspace.robotCount() <= 1 || true) {
            if (state == "start") {
                Blockly.hideChaff();
                NN_CTRL.mkNNfromNNStepData();
                simulateProgram();
            }
            else {
                cyberspace.stopPrograms();
            }
        }
        else {
            // TODO: add multiple robot support
            /*if ($('#simControl').hasClass('typcn-media-play-outline')) {
                MSG.displayMessage('MESSAGE_EDIT_START', 'TOAST', 'multiple simulation');
                $('#simControl').addClass('typcn-media-stop').removeClass('typcn-media-play-outline');
                $('#simControl').attr('data-original-title', Blockly.Msg.MENU_SIM_STOP_TOOLTIP);
                SIM.run(false, GUISTATE_C.getRobotGroup());
                setTimeout(function () {
                    SIM.setPause(false);
                }, 500);
            } else {
                $('#simControl').addClass('typcn-media-play-outline').removeClass('typcn-media-stop');
                $('#simControl').attr('data-original-title', Blockly.Msg.MENU_SIM_START_TOOLTIP);
                SIM.stopProgram();
            }*/
        }
    });
    UIManager_1.UIManager.physicsSimControlButton.onClick(function (state) {
        if (state == "start") {
            cyberspace.startSimulation();
        }
        else {
            cyberspace.pauseSimulation();
        }
    });
    UIManager_1.UIManager.showScoreButton.onClick(function (state) {
        var scene = cyberspace.getScene();
        if (scene instanceof RRCScoreScene_1.RRCScoreScene) {
            scene.showScoreScreen(state == "showScore");
        }
    });
    UIManager_1.UIManager.simSpeedUpButton.onClick(function (state) {
        var speedup = state == "normalSpeed" ? 1 : 10;
        cyberspace.setSimulationSpeedupFactor(speedup);
    });
    UIManager_1.UIManager.resetSceneButton.onClick(function () {
        cyberspace.resetScene();
        setInitialButtonState();
    });
    UIManager_1.UIManager.zoomInButton.onClick(function () {
        cyberspace.zoomViewIn();
    });
    UIManager_1.UIManager.zoomOutButton.onClick(function () {
        cyberspace.zoomViewOut();
    });
    UIManager_1.UIManager.zoomResetButton.onClick(function () {
        cyberspace.resetView();
    });
    UIManager_1.UIManager.switchSceneButton.onClick(function () {
        var description = cyberspace.switchToNextScene();
        sceneMenuSelect(description.ID);
    });
    var INITIAL_WIDTH = 0.5;
    function openSimulationView() {
        requestSimAssemblyForProgram(function (result) {
            if (result.rc == 'ok') {
                setSameSetupData(result);
                if (TOUR_C.getInstance() && TOUR_C.getInstance().trigger) {
                    TOUR_C.getInstance().trigger('startSim');
                }
                $('#blockly').openRightView('sim', INITIAL_WIDTH);
            }
            else {
                MSG.displayInformation(result, '', result.message, '', undefined);
            }
            PROG_C.reloadProgram(result); // load program into workspace
        });
        UTIL.openSimRobotWindow(CONST.default.ANIMATION_DURATION);
    }
    // open simulation view after one second
    setTimeout(function () {
        UIManager_1.UIManager.simViewButton.setState("closed");
        openSimulationView();
    }, 1000);
    UIManager_1.UIManager.simViewButton.onClick(function (state) {
        if (state == "open") {
            openSimulationView();
        }
        else {
            $('#blockly').closeRightView(function () {
                $('.nav > li > ul > .robotType').removeClass('disabled');
                $('.' + GUISTATE_C.getRobot()).addClass('disabled');
            });
            UTIL.closeSimRobotWindow(CONST.default.ANIMATION_DURATION);
            cyberspace.setDebugMode(false);
            updateDebugButtons();
        }
    });
    function toggleModal(id, position) {
        if ($(id).is(':hidden')) {
            $(id).css({
                top: position.top + 12,
                left: position.left
            });
        }
        $(id).animate({
            'opacity': 'toggle',
            'top': 'toggle'
        }, 300);
        $(id).draggable({
            constraint: 'window'
        });
    }
    UIManager_1.UIManager.closeParentsButton.onClick(function () {
        $($(this).parents('.simWindow:first')).animate({
            'opacity': 'hide',
            'top': 'hide'
        }, 300);
    });
    UIManager_1.UIManager.simDebugViewButton.onClick(function () {
        var position = $('#simDiv').position();
        position.left = $(window).width() - ($('#simValuesModal').width() + 12);
        toggleModal('#simValuesModal', position);
    });
    function startProgramIfRequired(callback) {
        var program = BlocklyDebug_1.BlocklyDebug.getInstance().getWorkspaceProgram();
        if (!program || program.isTerminated()) {
            simulateProgram(callback);
        }
        else {
            cyberspace.startPrograms();
            callback();
        }
    }
    UIManager_1.UIManager.debugStepOverButton.onClick(function () {
        startProgramIfRequired(function () {
            var program = BlocklyDebug_1.BlocklyDebug.getInstance().getWorkspaceProgram();
            program === null || program === void 0 ? void 0 : program.interpreterAddEvent(CONST.default.DEBUG_STEP_OVER);
        });
    });
    UIManager_1.UIManager.debugStepIntoButton.onClick(function () {
        startProgramIfRequired(function () {
            var program = BlocklyDebug_1.BlocklyDebug.getInstance().getWorkspaceProgram();
            program === null || program === void 0 ? void 0 : program.interpreterAddEvent(CONST.default.DEBUG_STEP_INTO);
        });
    });
    function updateDebugButtons() {
        if (cyberspace.isDebugMode()) {
            UIManager_1.UIManager.debugStepIntoButton.show();
            UIManager_1.UIManager.debugStepOverButton.show();
            UIManager_1.UIManager.debugStepBreakPointButton.show();
            UIManager_1.UIManager.debugVariablesButton.show();
        }
        else {
            UIManager_1.UIManager.debugStepIntoButton.hide();
            UIManager_1.UIManager.debugStepOverButton.hide();
            UIManager_1.UIManager.debugStepBreakPointButton.hide();
            UIManager_1.UIManager.debugVariablesButton.hide();
        }
    }
    updateDebugButtons(); // on init
    UIManager_1.UIManager.simDebugMode.onClick(function () {
        cyberspace.setDebugMode(!cyberspace.isDebugMode());
        updateDebugButtons();
    });
    UIManager_1.UIManager.debugStepBreakPointButton.onClick(function () {
        startProgramIfRequired(function () {
            var program = BlocklyDebug_1.BlocklyDebug.getInstance().getWorkspaceProgram();
            program === null || program === void 0 ? void 0 : program.interpreterAddEvent(CONST.default.DEBUG_BREAKPOINT);
        });
    });
    UIManager_1.UIManager.debugVariablesButton.onClick(function () {
        var position = $('#simDiv').position();
        position.left = $(window).width() - ($('#simVariablesModal').width() + 12);
        toggleModal('#simVariablesModal', position);
    });
    function buildSceneMenu() {
        _buildSceneMenu('#simSelectionMenuContentSmall', '_small_Menu_');
        _buildSceneMenu('#simSelectionMenuContent', '');
        var scenes = cyberspace.getScenes();
        if (scenes.length > 0) {
            sceneMenuSelect(scenes[0].ID);
        }
    }
    function _buildSceneMenu(menu, addString) {
        // TODO: clear #simSelectionMenuContent??
        // seems to work without clear
        var scenes = cyberspace.getScenes();
        for (var i = 0; i < scenes.length; i++) {
            var scene = scenes[i];
            $(menu).append('<li><a href="#" id="' + scene.ID + addString + '" class="menuSim typcn typcn-image " title="' + scene.description + '">' + scene.name + '</a></li>');
            if (i === 0) {
                $('#' + scene.ID + addString).parent().addClass('disabled');
            }
        }
    }
    function sceneMenuSelect(sceneID) {
        $('.modal').modal('hide'); // remove modal
        $('.menuSim').parent().removeClass('disabled'); // enable all items in list
        $("#simButtonsCollapse").collapse('hide'); // collapse popup list
        $('#' + sceneID).parent().addClass('disabled');
        $('#' + sceneID + '_small_Menu_').parent().addClass('disabled');
    }
    $('.sim-nav').onWrap('click', 'li:not(.disabled) a', function (event) {
        var name = event.target.id.replace('_small_Menu_', '');
        cyberspace.loadScene(name);
        sceneMenuSelect(name);
    }, 'sim clicked');
    // UPLOAD Menu
    $('#head-navigation-upload').onWrap('click', '.dropdown-menu li:not(.disabled) a', function (event) {
        switch (event.target.id) {
            case 'menuSubmitSolution':
                if (!GUISTATE_C.isUserLoggedIn()) {
                    alert("Please login");
                    return;
                }
                var form = document.createElement("form");
                form.setAttribute("method", "post");
                form.setAttribute("action", GlobalDebug_1.DEBUG ?
                    "https://my-dev.roborave.de/submitSolution.php" :
                    "https://my.roborave.de/submitSolution.php");
                form.setAttribute("target", "view");
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", "link");
                hiddenField.setAttribute("value", (0, program_controller_1.getProgramLink)());
                var hiddenField2 = document.createElement("input");
                hiddenField2.setAttribute("type", "hidden");
                hiddenField2.setAttribute("name", "account");
                hiddenField2.setAttribute("value", GUISTATE_C.getUserAccountName());
                form.appendChild(hiddenField);
                form.appendChild(hiddenField2);
                document.body.appendChild(form);
                window.open('', 'view');
                form.submit();
                break;
            default:
                break;
        }
    }, 'upload edit clicked');
});
