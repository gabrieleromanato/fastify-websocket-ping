import {
    FastifyRequest,
    FastifyReply,
    FastifyInstance, FastifyPluginOptions
} from "fastify";
import Ping from "../classes/Ping";
import {SocketStream} from "@fastify/websocket";

export default function (fastify:FastifyInstance, opts:FastifyPluginOptions, done:Function) {
    fastify.get('/', (request:FastifyRequest, reply:FastifyReply) => {
        return reply.sendFile('index.html');
    });
    fastify.get('/ping', { websocket: true }, (connection:SocketStream, request:FastifyRequest) => {
        connection.socket.on('message', message => {

            const data = JSON.parse(message.toString());

            try {
                const ping = new Ping(data.host, data.times);
                const actions = {
                    ondata(data:string) {
                        connection.socket.send(data);
                    },
                    onerror(msg:string) {
                        connection.socket.send(`error: ${msg}`);
                    },
                    onclose(code:number|null) {
                        connection.socket.send(`process exited with code ${code}`);
                    }
                };
                ping.send(actions);
            } catch (err) {
                connection.socket.send('Request error.');
            }

        });
    });
    done()
}