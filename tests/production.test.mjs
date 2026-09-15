import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { parse } from 'yaml';
import Fastify from '../api/node_modules/fastify/fastify.js';
import countries from '../api/src/routes/countries.js';
import health from '../api/src/routes/health.js';
import migration from '../db/migrations/20260907213724-initial-schema.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('initial schema respects migration history; constraints and rollback work', async () => {
  const db = new PGlite();
  migration.setup({ dbmigrate: { dataType: {} }, Promise });
  const driver = { runSql: sql => db.exec(sql) };
  try {
    // db-migrate creates this table before executing application migrations.
    await db.exec('CREATE TABLE migrations (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, run_on TIMESTAMP NOT NULL)');
    await migration.up(driver);
    await db.exec("INSERT INTO migrations(name, run_on) VALUES ('initial', now())");
    await db.exec("INSERT INTO countries(iso_code, name) VALUES ('USA', 'United States')");
    await db.exec("INSERT INTO commodities(hs_code) VALUES ('2709')");
    await db.exec("INSERT INTO trade_imports(hs_code, ref_year, reporter_iso, partner_iso, primary_value, pct_of_total) VALUES ('2709', 2025, 'USA', 'W00', 100, 1)");
    await assert.rejects(db.exec("INSERT INTO country_gdp(country_iso, year_end, gdp_usd) VALUES ('XXX', '2025-12-31', 1)"));
    await migration.down(driver);
    assert.equal((await db.query('SELECT name FROM migrations')).rows[0].name, 'initial');
    await migration.up(driver);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM countries')).rows[0].n, 0);
  } finally { await db.close(); }
});

test('countries endpoint uses pool-managed queries repeatedly and recovers from failure', async () => {
  const app = Fastify();
  let fail = false;
  let calls = 0;
  app.decorate('pg', {
    connect() { throw new Error('Manual checkout would reintroduce the connection leak'); },
    async query() { calls++; if (fail) throw new Error('database unavailable'); return { rows: [{ iso_code: 'USA', name: 'United States' }] }; }
  });
  app.register(countries);
  try {
    for (let i = 0; i < 30; i++) {
      const r = await app.inject('/countries/codes');
      assert.equal(r.statusCode, 200);
      assert.equal(r.json()[0].iso_code, 'USA');
    }
    fail = true;
    assert.equal((await app.inject('/countries/codes')).statusCode, 500);
    fail = false;
    assert.equal((await app.inject('/countries/codes')).statusCode, 200);
    assert.equal(calls, 32);
  } finally { await app.close(); }
});

test('readiness rejects dependency failure while liveness remains available', async () => {
  const app = Fastify();
  let failDb = false;
  let failRedis = false;
  app.decorate('pg', { async query() { if (failDb) throw new Error('db down'); } });
  app.decorate('redis', { async ping() { if (failRedis) throw new Error('redis down'); } });
  app.register(health);
  try {
    assert.equal((await app.inject('/health/ready')).statusCode, 200);
    failDb = true;
    assert.equal((await app.inject('/health/ready')).statusCode, 503);
    failDb = false; failRedis = true;
    assert.equal((await app.inject('/health/ready')).statusCode, 503);
    assert.equal((await app.inject('/health/live')).statusCode, 200);
  } finally { await app.close(); }
});

test('Compose separates production state, dev build and public exposure', () => {
  const prod = parse(read('docker-compose.prod.yaml'));
  const dev = parse(read('docker-compose.yaml'));
  assert.equal(prod.name, 'trade-intel-prod');
  assert.deepEqual(Object.entries(prod.services).filter(([, s]) => s.ports).map(([name]) => name), ['caddy']);
  assert.deepEqual(prod.services.etl.profiles, ['etl']);
  assert.deepEqual(prod.services.migrate.profiles, ['tools']);
  assert.match(prod.services.frontend.healthcheck.test.at(-1), /\/api\/health/);
  assert.match(prod.services.api.healthcheck.test.at(-1), /\/health\/ready/);
  assert.equal(dev.services.frontend.build.dockerfile, 'Dockerfile.dev');
  for (const name of ['api', 'frontend', 'migrate']) assert.match(prod.services[name].image, /RELEASE_TAG/);
  for (const name of ['api', 'frontend']) assert.equal(prod.services[name].volumes, undefined);
});
