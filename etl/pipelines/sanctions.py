import requests
import pandas as pd
import io
import os
import psycopg2 as pg
from psycopg2.extras import execute_values
from .BasePipeline import ProcessPipeline


class SanctionsPipeline(ProcessPipeline):
    def __init__(self):
        self.sdn_url = "https://sanctionslistservice.ofac.treas.gov/api/download/SDN.CSV"
        self.add_url = "https://sanctionslistservice.ofac.treas.gov/api/download/ADD.CSV"
        self.alt_url = "https://sanctionslistservice.ofac.treas.gov/api/download/ALT.CSV"

    def _fetch_csv(self, url: str) -> pd.DataFrame:
        response = requests.get(url, allow_redirects=True) # allow redirect to S3 database where data is actually stored
        response.raise_for_status()
        return pd.read_csv(io.StringIO(response.text), header=None)

    def extract(self) -> pd.DataFrame:
        self.sdn_df = self._fetch_csv(self.sdn_url)
        self.add_df = self._fetch_csv(self.add_url)
        self.alt_df = self._fetch_csv(self.alt_url)

    def transform(self) -> pd.DataFrame:
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
            'ent_num', 'add_num', 'address', 'city_state_zip', 'country', 'remarks'
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

    def load(self) -> pd.DataFrame:
        # establish connection and cursor
        conn = self.get_db_connection();
        cursor = conn.cursor();
        
        # -- sanctioned_entities --
        sdn_columns = ['ent_num', 'sdn_name', 'sdn_type', 'program', 'title', 'remarks', 'aliases']
        se_query = """
            INSERT INTO sanctioned_entities (entity_id, name, entity_type, program, title, remarks, aliases)
            VALUES %s
            ON CONFLICT (entity_id) DO UPDATE SET
                name = EXCLUDED.name,
                entity_type = EXCLUDED.entity_type,
                program = EXCLUDED.program,
                title = EXCLUDED.title,
                remarks = EXCLUDED.remarks,
                aliases = EXCLUDED.aliases
        """
        execute_values(cursor, se_query, self.sdn_df[sdn_columns].values.tolist())

        # -- sanctioned_addresses --
        sa_columns = ['ent_num', 'address', 'city_state_zip', 'country', 'remarks']
        sa_query = """
            INSERT INTO sanctioned_addresses (entity_id, address, city_state_zip, country, remarks)
            VALUES %s
            ON CONFLICT (id) DO UPDATE SET
                entity_id = EXCLUDED.entity_id,
                address = EXCLUDED.address,
                city_state_zip = EXCLUDED.city_state_zip,
                country = EXCLUDED.country,
                remarks = EXCLUDED.remarks
        """
        execute_values(cursor, sa_query, self.add_df[sa_columns].values.tolist())


        conn.commit()
        cursor.close()
        conn.close()

