//Entry point into the application
//ESM / ECMA
import Fastify from 'fastify'
import postgres from './plugins/postgres.js'
import redis from './plugins/redis.js'
import firstRoute from  './routes/health.js'

// logs address automatically on startup
const fastify = Fastify({
    logger: true
})

// Add Route
fastify.register(postgres)
fastify.register(redis)
fastify.register(firstRoute)

// Run Server
const start = async () => {
    try {
        await fastify.listen({port: process.env.FASTIFY_PORT ?? 3001, host: '0.0.0.0'})
        //fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()