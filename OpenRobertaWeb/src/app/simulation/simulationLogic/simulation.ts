import './pixijs'
import './ExtendedMatter'
import { cyberspaceScenes } from './external/SceneDesciptorList'
import { RobertaRobotSetupData } from './Robot/RobertaRobotSetupData'
import { Cyberspace } from './Cyberspace/Cyberspace';
import { UIManager } from './UI/UIManager';
import { interpreterSimBreakEventHandlers } from "interpreter.jsHelper"
import { RRCScoreScene } from './RRC/Scene/RRCScoreScene';
import { RESTState, ResultErrorType, sendStateRequest } from './external/RESTApi';
import * as $ from "jquery";
import * as Blockly from "blockly";
import * as GUISTATE_C from "guiState.controller";
import * as NN_CTRL from "nn.controller";
import * as PROGRAM from "program.model";
import * as MSG from "message";
import * as PROG_C from "program.controller";
import * as CONST from "./simulation.constants"
import * as TOUR_C from "tour.controller";
import * as UTIL from "./util";
import {DEBUG} from "./GlobalDebug";
import {getProgramLink} from "program.controller";

//
// init all components for a simulation
//
const cyberspace = new Cyberspace('sceneCanvas', 'simDiv')
const sceneManager = cyberspace.getSceneManager()

UIManager.simSpeedUpButton.setState("fastForward")
UIManager.showScoreButton.setState("showScore")


sendStateRequest(res => {
	if(res && res.error == ResultErrorType.NONE) {
		const result: RESTState = <RESTState><any>(res!.result);
		if(result.uploadEnabled) {
			$('#head-navigation-upload').css('display', 'inline');
		}
	}
})


cyberspace.eventManager
	.onStartPrograms(() => UIManager.programControlButton.setState("stop"))
	.onStopPrograms(() => UIManager.programControlButton.setState("start"))
	.onStartSimulation(() => UIManager.physicsSimControlButton.setState("stop"))
	.onPauseSimulation(() => UIManager.physicsSimControlButton.setState("start"))

cyberspace.specializedEventManager
	.addEventHandlerSetter(RRCScoreScene, scoreScene =>
		scoreScene.scoreEventManager.onShowHideScore(state =>
			UIManager.showScoreButton.setState(state == "hideScore" ? "showScore" : "hideScore"))
		)

interpreterSimBreakEventHandlers.push(() => {
	cyberspace.pausePrograms()
})


sceneManager.registerScene(...cyberspaceScenes)

// switch to first scene
cyberspace.switchToNextScene(true)


/**
 * @param programs 
 * @param refresh `true` if "SIM" is pressed, `false` if play is pressed
 * @param robotType 
 */
export function init(programs: RobertaRobotSetupData[], refresh: boolean, robotType: string) {


	//$('simScene').hide();

	// TODO: prevent clicking run twice

	cyberspace.setRobertaRobotSetupData(programs, robotType)
}

//
// UI Implementation
//


function requestSimAssemblyForProgram(callback: (result: RobertaRobotSetupData) => void) {
	const xmlProgram = Blockly.Xml.workspaceToDom(GUISTATE_C.getBlocklyWorkspace());
	const xmlTextProgram = Blockly.Xml.domToText(xmlProgram);

	const isNamedConfig = !GUISTATE_C.isConfigurationStandard() && !GUISTATE_C.isConfigurationAnonymous();
	const configName = isNamedConfig ? GUISTATE_C.getConfigurationName() : undefined;
	const xmlConfigText = GUISTATE_C.isConfigurationAnonymous() ? GUISTATE_C.getConfigurationXML() : undefined;
	const language = GUISTATE_C.getLanguage();

	// Request simulation assembly program from server
	PROGRAM.runInSim(GUISTATE_C.getProgramName(), configName, xmlTextProgram, xmlConfigText, language, function (result) {
		callback(result);
	});
}


