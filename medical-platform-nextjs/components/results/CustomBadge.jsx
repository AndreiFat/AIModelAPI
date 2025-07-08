import React from 'react';

function CustomBadge({children, type = "metabolic"}) {
    return (
        <div
            className={`w-full text-center py-1 border ${type === "cardio" ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"} rounded-full`}>{children}</div>
    );
}

export default CustomBadge;