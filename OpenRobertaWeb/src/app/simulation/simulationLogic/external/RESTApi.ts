import { randomBool } from "../Random";
import { DEBUG } from "./../GlobalDebug";

type HTTPRequestEventHandler = (this: XMLHttpRequest, ev: ProgressEvent<XMLHttpRequestEventTarget>) => void

function httpAsync(req: string, url: string, data: string|undefined,
	transferComplete: HTTPRequestEventHandler,
	error: HTTPRequestEventHandler,
	abort: HTTPRequestEventHandler)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open(req, url, true);
	xmlHttp.setRequestHeader('Content-Type', 'application/json');
	xmlHttp.addEventListener("load", transferComplete);
	xmlHttp.addEventListener("error", error);
	xmlHttp.addEventListener("abort", abort);
	xmlHttp.send(data);
}

function httpPostAsync(url: string, data: string,
	transferComplete: HTTPRequestEventHandler,
	error: HTTPRequestEventHandler,
	abort: HTTPRequestEventHandler)
{
	httpAsync("POST", url, data, transferComplete, error, abort)
}

function httpGetAsync(url: string,
	transferComplete: HTTPRequestEventHandler,
	error: HTTPRequestEventHandler,
	abort: HTTPRequestEventHandler)
{
	httpAsync("GET", url, undefined, transferComplete, error, abort)
}


let PROGRAMS_URL = "/sqlrest/programs"
let SET_SCORE_URL = "/sqlrest/setScore"
let GET_STATUS_URL = "/sqlrest/state"
let GET_RANDOM_JOUSTING_PROGRAM = "/sqlrest/getjousting"

if ((location.hostname === "localhost" || location.hostname === "127.0.0.1") && DEBUG) {
	let DEBUG_ADDRESS = "https://dev.cyberspace.roborave.de"
	PROGRAMS_URL = DEBUG_ADDRESS + PROGRAMS_URL
	SET_SCORE_URL = DEBUG_ADDRESS + SET_SCORE_URL
	GET_STATUS_URL = DEBUG_ADDRESS + GET_STATUS_URL
	GET_RANDOM_JOUSTING_PROGRAM = DEBUG_ADDRESS + GET_RANDOM_JOUSTING_PROGRAM
}

export interface ProgramSQLEntry {
	/** challenge id / scene id */
	challenge: number
	agegroup: number
	/** program URL */
	program: string
	comment: string
	/** timestamp in the format JJJJ-MM-DDThh:mm:ss.000Z e.g. 2020-10-04T17:13:42.000Z */
	timestamp: string
	/** name of the team */
	name: string
	/** id of the program ??????????????????????? */
	id: number
}

export function sendRESTRequest(url: string, programRequest: ProgramsRequest|SetScoreRequest, callback: (programsResult?: ProgramsRequestResult) => void) {
	function transferComplete(this: XMLHttpRequest) {
		try {
			const response = JSON.parse(this.responseText) as ProgramsRequestResult
			callback(response)

			// callback(randomBool() ? response : undefined)
		} catch {
			callback(undefined)
		}
	}
	function onError(this: XMLHttpRequest, ev: ProgressEvent<XMLHttpRequestEventTarget>) {
		callback()
	}
	httpPostAsync(url, JSON.stringify(programRequest), transferComplete, onError, onError)
}

export function sendProgramRequest(programRequest: ProgramsRequest, callback: (programsResult?: ProgramsRequestResult) => void) {
	sendRESTRequest(PROGRAMS_URL, programRequest, callback)
}

export function sendStateRequest(callback: (programsResult?: ProgramsRequestResult) => void) {
	function transferComplete(this: XMLHttpRequest) {
		try {
			const response = JSON.parse(this.responseText) as ProgramsRequestResult
			callback(response)
		} catch {
			callback(undefined)
		}
	}
	function onError(this: XMLHttpRequest) {
		callback()
	}
	httpGetAsync(GET_STATUS_URL, transferComplete, onError, onError)
}


export interface SetScoreRequest {
	secret?: Secret,
	programID: number
	score: number
	time: number
	comment: string
	modifiedBy: string
}

export function sendSetScoreRequest(setScoreRequest: SetScoreRequest, callback: (programsResult?: ProgramsRequestResult) => void) {
	sendRESTRequest(SET_SCORE_URL, setScoreRequest, callback)
}

export type Secret = {
	secret: string
}

export interface ProgramsRequest {
	secret?: Secret,
	/** program IDs */
	programs: number[]
}

export enum ResultErrorType {
	NONE,
	USER_VERIFICATION_FAILED,
	INVALID_ARGUMENTS,
	SQL_ERROR
}

export interface ProgramsRequestResult {
	error: ResultErrorType
	message?: string
	result?: ProgramSQLEntry[]
}

export type RESTState = {
	uploadEnabled: boolean
}

export type ProgramResult = {
	id: number, team: number, agegroup: number, challenge: number, program: string, comment: "string", timestamp: string, judge: number
}