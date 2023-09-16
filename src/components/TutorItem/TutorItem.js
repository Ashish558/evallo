import React from 'react';
import starGold from "../../assets/icons/star-gold.png";
import starDark from "../../assets/icons/star-dark.png";
import { useLazyGetSessionFeedbackQuery, useSubmitFeedbackMutation } from '../../app/services/session';
import { useState } from 'react';
import { useEffect } from 'react';

const TutorItem = ({ tutorName, rating, service, updatedAt, tutorId, studentId, _id, time }) => {
   console.log(time)
   const feedbackDate = new Date(updatedAt)
   const month = feedbackDate.toLocaleString('default', { month: 'short' })
   const date = feedbackDate.getDate()
   const year = feedbackDate.getFullYear()
   const dateStr = `${time?.start?.time}${time?.start?.timeType} on ${month} ${date}`
   const [inputFeedback, setInputFeedback] = useState(0)
   const [submitFeedback, submitFeedbackResp] = useSubmitFeedbackMutation();
   const [getSessionFeedback, getSessionFeedbackResp] = useLazyGetSessionFeedbackQuery();
   const [displayFeedback, setDisplayFeedback] = useState(true)
   const [loading, setLoading] = useState(true)

   const fetchFeedback = (isInitial) => {
      if (isInitial) {
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

   if (displayFeedback || loading) return <></>

   return (
      <div>
         <h2 className='text-base-20 text-[#517CA8] font-medium mx-0 mt-[19px]'>{tutorName}</h2>
         <h6 className='text-[#517CA8] text-base-17-5 mb-[6px]'>
            {service} tutoring at {dateStr}
         </h6>
         <div className="flex gap-[3px]">
            {[...Array(5)].map((x, i) => (
               <img alt="star"
                  src={inputFeedback - 1 < i ? starDark : starGold}
                  className="mr-1 cursor-pointer w-[21px] "
                  onClick={() => {
                     handleFeedbackSubmit(i + 1)
                  }}
               />
            ))}
         </div>
         {/* <hr className='mt-[13px] mb-[17px]' /> */}
      </div>
   )
}
export default TutorItem
