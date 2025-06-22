'use client'
import { useState } from 'react'

export default function GenderInput() {
    const [sex, setSex] = useState("")

    return (
        <div className="form-control">
        <label className="label">
            <span className="label-text font-semibold">Ești:</span>
        </label>
        <div className="flex gap-4">
            <label className="label cursor-pointer">
                <input
                    type="radio"
                    name="sex"
                    value="0"
                    className="radio checked:bg-primary"
                    checked={sex === "0"}
                    onChange={(e) => setSex(e.target.value)}
                />
                <span className="label-text ml-2">Femeie</span>
            </label>

            <label className="label cursor-pointer">
                <input
                    type="radio"
                    name="sex"
                    value="1"
                    className="radio checked:bg-primary"
                    checked={sex === "1"}
                    onChange={(e) => setSex(e.target.value)}
                />
                <span className="label-text ml-2">Bărbat</span>
            </label>
        </div>
    </div>
    )
}