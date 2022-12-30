import React, { useRef, useState } from "react";
import SeacrchIcon from '../../assets/icons/search.svg'
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import CCheckbox from "../CCheckbox/CCheckbox";
import styles from '../InputSelect/style.module.css'

export default function InputSearch({
   parentClassName,
   inputContainerClassName,
   Icon,
   value,
   placeholder,
   label,
   labelClassname,
   IconRight,
   inputClassName,
   inputLeftField,
   onChange,
   type,
   right,
   required,
   optionData,
   onOptionClick,
   optionPrefix,
   checkbox,
   disabled
}) {

   const [optionsVisible, setOptionsVisible] = useState(false)
   const inputRef = useRef()
   const handleClose = () => {
      setOptionsVisible(false)
   }
   useOutsideAlerter(inputRef, handleClose)

   return (
      <div className={` ${parentClassName && parentClassName}`} ref={inputRef} >
         <label
            className={`inline-block font-semibold ${labelClassname} w-2/3`}
         >
            {label}
            {required && <span className='text-primaryRed inline-block pl-1'>*</span>}
         </label>
         <div
            className={`py-3 px-6 flex relative items-center rounded-10 ${inputContainerClassName ? inputContainerClassName : ""
               }`}
         >
            {Icon && <img src={Icon} className="mr-6" />}
            {inputLeftField && inputLeftField}
            <input disabled={disabled}
               className={`outline-0 w-full ${inputClassName ? inputClassName : ""}`}
               placeholder={placeholder}
               value={value}
               type={type ? type : "text"}
               onChange={(e) =>
                  onChange !== undefined ? onChange(e) : ""
               }
               onFocus={() => setOptionsVisible(true)}
            // onBlur={()=> setOptionsVisible(false)}
            />
            <img src={SeacrchIcon} className="ml-4" />
            {right && right}

            {optionsVisible &&
               <div className={`${styles.options} shadow-xl rounded-t-none`}>
                  {optionData.map((option, idx) => {
                     return (
                        <div className='outline-0 border-0 py-2 px-4 flex justify-between' key={idx}
                           onClick={() => {return checkbox ? onOptionClick(option) : (onOptionClick(option), handleClose()) }}
                        >
                           <p>
                              {option.value}
                           </p>
                           <p className={`text-sm opacity-60 ${checkbox ? 'mr-auto ml-4' : ''}`}>
                              {optionPrefix ? `${optionPrefix}${option._id.slice(-5)}` : option._id.slice(-5)}
                           </p>
                           {
                              checkbox &&
                              <div className="flex mb-3">
                                 <CCheckbox 
                                 checked={checkbox.match.includes(option._id) ? true : false}
                                  name='student'
                                    // onChange={() =>
                                    //    setData({
                                    //       ...data,
                                    //       recurring: !data.recurring,
                                    //    })}
                                 />
                              </div>
                           }
                        </div>
                     )
                  })}
               </div>
            }
         </div>
      </div>
   );
}
