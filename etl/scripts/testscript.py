import os
import comtradeapicall
from dotenv import load_dotenv

load_dotenv(override=True)
api_key = os.getenv("UN_COMTRADE_DB_API_KEY")

hs_codes = { "Coffee" : int("0901"),
            "Crude Oil" : 2709, "Refined Petroleum" : 2710, "Natural Gas" : 2711,
            "Semiconductors" : 8542, "Computers" : 8471,
            "Vehicles (EV & Gas)" : 8703, "Vehicle Parts" : 8708,
            "General Medicines" : 3004, "Human Vaccines" : 3002, "Organic Chemicals" : 29, 
         }

hs_codes = ",".join(str(v) for v in hs_codes.values())

years = '2026,2025,2024,2023,2022,2021,2020,2019'


#testdf = comtradeapicall.previewCountFinalData(typeCode='C', freqCode='A', clCode='HS', period='2025',
#                                                     reporterCode=None, cmdCode=cmd_codes, flowCode='M', partnerCode='0',
#                                                   partner2Code='0', customsCode='C00', motCode='0')
#print(testdf.head())


mydf = comtradeapicall.getFinalData(subscription_key=api_key, typeCode='C', freqCode='A', clCode='HS', period=years,
                                                    reporterCode=None, cmdCode=hs_codes, flowCode='M', partnerCode='0',
                                                    partner2Code='0', customsCode='C00', motCode='0', includeDesc=True)

print(len(mydf))
print(mydf.shape)
#omitted: cmdDesc, reporter/partner code/desc
mydf = mydf[['cmdCode', 'refYear', 'reporterISO', 'reporterDesc', 'cmdDesc', 'partnerISO', 'primaryValue', 'qty', 'partner2Code', 'customsCode', 'motCode']]


print(mydf.head())
print(mydf.columns.tolist())
mydf.to_csv('bilateralTradeDataTest.csv', index=False)

