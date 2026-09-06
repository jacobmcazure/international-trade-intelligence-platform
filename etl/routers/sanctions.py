from fastapi import APIRouter


router = APIRouter(prefix="/sanctions", tags=["sanctions"])


# TODO: auth-gate FastAPI route
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
