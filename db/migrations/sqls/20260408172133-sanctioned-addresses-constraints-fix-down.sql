ALTER TABLE sanctions_addresses
DROP CONSTRAINT sanctions_addresses_entity_id_fkey;

ALTER TABLE sanctions_addresses
RENAME COLUMN entity_id TO sanctioned_entity_id;

ALTER TABLE sanctions_addresses
ALTER COLUMN sanctioned_entity_id TYPE UUID USING sanctioned_entity_id::UUID;

ALTER TABLE sanctions_addresses
ADD CONSTRAINT sanctions_addresses_sanctioned_entity_id_fkey
FOREIGN KEY (sanctioned_entity_id) REFERENCES sanctioned_entities(id);