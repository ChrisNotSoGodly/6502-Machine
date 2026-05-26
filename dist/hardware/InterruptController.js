"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterruptController = void 0;
const Hardware_1 = require("../Hardware");
class InterruptController extends Hardware_1.Hardware {
    constructor() {
        super(0, "InterruptController");
        this.interruptQueue = []; // Queue of waiting interrupts
        this.interruptSources = []; // Hardware that can generate interrupts
        this.processedInterrupts = []; // History of processed interrupts
    }
    //Register a hardware device as an interrupt source
    registerInterruptSource(hardware) {
        if (!this.interruptSources.includes(hardware)) {
            this.interruptSources.push(hardware);
            this.log(`Registered Source: ${hardware.name}`);
        } //if
    } //registerInterruptSource
    //Accept an interrupt from a hardware device and add to the queue
    acceptInterrupt(interrupt) {
        this.interruptQueue.push(interrupt);
        //this.log(`Interrupt accepted: ${interrupt.name} (IRQ: ${interrupt.IRQ}, Priority: ${interrupt.priority})`);
    } //acceptInterrupt
    //Get the highest priority interrupt from the queue without removing it
    getNextInterrupt() {
        if (this.interruptQueue.length === 0) {
            return null;
        } //if
        // Find the interrupt with the highest priority
        let maxPriorityInterrupt = this.interruptQueue[0];
        for (const interrupt of this.interruptQueue) {
            if (interrupt.priority > maxPriorityInterrupt.priority) {
                maxPriorityInterrupt = interrupt;
            } //if
        } //for
        return maxPriorityInterrupt;
    } //getNextInterrupt
    //Remove an interrupt from the queue after it has been processed
    removeInterrupt(interrupt) {
        const index = this.interruptQueue.indexOf(interrupt);
        if (index > -1) {
            this.interruptQueue.splice(index, 1);
            this.processedInterrupts.push(interrupt);
            //this.log(`Interrupt processed and removed: ${interrupt.name}`);
        } //if
    } //removeInterrupt
    //Get all interrupts currently in the queue
    getPendingInterrupts() {
        return [...this.interruptQueue];
    } //getPendingInterrupts
    //Get all registered interrupt sources
    getInterruptSources() {
        return [...this.interruptSources];
    } //getInterruptSources
    //Get history of processed interrupts
    getProcessedInterrupts() {
        return [...this.processedInterrupts];
    } //getProcessedInterrupts
    //Clear the interrupt queue
    clearQueue() {
        this.interruptQueue = [];
        this.log("Interrupt queue cleared");
    } //clearQueue
    /**
     * Clock listener pulse - called on each clock cycle
     * Provides the highest priority interrupt to the CPU
     */
    pulse() {
        const nextInterrupt = this.getNextInterrupt();
        if (nextInterrupt) {
            this.log(`Pulse: Next interrupt available - ${nextInterrupt.name} (Priority: ${nextInterrupt.priority})`);
            // The CPU will retrieve this interrupt via getNextInterrupt()
        } //if
    } //pulse
} //InterruptController
exports.InterruptController = InterruptController;
//# sourceMappingURL=InterruptController.js.map