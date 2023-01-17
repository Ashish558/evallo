import React from 'react';
import starGold from "../../assets/icons/star-gold.png";
import starDark from "../../assets/icons/star-dark.png";
import starLight from "./../../assets/icons/star-light.png";

const TutorItem = ({ tutorName, rating, service, updatedAt }) => {

   const feedbackDate = new Date(updatedAt)
   const month = feedbackDate.toLocaleString('default', { month: 'long' })
   const date = feedbackDate.getDate()
   const year = feedbackDate.getFullYear()
   const dateStr = `${month} ${date}, ${year}`

   return (
      <div>
         <h2 className='text-[18px] text-black mx-0'>{tutorName}</h2>
         <h6 className='text-[#0671E0] text-[12px] mb-[6px]'>
            {service} tutoring at {dateStr}
         </h6>
         <div className="flex gap-[8px]">
            {/* <img src={starGold} alt="starGold" className='w-[21px]' />
            <img src={starGold} alt="starGold" className='w-[21px]' />
            <img src={starGold} alt="starGold" className='w-[21px]' />
            <img src={starGold} alt="starGold" className='w-[21px]' />
            <img src={starDark} alt="starDark" className='w-[21px]' /> */}
            {[...Array(5)].map((x, i) => (
               <img
                  src={rating - 1 < i ? starDark : starGold}
                  className="mr-1 cursor-pointer w-[21px] "
               // onClick={() => {
               //    // setData(prev => ({ ...prev, feedbackStars: i + 1 }));
               //    // setInputFeedback(i + 1)
               //    handleFeedbackSubmit(i + 1)
               // }}
               />
            ))}
         </div>
         <hr className='mt-[13px] mb-[17px]' />
      </div>
   )
}
export default TutorItem
