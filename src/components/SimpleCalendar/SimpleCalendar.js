import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./simpleCalendar.css";
import LeftIcon from '../../assets/calendar/left.svg'
import RightIcon from '../../assets/calendar/right.svg'

export default function SimpleCalendar({ currentDate, setCurrentDate, events }) {

   const changeDate = (e) => {
      setCurrentDate(e);
   };

   console.log('events', events);
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
