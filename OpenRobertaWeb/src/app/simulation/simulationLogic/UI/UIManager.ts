import Blockly = require("blockly");
import { UnionToTuple } from "../Utils";
import { UIElement } from "./UIElement";

interface RobertaButtonSettings {
	class: string
	tooltip?: string
}

export class UIRobertaButton extends UIElement {

	/**
	 * Adds `clickHandler` to the html element as click handler
	 * 
	 * @param clickHandler will be called with the JQuery object of the `HTMLElement`.
	 * 
	 * @returns `this`
	 */
	onClick(clickHandler: (this: HTMLElement) => void): UIRobertaButton {
		this.jQueryHTMLElement.onWrap("click", clickHandler, this.jQueryString + " clicked")
		return this
	}

}

export class UIRobertaStateButton<T extends { [key in string]: RobertaButtonSettings }> extends UIElement {
	protected stateMappingObject: T
	protected state: keyof T
	readonly initialState: keyof T

	private stateChangeHandler?: (state: keyof T) => keyof T
	private clickHandlers: ((state: keyof T) => void)[] = []

	// TODO: Convert all the 'onWrap' js code to use the 'UIManager'
	// Workaround since 'onWrap' is not loaded initially
	private needsOnWrapHandler = true

	constructor(buttonID: string, initialState: keyof T, buttonSettingsState: T) {
		super({ id : buttonID })
		this.stateMappingObject = buttonSettingsState
		this.state = initialState
		this.initialState = initialState

		// TODO: Convert all the 'onWrap' js code to use the 'UIManager'
		// call 'setButtonEventHandler' only for buttons on which 'onClick' is called
		//this.setButtonEventHandler()
	}

	getState(): keyof T {
		return this.state
	}

	/**
	 * Tries to set the button event handler as long 'onWrap' is not definied for `JQuery`.
	 */
	private setButtonEventHandler() {
		if (!this.needsOnWrapHandler) {
			return
		}
		if (this.jQueryHTMLElement.onWrap !== undefined) {
			const t = this;
			this.jQueryHTMLElement.onWrap("click", () => {
				t.jQueryHTMLElement.removeClass(t.stateMappingObject[t.state].class)
				const state = t.state
				t.clickHandlers.forEach(handler => handler(state))
				t.state = t.stateChangeHandler?.(state) ?? state
				const buttonSettings = t.stateMappingObject[t.state]
				t.jQueryHTMLElement.addClass(buttonSettings.class)
				t.jQueryHTMLElement.attr("data-original-title", buttonSettings.tooltip ?? "");
			}, this.jQueryString + " clicked")
		} else {
			// workaround for onWrap not loaded
			setTimeout(() => this.setButtonEventHandler(), 200)
		}
	}

	setInitialState() {
		this.setState(this.initialState)
	}

	/**
	 * Set the state change handler.
	 * 
	 * @param stateChangeHandler will be called with the state in which the button is in **before** the state change.
	 * It returns the new button state.
	 * 
	 * @returns `this`
	 */
	setStateChangeHandler(stateChangeHandler: (state: keyof T) => keyof T): UIRobertaStateButton<T> {
		this.stateChangeHandler = stateChangeHandler
		return this
	}

	/**
	 * Adds `onClickHandler` to the click handler list.
	 * 
	 * @param onClickHandler will be called with the state in which the button is in **before** the state change.
	 * 
	 * @returns `this`
	 */
	onClick(onClickHandler: (state: keyof T) => void): UIRobertaStateButton<T> {
		// TODO: 'setButtonEventHandler' to the constructor if all 'onWrap' code is converted to TypeScript 
		this.setButtonEventHandler()
		this.clickHandlers.push(onClickHandler)
		return this
	}

	update() {
		// remove all classes in 'stateMappingObject'
		Object.values(this.stateMappingObject).forEach(buttonSettings =>
			this.jQueryHTMLElement.removeClass(buttonSettings.class))
		// add the state class
		const buttonSettings = this.stateMappingObject[this.state]
		this.jQueryHTMLElement.addClass(buttonSettings.class)
		this.jQueryHTMLElement.attr("data-original-title", buttonSettings.tooltip ?? "");
	}

	setState(state: keyof T) {
		this.state = state
		this.update()
	}
}

export type TwoProperties<T, PropertyType> =
	UnionToTuple<keyof T> extends [string, string]
		? { [key in string]: PropertyType }
		: never

export class UIRobertaToggleStateButton<T extends TwoProperties<T, RobertaButtonSettings>> extends UIRobertaStateButton<T> {

	constructor(buttonID: string, initialState: keyof T, buttonSettingsState: T) {
		super(buttonID, initialState, buttonSettingsState)
		this.setStateChangeHandler(state => {
			const keys = Object.keys(buttonSettingsState)
			return keys[keys.indexOf(state as string) == 0 ? 1 : 0]
		})
		this.setState(initialState)
	}

}

const BlocklyMsg: any = Blockly.Msg

export class UIManager {

	static readonly programControlButton = new UIRobertaToggleStateButton(
		"simControl", "start", {
			start: { class: "typcn-media-play", tooltip: BlocklyMsg.MENU_SIM_START_TOOLTIP },
			stop: { class: "typcn-media-stop", tooltip: BlocklyMsg.MENU_SIM_STOP_TOOLTIP }
		})

	static readonly physicsSimControlButton = new UIRobertaToggleStateButton(
		"simFLowControl", "stop", {
			start: { class: "typcn-flash-outline", tooltip: "Start simulation" },
			stop: { class: "typcn-flash", tooltip: "Stop simulation"}
		})
	
	static readonly showScoreButton = new UIRobertaToggleStateButton(
		"simScore", "showScore", {
			showScore: { class: "typcn-star" },
			hideScore: { class: "typcn-star-outline" },
		})
	
	static readonly simSpeedUpButton = new UIRobertaToggleStateButton(
		"simSpeedUp", "fastForward" , {
			fastForward: { class: "typcn-media-fast-forward-outline" },
			normalSpeed: { class: "typcn-media-fast-forward" }
		}
	)

	// simResetPose is handled by roberta itself
	static readonly resetSceneButton = new UIRobertaButton({ id: "simResetPose" })

	static readonly zoomOutButton = new UIRobertaButton({ id: "zoomOut" })
	static readonly zoomInButton = new UIRobertaButton({ id: "zoomIn" })
	static readonly zoomResetButton = new UIRobertaButton({ id: "zoomReset" })

	static readonly switchSceneButton = new UIRobertaButton({ id: "simScene" })

	// used for simDebugView and debugVariables view
	static readonly closeParentsButton = new UIRobertaButton({ jQueryString: ".simWindow .close" })

	static readonly simDebugViewButton = new UIRobertaButton({ id: "simValues" })

	static readonly simDebugMode = new UIRobertaButton({ id: "debugMode" })
	static readonly debugStepOverButton = new UIRobertaButton({ id: "simControlStepOver" })
	static readonly debugStepIntoButton = new UIRobertaButton({ id: "simControlStepInto" })
	static readonly debugStepBreakPointButton = new UIRobertaButton({ id: "simControlBreakPoint" })
	static readonly debugVariablesButton = new UIRobertaButton({ id: "simVariables" })


	static readonly simViewButton = new UIRobertaToggleStateButton("simButton", "open", {
		closed: { class: "" },
		open: { class: "" }
	})

}