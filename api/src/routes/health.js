export default async function healthRoutes(fastify) {
    fastify.get('/health/live', async () => ({ status: 'ok' }))

    fastify.get('/health/ready', async (request, reply) => {
        try {
            await Promise.all([
                fastify.pg.query('SELECT 1'),
                fastify.redis.ping()
            ])

            return { status: 'ok' }
        } catch (error) {
            request.log.warn({ err: error }, 'Readiness check failed')
            return reply.code(503).send({ status: 'unavailable' })
        }
    })
}
