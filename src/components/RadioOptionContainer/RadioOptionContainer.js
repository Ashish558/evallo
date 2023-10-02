import {useState} from "react" 
import styles from "./style.module.css"

export default function RadioOptionContainer({
    children,
    className,
    radioButtonClassName,
    selected = false,
    onClick,
}) {
    return (
        <div
            className={`flex h-[150px] w-full ${className} ${selected ? styles.selectedContainer : styles.unSelectedContainer}`}
            onClick={onClick}
        >   
            <div 
                className={`h-[15px] ml-[20px] mt-[20px] w-[15px] ${radioButtonClassName} ${selected ? styles.selectedRadio : styles.unSelectedRadio}`}
            ></div>
            {children}
        </div>
    )
}