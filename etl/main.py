from fastapi import FastAPI

app = FastAPI(title="Trade Intel ETL Service")


@app.get("/health")
async def health():
    return {"status": "ok"}