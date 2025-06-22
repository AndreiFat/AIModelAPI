'use client'

import GenderInput from "@/components/inputs/GenderInput";
import predictDiabetes from "@/app/(diabetes)/predict-diabetes/actions";
import AgeInput from "@/components/inputs/AgeInput";
import NumericInput from "@/components/inputs/NumericInput";
import CheckboxGroup from "@/components/inputs/CheckBoxGroup";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import {useActionState} from "react";

const initialState = {
    result: ""
}

 export default function PredictDiabetesForm() {
     const [result, formAction] = useActionState(predictDiabetes, initialState)

     const simptome = [
         { label: "Slăbesc greu", name: "slabesc_greu" },
         { label: "Mă îngraș ușor", name: "ma_ingras_usor" },
         { label: "Depun grăsime în zona abdominală", name: "grasime_abdominala" },
         { label: "Oboseală permanentă", name: "oboseala" },
         { label: "Urinare nocturnă", name: "urinare_nocturna" },
         { label: "Pofte de dulce", name: "pofte_dulce" },
         { label: "Foame greu de controlat", name: "foame_necontrolata" },
         { label: "Lipsă de energie", name: "lipsa_energie" },
     ]

     const boli = [
         { label: "Hipertensiune", name: "hipertensiune" },
         { label: "Ficat gras", name: "ficat_gras" },
         { label: "Dislipidemie", name: "dislipidemie" },
         { label: "Sindromul ovarelor polichistice", name: "sop" },
         { label: "Obezitate abdominală", name: "obezitate_abdominala" },
     ]

   return (
       <div>
           <form className="space-y-6 p-6">
               <GenderInput/>
                <AgeInput/>
               <NumericInput name="greutate" label="Greutate (kg)" placeholder="ex: 85" />
               <NumericInput name="inaltime" label="Înălțime (cm)" placeholder="ex: 175" />
               <NumericInput name="circumferinta" label="Circumferință abdominală (cm)" placeholder="ex: 95" />
               <CheckboxGroup title="Simptome" options={simptome} />
               <CheckboxGroup title="Boli" options={boli} />
               <TextAreaInput
                   label="Cu ce alte probleme de sănătate te știi sau ai în familie?"
                   placeholder="Ex: am migrene, adenomioză și probleme cu glanda tiroidă în familie"
               />

               <button formAction={formAction} type="submit" className="btn btn-primary mt-4">
                   Trimite
               </button>
           </form>
           {
               JSON.stringify(result, null, 2)
           }
           
       </div>
   );
 }