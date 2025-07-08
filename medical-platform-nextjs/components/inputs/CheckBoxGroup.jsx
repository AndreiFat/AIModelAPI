'use client'

export default function CheckboxGroup({title, options, className}) {
    return (
        <div className="grid grid-cols-2 space-y-2">
            {options.map(({label, name}) => (
                <label key={name} className="flex items-center space-x-2 cursor-pointer pr-2">
                    <input
                        type="checkbox"
                        name={name}
                        className={`checkbox ${className}`}
                    />
                    <span>{label}</span>
                </label>
            ))}
        </div>
    )
}