import React from 'react'
import styles from './style.module.css'

export default function NumericSteppers({ totalSteps, currentStep }) {


   return (
      <div className={`mt-6 ${currentStep === 5 ? "mb-[30px]" : "mb-[60px]"} flex`}>
         {[...Array(totalSteps)].map((x, i) =>
            <button key={i} className={`w-[36px] h-[36px] border border-primary rounded-full mr-7 font-bold
             ${i + 1 < currentStep ? 'bg-primary text-[#F3F5F7]' : ''} 
             ${i + 1 === currentStep ? 'before:hidden bg-white border-3 border-primary text-primary' : ''} 
             ${i + 1 > currentStep ? 'opacity-50 before:hidden text-[#F3F5F7] bg-[#7152EB]' : ''} 
             transition 
             ${styles.line} `}
            // onClick={() => handleClick(i + 1)}
            >
               {i + 1}
            </button>
         )}
      </div>
   )
}
