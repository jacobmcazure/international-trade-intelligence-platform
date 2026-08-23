import os
import pandas as pd
import comtradeapicall
from .BasePipeline import ProcessPipeline
from psycopg2.extras import execute_values


subscription_key = os.getenv("UN_COMTRADE_DB_API_KEY")

hs_codes = { "Coffee" : int("0901"),
            "Crude Oil" : 2709, "Refined Petroleum" : 2710, "Natural Gas" : 2711,
            "Semiconductors" : 8542, "Computers" : 8471,
            "Vehicles (EV & Gas)" : 8703, "Vehicle Parts" : 8708,
            "General Medicines" : 3004, "Human Vaccines" : 3002, "Organic Chemicals" : 29, 
         }

hs_codes = ",".join(str(v) for v in hs_codes.values())
years = '2026,2025,2024,2023,2022,2021,2020,2019'


class BilateralTradePipeline(ProcessPipeline):

    def __init__(self):
        self.api_key = subscription_key
        self.hs_codes = hs_codes
        self.bilateral_df = pd.DataFrame()
        self.world_df = pd.DataFrame()
        self.merged_df = pd.DataFrame()

    def extract(self):
        self.bilateral_df = comtradeapicall.getFinalData(subscription_key=self.api_key, typeCode='C', freqCode='A', clCode='HS', period=years,
                                                    reporterCode=None, cmdCode=self.hs_codes, flowCode='M', partnerCode=None,
                                                    partner2Code='0', customsCode='C00', motCode='0', includeDesc=True) # country x country
        self.world_df = comtradeapicall.getFinalData(subscription_key=self.api_key, typeCode='C', freqCode='A', clCode='HS', period=years,
                                                    reporterCode=None, cmdCode=self.hs_codes, flowCode='M', partnerCode='0',
                                                    partner2Code='0', customsCode='C00', motCode='0', includeDesc=True) # country x world

    def transform(self):
        self.bilateral_df = self.bilateral_df[['cmdCode', 'cmdDesc', 'refYear', 'flowCode', 'reporterCode', 'reporterISO', 'reporterDesc', 'partnerCode', 'partnerISO', 'partnerDesc', 'primaryValue', 'qty']]
        self.world_df = self.world_df[['cmdCode', 'cmdDesc', 'refYear', 'flowCode', 'reporterCode', 'reporterISO', 'reporterDesc', 'partnerCode', 'partnerISO', 'partnerDesc', 'primaryValue', 'qty']]

        # merge to get percentage
        self.merged_df = self.bilateral_df.merge(
            self.world_df,
            on=['reporterCode', 'cmdCode','refYear'],
            suffixes=('', '_total')
        )
        self.merged_df['pct_of_total'] = self.merged_df['primaryValue'].div(
            self.merged_df['primaryValue_total'].replace(0, pd.NA)
        )

        self.merged_df = self.merged_df.rename(columns={
            'cmdCode': 'hs_code',
            'refYear': 'ref_year',
            'reporterISO': 'reporter_iso',
            'partnerISO': 'partner_iso',
            'primaryValue': 'primary_value',
        })[['hs_code', 'ref_year', 'reporter_iso', 'partner_iso', 'primary_value', 'qty', 'pct_of_total']]


    def load(self):
        conn = self.get_db_connection()
        cursor = conn.cursor()
        cols = ['hs_code', 'ref_year', 'reporter_iso', 'partner_iso', 'primary_value', 'qty', 'pct_of_total']

        # Exclude certain regions
        valid_isos = set(pd.read_sql("SELECT iso_code FROM countries", conn)['iso_code'])
        self.merged_df = self.merged_df[self.merged_df['reporter_iso'].isin(valid_isos)]

        query = """
            INSERT INTO trade_imports (hs_code, ref_year, reporter_iso, partner_iso, primary_value, qty, pct_of_total)
            VALUES %s
            ON CONFLICT (hs_code, ref_year, reporter_iso, partner_iso) DO UPDATE SET
                primary_value = EXCLUDED.primary_value,
                qty = EXCLUDED.qty,
                pct_of_total = EXCLUDED.pct_of_total
        """
        try:
            execute_values(cursor, query, self.merged_df[cols].values.tolist())
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()


