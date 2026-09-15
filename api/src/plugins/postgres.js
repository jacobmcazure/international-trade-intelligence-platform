//ESM stuff
import fp from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres';


async function postgresPlugin(fastify, options) {
    const databaseConfig = process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL }
        : {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT ?? 5432),
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD
        }

    await fastify.register(fastifyPostgres, {
        ...databaseConfig,
        connectionTimeoutMillis: 3000,
        statement_timeout: 10000,
        max: 10
    });
}

export default fp(postgresPlugin);
