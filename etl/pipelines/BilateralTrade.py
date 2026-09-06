import os
import pandas as pd
import comtradeapicall
from .BasePipeline import ProcessPipeline
from psycopg2.extras import execute_values


SUBSCRIPTION_KEY = os.getenv("UN_COMTRADE_DB_API_KEY")

hs_codes = { "Coffee" : "0901",
            "Crude Oil" : 2709, "Refined Petroleum" : 2710, "Natural Gas" : 2711,
            "Semiconductors" : 8542, "Computers" : 8471,
            "Vehicles (EV & Gas)" : 8703, "Vehicle Parts" : 8708,
            "General Medicines" : 3004, "Human Vaccines" : 3002, "Organic Chemicals" : 29, 
         }

HS_CODES = ",".join(str(v) for v in hs_codes.values())
#years = "2026,2025,2024,2023,2022,2021,2020,2019"
PERIOD = "2019,2020,2021,2022,2023,2024,2025"

CUSTOMS_TOTAL = "C00"
MOT_TOTAL = "0"
PARTNER2_TOTAL = "0"


class BilateralTradePipeline(ProcessPipeline):

    def __init__(self):
        self.api_key = SUBSCRIPTION_KEY
        self.hs_codes = HS_CODES
        self.bilateral_df = pd.DataFrame()
        self.world_df = pd.DataFrame()
        self.merged_df = pd.DataFrame()

    def fetch_trade_data(self, partner_code):
        frames = []

        for year in PERIOD.split(','):
            frame = comtradeapicall.getFinalData(
                subscription_key=self.api_key,
                typeCode='C',
                freqCode='A',
                clCode='HS',
                period=year,
                reporterCode=None,
                cmdCode=self.hs_codes,
                flowCode='M',
                partnerCode=partner_code,
                partner2Code='0',
                customsCode='C00',
                motCode='0',
                includeDesc=True
            )

            if frame is None:
                raise RuntimeError(f'Comtrade returned no data for {year}')

            print(f'Fetched {len(frame)} rows for {year}')
            frames.append(frame)

        return pd.concat(frames, ignore_index=True)

    def extract(self):
        self.bilateral_df = self.fetch_trade_data(None) # country x country
        self.world_df = self.fetch_trade_data('0') # country x world

        # --- Call 1: bilateral (country x country) ---
        # self.bilateral_df = comtradeapicall.getFinalData(
        #     subscription_key=SUBSCRIPTION_KEY,
        #     typeCode="C",
        #     freqCode="A",
        #     clCode="HS",
        #     period=PERIOD,
        #     reporterCode=None,        # all reporters
        #     cmdCode=HS_CODES,
        #     flowCode="M",              # imports only
        #     partnerCode=None,          # all partners (real bilateral pairs)
        #     partner2Code=PARTNER2_TOTAL,
        #     customsCode=CUSTOMS_TOTAL,
        #     motCode=MOT_TOTAL,
        #     maxRecords=250000,
        #     format_output="JSON",
        #     aggregateBy=None,
        #     breakdownMode="classic",
        #     countOnly=None,
        #     includeDesc=True
        # )

        # --- Call 2: country x World (denominator) ---
        # self.world_df = comtradeapicall.getFinalData(
        #     SUBSCRIPTION_KEY,
        #     typeCode="C",
        #     freqCode="A",
        #     clCode="HS",
        #     period=PERIOD,
        #     reporterCode=None,        # all reporters
        #     cmdCode=HS_CODES,
        #     flowCode="M",
        #     partnerCode="0",           # World
        #     partner2Code=PARTNER2_TOTAL,
        #     customsCode=CUSTOMS_TOTAL,
        #     motCode=MOT_TOTAL,
        #     maxRecords=250000,
        #     format_output="JSON",
        #     aggregateBy=None,
        #     breakdownMode="classic",
        #     countOnly=None,
        #     includeDesc=True
        # )


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


