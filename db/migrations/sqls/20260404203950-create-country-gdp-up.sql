CREATE TABLE country_gdp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_iso CHAR(3) NOT NULL REFERENCES countries(iso_code),
    year_end DATE NOT NULL,
    gdp_usd DOUBLE PRECISION NOT NULL
);

INSERT INTO country_gdp (country_iso, year_end, gdp_usd)
SELECT iso_code, MAKE_DATE(gdp_year, 12, 31), gdp_usd
FROM countries
WHERE gdp_usd IS NOT NULL AND gdp_year IS NOT NULL;

ALTER TABLE countries
DROP COLUMN gdp_usd,
DROP COLUMN gdp_year;