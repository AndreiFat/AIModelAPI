import React from 'react';

function SideBySideRow({label, value, className}) {
    return (
        <div className="flex justify-between items-center border-b border-gray-300 pt-4 pb-2">
            <span>{label}</span> <span className={`badge badge-outline badge-${className}`}>{value}</span>
        </div>
    );
}

export default SideBySideRow;