import React from 'react'
import { useNavigate } from 'react-router-dom'
import calendar from '../../assets/images/uiw_date.png'

export default function TutorSchedule({ service, date, studentName, time, timeZone, session, _id, handleLinkClick }) {

   const startTime = time.start
   const endTime = time.end
   let startDate = new Date(date)
   let dateStr = `${startDate.getDate()}  ${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getFullYear()}`

   const navigate = useNavigate()
   const handleEdit = () => {
      navigate(`/calendar/edit/${_id}`)
   }

   return <div className='bg-[#F5F8FA] shadow-[0px_0px_2.6px_0px_rgba(0,0,0,0.25)]'>
      <div className='flex justify-between items-center rounded-[5.333px]   py-[20px] px-[43px]'>
         <div>
            <p className='text-[#24A3D9] text-xl font-medium'>{studentName}</p>
            <p className=' text-[#26435F]'>{service}</p>
         </div>
         <div>
            <div className='flex items-center'>
               <div><img width="20px" src={calendar} alt="" /></div>
               <p className='text-[#517CA8] ml-3'>{dateStr}</p>
            </div>

            <p className=' font-bold text-[#517CA8] mt-1'>
               {startTime.time} {startTime.timeType} {'-'} {endTime.time} {endTime.timeType} ({timeZone})
            </p>
         </div>
         <div>
            <div>
               <button className='bg-[#FFA28D]   rounded-[6px] px-3 py-[10px] text-white' onClick={() => handleLinkClick(session)}>
                  Meeting Link
               </button>
            </div>
            <div className='mt-[10px]'>
               <button className='bg-[#667085]   rounded-[6px] px-4 py-[10px] text-white' onClick={handleEdit}>
                  Edit Session
               </button>
            </div>
         </div>
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
