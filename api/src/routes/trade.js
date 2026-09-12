async function tradeRoutes(fastify) {
  fastify.get('/trade/dependencies', {
    schema: {
      querystring: {
        type: 'object',
        required: ['year', 'hs_code'],
        properties: {
          year: { type: 'integer' },
          hs_code: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { year, hs_code } = request.query;

    const client = await fastify.pg.connect();
    try {
      const bilateralResult = await client.query(
        `SELECT
            t.hs_code,
            t.reporter_iso,
            r.name AS reporter_name,
            t.partner_iso,
            p.name AS partner_name,
            t.pct_of_total,
            t.primary_value
         FROM trade_imports t
         JOIN countries r ON t.reporter_iso = r.iso_code
         LEFT JOIN countries p ON t.partner_iso = p.iso_code
         WHERE t.ref_year = $1
           AND t.hs_code = $2
           AND t.partner_iso != 'W00'
         ORDER BY t.primary_value DESC
         LIMIT 20`,
        [year, hs_code]
      );

      const worldResult = await client.query(
        `SELECT
            t.reporter_iso,
            r.name AS reporter_name,
            t.primary_value
         FROM trade_imports t
         JOIN countries r ON t.reporter_iso = r.iso_code
         WHERE t.ref_year = $1
           AND t.hs_code = $2
           AND t.partner_iso = 'W00'
         ORDER BY t.primary_value DESC`,
        [year, hs_code]
      );

      const nodeMap = new Map();
      const links = [];

      for (const row of bilateralResult.rows) {
        nodeMap.set(row.reporter_iso, row.reporter_name);
        nodeMap.set(row.partner_iso, row.partner_name);
        links.push({
          source: row.partner_iso,
          target: row.reporter_iso,
          value: parseFloat(row.pct_of_total),
          primary_value: parseFloat(row.primary_value),
          hs_code: row.hs_code
        });
      }

      const nodes = Array.from(nodeMap, ([id, name]) => ({ id, name }));

      const worldTotals = worldResult.rows.map(row => ({
        reporter_iso: row.reporter_iso,
        reporter_name: row.reporter_name,
        primary_value: parseFloat(row.primary_value)
      }));

      return { nodes, links, worldTotals };
    } finally {
      client.release();
    }
  });
}

export default tradeRoutes;