// Button
UIManager.programControlButton.onClick( state => {

	// TODO: Add proper multi robot support
	if (cyberspace.robotCount() <= 1 || true) {

		if (state == "start") {
			Blockly.hideChaff();
			NN_CTRL.mkNNfromNNStepData();

			requestSimAssemblyForProgram(result => {
				if (result.rc == 'ok') {
					MSG.displayMessage('MESSAGE_EDIT_START', 'TOAST', GUISTATE_C.getProgramName(), undefined, undefined);

					cyberspace.setRobertaRobotSetupData([result], GUISTATE_C.getRobotGroup())

					cyberspace.startPrograms()

					if(cyberspace.getProgramManager().isDebugMode()) {
						cyberspace.getProgramManager().interpreterAddEvent(CONST.default.DEBUG_BREAKPOINT)
					}

				} else {
					MSG.displayInformation(result, '', result.message, '', undefined);
				}

				PROG_C.reloadProgram(result); // load to current blocky workspace
			});

		} else {

			if(cyberspace.getProgramManager().isDebugMode()) {
				cyberspace.getProgramManager().interpreterAddEvent(CONST.default.DEBUG_BREAKPOINT)
			}

			cyberspace.stopPrograms()
		}

	} else {
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

})

UIManager.physicsSimControlButton.onClick(state => {
	if(state == "start") {
		cyberspace.startSimulation()
	} else {
		cyberspace.pauseSimulation()
	}
})

UIManager.showScoreButton.onClick(state => {
	const scene = cyberspace.getScene()
	if (scene instanceof RRCScoreScene) {
		scene.showScoreScreen(state == "showScore")
	}
})

UIManager.simSpeedUpButton.onClick(state => {
	const speedup = state == "normalSpeed" ? 1 : 10;
	cyberspace.setSimulationSpeedupFactor(speedup)
})

UIManager.resetSceneButton.onClick(() => {
	cyberspace.resetScene()
})

UIManager.zoomInButton.onClick(() => {
	cyberspace.zoomViewIn()
})

UIManager.zoomOutButton.onClick(() => {
	cyberspace.zoomViewOut()
})

UIManager.zoomResetButton.onClick(() => {
	cyberspace.resetView()
})

UIManager.switchSceneButton.onClick(() => {
	cyberspace.switchToNextScene()
})


const INITIAL_WIDTH = 0.5;

function openSimulationView() {
	requestSimAssemblyForProgram(result => {
		if (result.rc == 'ok') {
			cyberspace.setRobertaRobotSetupData([result], GUISTATE_C.getRobotGroup())

			if (TOUR_C.getInstance() && TOUR_C.getInstance().trigger) {
				TOUR_C.getInstance().trigger('startSim');
			}

			$('#blockly').openRightView('sim', INITIAL_WIDTH)

		} else {
			MSG.displayInformation(result, '', result.message, '', undefined)
		}
		PROG_C.reloadProgram(result) // load program into workspace
	})

	UTIL.openSimRobotWindow(CONST.default.ANIMATION_DURATION)
}

// open simulation view after one second
setTimeout(() => {
	UIManager.simViewButton.setState("closed")
	openSimulationView()
}, 1000)

UIManager.simViewButton.onClick(state => {
	if(state == "open") {
		openSimulationView()
	} else {
		$('#blockly').closeRightView(() => {
			$('.nav > li > ul > .robotType').removeClass('disabled')
			$('.' + GUISTATE_C.getRobot()).addClass('disabled')
		})

		UTIL.closeSimRobotWindow(CONST.default.ANIMATION_DURATION)

		cyberspace.setDebugMode(false)
	}
})

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
	$(id).draggable(
		{
			constraint: 'window'
		}
	);
}

UIManager.simDebugViewButton.onClick(() => {
	const position = $('#simDiv').position();
	position.left = $(window).width() - ($('#simValuesModal').width() + 12);
	toggleModal('#simValuesModal', position);
})

UIManager.debugStepOverButton.onClick(() => {
	cyberspace.startPrograms()
	cyberspace.getProgramManager().interpreterAddEvent(CONST.default.DEBUG_STEP_OVER)
})

UIManager.debugStepIntoButton.onClick(() => {
	cyberspace.startPrograms()
	cyberspace.getProgramManager().interpreterAddEvent(CONST.default.DEBUG_STEP_INTO)
})

UIManager.simDebugMode.onClick(() => {
	cyberspace.setDebugMode(!cyberspace.isDebugMode())
})

UIManager.debugStepBreakPointButton.onClick(() => {
	cyberspace.startPrograms()
	cyberspace.getProgramManager().interpreterAddEvent(CONST.default.DEBUG_BREAKPOINT)
})

UIManager.debugVariablesButton.onClick(() => {
	const position = $('#simDiv').position();
	position.left = $(window).width() - ($('#simVariablesModal').width() + 12);
	toggleModal('#simVariablesModal', position);
})


function buildSceneMenu(menu, addString) {
	// TODO: clear #simSelectionMenuContent??
	// seems to work without clear
	const scenes = cyberspace.getScenes();

	for (let i = 0; i < scenes.length; i++) {
		const scene = scenes[i];
		$(menu).append('<li><a href="#" id="' + scene.ID + addString + '" class="menuSim typcn typcn-image " title="' + scene.description + '">' + scene.name + '</a></li>');
		if(i === 0) {
			$('#'+scene.ID + addString).parent().addClass('disabled');
		}
	}
}

buildSceneMenu('#simSelectionMenuContentSmall', '_small_Menu_');
buildSceneMenu('#simSelectionMenuContent', '');

$('.sim-nav').onWrap('click', 'li:not(.disabled) a', function(event) {
	$('.modal').modal('hide') // remove modal
	$('.menuSim').parent().removeClass('disabled') // enable all items in list
	$("#simButtonsCollapse").collapse('hide') // collapse popup list

	const name = event.target.id.replace('_small_Menu_', '')
	cyberspace.loadScene(name)
	$('#'+name).parent().addClass('disabled')
	$('#'+name+'_small_Menu_').parent().addClass('disabled')

}, 'sim clicked');

// UPLOAD Menu
$('#head-navigation-upload').onWrap('click', '.dropdown-menu li:not(.disabled) a', (event) => {
	switch (event.target.id) {
		case 'menuSubmitSolution':

			if(!GUISTATE_C.isUserLoggedIn()) {
				alert("Please login")
				return;
			}

			var form = document.createElement("form");
			form.setAttribute("method", "post");
			form.setAttribute("action",
				DEBUG ?
					"https://my-dev.roborave.de/submitSolution.php" :
					"https://my.roborave.de/submitSolution.php");
			form.setAttribute("target", "view");
			const hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", "link");
			hiddenField.setAttribute("value", getProgramLink());
			const hiddenField2 = document.createElement("input");
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