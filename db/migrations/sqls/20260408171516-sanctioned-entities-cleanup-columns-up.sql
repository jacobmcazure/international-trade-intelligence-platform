ALTER TABLE sanctioned_entities
DROP COLUMN IF EXISTS added_date,
DROP COLUMN IF EXISTS removed_date,
DROP COLUMN IF EXISTS country_iso;

ALTER TABLE sanctioned_entities
ADD CONSTRAINT sanctioned_entities_entity_id_key UNIQUE (entity_id);