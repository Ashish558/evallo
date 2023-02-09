import React, { useEffect, useState } from 'react'
import PrimaryButton from '../../../components/Buttons/PrimaryButton'
import Modal from '../../../components/Modal/Modal'

export default function CurrentSection({ answers, submitSection }) {

   const [details, setDetails] = useState(answers)
   const [totalQues, setTotalQues] = useState(0)
   const [attempted, setAttempted] = useState(0)
   const [marked, setMarked] = useState(0);
   const [popUp, setPopUp] = useState(false);

   useEffect(() => {
      let tempAttempted = 0
      let tempMarked = 0
      answers.map(answer => {
         if (answer.isMarked) {
            tempMarked += 1
         }
         if (answer.ResponseAnswer !== '') {
            tempAttempted += 1
         }
         setAttempted(tempAttempted)
         setMarked(tempMarked)
         setTotalQues(details.length)

      })

   }, [answers])

   return (
      <div className='mt-10 flex-1 flex flex-col'>
         <p className='font-semibold mb-1'>
            Total Questions: {totalQues}
         </p>
         <p className='font-semibold mb-1'>
            Attempted: {attempted}
         </p>
         <p className='font-semibold mb-1'>
            Marked for Review: {marked}
         </p>
         <PrimaryButton children='Submit Section' className='mt-auto mb-4 w-[300px] h-[60px] text-[21px]'
            onClick={() => setPopUp(true)}
         />

         {popUp && <Modal
            classname="w-1/2 mx-auto"
            handleClose={() => setPopUp(false)}
            title="Are you sure, you want to Submit the Section?"
            primaryBtn={{
               onClick: submitSection,
               text: "Submit",
               className: "bg-primaryDark"
            }} />}

      </div>
   )
}
