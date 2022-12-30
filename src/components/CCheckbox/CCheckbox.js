import React from 'react'
import styles from './style.module.css'

export default function CCheckbox({ checked, onChange, name, disabled }) {

   const handleClick = ()=>{
      if(disabled === true) return
      onChange()
   }

   return (
      <div className={`${styles.container} `}
         onClick={handleClick}>
         <input checked={checked} type='checkbox' name={name ? name : 'moods'} value='' onChange={(e)=>e.target.value} />
         <span className={styles.checkmark}></span>
      </div>
   )
}
