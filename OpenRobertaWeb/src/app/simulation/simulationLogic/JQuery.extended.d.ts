
interface JQuery {
	onWrap<Event extends string>(
		event: Event,
		callbackOrFilter: ((jQuery: JQuery<HTMLElement>) => void) | string,
		callbackOrMessage: JQuery.TypeEventHandler<HTMLElement, undefined, any, any, Event> | string,
		optMessage?: string): void
	closeRightView(func: () => void): void
	openRightView(viewName: string, initialViewWidth: number, callBack?: (() => void)|string): void
	draggable(whatever: any): void
	draggable(): void
}
