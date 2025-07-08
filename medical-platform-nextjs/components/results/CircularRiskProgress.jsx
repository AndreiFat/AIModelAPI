'use client'

import {buildStyles, CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const getColorByLabel = (label) => {
    switch (label?.toLowerCase()) {
        case "diabet zaharat tip 2":
            return "oklch(70% 0.191 22.216)" // badge-error (red-500)
        case "prediabet":
            return "oklch(75% 0.183 55.934)" // badge-warning (amber-500)
        case "rezistență la insulină":
            return "oklch(82% 0.189 84.429)" // badge-secondary (bumblebee yellow)
        default:
            return "oklch(76% 0.177 163.223)" // badge-success (green-500)
    }
}

const getBadgeClass = (label) => {
    switch (label?.toLowerCase()) {
        case "diabet zaharat tip 2":
            return "badge-error"
        case "prediabet":
            return "badge-secondary"
        case "rezistență la insulină":
            return "badge-warning"
        default:
            return "badge-success"
    }
}

export default function CircularRiskProgress({value = 0.0, label = "Risc scăzut"}) {
    const color = getColorByLabel(label)
    const badgeClass = getBadgeClass(label)

    return (
        <div className="relative w-1/2 h-1/2">
            {/* Progress circle */}
            <CircularProgressbar
                value={value * 100}
                styles={buildStyles({
                    pathColor: color,
                    trailColor: "#e5e7eb", // gray-200
                    textColor: "transparent", // hide default %
                    textSize: "0px",
                })}
            />

            {/* Custom content in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-6xl font-bold text-gray-800 my-2">{(value * 100).toFixed(0)}%</div>
                {value !== 0.0 ? (
                    <span className={`badge badge-lg mt-1 ${badgeClass}`}>{label}</span>
                ) : (
                    <span className="text-sm text-gray-500 mt-1">Fără rezultate</span>
                )}
            </div>
        </div>
    );
}