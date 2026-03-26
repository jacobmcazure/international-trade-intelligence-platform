//Entry point into the application
//ESM / ECMA
import Fastify from 'fastify'
import firstRoute from  './our-first-route.js'

// logs address automatically on startup
const fastify = Fastify({
    logger: true
})

// Add Route
fastify.register(firstRoute)

// Run Server
const start = async () => {
    try {
        await fastify.listen({port: 3000, host: '0.0.0.0'})
        //fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()