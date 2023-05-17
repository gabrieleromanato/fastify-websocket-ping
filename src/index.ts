import path from 'node:path';
import process from "node:process";
import fastify  from "fastify";
import { fastifyStatic } from "@fastify/static";
import websocket from '@fastify/websocket';
import routes from "./routes";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8888;

const server = fastify({
    logger: true
});

server.setErrorHandler(function (error, request, reply) {
    this.log.error(error);
    reply.status(500).send({ error });
});

server.register(websocket);

server.register(fastifyStatic, {
    root: path.join(__dirname, 'static')
});


server.register(routes);

server.listen({ port: PORT }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});