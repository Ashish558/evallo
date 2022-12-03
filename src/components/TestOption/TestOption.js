import React from 'react'
import InputField from '../InputField/inputField'

const options = [
   'A', 'B', 'C', 'D'
]

export default function TestOption({ isMcq, selected }) {


   return (
      isMcq ?
         <div className='flex ml-[40px] items-center'>
            {options.map(option => {
               return <div className={`w-[46px] mr-[34px] last:mr-0  rounded-full h-[46px] text-[22px] font-bold flex items-center justify-center ${selected === option ? 'bg-primary text-white' : 'text-primary border-3 border-primary leading-none'} `}>
                  {option}
               </div>
            })}
         </div>
         :
         <div className='flex flex-1 max-w-[296px] justify-center ml-[40px]'>
            <InputField placeholder='Type'
               parentClassName='bg-primary-50 w-full max-h-[56px] rounded-md'
               inputClassName='bg-transparent'
               labelClassname='hidden' />
         </div>

   )
}
