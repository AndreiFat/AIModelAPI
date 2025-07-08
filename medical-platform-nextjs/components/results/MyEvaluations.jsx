'use client'

import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import CircularRiskProgressCardio from "@/components/results/CircularRiskProgressCardio";
import SideBySideRow from "@/components/results/SideBySideRow";
import IMCInterpretationCard from "@/components/results/IMCInterpretationCard";
import CustomBadge from "@/components/results/CustomBadge";
import CircularRiskProgress from "@/components/results/CircularRiskProgress";
import dayjs from "dayjs";
import 'dayjs/locale/ro';

export default function MyEvaluations({evaluations}) {
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);

    const openOverlay = (evaluation) => setSelectedEvaluation(evaluation);
    const closeOverlay = () => setSelectedEvaluation(null);

    const labelMap = {
        cardio_vascular: "Probleme Cardiovasculare",
        gastro_hepato_renal: "Probleme Digestive",
        ginecologic_hormonal: "Probleme Ginecologice și Hormonale",
        inflamator_autoimun: "Boli Autoimune",
        metabolic_endocrin: "Probleme Metabolice",
        neuro_psiho_energie: "Simptome Neuro-Psihice și de Energie",
    };

    return (
        <div>
            {evaluations.length === 0 ? (
                <p className="text-base-content text-center mt-4">
                    Nu există evaluări disponibile.
                </p>
            ) : (
                <div className="space-y-2">
                    {evaluations.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => openOverlay(item)}
                            className="cursor-pointer p-4 border border-base-content/15 rounded-xl hover:bg-base-200/75 transition"
                        >
                            <p className="font-bold">Evaluare #{index + 1} <span
                                className={`badge ml-2 badge-soft badge-sm mb-1 ${item.type === 'cardio' ? "badge-error" : "badge-secondary"}`}>{item.type}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                {item?.created_at
                                    ? dayjs(item.created_at).locale('ro').format('dddd, D MMMM')
                                    : 'Dată indisponibilă'}
                            </p></div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedEvaluation && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onClick={closeOverlay}
                    >
                        <motion.div
                            className="motion-anim bg-white p-8 rounded-2xl shadow-2xl max-w-3xl w-full relative max-h-[90vh] flex flex-col"
                            initial={{scale: 0.95, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.95, opacity: 0}}
                            transition={{duration: 0.3, ease: "easeInOut"}}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeOverlay}
                                className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
                            >
                                <X className="w-5 h-5"/>
                            </button>

                            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">Detalii Evaluare</h3>

                            <div className="overflow-y-auto max-h-[calc(90vh-96px)] text-sm space-y-3">
                                <div className="p-2">
                                    {selectedEvaluation.type === "cardio" ? (
                                        <div>
                                            <div className="flex gap-12 mt-4">
                                                <CircularRiskProgressCardio
                                                    value={selectedEvaluation.response.result.probabilitate}
                                                    label={selectedEvaluation.response.result.interpretare}
                                                />
                                                {selectedEvaluation.response.person && (
                                                    <div id="person" className="w-1/2">
                                                        <h3 className={"text-xl font-semibold"}>Detalii pacient</h3>
                                                        <SideBySideRow className={"error"} label={"Sex"}
                                                                       value={selectedEvaluation.response.person.sex ? "Bărbat" : "Femeie"}/>
                                                        <SideBySideRow className={"error"} label={"Vârstă"}
                                                                       value={`${selectedEvaluation.response.person.varsta} ani`}/>
                                                        <SideBySideRow className={"error"} label={"Greutate"}
                                                                       value={`${selectedEvaluation.response.person.greutate} kg`}/>
                                                        <SideBySideRow className={"error"} label={"Înălțime"}
                                                                       value={`${(selectedEvaluation.response.person.inaltime / 100)} m`}/>
                                                        <SideBySideRow className={"error"}
                                                                       label={"Circumferință abdominală"}
                                                                       value={`${selectedEvaluation.response.person.circumferinta} cm`}/>
                                                    </div>
                                                )}
                                            </div>
                                            <IMCInterpretationCard imc={selectedEvaluation.response.result.imc}/>
                                            <div>
                                                <h3 className={"text-xl font-semibold mb-2"}>Simptome</h3>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {selectedEvaluation.response.person.oboseala_permanenta === 0 && selectedEvaluation.response.person.lipsa_de_energie === 0 ?
                                                        <p className={"text-gray-500"}>Nu sunt simptome</p> : <>
                                                            {selectedEvaluation.response.person.oboseala_permanenta !== 0 && (
                                                                <CustomBadge
                                                                    type={"cardio"}>{selectedEvaluation.response.person.oboseala_permanenta ? "Oboseala permanentă" : ""}</CustomBadge>)}
                                                            {selectedEvaluation.response.person.lipsa_de_energie !== 0 && (
                                                                <CustomBadge
                                                                    type={"cardio"}>{selectedEvaluation.response.person.lipsa_de_energie ? "Lipsă de energie" : ""}</CustomBadge>)}</>}
                                                </div>
                                            </div>
                                            <div className="divider"></div>
                                            <div>
                                                <h3 className={"text-xl font-semibold mb-2"}>Afecțiuni</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {selectedEvaluation.response.person.rezistenta !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.rezistenta ? "Rezistență la insulină" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.prediabet !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.prediabet ? "Prediabet" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.diabet !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.diabet ? "Diabet zaharat tip 2" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.hipertensiune_arteriala !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.hipertensiune_arteriala ? "Hipertensiune Arterială" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.dislipidemie !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.dislipidemie ? "Dislipidemie (grăsimi crescute în sânge)" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.obezitate_abdominala !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.obezitate_abdominala ? "Obezitate abdominală" : ""}</CustomBadge>)}
                                                </div>
                                            </div>
                                            <div className="divider"></div>
                                            <div>
                                                <h3 className={"text-xl font-semibold mb-2"}>Afecțiuni
                                                    cardiovasculare</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {selectedEvaluation.response.person.infarct !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.infarct ? "Infarct" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.avc !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.avc ? "Atac vascular cerebral (AVC)" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.stent_sau_bypass !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.stent_sau_bypass ? "Stent sau Bypass" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.fibrilatie_sau_ritm !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.fibrilatie_sau_ritm ? "Fibrilație arteriala sau ritm neregulat" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.embolie_sau_tromboza !== 0 && (
                                                        <CustomBadge
                                                            type={"cardio"}>{selectedEvaluation.response.person.embolie_sau_tromboza ? "Cheaguri de sânge (tromboză sau embolie)" : ""}</CustomBadge>)}
                                                </div>
                                            </div>
                                            <div className="divider"></div>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">Simptome Extrase</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {selectedEvaluation.response.result.labels_extrase?.length > 0 ? (
                                                        selectedEvaluation.response.result.labels_extrase.map((label) => (
                                                            <CustomBadge key={label} type={"cardio"}
                                                            >
                                                                {labelMap[label] || label}
                                                            </CustomBadge>
                                                        ))
                                                    ) : (
                                                        <span
                                                            className="text-gray-500">Nicio etichetă identificată</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex gap-12 mt-4">
                                                <CircularRiskProgress
                                                    value={selectedEvaluation.response.result.probabilitate}
                                                    label={selectedEvaluation.response.result.diagnostic}
                                                />
                                                {selectedEvaluation.response.person && (
                                                    <div id="person" className="w-2/5">
                                                        <h3 className={"text-xl font-semibold"}>Detalii pacient</h3>
                                                        <SideBySideRow className={"secondary"} label={"Sex"}
                                                                       value={selectedEvaluation.response.person.sex ? "Bărbat" : "Femeie"}/>
                                                        <SideBySideRow className={"secondary"} label={"Vârstă"}
                                                                       value={`${selectedEvaluation.response.person.varsta} ani`}/>
                                                        <SideBySideRow className={"secondary"} label={"Greutate"}
                                                                       value={`${selectedEvaluation.response.person.greutate} kg`}/>
                                                        <SideBySideRow className={"secondary"} label={"Înălțime"}
                                                                       value={`${(selectedEvaluation.response.person.inaltime / 100)} m`}/>
                                                        <SideBySideRow className={"secondary"}
                                                                       label={"Circumferință abdominală"}
                                                                       value={`${selectedEvaluation.response.person.circumferinta} cm`}/>
                                                    </div>
                                                )}
                                            </div>
                                            <IMCInterpretationCard imc={selectedEvaluation.response.result.imc}/>
                                            <div>
                                                <h3 className={"text-xl font-semibold mb-2"}>Simptome</h3>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {selectedEvaluation.response.person.slabesc_greu !== 0 && (
                                                        <CustomBadge>{selectedEvaluation.response.person.slabesc_greu ? "Slăbec greu" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.ma_ingras_usor !== 0 && (
                                                        <CustomBadge>{selectedEvaluation.response.person.ma_ingras_usor ? "Mă îngraș ușor" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.grasime_abdominala !== 0 && (
                                                        <CustomBadge>{selectedEvaluation.response.person.grasime_abdominala ? "Grăsime abdominală" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.urinare_nocturna !== 0 && (
                                                        <CustomBadge>{selectedEvaluation.response.person.urinare_nocturna ? "Urinare nocturnă" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.pofte_dulce !== 0 && (
                                                        <CustomBadge>{selectedEvaluation.response.person.pofte_dulce ? "Pofte de dulce" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.foame_necontrolata !== 0 && (
                                                        <CustomBadge>{selectedEvaluation.response.person.foame_necontrolata ? "Foame greu de controlat" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.lipsa_energie !== 0 && (
                                                        <CustomBadge>{selectedEvaluation.response.person.lipsa_energie ? "Lipsă de energie" : ""}</CustomBadge>)}
                                                </div>
                                            </div>
                                            <div className="divider"></div>
                                            <div>
                                                <h3 className={"text-xl font-semibold mb-2"}>Boli asociate</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {selectedEvaluation.response.person.ficat_gras !== 0 && (
                                                        <CustomBadge>{selectedEvaluation.response.person.ficat_gras ? "Ficat gras" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.sop !== 0 && (
                                                        <CustomBadge>{selectedEvaluation.response.person.sop ? "Sindromul ovarelor polichistice (SOP)" : ""}</CustomBadge>)}
                                                    {selectedEvaluation.response.person.obezitate_abdominala !== 0 && (
                                                        <CustomBadge>{selectedEvaluation.response.person.obezitate_abdominala ? "Obezitate abdominală" : ""}</CustomBadge>)}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">Simptome extrase</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {selectedEvaluation.response.result.labels_extrase?.length > 0 ? (
                                                        selectedEvaluation.response.result.labels_extrase.map((label) => (
                                                            <CustomBadge key={label}
                                                            >
                                                                {labelMap[label] || label}
                                                            </CustomBadge>
                                                        ))
                                                    ) : (
                                                        <span
                                                            className="text-gray-500">Nicio etichetă identificată</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>)}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}