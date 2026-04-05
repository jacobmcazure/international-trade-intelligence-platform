ALTER TABLE sanctioned_entities
DROP COLUMN title;

ALTER TABLE sanctioned_entities
RENAME COLUMN entity_id TO external_id;