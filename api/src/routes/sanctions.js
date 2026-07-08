/**
 * Encapsulates all the routes
 * @param {FastifyInstance} fastify  Instance of fastify
 * @param {Object} options  plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function sanctions (fastify, options) {
    fastify.get('/', async (request, reply) => {
        const { country } = request.query

        const client = await fastify.pg.connect()
        try {
           const { rows } = await client.query(
            "SELECT DISTINCT ON (se.entity_id) se.*, sa.city_state_zip, sa.country, sa.remarks " +
            "FROM sanctioned_entities as se " +
            "INNER JOIN sanctions_addresses as sa on se.entity_id = sa.entity_id " +
            "WHERE ($1::text IS NULL OR sa.country = $1) " + 
            "ORDER BY se.entity_id DESC " + 
            "LIMIT 1000", [country]
        )
           return {data: rows}
        } finally {
           client.release()
        }
    })
}

//ESM
export default sanctions;