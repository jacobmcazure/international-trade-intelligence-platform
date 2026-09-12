import pandas as pd
from pipelines.BasePipeline import ProcessPipeline
import pycountry
import requests
import psycopg2 as pg
from psycopg2.extras import execute_values


# region Constants
WB_CODES = {"GDP" : "NY.GDP.MKTP.CD",
         "CPI" : "FP.CPI.TOTL.ZG",
         "Unemployment" : "SL.UEM.TOTL.ZS",
         "Population growth" : "SP.POP.GROW",
         "Life expectancy at birth" : "SP.DYN.LE00.IN",
         "Mortality rate" : "SP.DYN.IMRT.IN",
         "Birth rate" : "SP.DYN.CBRT.IN",
         "Income hare held by highest 10%" : "SI.DST.10TH.10",
         "Literacy rate (youth 15-24)" : "SE.ADT.1524.LT.ZS"
        }

DATE_RANGE = "1970:2023"

# endregion

def get_actual_countries():
    url = "https://api.worldbank.org/v2/country"
    params = {
        "format": "json",
        "per_page": 1000,
        "page": 1
    }
    response = requests.get(url, params=params)
    data = response.json()
    if len(data) < 2:
        print("API returned unexpected or empty structure.")
        return []
    country_list = data[1]
    actual_countries = []
    # Only keep countries with a region and use the iso3 code that matches
    # the countryiso3code column in the World Bank data
    for entity in country_list:
        region_info = entity.get("region", {})
        iso3_code = entity.get("id")
        if region_info and region_info.get("id") != "NA":
            if pycountry.countries.get(alpha_3=iso3_code) is not None:    
                actual_countries.append(entity["id"])
            else:
                print(f"Non country iso3 code found - skipping: {iso3_code}")
    return actual_countries


VALID_COUNTRIES = set(get_actual_countries())


class WorldBankPipeline(ProcessPipeline):

    def extract(self, wb_code):
        url = f"https://api.worldbank.org/v2/country/all/indicator/{wb_code}"

        all_records = []
        page = 1
                
        while True:
            params = {
                "date": DATE_RANGE,
                "format": "json",
                "per_page": 1000,
                "page": page
            }

            response = requests.get(url, params=params)
            if response.status_code != 200:
                print(f"Error fetching data: HTTP {response.status_code}")
                break

            data = response.json()
            # 0 : metadata, 1 : data
            if len(data) < 2 or not data[1]:
                break

            all_records.extend(data[1])

            # paginate
            metadata = data[0]
            if page >= metadata["pages"]:
                break

            page += 1


        # flatten json data
        parsed_data = []
        for record in all_records:
            parsed_data.append({
                "countryiso3": record["countryiso3code"],
                "indicator": record["indicator"]["id"],
                "year": int(record["date"]),
                "value": record["value"]
            })

        df = pd.DataFrame(parsed_data)
        return df
        

    def transform(self, df):
        if df.empty:
            return df
        else:
            print("valid dataframe (not empty)")

        # Keep the long-form World Bank data and remove rows that are incomplete
        df = df.copy()
        df["countryiso3"] = df["countryiso3"].replace(r'^\s*$', None, regex=True)
        df["indicator"] = df["indicator"].replace(r'^\s*$', None, regex=True)
        df["year"] = pd.to_numeric(df["year"], errors="coerce")
        df["value"] = pd.to_numeric(df["value"], errors="coerce")
        df = df.where(pd.notna(df), None)

        df = df[df["countryiso3"].isin(VALID_COUNTRIES)].copy()
        df = df.dropna(subset=["countryiso3", "indicator", "year", "value"]).copy()

        return df

    def load(self, df):
        conn = self.get_db_connection()

        query = '''
            INSERT INTO economic_indicators(country_iso3, indicator_code, ref_year, value)
            VALUES %s
            ON CONFLICT (country_iso3, indicator_code, ref_year)
            DO UPDATE SET value = EXCLUDED.value
            '''

        records = [
            (
                None if pd.isna(row["countryiso3"]) else row["countryiso3"],
                None if pd.isna(row["indicator"]) else row["indicator"],
                None if pd.isna(row["year"]) else int(row["year"]),
                None if pd.isna(row["value"]) else row["value"]
            )
            for _, row in df.iterrows()
        ]

        with conn.cursor() as cur:
            execute_values(cur, query, records)

        conn.commit()
        conn.close()


