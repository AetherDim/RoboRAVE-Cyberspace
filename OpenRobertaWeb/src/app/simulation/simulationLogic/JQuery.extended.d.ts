
interface JQuery {
	onWrap(event: string, callbackOrFilter: Function | string, callbackOrMessage: Function | string, optMessage?: string): void
	closeRightView(func: () => void)
	openRightView(viewName: string, initialViewWidth: number, callBack?: (() => void)|string)
}
