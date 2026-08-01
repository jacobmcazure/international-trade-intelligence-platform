//ESM stuff
import fp from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres';


async function postgresPlugin(fastify, options) {
    await fastify.register(fastifyPostgres, {
        connectionString: process.env.DATABASE_URL
    });
}

export default fp(postgresPlugin);
