import React from 'react'
import styles from './style.module.css'

export default function Message({ text, isOpen }) {

   return (
      <div className={`${styles.container} ${isOpen ? `${styles.active}` : ``}`}>
         <p>
            {text}
         </p>
      </div>
   )
}
