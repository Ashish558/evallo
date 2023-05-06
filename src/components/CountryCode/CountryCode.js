import React from 'react'
import { useRef } from 'react'
import styles from './style.module.css'
import selectStyles from "../InputSelect/style.module.css"
import DownArrow from "../../assets/icons/down-chevron.svg";
import { useState } from 'react';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';

export default function CountryCode({ numberPrefix, setNumberPrefix, className }) {

   const [selected, setSelected] = useState(false)
   const selectRef = useRef()
   useOutsideAlerter(selectRef, () => setSelected(false));

   return (
      <div ref={selectRef}
         className={`${selected && "relative z-5000"} ${styles.phoneNumberField} ${className ? className : ''} `}
         onClick={() => setSelected(true)}
      >
         <div
            className={`py-[16px] w-full px-2 pl-3 flex justify-center items-center rounded-10 relative cursor-pointer z-50`}
            style={{ justifyContent: 'spa' }}
         >
            {
               <img
                  src={DownArrow}
                  className={selectStyles.downArrow}
                  style={{ right: '16px' }}
                  alt="down-arrow"
                  onClick={() => setSelected(!selected)}
               />
            }
            <div className="outline-0 relative font-medium mr-5" name={'nm'}>
               {numberPrefix}
            </div>
            {selected && (
               <div className={`scrollbar-content scrollbar-vertical ${selectStyles.options}`} style={{ top: '100%' }} >
                  {['+1', '+91'].map((option, idx) => {
                     return (
                        <div
                           className="outline-0 border-0 py-2 px-4"
                           key={idx}
                           onClick={() => {setNumberPrefix(option) }}
                        >
                           {" "}
                           {option}{" "}
                        </div>
                     );
                  })}
               </div>
            )}
         </div>
      </div>
   )
}
