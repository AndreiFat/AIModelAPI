'use client'

export default function TextAreaInput({name = "text", label, placeholder}) {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-semibold mb-0.5">{label} (Optional)</span>
            </label>
            <textarea
                name={name}
                rows={4}
                placeholder={placeholder}
                className="textarea textarea-bordered w-full"
            />
        </div>
    )
}