ALTER TABLE sanctioned_entities
ADD COLUMN title VARCHAR(200);

ALTER TABLE sanctioned_entities
RENAME COLUMN external_id TO entity_id;