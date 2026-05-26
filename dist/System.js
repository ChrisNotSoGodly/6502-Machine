"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
// import statements for hardware
const Cpu_1 = require("./hardware/Cpu");
const Memory_1 = require("./hardware/Memory");
const Clock_1 = require("./hardware/Clock");
const MMU_1 = require("./hardware/MMU");
const Hardware_1 = require("./Hardware");
const Keyboard_1 = require("./hardware/Keyboard");
/*
    Constants
 */
// Initialization Parameters for Hardware
// Clock cycle interval
const CLOCK_INTERVAL = 500; // This is in ms (milliseconds) so 1000 = 1 second, 100 = 1/10 second
// A setting of 100 is equivalent to 10hz, 1 would be 1,000hz or 1khz,
// .001 would be 1,000,000 or 1mhz. Obviously you will want to keep this
// small, I recommend a setting of 100, if you want to slow things down
// make it larger.
class System extends Hardware_1.Hardware {
    constructor() {
        super(0, "System");
        this.outputBuffer = [];
        this.running = false;
        this._Memory = new Memory_1.Memory();
        this._MMU = new MMU_1.MMU(this._Memory);
        this._CPU = new Cpu_1.Cpu(this._MMU, this.outputBuffer);
        this._Clock = new Clock_1.Clock();
        this._Keyboard = new Keyboard_1.Keyboard(1, // IRQ
        "Keyboard", // name
        3, // priority  
        [], // inputBuffer
        { enqueue: (value) => this.outputBuffer.push(value) }, // outputBuffer
        this._CPU.interruptController // interruptController
        );
        this._Keyboard.startMonitoring();
        this._CPU.interruptController.registerInterruptSource(this._Keyboard);
        /*
        Start the system (Analogous to pressing the power button and having voltages flow through the components)
        When power is applied to the system clock, it begins sending pulses to all clock observing hardware
        components so they can act on each clock cycle.
         */
        this.startSystem();
    } //constructor
    startSystem() {
        this._CPU.debug = false;
        this._CPU.log("Created");
        this._Memory.fill();
        //Start of Test Code
        this.syscallTest();
        // End of Test Code
        if (this._CPU.getisRunning()) {
            this._Clock.attachListener(this._CPU);
            this._Clock.attachListener(this._Memory);
            this._Clock.start(CLOCK_INTERVAL);
            this.running = true;
        }
        else {
            this.running = false;
        }
        return true;
    } //startSystem
    stopSystem() {
        this._Clock.stop();
        this.running = false;
        if (typeof process !== 'undefined' && typeof process.exit === 'function') {
            process.exit(0);
        }
        return true;
    } //stopSystem
    fibonacci() {
        this._MMU.writeImmediate(0x0000, 0xA9);
        this._MMU.writeImmediate(0x0001, 0x00);
        this._MMU.writeImmediate(0x0002, 0x8D);
        this._MMU.writeImmediate(0x0003, 0x41);
        this._MMU.writeImmediate(0x0004, 0x00);
        this._MMU.writeImmediate(0x0005, 0xA9);
        this._MMU.writeImmediate(0x0006, 0x01);
        this._MMU.writeImmediate(0x0007, 0x8D);
        this._MMU.writeImmediate(0x0008, 0x42);
        this._MMU.writeImmediate(0x0009, 0x00);
        this._MMU.writeImmediate(0x000A, 0xA9);
        this._MMU.writeImmediate(0x000B, 0x00);
        this._MMU.writeImmediate(0x000C, 0x8D);
        this._MMU.writeImmediate(0x000D, 0x43);
        this._MMU.writeImmediate(0x000E, 0x00);
        this._MMU.writeImmediate(0x000F, 0xA9);
        this._MMU.writeImmediate(0x0010, 0x07);
        this._MMU.writeImmediate(0x0011, 0x8D);
        this._MMU.writeImmediate(0x0012, 0x44);
        this._MMU.writeImmediate(0x0013, 0x00);
        this._MMU.writeImmediate(0x0014, 0xA2);
        this._MMU.writeImmediate(0x0015, 0x01);
        this._MMU.writeImmediate(0x0016, 0xAC);
        this._MMU.writeImmediate(0x0017, 0x41);
        this._MMU.writeImmediate(0x0018, 0x00);
        this._MMU.writeImmediate(0x0019, 0xFF);
        this._MMU.writeImmediate(0x001A, 0xAC);
        this._MMU.writeImmediate(0x001B, 0x42);
        this._MMU.writeImmediate(0x001C, 0x00);
        this._MMU.writeImmediate(0x001D, 0xFF);
        this._MMU.writeImmediate(0x001E, 0xAD);
        this._MMU.writeImmediate(0x001F, 0x42);
        this._MMU.writeImmediate(0x0020, 0x00);
        this._MMU.writeImmediate(0x0021, 0x6D);
        this._MMU.writeImmediate(0x0022, 0x41);
        this._MMU.writeImmediate(0x0023, 0x00);
        this._MMU.writeImmediate(0x0024, 0x8D);
        this._MMU.writeImmediate(0x0025, 0x45);
        this._MMU.writeImmediate(0x0026, 0x00);
        this._MMU.writeImmediate(0x0027, 0xAD);
        this._MMU.writeImmediate(0x0028, 0x42);
        this._MMU.writeImmediate(0x0029, 0x00);
        this._MMU.writeImmediate(0x002A, 0x8D);
        this._MMU.writeImmediate(0x002B, 0x41);
        this._MMU.writeImmediate(0x002C, 0x00);
        this._MMU.writeImmediate(0x002D, 0xAD);
        this._MMU.writeImmediate(0x002E, 0x45);
        this._MMU.writeImmediate(0x002F, 0x00);
        this._MMU.writeImmediate(0x0030, 0x8D);
        this._MMU.writeImmediate(0x0031, 0x42);
        this._MMU.writeImmediate(0x0032, 0x00);
        this._MMU.writeImmediate(0x0033, 0xEE);
        this._MMU.writeImmediate(0x0034, 0x43);
        this._MMU.writeImmediate(0x0035, 0x00);
        this._MMU.writeImmediate(0x0036, 0xAE);
        this._MMU.writeImmediate(0x0037, 0x43);
        this._MMU.writeImmediate(0x0038, 0x00);
        this._MMU.writeImmediate(0x0039, 0xEC);
        this._MMU.writeImmediate(0x003A, 0x44);
        this._MMU.writeImmediate(0x003B, 0x00);
        this._MMU.writeImmediate(0x003C, 0xA2);
        this._MMU.writeImmediate(0x003D, 0x01);
        this._MMU.writeImmediate(0x003E, 0xD0);
        this._MMU.writeImmediate(0x003F, 0xDA);
        this._MMU.writeImmediate(0x0040, 0x00);
    } //fibonacci
    powersProgram() {
        // load constant 0
        this._MMU.writeImmediate(0x0000, 0xA9);
        this._MMU.writeImmediate(0x0001, 0x00);
        // write acc (0) to 0040
        this._MMU.writeImmediate(0x0002, 0x8D);
        this._MMU.writeImmediate(0x0003, 0x40);
        this._MMU.writeImmediate(0x0004, 0x00);
        // load constant 1
        this._MMU.writeImmediate(0x0005, 0xA9);
        this._MMU.writeImmediate(0x0006, 0x01);
        // add acc (?) to mem 0040 (?)
        this._MMU.writeImmediate(0x0007, 0x6D);
        this._MMU.writeImmediate(0x0008, 0x40);
        this._MMU.writeImmediate(0x0009, 0x00);
        // write acc ? to 0040
        this._MMU.writeImmediate(0x000A, 0x8D);
        this._MMU.writeImmediate(0x000B, 0x40);
        this._MMU.writeImmediate(0x000C, 0x00);
        // Load y from memory 0040
        this._MMU.writeImmediate(0x000D, 0xAC);
        this._MMU.writeImmediate(0x000E, 0x40);
        this._MMU.writeImmediate(0x000F, 0x00);
        // Load x with constant (1) (to make the first system call)
        this._MMU.writeImmediate(0x0010, 0xA2);
        this._MMU.writeImmediate(0x0011, 0x01);
        // make the system call to print the value in the y register (3)
        this._MMU.writeImmediate(0x0012, 0xFF);
        // Load x with constant (3) (to make the second system call for the string)
        this._MMU.writeImmediate(0x0013, 0xA2);
        this._MMU.writeImmediate(0x0014, 0x03);
        // make the system call to print the value in the y register (3)
        this._MMU.writeImmediate(0x0015, 0xFF);
        this._MMU.writeImmediate(0x0016, 0x50);
        this._MMU.writeImmediate(0x0017, 0x00);
        // test DO (Branch Not Equal) will be NE and branch (0x0021 contains 0x20 and xReg contains B2)
        this._MMU.writeImmediate(0x0018, 0xD0);
        this._MMU.writeImmediate(0x0019, 0xED);
        // globals
        this._MMU.writeImmediate(0x0050, 0x2C);
        this._MMU.writeImmediate(0x0051, 0x20);
        this._MMU.writeImmediate(0x0052, 0x00);
        this._Memory.memoryDump(0x0000, 0x001A);
        console.log("---------------------------");
        this._Memory.memoryDump(0x0050, 0x0053);
    } //powersProgram
    syscallTest() {
        // Load X Register with 0x03 (ASCII String Mode)
        this._MMU.writeImmediate(0x0000, 0xA2);
        this._MMU.writeImmediate(0x0001, 0x03);
        // SYS Call using address 0x0041
        this._MMU.writeImmediate(0x0002, 0xFF);
        this._MMU.writeImmediate(0x0003, 0x41);
        this._MMU.writeImmediate(0x0004, 0x00);
        // BRK
        this._MMU.writeImmediate(0x0005, 0x00);
        // ========================================
        // String Data at 0x0041
        // "Hello World"
        // ========================================
        // H
        this._MMU.writeImmediate(0x0041, 0x48);
        // e
        this._MMU.writeImmediate(0x0042, 0x65);
        // l
        this._MMU.writeImmediate(0x0043, 0x6C);
        // l
        this._MMU.writeImmediate(0x0044, 0x6C);
        // o
        this._MMU.writeImmediate(0x0045, 0x6F);
        // Space
        this._MMU.writeImmediate(0x0046, 0x20);
        // W
        this._MMU.writeImmediate(0x0047, 0x57);
        // o
        this._MMU.writeImmediate(0x0048, 0x6F);
        // r
        this._MMU.writeImmediate(0x0049, 0x72);
        // l
        this._MMU.writeImmediate(0x004A, 0x6C);
        // d
        this._MMU.writeImmediate(0x004B, 0x64);
        // Null Terminator
        this._MMU.writeImmediate(0x004C, 0x00);
    } //syscallTest
} //System
exports.System = System;
let system = new System();
//# sourceMappingURL=System.js.map