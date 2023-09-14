import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./simpleCalendar.css";
import LeftIcon from '../../assets/calendar/left.svg'
import RightIcon from '../../assets/calendar/right.svg'
import InputSearch from "../InputSearch/InputSearch";
import upRed from '../../assets/icons/up-red.svg'
import downBlue from '../../assets/icons/down-blue.svg'

export default function SimpleCalendar({ currentDate, setCurrentDate, events }) {

   const changeDate = (e) => {
      setCurrentDate(e);
   };


   useEffect(() => {
      const els = document.querySelectorAll('.calendar-dot')
      // console.log(els);
      if (els) {
         els.forEach(el => {
            el.classList.remove('calendar-dot')
         })
      }
      events.map(event => {
         const date = new Date(event.start);  // 2009-11-10
         const month = date.toLocaleString('default', { month: 'long' });
         let str = `${month} ${date.getDate()}, ${date.getFullYear()}`
         // console.log(str);
         var element = document.querySelector(`[aria-label="${str}"]`);
         // console.log('element', element);
         if (element !== null) {
            element.classList.add('calendar-dot')
         }
      })
   }, [events.length])

   return (
      <>
         <Calendar value={currentDate} onChange={changeDate}
            prevLabel={<img src={LeftIcon} />}
            nextLabel={<img src={RightIcon} />}
            formatShortWeekday={(locale, value) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][value.getDay()]
            }

         />
         <InputSearch

            value=""
            IconRight={true}
            placeholderClass="text-base-17-5 text-[#667085]"


            parentClassName="w-full mr-4"
            labelClassname="ml-2 mb-0.5"
            inputContainerClassName="px-5 py-3.5 text-sm bg-white border-0 rounded-[7.5px]"
            inputClassName="text-base-17-5 bg-transparent"
            placeholder="Search User"

         />

         <div className="px-[17px] py-[21px] bg-[rgba(36,163,217,0.20)] flex justify-between rounded-5 mt-[30px]">
            <p className="text-xl text-[#24A3D9] font-semibold">{`{Associated User 1}`}</p>
            <img className="inline-block" src={downBlue} alt="" srcset="" />
         </div>
         <div className="mt-[30px] bg-white ">
            <div className="px-[17px] py-[21px] bg-[rgba(255,162,141,0.20)] flex justify-between rounded-tr-5 rounded-tl-5">
               <p className="text-xl text-[#FFA28D] font-semibold">{`{Associated User 2}`}</p>
               <img className="inline-block" src={upRed} alt="" srcset="" />

            </div>
            <div className="p-[17px] mb-5 rounded-br-5 rounded-bl-5">
               <p className="text-xl text-[#26435F] font-medium">{`{Associated Heading}`}</p>
               <p className="text-[#7C98B6] text-[17.5px] mt-3">{`{Associated Heading}`}</p>
               <p className="text-xl text-[#38C980] font-medium mt-8">Hours Completed</p>
               <p className="text-[#38C980]  text-[25px] mt-2">1</p>
               <p className="text-xl text-[#FF7979] font-medium mt-8">Hours Missed</p>
               <p className="text-[#FF7979] text-[25px] mt-2">0</p>
               <p className="text-xl text-[#FFCE84] font-medium mt-8">Hours Canceled</p>
               <p className="text-[#FFCE84] text-[25px] mt-2">0</p>
               <p className="text-xl text-[#7C98B6] font-medium mt-8">Hours Scheduled</p>
               <p className="text-[#7C98B6] text-[25px] mt-2">0</p>

            </div>
         </div>
      </>
   );
}
