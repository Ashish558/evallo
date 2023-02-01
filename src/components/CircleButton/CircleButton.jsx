import React from "react";

export default function CircleButton({
    children,
    className,
    onClick,
    type,
}) {
    return (
        <button
            className={`bg-secondaryLight text-lg font-medium rounded-full p-3.2 ${className} text-[#636363]`}
            onClick={onClick}
            type={type ? type : "button"}
           
        >
            {children}
        </button>
    );
}
