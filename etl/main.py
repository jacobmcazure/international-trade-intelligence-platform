from fastapi import FastAPI
from pipelines.sanctions import SanctionsPipeline


app = FastAPI()

pipeline = SanctionsPipeline()
pipeline.extract()
print(pipeline.sdn_df.shape)
pipeline.transform()
print(pipeline.sdn_df.columns.tolist())
print(pipeline.sdn_df.head())
pipeline.load()
