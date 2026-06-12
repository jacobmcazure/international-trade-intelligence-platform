from fastapi import FastAPI, APIRouter, status
from pipelines.sanctions import SanctionsPipeline


app = FastAPI()
router = APIRouter()


@router.post("/pipelines/sanctions", tags=["sanctions"], status_code=status.HTTP_202_ACCEPTED)
async def run_sanctions_pipeline():
    pipeline = SanctionsPipeline()
    pipeline.extract()
    print(pipeline.sdn_df.shape)
    pipeline.transform()
    print(pipeline.sdn_df.columns.tolist())
    print(pipeline.sdn_df.head())
    pipeline.load()
    return {"message": "Sanctions pipeline route triggered successfully."}

app.include_router(router)