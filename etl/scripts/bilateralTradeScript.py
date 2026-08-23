# test.py
from pipelines.BilateralTrade import BilateralTradePipeline

pipeline = BilateralTradePipeline()
print("Beginning extraction.")
pipeline.extract()
print("Finished extraction.")
print("Starting transform.")
pipeline.transform()
print("Finished transform.")
print("Starting load.")
pipeline.load()
print("Finished load.")

print("bilateral trade pipeline has finished executing.")

# print("sdn df entity num type: " + str(pipeline.sdn_df['ent_num'].dtype))
# print("add df entity num type: " + str(pipeline.add_df['ent_num'].dtype))

#print(pipeline.sdn_df['sdn_name'].isna().sum())
