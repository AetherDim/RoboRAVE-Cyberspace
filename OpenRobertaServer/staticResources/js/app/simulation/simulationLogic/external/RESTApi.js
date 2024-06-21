define(["require", "exports", "./../GlobalDebug"], function (require, exports, GlobalDebug_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ResultErrorType = exports.sendSetScoreRequest = exports.sendStateRequest = exports.sendProgramRequest = exports.sendRESTRequest = void 0;
    function httpAsync(req, url, data, transferComplete, error, abort) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open(req, url, true);
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.addEventListener("load", transferComplete);
        xmlHttp.addEventListener("error", error);
        xmlHttp.addEventListener("abort", abort);
        xmlHttp.send(data);
    }
    function httpPostAsync(url, data, transferComplete, error, abort) {
        httpAsync("POST", url, data, transferComplete, error, abort);
    }
    function httpGetAsync(url, transferComplete, error, abort) {
        httpAsync("GET", url, undefined, transferComplete, error, abort);
    }
    var PROGRAMS_URL = "/sqlrest/programs";
    var SET_SCORE_URL = "/sqlrest/setScore";
    var GET_STATUS_URL = "/sqlrest/state";
    var GET_RANDOM_JOUSTING_PROGRAM = "/sqlrest/getjousting";
    if ((location.hostname === "localhost" || location.hostname === "127.0.0.1") && GlobalDebug_1.DEBUG) {
        var DEBUG_ADDRESS = "https://dev.cyberspace.roborave.de";
        PROGRAMS_URL = DEBUG_ADDRESS + PROGRAMS_URL;
        SET_SCORE_URL = DEBUG_ADDRESS + SET_SCORE_URL;
        GET_STATUS_URL = DEBUG_ADDRESS + GET_STATUS_URL;
        GET_RANDOM_JOUSTING_PROGRAM = DEBUG_ADDRESS + GET_RANDOM_JOUSTING_PROGRAM;
    }
    function sendRESTRequest(url, programRequest, callback) {
        function transferComplete() {
            try {
                var response = JSON.parse(this.responseText);
                callback(response);
                // callback(randomBool() ? response : undefined)
            }
            catch (_a) {
                callback(undefined);
            }
        }
        function onError(ev) {
            callback();
        }
        httpPostAsync(url, JSON.stringify(programRequest), transferComplete, onError, onError);
    }
    exports.sendRESTRequest = sendRESTRequest;
    function sendProgramRequest(programRequest, callback) {
        sendRESTRequest(PROGRAMS_URL, programRequest, callback);
    }
    exports.sendProgramRequest = sendProgramRequest;
    function sendStateRequest(callback) {
        function transferComplete() {
            try {
                var response = JSON.parse(this.responseText);
                callback(response);
            }
            catch (_a) {
                callback(undefined);
            }
        }
        function onError() {
            callback();
        }
        httpGetAsync(GET_STATUS_URL, transferComplete, onError, onError);
    }
    exports.sendStateRequest = sendStateRequest;
    function sendSetScoreRequest(setScoreRequest, callback) {
        sendRESTRequest(SET_SCORE_URL, setScoreRequest, callback);
    }
    exports.sendSetScoreRequest = sendSetScoreRequest;
    var ResultErrorType;
    (function (ResultErrorType) {
        ResultErrorType[ResultErrorType["NONE"] = 0] = "NONE";
        ResultErrorType[ResultErrorType["USER_VERIFICATION_FAILED"] = 1] = "USER_VERIFICATION_FAILED";
        ResultErrorType[ResultErrorType["INVALID_ARGUMENTS"] = 2] = "INVALID_ARGUMENTS";
        ResultErrorType[ResultErrorType["SQL_ERROR"] = 3] = "SQL_ERROR";
    })(ResultErrorType || (exports.ResultErrorType = ResultErrorType = {}));
});
