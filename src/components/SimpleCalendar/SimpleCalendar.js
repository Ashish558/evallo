import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./simpleCalendar.css";
import LeftIcon from '../../assets/calendar/left.svg'
import RightIcon from '../../assets/calendar/right.svg'

export default function SimpleCalendar({ currentDate, setCurrentDate, events }) {

   const changeDate = (e) => {
      setCurrentDate(e);
   };


   useEffect(() => {
      events.map(event => {
         const date = new Date(event.start);  // 2009-11-10
         const month = date.toLocaleString('default', { month: 'long' });
         let str = `${month} ${date.getDate()}, ${date.getFullYear()}`
         console.log(str);
         var element = document.querySelector(`[aria-label="${str}"]`);
         // console.log('element', element);
         if(element !== null){
            element.classList.add('calendar-dot')
         }
      })
   }, [events])
   
   return (
      <>
         <Calendar value={currentDate} onChange={changeDate}
            prevLabel={<img src={LeftIcon} />}
            nextLabel={<img src={RightIcon} />}
            formatShortWeekday={(locale, value) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][value.getDay()]
            }

         />
      </>
   );
}
