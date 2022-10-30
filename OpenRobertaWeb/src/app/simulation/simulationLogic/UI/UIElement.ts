import { Utils } from "../Utils"

export class UIElement {

	readonly jQueryString?: string
	jQueryHTMLElement: JQuery<HTMLElement>

	constructor(arg: { id: string } | { jQueryString: string} | { jQuery: JQuery, jQueryString?: string }) {
		if (Utils.containsAllKeys(arg, ["id"])) {
			this.jQueryString = "#" + arg.id
			this.jQueryHTMLElement = $(this.jQueryString)
		} else if (Utils.containsAllKeys(arg, ["jQuery"])) {
			this.jQueryString = arg.jQueryString
			this.jQueryHTMLElement = arg.jQuery
		} else if (Utils.containsAllKeys(arg, ["jQueryString"])) {
			this.jQueryString = arg.jQueryString
			this.jQueryHTMLElement = $(this.jQueryString)
		} else {
			throw new Error("Missing state")
		}
	}

	hide() {
		this.jQueryHTMLElement.addClass("hide")
	}

	show() {
		this.jQueryHTMLElement.removeClass("hide")
	}
 
}