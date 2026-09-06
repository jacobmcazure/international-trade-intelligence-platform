from fastapi import FastAPI, APIRouter, status
from routers import sanctions, trade

# Entry point into the application. The fastapi instance is created here and all the routes are added in one place
app = FastAPI()

app.include_router(sanctions.router)
app.include_router(trade.router)

