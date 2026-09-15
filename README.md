# Trade Intel

An international geopolitical trade intelligence platform that presents bilateral trade flows, sanctions, 
country indicators, historical data, commodities, and world news in one place.

## Services

- `frontend` - Next.js, React, TypeScript
- `api` - Node.js, Fastify
- `etl` - Python
- `db` - PostgreSQL (migrations)


## External Data API sources

- `Country Indicators` - worldbank
- `Bilateral Trade` - UN Comtrade
- `Sanctions List` - OFAC (office of foreign assets control)
- `News Feed` - google news RSS

## Local development

The existing `docker-compose.yaml` is the development stack. It mounts source
directories into the containers and runs the Next.js development server.

```sh
docker compose up --build
```

## Production

Production uses `docker-compose.prod.yaml`. It builds immutable application
images, runs containers as non-root users where practical, keeps the API and
data services off the public network, and terminates HTTPS with Caddy.

The deployment target is a single 1 GB Amazon Lightsail Linux instance with
2 GB of swap for this low-traffic workload. See
[`DEPLOYMENT.md`](DEPLOYMENT.md) for provisioning, deployment, migration,
initial data transfer, annual ETL, and update procedures.

## Production regression checks

With Node 22 installed, run `npm ci --prefix api`, `npm ci --prefix tests`,
then `npm test --prefix tests`. These checks exercise the migration module
against embedded PostgreSQL, API connection management and dependency health,
and parse the development/production Compose files. They do not replace Docker
builds, a real PostgreSQL 16 data import, or browser smoke tests.
