from pydantic import BaseModel
from typing import Optional

class Test(BaseModel):
    name: str
    age: int
    bmi: float
    has_diabetes: Optional[bool] = False
    blood_pressure: Optional[float] = None