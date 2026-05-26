"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cpu = void 0;
const Hardware_1 = require("../Hardware");
const Instruction_Set_1 = require("./imp/Instruction-Set");
const InterruptController_1 = require("./InterruptController");
const ASCII_1 = require("../ASCII");
class Cpu extends Hardware_1.Hardware {
    getisRunning() {
        return this.running;
    }
    constructor(mmu, keyboardOutputBuffer, stopSystemCallback) {
        super(0, "Cpu");
        this.cpuClockCount = 0;
        this._PC = 0x0000; // Program Counter
        this._ACC = 0x00; // Accumulator
        this._IR = 0x00; // Instruction Register
        this._zFLAG = 0x00; // zFlag Register
        this._xReg = 0x00; // X Register
        this._yReg = 0x00; // Y Register
        this._Step = 0x00; // Step Register
        this._operand = []; // Operand bytes
        this.memoryWriteAddress = 0x0100; // Address to write keyboard input
        this.cycleStage = "fetch";
        this.decodeOperandBytesRemaining = 0;
        this.running = true;
        this.mmu = mmu;
        this.keyboardOutputBuffer = keyboardOutputBuffer;
        this.instructionSet = Instruction_Set_1.instructionSet;
        this.stopSystemCallback = stopSystemCallback;
        this.interruptController = new InterruptController_1.InterruptController();
        this.interruptController.registerInterruptSource(this);
    } //constructor
    fetch() {
        this._IR = this.mmu.read(this._PC);
        this._PC = (this._PC + 1) & 0xFFFF; // Increment PC and wrap around at 16 bits
        this._Step = this._Step + 1;
        this.currentInstructionMetadata = this.instructionSet.get(this._IR);
        if (this.currentInstructionMetadata) {
            this.decodeOperandBytesRemaining = this.currentInstructionMetadata.operandBytes;
            this._operand = [];
            this.cycleStage = "decode";
        }
        else {
            this.log(`Unknown instruction: 0x${this.hexLog(this._IR, 2)}`);
            this.cycleStage = "interrupt";
        }
        this.piplineWatch();
    } //fetch
    decode() {
        if (!this.currentInstructionMetadata) {
            this.cycleStage = "interrupt";
            return;
        }
        if (this.decodeOperandBytesRemaining > 0) {
            this._operand.push(this.mmu.read(this._PC));
            this._PC = (this._PC + 1) & 0xFFFF;
            this._Step = this._Step + 1;
            this.decodeOperandBytesRemaining -= 1;
            if (this.decodeOperandBytesRemaining > 0) {
                return; // stay in decode until all operands are read
            }
        }
        this.cycleStage = "execute";
        this.piplineWatch();
    } //decode
    execute() {
        const metadata = this.instructionSet.get(this._IR);
        switch (this._IR) {
            case 0xA9: {
                this._ACC = this._operand[0];
                this._Step = this._Step + 1;
                break;
            } //0xA9
            case 0xAD: {
                const address = (this._operand[1] << 8) | this._operand[0];
                this._ACC = this.mmu.read(address);
                this._Step = this._Step + 1;
                break;
            } //0xAD
            case 0x8D: {
                const address = (this._operand[1] << 8) | this._operand[0];
                this.mmu.write(address, this._ACC);
                this._Step = this._Step + 1;
                break;
            } //0x8D
            case 0x8A: {
                this._ACC = this._xReg;
                this._Step = this._Step + 1;
                break;
            } //0x8A
            case 0x98: {
                this._ACC = this._yReg;
                this._Step = this._Step + 1;
                break;
            } //0x98
            case 0x6D: {
                const address = (this._operand[1] << 8) | this._operand[0];
                const value = this.mmu.read(address);
                const sum = this._ACC + value;
                this._ACC = sum & 0xFF;
                this._Step = this._Step + 1; // Execute: read memory and add = 1 cycle
                break;
            } //0x6D
            case 0xA2: {
                this._xReg = this._operand[0];
                this._Step = this._Step + 1;
                break;
            } //0xA2
            case 0xAE: {
                const address = (this._operand[1] << 8) | this._operand[0];
                this._xReg = this.mmu.read(address);
                this._Step = this._Step + 1;
                break;
            } //0xAE
            case 0xAA: {
                this._xReg = this._ACC;
                this._Step = this._Step + 1;
                break;
            } //0xAA
            case 0xA0: {
                this._yReg = this._operand[0];
                this._Step = this._Step + 1;
                break;
            } //0xA0 
            case 0xAC: {
                const address = (this._operand[1] << 8) | this._operand[0];
                this._yReg = this.mmu.read(address);
                this._Step = this._Step + 1;
                break;
            } //0xAC
            case 0xA8: {
                this._yReg = this._ACC;
                this._Step = this._Step + 1;
                break;
            } //0xA8
            case 0xEA: {
                // NOP - No Operation
                this._Step = this._Step + 1;
                break;
            } //0xEA
            case 0x00: {
                this.running = false;
                this._Step = this._Step + 1;
                console.log("System halted by BRK instruction.");
                break;
            } //0x00
            case 0xEC: {
                const address = (this._operand[1] << 8) | this._operand[0];
                const xValue = this.mmu.read(address);
                this._zFLAG = (this._xReg === xValue) ? 1 : 0;
                this._Step = this._Step + 1;
                break;
            } //0xEC
            case 0xEE: {
                const address = (this._operand[1] << 8) | this._operand[0];
                let incValue = this.mmu.read(address);
                incValue = (incValue + 1) & 0xFF;
                this.mmu.write(address, incValue);
                this._Step = this._Step + 3;
                break;
            } //0xEE
            case 0xD0: {
                const offset = (this._operand[0] << 24) >> 24; // signed 8-bit offset
                if (this._zFLAG === 0) {
                    //this._PC = this._PC + 1;
                    this._PC = (this._PC + offset) & 0xFFFF;
                    this._Step = this._Step + 2; // Branch taken: +2 cycles
                }
                else {
                    this._Step = this._Step + 1; // No branch: +1 cycle
                }
                break;
            } //0xD0
            case 0xFF: {
                process.stdout.write("\n=========== SYS CALL ===========\n");
                if (this._xReg === 0x01) {
                    process.stdout.write(`[SYS] Decimal Output: ${this._yReg}\n`);
                }
                else if (this._xReg === 0x02) {
                    const character = ASCII_1.ASCII.byteToChar(this._yReg);
                    process.stdout.write(`[SYS] ASCII Character Output: ${character}\n`);
                }
                else if (this._xReg === 0x03) {
                    const low = this.mmu.read(this._PC);
                    const high = this.mmu.read(this._PC + 1);
                    const address = (high << 8) | low;
                    this._PC = (this._PC + 2) & 0xFFFF;
                    let currentAddress = address;
                    let output = "";
                    while (true) {
                        const byte = this.mmu.read(currentAddress);
                        if (byte === 0x00)
                            break;
                        output += ASCII_1.ASCII.byteToChar(byte);
                        currentAddress = (currentAddress + 1) & 0xFFFF;
                    }
                    process.stdout.write(`[SYS] ASCII String Output: ${output}\n`);
                }
                process.stdout.write("================================\n\n");
                this._Step += 1;
                break;
            } //0xFF
        } //switch
        this.cycleStage = "interrupt";
        this.piplineWatch();
    } //execute
    interuptCheck() {
        const nextInterrupt = this.interruptController.getNextInterrupt();
        if (!nextInterrupt || this.keyboardOutputBuffer.length === 0) {
            this.cycleStage = "fetch";
            return;
        } //if
        const character = this.keyboardOutputBuffer.shift();
        if (!character) {
            this.cycleStage = "fetch";
            return;
        } //if
        process.stdout.write(character);
        const asciiValue = ASCII_1.ASCII.charToByte(character);
        this.mmu.write(this.memoryWriteAddress, asciiValue);
        this.memoryWriteAddress = (this.memoryWriteAddress + 1) & 0xFFFF;
        this.interruptController.removeInterrupt(nextInterrupt);
        this.cycleStage = "fetch";
    } //interupt
    piplineWatch() {
        const state = `CPU State | Mode: 0 PC: ${this.hexLog(this._PC, 4)} 
        IR: ${this.hexLog(this._IR, 2)} Acc: ${this.hexLog(this._ACC, 2)} xReg: ${this.hexLog(this._xReg, 2)} yReg: ${this.hexLog(this._yReg, 2)} zFlag: ${this.hexLog(this._zFLAG, 1)} Step: ${this._Step} \n`;
        return state;
    } //piplineWatch
    pulse() {
        if (!this.running) {
            return;
        } //if
        this.cpuClockCount++;
        this.log(this.cpuClockCount + ' ' + this.piplineWatch());
        switch (this.cycleStage) {
            case "fetch":
                this.fetch();
                break;
            case "decode":
                this.decode();
                break;
            case "execute":
                this.execute();
                break;
            case "interrupt":
                this.interuptCheck();
                break;
        } //switch
    } //pulse
} //Cpu
exports.Cpu = Cpu;
//# sourceMappingURL=Cpu.js.map