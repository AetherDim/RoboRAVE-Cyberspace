
/**
 * 
 * @param start Start number (has to be an integer)
 * @param end End number (has to be an integer)
 * @returns A random integer in the interval `[start, end]`
 * @note If the interval `[start, end]` is empty or `start` or `end` is not an integer it logs an assert
 */
export function randomIntBetween(start: number, end: number) {
	console.assert(start <= end)
	console.assert(start == Math.floor(start))
	console.assert(end == Math.floor(end))
	return Math.floor(Math.random() * (end - start + 1)) + start;
}

export function randomBool() {
	return Math.random() >= 0.5;
}

export function randomWeightedBool(a:number, b:number) {
	return Math.random() < a/(a+b);
}