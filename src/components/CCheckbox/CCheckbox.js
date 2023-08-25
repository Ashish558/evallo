import React from 'react'
import styles from './style.module.css'

export default function CCheckbox({ checked,className, onChange, name, disabled, value }) {
  
   const handleClick = ()=>{
      if(disabled === true) return
      onChange(value)
   }

   return (
      <div className={`w-5 h-5  ${styles.container} ${className}`}
         onClick={handleClick}>
         <input checked={checked} type='checkbox' name={name ? name : 'moods'} value='' onChange={(e)=>e.target.value} />
         <span className={`${styles.checkmark} border border-[1.5px_solid_#555] w-5 h-5 `}></span>
      </div>
   )
}
