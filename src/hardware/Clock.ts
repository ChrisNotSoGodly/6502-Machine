import { Hardware } from "../Hardware";
import { ClockListener } from "./imp/ClockListener";

export class Clock extends Hardware {
    private listeners: ClockListener[] = [];
    private timer?: NodeJS.Timeout;

    constructor() {
        super(0, "Clock");
    }//constructor

    public attachListener(listener: ClockListener): void {
        this.listeners.push(listener);
    }//attachListener
    
    public start(intervalMs: number): void {
        if (this.timer) return;
        this.timer = setInterval(() => {
            for (const listener of this.listeners) {
                try {
                    listener.pulse();
                } catch (e) {
                    console.error("Clock listener error:", e);
                }
            }
        }, intervalMs) as unknown as NodeJS.Timeout;
    }//start

    public stop(): void {
        if (!this.timer) return;
        clearInterval(this.timer as unknown as any);
        this.timer = undefined;
    }//stop
}//Clock