import {useEffect, useState} from "react" 
import styles from "./style.module.css"
import { useEffectPreventMountExec } from "../../hooks/useEffectPreventMountExec"

export default function RadioOptionContainer({
    children,
    className,
    radioButtonClassName,
    selected = false,
    onChange = function(c){}
}) {
    const [checked, SetChecked] = useState(selected)
    const handleClick = () => {
        SetChecked(checked => !checked)
    }

    useEffectPreventMountExec(() => {
        onChange(checked);
    }, [checked])
    return (
        <div
            className={`flex w-full ${className} ${selected ? styles.selectedContainer : styles.unSelectedContainer}`}
            onClick={handleClick}
        >   
            <div 
                className={`h-[15px] ml-[20px] mt-[20px] w-[15px] ${radioButtonClassName} ${selected ? styles.selectedRadio : styles.unSelectedRadio}`}
            ></div>
            {children}
        </div>
    )
}