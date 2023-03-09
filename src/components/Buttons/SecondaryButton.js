import React from "react";
import Loader from '../Loader'

export default function SecondaryButton({
    children,
    className,
    onClick,
    type,
    loading
}) {
    return (
        <button
            className={`bg-secondaryLight text-lg font-medium rounded-md py-4 px-8 ${className} text-[#636363] relative disabled:opacity-60`}
            onClick={onClick}
            type={type ? type : "button"}
            disabled={loading === true ? true : false}
           
        >
            {children}
            {
            loading &&
            <Loader />
         }
        </button>
    );
}
