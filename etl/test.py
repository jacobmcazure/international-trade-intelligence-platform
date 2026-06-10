# test.py
from pipelines.sanctions import SanctionsPipeline

pipeline = SanctionsPipeline()
pipeline.extract()
pipeline.transform()
pipeline.load()

print("sdn df entity num type: " + str(pipeline.sdn_df['ent_num'].dtype))
print("add df entity num type: " + str(pipeline.add_df['ent_num'].dtype))

print(pipeline.sdn_df['sdn_name'].isna().sum())