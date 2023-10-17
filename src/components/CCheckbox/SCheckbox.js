import React, { useEffect, useState } from 'react'
import styles from './style.module.css'

export default function SCheckbox({ stopM, checked, onChange, name, disabled, value, checkMarkClassName, className }) {
   const [checkG, setCheckG] = useState(checked)


   const handleClick = (e) => {
      if (disabled === true || !onChange) return
      onChange(!e)
   }

   useEffect(() => {
      if (disabled === true || !onChange || true) return
      onChange(checkG)
   }, [checkG])
   return (
      <div className={`w-[22px] h-[22px] ${styles.container} ${!checked ? styles.container2 : styles.container} ${!checked ? "opacity-40" : ''} ${className}`}
         onClick={(e) => {
            if (!true)
               setCheckG(!checkG)
            else {
               handleClick(checked)
            }

         }}
      >
         <input checked={true} type='checkbox' name={name ? name : 'moods'} value='' readOnly />
         <span className={`w-[17.5px] h-[17.5px] ${styles.checkmark} ${checkMarkClassName} `}></span>
      </div>
   )
}
