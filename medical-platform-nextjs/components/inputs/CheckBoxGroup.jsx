'use client'

export default function CheckboxGroup({ title, options }) {
    return (
        <fieldset className="border p-4 rounded-md space-y-2">
            <legend className="font-semibold mb-2">{title}</legend>
            {options.map(({ label, name }) => (
                <label key={name} className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name={name}
                        className="checkbox checkbox-primary"
                    />
                    <span>{label}</span>
                </label>
            ))}
        </fieldset>
    )
}