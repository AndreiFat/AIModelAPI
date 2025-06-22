'use server'

export default async function predictDiabetes(prevState, formData) {
    const data = {
        sex: parseInt(formData.get("sex")),
        varsta: parseInt(formData.get("varsta")),
        greutate: parseFloat(formData.get("greutate")),
        inaltime: parseFloat(formData.get("inaltime")),
        circumferinta: parseFloat(formData.get("circumferinta")),

        slabesc_greu: formData.get("slabesc_greu") ? 1 : 0,
        ma_ingras_usor: formData.get("ma_ingras_usor") ? 1 : 0,
        grasime_abdominala: formData.get("grasime_abdominala") ? 1 : 0,
        oboseala: formData.get("oboseala") ? 1 : 0,
        urinare_nocturna: formData.get("urinare_nocturna") ? 1 : 0,
        pofte_dulce: formData.get("pofte_dulce") ? 1 : 0,
        foame_necontrolata: formData.get("foame_necontrolata") ? 1 : 0,
        lipsa_energie: formData.get("lipsa_energie") ? 1 : 0,

        hipertensiune: formData.get("hipertensiune") ? 1 : 0,
        ficat_gras: formData.get("ficat_gras") ? 1 : 0,
        dislipidemie: formData.get("dislipidemie") ? 1 : 0,
        sop: formData.get("sop") ? 1 : 0,
        obezitate_abdominala: formData.get("obezitate_abdominala") ? 1 : 0,

        text: formData.get("text")
    }

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
            return JSON.parse(text)
        } catch (e) {
            console.error("Răspunsul nu este JSON valid.")
            return { error: "Răspuns invalid de la server: " + text }
        }
    } catch (error) {
        console.error("Eroare la trimiterea către FastAPI:", error)
        return {error: "Nu s-a putut trimite formularul."}
    }
}