import React from 'react';
import starGold from "../../assets/icons/star-gold.png";
import starDark from "../../assets/icons/star-dark.png";
import { useLazyGetSessionFeedbackQuery, useSubmitFeedbackMutation } from '../../app/services/session';
import { useState } from 'react';
import { useEffect } from 'react';

const TutorItem = ({ tutorName, rating, service, updatedAt, tutorId, studentId, _id }) => {

   const feedbackDate = new Date(updatedAt)
   const month = feedbackDate.toLocaleString('default', { month: 'long' })
   const date = feedbackDate.getDate()
   const year = feedbackDate.getFullYear()
   const dateStr = `${month} ${date}, ${year}`
   const [inputFeedback, setInputFeedback] = useState(0)
   const [submitFeedback, submitFeedbackResp] = useSubmitFeedbackMutation();
   const [getSessionFeedback, getSessionFeedbackResp] = useLazyGetSessionFeedbackQuery();
   const [displayFeedback, setDisplayFeedback] = useState(true)
   const [loading, setLoading] = useState(true)

   const fetchFeedback = (isInitial) => {
      if(isInitial){
         setLoading(true)
      }
      getSessionFeedback(_id)
         .then(res => {
            setLoading(false)
            if (res.error) {
               setInputFeedback(0)
               return console.log(res.error);
            }
            if (res.data.data.feedback.rating > 0 && isInitial) {
               setDisplayFeedback(false)
            }
            setInputFeedback(res.data.data.feedback.rating)
         })
   }
   useEffect(() => {
      fetchFeedback(true)
   }, [])

   const handleFeedbackSubmit = (rating) => {
      const body = {
         tutorId: tutorId,
         studentId: studentId,
         sessionId: _id,
         rating: rating,
      }
      submitFeedback(body)
         .then(res => {
            if (res.error) {
               return console.log(res.error);
            }
            fetchFeedback()
         })
   }

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         if (inputFeedback > 0) setDisplayFeedback(false)
      }, 5000);
      return () => clearTimeout(timeoutId)
   }, [inputFeedback])

   if (!displayFeedback || loading) return <></>

   return (
      <div>
         <h2 className='text-[18px] text-black mx-0'>{tutorName}</h2>
         <h6 className='text-[#0671E0] text-[12px] mb-[6px]'>
            {service} tutoring at {dateStr}
         </h6>
         <div className="flex gap-[8px]">
            {[...Array(5)].map((x, i) => (
               <img
                  src={inputFeedback - 1 < i ? starDark : starGold}
                  className="mr-1 cursor-pointer w-[21px] "
                  onClick={() => {
                     handleFeedbackSubmit(i + 1)
                  }}
               />
            ))}
         </div>
         <hr className='mt-[13px] mb-[17px]' />
      </div>
   )
}
export default TutorItem
