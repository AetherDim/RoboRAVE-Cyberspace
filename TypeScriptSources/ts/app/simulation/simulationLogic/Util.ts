import { Vector } from "matter-js"
import { RobotProgram } from "./Robot/RobotProgram"

export type StringMap<V> = { [key: string]: V | undefined }
export type NumberMap<V> = { [key: number]: V | undefined }

export type UnpackArray<T> = T extends readonly (infer U)[] ? U : never
export type UnpackArrayProperties<T> = { [k in keyof T]: UnpackArray<T[k]> }

export type NumberIndexed<T extends unknown[] | undefined | null> = T extends unknown[] ? T[number] : T

/**
 * expands object types one level deep
 * 
 * see https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * expands object types recursively
 * 
 * see https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type
 */
export type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;


export type Equal<T, U> =
	T extends U
		? U extends T
			? unknown
			: never
		: never

export type NotEqual<T, U> =
	T extends U
		? U extends T
			? never
			: unknown
		: unknown

// see https://stackoverflow.com/questions/57016728/is-there-a-way-to-define-type-for-array-with-unique-items-in-typescript
export type TupleContains<A extends readonly unknown[], E> =
	{
		[k in keyof A]: Equal<A[k], E>
	}[number]

export type Invalid<T> = Error & { __errorMessage: T }

export type UniqueTupleElements<A extends ReadonlyArray<any>> = {
	[k1 in keyof A]:
		unknown extends {
			[k2 in keyof A]:
				k1 extends k2
					? never
					: Equal<A[k1], A[k2]>
		}[number] ? Invalid<[A[k1], "is repeated"]> : A[k1]
}

export type AsUniqueArray<
  A extends ReadonlyArray<any>,
  B extends ReadonlyArray<any>
> = {
  [I in keyof A]: unknown extends {
    [J in keyof B]: J extends I ? never : B[J] extends A[I] ? unknown : never
  }[number]
    ? Invalid<[A[I], "is repeated"]>
    : A[I]
};

export type Narrowable =
  | string
  | number
  | boolean
  | object
  | null
  | undefined
  | symbol;

export const asUniqueArray = <
  N extends Narrowable,
  A extends [] | ReadonlyArray<N> & AsUniqueArray<A, A>
>(
  a: A
) => a;


function applyRestrictedKey<T, KeyType>(type: T, key: RestrictedKeys<T, KeyType>): KeyType {
	return type[key] as unknown as KeyType
}


/**
 * Converts a tuple of array types to a tuple of the normal types [string[], number[], "test"[]] to [string, number, test]
 */
export type TupleUnpackArray<T extends readonly any[]> = { [k in keyof T]: UnpackArray<T[k]>} 
// // equivalent implementation
// export type TupleUnpackArray<T extends readonly any[]> =
// 	T extends [infer First, ... infer Rest]
// 		? [UnpackArray<First>, ...TupleUnpackArray<Rest>]
// 		: T extends [infer First]
// 			? UnpackArray<First>
// 			: []

/**
 * Returns a type which describes all keys of `T` which extend `KeyType`
 * 
 * adapted from https://stackoverflow.com/questions/46139715/typescript-keyof-extra-type-condition
 */ 
type RestrictedKeys<T, KeyType> = { [k in keyof T]: T[k] extends KeyType ? k : never }[keyof T]
type RestrictedKeysType<T, KeyType> = { [k in keyof T]: T[k] extends KeyType ? T[k] : never }

export class Util {

	// TODO: Remove this static variable
	static simulation: {
		storedPrograms: RobotProgram[],
		storedRobotType: string
	} = {
		storedPrograms: [],
		storedRobotType: ""
	}

	static safeIndexing<T extends unknown[] | undefined>(value: T, index: number): NumberIndexed<T> {
		if (value == undefined) {
			return undefined as NumberIndexed<T>
		} else {
			return value[index] as NumberIndexed<T>
		}
	}

	/**
	 * Equality into the object.
	 * 
	 * @see https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects
	 */
	static deepEqual(x: any, y: any): boolean {
		return (x && y && typeof x === 'object' && typeof y === 'object') ?
		  (Object.keys(x).length === Object.keys(y).length) &&
			Object.keys(x).reduce<boolean>((isEqual, key) =>
				isEqual && Util.deepEqual(x[key], y[key])
			, true) : (x === y);
	  }

	/**
	 * Returns an array of numbers starting from 'start' to (inclusive) 'end' with a step size 'step' 
	 * 
	 * @param start inclusive start of range
	 * @param end inclusive end of range
	 * @param step the step size of the range
	 */
	static closedRange(start: number, end: number, step: number = 1) {
		const ans: number[] = [];
		for (let i = start; i <= end; i += step) {
			ans.push(i);
		}
		return ans;
	}

