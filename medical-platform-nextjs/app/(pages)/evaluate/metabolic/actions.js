'use server'

const parseSafeInt = (value) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
};

const parseSafeFloat = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
};

export async function predictDiabetes(prevState, formData) {

    const data = {
        sex: parseSafeInt(formData.get("sex")),
        varsta: parseSafeInt(formData.get("varsta")),
        greutate: parseSafeFloat(formData.get("greutate")),
        inaltime: parseSafeFloat(formData.get("inaltime")),
        circumferinta: parseSafeFloat(formData.get("circumferinta")),

        slabesc_greu: formData.get("slabesc_greu") ? 1 : 0,
        ma_ingras_usor: formData.get("ma_ingras_usor") ? 1 : 0,
        grasime_abdominala: formData.get("grasime_abdominala") ? 1 : 0,
        urinare_nocturna: formData.get("urinare_nocturna") ? 1 : 0,
        pofte_dulce: formData.get("pofte_dulce") ? 1 : 0,
        foame_necontrolata: formData.get("foame_necontrolata") ? 1 : 0,
        lipsa_energie: formData.get("lipsa_energie") ? 1 : 0,
        ficat_gras: formData.get("ficat_gras") ? 1 : 0,
        sop: formData.get("sop") ? 1 : 0,
        obezitate_abdominala: formData.get("obezitate_abdominala") ? 1 : 0,

        text: formData.get("text") || ""
    };

    console.log("Payload to be sent to FastAPI:", data)

    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const text = await response.text()

        try {
            console.log(JSON.parse(text));
            return {
                person: data,
                result: JSON.parse(text)
            }
        } catch (e) {
            console.error("Răspunsul nu este JSON valid.")
            return {error: "Răspuns invalid de la server: " + text}
        }
    } catch (error) {
        console.error("Eroare la trimiterea către FastAPI:", error)
        return {error: "Nu s-a putut trimite formularul."}
    }
}

export async function predictCardio(prevState, formData) {

    const data = {
        sex: parseSafeInt(formData.get("sex")),
        varsta: parseSafeInt(formData.get("varsta")),
        greutate: parseSafeFloat(formData.get("greutate")),
        inaltime: parseSafeFloat(formData.get("inaltime")),
        circumferinta: parseSafeFloat(formData.get("circumferinta")),

        obezitate_abdominala: formData.get("obezitate_abdominala") ? 1 : 0,
        rezistenta: formData.get("rezistenta") ? 1 : 0,
        prediabet: formData.get("prediabet") ? 1 : 0,
        diabet: formData.get("diabet") ? 1 : 0,
        dislipidemie: formData.get("dislipidemie") ? 1 : 0,
        hipertensiune_arteriala: formData.get("hipertensiune") ? 1 : 0,

        oboseala_permanenta: formData.get("oboseala") ? 1 : 0,
        lipsa_de_energie: formData.get("lipsa_energie") ? 1 : 0,


        infarct: formData.get("infarct") ? 1 : 0,
        avc: formData.get("avc") ? 1 : 0,
        stent_sau_bypass: formData.get("stent_sau_bypass") ? 1 : 0,
        fibrilatie_sau_ritm: formData.get("fibrilatie_sau_ritm") ? 1 : 0,
        embolie_sau_tromboza: formData.get("embolie_sau_tromboza") ? 1 : 0,
        text: formData.get("text") || ""
    };


    console.log("Payload to be sent to FastAPI:", data)

    try {
        const response = await fetch("http://127.0.0.1:8000/predict/cardio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const text = await response.text()

        try {
            console.log(JSON.parse(text));
            return {
                person: data,
                result: JSON.parse(text)
            }
        } catch (e) {
            console.error("Răspunsul nu este JSON valid.")
            return {error: "Răspuns invalid de la server: " + text}
        }
    } catch (error) {
        console.error("Eroare la trimiterea către FastAPI:", error)
        return {error: "Nu s-a putut trimite formularul."}
    }
}