import React from 'react'
import BackBtn from '../Buttons/Back'
import PrimaryButton from '../Buttons/PrimaryButton'
import { TestDetail } from '../TestDetail/TestDetail'

const Testinstruction_2 = ({testHeaderDetails,testStarted,subjects,completedSectionIds,activeSection}) => {
  return (
<>
{console.log('testName',testHeaderDetails)}
<div className='flex-1' >
                 <BackBtn to='/all-tests' />
                  <p className='text-primary-dark ml-4 font-bold text-3xl mb-8' >
                     {testHeaderDetails.testName}
                  </p>
                 
                     <div className='grid grid-cols-2 grid-rows-3 ml-4 max-w-840 text-sm gap-y-4 mt-2'>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Student’s Name</p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails.name}
                           </p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Due on </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails.dueDate ? testHeaderDetails.dueDate : '-'}
                           </p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Started on </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails.startedOn ? testHeaderDetails.startedOn : '-'}
                           </p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'>  Date Assigned </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails.dateAssigned}
                           </p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Completed on </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              -
                           </p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Duration </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails.duration} </p>
                        </div>

                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Instruction from Tutor </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails.instruction ? testHeaderDetails.instruction : "-"} </p>
                        </div>
                     </div>
                  

                  <div>

                     <div className='mt-9'>
                        {subjects.map((item, idx) => {
                           return <PrimaryButton
                              roundedClass='rounded-0'
                              children={item.name}
                              onClick={() =>{console.log('handlesubjectchange');}}
                              className={`pt-2 pb-2 px-0 mr-0 rounded-0 font-semibold w-160
                            ${item.selected ? 'bg-primaryYellow' : ''} disabled:opacity-60`}
                              disabled={testStarted && item.selected === false ? true : completedSectionIds.includes(item._id) ? true : false}
                           />
                        })}
                     </div>
                     
                        <div className='bg-white pt-[60px] pr-8 pl-12 pb-[50px] mt-4'>
                           <TestDetail name={activeSection.name} desc={activeSection.description}
                              timer={activeSection.timer} />

                           <div className='flex items-center flex-col mt-12'>
                              <p className='text-[#E02B1D] bg-[#FFBE9D] py-2 px-5 rounded-20 mb-[15px]' >
                                 Warning: Once Started, you will not be able to pause the timer.
                              </p>
                              <PrimaryButton children='Start Section' className='w-[300px] h-[60px] text-[21px]' onClick={() => console.log('hello')} />
                              {/* <PrimaryButton children='Start Section' className='w-[300px] h-[60px] text-[21px]' onClick={handleStartTest} /> */}
                           </div>
                        </div>
                     
                  </div>
               </div>

</>  )
}

export default Testinstruction_2