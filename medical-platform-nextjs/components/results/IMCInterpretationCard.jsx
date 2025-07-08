'use client'

export default function IMCInterpretationCard({imc = 0}) {
    const getCategory = (imc) => {
        if (imc < 18.5) return {label: "Subponderal", color: "progress-info", info: "Greutatea ta este sub normal."}
        if (imc < 25) return {
            label: "Greutate normală",
            color: "progress-success",
            info: "Greutatea ta este în intervalul ideal."
        }
        if (imc < 30) return {
            label: "Supraponderal",
            color: "progress-warning",
            info: "Ai o greutate ușor peste limită."
        }
        if (imc < 35) return {label: "Obezitate grad I", color: "progress-error", info: "Ești în zona de risc crescut."}
        if (imc < 40) return {
            label: "Obezitate grad II",
            color: "progress-error",
            info: "Risc crescut de afecțiuni metabolice."
        }
        return {
            label: "Obezitate morbidă",
            color: "progress-error",
            info: "Risc major pentru sănătate. Se recomandă intervenție."
        }
    }

    const category = getCategory(imc)
    const percentage = Math.min((imc / 40) * 100, 100)

    return (
        <div className="card bg-base-100 p-6 shadow-md space-y-4 w-full mb-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Indicele tău de Masă Corporală (IMC)</h3>
                <div className="text-3xl font-bold text-gray-800">{imc.toFixed(1)}</div>
            </div>

            <progress
                className={`progress w-full h-4 ${category.color}`}
                value={percentage}
                max="100"
            />

            <div className="flex items-center justify-between mt-1">
                <span className={`badge badge-outline`}>{category.label}</span>
                <span className="text-sm text-gray-500">Max: 40+</span>
            </div>

            <p className="text-sm text-gray-700">
                <strong>Interpretare:</strong> {category.info}
            </p>
        </div>
    )
}