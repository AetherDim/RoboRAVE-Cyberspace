define(["require", "exports", "./Utils"], function (require, exports, Utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Timer = void 0;
    var Timer = /** @class */ (function () {
        function Timer(sleepTime, userFunction) {
            this.tickerStopPollTime = 0.1;
            this.running = false;
            this.sleepTime = 100;
            this.shallStop = false;
            this.lastCall = 0;
            this.callTime = 0;
            this.lastDT = 0;
            this.selfCallingFunc = function () { };
            this.sleepTime = sleepTime;
            this.userFunction = userFunction;
        }
        Timer.prototype.setTickerStopPollTime = function (pollTime) {
            this.tickerStopPollTime = pollTime;
        };
        Timer.prototype.start = function () {
            if (this.running) {
                return;
            }
            this.shallStop = false;
            this.running = true;
            var _this = this;
            this.selfCallingFunc = function () {
                if (_this.callUserFunction()) {
                    setTimeout(_this.selfCallingFunc, _this.sleepTime * 1000);
                }
                else {
                    _this.running = false;
                    Utils_1.Utils.log('Timer stopped!');
                }
            };
            this.lastCall = Date.now();
            this.selfCallingFunc();
        };
        Timer.prototype.stop = function () {
            this.shallStop = true;
        };
        Timer.prototype.generateAsyncStopListener = function (timeout) {
            var _this_1 = this;
            if (timeout === void 0) { timeout = 1; }
            return { func: function (chain) { return _this_1.asyncStop(chain, timeout, Date.now()); }, thisContext: this };
        };
        Timer.prototype.asyncStop = function (chain, timeout, startTime) {
            var _this_1 = this;
            if (timeout === void 0) { timeout = 0.2; }
            if (this.running) {
                this.stop();
                if (startTime + timeout * 1000 < Date.now()) {
                    console.warn("Unable to stop ticker!");
                    chain.next();
                }
                else {
                    setTimeout(function () { return _this_1.asyncStop(chain, timeout, startTime); }, this.tickerStopPollTime * 1000);
                }
            }
            else {
                chain.next();
            }
        };
        Timer.prototype.callUserFunction = function () {
            var now = Date.now();
            this.lastDT = now - this.lastCall;
            try {
                this.userFunction(this.lastDT, this);
            }
            catch (error) {
                this.stop();
                console.error(error);
            }
            // error check for too long function call
            var now2 = Date.now();
            this.callTime = now2 - now;
            this.lastCall = now2;
            return !this.shallStop;
        };
        return Timer;
    }());
    exports.Timer = Timer;
});
