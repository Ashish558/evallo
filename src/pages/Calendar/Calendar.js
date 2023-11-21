import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import "./Transition.css";
import "./calendar.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import downIcon from "../../assets/icons/down-pink.svg";
import upIcon from "../../assets/icons/up-blue.svg";
import "@fullcalendar/react/dist/vdom";
// import FullCalendar from "@fullcalendar/react";
import { Calendar } from "@fullcalendar/core"; // must go before plugins
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridWeek from "@fullcalendar/timegrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import up_triangle from "../../assets/icons/Group 32064up triangle.svg";
import down_triangle from "../../assets/icons/Group 31479down.svg";
import downArrow from "../../assets/icons/arrow-down-red.svg";
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
import SimpleCalendar from "../../components/SimpleCalendar/SimpleCalendar";
import EventModal from "../Frames/EventModal/EventModal";
import InputSearch from "../../components/InputSearch/InputSearch";
import {
  useLazyGetSessionsQuery,
  useLazyGetTutorStudentsQuery,
  useLazyGetUsersByNameQuery,
} from "../../app/services/session";
import {
  convertDateToTimezone,
  convertTime12to24,
  formatAMPM,
  getBackground,
  getFormattedDate,
  getFullTimeZone,
  getLocalTimeZone,
  getStartDate,
  getToTimezone,
} from "../../utils/utils";
import InputSelect from "../../components/InputSelect/InputSelect";
// import styles from "./calendar.css";
import { useLazyGetUserDetailQuery } from "../../app/services/users";
import { useLazyGetCalenderInsightQuery } from "../../app/services/admin";
import downBlue from "../../assets/icons/down-blue.svg";
import FullCalendar from "./FullCalendar";
const days = ["S", "M", "T", "W", "T", "F", "S"];

const backgrounds = ["#51D294", "#C56DEE", "#6F7ADE", "#7DE94A", "#F6935A"];

const timeZones = [
  // "IST",
  "Asia/Kolkata",
  // 'America/New_York',
  "US/Alaska",
  "US/Central",
  "US/Eastern",
  "US/Hawaii",
  "US/Mountain",
  "US/Pacific",
];
const timeZones2 = ["IST", "AKST", "CST", "EST", "HST", "MST", "PST"];

