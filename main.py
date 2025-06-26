import unicodedata

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from flatbuffers.packer import float64
from sklearn.preprocessing import StandardScaler

from model.CardioPerson import CardioPerson
from model.DiabetesPerson import DiabetesPerson
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
model = load_model("trained_model/mlp_model_diabetes/diagnostic_model.h5")
nlp_model = load_model("trained_model/nlp_comorbidities_model.h5")

with open("trained_model/tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

with open("trained_model/mlb_nlp.pkl", "rb") as f:
    mlb_nlp = pickle.load(f)

with open("trained_model/mlp_model_diabetes/scaler_params.json") as f:
    params = json.load(f)

scaler = StandardScaler()
scaler.mean_ = np.array(params["mean"])
scaler.scale_ = np.array(params["scale"])
scaler.var_ = np.array(params["var"])
scaler.n_features_in_ = len(params["mean"])

mlbDiabetes = joblib.load("trained_model/mlp_model_diabetes/mlb_nlp.joblib")

with open("trained_model/mlp_model_diabetes/feature_cols.json", "r", encoding="utf-8") as f:
    feature_cols = json.load(f)


modelCardio = load_model("trained_model/mlp_model_cardio/trained_mlp_cardio_risk.h5")
scalerCardio = joblib.load("trained_model/mlp_model_cardio/scaler.joblib")
mlbCardio = joblib.load("trained_model/mlp_model_cardio/mlb.joblib")
with open("trained_model/mlp_model_cardio/feature_cols.json", "r", encoding="utf-8") as f:
    feature_cols_cardio = json.load(f)

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
    return round(greutate_kg / (inaltime_m ** 2), 2)

@app.post("/predict")
def predict_diabet(person: DiabetesPerson):
    # === 1. Preprocesare text pentru NLP (labels multilabel binarized)
    labels_extrase = predict_labels(person.text, nlp_model, tokenizer, mlbDiabetes)
    labels_vector = mlbDiabetes.transform([labels_extrase])[0] if labels_extrase else np.zeros(len(mlbDiabetes.classes_))
    labels_dict = dict(zip(mlbDiabetes.classes_, labels_vector))

    # === 2. Calculează IMC
    imc = calcul_imc(person.greutate, person.inaltime)

    # === 3. Construiește inputul raw
    row = {
        "Vârstă": float(person.varsta),
        "Ești ": int(person.sex),
        "Care este greutatea ta actuala?": person.greutate,
        "Care este înălțimea ta? ": person.inaltime,
        "Care este circumferința taliei tale, măsurata deasupra de ombilicului?": person.circumferinta,
        "IMC": imc,
        "scor_medical": person.scor_medical,
        "obezitate abdominala": int(person.obezitate_abdominala),
        "slăbesc greu": int(person.slabesc_greu),
        "mă îngraș ușor": int(person.ma_ingras_usor),
        "depun grasime in zona abdominala": int(person.grasime_abdominala),
        "urinare nocturna": int(person.urinare_nocturna),
        "pofte de dulce": int(person.pofte_dulce),
        "foame greu de controlat": int(person.foame_necontrolata),
        "lipsa de energie": int(person.lipsa_energie),
        "ficat gras": int(person.ficat_gras),
        "sindromul ovarelor polichistice": int(person.sop),
    }

    # === 4. Split în componente
    continuous_cols = [
        "Vârstă", "Care este greutatea ta actuala?", "Care este înălțimea ta? ",
        "Care este circumferința taliei tale, măsurata deasupra de ombilicului?", "IMC", "scor_medical"
    ]
    binary_cols = [
        "Ești ", "obezitate abdominala", "slăbesc greu", "mă îngraș ușor",
        "depun grasime in zona abdominala", "urinare nocturna", "pofte de dulce",
        "foame greu de controlat", "lipsa de energie", "ficat gras", "sindromul ovarelor polichistice"
    ]

    # === 5. Creează dataframes separate
    df_continuous = pd.DataFrame([{k: row[k] for k in continuous_cols}])
    print("Raw continuous input before scaling:", df_continuous.values)
    df_continuous = df_continuous[continuous_cols]  # ordine fixă
    df_continuous = df_continuous.astype(float)  # asigură float
    df_binary = pd.DataFrame([{k: row[k] for k in binary_cols}])
    df_labels = pd.DataFrame([labels_dict])

    # === 6. Scalează continuele folosind scalerul încărcat din JSON
    df_scaled = pd.DataFrame(scaler.transform(df_continuous), columns=continuous_cols)

    # (optional) Debug:
    print("Scaled continuous input:", df_scaled.values)

    # === 7. Combină toate într-un dataframe final
    input_df = pd.concat([df_scaled, df_binary.reset_index(drop=True), df_labels.reset_index(drop=True)], axis=1)

    # === 8. Reordonează 100% ca în antrenare
    input_df_ordered = input_df.reindex(columns=feature_cols, fill_value=0)

    # === 9. Pregătește vector pentru predicție
    input_data = input_df_ordered.values.reshape(1, -1)

    # === 10. Predicție
    prediction = model.predict(input_data)[0]
    label_index = int(np.argmax(prediction))
    prob = float(prediction[label_index])

    label_map = {
        0: "fără",
        1: "rezistență la insulină",
        2: "prediabet",
        3: "diabet zaharat tip 2"
    }

    # === 11. Return rezultat
    return {
        "diagnostic": label_map[label_index],
        "probabilitate": round(prob, 3),
        "IMC": round(imc, 2),
        "labels_extrase": labels_extrase
    }

@app.post("/predict/cardio")
def predict_user_with_cardio(person: CardioPerson):
    try:
        # 1. Preprocesează textul și extrage etichetele NLP (labels_extrase)
        processed_text = preprocess_text(person.text, tokenizer)
        labels_extrase = predict_labels(person.text, nlp_model, tokenizer, mlbCardio)

        # 2. Calculează IMC
        imc = calcul_imc(person.greutate, person.inaltime)

        # 3. Construiește dicționarul cu date tabulare (fără etichete NLP)
        row = {
            "Vârstă": person.varsta,
            "Ești ": 0 if person.sex == 0 else 1,
            "Care este greutatea ta actuala?": person.greutate,
            "Care este înălțimea ta? ": person.inaltime,
            "Care este circumferința taliei tale, măsurata deasupra de ombilicului?": person.circumferinta,
            "IMC": imc,
            "obezitate abdominala": person.obezitate_abdominala,
            "oboseala permanenta": person.oboseala_permanenta,
            "lipsa de energie": person.lipsa_de_energie,
            "ficat gras": person.ficat_gras,
            "dislipidemie (grăsimi crescute in sânge)": person.dislipidemie,
            "hipertensiune arteriala": person.hipertensiune_arteriala,
            "infarct": person.infarct,
            "avc": person.avc,
            "stent_sau_bypass": person.stent_sau_bypass,
            "fibrilatie_sau_ritm": person.fibrilatie_sau_ritm,
            "embolie_sau_tromboza": person.embolie_sau_tromboza,
            "scor_medical_cardio": person.scor_medical_cardio,
        }

        # 4. Binarizează etichetele NLP folosind mlbCardio
        if not labels_extrase:
            labels_vector = np.zeros(len(mlbCardio.classes_))
        else:
            labels_vector = mlbCardio.transform([labels_extrase])[0]

        # 5. Creează dicționarul cu etichetele NLP
        labels_dict = dict(zip(mlbCardio.classes_, labels_vector))

        # 6. Combină datele tabulare cu etichetele NLP binarizate
        input_data_dict = {**row, **labels_dict}

        # 7. Construiește vectorul de input conform ordinii din feature_cols_cardio
        input_vector = [input_data_dict.get(col, 0) for col in feature_cols_cardio]

        # 8. Transformă în DataFrame pentru scalare
        df_input = pd.DataFrame([input_vector], columns=feature_cols_cardio)

        # 9. Scalează inputul
        scaled_input = scalerCardio.transform(df_input)

        # 10. Reshape pentru predictie
        input_final = scaled_input.reshape(1, -1)

        # 11. Predictie probabilitate risc
        prob = float(modelCardio.predict(input_final)[0][0])

        # 12. Interpretare risc
        if prob < 0.25:
            interpretare = "Risc scăzut"
        elif prob < 0.6:
            interpretare = "Risc moderat"
        else:
            interpretare = "Risc ridicat"

        # 13. Returnare răspuns JSON
        return {
            "probabilitate": round(prob, 4),
            "interpretare": interpretare,
            "simptome_extrase": labels_extrase,
            "imc": imc,
        }

    except Exception as e:
        # Returnează eroare HTTP 500 cu detaliu
        raise HTTPException(status_code=500, detail=f"Eroare la predicție: {str(e)}")