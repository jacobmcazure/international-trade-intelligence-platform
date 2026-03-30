import fp from 'fastify-plugin'
import fastifyRedis from '@fastify/redis'


async function redisPlugin(fastify, options) {
    fastify.register(fastifyRedis, {
        url: process.env.REDIS_URL
    })
}


export default fp(redisPlugin);