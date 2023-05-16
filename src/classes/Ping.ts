import { spawn } from "node:child_process";
import validator from "validator";

export default class Ping {
    private host: string;
    private times: number;
    constructor(host:string, times:number) {
        this.host = host;
        this.times = times;
    }

    validate():boolean {
        if(!validator.isFQDN(this.host) && !validator.isIP(this.host)) {
            return false;
        }
        if(this.times < 1 || this.times > 10) {
            return false;
        }
        const times = this.times.toString();

        return validator.isInt(times);
    }

    send({ ondata = function (d:string) {}, onerror = function (d:string) {}, onclose = function (c:number|null) {} }) {
        if(!this.validate()) {
            throw new Error('Invalid parameters.');
        }
        const cmd = spawn('ping', ['-c', this.times.toString(), this.host]);

        cmd.stdout.on('data', data => {
            ondata(data.toString());
        });

        cmd.stderr.on('data', data => {
            onerror(data.toString());
        });

        cmd.on('close', code => {
            onclose(code);
        });
    }
}
