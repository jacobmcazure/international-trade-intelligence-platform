import wbgapi as wb
import pandas as pd
from pipelines.worldbank import WorldBankPipeline
from dotenv import load_dotenv

load_dotenv(override=True)

# data = wb.series.info()
# print(data)


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

#DATE_RANGE = range(1970,2023)

wb_pipeline = WorldBankPipeline()

for k,v in WB_CODES.items():
        df = wb_pipeline.extract(v)
        df = wb_pipeline.transform(df)
        print(df.head())
        print("rows:", len(df))
        #df.to_csv("worldbanktest2.csv", index=False)
        wb_pipeline.load(df)




#df = wb.data.DataFrame(v, DATE_RANGE, index='time', numericTimeKeys=True, labels=True)

#wb.data.DataFrame([c for c.values() in codes], range(1970,2023), index='time', numericTimeKeys=True, labels=True)
