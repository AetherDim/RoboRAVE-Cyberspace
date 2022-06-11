import { StringMap } from "../Utils";

export type SensorMode = "angle" | "leftReset" | "rightReset"
export type SensorName = keyof HardwareState["sensors"] | "timer"
export type ActionType = keyof HardwareState["actions"]
export type HardwareState = {
	timers: StringMap<number> & { start: number }
	actions: {
		leds?: StringMap<{
			mode: "off" | "on",
			color?: string
		}>
		led?: {
			mode?: "off" | "on"
			// TODO: is it a number or a string
			color?: number | string
		}
		tone?: {
			frequency: number
			duration: number
		} | { 
			file: string
		}
		encoder?: {
			leftReset?: boolean
			rightReset?: boolean
		}
		volume?: number
		language?: string
		sayText?: {
			text: string
			speed: number
			pitch: number
		}
		/** motors[port] returns speed */
		motors?: StringMap<number>
		display?: {
			text?: string
			x?: number
			y?: number
			picture?: any
			mode?: string
			brightness?: number
			clear?: boolean
			pixel?: {
				x: number
				y: number
				brightness: number
			}
		}
		[key : `pin${any}`]: StringMap<number>
	}
	/** sensors[sensorName][port] */
	sensors: {
		color?: StringMap<{
			ambientlight: number,
			colorValue: string,
			colour: string,
			/** brightness in precent from 0 to 100 */
			light: number,
			/** array of [red, green, blue] values in the range 0 to 255 */
			rgb: number[]
		}>
		encoder?: {
			left: number,
			right: number
		},
		gyro?: StringMap<{
			/** angle in degrees */
			angle: number,
			/** angular velocity? in degrees/second */
			rate: number
		}>
		ultrasonic?: StringMap<{
			/** distance in cm */
			distance: number,
			presence: boolean
		}>
		display?: {
			pixel: number[][]
		}
		infrared?: StringMap<{
			/** distance in cm */
			distance: number,
			presence: boolean
		}>
		touch?: StringMap<boolean>
	}
	volume: number,
	/** Port to speed */
	motors: StringMap<number>,
	angleReset: StringMap<number>
}