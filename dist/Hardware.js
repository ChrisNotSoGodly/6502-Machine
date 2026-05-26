"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hardware = void 0;
class Hardware {
    constructor(id, name) {
        this.debug = true;
        this.id_number = id;
        this.name = name;
    } //constructor
    log(message) {
        if (this.debug == true) {
            const timestamp = Date.now();
            console.log(`[HW - ${this.name} id: ${this.id_number} - ${timestamp}]: ${message}`);
        } //if
    } //log
    hexLog(value, length) {
        let hex = value.toString(16).toUpperCase();
        hex = hex.padStart(length, '0');
        return hex;
    } //hexLog
} //Hardware
exports.Hardware = Hardware;
//# sourceMappingURL=Hardware.js.map