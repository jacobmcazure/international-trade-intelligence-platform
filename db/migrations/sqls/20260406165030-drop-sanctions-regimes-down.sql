CREATE TABLE sanctions_regimes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    issuing_body VARCHAR(100),
    start_date DATE,
    status VARCHAR(50)
);

ALTER TABLE sanctioned_entities
ADD COLUMN regime_id UUID REFERENCES sanctions_regimes(id);