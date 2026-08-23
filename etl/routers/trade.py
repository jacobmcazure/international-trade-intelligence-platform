from fastapi import APIRouter, Depends, Query
from etl.db import get_db
import psycopg2.extras


router = APIRouter(prefix="/trade", tags=["trade"])

@router.get("/dependencies")
def get_trade_dependencies():
    pass
