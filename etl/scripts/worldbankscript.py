import wbgapi as wb
import pandas as pd
from pipelines.worldbank import WorldBankPipeline
from dotenv import load_dotenv

load_dotenv(override=True)


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

wb_pipeline = WorldBankPipeline()

for k,v in WB_CODES.items():
        df = wb_pipeline.extract(v)
        df = wb_pipeline.transform(df)
        print(df.head())
        print("rows:", len(df))
        wb_pipeline.load(df)
