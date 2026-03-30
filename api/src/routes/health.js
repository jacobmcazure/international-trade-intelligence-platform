/**
 * Encapsulates all the routes
 * @param {FastifyInstance} fastify  Instance of fastify
 * @param {Object} options  plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes (fastify, options) {
    fastify.get('/', async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
           const { rows } = await client.query('SELECT * FROM countries')
           const pong = await fastify.redis.ping() 
           return {db: rows, redis: pong }
        } finally {
           client.release()
        }
    })
}

//ESM
export default routes;