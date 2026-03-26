-- ============================================================
-- DIMENSION TABLES (no dependencies)
-- ============================================================

CREATE TABLE countries (
    iso_code CHAR(3) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    latitude FLOAT,
    longitude FLOAT,
    population BIGINT,
    gdp_usd FLOAT,
    gdp_year INT
);

CREATE TABLE commodities (
    hs_code VARCHAR(10) PRIMARY KEY,
    description TEXT,
    category VARCHAR(100),
    parent_hs_code VARCHAR(10) REFERENCES commodities(hs_code),
    hs_revision INT
);

CREATE TABLE trade_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    agreement_type VARCHAR(100),
    effective_date DATE,
    expiry_date DATE,
    status VARCHAR(50),
    description TEXT
);

CREATE TABLE sanctions_regimes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    issuing_body VARCHAR(100),
    start_date DATE,
    status VARCHAR(50)
);

CREATE TABLE oil_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_date DATE NOT NULL,
    benchmark VARCHAR(50) NOT NULL,
    price_usd FLOAT NOT NULL,
    source VARCHAR(100)
);

-- ============================================================
-- TRADE FACT CLUSTER
-- ============================================================

CREATE TABLE trade_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    partner_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    hs_code VARCHAR(10) REFERENCES commodities(hs_code),
    year INT NOT NULL,
    import_value_usd BIGINT,
    export_value_usd BIGINT,
    data_source VARCHAR(100)
);

CREATE TABLE tariff_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    partner_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    hs_code VARCHAR(10) REFERENCES commodities(hs_code),
    year INT NOT NULL,
    applied_rate FLOAT,
    mfn_rate FLOAT,
    source VARCHAR(100)
);

CREATE TABLE trade_agreement_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID NOT NULL REFERENCES trade_agreements(id),
    country_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    joined_date DATE
);

CREATE TABLE trade_restrictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imposing_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    target_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    hs_code VARCHAR(10) REFERENCES commodities(hs_code),
    restriction_type VARCHAR(100),
    effective_date DATE,
    lifted_date DATE,
    description TEXT
);

-- ============================================================
-- SANCTIONS CLUSTER
-- ============================================================

CREATE TABLE sanctioned_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regime_id UUID NOT NULL REFERENCES sanctions_regimes(id),
    country_iso CHAR(3) REFERENCES countries(iso_code),
    name VARCHAR(255) NOT NULL,
    aliases TEXT,
    entity_type VARCHAR(100),
    added_date DATE,
    removed_date DATE
);

CREATE TABLE sanctions_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES sanctioned_entities(id),
    event_type VARCHAR(100),
    effective_date DATE,
    description TEXT
);

-- ============================================================
-- POLICY
-- ============================================================

CREATE TABLE policy_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    event_type VARCHAR(100),
    event_date DATE,
    title VARCHAR(255),
    description TEXT
);

-- ============================================================
-- OIL SUB-SCHEMA
-- ============================================================

CREATE TABLE oil_production (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    year INT NOT NULL,
    month INT,
    barrels_per_day FLOAT,
    source VARCHAR(100)
);

CREATE TABLE oil_reserves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    year INT NOT NULL,
    proven_barrels FLOAT,
    source VARCHAR(100)
);

CREATE TABLE opec_quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    year INT NOT NULL,
    month INT NOT NULL,
    quota_barrels FLOAT,
    actual_barrels FLOAT
);