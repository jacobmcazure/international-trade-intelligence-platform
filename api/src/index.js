//Entry point into the application
//ESM / ECMA
import Fastify from 'fastify'
import postgres from './plugins/postgres.js'
import redis from './plugins/redis.js'
import sanctionsRoute from './routes/sanctions.js'
import newsfeedRoute from './routes/newsfeed.js'
import countriesRoute from './routes/countries.js'
import tradeRoutes from './routes/trade.js'
import indicatorsRoute from './routes/indicators.js'
import healthRoutes from './routes/health.js'

// logs address automatically on startup
const fastify = Fastify({
    logger: true
})

// Add Route
fastify.register(postgres)
fastify.register(redis)
fastify.register(sanctionsRoute)
fastify.register(newsfeedRoute)
fastify.register(countriesRoute)
fastify.register(tradeRoutes)
fastify.register(indicatorsRoute)
fastify.register(healthRoutes)

let shuttingDown = false

const shutdown = async (signal) => {
    if (shuttingDown) return
    shuttingDown = true

    fastify.log.info({ signal }, 'Shutting down API')

    const forceExit = setTimeout(() => {
        fastify.log.error('Graceful shutdown timed out')
        process.exit(1)
    }, 10000)
    forceExit.unref()

    try {
        await fastify.close()
        clearTimeout(forceExit)
        process.exit(0)
    } catch (error) {
        fastify.log.error(error, 'Failed to shut down cleanly')
        process.exit(1)
    }
}

process.once('SIGTERM', () => shutdown('SIGTERM'))
process.once('SIGINT', () => shutdown('SIGINT'))

// Run Server
const start = async () => {
    try {
        await fastify.listen({port: process.env.FASTIFY_PORT ?? 3000, host: '0.0.0.0'})
        //fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
