ALTER TABLE sanctioned_entities
ADD COLUMN added_date DATE,
ADD COLUMN removed_date DATE,
ADD COLUMN country_iso varchar(3);

ALTER TABLE sanctioned_entities
DROP CONSTRAINT IF EXISTS sanctioned_entities_entity_id_key;