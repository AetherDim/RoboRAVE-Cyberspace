define(["require", "exports", "message", "util", "webots.simulation", "simulation.simulation", "simulation.constants", "guiState.controller", "nn.controller", "tour.controller", "program.controller", "program.model", "blockly", "jquery", "jquery-validate"], function (require, exports, MSG, UTIL, NAOSIM, SIM, simulation_constants_1, GUISTATE_C, NN_CTRL, TOUR_C, PROG_C, PROGRAM, Blockly, $) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.init = void 0;
    var INITIAL_WIDTH = 0.5;
    var blocklyWorkspace;
    var debug = false;
    function init() {
        blocklyWorkspace = GUISTATE_C.getBlocklyWorkspace();
        initEvents();
    }
    exports.init = init;

    function getConfigurationXML() {
        // TODO: Why does the configuration has to be an anonymous one?
        // return GUISTATE_C.isConfigurationAnonymous() ? GUISTATE_C.getConfigurationXML() : undefined;
        return GUISTATE_C.getConfigurationXML();
    }

    function initEvents() {
        $('#simButton').off('click touchend');
        $('#simButton').onWrap('click touchend', function (event) {
            debug = false;
            // Workaround for IOS speech synthesis, speech must be triggered once by a button click explicitly before it can be used programmatically
            if (window.speechSynthesis && GUISTATE_C.getRobot().indexOf('ev3') !== -1) {
                window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
            }
            toggleSim();
            return false;
        });

        $('#simDebugButton').off('click touchend');
        $('#simDebugButton').onWrap('click touchend', function (event) {
            debug = true;
            // Workaround for IOS speech synthesis, speech must be triggered once by a button click explicitly before it can be used programmatically
            if (window.speechSynthesis && GUISTATE_C.getRobot().indexOf('ev3') !== -1) {
                window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
            }
            toggleSim();
            return false;
        });

        $('#simStop').onWrap('click', function (event) {
            $('#simStop').addClass('disabled');
            $('#simControl').addClass('typcn-media-play-outline').removeClass('typcn-media-play');
            SIM.stopProgram();
        }, 'sim stop clicked');

        $('#simControl').onWrap('click', function (event) {
            event.stopPropagation();
            if (SIM.getNumRobots() <= 1) {
                if (SIM.getDebugMode()) {
                    toggleSimEvent(simulation_constants_1.default.DEBUG_BREAKPOINT);
                }
                else {
                    if ($('#simControl').hasClass('typcn-media-play-outline')) {
                        Blockly.hideChaff();
                        var xmlProgram = Blockly.Xml.workspaceToDom(blocklyWorkspace);
                        var xmlTextProgram = Blockly.Xml.domToText(xmlProgram);
                        var isNamedConfig = !GUISTATE_C.isConfigurationStandard() && !GUISTATE_C.isConfigurationAnonymous();
                        var configName = isNamedConfig ? GUISTATE_C.getConfigurationName() : undefined;
                        var xmlConfigText = GUISTATE_C.isConfigurationAnonymous() ? GUISTATE_C.getConfigurationXML() : undefined;
                        var language = GUISTATE_C.getLanguage();
                        NN_CTRL.mkNNfromNNStepData();
                        PROGRAM.runInSim(GUISTATE_C.getProgramName(), configName, xmlTextProgram, xmlConfigText, language, function (result) {
                            if (result.rc == 'ok') {
                                MSG.displayMessage('MESSAGE_EDIT_START', 'TOAST', GUISTATE_C.getProgramName());
                                if (SIM.getDebugMode()) {
                                    $('#simControl').addClass('typcn-media-play').removeClass('typcn-media-play-outline');
                                }
                                else {
                                    $('#simControl').addClass('typcn-media-stop').removeClass('typcn-media-play-outline');
                                    $('#simControl').attr('data-original-title', Blockly.Msg.MENU_SIM_STOP_TOOLTIP);
                                }
                                if (GUISTATE_C.hasWebotsSim()) {
                                    NAOSIM.run(result.javaScriptProgram);
                                }
                                else {
                                    SIM.init([result], false, GUISTATE_C.getRobotGroup());
                                    SIM.setPause(false);
                                }
                            }
                            else {
                                MSG.displayInformation(result, '', result.message, '');
                            }
                            PROG_C.reloadProgram(result);
                        });
                    }
                    else {
                        $('#simControl').addClass('typcn-media-play-outline').removeClass('typcn-media-stop');
                        $('#simControl').attr('data-original-title', Blockly.Msg.MENU_SIM_START_TOOLTIP);
                        if (GUISTATE_C.hasWebotsSim()) {
                            NAOSIM.stopProgram();
                        }
                        else {
                            SIM.stopProgram();
                        }
                    }
                }
            }
            else {
                if ($('#simControl').hasClass('typcn-media-play-outline')) {
                    MSG.displayMessage('MESSAGE_EDIT_START', 'TOAST', 'multiple simulation');
                    $('#simControl').addClass('typcn-media-stop').removeClass('typcn-media-play-outline');
                    $('#simControl').attr('data-original-title', Blockly.Msg.MENU_SIM_STOP_TOOLTIP);
                    SIM.run(false, GUISTATE_C.getRobotGroup());
                    SIM.setPause(false);
                }
                else {
                    $('#simControl').addClass('typcn-media-play-outline').removeClass('typcn-media-stop');
                    $('#simControl').attr('data-original-title', Blockly.Msg.MENU_SIM_START_TOOLTIP);
                    SIM.stopProgram();
                }
            }
        }, 'sim start clicked');

        $('#simScore').onWrap('click', function(event) {
            if ($('#simScore').hasClass('typcn-star')) {
                $('#simScore').addClass('typcn-star-outline').removeClass('typcn-star');
                SIM.score(true);
            } else {
                $('#simScore').addClass('typcn-star').removeClass('typcn-star-outline');
                SIM.score(false);
            }
        }, 'simImport clicked');

        $('#simFLowControl').onWrap('click', function(event) {
            if ($('#simFLowControl').hasClass('typcn-flash')) {
                $('#simFLowControl').addClass('typcn-flash-outline').removeClass('typcn-flash');
                SIM.sim(false);
            } else {
                $('#simFLowControl').addClass('typcn-flash').removeClass('typcn-flash-outline');
                SIM.sim(true);
            }
        }, 'simImport clicked');

        $('#simSpeedUp').onWrap('click', function(event) {
            if ($('#simSpeedUp').hasClass('typcn-media-fast-forward')) {
                $('#simSpeedUp').addClass('typcn-media-fast-forward-outline').removeClass('typcn-media-fast-forward');
                SIM.setSimSpeed(1);
            } else {
                $('#simSpeedUp').addClass('typcn-media-fast-forward').removeClass('typcn-media-fast-forward-outline');
                SIM.setSimSpeed(10);
            }
        }, 'simImport clicked');

        $('.simInfo').onWrap('click', function (event) {
            SIM.setInfo();
        }, 'sim info clicked');
        $('#simRobot').onWrap('click', function (event) {
            var robot = GUISTATE_C.getRobot();
            var position = $('#simDiv').position();
            if (robot == 'calliope2016' || robot == 'calliope2017' || robot == 'calliope2017NoBlue' || robot == 'microbit') {
                position.left = $('#blocklyDiv').width() + 12;
            }
            else {
                position.left += 48;
            }
            toggleRobotWindow('#simRobotWindow', position);
        }, 'sim show robot clicked');
        $('#simValues').onWrap('click', function (event) {
            var position = $('#simDiv').position();
            position.left = $(window).width() - ($('#simValuesWindow').width() + 12);
            toggleRobotWindow('#simValuesWindow', position);
        }, 'sim show values clicked');
        function toggleRobotWindow(id, position) {
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
        $('.simWindow .close').onWrap('click', function (event) {
            $($(this).parents('.simWindow:first')).animate({
                'opacity': 'hide',
                'top': 'hide'
            }, 300);
        }, 'sim close robotWindow clicked');
        $('#simResetPose').onWrap('click', function (event) {
            if (GUISTATE_C.hasWebotsSim()) {
                NAOSIM.resetPose();
                return;
            }
            SIM.resetPose();
        }, 'sim reset pose clicked');

        $('#zoomIn').onWrap('click', function(event) {
            SIM.zoomIn();
        }, 'zoomIn clicked');

        $('#zoomOut').onWrap('click', function(event) {
            SIM.zoomOut();
        }, 'zoomOut clicked');

        $('#zoomReset').onWrap('click', function(event) {
            SIM.zoomReset();
        }, 'zoomOut clicked');

        /*
        $('#debugMode').onWrap('click', function(event) {
                if ($('#debugMode').hasClass('typcn-spanner')) {
                    $('#simControlBreakPoint,#simControlStepOver,#simControlStepInto,#simVariables').show();
                    $('#debugMode').addClass('typcn-spanner-outline').removeClass('typcn-spanner');
                    SIM.updateDebugMode(true);
                } else {
                    $('#simControlBreakPoint,#simControlStepOver,#simControlStepInto,#simVariables').hide();
                    $('#debugMode').addClass('typcn-spanner').removeClass('typcn-spanner-outline');
                    SIM.endDebugging();
                }

            }, 'debugMode clicked');*/



        $('#simControlStepInto').onWrap('click', function (event) {
            toggleSimEvent(simulation_constants_1.default.DEBUG_STEP_INTO);
        }, 'sim step into clicked');
        $('#simControlStepOver').onWrap('click', function (event) {
            toggleSimEvent(simulation_constants_1.default.DEBUG_STEP_OVER);
        }, 'sim step over clicked');
        
        
        $('#simScene').onWrap('click', function (event) {
            // TODO!
            //SIM.setBackground(-1, SIM.setBackground);
        }, 'sim toggle background clicked');
    }
    function initSimulation(result) {
        SIM.init([result], true, GUISTATE_C.getRobotGroup());
        $('#simControl').addClass('typcn-media-play-outline').removeClass('typcn-media-play');
        if (SIM.getNumRobots() === 1 && debug) {
            $('#simStop, #simControlStepOver, #simControlStepInto').show();
            $('#simControl').attr('data-original-title', Blockly.Msg.MENU_DEBUG_STEP_BREAKPOINT_TOOLTIP);
            $('#simControl').addClass('blue');
            SIM.updateDebugMode(true);
        }
        else {
            $('#simStop, #simControlStepOver, #simControlStepInto').hide();
            $('#simControl').attr('data-original-title', Blockly.Msg.MENU_SIM_START_TOOLTIP);
            $('#simControl').removeClass('blue');
            SIM.endDebugging();
        }
        if (TOUR_C.getInstance() && TOUR_C.getInstance().trigger) {
            TOUR_C.getInstance().trigger('startSim');
        }
        var name = debug ? 'simDebug' : 'sim';
        $('#blockly').openRightView('sim', INITIAL_WIDTH, name);
    }
    function initNaoSimulation(result) {
        NAOSIM.init(result.javaScriptProgram);
        $('#simControl').addClass('typcn-media-play-outline').removeClass('typcn-media-play');
        $('#simStop, #simControlStepOver, #simControlStepInto').hide();
        $('#simControl').attr('data-original-title', Blockly.Msg.MENU_SIM_START_TOOLTIP);
        $('#simControl').removeClass('blue');
        $('#blockly').openRightView('sim', INITIAL_WIDTH, 'sim');
    }
    function toggleSim() {
        if ($('.fromRight.rightActive').hasClass('shifting')) {
            return;
        }
        if (($('#simButton').hasClass('rightActive') && !debug) || ($('#simDebugButton').hasClass('rightActive') && debug)) {
            if (!GUISTATE_C.hasWebotsSim()) {
                SIM.cancel();
            }
            $('#simControl').addClass('typcn-media-play-outline').removeClass('typcn-media-play').removeClass('typcn-media-stop');
            $('#blockly').closeRightView(function () {
                $('.nav > li > ul > .robotType').removeClass('disabled');
                $('.' + GUISTATE_C.getRobot()).addClass('disabled');
            });
            $('#simStop, #simControlStepOver,#simControlStepInto').hide();
            UTIL.closeSimRobotWindow(simulation_constants_1.default.ANIMATION_DURATION);
            SIM.endDebugging();
        }
        else {
            var xmlProgram = Blockly.Xml.workspaceToDom(blocklyWorkspace);
            var xmlTextProgram = Blockly.Xml.domToText(xmlProgram);
            var isNamedConfig = !GUISTATE_C.isConfigurationStandard() && !GUISTATE_C.isConfigurationAnonymous();
            var configName = isNamedConfig ? GUISTATE_C.getConfigurationName() : undefined;
            var xmlConfigText = GUISTATE_C.isConfigurationAnonymous() ? GUISTATE_C.getConfigurationXML() : undefined; // TODO: Fix?
            var language = GUISTATE_C.getLanguage();
            PROGRAM.runInSim(GUISTATE_C.getProgramName(), configName, xmlTextProgram, xmlConfigText, language, function (result) {
                if (result.rc == 'ok') {
                    if (GUISTATE_C.hasWebotsSim()) {
                        initNaoSimulation(result);
                    }
                    else {
                        initSimulation(result);
                    }
                }
                else {
                    MSG.displayInformation(result, '', result.message, '');
                }
                PROG_C.reloadProgram(result);
            });
            UTIL.openSimRobotWindow(simulation_constants_1.default.ANIMATION_DURATION);
        }
    }
    function toggleSimEvent(event) {
        if ($('#simControl').hasClass('typcn-media-play-outline')) {
            var xmlProgram = Blockly.Xml.workspaceToDom(blocklyWorkspace);
            var xmlTextProgram = Blockly.Xml.domToText(xmlProgram);
            var isNamedConfig = !GUISTATE_C.isConfigurationStandard() && !GUISTATE_C.isConfigurationAnonymous();
            var configName = isNamedConfig ? GUISTATE_C.getConfigurationName() : undefined;
            var xmlConfigText = GUISTATE_C.isConfigurationAnonymous() ? GUISTATE_C.getConfigurationXML() : undefined; // TODO: FIX?
            var language = GUISTATE_C.getLanguage();
            PROGRAM.runInSim(GUISTATE_C.getProgramName(), configName, xmlTextProgram, xmlConfigText, language, function (result) {
                if (result.rc == 'ok') {
                    SIM.init([result], false, GUISTATE_C.getRobotGroup());
                    SIM.setPause(false);
                    SIM.interpreterAddEvent(event);
                }
                $('#simControl').removeClass('typcn-media-play-outline').addClass('typcn-media-play');
                $('#simStop').removeClass('disabled');
            });
        }
        else if ($('#simControl').hasClass('typcn-media-play')) {
            SIM.setPause(false);
            SIM.interpreterAddEvent(event);
        }
        else {
            if ($('#simControl').hasClass('typcn-media-stop')) {
                $('#simControl').addClass('blue').removeClass('typcn-media-stop');
                $('#simControl').attr('data-original-title', Blockly.Msg.MENU_DEBUG_STEP_BREAKPOINT_TOOLTIP);
                $('#simStop').show();
            }
            $('#simControl').addClass('typcn-media-play-outline').removeClass('typcn-media-play');
            SIM.stopProgram();
        }
    }
});
