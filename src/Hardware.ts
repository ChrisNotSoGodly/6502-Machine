export class Hardware {
    public id_number: number;
    public name: string;
    public debug: boolean = true;
    
    constructor(id: number, name: string) {
        this.id_number = id;
        this.name = name;
    }//constructor

    public log(message: string): void {
        if (this.debug == true) {
            const timestamp = Date.now();
            console.log(`[HW - ${this.name} id: ${this.id_number} - ${timestamp}]: ${message}`);
        }//if
    }//log

    public hexLog(value: number, length: number): string {
        let hex = value.toString(16).toUpperCase();
        hex = hex.padStart(length, '0');
        return hex;
    }//hexLog
}//Hardware