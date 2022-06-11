import * as C from './interpreter.constants';
import { SensorMode } from './Robot/RobotHardwareState';


type OperationCode =
	typeof C.JUMP |
	typeof C.ASSIGN_STMT |
	typeof C.POP |
	typeof C.CLEAR_DISPLAY_ACTION |
	typeof C.CREATE_DEBUG_ACTION |
	typeof C.EXPR |
	typeof C.GET_SAMPLE |
	typeof C.NN_STEP_STMT |
	typeof C.NN_CHANGEWEIGHT_STMT |
	typeof C.NN_CHANGEBIAS_STMT |
	typeof C.LED_ON_ACTION |
	typeof C.RETURN |
	typeof C.MOTOR_ON_ACTION |
	typeof C.DRIVE_ACTION |
	typeof C.TURN_ACTION |
	typeof C.CURVE_ACTION |
	typeof C.STOP_DRIVE |
	typeof C.BOTH_MOTORS_ON_ACTION |
	typeof C.MOTOR_STOP |
	typeof C.MOTOR_SET_POWER |
	typeof C.MOTOR_GET_POWER |
	typeof C.SHOW_TEXT_ACTION |
	typeof C.SHOW_IMAGE_ACTION |
	typeof C.DISPLAY_SET_BRIGHTNESS_ACTION |
	typeof C.IMAGE_SHIFT_ACTION |
	typeof C.DISPLAY_SET_PIXEL_BRIGHTNESS_ACTION |
	typeof C.DISPLAY_GET_PIXEL_BRIGHTNESS_ACTION |
	typeof C.LIGHT_ACTION |
	typeof C.STATUS_LIGHT_ACTION |
	typeof C.STOP |
	typeof C.TEXT_JOIN |
	typeof C.TIMER_SENSOR_RESET |
	typeof C.ENCODER_SENSOR_RESET |
	typeof C.GYRO_SENSOR_RESET |
	typeof C.TONE_ACTION |
	typeof C.PLAY_FILE_ACTION |
	typeof C.SET_VOLUME_ACTION |
	typeof C.GET_VOLUME |
	typeof C.SET_LANGUAGE_ACTION |
	typeof C.SAY_TEXT_ACTION |
	typeof C.UNBIND_VAR |
	typeof C.VAR_DECLARATION |
	typeof C.WAIT_TIME_STMT |
	typeof C.WRITE_PIN_ACTION |
	typeof C.LIST_OPERATION |
	typeof C.TEXT_APPEND |
	typeof C.MATH_CHANGE |
	typeof C.DEBUG_ACTION |
	typeof C.ASSERT_ACTION |
	typeof C.COMMENT

export type InterpreterConst = typeof C

export type ExpressionKind =
	typeof C.VAR |
	typeof C.NUM_CONST |
	typeof C.CREATE_LIST |
	typeof C.CREATE_LIST_REPEAT |
	typeof C.BOOL_CONST |
	typeof C.STRING_CONST |
	typeof C.COLOR_CONST |
	typeof C.IMAGE |
	typeof C.RGB_COLOR_CONST |
	typeof C.UNARY |
	typeof C.MATH_CONST |
	typeof C.NN_GETOUTPUTNEURON_VAL |
	typeof C.SINGLE_FUNCTION |
	typeof C.MATH_CONSTRAIN_FUNCTION |
	typeof C.RANDOM_INT |
	typeof C.RANDOM_DOUBLE |
	typeof C.MATH_PROP_FUNCT |
	typeof C.MATH_ON_LIST |
	typeof C.CAST_STRING |
	typeof C.CAST_CHAR |
	typeof C.CAST_STRING_NUMBER |
	typeof C.CAST_CHAR_NUMBER |
	typeof C.LIST_OPERATION |
	typeof C.BINARY

export type UnarySubOperation =
	typeof C.NOT |
	typeof C.NEG

export type MathConst =
	'PI' |
	'E' |
	'GOLDEN_RATIO' |
	'SQRT2' |
	'SQRT1_2' |
	'INFINITY'

export type SingleFunction =
	'SQUARE' |
	'ROOT' |
	'ABS' |
	'LN' |
	'LOG10' |
	'EXP' |
	'POW10' |
	'SIN' |
	'COS' |
	'TAN' |
	'ASIN' |
	'ATAN' |
	'ACOS' |
	'ROUND' |
	'ROUNDUP' |
	'ROUNDDOWN' |
	typeof C.IMAGE_INVERT_ACTION

export type MathIntegerFunction =
	'EVEN' |
	'ODD' |
	'PRIME' |
	'WHOLE' |
	'POSITIVE' |
	'NEGATIVE' |
	'DIVISIBLE_BY'

export type MathOnList =
	typeof C.SUM |
	typeof C.MIN |
	typeof C.MAX |
	typeof C.AVERAGE |
	typeof C.MEDIAN |
	typeof C.STD_DEV |
	typeof C.RANDOM

export type ListOperation =
	typeof C.LIST_IS_EMPTY |
	typeof C.LIST_LENGTH |
	typeof C.LIST_FIND_ITEM |
	typeof C.GET |
	typeof C.REMOVE |
	typeof C.GET_REMOVE |
	typeof C.LIST_GET_SUBLIST

export type ArrayPosition =
	InterpreterConst["LAST" | "FIRST" | "FROM_END" | "FROM_START"]

export type ImageShiftDirection =
	"up" | "down" | "left" | "right"

export type Statement = {
	opc: OperationCode
	"+": string[]
	"-": string[]
	conditional: typeof C.ALWAYS | boolean
	target: number | InterpreterConst["METHOD_CALL"]
	name: string
	GetSample: string
	port: number
	mode: SensorMode
	arg1: number
	arg2: number
	FROM: String
	TO: String
	CHANGE: String
	values: boolean
	speedOnly: boolean
	motorDuration: InterpreterConst["DEGREE" | "DISTANCE" | "ROTATIONS"]
	SetTime: boolean
	driveDirection: InterpreterConst["FOREWARD" | "BACKWARD"]
	turnDirection: InterpreterConst["LEFT" | "RIGHT"]
	portA: string
	portB: string
	image: any
	direction: ImageShiftDirection
	color: string
	NUMBER: number
	file: string
	language: string
	pin: number
	op:
	InterpreterConst["SET" | "INSERT"] |
	UnarySubOperation |
	SingleFunction |
	MathOnList
	position: ArrayPosition | ArrayPosition[]
	msg: string
	expr: ExpressionKind
	value: MathConst
	/** breakpoint ids */
	possibleDebugStop?: string[]
}