def compute_scor_medical(row):
    scor = 0

    # === 1. Factori demografici și antropometrici ===
    if row.get("Vârstă", 0) > 45:
        scor += 1
    if row.get("IMC", 0) > 30:
        scor += 2
    if row.get("obezitate abdominala", 0) == 1:
        scor += 2

    # === 2. Diagnostic sau condiții medicale ===
    scor += int(row.get("rezistenta la insulina", 0)) * 4
    scor += int(row.get("prediabet", 0)) * 6
    scor += int(row.get("diabet zaharat tip 2", 0)) * 10
    scor += int(row.get("ficat gras", 0)) * 2

    # === 3. Simptome subiective și comportamente metabolice ===
    scor += int(row.get("slăbesc greu", 0))
    scor += int(row.get("mă îngraș ușor", 0))
    scor += int(row.get("depun grasime in zona abdominala", 0)) * 2
    scor += int(row.get("urinare nocturna", 0)) * 2
    scor += int(row.get("lipsa de energie", 0)) * 2
    scor += int(row.get("pofte de dulce", 0)) * 2
    scor += int(row.get("foame greu de controlat", 0)) * 2

    # === 4. Sex-specific ===
    sex = str(row.get("Ești", "")).strip().lower()
    talie = row.get("Care este circumferința taliei tale, măsurata deasupra de ombilicului?", 0)

    try:
        talie_val = float(talie)
    except:
        talie_val = 0  # în caz că e NaN sau text

    if sex == "femeie":
        scor += int(row.get("sindromul ovarelor polichistice", 0)) * 2
        if isinstance(row.get("labels"), list) and "ginecologic_hormonal" in row["labels"]:
            scor += 2
        if talie_val > 80:
            scor += 2
        if talie_val > 100:
            scor += 3

    elif sex == "barbat":
        if talie_val > 94:
            scor += 2
        if talie_val > 110:
            scor += 3  # prag pentru bărbați

    # === 5. Etichete NLP (semnale indirecte de risc) ===
    if isinstance(row.get("labels"), list):
        scor += 4 if "metabolic_endocrin" in row["labels"] else 0
        scor += 1 if "gastro_hepato_renal" in row["labels"] else 0
        scor += 1 if "inflamator_autoimun" in row["labels"] else 0
        scor += 1 if "neuro_psiho_energie" in row["labels"] else 0

    return scor