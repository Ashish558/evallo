import React, { useEffect, useState } from 'react'
import InputField from '../InputField/inputField'


export default function TestOption({_id, QuestionType, AnswerChoices, ResponseAnswer, handleResponseChange, handleTimeTaken }) {

   const [choices, setChoices] = useState([])


   useEffect(() => {
      if (AnswerChoices) {
         setChoices(AnswerChoices.split(','))
      }
   }, [])

   return (
      QuestionType === 'MCQ' ?
         <div className='flex ml-[40px] items-center'>
            
            {choices.map(option => {
               return <div className={`w-[40px] cursor-pointer mr-[34px] last:mr-0  rounded-full h-[40px] text-[18px] font-bold flex items-center justify-center ${ResponseAnswer === option ? 'bg-[#517CA8] text-white' : 'text-[#517CA8] border-3 border-[#517CA8] leading-none'} `}
                  onClick={() => ResponseAnswer !== option &&  handleResponseChange(_id, option)}
               >
                  {option}
               </div>
            })}
         </div>
         :
         <div className='flex flex-1 max-w-[296px] justify-center ml-[40px]'>
            <InputField placeholder='Type'
               parentClassName='bg-primary-50 w-full rounded-md'
               inputContainerClassName='pt-3 pb-3'
               inputClassName='bg-transparent'
               labelClassname='hidden'
               onChange={(e) =>  handleResponseChange(_id, e.target.value)}
                />
         </div>

   )
}
