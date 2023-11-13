import React, { useEffect, useState } from 'react'
import styles from './style.module.css'
import { useEffectPreventMountExec } from '../../hooks/useEffectPreventMountExec'

export default function SCheckbox({ stopM, checked, onChange, name, disabled, value, checkMarkClassName, className }) {
   const [checkG, setCheckG] = useState(checked)


   const handleClick = (e) => {
      if (disabled === true || !onChange) return
      onChange(!e)
   }
   
useEffectPreventMountExec(()=>{
    if(disabled === true || !onChange) return
    onChange(checkG)
},[checkG])
   return (
      <div className={`w-[22px] h-[22px]  ${styles.container} ${!checked ? styles.container2 : styles.container}  ${className}`}
         onClick={(e) => {
            e.stopPropagation()
            if (!true)
               setCheckG(!checkG)
            else {
               handleClick(checked)
            }

         }}
      >
         <input checked={true} type='checkbox' name={name ? name : 'moods'} value='' readOnly />
         <span className={`w-[17.5px] h-[17.5px] ${styles.checkmark} ${checkMarkClassName} mt-[2px]`}></span>
      </div>
   )
}
