"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
const Hardware_1 = require("../Hardware");
class Clock extends Hardware_1.Hardware {
    constructor() {
        super(0, "Clock");
        this.listeners = [];
    } //constructor
    attachListener(listener) {
        this.listeners.push(listener);
    } //attachListener
    start(intervalMs) {
        if (this.timer)
            return;
        this.timer = setInterval(() => {
            for (const listener of this.listeners) {
                try {
                    listener.pulse();
                }
                catch (e) {
                    console.error("Clock listener error:", e);
                }
            }
        }, intervalMs);
    } //start
    stop() {
        if (!this.timer)
            return;
        clearInterval(this.timer);
        this.timer = undefined;
    } //stop
} //Clock
exports.Clock = Clock;
//# sourceMappingURL=Clock.js.map