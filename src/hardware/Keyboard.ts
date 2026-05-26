import { Hardware } from "../Hardware";
import { Interrupt } from "./imp/Interrupt";

export class Keyboard extends Hardware implements Interrupt {
    // Implement interface properties
    IRQ: number;
    name: string;
    priority: number;
    inputBuffer: any;
    outputBuffer: { enqueue(value: string): void };
    interruptController: { acceptInterrupt(interrupt: Interrupt): void };

    constructor(
        IRQ: number,
        name: string,
        priority: number,
        inputBuffer: any,
        outputBuffer: { enqueue(value: string): void },
        interruptController: { acceptInterrupt(interrupt: Interrupt): void }
    ) {
        super(IRQ, name);
        this.IRQ = IRQ;
        this.name = name;
        this.priority = priority;
        this.inputBuffer = inputBuffer;
        this.outputBuffer = outputBuffer;
        this.interruptController = interruptController;
    }

    private monitorKeys() {
        /*
        character stream from stdin code (most of the contents of this function) taken from here
        https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin

        This takes care of the simulation we need to do to capture stdin from the console and retrieve the character.
        Then we can put it in the buffer and trigger the interrupt.
         */
        const stdin = process.stdin;

        if (stdin.isTTY) {
            stdin.setRawMode(true);
        }

        stdin.setEncoding('utf8');
        stdin.resume();

        stdin.on('data', (key: string) => {
            const keyPressed = key;
            this.log("Key pressed - " + keyPressed);

            if (keyPressed === '\u0003') {
                process.exit();
            }

            this.outputBuffer.enqueue(keyPressed);
            this.interruptController.acceptInterrupt(this);
        });
    }//monitorKeys

    public startMonitoring() {
        this.monitorKeys();
    }//startMonitoring
}//Keyboard

