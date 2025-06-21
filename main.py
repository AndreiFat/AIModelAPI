import unicodedata

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model.Test import Test
from tensorflow.keras.models import load_model
import numpy as np
import pickle
import pandas as pd
from tensorflow.keras.preprocessing.sequence import pad_sequences

from utils.compute_scor_medical import compute_scor_medical
import joblib
import json

app = FastAPI()

# Add your frontend domains here (production + dev)
origins = [
    "http://localhost:3000",               # Dev (Next.js)
    "https://your-nextjs-app.vercel.app",  # Replace with your real frontend domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Încarcă modelele și tokenizerul
model = load_model("trained_model/trained_diabetes_model.h5")
nlp_model = load_model("trained_model/nlp_comorbidities_model.h5")

with open("trained_model/tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

with open("trained_model/mlb_nlp.pkl", "rb") as f:
    mlb_nlp = pickle.load(f)

scaler = joblib.load("trained_model/scaler.save")

with open("trained_model/feature_cols.json", "r", encoding="utf-8") as f:
    feature_cols = json.load(f)

# @app.get("/api/hello")
# def read_root():
#     return {"message": "Hello from FastAPI!"}
#
# @app.get("/hello/{name}")
# async def say_hello(name: str):
#     return {"message": f"Hello {name}"}


def preprocess_text(text: str, tokenizer, maxlen: int = 200):
    # 1. Elimină diacriticele
    def remove_diacritics(s):
        return ''.join(
            c for c in unicodedata.normalize('NFD', s)
            if unicodedata.category(c) != 'Mn'
        )

    # 2. Normalizează și curăță textul
    cleaned_text = remove_diacritics(text.lower().strip())

    # 3. Tokenizare și pad
    sequences = tokenizer.texts_to_sequences([cleaned_text])
    padded = pad_sequences(sequences, maxlen=maxlen, padding='post', truncating='post')

    return padded

def predict_labels(text, model, tokenizer, mlb, max_len=200, threshold=0.4):
    seq = pad_sequences(tokenizer.texts_to_sequences([text]), maxlen=max_len)
    pred = model.predict(seq)[0]
    labels = [mlb.classes_[i] for i, p in enumerate(pred) if p > threshold]
    return labels

def calcul_imc(greutate_kg: float, inaltime_cm: float) -> float:
    inaltime_m = inaltime_cm / 100
    return greutate_kg / (inaltime_m ** 2)

@app.post("/predict")
def predict(person: Test):
    # === Extrage etichete NLP din textul liber
    processed_text = preprocess_text(person.text, tokenizer)
    prediction_nlp = nlp_model.predict(processed_text)

    # === Calculează IMC din greutate și înălțime
    imc = calcul_imc(person.greutate, person.inaltime)

    # === Etichete NLP extrase din textul liber
    labels_extrase = predict_labels(person.text, nlp_model, tokenizer, mlb_nlp)

    # === Construiește dicționarul pentru scor și predicție
    row = {
        "Vârstă": person.varsta,
        "Ești ": 0 if person.sex == 0 else 1,
        "Care este greutatea ta actuala?": person.greutate,
        "Care este înălțimea ta? ": person.inaltime,
        "Care este circumferința taliei tale, măsurata deasupra de ombilicului?": person.circumferinta,
        "IMC":imc,

        "obezitate abdominala": person.obezitate_abdominala,
        "slăbesc greu": person.slabesc_greu,
        "mă îngraș ușor": person.ma_ingras_usor,
        "depun grasime in zona abdominala": person.grasime_abdominala,
        "oboseala permanenta": person.oboseala,
        "urinare nocturna": person.urinare_nocturna,
        "pofte de dulce": person.pofte_dulce,
        "foame greu de controlat": person.foame_necontrolata,
        "lipsa de energie": person.lipsa_energie,

        "hipertensiune arteriala": person.hipertensiune,
        "ficat gras": person.ficat_gras,
        "dislipidemie (grăsimi crescute in sânge)": person.dislipidemie,
        "sindromul ovarelor polichistice": person.sop,

    }

    # === Calculează scorul medical

    # Calculează scorul medical folosind datele curente din row
    scor = compute_scor_medical(row)

    # Completează row cu scorul calculat
    row["scor_medical"] = scor

    # === Vector NLP binarizat din labels_extrase
    labels_vector = mlb_nlp.transform(labels_extrase)[0]
    labels_df = pd.DataFrame([labels_vector], columns=mlb_nlp.classes_)

    # === Transformă în DataFrame
    df = pd.DataFrame([row])
    df = pd.concat([df, labels_df], axis=1)

    print("Coloane din DataFrame la inferență:", df.columns.tolist())
    print("Coloane așteptate de scaler:", feature_cols)

    # === Scalează inputul tabular cu scalerul salvat
    scaled_values = scaler.transform(df)

    # === Combină inputul scalat cu vectorul NLP
    input_data = scaled_values.reshape(1, -1)

    # === Predictie finală
    prediction = model.predict(input_data)[0]
    classes = ["rezistenta la insulina", "prediabet", "diabet zaharat tip 2"]

    interpretari = []
    for prob in prediction:
        if prob < 0.3:
            interpretari.append("risc scăzut")
        elif prob < 0.6:
            interpretari.append("risc moderat")
        else:
            interpretari.append("risc ridicat")

    results = []
    for cls, prob, risc in zip(classes, prediction, interpretari):
        results.append({
            "eticheta": cls,
            "probabilitate": round(float(prob), 3),
            "risc": risc
        })

    return {
        "predictii": results,
        "scor_medical": scor,
        "IMC": imc,
        "labels_extrase": labels_extrase
    }