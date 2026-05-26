import { Hardware } from "../Hardware";
import { Interrupt } from "./imp/Interrupt";
import { ClockListener } from "./imp/ClockListener";

export class InterruptController extends Hardware implements ClockListener {
    private interruptQueue: Interrupt[] = []; // Queue of waiting interrupts
    private interruptSources: Hardware[] = []; // Hardware that can generate interrupts
    private processedInterrupts: Interrupt[] = []; // History of processed interrupts

    constructor() {
        super(0, "InterruptController");
    }

    //Register a hardware device as an interrupt source
    public registerInterruptSource(hardware: Hardware): void {
        if (!this.interruptSources.includes(hardware)) {
            this.interruptSources.push(hardware);
            this.log(`Registered Source: ${hardware.name}`);
        }//if
    }//registerInterruptSource

    //Accept an interrupt from a hardware device and add to the queue
    public acceptInterrupt(interrupt: Interrupt): void {
        this.interruptQueue.push(interrupt);
        //this.log(`Interrupt accepted: ${interrupt.name} (IRQ: ${interrupt.IRQ}, Priority: ${interrupt.priority})`);
    }//acceptInterrupt

    //Get the highest priority interrupt from the queue without removing it
    public getNextInterrupt(): Interrupt | null {
        if (this.interruptQueue.length === 0) {
            return null;
        }//if

        // Find the interrupt with the highest priority
        let maxPriorityInterrupt = this.interruptQueue[0];
        for (const interrupt of this.interruptQueue) {
            if (interrupt.priority > maxPriorityInterrupt.priority) {
                maxPriorityInterrupt = interrupt;
            }//if
        }//for
        return maxPriorityInterrupt;
    }//getNextInterrupt

    //Remove an interrupt from the queue after it has been processed
    public removeInterrupt(interrupt: Interrupt): void {
        const index = this.interruptQueue.indexOf(interrupt);
        if (index > -1) {
            this.interruptQueue.splice(index, 1);
            this.processedInterrupts.push(interrupt);
            //this.log(`Interrupt processed and removed: ${interrupt.name}`);
        }//if
    }//removeInterrupt

    //Get all interrupts currently in the queue
    public getPendingInterrupts(): Interrupt[] {
        return [...this.interruptQueue];
    }//getPendingInterrupts

    //Get all registered interrupt sources
    public getInterruptSources(): Hardware[] {
        return [...this.interruptSources];
    }//getInterruptSources

    //Get history of processed interrupts
    public getProcessedInterrupts(): Interrupt[] {
        return [...this.processedInterrupts];
    }//getProcessedInterrupts

    
    //Clear the interrupt queue
    public clearQueue(): void {
        this.interruptQueue = [];
        this.log("Interrupt queue cleared");
    }//clearQueue

    /**
     * Clock listener pulse - called on each clock cycle
     * Provides the highest priority interrupt to the CPU
     */
    public pulse(): void {
        const nextInterrupt = this.getNextInterrupt();
        if (nextInterrupt) {
            this.log(`Pulse: Next interrupt available - ${nextInterrupt.name} (Priority: ${nextInterrupt.priority})`);
            // The CPU will retrieve this interrupt via getNextInterrupt()
        }//if
    }//pulse
    
}//InterruptController