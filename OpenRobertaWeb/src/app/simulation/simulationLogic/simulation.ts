import './pixijs'
import './ExtendedMatter'
import { cyberspaceScenes } from './external/SceneDesciptorList'
import { RobertaRobotSetupData } from './Robot/RobertaRobotSetupData'
import { Cyberspace } from './Cyberspace/Cyberspace';
import { UIManager } from './UI/UIManager';
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
import {DEBUG, initGlobalDebug} from "./GlobalDebug";
import {getProgramLink} from "program.controller";
import {BlocklyDebug} from "./BlocklyDebug";
import { KeyManager } from './KeyManager';
import {selection} from "d3";

//
// init all components for a simulation
//
const cyberspace = new Cyberspace('sceneCanvas', 'simDiv')
const sceneManager = cyberspace.getSceneManager()

initGlobalDebug()

KeyManager.setup()

function setInitialButtonState() { 
	UIManager.programControlButton.setInitialState()
	UIManager.physicsSimControlButton.setInitialState()
	const scene = cyberspace.getScene()
	if (scene.getSpeedUpFactor() > scene.getMinSpeedUpFactor()) { 
		UIManager.simSpeedUpButton.setState("normalSpeed")
	} else {
		UIManager.simSpeedUpButton.setState("fastForward")
	}
	UIManager.showScoreButton.setInitialState()
}


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

export function setPause() {
	// TODO: Pause of stop?
	cyberspace.pausePrograms()
}


sceneManager.registerScene(...cyberspaceScenes)

// switch to first scene
cyberspace.switchToNextScene(true)
buildSceneMenu();

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
	PROGRAM.runInSim(GUISTATE_C.getProgramName(), configName, xmlTextProgram, xmlConfigText, language, function (result: RobertaRobotSetupData) {
		callback(result);
	});
}

/**
 * Sets the same `robertaSetupData` for each robot.
 * @param robertaSetupData The roberta setup data
 */
function setSameSetupData(robertaSetupData: RobertaRobotSetupData) {
	const setupDataList = Array.from<RobertaRobotSetupData>({ length: cyberspace.robotCount() }).fill(robertaSetupData)
	cyberspace.setRobertaRobotSetupData(setupDataList, GUISTATE_C.getRobotGroup())

}

function simulateProgram(callback?: () => void) {
	// TODO: use proper 'this' type
	requestSimAssemblyForProgram(function (this: any, result) {
		if (result.rc == 'ok') {
			MSG.displayMessage('MESSAGE_EDIT_START', 'TOAST', GUISTATE_C.getProgramName(), undefined, undefined);

			setSameSetupData(result)

			// setting the robot data might reset the scene since the configuration has changed
			cyberspace.getScene().runAfterLoading(() => {
				cyberspace.startPrograms()
				callback?.call(this)
			})
		} else {
			MSG.displayInformation(result, '', result.message, '', undefined);
		}
	});
}

// Button
UIManager.programControlButton.onClick( state => {

	// TODO: Add proper multi robot support
	if (cyberspace.robotCount() <= 1 || true) {

		if (state == "start") {
			Blockly.hideChaff();
			NN_CTRL.mkNNfromNNStepData();

			simulateProgram()

		} else {

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
	setInitialButtonState()
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
	let description = cyberspace.switchToNextScene()
	sceneMenuSelect(description.ID)
})


const INITIAL_WIDTH = 0.5;

function openSimulationView() {
	requestSimAssemblyForProgram(result => {
		if (result.rc == 'ok') {
			setSameSetupData(result)

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
		updateDebugButtons()
	}
})

function toggleModal(id: string, position: JQuery.Coordinates) {
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

UIManager.closeParentsButton.onClick(function (this: HTMLElement) {
	$($(this).parents('.simWindow:first')).animate({
		'opacity': 'hide',
		'top': 'hide'
	}, 300)
})

UIManager.simDebugViewButton.onClick(() => {
	const position = $('#simDiv').position();
	position.left = $(window).width()!! - ($('#simValuesModal').width()!! + 12);
	toggleModal('#simValuesModal', position);
})

function startProgramIfRequired(callback: () => void) {
	const program = BlocklyDebug.getInstance().getWorkspaceProgram()
	if(!program || program.isTerminated()) {
		simulateProgram(callback)
	} else {
		cyberspace.startPrograms()
		callback()
	}
}

UIManager.debugStepOverButton.onClick(() => {
	startProgramIfRequired(() => {
		const program = BlocklyDebug.getInstance().getWorkspaceProgram()
		program?.interpreterAddEvent(CONST.default.DEBUG_STEP_OVER)
	})
})

UIManager.debugStepIntoButton.onClick(() => {
	startProgramIfRequired(() => {
		const program = BlocklyDebug.getInstance().getWorkspaceProgram()
		program?.interpreterAddEvent(CONST.default.DEBUG_STEP_INTO)
	})
})

function updateDebugButtons() {
	if(cyberspace.isDebugMode()) {
		UIManager.debugStepIntoButton.show()
		UIManager.debugStepOverButton.show()
		UIManager.debugStepBreakPointButton.show()
		UIManager.debugVariablesButton.show()
	} else {
		UIManager.debugStepIntoButton.hide()
		UIManager.debugStepOverButton.hide()
		UIManager.debugStepBreakPointButton.hide()
		UIManager.debugVariablesButton.hide()
	}
}

updateDebugButtons() // on init

UIManager.simDebugMode.onClick(() => {
	cyberspace.setDebugMode(!cyberspace.isDebugMode())
	updateDebugButtons()
})

UIManager.debugStepBreakPointButton.onClick(() => {
	startProgramIfRequired(() => {
		const program = BlocklyDebug.getInstance().getWorkspaceProgram()
		program?.interpreterAddEvent(CONST.default.DEBUG_BREAKPOINT)
	})
})

UIManager.debugVariablesButton.onClick(() => {
	const position = $('#simDiv').position();
	position.left = $(window).width()!! - ($('#simVariablesModal').width()!! + 12);
	toggleModal('#simVariablesModal', position);
})

function buildSceneMenu() {
	_buildSceneMenu('#simSelectionMenuContentSmall', '_small_Menu_');
	_buildSceneMenu('#simSelectionMenuContent', '');

	let scenes = cyberspace.getScenes()

	if(scenes.length > 0) {
		sceneMenuSelect(scenes[0].ID)
	}
}


function _buildSceneMenu(menu: string, addString: string) {
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

function sceneMenuSelect(sceneID: string) {
	$('.modal').modal('hide') // remove modal
	$('.menuSim').parent().removeClass('disabled') // enable all items in list
	$("#simButtonsCollapse").collapse('hide') // collapse popup list

	$('#'+sceneID).parent().addClass('disabled')
	$('#'+sceneID+'_small_Menu_').parent().addClass('disabled')
}

$('.sim-nav').onWrap('click', 'li:not(.disabled) a', function(event) {
	const name = event.target.id.replace('_small_Menu_', '')
	cyberspace.loadScene(name)
	sceneMenuSelect(name)
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