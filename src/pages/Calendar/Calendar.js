import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import momentOg from "moment";

import "./calendar.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import FullCalendar, { formatDate } from "@fullcalendar/react"; // must go before plugins
// import { Calendar } from '@fullcalendar/core';
import { toMoment } from '@fullcalendar/moment';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridWeek from "@fullcalendar/timegrid";

import LeftIcon from "../../assets/icons/left.svg";
import nextIcon from "../../assets/icons/right.svg";

import SimpleCalendar from "../../components/SimpleCalendar/SimpleCalendar";
import EventModal from "../Frames/EventModal/EventModal";
import InputSearch from "../../components/InputSearch/InputSearch";
import {
   useLazyGetSessionsQuery,
   useLazyGetTutorStudentsQuery,
   useLazyGetUsersByNameQuery,
} from "../../app/services/session";
import { convertDateToTimezone, convertTime12to24, formatAMPM, getBackground, getFormattedDate, getLocalTimeZone, getStartDate } from "../../utils/utils";
import InputSelect from "../../components/InputSelect/InputSelect";
// import styles from "./calendar.css";
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import { useLazyGetUserDetailQuery } from "../../app/services/users";

const days = ["S", "M", "T", "W", "T", "F", "S"];

const backgrounds = [
   '#51D294',
   '#C56DEE',
   '#6F7ADE',
   '#7DE94A',
   '#F6935A',
]
// CST - "America/Indiana/Indianapolis"
//EST "America/New_York"
//MST - "America/North_Dakota/Beulah"

