import React from 'react'
import styles from './style2.module.css'

export default function CCheckbox({ checked,className, onChange, name, disabled, value,checkBoxClassName }) {
  
   const handleClick = ()=>{
      if(disabled === true || !onChange) return
      onChange(value)
   }

   return (
      <div className={`w-[22.5px] h-[22.5px]  ${styles.container} ${className}`}
         onClick={handleClick}>
         <input checked={checked} type='checkbox' name={name ? name : 'moods'} value='' onChange={(e)=>e.target.value} />
         <span className={`${styles.checkmark}  w-[22.5px] h-[22.5px] ${checkBoxClassName}`}></span>
      </div>
   )
}
