/**
 * Encapsulates all the routes
 * @param {FastifyInstance} fastify  Instance of fastify
 * @param {Object} options  plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function sanctionsRoutes (fastify, options) {
    // count of sanctions by country
    fastify.get('/sanctions/counts', async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const res = await client.query(
                `SELECT sa.country, COUNT(DISTINCT se.entity_id) AS count 
                FROM sanctioned_entities as se 
                INNER JOIN sanctions_addresses as sa on se.entity_id = sa.entity_id 
                AND address <> 'NaN' 
                WHERE country = 'Cuba'
                GROUP BY sa.country 
                ORDER BY count DESC`
            )
            return {counts: res.rows}
        } finally {
            client.release()
        }
    });
    
    // sanctions info
    fastify.get('/sanctions', async (request, reply) => {
        const { country } = request.query;

        const client = await fastify.pg.connect()
        try {
           const { rows } = await client.query(
            `SELECT DISTINCT ON (se.entity_id) se.*, sa.city_state_zip, sa.country, sa.remarks 
            FROM sanctioned_entities as se 
            INNER JOIN sanctions_addresses as sa on se.entity_id = sa.entity_id 
            WHERE ($1::text IS NULL OR sa.country = $1) 
            AND address <> 'NaN' 
            ORDER BY se.entity_id DESC 
            LIMIT 1000`, [country]
        )
           return {data: rows}
        } finally {
           client.release()
        }
    });

}

//ESM
export default sanctionsRoutes;
