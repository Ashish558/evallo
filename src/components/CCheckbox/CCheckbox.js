import React from 'react'
import styles from './style2.module.css'

export default function CCheckbox({ checked,className, onChange, name, disabled, value,checkBoxClassName , customSize ,customTickIconSize }) {
  
   const handleClick = ()=>{
      if(disabled === true || !onChange) return
      onChange(value)
   }

   return (
      <div className={`${customSize ? customSize : "w-[22.5px] h-[16px]"} ml-[5px]  ${styles.container} ${className}`}
         onClick={handleClick}>
         <input checked={checked} type='checkbox' name={name ? name : 'moods'} value='' onChange={(e)=>e.target.value} />
         <span className={`${styles.checkmark}  ${customTickIconSize ? customTickIconSize : "w-[16px] h-[16px]"} ${checkBoxClassName}`}></span>
      </div>
   )
}
