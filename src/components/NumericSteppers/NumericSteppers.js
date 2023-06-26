import React from 'react'
import styles from './style.module.css'

export default function NumericSteppers({ totalSteps, currentStep,customFields }) {

   return (
      <div className={`lg:mt-6 relative ${currentStep === 5 ? "mb-[30px]" : "mb-[30px]"} flex justify-between`}>
         {[...Array(totalSteps)].map((x, i) =>
             (customFields?.length===0&&i===2&&totalSteps===3)?'':
            <button key={i} className={`w-[36px] hidden lg:block h-[36px] bg-primary border rounded-full mr-7 font-bold
             ${i + 1 < currentStep ? 'bg-[#FFA28D] text-[#F3F5F7]' : ''} 
             ${i + 1 === currentStep ? 'before:hidden bg-primary border-3 border-primary text-white' : ''} 
             ${i + 1 > currentStep ? 'opacity-50 before:hidden text-[#F3F5F7] bg-gray-400' : ''} 
             transition 
             
             ${totalSteps===4&&i===3?'':styles.line} `}
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
