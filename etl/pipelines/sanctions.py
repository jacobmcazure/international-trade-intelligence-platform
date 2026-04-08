import requests
import pandas as pd
import io
from abc import ABC, abstractmethod
from BasePipeline import ProcessCsv
import os
import psycopg2
from dotenv import load_dotenv


class SanctionsCsv(ProcessCsv):
    def __init__(self):
        self.sdn_url = "https://sanctionslistservice.ofac.treas.gov/api/download/SDN.CSV"
        self.add_url = "https://sanctionslistservice.ofac.treas.gov/api/download/ADD.CSV"
        self.alt_url = "https://sanctionslistservice.ofac.treas.gov/api/download/ALT.CSV"

    def _fetch_csv(self, url: str) -> pd.DataFrame:
        response = requests.get(url, allow_redirects=True) # allow redirect to S3 database where data is actually stored
        response.raise_for_status()
        return pd.read_csv(io.StringIO(response.text), header=None)

    def download_csv(self) -> pd.DataFrame:
        self.sdn_df = self._fetch_csv(self.sdn_url)
        self.add_df = self._fetch_csv(self.add_url)
        self.alt_df = self._fetch_csv(self.alt_url)

    def transform_sdn_data(self) -> pd.DataFrame:
        # -- SDN --
        self.sdn_df.columns = [
            'ent_num', 'sdn_name', 'sdn_type', 'program',
            'title', 'call_sign', 'vess_type', 'tonnage',
            'grt', 'vess_flag', 'vess_owner', 'remarks'
        ]
        self.sdn_df = self.sdn_df[['ent_num', 'sdn_name', 'sdn_type', 'program', 'title', 'remarks']]
        self.sdn_df = self.sdn_df.replace('-0-', None)

        # -- ADD --
        self.add_df.columns = [
            'ent_num', 'add_num', 'address', 'country', 'remarks'
        ]
        self.add_df = self.add_df.replace('-0-', None)

        # -- ALT --
        self.alt_df.columns = [
            'ent_num', 'alt_num', 'alt_type', 'alt_name', 'alt_remarks'
        ]
        self.alt_df = self.alt_df.replace('-0-', None)

         # concatenate aliases for each entity into a csv style string
        self.aliases_df = (
            self.alt_df.groupby('ent_num')['alt_name']
            .apply(lambda x: ', '.join(x.dropna()))
            .reset_index()
            .rename(columns={'alt_name': 'aliases'})
        )

        # merge aliases into sdn
        self.sdn_df = self.sdn_df.merge(self.aliases_df, on='ent_num', how='left')

    def get_db_connection(self):
        return psycopg2.connect(
            host=os.getenv("POSTGRES_HOST"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            dbname=os.getenv("POSTBRES_DB")
        )


    # def load_sdn_data(self) -> pd.DataFrame:
    #     conn = self.get_db_connection();
    #     cursor = conn.cursor();
    #     for _, row in self.sdn_df.iterrows():
    #         cursor.execute("""
    #             INSERT INTO sanctions (ent_num, sdn_name, sdn_type, program, title, remarks, aliases)
    #             VALUES (%s, %s, %s, %s, %s, %s, %s)
    #             ON CONFLICT (ent_num) DO UPDATE SET
    #                 sdn_name = EXCLUDED.sdn_name,
    #                 sdn_type = EXCLUDED.sdn_type,
    #                 program = EXCLUDED.program,
    #                 title = EXCLUDED.title,
    #                 remarks = EXCLUDED.remarks,
    #                 aliases = EXCLUDED.aliases;
    #         """, (
    #             row['ent_num'], row['sdn_name'], row['sdn_type'], row['program'],
    #             row['title'], row['remarks'], row['aliases']
    #         ))
    #     conn.commit()
    #     cursor.close()
    #     conn.close()



test = SanctionsCsv