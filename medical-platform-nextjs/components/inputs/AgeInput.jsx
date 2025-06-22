'use client'

export default function AgeInput() {
    return (
        <div className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text font-semibold">Vârsta:</span>
            </label>
            <input
                type="number"
                name="varsta"
                min="18"
                max="120"
                step="1"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="ex: 45"
                maxLength="3"
                onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault()
                    }
                }}
                onInput={(e) => {
                    if (e.target.value.length > 3) {
                        e.target.value = e.target.value.slice(0, 3);
                    }
                }}
                className="input input-bordered input-primary w-full"
                required
            />
        </div>
    )
}