	/**
	 * Returns an array of numbers starting from 'start' to (exclusive) 'end' with a step size 'step' 
	 * 
	 * @param start inclusive start of range
	 * @param end exclusive end of range
	 * @param step the step size of the range
	 */
	static range(start: number, end: number, step: number = 1) {
		const ans: number[] = [];
		for (let i = start; i < end; i += step) {
			ans.push(i);
		}
		return ans;
	}

	/**
	 * Convert radians to degrees
	 */
	static toDegrees(radians: number): number {
		return radians / Math.PI * 180
	}

	/**
	 * Convert degrees to radians
	 */
	 static toRadians(degrees: number): number {
		return degrees / 180 * Math.PI
	}

	/**
	 * Returns `sign(x)` if `abs(x) <= width` otherwise `x/width`.
	 * 
	 * @param x the number
	 * @param width the width of the linear region
	 */
	static continuousSign(x: number, width: number) {
		if (Math.abs(x) >= width) {
			return Math.sign(x)
		}
		return x / width
	}

	/**
	 * Use this function in the `default` block of a `switch` to check that `value` is of type `never` i.e. this function is never reached.
	 * 
	 * @param value the value which is switched over
	 */
	static exhaustiveSwitch(value: never): never {
		throw new Error(`The value ${value} was not exhaustively switched over`)
	}

