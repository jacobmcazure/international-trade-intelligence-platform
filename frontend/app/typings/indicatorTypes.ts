export interface Indicator {
    code: string;
    name: string;
    unit: string;
}

export const INDICATORS: Indicator[] = [
    {code: "SL.UEM.TOTL.ZS", name: "Unemployment, total", unit: "% of total labor force"},
    {code: "SP.DYN.LE00.IN", name: "Life expectancy at birth", unit: "years"},
    {code: "SP.DYN.IMRT.IN", name: "Infant mortality rate", unit: "per 1,000 live births"},
    {code: "SP.DYN.CBRT.IN", name: "Birth rate, crude", unit: "per 1,000 people"},
    {code: "SI.DST.10TH.10", name: "Income share held by highest 10%", unit:"% of income"},
    {code: "SE.ADT.1524.LT.ZS", name: "Literacy rate, youth (ages 15-24)", unit: "% of people ages 15-24"},
    {code: "FP.CPI.TOTL.ZG", name: "CPI (Consumer Price Index)", unit: "annual %"},
    {code: "SP.POP.GROW", name:	"Population growth", unit: "annual %"},
    {code: "NY.GDP.MKTP.CD", name: "GDP", unit:	"US$"}
]
