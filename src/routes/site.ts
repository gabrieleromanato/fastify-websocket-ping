import {
    FastifyRequest,
    FastifyReply
} from "fastify";

export default function (request:FastifyRequest, reply:FastifyReply) {
    return reply.sendFile('index.html');
}