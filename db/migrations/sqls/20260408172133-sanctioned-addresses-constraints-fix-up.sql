ALTER TABLE sanctions_addresses
DROP CONSTRAINT sanctions_addresses_sanctioned_entity_id_fkey;

ALTER TABLE sanctions_addresses
RENAME COLUMN sanctioned_entity_id TO entity_id;

ALTER TABLE sanctions_addresses
ALTER COLUMN entity_id TYPE VARCHAR(20);

ALTER TABLE sanctions_addresses
ADD CONSTRAINT sanctions_addresses_entity_id_fkey
FOREIGN KEY (entity_id) REFERENCES sanctioned_entities(entity_id);