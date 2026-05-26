"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMU = void 0;
const Hardware_1 = require("../Hardware");
class MMU extends Hardware_1.Hardware {
    constructor(memory) {
        super(0, "MMU");
        this.memory = memory;
        this.log("Initialized Memory");
    } //constructor
    getMAR() {
        return this.memory.getMAR();
    } //getMAR
    setMAR(address) {
        this.memory.setMAR(address);
    } //setMAR
    setMARFromLEBytes(lowByte, highByte) {
        if (lowByte < 0x00 || lowByte > 0xFF || highByte < 0x00 || highByte > 0xFF) {
            throw new RangeError(`MAR bytes out of range: low=0x${lowByte.toString(16)}, high=0x${highByte.toString(16)}`);
        }
        const address = (highByte << 8) | lowByte;
        this.setMAR(address);
    } //setMARFromLEBytes
    setMDR(value) {
        this.memory.setMDR(value);
    } //setMDR
    getMDR() {
        return this.memory.getMDR();
    } //getMDR
    read(address) {
        this.setMAR(address);
        const value = this.memory.read();
        //this.log(`Read from memory at 0x${this.hexLog(address, 4)}: 0x${this.hexLog(value, 2)}`);
        return value;
    } //read
    write(address, value) {
        this.setMAR(address);
        this.setMDR(value);
        this.memory.write();
        //this.log(`Wrote to memory at 0x${this.hexLog(address, 4)}: 0x${this.hexLog(value, 2)}`);
    } //write
    reset() {
        this.memory.reset();
        this.log("Memory reset called via MMU");
    } //reset
    writeImmediate(address, value) {
        this.write(address, value);
    } //writeImmediate
} //MMU
exports.MMU = MMU;
//# sourceMappingURL=MMU.js.map