export default function CalendarPage() {
  const calendarWeekRef = useRef(null);
  const calendarMonthRef = useRef(null);
  const calendarYearlyRef = useRef(null);
  // //////console.log(calendarWeekRef.current)
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { role: persona } = useSelector((state) => state.user);
  const userDetail = useSelector((state) => state.user);
  const accordionRefs = useRef([]);
  const accordionImgRefs = useRef([]);
  const accordionRefs2 = useRef([]);
  const accordionImgRefs2 = useRef([]);
  const { id: sessionToEdit } = useParams();
  const [isEdited, setIsEdited] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  // //////console.log(sessionToEdit)
  const [associatedStudents, setAssociatedStudents] = useState([]);
  const { id, timeZone: timeZoneUser } = useSelector((state) => state.user);

  const [currentUserTImeZone, setcurrentUserTImeZone] = useState("");

  const time = formatAMPM(new Date());
  const exactTime =
    time.slice(0, time.indexOf(":")) +
    time.slice(time.indexOf("p"), time.length);
  const slides = document.getElementsByClassName(
    "fc-timegrid-slot-label-cushion fc-scrollgrid-shrink-cushion"
  );
  //  //////console.log(document.getElementsByClassName('fc-timegrid-slot-label-cushion fc-scrollgrid-shrink-cushion'));
  for (var i = 0; i < slides.length; i++) {
    const item = slides.item(i);
    // //////console.log(item.innerHTML);
    if (item.innerHTML === exactTime) {
      document.getElementById("calendarContainer").scrollTop =
        document.getElementById("calendarContainer").scrollHeight;
    }
  }

  const [eventModalActive, setEventModalActive] = useState(false);
  const [updateEventModalActive, setUpdateEventModalActive] = useState(false);
  const [defaultEventData, setDefaultEventData] = useState(null);

  const [fetchNames, namesResponse] = useLazyGetUsersByNameQuery();
  const [fetchUserSessions, fetchUserSessionsResponse] =
    useLazyGetSessionsQuery();
  const [fetchStudents, fetchStudentsResp] = useLazyGetTutorStudentsQuery();
  const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery();
  const {
    firstName,
    lastName,
    id: currentUserId,
  } = useSelector((state) => state.user);
  useEffect(() => {
    try {
      //////console.log(userDetail)
      let res = fetchStudents(`${userDetail.id}`).then((res) => {});
    } catch (e) {
      //////console.log(e)
    }
  }, []);
  const [names, setNames] = useState([]);
  const [name, setName] = useState("");
  const [eventDetails, setEventDetails] = useState([]);
  const { organization } = useSelector((state) => state.organization);
  const [students, setStudents] = useState([]);
  const [sessionToUpdate, setSessionToUpdate] = useState({});
  // const params = useParams()
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isLoggedIn } = useSelector((state) => state.user);
  const [getCalenderInsight, getCalenderInsightStatus] =
    useLazyGetCalenderInsightQuery();
  const [insightData, setInsightData] = useState({});
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [newTimeZone, setnewTimeZone] = useState("IST");
  // //////console.log(moment.tz.zonesForCountry('US'))
  const [intialView, setInitialView] = useState("dayGridMonth");
  const [tutors, setTutors] = useState([]);
  const [alldetails, setAllDetails] = useState([]);
  const [showTutorDetails, setShowTutorDetails] = useState({});
  const [searchedUser, setSearchedUser] = useState({
    id: "",
    role: "",
  });
  const [activeView, setActiveView] = useState("Year");

  const refetchSessions = () => {
    // //////console.log(searchedUser);
    if (persona === "tutor") {
      fetchTutorSessions();
    } else {
      if (searchedUser.id === "") return;
      fetchSessions(searchedUser.id, searchedUser.role);
    }
  };

  useEffect(() => {
    if (
      !timeZones?.includes(timeZoneUser) &&
      organization &&
      organization.settings &&
      organization.settings.timeZone
    )
      setcurrentUserTImeZone(organization.settings.timeZone);
  }, [organization]);

  useEffect(() => {
    if (timeZones?.includes(timeZoneUser)) setcurrentUserTImeZone(timeZoneUser);
  }, [timeZoneUser]);

  // console.log(moment.tz.names())
  // const regex = /east/i;
  // const eastStrings = c.filter(str => regex.test(str));
  // console.log(eastStrings)

  const fetchSessions = (id, role) => {
    // //////console.log(id)
    setSearchedUser({ id, role });
    const url = `/api/session/${role}/${id}`;
    // //////console.log(url)
    fetchUserSessions(url).then((res) => {
      if (!res?.data?.data) return;
      // console.log('response---', res.data);
      const tempEvents = res.data.data.session.map((session) => {
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
        const offset = startDate.getTimezoneOffset() * 60000;
        if (offset > 0) {
          // startDate = startDate + offset
          startDate = new Date(startDate.getTime() + offset);
        }

        //  let startDate = new Date(session.date).toLocaleString('en-US', { timeZone: "Asia/Kolkata" })
        // let startDate = new Date(session.date).toUTCString()
        startHours !== NaN && startDate.setHours(startHours);
        startMinutes !== NaN && startDate.setMinutes(startMinutes);
        // console.log('offset----', offset);
        let tz = getFullTimeZone(session.timeZone);
        // console.log('tz---', tz);

        let updatedDate = new Date(
          new Date(
            startDate.toLocaleString("en-US", {
              timeZone: tz,
            })
          )
        );
        // console.log('session----', session);
        return {
          ...session,
          updatedDate,
        };
      });
      // setEventDetails(res.data.data.session);
      setEventDetails(tempEvents);
      //////console.log("in fetch")
      // //////console.log(res.data.data.session)
      let tempSession = res.data.data.session.map((session) => {
        let tempobj = alldetails;
        tempobj.push(session);
        setAllDetails(tempobj);
        //////console.log("alldetails", alldetails)
        let temparray = tutors;
        temparray.push(session.tutorId);
        setTutors(temparray);

        const time = session.time;
        // console.log("admin parent", session);
        const strtTime12HFormat = `${time.start.time} ${time.start.timeType}`;
        const startTime = convertTime12to24(
          `${time.start.time} ${time.start.timeType}`
        );

        const startHours = parseInt(startTime.split(":")[0]);
        const startMinutes = parseInt(startTime.split(":")[1]);

        //previous start date below
        // //////console.log('session date : ', session.date);
        let startDate = new Date(session.date);
        // let startDate = new Date(new Date(
        //    session.date.toLocaleString('en-US', {
        //       timeZone: "Asia/Kolkata"
        //    }),
        // ))
        const offset = startDate.getTimezoneOffset() * 60000;
        if (offset > 0) {
          // startDate = startDate + offset
          startDate = new Date(startDate.getTime() + offset);
        }

        // //////console.log('userTimezoneOffset', offset );
        // //////console.log('START DATE PREV', startDate);

        // let startDate = new Date(session.date).toUTCString()
        startHours !== NaN && startDate.setHours(startHours);
        startMinutes !== NaN && startDate.setMinutes(startMinutes);
        // //////console.log('START DATE',  startDate);
        var userTimezoneOffset = startDate.getTimezoneOffset() * 60000;
        const timezone = session.timeZone; // Example: Eastern Time (ET)

        // Get the timezone's offset from UTC in minutes
        const offsetInMinutes = moment.tz(timezone).utcOffset();

        // Convert the offset to milliseconds
        const offsetInMilliseconds = offsetInMinutes * 60 * 1000;

        console.log(
          `Offset from UTC for ${timezone} in milliseconds: ${offsetInMilliseconds}`
        );
        // //////console.log('userTimezoneOffset', userTimezoneOffset);
        // getStartDate(startDate, userTimezoneOffset, session.timeZone);
        let up = getStartDate(
          startDate,
          userTimezoneOffset,
          session.timeZone,
          offsetInMilliseconds
        );
        // console.log('session data---', session.date);
        // console.log('start date---', startDate);
        // console.log('updated date---', up);
        // console.log('timeZone---', session.timeZone);
        // console.log('startHours---', startHours);
        // console.log('startMinutes---', startMinutes);
        const startUtc = up.toUTCString();
        console.log("startUtc---", startUtc);

        // //////console.log('START DATE', startDate.toDateString());
        // //////console.log('startDate', new Date(startDate.getTime() - userTimezoneOffset + 9 * 3600000))
        // console.log('startUtc', startUtc);
        // console.log('startUtc', startUtc);
        // const dsttz = moment.tz(startDate, session.timeZone).format("zz");
        // const dstdate = moment
        //   .tz(startDate, session.timeZone)
        //   .format("YYYY-MM-DD HH:mm ZZ");
        // const dstdate = moment.tz(startDate, session.timeZone).format(moment.defaultFormat)

        // //////console.log('dsttz', dsttz)
        // //////console.log('dstdate', moment().utcOffset(dstdate)._offset)
        // //////console.log('START DATE UTC --', startUtc);

        const endTime12HFormat = `${time.end.time} ${time.end.timeType}`;
        const endTime = convertTime12to24(
          `${time.end.time} ${time.end.timeType}`
        );
        const endHours = parseInt(endTime.split(":")[0]);
        const endMinutes = parseInt(endTime.split(":")[1]);
        let endDate = new Date(session.date);
        endHours !== NaN && endDate.setHours(endHours);
        endMinutes !== NaN && endDate.setMinutes(endMinutes);

        const endDateUtc = getStartDate(
          endDate,
          userTimezoneOffset,
          session.timeZone,
          offsetInMilliseconds
        );
        // console.log("SessionTimings", session, startDate, endDateUtc, strtTime12HFormat)
        let eventObj = {
          id: session._id,
          title: role === "tutor" ? session.studentName : session.tutorName,
          start: startUtc,
          tutorId: session.tutorId,
          endDate: endDateUtc,
          updatedDate: startUtc,
          updatedDateEnd: endDateUtc,
          studentId: session.studentId,
          sessionStatus: session.sessionStatus,
          tutorId: session.tutorId ? session.tutorId : "-",

          description: `${strtTime12HFormat} - ${endTime12HFormat}`,
        };
        return eventObj;
      });
      const promiseState = async (state) =>
        new Promise((resolve) => {
          resolve(setEvents(tempSession));
        });
      promiseState().then(() => {
        parseEventDatesToTz();
      });
    });
  };

  useEffect(() => {
    // //////console.log(currentUserTImeZone);
    if (timeZones.includes(currentUserTImeZone)) {
      setTimeZone(currentUserTImeZone);
    }
  }, [currentUserTImeZone]);

  useEffect(() => {
    if (
      persona === "admin" ||
      (persona === "tutor" &&
        organization &&
        organization?.settings?.permissions?.length > 5 &&
        organization?.settings?.permissions[5]?.choosedValue === true)
    ) {
      // console.log("org tutor", organization)
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [organization]);

  useEffect(() => {
    if (persona == "student") {
      // //////console.log(persona);
      if (!currentUserId) return;
      fetchSessions(currentUserId, persona);
    }
  }, [persona, alldetails]);

  const [done, setDone] = useState(false);
  useEffect(() => {
    if (persona === "parent" && students && done) {
      ////console.log("student",{students})
      let temp = {};
      students?.map((it) => {
        let n = Object.keys(temp).length;
        temp = {
          ...temp,
          [it?._id]: staticColors[n % staticColors.length],
        };
      });

      setColorMapping(temp);
    }
  }, [students, done]);

  useEffect(() => {
    if (persona == "parent") {
      getUserDetail({ id }).then(async (resp) => {
        // console.log("response----", resp.data.data);
        // return
        setStudents([]);
        await resp.data.data.user.assiginedStudents.map((student, idx) => {
          getUserDetail({ id: student }).then((res) => {
            if (res.error) return;
            setStudents((prev) => [
              ...prev,
              {
                _id: res.data.data?.user._id,
                studentName: `${res.data.data?.user.firstName} ${res.data.data?.user.lastName}`,
                selected: true,
              },
            ]);
          });
        });

        let allsessions = [];
        let allevents = [];

        const fetch = async (cb) => {
          await resp.data.data.user.assiginedStudents.map(
            async (student, idx) => {
              setSearchedUser({ id, role: "student" });
              const url = `/api/session/student/${student}`;
              await fetchUserSessions(url).then((res) => {
                const tempEvents = res.data.data.session.map((session) => {
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
                  const offset = startDate.getTimezoneOffset() * 60000;
                  if (offset > 0) {
                    // startDate = startDate + offset
                    startDate = new Date(startDate.getTime() + offset);
                  }
                  // let startDate = new Date(session.date).toUTCString()
                  startHours !== NaN && startDate.setHours(startHours);
                  startMinutes !== NaN && startDate.setMinutes(startMinutes);
                  let updatedDate = new Date(
                    new Date(
                      startDate.toLocaleString("en-US", {
                        // timeZone: session.timeZone,
                        timeZone:
                          session.timeZone === "AKST"
                            ? "America/Anchorage"
                            : session.timeZone === "HST"
                            ? "Pacific/Honolulu"
                            : session.timeZone,
                      })
                    )
                  );
                  return {
                    ...session,
                    updatedDate,
                  };
                });
                allsessions.push(...tempEvents);
                let tempSession = res.data.data.session.map((session) => {
                  ////console.log("sesssions", session);
                  const time = session.time;
                  // //////console.log(session);
                  const strtTime12HFormat = `${time.start.time} ${time.start.timeType}`;
                  const startTime = convertTime12to24(
                    `${time.start.time} ${time.start.timeType}`
                  );

                  const startHours = parseInt(startTime.split(":")[0]);
                  const startMinutes = parseInt(startTime.split(":")[1]);

                  let startDate = new Date(session.date);
                  // let startDate = new Date(new Date(
                  //    session.date.toLocaleString('en-US', {
                  //       timeZone: "Asia/Kolkata"
                  //    }),
                  // ))
                  const offset = startDate.getTimezoneOffset() * 60000;
                  if (offset > 0) {
                    // startDate = startDate + offset
                    startDate = new Date(startDate.getTime() + offset);
                  }
                  // let startDate = new Date(session.date).toUTCString()
                  startHours !== NaN && startDate.setHours(startHours);
                  startMinutes !== NaN && startDate.setMinutes(startMinutes);

                  var userTimezoneOffset =
                    startDate.getTimezoneOffset() * 60000;
                  const timezone = session.timeZone;
                  const offsetInMinutes = moment.tz(timezone).utcOffset();
                  const offsetInMilliseconds = offsetInMinutes * 60 * 1000;

                  let up = getStartDate(
                    startDate,
                    userTimezoneOffset,
                    session.timeZone,
                    offsetInMilliseconds
                  );
                  const startUtc = up.toUTCString();

                  // //////console.log('START DATE', startDate);
                  // //////console.log('START DATE UTC --', startUtc);

                  const endTime12HFormat = `${time.end.time} ${time.end.timeType}`;
                  const endTime = convertTime12to24(
                    `${time.end.time} ${time.end.timeType}`
                  );
                  const endHours = parseInt(endTime.split(":")[0]);
                  const endMinutes = parseInt(endTime.split(":")[1]);
                  let endDate = new Date(session.date);
                  endHours !== NaN && endDate.setHours(endHours);
                  endMinutes !== NaN && endDate.setMinutes(endMinutes);

                  const endDateUtc = getStartDate(
                    endDate,
                    userTimezoneOffset,
                    session.timeZone,
                    offsetInMilliseconds
                  );

                  // //////console.log(resp.data.data.user.assiginedStudents);

                  let eventObj = {
                    id: session._id,
                    title: session.tutorName,
                    start: startUtc,
                    endDate: endDateUtc,
                    tutorId: session.tutorId,
                    updatedDate: startUtc,
                    updatedDateEnd: endDateUtc,
                    description: `${strtTime12HFormat} - ${endTime12HFormat}`,
                    sessionStatus: session.sessionStatus,
                    tutorId: session.tutorId,
                    studentId: session.studentId,
                    tutorId: session.tutorId ? session.tutorId : "-",
                    // background: getBackground(
                    //   resp.data.data.user.assiginedStudents.length,
                    //   idx
                    // ),
                  };
                  return eventObj;
                });
                allevents.push(...tempSession);
                if (idx === resp.data.data.user.assiginedStudents.length - 1)
                  cb();
                // parseEventDatesToTz()
              });
            }
          );
        };
        fetch(() => {
          setEventDetails(allsessions);
          const promiseState = async (state) =>
            new Promise((resolve) => {
              resolve(setEvents(allevents));
            });
          promiseState().then(() => {
            parseEventDatesToTz();
          });
          setEvents(allevents);
        });
      });
    }
  }, [persona]);

  // //////console.log(students)

  useEffect(() => {
    if (calendarWeekRef.current) {
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

  useEffect(() => {
    setnewTimeZone(timeZone);
  }, [timeZone]);

  const getDayHeaders = (arg) => {
    let text = arg.text.split(" ");
    const date = arg.date.getDate();
    // console.log('darg--', date);
    return (
      <div
        className={`p-[10px] rounded-7 ${
          arg.isToday ? "bg-primary border" : ""
        }  `}
      >
        {/* <p
          className={`${arg.isToday ? "text-primaryWhite-900" : ""
            } text-sm font-semibold
                   ${arg.isPast
              ? "text-[#BEC2CE]"
              : arg.isFuture
                ? "text-primary-60"
                : ""
            } `}
        >
          {days[arg.date.getDay()]}
        </p> */}
        <p
          className={`${
            arg.isToday ? "text-primaryWhite-900" : ""
          } text-2xl font-bold font-inter
                   ${
                     arg.isPast
                       ? "text-[#BEC2CE]"
                       : arg.isFuture
                       ? "text-primary-dark"
                       : ""
                   }`}
        >
          {text[1]}
          <span className="inline-block ml-2">{date}</span>
        </p>
      </div>
    );
  };

  const handlePrevClick = (arg) => {
    const calendarAPI = calendarWeekRef?.current?.getApi();
    calendarAPI?.prev();
  };

  const handleNextClick = (arg) => {
    const calendarAPI = calendarWeekRef?.current?.getApi();
    calendarAPI?.next();
  };

  const eventContent = (arg) => {
    const description = arg.event._def.extendedProps.description;

    let isCompleted = false;
    let isMissed = false;
    let isCancelled = false;
    if (arg.event._def.extendedProps.sessionStatus === "Completed") {
      isCompleted = true;
    }
    // console.log("event cards details", arg)

    const textclasses = {
      Completed: "!bg-[#38C980] ",

      Scheduled: "!bg-[#7C98B6] ",
      Cancelled: "!bg-[#FF7979] ",
      Missed: "!bg-[#FFCE84] ",
    };
    let key = insightData.role;

    if (
      key === "tutor" ||
      key === "parent" ||
      persona == "parent" ||
      persona === "tutor"
    ) {
      key = arg.event._def.extendedProps?.studentId;
    } else {
      key = arg.event._def.extendedProps?.tutorId;
    }
    let service = "None ";
    let topic = "None ";
    if (arg.event._def.extendedProps.service) {
      service = arg.event._def.extendedProps.service;
    }
    if (arg.event._def.extendedProps.topic) {
      topic = arg.event._def.extendedProps.topic;
    }
    // console.log({key:arg.event._def.extendedProps})
    return (
      <div className="p-0.5 h-full ">
        <div
          className={`w-full bg-rose-200 h-[5px] rounded-[5px_5px_0px_0px] relative z-[500] ${
            textclasses[arg.event._def.extendedProps.sessionStatus]
          }`}
        ></div>
        <div
          style={{
            background: colorMapping[key] + "50",
            border: "1.87px solid " + colorMapping[key],
            borderTop: "none",
          }}
          className={` h-full p-1 !border-t-none rounded-b-lg `}
        >
          <p
            className={`text-[#507CA8] font-semibold text-sm text-base-15 ${
              isCompleted ? "line-through" : ""
            } `}
          >
            {" "}
            {}
            {arg.event._def.title} {/* {service + " - " + topic} */}
          </p>
          {/* <p className='text-black opacity-60 text-xs'> {arg.timeText} </p> */}
          <p className="text-[#26435F] opacity-60 text-xs text-base-15">
            {" "}
            {description}{" "}
          </p>
        </div>
      </div>
    );
  };

  const handleDateClick = (arg) => {
    console.log("click");
    if (organization?.settings?.permissions && persona === "tutor") {
      if (organization?.settings?.permissions[5].choosedValue === false) {
        return;
      }
    }
    let date = new Date(arg.date);
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    // if (!date || date - currentDate <= 0) {
    //   alert('Cannot schedule events on past date')
    //   return
    // }

    //  console.log("can see", date,currentDate)

    if (persona === "tutor") {
      setDefaultEventData({
        date: arg.date,
        tutorId: currentUserId,
        tutorName: `${firstName} ${lastName}`,
        timeZone,
      });
    } else {
      setDefaultEventData({ date: arg.date, timeZone });
    }
    if (
      persona === "admin" ||
      (persona === "tutor" &&
        organization &&
        organization?.settings?.permissions?.length > 5 &&
        organization?.settings?.permissions[5]?.choosedValue === true)
    ) {
      setEventModalActive(true);
    }

    // arg.preventDefault()
    // //////console.log(arg)
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
  const [studentName, setStudentNames] = useState([]);

  const handleInsights = (name, role, item) => {
    getCalenderInsight({ name: name, id: item._id }).then((res) => {
      setColorMapping({});
      if (res.error) {
        // return console.log('insight err', res.error);
      }
      // console.log("insights response----", res.data.tutorSessionDetails);
      if (res?.data?.tutorSessionDetails) {
        let arr = [];
        if (res?.data?.tutorSessionDetails) {
          arr = res?.data?.tutorSessionDetails;
          // arr = arr?.length >= 0 ? arr : [arr];
        }
        if (role === "parent") {
          let parentSessionData = res?.data?.tutorSessionDetails.map(
            (sessionItem) => {
              let sessions = [];
              let tutors = [];
              sessionItem.tutorDetails.map((tutorSession) => {
                sessions.push(...tutorSession.sessionDetailsObj);
                tutors.push(tutorSession.tutor);
              });
              return {
                student: sessionItem.student,
                sessionDetailsObj: sessions,
                tutors,
              };
            }
          );
          setInsightData({
            role: role,
            data: parentSessionData,
          });
        } else {
          setInsightData({
            role: role,
            data: arr,
          });
        }
      } else
        setInsightData({
          message: ` ${
            role !== "tutor"
              ? `"User does'nt have any tutor"`
              : `User does'nt have any parent or student`
          } `,
        });
    });
  };

  useEffect(() => {
    if (userDetail) {
      handleInsights(
        userDetail?.firstName + " " + userDetail?.lastName,
        persona,
        { _id: userDetail?.id }
      );
    }
  }, [userDetail]);

  useEffect(() => {
    //////console.log("role=" + persona)
    if (name.length > 0) {
      fetchNames(name).then((res) => {
        //////console.log("fetchnames", res.data.data.user);
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
  //////console.log({defaultEventData,eventDetails,alldetails})

  const fetchTutorSessions = () => {
    const userId = currentUserId;
    if (persona === "tutor") {
      fetchStudents(userId).then((res) => {
        setEventDetails(res.data.data.session);
        //////console.log("tutorrr")
        //console.log("session details tutor",res.data);
        let tempSession = res.data.data.session.map((session, idx) => {
          const time = session.time;
          ////console.log(persona, session);
          const strtTime12HFormat = `${time.start.time} ${time.start.timeType}`;
          const startTime = convertTime12to24(
            `${time.start.time} ${time.start.timeType}`
          );
          const startHours = parseInt(startTime.split(":")[0]);
          const startMinutes = parseInt(startTime.split(":")[1]);
          let startDate = new Date(session.date);
          // let startDate = new Date(new Date(
          //    session.date.toLocaleString('en-US', {
          //       timeZone: "Asia/Kolkata"
          //    }),
          // ))
          const offset = startDate.getTimezoneOffset() * 60000;
          if (offset > 0) {
            // startDate = startDate + offset
            startDate = new Date(startDate.getTime() + offset);
          }
          // //////console.log('SESSION DATE', session.date);
          // //////console.log('START DATE', startDate);
          // let startDate = new Date(session.date).toLocaleString('en-US', { timeZone })
          // let startDate = new Date(session.date).toUTCString()
          startHours !== NaN && startDate.setHours(startHours);
          startMinutes !== NaN && startDate.setMinutes(startMinutes);
          var userTimezoneOffset = startDate.getTimezoneOffset() * 60000;
          const timezone = session.timeZone;
          const offsetInMinutes = moment.tz(timezone).utcOffset();
          const offsetInMilliseconds = offsetInMinutes * 60 * 1000;

          let up = getStartDate(
            startDate,
            userTimezoneOffset,
            session.timeZone,
            offsetInMilliseconds
          );
          const startUtc = up.toUTCString();
          // //////console.log('START DATE', startDate);
          // //////console.log('START DATE UTC --', startUtc);
          const endTime12HFormat = `${time.end.time} ${time.end.timeType}`;
          const endTime = convertTime12to24(
            `${time.end.time} ${time.end.timeType}`
          );
          const endHours = parseInt(endTime.split(":")[0]);
          const endMinutes = parseInt(endTime.split(":")[1]);
          let endDate = new Date(session.date);
          endHours !== NaN && endDate.setHours(endHours);
          endMinutes !== NaN && endDate.setMinutes(endMinutes);
          const endDateUtc = getStartDate(
            endDate,
            userTimezoneOffset,
            session.timeZone,
            offsetInMilliseconds
          );
          let eventObj = {
            id: session._id,
            title: session.studentName,
            tutorId: session.tutorId,
            start: startUtc,
            endDate: endDateUtc,
            tutorId: session.tutorId,
            updatedDate: startUtc,
            updatedDateEnd: endDateUtc,
            sessionStatus: session.sessionStatus,
            studentId: session.studentId,
            //description: `${startUtc} - ${endDateUtc}`,
            description: `${strtTime12HFormat} - ${endTime12HFormat}`,
            // background: getBackground(
            //   res.data.data.user.assiginedStudents.length,
            //   idx
            // ),
          };
          return eventObj;
        });

        const promiseState = async (state) =>
          new Promise((resolve) => {
            resolve(setEvents(tempSession));
          });
        promiseState().then(() => {
          parseEventDatesToTz();
        });

        const arrayUniqueByKey = [
          ...new Map(
            res.data.data.session.map((item) => [item["studentId"], item])
          ).values(),
        ];
        // //////console.log(arrayUniqueByKey);

        let tempstudents = arrayUniqueByKey.map((item) => {
          return {
            _id: item.studentId,
            studentName: item.studentName,
            selected: true,
          };
        });
        //////console.log("uniq", arrayUniqueByKey);
        setStudents(tempstudents);
      });
    }
  };
  useEffect(() => {
    fetchTutorSessions();
  }, [persona]);

  const handleEventClick = (info) => {
    //alert("Event")
    if (organization?.settings?.permissions && persona === "tutor") {
      if (organization?.settings?.permissions[5].choosedValue === false) {
        return;
      }
    }
    const session = eventDetails.find(
      (e) => e._id === info.event._def.publicId
    );
    if (
      persona === "admin" ||
      (persona === "tutor" &&
        organization &&
        organization?.settings?.permissions?.length > 5 &&
        organization?.settings?.permissions[5]?.choosedValue === true)
    ) {
      setUpdateEventModalActive(true);
      setSessionToUpdate(session);
    } else {
      setUpdateEventModalActive(true);
      setSessionToUpdate(session);
    }
  };

  useEffect(() => {
    if (!sessionToEdit) return;
    if (eventDetails.length === 0) return;
    if (isEdited === true) return;

    setIsEdited(true);
    const session = eventDetails.find((e) => e._id === sessionToEdit);
    // //////console.log(session);
    if (persona === "admin" || persona === "tutor") {
      setUpdateEventModalActive(true);
      setSessionToUpdate(session);
    }
  }, [sessionToEdit, eventDetails]);

  useEffect(() => {
    // calendarWeekRef.current?.getApi().gotoDate(currentDate);
    // calendarWeekRef.current.gotoDate(currentDate)
  }, [currentDate]);

  moment.tz.setDefault("Etc/UTC");

  const parseEventDatesToTz = () => {
    setEvents((prev) => {
      return prev.map((item) => {
        // let updatedDate = new Date(item?.start).toLocaleString();
        // let updatedDateEnd = new Date(item?.updatedDateEnd).toLocaleString(
        // );
        // let updatedDate = new Date(item.updatedDate).toLocaleString('en-US', { timeZone })
        const utcDate = moment(
          item.updatedDate,
          "ddd, DD MMM YYYY HH:mm:ss [GMT]"
        )
          .utc()
          .format();
        const timeZoneOffset = moment.tz(timeZone).utcOffset();
        const convertedDate = moment.tz(utcDate, timeZone).format();
        // Convert the updatedDate to UTC

        let updatedDate = moment(item.updatedDate)
          .tz(timeZone)
          .format("YYYY-MM-DD HH:mm:ss");
        let updatedDateEnd = moment(item.updatedDateEnd)
          .tz(timeZone)
          .format("YYYY-MM-DD HH:mm:ss");
        // let updatedDateEnd = new Date(item.updatedDateEnd).toLocaleString('en-US', { timeZone })

        // console.log('convertedDate---', moment.tz(item.updatedDate, 'DD/MM/YYYY h:mm a', timeZone));
        // console.log('timeZone---', timeZone);
        console.log("convertedDate---", convertedDate);
        console.log("item date---", item.updatedDate);
        // let updatedDate = new Date(item?.updatedDate).toLocaleString("en-US", {
        //   timeZone,
        // });
        // let updatedDateEnd = new Date(item?.updatedDateEnd).toLocaleString(
        //   "en-US",
        //   { timeZone }
        // );
        // //////console.log('item', item)
        // //////console.log('updatedDate', updatedDate)
        // //////console.log('DATE UPDATED ==', updatedDate)
        // //////console.log('timeZone', timeZone)
        // let fmt = "DD/MM/YYYY, h:mm:ss a";
        // var m = moment.tz(updatedDate, fmt, timeZone);
        // m.utc();
        // var s = m.format(fmt); // result:
        // console.log('moment', item, item?.start, updatedDate, updatedDateEnd);

        return {
          ...item,
          start: new Date(updatedDate),
          //description: `${formatAMPM(startarg)}-${formatAMPM(endarg)}`
          description: `${formatAMPM(new Date(updatedDate))}-${formatAMPM(
            new Date(updatedDateEnd)
          )}`,
        };
      });
    });
  };

  // useEffect(() => {
  //    getUserDetail({ id: localStorage.getItem("userId") }).then((res) =>
  //       setTimeZone(res.data?.data?.userdetails?.timeZone)
  //    );
  // }, []);

  useEffect(() => {
    if (calendarWeekRef.current === null) return;
    if (calendarWeekRef.current === undefined) return;
    parseEventDatesToTz();

    // document.getElementById('calendarContainer').refetchEvents()
    // calendarWeekRef.refetchEvents()
    // calendarWeekRef.current.gotoDate('')
    // calendarWeekRef.current.setOption('timeZone', timeZone)
  }, [timeZone, events.length]);

  const handleStudentChange = (student) => {
    let tempStudents = students.map((item) => {
      if (item._id === student._id) {
        return { ...item, selected: true };
      } else {
        return { ...item, selected: false };
      }
    });
    setStudents(tempStudents);
  };

  const staticColors = [
    "#F6935A",
    "#7DE94A",
    "#6F7ADE",
    "#C97BEE",
    "#FF5733",
    "#42EADD",
    "#FFC300",
    "#9A32CD",
    "#00BFFF",
    "#FF1493",
    "#008000",
    "#FFD700",
    "#1E90FF",
    "#FF4500",
    "#00FF00",
    "#8A2BE2",
    "#FF8C00",
    "#4169E1",
    "#FF69B4",
    "#228B22",
    "#FFDAB9",
    "#9932CC",
    "#FFA07A",
    "#87CEEB",
    "#FFB6C1",
    "#8B008B",
    "#FF6347",
    "#00CED1",
    "#FFA500",
    "#0000CD",
    "#DC143C",
    "#20B2AA",
    "#FF4500",
    "#191970",
    "#FF8C69",
    "#008080",
    "#FFA500",
    "#2E8B57",
    "#FFD700",
    "#00008B",
    "#FFB6C1",
    "#48D1CC",
    "#FF69B4",
    "#8A2BE2",
    "#FF6347",
    "#7B68EE",
    "#FF4500",
    "#32CD32",
    "#FFDAB9",
    "#B22222",
    "#FF1493",
    "#00FA9A",
    "#FFA07A",
  ];

  const [colorMapping, setColorMapping] = useState({});
  // console.log("user insights", insightData, colorMapping, userDetail)
  const mapColor = (val) => {
    let n = Object.keys(colorMapping).length;
    if (colorMapping[val]) return colorMapping[val];
    else {
      setColorMapping((prev) => {
        return {
          ...prev,
          [val]: staticColors[Object.keys(prev).length % staticColors.length],
        };
      });
    }
    // console.log('map color', colorMapping);

    return staticColors[n % staticColors.length];
  };
  useEffect(() => {
    setColorMapping({});
    //  console.log("insights color",{insightData})
    let temp = {};
    if (insightData && insightData.role === "student") {
      insightData?.data?.map((it) => {
        let n = Object.keys(colorMapping).length;
        setColorMapping((prev) => {
          return {
            ...prev,
            [it?.tutor?._id]:
              staticColors[Object.keys(prev).length % staticColors.length],
          };
        });
      });
    }
    if (
      insightData &&
      (insightData.role === "parent" || insightData.role === "tutor")
    ) {
      insightData?.data?.map((it) => {
        let n = Object.keys(colorMapping).length;
        setColorMapping((prev) => {
          return {
            ...prev,
            [it?.student?._id]:
              staticColors[Object.keys(prev).length % staticColors.length],
          };
        });
      });
    }
    // console.log({temp})
    // setColorMapping({...temp});
  }, [insightData]);
  // console.log("insights color", { insightData, colorMapping });
  useEffect(() => {
    if (students.length === 0) return;
    if (events.length === 0) return;
    let selectedStudents = students
      .filter((item) => item.selected === true)
      .map((item) => item._id);
    let filtered = events.filter((event) =>
      selectedStudents.includes(event.studentId)
    );
    // //////console.log('filtered', filtered);
    // //////console.log('filtered', filtered);
    setFilteredEvents(filtered);
  }, [events, students]);

  const [exp, setExp] = useState(null);

  const toggleAccordions = (id) => {
    const currentRef = accordionRefs.current[id];
    const isExpanded = currentRef.style.width;
    setExp(-1);
    setExp(id);
    currentRef.style.transition = "all 1s ease";
    if (currentRef.classList.contains("expanded")) {
      accordionRefs.current.forEach((ar, i) => {
        if (accordionImgRefs.current && accordionImgRefs.current[i]) {
          ar?.classList.add("expanded");
          accordionImgRefs.current[i].src = down_triangle;
        }
      });
      if (accordionImgRefs.current && accordionImgRefs2.current[id])
        accordionImgRefs.current[id].src = up_triangle;
      currentRef.classList.remove("expanded");
    } else {
      // Adjust this value based on your content
      accordionImgRefs.current[id].src = down_triangle;
      currentRef.classList.add("expanded");
    }
  };
  const toggleAccordions2 = (id) => {
    const currentRef = accordionRefs2.current[id];
    const isExpanded = currentRef.style.width;
    setExp(-1);
    setExp(id);
    currentRef.style.transition = "all 1s ease";
    if (currentRef.classList.contains("expanded")) {
      accordionRefs.current.forEach((ar, i) => {
        if (accordionImgRefs2.current && accordionImgRefs2.current[i]) {
          ar?.classList.add("expanded");
          accordionImgRefs2.current[i].src = down_triangle;
        }
      });
      if (accordionImgRefs2.current && accordionImgRefs2.current[id])
        accordionImgRefs2.current[id].src = up_triangle;
      currentRef.classList.remove("expanded");
    } else {
      // Adjust this value based on your content
      accordionImgRefs2.current[id].src = down_triangle;
      currentRef.classList.add("expanded");
    }
  };
  const map = [];
  useEffect(() => {
    if (tutors) {
      tutors.map((item) => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        map[item] = color;
        //////console.log("map function", map)
      });
    }
  }, [tutors]);
  const toggleTutorDetails = (tutorId) => {
    setShowTutorDetails((prevState) => ({
      ...prevState,
      [tutorId]: !prevState[tutorId],
    }));
  };

  useEffect(() => {
    if (calendarYearlyRef.current) {
      const calendar = new Calendar(calendarYearlyRef.current, {
        plugins: [
          dayGridPlugin,
          timeGridWeek,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ],
        initialView: "multiMonthYear",
        multiMonthMaxColumns: 3,
        events:
          persona === "parent" || persona === "tutor" ? filteredEvents : events,
        dayMaxEventRows: true,
        stickyHeaderDates: true,
        stickyHeaderToolbar: true,
        eventMaxStack: 1,
        firstDay: 1,
        slotDuration: "00:60:00",
        dateClick: handleDateClick,
        eventClick: (info) => handleEventClick(info),
        // customButtons: {
        //   prevButton: {
        //     text: (
        //       <span className="calendar-prevButton-custom">
        //         <img className="pr-2" src={LeftIcon} alt="arrow" />
        //       </span>
        //     ),
        //     click: handlePrevClick,
        //   },
        //   nextButton: {
        //     text: (
        //       <span className="calendar-nextButton-custom">
        //         <img className="pr-2" src={nextIcon} alt="arrow" />
        //       </span>
        //     ),
        //     click: handleNextClick,
        //   },
        // },
        // eventContent: eventContent,
        titleFormat: {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
        headerToolbar: {
          start: "title prev next",
          center: "",
          end: "",
        },
      });

      calendar.render();
    }
  }, [persona, filteredEvents, events, eventContent, handleDateClick]);

  useEffect(() => {
    if (calendarWeekRef.current) {
      calendarWeekRef?.current?.render();
      calendarMonthRef?.current?.render();
      // if (activeView === 'Month') {
      //   calendarWeekRef.current.changeView("dayGrid")
      // } else {
      //   calendarWeekRef.current.changeView("timeGridWeek")
      // }
      // calendarWeekRef.current.render()
    }
  }, [activeView]);
  // console.log('activeView-', activeView);
  // console.log(' organization?.settings?.permissions-----', organization?.settings?.permissions);
  // console.log('events-----', events);
  //console.log('eventDetails',colorMapping,insightData,userDetail,associatedStudents);
  const timeZones = moment.tz.names(); // String[]
  const navigate = useNavigate();

  return (
    <>
      <div className="lg:ml-pageLeft calender  min-h-screen" id={persona}>
        <p className="text-[#24A3D9] text-base-20 mb-[30px] mt-[50px] pl-[74px]">
          <span onClick={() => navigate("/")} className="cursor-pointer">
            {organization?.company +
              "  >  " +
              firstName +
              "  " +
              lastName +
              "  >  "}
          </span>
          <span className="font-bold">Schedule</span>
        </p>
        <div className="  pb-2 pl-[74px] calendar flex">
          <div className=" pl-0 pr-0 w-[296px] mr-[10px] calendar-left-side">
            <div className="w-[296px] h-[262px]">
              <SimpleCalendar
                events={
                  persona === "parent" || persona === "tutor"
                    ? filteredEvents
                    : events
                }
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
              />
            </div>
            {persona === "parent" ? (
              <div className="mt-10 pr-4">
                {/* <div className="mt-[30px]">
                  {students.map((student, idx) => {
                    return (
                      <div
                        key={student.studentId}

                        className={`p-4 mb-4 rounded-10 flex justify-between items-center  bg-white ${student.selected
                          ? "border border-[#c6c6c6] shadow-md"
                          : "border"
                          } `}
                        style={{
                          backgroundColor: colorsTutor.bg[id % 4],
                          color: colorsTutor.text[id % 4],
                        }}

                        onClick={() => handleStudentChange(student)}
                      >
                        <p
                          className={`text-xl text-[#24A3D9] font-semibold ${student.selected ? "font-medium" : ""
                            } `}
                        >
                          {student.studentName}
                        </p>
                        <div

                        >
                          <img className="inline-block" src={downBlue} alt="" srcset="" />
                        </div>
                      </div>
                    );
                  })}
                </div> */}
              </div>
            ) : persona !== "student" ? (
              <></>
            ) : (
              <div>
                {/* { //console.log({alldetails})}
                {alldetails?.map((item) => (
                  <div className="mt-[48px] mb-2">
                    <div style={{backgroundColor:mapColor(item.tutorId)+"30"}} className="flex justify-between pt-[19px] px-[21px] pb-[14px]  rounded-5 items-center">
                      <p style={{color:mapColor(item.tutorId)}} className=" text-xl font-semibold">
                        {item.tutorName}
                      </p>
                      <p>
                      <div
                           style={{backgroundColor:mapColor(item.tutorId)}}
                            className="flex justify-center items-center text-center py-auto my-auto w-5 h-5 rounded-3xl "
                          >
                            <img
                              ref={(el) => (accordionImgRefs.current[id] = el)}
                              onClick={() => toggleTutorDetails(item.id)}
                              className="inline-block my-auto text-white"
                              src={down_triangle}
                              alt="inscribed triangle"
                            />
                          </div>
                      
                      </p>
                    </div>
                    <div>
                      {showTutorDetails[item.id] && (
                        <>
                          {" "}
                          <div
                            key={item.id}
                            className="flex justify-between pt-19px px-21px pb-14px bg-rgba(255,162,141,0.20) rounded-t-5 items-center mt-5"
                          ></div>
                          <div className="py-[17.5px] pl-3 bg-[#FFFFFF] rounded-b-5">
                            <p className="text-[#26435F] text-lg font-medium">
                              Service{" "}
                            </p>
                            <p className="text-[17.5px] text-[#7C98B6] mt-[19px]">
                              {item.service}
                            </p>
                            <p className="text-[rgba(56,201,128,1)] text-lg font-medium pt-[40px]">
                              Hours Completed
                            </p>
                            <p className="text-[25px] text-[rgba(56,201,128,1)] mt-[19px]">
                              {item.total_hours}
                            </p>
                            <p className="text-[#FF7979] text-lg font-medium pt-[40px]">
                              Hours Missed
                            </p>
                            <p className="text-[25px] text-[#FF7979] mt-[19px]">
                              0
                            </p>
                            <p className="text-[rgba(255,206,132,1)] text-lg font-medium pt-[40px]">
                              Hours Canceled
                            </p>
                            <p className="text-[25px] text-[rgba(255,206,132,1)] mt-[19px]">
                              0
                            </p>
                            <p className="text-[rgba(124,152,182,1)] text-lg font-medium pt-[40px]">
                              Hours Scheduled
                            </p>
                            <p className="text-[25px] text-[rgba(124,152,182,1)] mt-[19px]">
                              {item.total_hours}
                            </p>
                          </div>
                        </>
                      )}

                    </div>
                  </div>
                ))} */}
              </div>
            )}
            {persona === "admin" && (
              <InputSearch
                // IconRight={SearchIcon}
                placeholder="Type Name"
                parentClassName="w-full mr-4 mt-5"
                inputContainerClassName="bg-white shadow"
                type="select"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setInsightData([]);
                }}
                optionData={names}
                onOptionClick={(item) => {
                  setName(item.value);
                  handleInsights(item.value, item.role, item);
                  setColorMapping({});
                  fetchSessions(item._id, item.role);
                }}
              />
            )}
            <div className="max-h-[400px] overflow-y-auto custom-scroller">
              {insightData?.data?.length > 0 && insightData?.role !== "tutor"
                ? insightData?.data?.map((item, id) => {
                    return (
                      <div
                        key={id}
                        className="transition-shy flex transition-all duration-300 font-semibold box-content flex-col my-3 bg-[#FFFFFF] rounded-md  text-lg  w-[270px] "
                      >
                        <div
                          style={{
                            backgroundColor:
                              insightData?.role === "student"
                                ? colorMapping[item?.tutor?._id] + "40"
                                : colorMapping[item?.student?._id] + "40",
                            color:
                              insightData?.role === "student"
                                ? colorMapping[item?.tutor?._id]
                                : colorMapping[item?.student?._id],
                          }}
                          onClick={() => toggleAccordions(id)}
                          className="transition-shy cursor-pointer bg-[rgba(255,162,141,0.2)] overflow-hidden relative z-50 py-3 px-5 text-[#FFA28D] mx-0 flex justify-between shadow-sm rounded-t-md w-full  "
                        >
                          {item?.tutor
                            ? item?.tutor?.firstName +
                              " " +
                              item?.tutor?.lastName
                            : item?.student
                            ? item?.student?.firstName +
                              "  " +
                              item?.student?.lastName
                            : ""}
                          <div
                            style={{
                              backgroundColor:
                                insightData?.role === "student"
                                  ? colorMapping[item?.tutor?._id]
                                  : colorMapping[item?.student?._id],
                            }}
                            className="flex justify-center items-center text-center py-auto my-auto w-5 h-5 rounded-3xl "
                          >
                            <img
                              ref={(el) => (accordionImgRefs.current[id] = el)}
                              className="inline-block my-auto text-white"
                              src={down_triangle}
                              alt="inscribed triangle"
                            />
                          </div>
                        </div>

                        <div
                          ref={(el) => (accordionRefs.current[id] = el)}
                          className="expanded transition-shy transition-all duration-300 rounded-b-md border border-t-0 border-r-2 border-b-2 border-l-2 border-dotted border-[rgba(255,162,141,1)]"
                        >
                          <div className="text-lg px-5 py-2 text-[#26435F]">
                            {" "}
                            <p className="flex py-1 overflow-x-auto custom-scroller-2">
                              {item?.sessionDetailsObj?.length > 0
                                ? item?.sessionDetailsObj?.map((ser, sid) => {
                                    return (
                                      <span
                                        key={sid}
                                        className="whitespace-nowrap"
                                      >
                                        {" "}
                                        {ser.service}
                                        {sid !==
                                        item?.sessionDetailsObj?.length - 1
                                          ? " , "
                                          : " "}
                                      </span>
                                    );
                                  })
                                : "None"}
                            </p>
                            <p className="text-[16px] text-[#7C98B6]">
                              {item.tutors
                                ? item.tutors.map((tutor, idx) => {
                                    return `${
                                      tutor?.firstName + " " + tutor?.lastName
                                    }${
                                      idx + 1 < item.tutors?.length ? "," : ""
                                    } `;
                                  })
                                : item?.tutor?.firstName +
                                  " " +
                                  item?.tutor?.lastName}
                            </p>
                          </div>
                          <div className="text-lg px-5 py-2 text-[#38C980]">
                            {" "}
                            <p>Hours Completed</p>
                            <p>
                              {" "}
                              {item?.sessionDetailsObj[0]
                                ?.no_of_completed_sessions
                                ? item?.sessionDetailsObj[0]
                                    ?.no_of_completed_sessions
                                : "0"}
                            </p>
                          </div>
                          <div className="text-lg px-5 py-2 text-[#FF7979]">
                            <p>Hours Missed</p>
                            <p>
                              {item?.sessionDetailsObj[0]?.no_of_missed_sessions
                                ? item?.sessionDetailsObj[0]
                                    ?.no_of_missed_sessions
                                : "0"}
                            </p>
                          </div>
                          <div className="text-lg px-5 py-2 text-[#FFCE84]">
                            <p>Hours Canceled</p>
                            <p>
                              {item?.sessionDetailsObj[0]
                                ?.no_of_cancelled_sessions
                                ? item?.sessionDetailsObj[0]
                                    ?.no_of_cancelled_sessions
                                : "0"}
                            </p>
                          </div>
                          <div className="text-lg px-5 py-2 text-[#7C98B6]">
                            <p>Hours Scheduled</p>
                            <p>
                              {item?.sessionDetailsObj[0]
                                ?.no_of_scheduled_sessions
                                ? item?.sessionDetailsObj[0]
                                    ?.no_of_scheduled_sessions
                                : "0"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : insightData.message && (
                    <div className="transition-shy mt-3 cursor-pointer bg-[rgba(255,162,141,0.2)] overflow-hidden relative z-50 py-3 px-5 text-[#FFA28D] mx-0 flex justify-between shadow-sm rounded-t-md w-full  ">
                      {insightData.message}
                    </div>
                  )}
              {insightData?.data?.length > 0 &&
                insightData?.role === "tutor" &&
                insightData?.data?.map((item, id) => {
                  return (
                    <div
                      key={id}
                      className="transition-shy flex transition-all duration-300 font-semibold box-content flex-col my-3 bg-[#FFFFFF] rounded-md  text-lg  w-[270px] "
                    >
                      <div
                        style={{
                          backgroundColor:
                            colorMapping[item?.student._id] + "40",
                          color: colorMapping[item?.student._id],
                        }}
                        onClick={() => toggleAccordions2(id)}
                        className="transition-shy cursor-pointer  overflow-hidden relative z-50 py-3 px-5  mx-0 flex justify-between shadow-sm rounded-t-md w-full  "
                      >
                        {item?.student?.firstName +
                          " " +
                          item?.student?.lastName}
                        <div
                          style={{
                            backgroundColor: colorMapping[item?.student._id],
                          }}
                          className="flex justify-center items-center text-center py-auto my-auto w-5 h-5 rounded-3xl "
                        >
                          <img
                            ref={(el) => (accordionImgRefs2.current[id] = el)}
                            className="inline-block my-auto text-white"
                            src={down_triangle}
                            alt="inscribed triangle"
                          />
                        </div>
                      </div>
                      <div
                        ref={(el) => (accordionRefs2.current[id] = el)}
                        className="expanded transition-shy transition-all duration-300 rounded-b-md border border-t-0 border-r-2 border-b-2 border-l-2 border-dotted border-[rgba(255,162,141,1)]"
                      >
                        <div className="text-lg px-5 py-2 text-[#26435F]">
                          {" "}
                          <p className="flex py-1 overflow-x-auto scrollbar-content">
                            {item?.sessionDetailsObj?.length > 0
                              ? item?.sessionDetailsObj?.map((ser, sid) => {
                                  return (
                                    <span
                                      key={sid}
                                      className="whitespace-nowrap"
                                    >
                                      {" "}
                                      {ser.service}
                                      {sid !==
                                      item?.sessionDetailsObj?.length - 1
                                        ? " , "
                                        : " "}
                                    </span>
                                  );
                                })
                              : "None"}
                          </p>
                          <p className="text-[16px] text-[#7C98B6]">
                            {persona === "tutor"
                              ? userDetail.firstName + " " + userDetail.lastName
                              : item?.tutor?.firstName
                              ? item?.tutor?.firstName +
                                " " +
                                item?.tutor?.lastName
                              : name}
                          </p>
                        </div>
                        <div className="text-lg px-5 py-2 text-[#38C980]">
                          {" "}
                          <p>Hours Completed</p>
                          <p>
                            {" "}
                            {item?.sessionDetailsObj[0]
                              ?.no_of_completed_sessions
                              ? item?.sessionDetailsObj[0]
                                  ?.no_of_completed_sessions
                              : "0"}
                          </p>
                        </div>
                        <div className="text-lg px-5 py-2 text-[#FF7979]">
                          <p>Hours Missed</p>
                          <p>
                            {item?.sessionDetailsObj[0]?.no_of_missed_sessions
                              ? item?.sessionDetailsObj[0]
                                  ?.no_of_missed_sessions
                              : "0"}
                          </p>
                        </div>
                        <div className="text-lg px-5 py-2 text-[#FFCE84]">
                          <p>Hours Canceled</p>
                          <p>
                            {item?.sessionDetailsObj[0]
                              ?.no_of_cancelled_sessions
                              ? item?.sessionDetailsObj[0]
                                  ?.no_of_cancelled_sessions
                              : "0"}
                          </p>
                        </div>
                        <div className="text-lg px-5 py-2 text-[#7C98B6]">
                          <p>Hours Scheduled</p>
                          <p>
                            {item?.sessionDetailsObj[0]
                              ?.no_of_scheduled_sessions
                              ? item?.sessionDetailsObj[0]
                                  ?.no_of_scheduled_sessions
                              : "0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className="flex-1 w-[1352px] relative  min-h-[600px] max-h-[868px]"
            id="calendarContainer"
          >
            {activeView === "Year" ? (
              <div ref={calendarYearlyRef}></div>
              // <FullCalendar
              //   view="multiMonthPlugin"
              //   handleDateClick={handleEventClick}
              // />
            ) : activeView === "Week" ? (
              <FullCalendar
                view="timeGridWeek"
                persona={persona}
                filteredEvents={filteredEvents}
                events={events}
                calRef={calendarWeekRef}
                handlePrevClick={handlePrevClick}
                handleNextClick={handleNextClick}
                eventContent={eventContent}
                getDayHeaders={getDayHeaders}
                handleDateClick={handleDateClick}
                handleEventClick={handleEventClick}
              />
            ) : activeView === "Month" ? (
              <FullCalendar
                view="dayGridMonth"
                persona={persona}
                filteredEvents={filteredEvents}
                events={events}
                calRef={calendarMonthRef}
                handlePrevClick={handlePrevClick}
                handleNextClick={handleNextClick}
                eventContent={eventContent}
                getDayHeaders={getDayHeaders}
                handleDateClick={handleDateClick}
                handleEventClick={handleEventClick}
              />
            ) : (
              ""
            )}

            <div className="absolute right-[50px] top-0 flex gap-x-4">
              <span id="input">
                <InputSelect
                  value={activeView}
                  inputContainerClassName="text-[15px] text-primaryDark font-bold border"
                  optionData={["Year", "Month", "Week"]}
                  onChange={(val) => {
                    // setActiveView(val)
                    if (val !== "Year") {
                      setActiveView("");
                      setTimeout(() => {
                        setActiveView(val);
                      }, 300);
                    } else {
                      setActiveView(val);
                    }
                  }}
                />
              </span>
              <span id="input">
                <InputSelect
                  value={newTimeZone}
                  inputContainerClassName="text-[15px] text-primaryDark font-bold border"
                  customArrow={downArrow}
                  optionData={timeZones}
                  onChange={(val) => setTimeZone(val)}
                />
              </span>
              {/* <div class="inline-flex rounded shadow-sm mt-1">
    <button class="px-2 py-1 text-xs font-medium text-blue-700 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:z-10 focus:text-orange-700 dark:bg-gray-700 dark:border-gray-600 dark:text-dark dark:hover:text-orange dark:hover:bg-gray-600 dark:focus:text-orange" >
        Weekly
    </button>
    <button class="px-2 py-1 text-xs font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-orange-700 focus:z-10 focus:text-orange-700 dark:bg-gray-700 dark:border-gray-600 dark:text-dark dark:hover:text-orange dark:hover:bg-gray-600 dark:focus:text-orange" >
        Monthly
    </button>
    <button class="px-2 py-1 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-orange-700 focus:z-10 focus:text-orange-700 dark:bg-gray-700 dark:border-gray-600 dark:text-dark dark:hover:text-orange dark:hover:bg-gray-600 dark:focus:text-orange">
        Yearly
    </button>
</div> */}
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
