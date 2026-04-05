CREATE TABLE sanctions_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sanctioned_entity_id UUID NOT NULL REFERENCES sanctioned_entities(id),
    address VARCHAR(750),
    city_state_zip VARCHAR(116),
    country VARCHAR(250),
    remarks VARCHAR(200)
);