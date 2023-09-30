import React, { useEffect, useState } from 'react'
import styles from './style.module.css'

export default function SCheckbox({ stopM,checked, onChange, name, disabled, value ,checkMarkClassName, className}) {
const [checkG,setCheckG]=useState(checked)


   const handleClick = (e)=>{
      if(disabled === true || !onChange) return
      onChange(!e)
   }
   
useEffect(()=>{
    if(disabled === true || !onChange || stopM) return
    onChange(checkG)
},[checkG])
   return (
      <div className={` w-5 h-5 ${styles.container} ${!checked?styles.container2:styles.container} ${!checked?"opacity-40":''} ${className}`}
          onClick={(e)=>{
            if(!stopM)
            setCheckG(!checkG)
         else {
            handleClick(checked)
         }
       
          }}
        >
         <input checked={true} type='checkbox' name={name ? name : 'moods'} value='' readOnly />
         <span className={`w-5 h-5 ${styles.checkmark} ${checkMarkClassName} `}></span>
      </div>
   )
}
