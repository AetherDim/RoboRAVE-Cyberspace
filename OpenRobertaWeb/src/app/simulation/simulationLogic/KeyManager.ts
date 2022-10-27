

export class KeyManager {

	private static keyDownList = new Array<string>()

	static readonly keyDownHandler = new Array<(event: KeyboardEvent) => void>()
	static readonly keyUpHandler = new Array<(event: KeyboardEvent) => void>()

	static keyPressed(key: string): boolean {
		return this.keyDownList.includes(key)
	}
	static specialKeyPressed(key:
		"Alt" | "Shift" | "Meta" | "Control" |
		"ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"): boolean {
		return this.keyDownList.includes(key)
	}

	static setup() {
		window.addEventListener("keydown", event => {
			if (!KeyManager.keyDownList.includes(event.key)) {
				KeyManager.keyDownList.push(event.key)
			}
			KeyManager.keyDownHandler.forEach(handler => handler(event))
		})
		window.addEventListener("keyup", event => {
			KeyManager.keyDownList = KeyManager.keyDownList.filter(key => key != event.key)
			KeyManager.keyUpHandler.forEach(handler => handler(event))
		})
	}
}