import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SecondaryButton from '../../components/Buttons/SecondaryButton'

import BackIcon from '../../assets/assignedTests/back.svg'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import { TestDetail } from '../../components/TestDetail/TestDetail'
import { testData } from './tempData'
import TestOption from '../../components/TestOption/TestOption'
import { useAttendTestMutation, useLazyGetTimeQuery, useUpdateTimeMutation } from '../../app/services/test'
const tempsubjects = [
   { text: 'Trigonometry', selected: true },
   { text: 'Mathematics', selected: false },
   { text: 'Reading', selected: false },
   { text: 'Science', selected: false },
]


export default function StartTest() {

   const navigate = useNavigate()
   const [subjects, setSubjects] = useState(tempsubjects)
   const [testStarted, setTestStarted] = useState(false)

   const [attendTest, attendTestResp] = useAttendTestMutation()
   const [updateTime, updateTimeResp] = useUpdateTimeMutation()
   const [getTime, getTimeResp] = useLazyGetTimeQuery()

   const handleStartTest = (item) => {
      setTestStarted(true)
   }

   useEffect(() => {
      getTime('637663fe90241bf60305bd36')
      .then(res => {
         console.log(res);
      })
   }, [])
  
   const handleChange = (item) => {
      let tempdata = subjects.map(sub => {
         if (sub.text === item.text) {
            return { ...sub, selected: true }
         } else {
            return { ...sub, selected: false }
         }
      })
      setSubjects(tempdata)
   }

   // console.log(testStarted)

   return (
      <div className='ml-pageLeft bg-lightWhite min-h-screen'>
         <div className='py-8 px-5'>

            <div className='flex'>

               <div className='flex-1' >
                  <SecondaryButton
                     className='flex items-center pl-2 pr-5 py-2.5 mb-[15px]'
                     onClick={() => navigate('/assigned-tests')}
                     children={
                        <>
                           <img src={BackIcon} className='mr-2' />
                           <span className='leading-0'>
                              Back
                           </span>
                        </>
                     } />
                  <p className='text-primary-dark font-bold text-3xl mb-8' >Test Name</p>
                  {!testStarted &&
                     <div className='grid grid-cols-2 grid-rows-3 max-w-840 gap-y-4 mt-2'>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Student’s Name</p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'> Joseph Brown</p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Started on </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'> Joseph Brown</p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'>  Date Assigned </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'> Joseph Brown</p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Completed on </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'> Joseph Brown</p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Duration </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'> Joseph Brown</p>
                        </div>
                     </div>
                  }

                  <div>

                     <div className='mt-9'>
                        {subjects.map((item, idx) => {
                           return <PrimaryButton
                              roundedClass='rounded-0'
                              children={item.text}
                              onClick={() => handleChange(item)}
                              className={`py-2 px-0 mr-0 rounded-0 font-semibold w-160
                            ${item.selected ? 'bg-primaryYellow' : ''}`} />
                        })}
                     </div>
                     {!testStarted &&
                        <div className='bg-white pt-[60px] pr-8 pl-12 pb-[50px] mt-4'>
                           <TestDetail />

                           <div className='flex items-center flex-col mt-12'>
                              <p className='text-[#E02B1D] bg-[#FFBE9D] py-2 px-5 rounded-20 mb-[15px]' >
                                 Warning: Once Started, you wont be able to pause the timer.
                              </p>
                              <PrimaryButton children='Start Section' className='w-[359px] h-[73px] text-[21px]' onClick={handleStartTest} />
                           </div>
                        </div>
                     }

                     {testStarted &&
                        <div className='mt-[15px]'>
                           {testData.map(item => {
                              return (
                                 <div className='flex justify-between items-center py-5 px-10 bg-white rounded-xl mb-[15px]'>
                                    <p className='font-bold text-[22px] leading-none'> {item.number} </p>
                                    <TestOption {...item} />
                                    {item.isMarked ?
                                       <button className='w-[210px] font-semibold text-xl py-3 rounded-lg	 border-2 border-[#D2D2D2] text-[#D2D2D2] ml-4' >
                                          Mark for Review
                                       </button> :
                                       <button className='w-[210px] font-semibold text-xl py-3 rounded-lg bg-primaryOrange text-white ml-4' >
                                          Unmark
                                       </button>
                                    }
                                 </div>
                              )
                           })}
                        </div>
                     }

                  </div>
               </div>

               {/* RIGHT */}

               <div className='flex-2 ml-8' >

                  <div className='bg-primary rounded-20 text-white flex flex-col items-center px-9 py-6 font-bold mt-[100px]'>
                     <p className='text-[32px]'> Timer </p>
                     <p className='text-[96px] leading-none'>45:00</p>
                  </div>

               </div>
            </div>

         </div>
      </div>
   )
}
