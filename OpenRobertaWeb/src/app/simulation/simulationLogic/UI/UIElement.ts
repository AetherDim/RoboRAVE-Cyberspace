
export class UIElement {

	readonly id?: string
	jQueryHTMLElement: JQuery<HTMLElement>

	constructor(jQueryHTMLElement: JQuery<HTMLElement>, id?: string) {
		this.jQueryHTMLElement = jQueryHTMLElement
		this.id = id
	}

	static fromID(id: string): UIElement {
		return new UIElement($("#" + id))
	}

	hide() {
		this.jQueryHTMLElement.addClass("hide")
	}

	show() {
		this.jQueryHTMLElement.removeClass("hide")
	}
 
}