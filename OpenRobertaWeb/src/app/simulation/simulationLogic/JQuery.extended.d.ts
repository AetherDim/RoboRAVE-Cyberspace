
interface JQuery {
	onWrap(event: string, callbackOrFilter: ((jQuery: JQuery<HTMLElement>) => void) | string, callbackOrMessage: Function | string, optMessage?: string): void
	closeRightView(func: () => void): void
	openRightView(viewName: string, initialViewWidth: number, callBack?: (() => void)|string): void
	draggable(whatever: any): void
	draggable(): void
}
