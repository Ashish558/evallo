import React, { useEffect, useRef, useState } from "react";
import "./Transition.css";
import "./calendar.css";
import '@fullcalendar/react/dist/vdom'
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import LeftIcon from "../../assets/icons/left-arrow.svg";
import nextIcon from "../../assets/icons/right-arrow.svg";

//  yearly 
import multiMonthPlugin from '@fullcalendar/multimonth'

export default function Calendar({
   view, persona, filteredEvents, events, handlePrevClick, handleNextClick, eventContent, getDayHeaders,
   handleDateClick, handleEventClick, calRef
}) {

   return (
      <FullCalendar
         slotLabelContent={(arg) => {
            return (
               <>
                  <div>{arg.text}</div>
                  <div className="blank-row" />
               </>
            );
         }}
         events={
            persona === "parent" || persona === "tutor"
               ? filteredEvents
               : events
         }
         height={700}
         dayMaxEventRows={true}
         stickyHeaderDates={true}
         stickyHeaderToolbar={true}
         eventClick={(info) => handleEventClick(info)}
         eventMaxStack={1}
         ref={calRef}
         plugins={[
            timeGridPlugin,
            timeGridWeek,
            interactionPlugin,
            dayGridPlugin,
            //  added just now
            multiMonthPlugin
         ]}
         firstDay={1}
         slotDuration={"00:60:00"}
         customButtons={{
            prevButton: {
               text: (
                  <span className="calendar-prevButton-custom flex">
                     <img className="w-9" src={LeftIcon} alt="arrow" />
                  </span>
               ),
               click: handlePrevClick,
            },
            nextButton: {
               text: (
                  <span className="calendar-prevButton-custom flex">
                     <img className="w-9" src={nextIcon} alt="arrow" />
                  </span>
               ),
               click: handleNextClick,
            },
         }}
         eventContent={eventContent}
         initialView={view}
         allDaySlot={false}
         headerToolbar={{
            start: "prevButton title nextButton",
            center: "",
            end: ""
            // end: "dayGridMonth,timeGridWeek"
         }}
         titleFormat={{
            day: '2-digit',
            month: "short",
            year: "numeric",
         }}
         expandRows={true}
         contentHeight={"100%"}
         dayHeaderFormat={{
            weekday: 'long',
            day: "numeric"
         }}
         dayHeaderContent={getDayHeaders}
         selectable={true}
         dateClick={handleDateClick}
         selectOverlap={false}
         defaultTimedEventDuration="01:00"
         showNonCurrentDates={false}
         slotLabelFormat={{ hour: '2-digit', minute: '2-digit', meridiem: 'short' }}
      />
   )
}
