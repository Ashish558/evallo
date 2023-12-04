import React from 'react'
import styles from './message.module.css'

export default function MessageLeft({ error, type }) {

   return (
      <div className={`px-3 absolute right-0 text-[13px] rounded-md ml-auto max-w-[310px] mt-5 py-2 bg-[#FFCDC9] border border-[#FF2626] ${styles.container} `}>
         
         <p>
            {error}
         </p>
         <div className={`${styles.outer} left-2`}>
         </div>
         <div className={`${styles.inner} left-2`}>
         </div>
      </div>
   )
}