	/**
	 * Shuffles array in place. ES6 version
	 * @param {Array} a items An array containing the items.
	 * @returns in-place shuffled array
	 * @see https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
	 */
	static shuffle<T>(a: T[]): T[] {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]]
		}
		return a
	}

	/**
	 * Generate a unique ID.  This should be globally unique.
	 * 87 characters ^ 20 length > 128 bits (better than a UUID).
	 * @return {string} A globally unique ID string.
	 */
	static genUid(): string {
		const length = 20;
		const soupLength = Util.soup_.length;
		const id: string[] = [];
		for (let i = 0; i < length; i++) {
			id[i] = Util.soup_.charAt(Math.random() * soupLength);
		}
		return id.join('');
	};
  
	/**
	 * Legal characters for the unique ID.  Should be all on a US keyboard.
	 * No characters that conflict with XML or JSON.  Requests to remove additional
	 * 'problematic' characters from this soup will be denied.  That's your failure
	 * to properly escape in your own environment.  Issues #251, #625, #682, #1304.
	 * @private
	 */
	private static soup_ = '!#$%()*+,-./:;=?@[]^_`{|}~' +
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	static flattenArray<T>(array: T[][]): T[] {
		const result: T[] = []
		for (let i = 0; i < array.length; i++) {
			const count = array[i].length
			for (let j = 0; j < count; j++) {
				result.push(array[i][j])
			}
		}
		return result
	}

	static pushAll<T>(array: T[], otherArray: T[]) {
		for (let i = 0; i < otherArray.length; i++) {
			array.push(otherArray[i])
		}
	}

	// // unique tuple elements
	// static test<
	// 	N extends Narrowable,
	// 	A extends ReadonlyArray<N> & UniqueTupleElements<A>
	// >(key: A) {

	// }

	/**
	 * Returns a list of all possible tuples/lists whose i-th element is from `list[i]`.
	 * 
	 * i.e.`[[list[0][0],list[1][0], list[2][0],...], [list[0][1],list[1][0], list[2][0],...], ...]`
	 */
	static anyTuples(list: any[][]): any[][] {
		if (list.length == 0) {
			return list
		} else if (list.length == 1) {
			return list[0].map(e => [e])
		} else {
			const result: any[][] = []
			for (const value of list[list.length - 1]) {
				let val = Util.anyTuples(list.slice(0, -1)).map(tuple =>
					tuple.concat(value)
				)
				Util.pushAll(result, val)
			}
			return result
		}
	}

	/**
	 * Returns a list of all possible tuples/lists whose i-th element is from `list[i]`.
	 * 
	 * i.e.`[[list[0][0],list[1][0], list[2][0],...], [list[0][1],list[1][0], list[2][0],...], ...]`
	 */
	static tuples<T extends readonly (readonly any[])[]>(list: T): TupleUnpackArray<T>[] {
		return Util.anyTuples(list as any as any[][]) as any as TupleUnpackArray<T>[]
	}

	static strictPropertiesTuples<
		T, 
		Key extends RestrictedKeys<T, any[]>,
		Keys extends [] | ReadonlyArray<Key> & UniqueTupleElements<Keys>
	>(type: T, keys: Keys): Expand<UnpackArrayProperties<Pick<T, Key>>>[] {
		for (let i = 0; i < keys.length; i++) {
			for (let j = i + 1; j < keys.length; j++) {
				if (keys[i] === keys[j]) {
					console.error("The property name ("+keys[i]+") is duplicate")
				}
			}
		}
		const values = (keys as Key[]).map(key => applyRestrictedKey<T, any[]>(type, key))
		const tuples = Util.anyTuples(values)
		return tuples.map(tuple => {
			const obj: any = {}
			for (let i = 0; i < keys.length; i++) {
				obj[keys[i]] = tuple[i]
			}
			return obj as Expand<UnpackArrayProperties<Pick<T, Key>>>
		})
	}

	static propertiesTuples<T, Keys extends RestrictedKeys<T, any[]>>(type: T, keys: Keys[]): Expand<UnpackArrayProperties<Pick<T, Keys>>>[] {
		for (let i = 0; i < keys.length; i++) {
			for (let j = i + 1; j < keys.length; j++) {
				if (keys[i] === keys[j]) {
					console.error("The property name ("+keys[i]+") is duplicate")
				}
			}
		}
		const values = keys.map(key => applyRestrictedKey<T, any[]>(type, key))
		const tuples = Util.anyTuples(values)
		return tuples.map(tuple => {
			const obj: any = {}
			for (let i = 0; i < keys.length; i++) {
				obj[keys[i]] = tuple[i]
			}
			return obj as Expand<UnpackArrayProperties<Pick<T, Keys>>>
		})
	}

	static allPropertiesTuples<T extends { [k in keyof T]: readonly any[] }>(type: T): Expand<UnpackArrayProperties<T>>[] {
		const keys = Object.keys(type) as RestrictedKeys<T, any[]>[]
		return Util.propertiesTuples(type, keys)
	}

	/**
	 * @param time in seconds
	 * @see https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
	 * @returns A string of the format "HH:MM:SS"
	 */
	static toHHMMSS(time: number): string {
		const sec_num = time
		const hours = Math.floor(sec_num / 3600)
		const minutes = Math.floor((sec_num - (hours * 3600)) / 60)
		const seconds = sec_num - (hours * 3600) - (minutes * 60)
	
		return [hours, minutes, seconds].map(t => t < 10 ? "0" + t : String(t)).join(":")
	}

	/**
	 * @param time in seconds
	 * @returns A string of the form "4d 5h 6m 7.8s"
	 */
	static toTimeString(time: number): string {
		let sec = time
		const days = Math.floor(sec / 86400)
		sec -= days * 86400
		const hours = Math.floor(sec / 3600)
		sec -= hours * 3600
		const minutes = Math.floor(sec / 60)
		sec -= minutes * 60
		const seconds = sec

		let string = ""
		let forceAdd = false
		for (const value of [[days, "d "], [hours, "h "], [minutes, "m "], [seconds, "s"]] as const) {
			if (value[0] != 0 || forceAdd) {
				forceAdd = true
				string += value[0] + value[1]
			}
		}
		return string
	}

	static nonNullObjectValues<T>(value: { [s: string]: T } | ArrayLike<T>): NonNullable<T>[] {
		const values = Object.values(value)
		const result: NonNullable<T>[] = []
		for (const element of values) {
			if (element !== undefined && element !== null) {
				result.push(element as NonNullable<T>)
			}
		}
		return result
	}

	static mapNotNull<T, U>(array: T[], transform: (element: T) => (U | null | undefined)): U[] {
		const result: U[] = []
		for (const element of array) {
			const transformedElement = transform(element)
			if (transformedElement != null && transformedElement != undefined) {
				result.push(transformedElement)
			}
		}
		return result
	}

	static getOptions<T>(init: new () => T, someOptions?: Partial<T>): T {
		const options =  new init()
		if (someOptions != undefined) {
			Object.assign(options, someOptions)
		}
		return options
	}

	/**
	 * @param array Array where the first occurrence of `element` will be removed
	 * @param element The element which will bew removed from `array`
	 * @returns `true` if the element was removed
	 */
	static removeFromArray<T>(array: T[], element: T): boolean {
		const index = array.indexOf(element, 0);
		if (index > -1) {
			array.splice(index, 1)
			return true
		}
		return false
	}

	static stringReplaceAll(string: string, searchValue: string | RegExp, replacement: string): string {
		return string.split(searchValue).join(string)
	}

	static vectorEqual(v1: Vector, v2: Vector): boolean {
		return v1.x === v2.x && v1.y === v2.y
	}

	static vectorAdd(v1: Vector, v2: Vector): Vector {
		return { x: v1.x + v2.x, y: v1.y + v2.y}
	}

	static vectorSub(v1: Vector, v2: Vector): Vector {
		return { x: v1.x - v2.x, y: v1.y - v2.y}
	}

	static vectorDistance(v1: Vector, v2: Vector): number {
		const dx = v1.x - v2.x
		const dy = v1.y - v2.y
		return Math.sqrt(dx*dx + dy*dy)
	}

	static vectorDistanceSquared(v1: Vector, v2: Vector): number {
		const dx = v1.x - v2.x
		const dy = v1.y - v2.y
		return dx*dx + dy*dy
	}

	/**
	 * returns the pixel ratio of this device
	 */
	static getPixelRatio() {
		return window.devicePixelRatio || 0.75; // 0.75 is default for old browsers
	}

	static cloneVector(value: Vector): Vector {
		return { x: value.x, y: value.y }
	}

}