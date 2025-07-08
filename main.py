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

from utils.compute_scor_medical import compute_scor_medical, compute_scor_medical_cardio
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
model = load_model("trained_model/mlp_model_diabetes/new_model/diagnostic_model.h5")
nlp_model = load_model("trained_model/nlp_model/new_model/nlp_model.h5")

with open("trained_model/nlp_model/new_model/tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

with open("trained_model/nlp_model/new_model/mlb.pkl", "rb") as f:
    mlb_nlp = pickle.load(f)

with open("trained_model/mlp_model_diabetes/new_model/scaler_params.json") as f:
    params = json.load(f)

scaler = StandardScaler()
scaler.mean_ = np.array(params["mean"])
scaler.scale_ = np.array(params["scale"])
scaler.var_ = np.array(params["var"])
scaler.n_features_in_ = len(params["mean"])

mlbDiabetes = joblib.load("trained_model/mlp_model_diabetes/new_model/mlb_nlp.joblib")

with open("trained_model/mlp_model_diabetes/new_model/feature_cols.json", "r", encoding="utf-8") as f:
    feature_cols = json.load(f)


modelCardio = load_model("trained_model/mlp_model_cardio/cardio_model.h5")
scalerCardio = joblib.load("trained_model/mlp_model_cardio/cardio_scaler.pkl")
mlbCardio = joblib.load("trained_model/mlp_model_cardio/cardio_mlb.pkl")
with open("trained_model/mlp_model_cardio/cardio_feature_cols.json", "r", encoding="utf-8") as f:
    feature_cols_cardio = json.load(f)


def predict_labels(text, model_nlp, tokenizer_nlp, mlb, max_len=100, threshold=0.5):
    def remove_diacritics(s):
        return ''.join(
            c for c in unicodedata.normalize('NFD', s)
            if unicodedata.category(c) != 'Mn'
        )

    # 2. Normalizează și curăță textul
    cleaned_text = remove_diacritics(text.lower().strip())
    print(text)
    # Tokenizare și padding
    seq = pad_sequences(tokenizer_nlp.texts_to_sequences([text]), maxlen=max_len, padding='post')

    # Predicție
    pred = model_nlp.predict(seq)[0]

    # Etichete binare
    labels = [mlb.classes_[i] for i, p in enumerate(pred) if p > threshold]
    return labels

def calcul_imc(greutate_kg: float, inaltime_cm: float) -> float:
    inaltime_m = inaltime_cm / 100
    return round(greutate_kg / (inaltime_m ** 2), 2)

def interpret_risk(prob):
    if prob < 0.25:
        return "Risc scăzut"
    elif prob < 0.6:
        return "Risc moderat"
    else:
        return "Risc ridicat"


@app.post("/predict")
def predict_diabet(person: DiabetesPerson):

    # === 1. Preprocesare text pentru NLP (labels multilabel binarized)
    labels_extrase = predict_labels(person.text, nlp_model, tokenizer, mlb_nlp)
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
    print("labels:",labels_extrase)
    scor_medical = (compute_scor_medical(row, labels_extrase)+15)
    row["scor_medical"] = scor_medical

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
        "imc": round(imc, 2),
        "labels_extrase": labels_extrase,
        "scor_medical": scor_medical,
    }

@app.post("/predict/cardio")
def predict_user_with_cardio(person: CardioPerson):
    try:
        # === 1. Etichete NLP
        labels_extrase = predict_labels(person.text, nlp_model, tokenizer, mlbCardio)
        labels_vector = mlbCardio.transform([labels_extrase])[0] if labels_extrase else np.zeros(len(mlbCardio.classes_))
        labels_dict = dict(zip(mlbCardio.classes_, labels_vector))

        # === 2. Calculează IMC
        imc = calcul_imc(person.greutate, person.inaltime)


        # === 3. Construiește input brut (raw row)
        row = {
            "Vârstă": float(person.varsta),
            "Ești ": int(person.sex),
            "Care este greutatea ta actuala?": person.greutate,
            "Care este înălțimea ta? ": person.inaltime,
            "Care este circumferința taliei tale, măsurata deasupra de ombilicului?": person.circumferinta,
            "IMC": imc,

            "obezitate abdominala": int(person.obezitate_abdominala),
            "rezistenta la insulina": int(person.rezistenta),
            "prediabet": int(person.prediabet),
            "diabet zaharat tip 2": int(person.diabet),
            "oboseala permanenta": int(person.oboseala_permanenta),
            "lipsa de energie": int(person.lipsa_de_energie),
            "dislipidemie (grăsimi crescute in sânge)": int(person.dislipidemie),
            "hipertensiune arteriala": int(person.hipertensiune_arteriala),
            "infarct": int(person.infarct),
            "avc": int(person.avc),
            "stent_sau_bypass": int(person.stent_sau_bypass),
            "fibrilatie_sau_ritm": int(person.fibrilatie_sau_ritm),
            "embolie_sau_tromboza": int(person.embolie_sau_tromboza),

        }
        scor_medical_cardio = compute_scor_medical_cardio(row, labels_extrase)
        row["scor_medical_cardio"] = int(scor_medical_cardio)

        # === 4. Separă pe categorii
        continuous_cols = [
            "Vârstă",
            "Care este greutatea ta actuala?",
            "Care este înălțimea ta? ",
            "Care este circumferința taliei tale, măsurata deasupra de ombilicului?",
            "IMC",
            "scor_medical_cardio"
        ]
        binary_cols = [
            "Ești ",
            "obezitate abdominala",
            "rezistenta la insulina",
            "prediabet",
            "diabet zaharat tip 2",
            "oboseala permanenta",
            "lipsa de energie",
            "dislipidemie (grăsimi crescute in sânge)",
            "hipertensiune arteriala",
            "infarct",
            "avc",
            "stent_sau_bypass",
            "fibrilatie_sau_ritm",
            "embolie_sau_tromboza"
        ]

        df_continuous = pd.DataFrame([{k: row[k] for k in continuous_cols}])
        df_binary = pd.DataFrame([{k: row[k] for k in binary_cols}])
        df_labels = pd.DataFrame([labels_dict])

        # === 5. Scalează continuous_cols
        df_scaled = pd.DataFrame(scalerCardio.transform(df_continuous), columns=continuous_cols)

        # === 6. Concatenează totul
        input_df = pd.concat([df_scaled, df_binary.reset_index(drop=True), df_labels.reset_index(drop=True)], axis=1)

        # === 7. Reordonează exact ca în antrenare
        input_df_ordered = input_df.reindex(columns=feature_cols_cardio, fill_value=0)

        # === 8. Vector pentru model
        input_data = input_df_ordered.values.reshape(1, -1)

        # === 9. Predicție
        prob = float(modelCardio.predict(input_data)[0][0])
        interpretare = interpret_risk(prob)

        return {
            "probabilitate": round(prob, 4),
            "interpretare": interpretare,
            "imc": round(imc, 2),
            "labels_extrase": labels_extrase,
            "scor_medical_cardio": scor_medical_cardio,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eroare la predicție: {str(e)}")