// const timeZones = [
//    'local',
//    'UTC-05:00',
//    'UTC-06:00',
//    'UTC-07:00',
//    'UTC-08:00',
//    'AST',
//    'EST',
//    'CST',
//    'MST',
//    'PST',
//    'AKST',
//    'HST',
// ]
const timeZones = [
   'Asia/Kolkata',
   // 'America/New_York',
   'US/Alaska',
   'US/Central',
   'US/Eastern',
   'US/Hawaii',
   'US/Mountain',
   'US/Pacific',
]
export default function Calendar() {
   const calendarRef = useRef(null);
   // console.log(calendarRef.current)
   const [events, setEvents] = useState([]);
   const [filteredEvents, setFilteredEvents] = useState([])
   const { role: persona } = useSelector(state => state.user)

   // const [timeZones, setTimeZones] = useState(temptimeZones)
   const { id: sessionToEdit } = useParams()
   const [isEdited, setIsEdited] = useState(false)
   const [isEditable, setIsEditable] = useState(false)
   // console.log(sessionToEdit)
   const [associatedStudents, setAssociatedStudents] = useState([])
   const { id, timeZone: currentUserTImeZone } = useSelector(state => state.user)
   const time = formatAMPM(new Date)

   const exactTime = time.slice(0, time.indexOf(":")) + time.slice(time.indexOf("p"), time.length);
   const slides = document.getElementsByClassName('fc-timegrid-slot-label-cushion fc-scrollgrid-shrink-cushion')
   //  console.log(document.getElementsByClassName('fc-timegrid-slot-label-cushion fc-scrollgrid-shrink-cushion'));
   for (var i = 0; i < slides.length; i++) {
      const item = slides.item(i);
      // console.log(item.innerHTML);
      if (item.innerHTML === exactTime) {
         document.getElementById("calendarContainer").scrollTop = document.getElementById("calendarContainer").scrollHeight;
      }
   }

   const [eventModalActive, setEventModalActive] = useState(false);
   const [updateEventModalActive, setUpdateEventModalActive] = useState(false);
   const [defaultEventData, setDefaultEventData] = useState(null)

   const [fetchNames, namesResponse] = useLazyGetUsersByNameQuery();
   const [fetchUserSessions, fetchUserSessionsResponse] =
      useLazyGetSessionsQuery();
   const [fetchStudents, fetchStudentsResp] = useLazyGetTutorStudentsQuery();
   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()
   const { firstName, lastName, id: currentUserId } = useSelector(state => state.user)

   const [names, setNames] = useState([]);
   const [name, setName] = useState("");
   const [eventDetails, setEventDetails] = useState([]);

   const [students, setStudents] = useState([]);
   const [sessionToUpdate, setSessionToUpdate] = useState({});
   // const params = useParams()
   const [currentDate, setCurrentDate] = useState(new Date)
   const { isLoggedIn } = useSelector((state) => state.user);

   const [timeZone, setTimeZone] = useState('Asia/Kolkata')
   // console.log(moment.tz.zonesForCountry('US'))

   const [searchedUser, setSearchedUser] = useState({
      id: '',
      role: ''
   })

   const refetchSessions = () => {
      // console.log(searchedUser);
      console.log('persona', persona);
      if (persona === 'tutor') {
         console.log('shd run');
         fetchTutorSessions()
      } else {
         if (searchedUser.id === '') return
         fetchSessions(searchedUser.id, searchedUser.role)
      }
   }


   const fetchSessions = (id, role) => {
      // console.log(id)
      setSearchedUser({ id, role })
      const url = `/api/session/${role}/${id}`;
      // console.log(url)
      fetchUserSessions(url).then((res) => {
         // console.log('sessions', res.data.data);
         const tempEvents = res.data.data.session.map(session => {
            const time = session.time;
            const strtTime12HFormat = `${time.start.time} ${time.start.timeType}`;
            const startTime = convertTime12to24(
               `${time.start.time} ${time.start.timeType}`
            );
            const endTime = `${time.end.time} ${time.end.timeType}`;
            const startHours = parseInt(startTime.split(":")[0]);
            const startMinutes = parseInt(startTime.split(":")[1]);
            // const endHours = parseInt(endTime.split(":")[0]);
            // const endMinutes = parseInt(endTime.split(":")[1]);
            let startDate = new Date(session.date);
            const offset = startDate.getTimezoneOffset() * 60000
            if (offset > 0) {
               // startDate = startDate + offset
               startDate = new Date(startDate.getTime() + offset)
            }

            //  let startDate = new Date(session.date).toLocaleString('en-US', { timeZone: "Asia/Kolkata" })
            // let startDate = new Date(session.date).toUTCString()
            startHours !== NaN && startDate.setHours(startHours);
            startMinutes !== NaN && startDate.setMinutes(startMinutes);
            let updatedDate = new Date(new Date(
               startDate.toLocaleString('en-US', {
                  timeZone: session.timeZone,
               }),
            ))
            return {
               ...session,
               updatedDate
            }
         })
         // setEventDetails(res.data.data.session);
         setEventDetails(tempEvents)
         // console.log(res.data.data.session)
         let tempSession = res.data.data.session.map((session) => {
            const time = session.time;
            // console.log(session);
            const strtTime12HFormat = `${time.start.time} ${time.start.timeType}`;
            const startTime = convertTime12to24(
               `${time.start.time} ${time.start.timeType}`
            );

            const startHours = parseInt(startTime.split(":")[0]);
            const startMinutes = parseInt(startTime.split(":")[1]);

            //previous start date below
            // console.log('session date : ', session.date);
            let startDate = new Date(session.date)
            // let startDate = new Date(new Date(
            //    session.date.toLocaleString('en-US', {
            //       timeZone: "Asia/Kolkata"
            //    }),
            // ))
            const offset = startDate.getTimezoneOffset() * 60000
            if (offset > 0) {
               // startDate = startDate + offset
               startDate = new Date(startDate.getTime() + offset)
            }

            // console.log('userTimezoneOffset', offset );
            // console.log('START DATE PREV', startDate);

            // let startDate = new Date(session.date).toUTCString()
            startHours !== NaN && startDate.setHours(startHours);
            startMinutes !== NaN && startDate.setMinutes(startMinutes);
            // console.log('START DATE',  startDate);
            var userTimezoneOffset = startDate.getTimezoneOffset() * 60000;
            // console.log('userTimezoneOffset', userTimezoneOffset);
            getStartDate(startDate, userTimezoneOffset, session.timeZone)
            let up = getStartDate(startDate, userTimezoneOffset, session.timeZone)
            const startUtc = up.toUTCString()

            // console.log('START DATE', startDate.toDateString());
            // console.log('startDate', new Date(startDate.getTime() - userTimezoneOffset + 9 * 3600000))
            // console.log('startUtc', startUtc);
            // console.log('startUtc', startUtc);
            const dsttz = moment.tz(startDate, session.timeZone).format('zz')
            const dstdate = moment.tz(startDate, session.timeZone).format('YYYY-MM-DD HH:mm ZZ')
            // const dstdate = moment.tz(startDate, session.timeZone).format(moment.defaultFormat)

            // console.log('dsttz', dsttz)
            // console.log('dstdate', moment().utcOffset(dstdate)._offset)
            // console.log('START DATE UTC --', startUtc);

            const endTime12HFormat = `${time.end.time} ${time.end.timeType}`;
            const endTime = convertTime12to24(
               `${time.end.time} ${time.end.timeType}`
            );
            const endHours = parseInt(endTime.split(":")[0]);
            const endMinutes = parseInt(endTime.split(":")[1]);
            let endDate = new Date(session.date);
            endHours !== NaN && endDate.setHours(endHours);
            endMinutes !== NaN && endDate.setMinutes(endMinutes);

            const endDateUtc = getStartDate(endDate, userTimezoneOffset, session.timeZone)

            let eventObj = {
               id: session._id,
               title: role === 'tutor' ? session.studentName : session.tutorName,
               start: startUtc,
               endDate: endDateUtc,
               updatedDate: startUtc,
               updatedDateEnd: endDateUtc,
               sessionStatus: session.sessionStatus,
               description: `${strtTime12HFormat} - ${endTime12HFormat}`,
            };
            return eventObj;
         });
         const promiseState = async state => new Promise(resolve => {
            resolve(
               setEvents(tempSession)
            )
         })
         promiseState()
            .then(() => {
               parseEventDatesToTz()
            })

      });
   };

   useEffect(() => {
      // console.log(currentUserTImeZone);
      if (timeZones.includes(currentUserTImeZone)) {
         setTimeZone(currentUserTImeZone)
      }
   }, [currentUserTImeZone])

   useEffect(() => {
      if (persona == "admin" || persona === 'tutor') {
         setIsEditable(true)
      } else {
         setIsEditable(false)
      }
   }, [])

   useEffect(() => {
      if (persona == "student") {
         // console.log(persona);
         if (!currentUserId) return;
         fetchSessions(currentUserId, persona);
      }
   }, [persona]);

   useEffect(() => {
      if (persona == "parent") {
         getUserDetail({ id })
            .then(async (resp) => {
               console.log('response', resp.data.data);
               setStudents([])
               await resp.data.data.user.assiginedStudents.map((student, idx) => {
                  getUserDetail({ id: student })
                     .then(res => {
                        if (res.error) return
                        setStudents(prev => [...prev, {
                           _id: res.data.data?.user._id,
                           studentName: `${res.data.data?.user.firstName} ${res.data.data?.user.lastName}`,
                           selected: true
                        }])

                     })
               })

               let allsessions = []
               let allevents = []

               const fetch = async (cb) => {

                  await resp.data.data.user.assiginedStudents.map(async (student, idx) => {
                     setSearchedUser({ id, role: 'student' })
                     const url = `/api/session/student/${student}`;
                     await fetchUserSessions(url).then((res) => {
                        const tempEvents = res.data.data.session.map(session => {
                           const time = session.time;
                           const strtTime12HFormat = `${time.start.time} ${time.start.timeType}`;
                           const startTime = convertTime12to24(
                              `${time.start.time} ${time.start.timeType}`
                           );
                           const endTime = `${time.end.time} ${time.end.timeType}`;
                           const startHours = parseInt(startTime.split(":")[0]);
                           const startMinutes = parseInt(startTime.split(":")[1]);
                           // const endHours = parseInt(endTime.split(":")[0]);
                           // const endMinutes = parseInt(endTime.split(":")[1]);
                           let startDate = new Date(session.date);
                           const offset = startDate.getTimezoneOffset() * 60000
                           if (offset > 0) {
                              // startDate = startDate + offset
                              startDate = new Date(startDate.getTime() + offset)
                           }
                           // let startDate = new Date(session.date).toUTCString()
                           startHours !== NaN && startDate.setHours(startHours);
                           startMinutes !== NaN && startDate.setMinutes(startMinutes);
                           let updatedDate = new Date(new Date(
                              startDate.toLocaleString('en-US', {
                                 timeZone: session.timeZone,
                              }),
                           ))
                           return {
                              ...session,
                              updatedDate
                           }
                        })
                        allsessions.push(...tempEvents)
                        let tempSession = res.data.data.session.map((session) => {
                           const time = session.time;
                           // console.log(session);
                           const strtTime12HFormat = `${time.start.time} ${time.start.timeType}`;
                           const startTime = convertTime12to24(
                              `${time.start.time} ${time.start.timeType}`
                           );

                           const startHours = parseInt(startTime.split(":")[0]);
                           const startMinutes = parseInt(startTime.split(":")[1]);

                           let startDate = new Date(session.date)
                           // let startDate = new Date(new Date(
                           //    session.date.toLocaleString('en-US', {
                           //       timeZone: "Asia/Kolkata"
                           //    }),
                           // ))
                           const offset = startDate.getTimezoneOffset() * 60000
                           if (offset > 0) {
                              // startDate = startDate + offset
                              startDate = new Date(startDate.getTime() + offset)
                           }
                           // let startDate = new Date(session.date).toUTCString()
                           startHours !== NaN && startDate.setHours(startHours);
                           startMinutes !== NaN && startDate.setMinutes(startMinutes);

                           var userTimezoneOffset = startDate.getTimezoneOffset() * 60000;

                           getStartDate(startDate, userTimezoneOffset, session.timeZone)
                           let up = getStartDate(startDate, userTimezoneOffset, session.timeZone)
                           const startUtc = up.toUTCString()

                           // console.log('START DATE', startDate);
                           // console.log('START DATE UTC --', startUtc);

                           const endTime12HFormat = `${time.end.time} ${time.end.timeType}`;
                           const endTime = convertTime12to24(
                              `${time.end.time} ${time.end.timeType}`
                           );
                           const endHours = parseInt(endTime.split(":")[0]);
                           const endMinutes = parseInt(endTime.split(":")[1]);
                           let endDate = new Date(session.date);
                           endHours !== NaN && endDate.setHours(endHours);
                           endMinutes !== NaN && endDate.setMinutes(endMinutes);

                           const endDateUtc = getStartDate(endDate, userTimezoneOffset, session.timeZone)

                           // console.log(resp.data.data.user.assiginedStudents);

                           let eventObj = {
                              id: session._id,
                              title: session.tutorName,
                              start: startUtc,
                              endDate: endDateUtc,
                              updatedDate: startUtc,
                              updatedDateEnd: endDateUtc,
                              description: `${strtTime12HFormat} - ${endTime12HFormat}`,
                              sessionStatus: session.sessionStatus,
                              studentId: session.studentId,
                              background: getBackground(resp.data.data.user.assiginedStudents.length, idx),
                           };
                           return eventObj;
                        });
                        allevents.push(...tempSession)
                        if (idx === resp.data.data.user.assiginedStudents.length - 1) cb()
                        // parseEventDatesToTz()
                     });

                  })

               }
               fetch(() => {
                  setEventDetails(allsessions)
                  const promiseState = async state => new Promise(resolve => {
                     resolve(
                        setEvents(allevents)
                     )
                  })
                  promiseState()
                     .then(() => {
                        parseEventDatesToTz()
                     })
                  setEvents(allevents)
               })
            })
      }
   }, [persona])

   // console.log(students)

   useEffect(() => {
      if (calendarRef.current) {
         const prevBtn = document.getElementsByClassName(
            "calendar-prevButton-custom"
         )[0].parentElement;
         if (prevBtn) prevBtn.classList.add("calendar-prev-button");
         const nextBtn = document.getElementsByClassName(
            "calendar-nextButton-custom"
         )[0].parentElement;
         if (nextBtn) nextBtn.classList.add("calendar-prev-button");
      }
   }, []);

   const getDayHeaders = (arg) => {
      let text = arg.text.split(" ");
      return (
         <div
            className={`p-[10px] rounded-7 ${arg.isToday ? "bg-primary border" : ""
               }  `}
         >
            <p
               className={`${arg.isToday ? "text-primaryWhite-900" : ""
                  } text-sm font-semibold
                   ${arg.isPast ? "text-[#BEC2CE]" : arg.isFuture ? 'text-primary-60' : ''} `}
            >
               {days[arg.date.getDay()]}
            </p>
            <p
               className={`${arg.isToday ? "text-primaryWhite-900" : ""
                  } text-2xl font-bold font-inter
                   ${arg.isPast ? "text-[#BEC2CE]" : arg.isFuture ? 'text-primary-dark' : ''
                  }`}
            >
               {text[1]}
            </p>
         </div>
      );
   };

   const handlePrevClick = (arg) => {
      const calendarAPI = calendarRef?.current?.getApi();
      calendarAPI?.prev();
   };

   const handleNextClick = (arg) => {
      // console.log(arg)
      const calendarAPI = calendarRef?.current?.getApi();
      calendarAPI?.next();
   };
   const eventContent = (arg) => {

      const description = arg.event._def.extendedProps.description;
      let background = '#ebe7ff'
      let isCompleted = false
      if(arg.event._def.extendedProps.sessionStatus === 'Completed' ){
         isCompleted = true
      }

      return (
         <div className="p-0.5 h-full">
            <div className="bg- h-full p-2 rounded-lg" style={{ background: background }} >
               <p className={`text-primary font-semibold text-sm ${isCompleted ? 'line-through' : ''} `}>
                  {" "}
                  {arg.event._def.title}{" "}
               </p>
               {/* <p className='text-black opacity-60 text-xs'> {arg.timeText} </p> */}
               <p className="text-black opacity-60 text-xs">
                  {" "}
                  {description}{" "}
               </p>
            </div>
         </div>
      );
   };

   const handleDateClick = (arg) => {
      // console.log(arg)
      let date = new Date(arg.date)
      let currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0);
      // console.log(date - currentDate);
      // if (date - currentDate < 0) {
      //    alert('Cant set events on past date')
      //    return
      // } 

      if (persona === 'tutor') {
         setDefaultEventData({
            date: arg.date,
            tutorId: currentUserId,
            tutorName: `${firstName} ${lastName}`
         })
      } else {
         setDefaultEventData({ date: arg.date })
      }
      if (persona === "admin" || persona === "tutor") {
         setEventModalActive(true);
      }
      // console.log(arg)
      // setEvents([...events, {
      //    id: 2,
      //    start: arg.dateStr,
      //    title: 'QWerrt',
      //    description: 'QWerfgfgsrt',
      // }])
   };

   const handleDateSelect = (arg) => {
      // setEventModalActive(true)
      // const startDate = moment(arg.startStr);
      // const timeEnd = moment(arg.endStr);
      // const diff = timeEnd.diff(startDate);
      // const diffDuration = moment.duration(diff);
      // const minutes = diffDuration.minutes()
      // const hours = diffDuration.hours()
      // if (minutes === 0 && hours === 0) return
      // if (minutes === 30 && hours === 0) return
      // setEvents([...events, {
      //    id: 2,
      //    start: arg.startStr,
      //    end: arg.endStr,
      //    title: 'QWerrt',
      //    description: 'QWerfgfgsrt',
      // }])
   };

   useEffect(() => {
      if (name.length > 0) {
         fetchNames(name).then((res) => {
            // console.log(res.data.data.user)
            let tempData = res.data.data.user.map((user) => {
               return {
                  _id: user._id,
                  value: `${user.firstName} ${user.lastName}`,
                  role: user.role,
                  ...user,
               };
            });
            setNames(tempData);
         });
      }
   }, [name]);

   const fetchTutorSessions = () => {
      const userId = currentUserId
      if (persona === "tutor") {
         console.log('FETCHING', userId);
         fetchStudents(userId).then((res) => {
            setEventDetails(res.data.data.session);
            // console.log(res.data.data);
            let tempSession = res.data.data.session.map((session) => {
               const time = session.time;
               // console.log(session);
               const strtTime12HFormat = `${time.start.time} ${time.start.timeType}`;
               const startTime = convertTime12to24(
                  `${time.start.time} ${time.start.timeType}`
               );
               const startHours = parseInt(startTime.split(":")[0]);
               const startMinutes = parseInt(startTime.split(":")[1]);
               let startDate = new Date(session.date)
               // let startDate = new Date(new Date(
               //    session.date.toLocaleString('en-US', {
               //       timeZone: "Asia/Kolkata"
               //    }),
               // ))
               const offset = startDate.getTimezoneOffset() * 60000
               if (offset > 0) {
                  // startDate = startDate + offset
                  startDate = new Date(startDate.getTime() + offset)
               }
               // console.log('SESSION DATE', session.date);
               // console.log('START DATE', startDate);
               // let startDate = new Date(session.date).toLocaleString('en-US', { timeZone })
               // let startDate = new Date(session.date).toUTCString()
               startHours !== NaN && startDate.setHours(startHours);
               startMinutes !== NaN && startDate.setMinutes(startMinutes);
               var userTimezoneOffset = startDate.getTimezoneOffset() * 60000;
               getStartDate(startDate, userTimezoneOffset, session.timeZone)
               let up = getStartDate(startDate, userTimezoneOffset, session.timeZone)
               const startUtc = up.toUTCString()
               // console.log('START DATE', startDate);
               // console.log('START DATE UTC --', startUtc);
               const endTime12HFormat = `${time.end.time} ${time.end.timeType}`;
               const endTime = convertTime12to24(
                  `${time.end.time} ${time.end.timeType}`
               );
               const endHours = parseInt(endTime.split(":")[0]);
               const endMinutes = parseInt(endTime.split(":")[1]);
               let endDate = new Date(session.date);
               endHours !== NaN && endDate.setHours(endHours);
               endMinutes !== NaN && endDate.setMinutes(endMinutes);
               const endDateUtc = getStartDate(endDate, userTimezoneOffset, session.timeZone)
               let eventObj = {
                  id: session._id,
                  title: session.studentName,
                  start: startUtc,
                  endDate: endDateUtc,
                  updatedDate: startUtc,
                  updatedDateEnd: endDateUtc,
                  sessionStatus: session.sessionStatus,
                  studentId: session.studentId,
                  description: `${strtTime12HFormat} - ${endTime12HFormat}`,
               };
               return eventObj;
            });

            const promiseState = async state => new Promise(resolve => {
               resolve(
                  setEvents(tempSession)
               )
            })
            promiseState()
               .then(() => {
                  parseEventDatesToTz()
               })

            const arrayUniqueByKey = [
               ...new Map(
                  res.data.data.session.map((item) => [
                     item["studentId"],
                     item,
                  ])
               ).values(),
            ];
            // console.log(arrayUniqueByKey);

            let tempstudents = arrayUniqueByKey.map((item) => {
               return {
                  _id: item.studentId,
                  studentName: item.studentName,
                  selected: true
               };
            });
            console.log('uniq', arrayUniqueByKey);
            setStudents(tempstudents);
         });
      }
   }
   useEffect(() => {
      fetchTutorSessions()
   }, [persona]);

   const handleEventClick = (info) => {
      const session = eventDetails.find(
         (e) => e._id === info.event._def.publicId
      );
      if (persona === "admin" || persona === "tutor") {
         setUpdateEventModalActive(true);
         setSessionToUpdate(session);
      } else {
         setUpdateEventModalActive(true);
         setSessionToUpdate(session);
      }
   };

   useEffect(() => {
      if (!sessionToEdit) return
      if (eventDetails.length === 0) return
      if (isEdited === true) return

      setIsEdited(true)
      const session = eventDetails.find(
         (e) => e._id === sessionToEdit
      );
      // console.log(session);
      if (persona === "admin" || persona === "tutor") {
         setUpdateEventModalActive(true);
         setSessionToUpdate(session);
      }
   }, [sessionToEdit, eventDetails])

   useEffect(() => {
      // console.log(calendarRef.current.getApi())
      calendarRef.current.getApi().gotoDate(currentDate)
      // calendarRef.current.gotoDate(currentDate)
   }, [currentDate])

   moment.tz.setDefault('Etc/UTC')

   const parseEventDatesToTz = () => {
      setEvents(prev => {
         return prev.map(item => {
            let updatedDate = new Date(item.updatedDate).toLocaleString('en-US', { timeZone })
            let updatedDateEnd = new Date(item.updatedDateEnd).toLocaleString('en-US', { timeZone })
            // console.log('item', item)
            // console.log('updatedDate', updatedDate)
            // console.log('DATE UPDATED ==', updatedDate)
            // console.log('timeZone', timeZone)
            let fmt = 'DD/MM/YYYY, h:mm:ss a'
            var m = moment.tz(updatedDate, fmt, timeZone);
            m.utc();
            var s = m.format(fmt)  // result:
            // console.log('moment', moment(s).tz(timeZone).format(fmt));

            return {
               ...item,
               start: new Date(updatedDate),
               // description: `${formatAMPM(startarg)}-${formatAMPM(endarg)}`
               description: `${formatAMPM(new Date(updatedDate))}-${formatAMPM(new Date(updatedDateEnd))}`
            }
         })
      })
   }

   useEffect(() => {
      getUserDetail({ id: localStorage.getItem("userId") })
         .then(res => setTimeZone(res.data.data.userdetails.timeZone))
   }, [])

   useEffect(() => {
      if (calendarRef.current === null) return
      if (calendarRef.current === undefined) return
      parseEventDatesToTz()

      // document.getElementById('calendarContainer').refetchEvents()
      // calendarRef.refetchEvents()
      // calendarRef.current.gotoDate('')
      // calendarRef.current.setOption('timeZone', timeZone)
   }, [timeZone, events.length])


   const handleStudentChange = student => {
      let tempStudents = students.map(item => {
         if (item._id === student._id) {
            return { ...item, selected: true }
         } else {
            return { ...item, selected: false }
         }
      })
      setStudents(tempStudents)
   }

   useEffect(() => {
      if (students.length === 0) return
      if (events.length === 0) return
      console.log('students', students);
      let selectedStudents = students.filter(item => item.selected === true).map(item => item._id)
      let filtered = events.filter(event => selectedStudents.includes(event.studentId))
      // console.log('filtered', filtered);
      // console.log('filtered', filtered);
      setFilteredEvents(filtered)
   }, [events, students])

   // console.log('filteredEvents', filteredEvents);
   // console.log('events', events);
   // console.log('eventDetails', eventDetails);
   // console.log('students', students);

   return (
      <>
         <div className="lg:ml-pageLeft bg-lightWhite min-h-screen">
            <div className="py-14 pt-10 pb-2 pl-5 calendar flex">
               <div className="p-10 pt-10 pl-0 pr-0 w-[280px] mr-[10px]">
                  <div className="w-[280px]" >
                     <SimpleCalendar
                        events={persona === 'parent' || persona === 'tutor' ? filteredEvents : events}
                        currentDate={currentDate} setCurrentDate={setCurrentDate} />
                  </div>
                  {persona === "parent" || persona === "tutor" ? (
                     <div className="mt-10 pr-4">
                        <p className="text-primaryDark text-21 font-semibold mb-8 ml-2">
                           {" "}
                           Student Name{" "}
                        </p>
                        <div>
                           {students.map((student, idx) => {
                              return (
                                 <div
                                    key={student.studentId}
                                    className={`p-4 mb-4 rounded-10 flex justify-between items-center  bg-white ${student.selected ? 'border border-[#c6c6c6] shadow-md' : 'border'} `}
                                    onClick={() => handleStudentChange(student)}
                                 >
                                    <p className={` ${student.selected ? 'font-medium' : ''} `}>
                                       {student.studentName}
                                    </p>
                                    <div
                                       className="student-circle"
                                       style={{
                                          backgroundColor: '#ebe7ff'
                                          //  getBackground(students.length, idx),

                                       }}
                                    ></div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  ) : persona === "student" ? (
                     <></>
                  ) : (
                     <div>
                        <InputSearch
                           // IconRight={SearchIcon}
                           placeholder="Type Name"
                           parentClassName="w-full mr-4 mt-5"
                           inputContainerClassName="bg-white shadow"
                           type="select"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           optionData={names}
                           onOptionClick={(item) => {
                              setName(item.value);
                              fetchSessions(item._id, item.role);
                           }}
                        />
                     </div>
                  )}
               </div>
               <div className="flex-1 w-4/5 relative" id="calendarContainer">
                  <FullCalendar
                     events={persona === 'parent' || persona === 'tutor' ? filteredEvents : events}
                     // timeZone='UTC'
                     // timeZone={timeZone === getLocalTimeZone() ? 'local' : timeZone}
                     // timeZone={timeZone === 'IST' ? 'local' : timeZone }
                     // businessHours= {{          // for starting calendar from 06:00 am
                     //    startTime: '06:00', // a start time (10am in this example)
                     //    endTime: '05:00', // an end time (6pm in this example)
                     //  }}
                     // slotMinTime='06:00:00'
                     // slotMaxTime='23:00:00'
                     // slotDuration='24:00:00'
                     stickyHeaderDates={true}
                     stickyHeaderToolbar={true}
                     eventClick={(info) => handleEventClick(info)}
                     eventMaxStack={1}
                     ref={calendarRef}
                     plugins={[
                        timeGridPlugin,
                        timeGridWeek,
                        interactionPlugin,
                        // momentTimezonePlugin
                     ]}
                     firstDay={1}
                     customButtons={{
                        prevButton: {
                           text: (
                              <span className="calendar-prevButton-custom" >
                                 <img src={LeftIcon} />
                              </span>
                           ),
                           click: handlePrevClick,
                        },
                        nextButton: {
                           text: (
                              <span className="calendar-nextButton-custom">
                                 <img src={nextIcon} />
                              </span>
                           ),
                           click: handleNextClick,
                        },
                     }}
                     eventContent={eventContent}
                     initialView="timeGridWeek"
                     allDaySlot={false}
                     headerToolbar={{
                        start: "prevButton title nextButton",
                        end: "",
                     }}
                     titleFormat={{
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                     }}
                     expandRows={true}
                     contentHeight={"100%"}
                     // slotMinTime={"06:00:00"}
                     // slotMaxTime={"30:00:00"}
                     dayHeaderFormat={{
                        day: "2-digit",
                        month: "narrow",
                     }}
                     dayHeaderContent={getDayHeaders}
                     selectable={true}
                     // select={handleDateClick}
                     dateClick={handleDateClick}
                     select={handleDateSelect}
                     // titleFormat={{
                     //    month: ''
                     // }}
                     selectOverlap={false}
                     defaultTimedEventDuration="01:00"
                  />
                  <div className="" style={{ position: "absolute", top: '00px', right: '40px' }}>
                     <InputSelect value={timeZone == 'local' ? getLocalTimeZone() : timeZone.substring(0, 20)}
                        //  optionData={['local', 'America/New_York']}
                        // optionData={['Asia/Calcutta', ...moment.tz.zonesForCountry('US')]}
                        // optionData={['Asia/Calcutta', ...moment.tz.zonesForCountry('US')]}
                        optionData={timeZones}
                        onChange={val => setTimeZone(val)}
                        parentClassName='w-[250px]'
                        inputContainerClassName='text-primaryDark font-bold text-'
                     />
                  </div>
               </div>
            </div>
         </div>
         {eventModalActive && (
            <EventModal
               isEditable={isEditable}
               defaultEventData={defaultEventData}
               setEventModalActive={setEventModalActive}
               persona={persona}
               refetchSessions={refetchSessions}
            />
         )}
         {updateEventModalActive && (
            <EventModal
               isEditable={isEditable}
               setEventModalActive={setUpdateEventModalActive}
               persona={persona}
               isUpdating={true}
               sessionToUpdate={sessionToUpdate}
               refetchSessions={refetchSessions}
            />
         )}
      </>
   );
}
