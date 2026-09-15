
async function countriesRoutes(fastify) {

    fastify.get('/countries', async (request, reply) => {
        const client = await fastify.pg.connect();
        //const { countryInfo } = request.params;

        try {
            const { rows } = await client.query(
                'SELECT * FROM countries ORDER BY name'
            );
            return rows;
        } 
        catch (err) {
            fastify.log.error({ err }, 'Failed to fetch country data');
            return reply.code(500).send({ error: 'Unable to retrieve country data'});
        }
        finally {
            client.release()
        }
    });
    //TODO: handle per country client component request
    // fastify.get('/countries/:name', async(request, reply) => {
    //     const { country } = request.params;

    //     try {
    //         const { rows } = await client.query(
    //             'SELECT * FROM countries WHERE name ILIKE $1', [name]
    //         );
    //         return rows
    //     }
    //     catch(err) {
    //         fastify.log.error({ err }, 'Failed to fetch requested country data');
    //         return reply.code(500).send({ error: 'Unable to retrieve the requested country data'});
    //     }
    // });

    fastify.get('/countries/codes', async(request, reply) => {
        const { rows } = await fastify.pg.query(
            'SELECT iso_code, name FROM countries ORDER BY name'
        );
        return rows;
    });
}

export default countriesRoutes;
