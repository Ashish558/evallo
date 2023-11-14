import {useEffect, useState} from "react" 
import styles from "./style.module.css"
import SCheckbox from "../CCheckbox/SCheckbox"

export default function CheckBoxOptionContainer({
    children,
    className,
    checkBoxClassName,
    selected = false,
    onChange = function(c){}
}) {
    return (
        <div
            className={`border-2 flex rounded-5 w-full ${className}`}
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