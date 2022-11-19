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

class OrderedMap<T extends [unknown, unknown][]> {

	values: T
	constructor(values: T) {
		this.values = values
	}

	get(key: T[number][0]): T[number][1] | undefined {
		const index = this.indexOfKey(key)
		if (index == -1) {
			return undefined
		}
		return this.values[index][1]
	}

	contains(key: T[number][0]): boolean {
		return this.indexOfKey(key) != 1
	}

	set(key: T[number][0], value: T[number][1]) {
		if (this.contains(key)) {
			return
		}
		this.values.push([key, value])
	}

	indexOfKey(key: T[number][0]): number {
		return this.values.findIndex(keyValue => keyValue[0] == key)
	}
}

class ReadonlyOrderedMap<T extends readonly (readonly [unknown, unknown])[]> {

	keyValuePairs: T
	constructor(values: T) {
		this.keyValuePairs = values
	}

	get(key: T[number][0]): T[number][1] | undefined {
		const index = this.indexOfKey(key)
		if (index == -1) {
			return undefined
		}
		return this.keyValuePairs[index][1]
	}

	contains(key: T[number][0]): boolean {
		return this.indexOfKey(key) != 1
	}

	indexOfKey(key: T[number][0]): number {
		return this.keyValuePairs.findIndex(keyValue => keyValue[0] == key)
	}
}


/**
 * Use the state as an 'action' or actual 'state'. See `onClick`
 */
export class UIRobertaStateButton<State extends string> extends UIElement {

	protected stateMappingObject: ReadonlyOrderedMap<readonly (readonly [State, RobertaButtonSettings])[]>
	protected state: State
	readonly initialState: State

	private stateChangeHandler?: (state: State) => State
	/** 'oldState' is equivalent to 'action' */
	private clickHandlers: ((oldState: State, newState: State) => void)[] = []

	// TODO: Convert all the 'onWrap' js code to use the 'UIManager'
	// Workaround since 'onWrap' is not loaded initially
	private needsOnWrapHandler = true

	constructor(buttonID: string, initialState: State, buttonSettingsState: readonly (readonly [State, RobertaButtonSettings])[]) {
		super({ id : buttonID })
		this.stateMappingObject = new ReadonlyOrderedMap(buttonSettingsState)
		this.state = initialState
		this.initialState = initialState

		// TODO: Convert all the 'onWrap' js code to use the 'UIManager'
		// call 'setButtonEventHandler' only for buttons on which 'onClick' is called
		//this.setButtonEventHandler()
	}

	getState(): State {
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
			this.jQueryHTMLElement.onWrap("click", () => {
				
				const oldState = this.state
				const newState = this.stateChangeHandler?.(oldState) ?? oldState
				this.state = newState

				this.clickHandlers.forEach(handler => handler(oldState, newState))

				this.update()
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
	setStateChangeHandler(stateChangeHandler: (state: State) => State): UIRobertaStateButton<State> {
		this.stateChangeHandler = stateChangeHandler
		return this
	}

	/**
	 * Adds `onClickHandler` to the click handler list.
	 * One can use the 'action' which is the 'oldState' as a button action, or use 'newState' as the actual state.
	 * 
	 * @param onClickHandler will be called with the state in which the button is in **before** the state change.
	 * 
	 * @returns `this`
	 */
	onClick(onClickHandler: (action: State, newState: State) => void): UIRobertaStateButton<State> {
		// TODO: 'setButtonEventHandler' to the constructor if all 'onWrap' code is converted to TypeScript 
		this.setButtonEventHandler()
		this.clickHandlers.push(onClickHandler)
		return this
	}

	update() {
		// remove all classes in 'stateMappingObject'
		this.stateMappingObject.keyValuePairs.forEach(value =>
			this.jQueryHTMLElement.removeClass(value[1].class))
		// add the state class
		const buttonSettings = this.stateMappingObject.get(this.state)
		if (buttonSettings != undefined) {
			this.jQueryHTMLElement.addClass(buttonSettings.class)
			this.jQueryHTMLElement.attr("data-original-title", buttonSettings.tooltip ?? "");
		}
	}

	setState(state: State) {
		this.state = state
		this.update()
	}
}

export type TwoProperties<T, PropertyType> =
	UnionToTuple<keyof T> extends [string, string]
		? { [key in string]: PropertyType }
		: never

export class UIRobertaToggleStateButton<State extends string> extends UIRobertaStateButton<State> {

	static make<Initial extends State, State extends string>(
		buttonID: string,
		initialState: Initial,
		buttonSettingsState: readonly (readonly [State, RobertaButtonSettings])[],
	): UIRobertaStateButton<State> {
		const newButton = new UIRobertaToggleStateButton(buttonID, initialState, buttonSettingsState)
		newButton.setStateChangeHandler(state => {
			const index = newButton.stateMappingObject.indexOfKey(state) + 1
			const values = newButton.stateMappingObject.keyValuePairs
			return values[index % values.length][0]
		})
		newButton.setState(initialState)
		return newButton
	}

}

const BlocklyMsg: any = Blockly.Msg

export class UIManager {

	static readonly programControlButton = UIRobertaToggleStateButton.make(
		"simControl", "start", [
			["start", { class: "typcn-media-play", tooltip: BlocklyMsg.MENU_SIM_START_TOOLTIP }],
			["stop", { class: "typcn-media-stop", tooltip: BlocklyMsg.MENU_SIM_STOP_TOOLTIP }]
		] as const)

	static readonly physicsSimControlButton = UIRobertaToggleStateButton.make(
		"simFLowControl", "stop", [
			["start", { class: "typcn-flash-outline", tooltip: "Start simulation" }],
			["stop", { class: "typcn-flash", tooltip: "Stop simulation"}]
		] as const)
	
	static readonly showScoreButton = UIRobertaToggleStateButton.make(
		"simScore", "showScore", [
			["showScore", { class: "typcn-star" }],
			["hideScore", { class: "typcn-star-outline" }],
		] as const)
	
	static readonly simSpeedUpButton = UIRobertaToggleStateButton.make(
		"simSpeedUp", "fastForward" , [
			["normalSpeed", { class: "typcn-media-fast-forward-outline" }],
			["fastForward", { class: "typcn-media-fast-forward" }],
			["ultraFast", { class: "typcn-infinity-outline" }]
		] as const
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


	static readonly simViewButton = UIRobertaToggleStateButton.make("simButton", "open", [
		["closed", { class: "" }],
		["open", { class: "" }]
	] as const)

}