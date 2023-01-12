import React from 'react'

import StarIcon from "../../../../assets/form/star.svg";
import StarActiveIcon from "../../../../assets/form/starActive.svg";

export default function Feedback({ studentName, service, rating, updatedAt, studentId }) {

   const feedbackDate = new Date(updatedAt)
   const month = feedbackDate.toLocaleString('default', { month: 'long' })
   const date = feedbackDate.getDate()
   const year = feedbackDate.getFullYear()
   const dateStr = `${month} ${date}, ${year}`
   // console.log(month))
   return (
      <div className='px-2 py-2 flex-1'>
         <div className='flex justify-between'>
            <p className='opacity-60 font-semibold text-lg'>
               {studentName}
            </p>
            <p className='opacity-60'>
               {dateStr}
            </p>
         </div>
         <div className='flex justify-between items-end mt-3.5'>
            <p className='opacity-60'>
               {service}
            </p>
            <div className='flex'>
               {[...Array(5)].map((x, i) => (
                  <img
                     src={rating - 1 < i ? StarIcon : StarActiveIcon}
                     className="mr-2"
                  />
               ))}
            </div>
         </div>
      </div>
   )
}
