/**
 * Encapsulates all the routes
 * @param {FastifyInstance} fastify  Instance of fastify
 * @param {Object} options  plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function sanctions (fastify, options) {
    fastify.get('/', async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
           const { rows } = await client.query(
            'SELECT se.*, sa.address, sa.city_state_zip, sa.country, sa.remarks ' +
            'FROM sanctioned_entities as se ' +
            'INNER JOIN sanctions_addresses as sa on se.entity_id = sa.entity_id'
        )
           const pong = await fastify.redis.ping() 
           return {db: rows, redis: pong }
        } finally {
           client.release()
        }
    })
}

//ESM
export default sanctions;