from typing import Optional
from pydantic import BaseModel


class CardioPerson(BaseModel):
    varsta: int
    sex: int
    greutate: float
    inaltime: float
    circumferinta: float
    # IMC: float
    obezitate_abdominala: int
    oboseala_permanenta: int
    lipsa_de_energie: int
    ficat_gras: int
    dislipidemie: int
    hipertensiune_arteriala: int
    infarct: int
    avc: int
    stent_sau_bypass: int
    fibrilatie_sau_ritm: int
    embolie_sau_tromboza: int
    scor_medical_cardio: Optional[float] = None

    text: str
