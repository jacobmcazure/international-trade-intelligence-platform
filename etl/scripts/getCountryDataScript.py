import json
import os
import psycopg2 as pg
from dotenv import load_dotenv



load_dotenv()

with open("countries.json", "r") as file:
    country_data = json.load(file)

#2. Connect to database
conn = pg.connect(
            host=os.getenv("POSTGRES_HOST"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            dbname=os.getenv("POSTGRES_DB"),
            port=os.getenv("POSTGRES_PORT")
)
cursor = conn.cursor()

for country in country_data:
    iso3 = country.get("iso3","N/A")
    name = country.get("name","N/A")
    region = country.get("region","N/A")
    subregion = country.get("subregion","N/A")
    population = country.get("population","N/A")
    capital = country.get("capital","N/A")
    latitude = country.get("latitude","N/A")
    longitude = country.get("longitude","N/A")
    currency = country.get("currency_name","N/A")
    gdp = country.get("gdp","N/A")

    cursor.execute(
        """
        INSERT INTO countries (iso_code, name, region, population, capital, subregion, latitude, longitude, currency, gdp)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (iso3, name, region, population, capital, subregion, latitude, longitude, currency, gdp),
    )

conn.commit()
conn.close()
print(f"Successfully loaded {len(country_data)} countries into database.")
