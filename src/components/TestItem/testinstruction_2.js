import React, { useState } from 'react'
import BackBtn from '../Buttons/Back'
import PrimaryButton from '../Buttons/PrimaryButton'
import { TestDetail } from '../TestDetail/TestDetail'
import Modal from '../Modal/Modal'

const Testinstruction_2 = ({testHeaderDetails,loader,setisntructionpage,testStarted,subjects,completedSectionIds,activeSection}) => {
 const [popup, setpopup] = useState(false)
 function closeinstruct(){
    setpopup(false)
    setisntructionpage(false)
 }
 return (
<>
{console.log('testName',loader)}
<div className='flex-1 relative'>
                 <BackBtn to='/all-tests' />
                  <p className='text-primary-dark ml-4 font-bold text-3xl mb-8' >
                     {testHeaderDetails.testName}
                  </p>
                 
                     <div className='grid grid-cols-2 grid-rows-3 ml-4 max-w-840 text-sm gap-y-4 mt-2'>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Student’s Name</p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails?.name}
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
                              children={item?.name}
                              onClick={() =>{console.log('handlesubjectchange');}}
                              className={`pt-2 pb-2 px-0 mr-0 rounded-0 font-semibold w-160
                            ${item.selected ? 'bg-primaryYellow' : ''} disabled:opacity-60`}
                              disabled={testStarted && item.selected === false ? true : completedSectionIds.includes(item._id) ? true : false}
                           />
                        })}
                     </div>
                     
                        <div className='bg-white pt-[60px] pr-8 pl-12 pb-[50px] mt-4'>
                           <TestDetail name={activeSection?.name} desc={activeSection?.description}
                              timer={activeSection?.timer} />

                           <div className='flex items-center flex-col mt-12'>
                              <p className='text-[#E02B1D] bg-[#FFBE9D] py-2 px-5 rounded-20 mb-[15px]' >
                                 Warning: Once Started, you will not be able to pause the timer.
                              </p>
                              <PrimaryButton children='Start Section' className='w-[300px] h-[60px] text-[21px]' onClick={() => {setpopup(true)}} />
                              {/* <PrimaryButton children='Start Section' className='w-[300px] h-[60px] text-[21px]' onClick={handleStartTest} /> */}
                           </div>
                        </div>
                        {popup &&<div className='w-1/2 relative flex justify-center items-center h-full'> <Modal
            classname="w-1/2 mx-auto "
            title="Are you sure you want to start the section?"
            titleClassName='mr-4  mb-4'
            primaryBtn={
               { text: "Start", className: "bg-black text-white ml-0", onClick: closeinstruct}
            }
            handleClose={() => setpopup(false)}
         /></div>}
                  </div>
                  
               </div>

</>  )
}

export default Testinstruction_2