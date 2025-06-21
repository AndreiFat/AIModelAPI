from pydantic import BaseModel
from typing import List, Optional

class Test(BaseModel):
    varsta: int
    sex: int
    greutate: float
    inaltime: float
    circumferinta: float

    obezitate_abdominala: int
    slabesc_greu: int
    ma_ingras_usor: int
    grasime_abdominala: int
    oboseala: int
    urinare_nocturna: int
    pofte_dulce: int
    foame_necontrolata: int
    lipsa_energie: int

    hipertensiune: int
    ficat_gras: int
    dislipidemie: int
    sop: int

    text: str

    scor_medical: Optional[float] = None  # fă-l opțional aici