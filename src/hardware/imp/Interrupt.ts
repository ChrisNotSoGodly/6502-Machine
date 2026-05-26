export interface Interrupt {
    IRQ: number; 
    name: string; 
    priority: number;
    inputBuffer: any;
    outputBuffer: any; 
}

