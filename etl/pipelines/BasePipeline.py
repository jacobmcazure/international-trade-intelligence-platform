import os
import psycopg2 as pg
import pandas as pd
from abc import ABC, abstractmethod
from dotenv import load_dotenv

load_dotenv()

'''
Base Class for other pipeline files to inherit
'''
class ProcessPipeline(ABC):
    
    @abstractmethod
    def extract(self) -> pd.DataFrame:
        pass

    @abstractmethod
    def transform(self) -> pd.DataFrame:
        pass

    @abstractmethod
    def load(self) -> pd.DataFrame:
        pass

    def get_db_connection(self) -> pg.extensions.connection:
        return pg.connect(
            host=os.getenv("POSTGRES_HOST"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            dbname=os.getenv("POSTGRES_DB"),
            port=os.getenv("POSTGRES_PORT")
        )