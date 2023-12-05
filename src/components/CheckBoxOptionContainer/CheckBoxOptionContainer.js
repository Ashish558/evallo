import {useEffect, useState} from "react" 
import styles from "./style.module.css"
import SCheckbox from "../CCheckbox/SCheckbox"

export default function CheckBoxOptionContainer({
    children,
    className,
    checkBoxClassName,
    selected = false,
    onChange = function(c){},
    onBodyClicked,
}) {
    return (
        <div
            className={`flex rounded-5 w-full 
                        ${selected ? "shadow-[0px_0px_10px_rgba(255,162,141,0.5)]" : "shadow-[0px_0px_2px_rgba(0,0,0,0.25)]"}
                        ${className}
            `}
            onClick={() => {
                if(onBodyClicked.constructor && onBodyClicked.constructor.name === "Function") {
                    onBodyClicked();
                }
            }}
        >   
            {/* <div 
                className={`h-[15px] ml-[20px] mt-[20px] w-[15px] ${radioButtonClassName} ${selected ? styles.selectedRadio : styles.unSelectedRadio}`}
            ></div> */}
            <SCheckbox
                checked={selected}
                className={`ml-[20px] mt-[20px] ${checkBoxClassName}`}
                onChange={onChange}
            />
            {children}
        </div>
    )
}