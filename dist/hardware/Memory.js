"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const Hardware_1 = require("../Hardware");
class Memory extends Hardware_1.Hardware {
    constructor() {
        super(0, "RAM");
        this._MAR = 0x0000; // Memory Address Register
        this._MDR = 0x00; // Memory Data Register
        this.array = new Uint8Array(0x10000);
        this.log("Created - Addressable space : 65536");
    } //constructor
    getMAR() {
        return this._MAR;
    } //getMAR
    setMAR(value) {
        if (value < 0x0000 || value > 0xFFFF) {
            throw new RangeError(`MAR out of range: 0x${value.toString(16).toUpperCase()}`);
        } //if
        this._MAR = value & 0xFFFF;
    } //setMAR
    getMDR() {
        return this._MDR;
    } //getMDR
    setMDR(value) {
        if (value < 0x00 || value > 0xFF) {
            throw new RangeError(`MDR out of range: 0x${value.toString(16).toUpperCase()}`);
        } //if
        this._MDR = value & 0xFF;
    } //setMDR
    fill() {
        for (let i = 0x00; i < this.array.length; i++) {
            this.array[i] = 0x00;
        } //for 
    } //fill
    memoryDump(address1, address2) {
        this.log(`Memory Contents (0x${this.hexLog(address1, 4)} to 0x${this.hexLog(address2, 4)}):`);
        for (let address = address1; address < address2 + 1; address++) {
            const addressHex = this.hexLog(address, 4);
            const valueHex = this.hexLog(this.array[address], 2);
            this.log(`Address: 0x${addressHex} | Value: 0x${valueHex}`);
        } //for
        this.log("Memory Dump Complete");
    } //memoryDump
    pulse() {
        //this.log("received clock pulse");
    } //pulse
    read() {
        this.setMDR(this.array[this.getMAR()]);
        return this.getMDR();
    } //read
    write() {
        this.array[this.getMAR()] = this.getMDR();
    } //write
    reset() {
        this.setMAR(0x0000);
        this.setMDR(0x00);
        this.array.fill(0x00);
    } //reset
} //Memory
exports.Memory = Memory;
//# sourceMappingURL=Memory.js.map