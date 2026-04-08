import pandas as pd
from abc import ABC, abstractmethod
'''
Base Class for other pipeline files to inherit
'''
class ProcessCsv(ABC):
    
    @abstractmethod
    def extractCsv() -> pd.DataFrame:
        pass

    @abstractmethod
    def transformCsv() -> pd.DataFrame:
        pass

    @abstractmethod
    def loadCsv() -> pd.DataFrame:
        pass

    @abstractmethod
    def get_db_connection():
        pass