import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function TutorSchedule({ service, date, studentName, time, timeZone, session, _id, handleLinkClick }) {

   const startTime = time.start
   const endTime = time.end
   let startDate = new Date(date)
   let dateStr = `${startDate.getDate()}  ${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getFullYear()}`

   const navigate = useNavigate()
   const handleEdit = () => {
      navigate(`/calendar/edit/${_id}`)
   }

   return <div className='bg-[#D9D9D9]/20 '>
      <div className='flex justify-between items-center rounded-[15px] py-[15px] px-[43px]'>
         <p className='text-primary text-2xl font-bold'> {service} </p>
         <p className='text-sm font-semibold'> {dateStr} </p>
         <button className='bg-[#DFDFDF]  font-semibold text-sm rounded-[6px] px-4 py-[10px] text-black' onClick={handleEdit} >
            Edit Session
         </button>
      </div>
      <div className='flex justify-between items-center rounded-[15px] py-[15px] px-[43px]'>
         <p> With {studentName} </p>

         <p className='text-sm font-semibold'>
            {startTime.time} {startTime.timeType} {'-'} {endTime.time} {endTime.timeType} ({timeZone})
         </p>
         <button className='bg-primaryOrange font-semibold text-sm rounded-[6px] px-4 py-[10px] text-white' onClick={() => handleLinkClick(session)} >
            Meeting Link
         </button>
      </div>
   </div>


//     return <><div className='flex flex-col'>
//    <p className='text-primary text-2xl font-bold mb-4'> {service} </p>
//    <p> With {studentName} </p>
// </div>
// <div className='flex flex-col justify-center'>
//    <p className='text-sm font-semibold mb-7'> {dateStr} </p>
//    <p className='text-sm font-semibold'>
//       {startTime.time} {startTime.timeType} {'-'} {endTime.time} {endTime.timeType} ({timeZone})
//    </p>
// </div>
// <div className='flex flex-col justify-center'>
//    <button className='bg-[#DFDFDF]  font-semibold text-sm rounded-[6px] px-4 py-[10px] text-black mb-[7px]' onClick={handleEdit} >
//       Edit Session
//    </button>
//    <button className='bg-primaryOrange font-semibold text-sm rounded-[6px] px-4 py-[10px] text-white' onClick={() => handleLinkClick(session)} >
//       Meeting Link
//    </button>
// </div> </>
}
