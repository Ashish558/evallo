import React, { useEffect, useState } from 'react'
import styles from './style.module.css'
import { useEffectPreventMountExec } from '../../hooks/useEffectPreventMountExec'

export default function SCheckbox({ checked, onChange, name, disabled, value ,checkMarkClassName, className}) {
const [checkG,setCheckG]=useState(checked)
   const handleClick = ()=>{
      if(disabled === true || !onChange) return
      onChange(value)
   }
   
useEffectPreventMountExec(()=>{
    if(disabled === true || !onChange) return
    onChange(checkG)
},[checkG])
   return (
      <div className={` w-5 h-5 ${styles.container} ${!checked?styles.container2:styles.container} ${!checked?"opacity-40":''} ${className}`}
          onClick={(e)=>setCheckG(!checkG)}
        >
         <input checked={true} type='checkbox' name={name ? name : 'moods'} value='' readOnly />
         <span className={`w-5 h-5 ${styles.checkmark} ${checkMarkClassName} `}></span>
      </div>
   )
}
