from pydantic import BaseModel
from typing import List, Optional

class DiabetesPerson(BaseModel):
    varsta: int
    sex: int  # 0 = barbat, 1 = femeie
    greutate: float
    inaltime: float
    circumferinta: float

    obezitate_abdominala: int
    slabesc_greu: int
    ma_ingras_usor: int
    grasime_abdominala: int
    urinare_nocturna: int
    pofte_dulce: int
    foame_necontrolata: int
    lipsa_energie: int

    ficat_gras: int
    sop: int  # sindrom ovare polichistice

    text: str  # pentru extragerea etichetelor NLP
    scor_medical: Optional[float] = None  # opțional, calculat dacă lipsește