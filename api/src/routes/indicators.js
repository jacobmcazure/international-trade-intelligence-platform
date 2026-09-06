async function countryindicators(fastify) {
    fastify.get('/indicators', async(request, reply) => {
        const { iso3, indicator_code } = request.query;

        const { rows } = await fastify.pg.query(
            `SELECT ei.ref_year, ei.value
            FROM economic_indicators ei
            WHERE country_iso3 = $1
            AND indicator_code = $2
            ORDER BY ei.ref_year
            `,
            [iso3, indicator_code]
        );

        const { rows: [countryInfo] } = await fastify.pg.query(
          `SELECT name FROM countries WHERE iso_code = $1`,
          [iso3]
        );
    
        const { rows: [indicatorInfo] } = await fastify.pg.query(
          `SELECT name, unit FROM indicators WHERE code = $1`,
          [indicator_code]
        );
        
        return { 
            data: rows,
            country: countryInfo?.name ?? null,
            indicator: indicatorInfo?.name ?? null,
            unit: indicatorInfo?.unit ?? null,
         };
    });
}

export default countryindicators;
