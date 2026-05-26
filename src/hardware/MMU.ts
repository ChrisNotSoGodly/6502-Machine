import {Hardware} from "../Hardware";
import {Memory} from "./Memory";

export class MMU extends Hardware {
    private memory: Memory;

    constructor(memory: Memory) {
        super(0, "MMU");
        this.memory = memory;
        this.log("Initialized Memory");
    }//constructor

    private getMAR(): number {
        return this.memory.getMAR();
    }//getMAR
    
    private setMAR(address: number): void {
        this.memory.setMAR(address);
    }//setMAR

    private setMARFromLEBytes(lowByte: number, highByte: number): void {
        if (lowByte < 0x00 || lowByte > 0xFF || highByte < 0x00 || highByte > 0xFF) {
            throw new RangeError(`MAR bytes out of range: low=0x${lowByte.toString(16)}, high=0x${highByte.toString(16)}`);
        }
        const address = (highByte << 8) | lowByte;
        this.setMAR(address);
    }//setMARFromLEBytes

    private setMDR(value: number): void {
        this.memory.setMDR(value);
    }//setMDR

    private getMDR(): number {
        return this.memory.getMDR();
    }//getMDR

    public read(address: number): number {
        this.setMAR(address);
        const value = this.memory.read();
        //this.log(`Read from memory at 0x${this.hexLog(address, 4)}: 0x${this.hexLog(value, 2)}`);
        return value;
    }//read

    public write(address: number, value: number): void {
        this.setMAR(address);
        this.setMDR(value);
        this.memory.write();
        //this.log(`Wrote to memory at 0x${this.hexLog(address, 4)}: 0x${this.hexLog(value, 2)}`);
    }//write

    public reset(): void {
        this.memory.reset();
        this.log("Memory reset called via MMU");
    }//reset

    public writeImmediate(address: number, value: number): void {
        this.write(address, value);
    }//writeImmediate
}//MMU