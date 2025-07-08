'use client'

import {buildStyles, CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'


// Funcție pentru culoare în funcție de procent
const getRiskColor = (value) => {
    if (value > 0.66) return {hex: 'oklch(70% 0.191 22.216)', badge: 'badge-error'}      // roșu (risc mare)
    if (value > 0.33) return {hex: 'oklch(82% 0.189 84.429)', badge: 'badge-warning'}    // galben (risc moderat)
    return {hex: 'oklch(76% 0.177 163.223)', badge: 'badge-success'}                      // verde (risc scăzut)
}

export default function CircularRiskProgressCardio({value = 0.0, label = "Risc scăzut"}) {
    const {hex, badge} = getRiskColor(value)

    return (
        <div className="relative w-1/2 h-1/2">
            {/* Progress circle */}
            <CircularProgressbar
                value={value * 100}
                styles={buildStyles({
                    pathColor: hex,
                    trailColor: "#e5e7eb", // gray-200
                    textColor: "transparent",
                    textSize: "0px",
                })}
            />

            {/* Custom content in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-6xl font-bold text-gray-800 my-2">
                    {(value * 100).toFixed(0)}%
                </div>
                {value !== 0.0 ? (
                    <span className={`badge badge-lg mt-1 ${badge}`}>{label}</span>
                ) : (
                    <span className="text-sm text-gray-500 mt-1">Fără rezultate</span>
                )}
            </div>
        </div>
    )
}