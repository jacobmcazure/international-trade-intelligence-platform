# Lightsail deployment and recovery

Status: production candidate. Docker image builds, a real PostgreSQL migration,
data import and HTTPS tests are release gates, not assumed successes.
The design uses one 2 GB Ubuntu Lightsail instance with Docker Compose. Only
Caddy publishes ports. Annual ETL is optional and does not run at startup.

## Host and release preparation

Use a stable directory, `/opt/trade-intel`, for the reviewed source release.
You may transfer files directly or clone a production branch; merging into
main is not required. For a private repository use read-only repository access.
Keep credentials out of clone URLs. Record the source revision for each release.

Attach a static IPv4 address. Allow TCP 80/443 publicly and TCP 22 only from
your administrative IP where practical. UDP 443 is optional for HTTP/3.
Point the chosen hostname's A record at the static IP. Only publish an AAAA
record if IPv6 routing and firewall rules are also configured. No load balancer
or managed database is required. Configure an AWS budget alert.

Install Docker Engine and the Compose plugin using the official Ubuntu
instructions: https://docs.docker.com/engine/install/ubuntu/. Enable Docker
at boot. Patch Ubuntu and configure 1–2 GB swap for brief memory spikes.
Build images sequentially; if the host runs out of memory, build on another
Linux Docker host with the same CPU architecture and transfer images using
`docker save`/`docker load`. Never copy a host node_modules directory into images.

From `/opt/trade-intel`:

```sh
cp .env.production.example .env.production.local
chmod 600 .env.production.local
```

Edit the hostname, a unique RELEASE_TAG (for example a source revision), and a
long random alphanumeric database password. The production environment file is
gitignored. Never reuse a release tag for different source. POSTGRES_USER is
the bootstrap administrator; the current API uses that same role. Keep the API
private; a separate least-privilege application role is a recommended follow-up.
Changing these variables does not change credentials in an existing database.

The following shell helper is used throughout this document. Run it in each
new Bash session after changing to `/opt/trade-intel`:

```sh
dc() { docker compose --env-file .env.production.local -f docker-compose.prod.yaml "$@"; }
```

Production has the fixed project name `trade-intel-prod`, separate from local
development. Never use `down -v` on a database you intend to keep. If an earlier
production installation already exists under another Compose project name,
explicitly transfer its data before adopting this configuration.

## Build and initialize

```sh
dc config --quiet
dc build frontend
dc build api
dc --profile tools build migrate
dc run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
dc up -d --wait postgres redis
dc --profile tools run --rm migrate
dc --profile tools run --rm migrate
```

The second migration run must report no pending migrations. The migration tool
owns its tracking table; application migrations must not create/drop it.
Editing the initial migration fixes fresh installs and does not replay it on
databases that have already recorded it. Do not apply `down` to populated data.

## Transfer the existing dataset before starting the application

Migrations create an empty schema. Prefer transferring the existing reviewed
dataset instead of re-running annual downloads on the small production host.
Stop ETL/data writers for the export and record row counts for all eight application tables.
First rehearse this entire migration/import procedure in a disposable database.

On the existing development machine, the following commands write the binary
archive inside the container then copy it out, avoiding PowerShell binary pipe
corruption. These use the existing development container name:

```sh
docker exec trade_intel_db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --data-only --no-owner --no-acl --table=public.commodities --table=public.countries --table=public.country_gdp --table=public.economic_indicators --table=public.indicators --table=public.sanctioned_entities --table=public.sanctions_addresses --table=public.trade_imports --file=/tmp/trade-initial.dump'
docker cp trade_intel_db:/tmp/trade-initial.dump ./trade-initial.dump
```

Transfer the archive securely to `/opt/trade-intel/import/trade-initial.dump`
on Lightsail (create the directory first and restrict access). The dump excludes
migration history, so the fresh server retains the history created by its own
successful migrations. Do not restore development schema or tracking tables
over the new schema. Restore only into the newly migrated, EMPTY database:

```sh
dc exec -T postgres sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --data-only --no-owner --no-acl --single-transaction --exit-on-error' < import/trade-initial.dump
```

Verify row counts against the source for every exported table. Foreign key or
column errors mean the source schema/data differs from the migration: stop and
reconcile the discrepancy rather than disabling constraints. A failed import
rolls back its transaction. Do not rerun a successful import into populated tables.
Check representative countries, years, indicators, sanctions and trade values.

## Start and prove the release

```sh
dc up -d --wait
dc ps
dc logs --tail=100 api frontend caddy
curl --fail --show-error https://YOUR_DOMAIN/
dc exec -T api node -e "fetch('http://127.0.0.1:3000/health/ready').then(r=>{if(!r.ok)process.exit(1)})"
docker stats --no-stream
```

Verify pages and actual countries, trade, indicators, sanctions and news data
in a browser; a healthy home page alone is insufficient. Exercise countries
repeatedly to catch connection-pool exhaustion. Check for browser console errors.
Restart containers and confirm data persists. Reboot the instance and confirm
the website returns. Caddy needs public DNS and reachable ports for certificates.
Health checks mark failed containers unhealthy; Docker restart policies restart
exited processes, not merely unhealthy containers. Review unhealthy state explicitly.

## Updates and rollback

Record the current RELEASE_TAG and source revision. Keep the previous source
release and tagged images. Set a NEW RELEASE_TAG and
copy the corresponding reviewed source before building:

```sh
dc build frontend
dc build api
dc --profile tools build migrate
dc stop caddy frontend api
dc --profile tools run --rm migrate
dc up -d --no-build --wait
```

Check every command succeeds before proceeding. This deliberately allows brief
downtime for schema changes. Never restart the app after a failed migration.
The explicit migration build ensures updated migration files reach the image.

For an application rollback with a compatible schema, restore the previous
RELEASE_TAG and matching Compose/source configuration, then run
`dc up -d --no-build --wait`. Do not prune those images until the release is
accepted. Because this deployment intentionally has no recurring database
backups, future schema migrations must be additive and backward-compatible.
Do not deploy destructive migrations unless a separate recovery plan is added.

## Annual ETL

Run a chosen module explicitly from the container's `/app`:

```sh
dc --profile etl run --build --rm etl python -m scripts.worldbankscript
```

Module invocation allows sibling `pipelines` imports to resolve. Configure the
UN Comtrade key only when needed. Verify pipeline prerequisites and updated row
counts; ETL is not part of routine deployment. Heavy annual imports may be run
on a separate machine and transferred using a rehearsed database procedure.

## Release acceptance

- Production and development images build successfully with locked dependencies.
- Fresh migrations, repeat migrations and initial data transfer pass.
- HTTPS and all application data flows pass browser smoke tests.
- Container restart/reboot persistence and memory/disk usage are acceptable.
- Previous application release and its RELEASE_TAG are recorded.

Do not label a release production-verified until these checks have actually run.
