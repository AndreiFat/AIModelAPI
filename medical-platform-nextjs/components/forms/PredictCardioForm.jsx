'use client'
import React, {useActionState, useState} from 'react';
import {predictCardio} from "@/app/(pages)/evaluate/metabolic/actions";
import GenderInput from "@/components/inputs/GenderInput";
import AgeInput from "@/components/inputs/AgeInput";
import NumericInput from "@/components/inputs/NumericInput";
import CheckboxGroup from "@/components/inputs/CheckBoxGroup";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import {AnimatePresence, motion} from "framer-motion";
import SideBySideRow from "@/components/results/SideBySideRow";
import CustomBadge from "@/components/results/CustomBadge";
import CircularRiskProgressCardio from "@/components/results/CircularRiskProgressCardio";
import IMCInterpretationCard from "@/components/results/IMCInterpretationCard";
import {saveEvaluation} from "@/app/(auth)/actions";

const initialState = {response: null};

function PredictCardioForm({user}) {
    const [response, formAction, pending] = useActionState(predictCardio, initialState);
    const [disabled, setDisabled] = useState(false);

    async function handleSubmit(formData) {
        setDisabled(true);
        await saveEvaluation(formData);
    }

    const labelMap = {
        cardio_vascular: "Probleme Cardiovasculare",
        gastro_hepato_renal: "Probleme Digestive",
        ginecologic_hormonal: "Probleme Ginecologice și Hormonale",
        inflamator_autoimun: "Boli Autoimune",
        metabolic_endocrin: "Probleme Metabolice",
        neuro_psiho_energie: "Simptome Neuro-Psihice și de Energie",
    };

    const simptome = [
        {label: "Oboseală permanentă", name: "oboseala"},
        {label: "Lipsă de energie", name: "lipsa_energie"},
    ]

    const boli = [
        {label: "Rezistență la insulina", name: "rezistenta"},
        {label: "Prediabet", name: "prediabet"},
        {label: "Diabet zaharat tip 2", name: "diabet"},

        {label: "Hipertensiune Arterială", name: "hipertensiune"},
        {label: "Dislipidemie (grăsimi crescute în sânge)", name: "dislipidemie"},
        {label: "Obezitate abdominală", name: "obezitate_abdominala"},
    ]

    const boliCardioGrave = [
        {label: "Infarct", name: "infarct"},
        {label: "Atac vascular cerebral (AVC)", name: "avc"},
        {label: "Stent sau Bypass", name: "stent_sau_bypass"},
        {label: "Fibrilație arteriala sau ritm neregulat", name: "fibrilatie_sau_ritm"},
        {label: "Cheaguri de sânge (tromboză sau embolie)", name: "embolie_sau_tromboza"},
    ]

    return (
        <div className="grid grid-cols-2 gap-8 justify-items-stretch">
            {/* FORMULAR */}
            <div className="overflow-hidden">
                <form action={formAction} className="space-y-4">
                    <div className="bg-red-50 card space-y-3 p-6">
                        <GenderInput
                            className="bg-white radio-error"
                        />
                        <div className="flex gap-4 w-full">
                            <AgeInput
                                className="input-error"
                            />
                            <NumericInput
                                className="input-error"
                                name="greutate"
                                label="Greutate (kg)"
                                placeholder="ex: 85"
                            />
                        </div>
                        <div className="flex gap-4 w-full">
                            <NumericInput
                                name="inaltime"
                                label="Înălțime (cm)"
                                placeholder="ex: 175"
                                className="input-error"
                            />
                            <NumericInput
                                className="input-error"
                                name="circumferinta"
                                label="Circumferință abdominală (cm)"
                                placeholder="ex: 95"
                            />
                        </div>
                    </div>

                    <div className="bg-red-50 card space-y-3 p-6">
                        <h3 className="text-xl font-semibold">Ai observat recent următoarele simptome?</h3>
                        <CheckboxGroup
                            className="checkbox-error bg-white"
                            options={simptome}
                        />
                    </div>

                    <div className="bg-red-50 card space-y-3 p-6">
                        <h3 className="text-xl font-semibold">Ai fost diagnosticat cu vreuna dintre aceste
                            afecțiuni?</h3>
                        <CheckboxGroup
                            className="checkbox-error bg-white"
                            options={boli}
                        />
                    </div>
                    <div className="bg-red-50 card space-y-3 p-6">
                        <h3 className="text-xl font-semibold">Ai avut una dintre aceste afecțiuni cardiovasculare?</h3>
                        <CheckboxGroup
                            className="checkbox-error bg-white"
                            options={boliCardioGrave}
                        />
                    </div>

                    <div className="bg-red-50 card space-y-3 p-6">
                        <TextAreaInput
                            label="Cu ce alte probleme de sănătate te știi sau ai în familie?"
                            placeholder="Ex: am dureri in piept, simt ca mi se ia aerul"
                        />
                    </div>

                    <button formAction={formAction} type="submit" className="btn btn-error w-full">
                        {pending ? (
                            <span className="loading loading-spinner text-white"/>
                        ) : (
                            "Trimite"
                        )}
                    </button>
                </form>
            </div>

            {/* PANOU REZULTAT */}
            <div
                className="bg-white p-8 rounded-xl border border-error/50 space-y-4 max-h-[1050px] overflow-y-auto">

                <h2 className="text-2xl font-bold mb-2">Rezultat evaluare</h2>
                {!pending && !response?.result?.probabilitate && (
                    <div
                        className="flex items-center justify-center text-center text-gray-500 mt-42">
                        {/* SVG decorativ */}
                        <div>
                            <img src="/assets/cardio.svg" className={"h-[380px] mb-6"} alt="img"/>
                            <p>Completează formularul din stânga pentru a primi un rezultat personalizat.</p>
                        </div>
                    </div>
                )}
                {pending ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg text-error"/>
                    </div>
                ) : (
                    <AnimatePresence>
                        {response?.result?.probabilitate && (
                            <motion.div
                                key="result"
                                initial={{opacity: 0, y: 30}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 10}}
                                transition={{duration: 0.4, ease: "easeOut"}}
                                className="space-y-4"
                            >
                                <div className="flex gap-12 mt-4">
                                    <CircularRiskProgressCardio
                                        value={response.result.probabilitate}
                                        label={response.result.interpretare}
                                    />
                                    {response.person && (
                                        <div id="person" className="w-1/2">
                                            <h3 className={"text-xl font-semibold"}>Detalii pacient</h3>
                                            <SideBySideRow className={"error"} label={"Sex"}
                                                           value={response.person.sex ? "Bărbat" : "Femeie"}/>
                                            <SideBySideRow className={"error"} label={"Vârstă"}
                                                           value={`${response.person.varsta} ani`}/>
                                            <SideBySideRow className={"error"} label={"Greutate"}
                                                           value={`${response.person.greutate} kg`}/>
                                            <SideBySideRow className={"error"} label={"Înălțime"}
                                                           value={`${(response.person.inaltime / 100)} m`}/>
                                            <SideBySideRow className={"error"} label={"Circumferință abdominală"}
                                                           value={`${response.person.circumferinta} cm`}/>
                                            {/*<SideBySideRow className={"error"}*/}
                                            {/*               label={"Indicele de masă corporală (IMC)"}*/}
                                            {/*               value={response.result.imc}/>*/}
                                            {/*<SideBySideRow className={"error"}*/}
                                            {/*               label={"Scor medical"}*/}
                                            {/*               value={response.result.scor_medical}/>*/}
                                            {user && <form action={handleSubmit} className="mt-3 w-full">
                                                <input type="hidden" name="response" value={JSON.stringify(response)}/>
                                                <input type="hidden" name="type" value="cardio"/>
                                                <button
                                                    type="submit"
                                                    className="btn btn-error w-full"
                                                    disabled={disabled}
                                                >
                                                    {disabled ? "Evaluare salvată" : "Salvează evaluarea"}
                                                </button>
                                            </form>}
                                        </div>
                                    )}
                                </div>
                                <IMCInterpretationCard imc={response.result.imc}/>
                                <div>
                                    <h3 className={"text-xl font-semibold mb-2"}>Simptome</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {response.person.oboseala_permanenta === 0 && response.person.lipsa_de_energie === 0 ?
                                            <p className={"text-gray-500"}>Nu sunt simptome</p> : <>
                                                {response.person.oboseala_permanenta !== 0 && (
                                                    <CustomBadge
                                                        type={"cardio"}>{response.person.oboseala_permanenta ? "Oboseala permanentă" : ""}</CustomBadge>)}
                                                {response.person.lipsa_de_energie !== 0 && (
                                                    <CustomBadge
                                                        type={"cardio"}>{response.person.lipsa_de_energie ? "Lipsă de energie" : ""}</CustomBadge>)}</>}

                                    </div>
                                </div>
                                <div className="divider"></div>
                                <div>
                                    <h3 className={"text-xl font-semibold mb-2"}>Afecțiuni</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {response.person.rezistenta !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.rezistenta ? "Rezistență la insulină" : ""}</CustomBadge>)}
                                        {response.person.prediabet !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.prediabet ? "Prediabet" : ""}</CustomBadge>)}
                                        {response.person.diabet !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.diabet ? "Diabet zaharat tip 2" : ""}</CustomBadge>)}
                                        {response.person.hipertensiune_arteriala !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.hipertensiune_arteriala ? "Hipertensiune Arterială" : ""}</CustomBadge>)}
                                        {response.person.dislipidemie !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.dislipidemie ? "Dislipidemie (grăsimi crescute în sânge)" : ""}</CustomBadge>)}
                                        {response.person.obezitate_abdominala !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.obezitate_abdominala ? "Obezitate abdominală" : ""}</CustomBadge>)}
                                    </div>
                                </div>
                                <div className="divider"></div>
                                <div>
                                    <h3 className={"text-xl font-semibold mb-2"}>Afecțiuni cardiovasculare</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {response.person.infarct !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.infarct ? "Infarct" : ""}</CustomBadge>)}
                                        {response.person.avc !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.avc ? "Atac vascular cerebral (AVC)" : ""}</CustomBadge>)}
                                        {response.person.stent_sau_bypass !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.stent_sau_bypass ? "Stent sau Bypass" : ""}</CustomBadge>)}
                                        {response.person.fibrilatie_sau_ritm !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.fibrilatie_sau_ritm ? "Fibrilație arteriala sau ritm neregulat" : ""}</CustomBadge>)}
                                        {response.person.embolie_sau_tromboza !== 0 && (
                                            <CustomBadge
                                                type={"cardio"}>{response.person.embolie_sau_tromboza ? "Cheaguri de sânge (tromboză sau embolie)" : ""}</CustomBadge>)}
                                    </div>
                                </div>
                                <div className="divider"></div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Simptome Extrase</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {response.result.labels_extrase?.length > 0 ? (
                                            response.result.labels_extrase.map((label) => (
                                                <CustomBadge key={label} type={"cardio"}
                                                >
                                                    {labelMap[label] || label}
                                                </CustomBadge>
                                            ))
                                        ) : (
                                            <span className="text-gray-500">Nicio etichetă identificată</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

export default PredictCardioForm;