'use client';

import React, {useActionState, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

import GenderInput from "@/components/inputs/GenderInput";
import AgeInput from "@/components/inputs/AgeInput";
import NumericInput from "@/components/inputs/NumericInput";
import CheckboxGroup from "@/components/inputs/CheckBoxGroup";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import CircularRiskProgress from "@/components/results/CircularRiskProgress";

import {predictDiabetes} from "@/app/(pages)/evaluate/metabolic/actions";
import SideBySideRow from "@/components/results/SideBySideRow";
import CustomBadge from "@/components/results/CustomBadge";
import IMCInterpretationCard from "@/components/results/IMCInterpretationCard";
import {saveEvaluation} from "@/app/(auth)/actions";

const initialState = {response: null};

export default function PredictDiabetesForm({user}) {
    const [response, formAction, pending] = useActionState(predictDiabetes, initialState);
    const [disabled, setDisabled] = useState(false);

    async function handleSubmit(formData) {
        setDisabled(true);
        await saveEvaluation(formData);
    }

    const simptome = [
        {label: "Slăbesc greu", name: "slabesc_greu"},
        {label: "Mă îngraș ușor", name: "ma_ingras_usor"},
        {label: "Depun grăsime în zona abdominală", name: "grasime_abdominala"},
        {label: "Urinare nocturnă", name: "urinare_nocturna"},
        {label: "Pofte de dulce", name: "pofte_dulce"},
        {label: "Foame greu de controlat", name: "foame_necontrolata"},
        {label: "Lipsă de energie", name: "lipsa_energie"},
    ];

    const boli = [
        {label: "Ficat gras", name: "ficat_gras"},
        {label: "Sindromul ovarelor polichistice (SOP)", name: "sop"},
        {label: "Obezitate abdominală", name: "obezitate_abdominala"},
    ];

    const labelMap = {
        cardio_vascular: "Probleme Cardiovasculare",
        gastro_hepato_renal: "Probleme Digestive",
        ginecologic_hormonal: "Probleme Ginecologice și Hormonale",
        inflamator_autoimun: "Boli Autoimune",
        metabolic_endocrin: "Probleme Metabolice",
        neuro_psiho_energie: "Simptome Neuro-Psihice și de Energie",
    };


    return (
        <div className="h-[880px] grid grid-cols-2 justify-items-stretch gap-8">
            {/* FORMULAR */}
            <div>
                <form action={formAction} className="space-y-4">
                    <div className="bg-orange-50 card space-y-3 p-6">
                        <GenderInput
                            className="bg-white radio-secondary"
                        />
                        <div className="flex gap-4 w-full">
                            <AgeInput
                                className="input-secondary"
                            />
                            <NumericInput
                                className="input-secondary"
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
                                className="input-secondary"
                            />
                            <NumericInput
                                className="input-secondary"
                                name="circumferinta"
                                label="Circumferință abdominală (cm)"
                                placeholder="ex: 95"
                            />
                        </div>
                    </div>

                    <div className="bg-orange-50 card space-y-3 p-6">
                        <h3 className="text-xl font-semibold">Ce resimți în ultima perioadă?</h3>
                        <CheckboxGroup
                            className="checkbox-secondary bg-white"
                            options={simptome}
                        />
                    </div>

                    <div className="bg-orange-50 card space-y-3 p-6">
                        <h3 className="text-xl font-semibold">Prezinți unele dintre următoarele boli?</h3>
                        <CheckboxGroup
                            className="checkbox-secondary bg-white"
                            options={boli}
                        />
                    </div>

                    <div className="bg-orange-50 card space-y-3 p-6">
                        <TextAreaInput
                            label="Cu ce alte probleme de sănătate te știi sau ai în familie?"
                            placeholder="Ex: am migrene, adenomioză și probleme cu glanda tiroidă în familie"
                        />
                    </div>

                    <button formAction={formAction} type="submit" className="btn btn-secondary w-full">
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
                className="bg-white p-8 rounded-xl border border-secondary/50 space-y-4 max-h-[880px] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-2">Rezultat evaluare</h2>
                {!pending && !response?.result?.probabilitate && (
                    <div
                        className="flex items-center justify-center text-center text-gray-500 mt-42">
                        {/* SVG decorativ */}
                        <div>
                            <img src="/assets/diabetes.svg" className={"h-[300px] mb-6"} alt="img"/>
                            <p>Completează formularul din stânga pentru a primi un rezultat personalizat.</p>
                        </div>
                    </div>
                )}
                {pending ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg text-secondary"/>
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
                                className="space-y-6"
                            >
                                <div className="flex gap-12 mt-4">
                                    <CircularRiskProgress
                                        value={response.result.probabilitate}
                                        label={response.result.diagnostic}
                                    />
                                    {response.person && (
                                        <div id="person" className="w-2/5">
                                            <h3 className={"text-xl font-semibold"}>Detalii pacient</h3>
                                            <SideBySideRow className={"secondary"} label={"Sex"}
                                                           value={response.person.sex ? "Bărbat" : "Femeie"}/>
                                            <SideBySideRow className={"secondary"} label={"Vârstă"}
                                                           value={`${response.person.varsta} ani`}/>
                                            <SideBySideRow className={"secondary"} label={"Greutate"}
                                                           value={`${response.person.greutate} kg`}/>
                                            <SideBySideRow className={"secondary"} label={"Înălțime"}
                                                           value={`${(response.person.inaltime / 100)} m`}/>
                                            <SideBySideRow className={"secondary"} label={"Circumferință abdominală"}
                                                           value={`${response.person.circumferinta} cm`}/>
                                            {/*<SideBySideRow className={"secondary"}*/}
                                            {/*               label={"Indicele de masă corporală (IMC)"}*/}
                                            {/*               value={response.result.imc}/>*/}
                                            {/*<SideBySideRow className={"secondary"}*/}
                                            {/*               label={"Scor medical"}*/}
                                            {/*               value={response.result.scor_medical}/>*/}
                                            {user && <form action={handleSubmit} className="mt-3 w-full">
                                                <input type="hidden" name="response" value={JSON.stringify(response)}/>
                                                <input type="hidden" name="type" value="metabolic"/>
                                                <button
                                                    type="submit"
                                                    className="btn btn-secondary w-full"
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
                                        {response.person.slabesc_greu !== 0 && (
                                            <CustomBadge>{response.person.slabesc_greu ? "Slăbec greu" : ""}</CustomBadge>)}
                                        {response.person.ma_ingras_usor !== 0 && (
                                            <CustomBadge>{response.person.ma_ingras_usor ? "Mă îngraș ușor" : ""}</CustomBadge>)}
                                        {response.person.grasime_abdominala !== 0 && (
                                            <CustomBadge>{response.person.grasime_abdominala ? "Grăsime abdominală" : ""}</CustomBadge>)}
                                        {response.person.urinare_nocturna !== 0 && (
                                            <CustomBadge>{response.person.urinare_nocturna ? "Urinare nocturnă" : ""}</CustomBadge>)}
                                        {response.person.pofte_dulce !== 0 && (
                                            <CustomBadge>{response.person.pofte_dulce ? "Pofte de dulce" : ""}</CustomBadge>)}
                                        {response.person.foame_necontrolata !== 0 && (
                                            <CustomBadge>{response.person.foame_necontrolata ? "Foame greu de controlat" : ""}</CustomBadge>)}
                                        {response.person.lipsa_energie !== 0 && (
                                            <CustomBadge>{response.person.lipsa_energie ? "Lipsă de energie" : ""}</CustomBadge>)}
                                    </div>
                                </div>
                                <div className="divider"></div>
                                <div>
                                    <h3 className={"text-xl font-semibold mb-2"}>Boli asociate</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {response.person.ficat_gras !== 0 && (
                                            <CustomBadge>{response.person.ficat_gras ? "Ficat gras" : ""}</CustomBadge>)}
                                        {response.person.sop !== 0 && (
                                            <CustomBadge>{response.person.sop ? "Sindromul ovarelor polichistice (SOP)" : ""}</CustomBadge>)}
                                        {response.person.obezitate_abdominala !== 0 && (
                                            <CustomBadge>{response.person.obezitate_abdominala ? "Obezitate abdominală" : ""}</CustomBadge>)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Simptome extrase</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {response.result.labels_extrase?.length > 0 ? (
                                            response.result.labels_extrase.map((label) => (
                                                <CustomBadge key={label}
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