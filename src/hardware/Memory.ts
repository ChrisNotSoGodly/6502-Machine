import { Hardware } from "../Hardware";
import { ClockListener } from "./imp/ClockListener";

export class Memory extends Hardware implements ClockListener {
    private array: Uint8Array; // 64KB of memory    
    private _MAR: number = 0x0000; // Memory Address Register
    private _MDR: number = 0x00;   // Memory Data Register

    constructor() {
        super(0, "RAM");
        this.array = new Uint8Array(0x10000);
        this.log("Created - Addressable space : 65536");
    }//constructor

    public getMAR(): number {
        return this._MAR;
    }//getMAR

    public setMAR(value: number) {
        if (value < 0x0000 || value > 0xFFFF) {
            throw new RangeError(`MAR out of range: 0x${value.toString(16).toUpperCase()}`);
        }//if
        this._MAR = value & 0xFFFF;
    }//setMAR

    public getMDR(): number {
        return this._MDR;
    }//getMDR

    public setMDR(value: number) {
        if (value < 0x00 || value > 0xFF) {
            throw new RangeError(`MDR out of range: 0x${value.toString(16).toUpperCase()}`);
        }//if
        this._MDR = value & 0xFF;
    }//setMDR

    public fill(): void {
        for (let i = 0x00; i < this.array.length; i++) {
            this.array[i] = 0x00;
        }//for 
    }//fill

    public memoryDump(address1: number, address2: number): void {
        this.log(`Memory Contents (0x${this.hexLog(address1, 4)} to 0x${this.hexLog(address2, 4)}):`);
        for (let address = address1; address < address2 + 1; address++) {
            const addressHex = this.hexLog(address, 4);
            const valueHex = this.hexLog(this.array[address], 2);
            this.log(`Address: 0x${addressHex} | Value: 0x${valueHex}`);
        }//for
        this.log("Memory Dump Complete");
    }//memoryDump

    
    public pulse(): void {
        //this.log("received clock pulse");
    }//pulse
    
    public read(): number {
        this.setMDR(this.array[this.getMAR()]);
        return this.getMDR();
    }//read

    public write(): void {
        this.array[this.getMAR()] = this.getMDR();
    }//write
     
    public reset(): void {
        this.setMAR(0x0000);
        this.setMDR(0x00);
        this.array.fill(0x00);
    }//reset
}//Memory