import React from 'react'
import styles from './style.module.css'

export default function NumericSteppers({ totalSteps, currentStep }) {


   return (
      <div className={`lg:mt-6 relative ${currentStep === 5 ? "mb-[30px]" : "mb-[30px]"} flex`}>
         {[...Array(totalSteps)].map((x, i) =>
            <button key={i} className={`w-[36px] hidden lg:block h-[36px] border border-primary rounded-full mr-7 font-bold
             ${i + 1 < currentStep ? 'bg-primary text-[#F3F5F7]' : ''} 
             ${i + 1 === currentStep ? 'before:hidden bg-white border-3 border-primary text-primary' : ''} 
             ${i + 1 > currentStep ? 'opacity-50 before:hidden text-[#F3F5F7] bg-primary' : ''} 
             transition 
             ${styles.line} `}
            // onClick={() => handleClick(i + 1)}
            >
               {i + 1}
            </button>
         )}
         <div className='absolute top-[-23px] left-[-16.5%] w-screen'>
            <div className="flex gap-0.5">
               {[...Array(totalSteps)].map((x, i) =>
                  <div key={i} className={`w-1/3 h-[10px] lg:hidden border font-bold
               ${i + 1 < currentStep ? 'bg-primary text-[#F3F5F7]' : ''} 
               ${i + 1 === currentStep ? 'bg-[#D9D9D9] opacity-50 before:hidden text-primary' : ''} 
               ${i + 1 > currentStep ? 'opacity-50 before:hidden text-[#F3F5F7] bg-[#D9D9D9]' : ''} 
               transition 
               `}
                  // onClick={() => handleClick(i + 1)}
                  >
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}
