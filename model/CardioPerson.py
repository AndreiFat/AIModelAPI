from typing import Optional
from pydantic import BaseModel


class CardioPerson(BaseModel):
    varsta: int
    sex: int  # 0 = femeie, 1 = bărbat
    greutate: float
    inaltime: float
    circumferinta: float

    obezitate_abdominala: int
    rezistenta: int
    prediabet: int
    diabet: int

    oboseala_permanenta: int
    lipsa_de_energie: int
    dislipidemie: int
    hipertensiune_arteriala: int
    infarct: int
    avc: int
    stent_sau_bypass: int
    fibrilatie_sau_ritm: int
    embolie_sau_tromboza: int

    scor_medical_cardio: Optional[float] = None

    text: str