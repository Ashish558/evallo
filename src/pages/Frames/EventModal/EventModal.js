import React, { useEffect, useState } from "react";
import moment from "moment";
import styles from "./style.module.css";
import InputField from "../../../components/InputField/inputField";
import Modal from "../../../components/Modal/Modal";
import CalendarIcon from "../../../assets/form/calendar.svg";
import StarIcon from "../../../assets/form/star.svg";
import StarActiveIcon from "../../../assets/form/starActive.svg";
import InputSelect from "../../../components/InputSelect/InputSelect";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import {
   capitalize,
   convertTime12to24,
   getFormattedDate,
   tConvert,
} from "../../../utils/utils";
import InputSearch from "../../../components/InputSearch/InputSearch";
import {
   useDeleteAllRecurringSessionMutation,
   useDeleteSessionMutation,
   useLazyCancelSessionQuery,
   useLazyGetSessionFeedbackQuery,
   useLazyGetSettingsQuery,
   useLazySessionMissedQuery,
   useLazyUpdateSessionStatusQuery,
   useSubmitFeedbackMutation,
   useSubmitSessionMutation,
   useUpdateSessionMutation,
} from "../../../app/services/session";
import SearchNames from "./Sections/searchNames";
import DateAndTimeInput from "./Sections/dateAndTimeInput";
import CCheckbox from "../../../components/CCheckbox/CCheckbox";
import DaysEndDate from "./Sections/daysEndDate";
import SessionInputs from "./Sections/sessionInputs";
import { sessionSchema } from "./schema/schema";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";

const timeZones = ["IST"];
const tempDays = [
   {
      id: 1,
      text: "M",
      full: "Mon",
      checked: false,
   },
   {
      id: 2,
      text: "T",
      full: "Tue",
      checked: false,
   },
   {
      id: 3,
      text: "W",
      full: "Wed",
      checked: false,
   },
   {
      id: 4,
      text: "T",
      full: "Thu",
      checked: false,
   },
   {
      id: 5,
      text: "F",
      full: "Fri",
      checked: false,
   },
   {
      id: 6,
      text: "S",
      full: "Sat",
      checked: false,
   },
   {
      id: 0,
      text: "S",
      full: "Sun",
      checked: false,
   },
];
const status = ["Scheduled", "Completed", "Missed", "Cancelled"];

export default function EventModal({
   setEventModalActive,
   isEditable,
   persona,
   isUpdating,
   sessionToUpdate,
   refetchSessions,
   defaultEventData
}) {
   const [data, setData] = useState({
      studentName: "",
      tutorName: "",
      studentId: "",
      tutorId: "",
      date: "",
      time: {
         start: {
            time: "",
            timeType: "",
         },
         end: {
            time: "",
            timeType: "",
         },
      },
      timeZone: "",
      recurring: false,
      day: [],
      endDate: "",
      session: "",
      sessionStatus: "",
      service: "",
      topicsCovered: "",
      rescheduling: false,
      studentMood: "",
      homeworkAssigned: "",
      sessionNotes: "",
      feedbackStars: 0
   });
   const [submitDisabled, setSubmitDisabled] = useState(false)



   const [days, setDays] = useState(tempDays);
   const [topics, setTopics] = useState([]);
   const [studentMoods, setStudentMoods] = useState([]);
   const [homeworks, setHomeworks] = useState([]);
   const [isProductive, setIsProductive] = useState([]);

   const [tutor, setTutor] = useState("");

   const [submitSession, sessionResponse] = useSubmitSessionMutation();
   const [updateUserSession, updateUserSessionResp] = useUpdateSessionMutation();
   const [updateSessionStatus, updateSessionStatusResp] = useLazyUpdateSessionStatusQuery();
   const [submitFeedback, submitFeedbackResp] = useSubmitFeedbackMutation();
   const [getSessionFeedback, getSessionFeedbackResp] = useLazyGetSessionFeedbackQuery();
   const [cancelSession, cancelSessionResp] = useLazyCancelSessionQuery()
   const [missSession, missSessionResp] = useLazySessionMissedQuery()
   const [deleteSession, deleteSessionResp] = useDeleteSessionMutation()
   const [deleteAllSession, deleteAllSessionResp] = useDeleteAllRecurringSessionMutation()

   const [inputFeedback, setInputFeedback] = useState(0)

   const [student, setStudent] = useState("");

   const [fetchSettings, settingsResponse] = useLazyGetSettingsQuery();
   const [services, setServices] = useState([]);

   const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
   const getCheckedItems = (strArr, array) => {
      let checkedItems = array.map((item) => {
         return strArr.includes(item.text)
            ? {
               ...item,
               checked: true,
            }
            : { ...item };
      });
      return checkedItems;
   };

   useEffect(() => {
      if (data.recurring === false) {
         if (
            data.time.start.time === '' ||
            data.time.start.timeType === '' ||
            data.time.end.time === '' ||
            data.time.end.timeType === '' ||
            data.timeZone === '' ||
            data.date === '' ||
            data.session === '' ||
            data.service === ''
         ) {
            setSubmitDisabled(true)
         } else {
            setSubmitDisabled(false)
         }
      } else {
         let day = []
         days.map((d) => {
            if (d.checked) day.push(d.full);
         });
         if (
            data.time.start.time === '' ||
            data.time.start.timeType === '' ||
            data.time.end.time === '' ||
            data.time.end.timeType === '' ||
            data.timeZone === '' ||
            data.date === '' ||
            data.session === '' ||
            data.service === '' ||
            data.endDate === '' ||
            day.length === 0
         ) {
            setSubmitDisabled(true)
         } else {
            setSubmitDisabled(false)
         }
      }
   }, [data, days])

   useEffect(() => {
      if (defaultEventData !== null && !isUpdating) {
         // console.log(defaultEventData)
         const { date, tutorId, tutorName } = defaultEventData
         let formattedDate = date.getDate()
         if (formattedDate < 10) {
            formattedDate = `0${formattedDate}`
         }
         // let defDate = `${date.getFullYear()}-${date.getMonth() + 1}-${formattedDate}`
         let defDate = getFormattedDate(date)
         let hours = defaultEventData.date.getHours()
         let endHours = hours + 1
         // console.log(endHours)
         if (hours < 10) {
            hours = `0${hours}`
         }
         if (endHours < 10) {
            endHours = `0${endHours}`
         }

         let formattedTime = tConvert(`${hours}:00`)
         let formattedEndTime = tConvert(`${endHours}:00`)
         if (endHours === 24) formattedEndTime = { time: "12:00", timeType: 'AM' }

         setData({
            ...data,
            date: defDate,
            tutorId: tutorId ? tutorId : '',
            tutorName: tutorName ? tutorName : '',
            time: {
               ...data.time,
               start: {
                  ...formattedTime
               },
               end: {
                  ...formattedEndTime
               }
            },
         })
         setTutor(tutorName ? tutorName : '')

      }
   }, [defaultEventData])

   useEffect(() => {
      fetchSettings().then((res) => {
         let sessionTags = res.data.data.setting.sessionTags;
         // console.log(sessionTags)
         let homeworks = sessionTags.homeworkAssigned.map((item) => {
            return {
               text: item,
               checked: false,
            };
         });
         setHomeworks(homeworks);
         let topics = sessionTags.topicsCovered.map((item) => {
            return {
               text: item,
               checked: false,
            };
         });
         setTopics(topics);

         let moods = sessionTags.studentMode.map((item) => {
            return {
               text: item,
               checked: false,
            };
         });
         setStudentMoods(moods);

         let productive = sessionTags.wasProductive.map((item) => {
            return {
               text: item,
               checked: false,
            };
         });
         setIsProductive(productive);
         // console.log(res.data.data.setting)
         setServices(res.data.data.setting.serviceSpecialisation);
         setIsSettingsLoaded(true);
      });
   }, []);

   useEffect(() => {
      if (isUpdating) {
         let startTime = convertTime12to24(
            `${sessionToUpdate.time.start.time} ${sessionToUpdate.time.start.timeType}`
         );
         // console.log(startTime)
         setData({
            ...data,
            studentName: sessionToUpdate.studentName,
            studentId: sessionToUpdate.studentId,
            tutorId: sessionToUpdate.tutorId,
            date: getFormattedDate(sessionToUpdate.date),
            time: sessionToUpdate.time,
            timeZone: sessionToUpdate.timeZone,
            recurring: sessionToUpdate.recurring,

            endDate: getFormattedDate(sessionToUpdate.endDate),
            session: sessionToUpdate.session,
            sessionStatus: sessionToUpdate.sessionStatus,
            rescheduling: sessionToUpdate.resheduling,
            service: sessionToUpdate.service,
            sessionNotes: sessionToUpdate.sessionNotes,
         });

         let checkedDays = days.map((day) => {
            return sessionToUpdate.day.includes(day.full)
               ? {
                  ...day,
                  checked: true,
               }
               : { ...day };
         });
         setDays(checkedDays);

         // console.log(sessionToUpdate.sessionProductive)
         setStudent(sessionToUpdate.studentName);
         setTutor(sessionToUpdate.tutorName);

         // console.log(sessionToUpdate)
      }
   }, [sessionToUpdate]);

   useEffect(() => {
      if (isSettingsLoaded && isUpdating) {
         setIsProductive(
            getCheckedItems(
               [sessionToUpdate.sessionProductive],
               isProductive
            )
         );
         setTopics(updateCheckedArr(sessionToUpdate.topicsCovered, topics));
         setHomeworks(
            updateCheckedArr(sessionToUpdate.homeworkAssigned, homeworks)
         );
         setStudentMoods(
            updateCheckedArr(sessionToUpdate.studentMood, studentMoods)
         );
      }
   }, [sessionToUpdate, isSettingsLoaded]);

   const updateCheckedArr = (strArr, arr, setArr) => {
      return arr.map((item) => {
         if (strArr.includes(item.text)) {
            return { ...item, checked: true };
         }
         return { ...item };
      });
   };


   const handleCheckboxChange = (text, arr, setValue, isSingle) => {
      if (isSingle) {
         const temp = arr.map((topic) => {
            return topic.text === text
               ? { ...topic, checked: !topic.checked }
               : { ...topic, checked: false };
         });
         setValue(temp);
      } else {
         const temp = arr.map((topic) => {
            return topic.text === text
               ? { ...topic, checked: !topic.checked }
               : { ...topic };
         });
         setValue(temp);
      }
   };

   const getCheckedString = (arr) => {
      let strArr = [];
      arr.map((item) => {
         if (item.checked) strArr.push(item.text);
      });
      return strArr;
   };

   const updateSession = (reqBody, isMultiple) => {
      // console.log(sessionToUpdate)
      // console.log(reqBody)
      let body = { ...reqBody }
      body.date = reqBody.date[0]
      
      // console.log(isMultiple);
      // return
      if (body.sessionStatus === "Completed") {
         updateSessionStatus(sessionToUpdate._id)
            .then(res => {
               if (res.error) return
               updateUserSession({ id: sessionToUpdate._id, body: { sessionStatus: 'Completed', _id: sessionToUpdate._id } }).then(
                  (res) => {
                     console.log(res);
                     refetchSessions()
                     setEventModalActive(false);
                  }
               );
            })
      }
      if (body.sessionStatus === "Missed") {
         missSession(sessionToUpdate._id)
            .then(res => {
               if (res.error){
                  alert(res.error.data.message)
                  console.log('miss session err', res.error);
               }
               updateUserSession({ id: sessionToUpdate._id, body: { sessionStatus: 'Missed', _id: sessionToUpdate._id } }).then(
                  (res) => {
                     console.log(res);
                     refetchSessions()
                     setEventModalActive(false);
                  }
               );
               console.log(res.data)
            })
      }
      if (body.sessionStatus === "Cancelled") {
         cancelSession(sessionToUpdate._id)
            .then(res => {
               if (res.error) {
                  if (res.error.data && res.error.data.message) {
                     console.log(res.error.data.message);
                     alert(res.error.data.message)
                  }
                  return
               }
               updateUserSession({ id: sessionToUpdate._id, body: { sessionStatus: 'Cancelled', _id: sessionToUpdate._id } }).then(
                  (res) => {
                     console.log(res);
                     refetchSessions()
                     setEventModalActive(false);
                  }
               );
            })
      }
      delete body['sessionStatus']
      updateUserSession({ id: sessionToUpdate._id, body: { ...body, _id: sessionToUpdate._id } }).then(
         (res) => {
            console.log(res);
            refetchSessions()
            setEventModalActive(false);
         }
      );
   };

   const handleSubmit = (isUpdatingAll) => {
      //  sessionSchema.validate(data)
      // .then(valid => {
      //    console.log(valid)
      // }).catch(err => {
      //    console.log(err)
      // })
      let reqBody = { ...data }
      reqBody.studentName = student
      reqBody.tutorName = tutor
      let day = []
      days.map((d) => {
         if (d.checked) day.push(d.full);
      });
      reqBody.day = day;
      reqBody.topicsCovered = getCheckedString(topics)
      reqBody.homeworkAssigned = getCheckedString(homeworks)
      reqBody.studentMood = getCheckedString(studentMoods)
      reqBody.sessionProductive = getCheckedString(isProductive)[0]

      const { start, end } = reqBody.time
      let startTime = convertTime12to24(`${start.time} ${start.timeType}`)
      let endTime = convertTime12to24(`${end.time} ${end.timeType}`)
      let startT = moment(`2016-06-06T${startTime}:00`)
      let endT = moment(`2016-06-06T${endTime}:00`)

      var duration = endT.diff(startT, 'hours')
      reqBody.total_hours = duration
      if (reqBody.timeZone === '') reqBody.timeZone = 'Asia/Kolkata'
      let date = moment(new Date(reqBody.date));
      console.log(date);
      // let rInterval = moment((date)).recur().every(["Saturday"]).daysOfWeek().every(2).week();
      // console.log(rInterval);
      let sDate = reqBody.date
      if (reqBody.recurring === false) {
         delete reqBody['date']
         reqBody.date = [sDate]
      } else {
         let sDate = new Date(reqBody.date)
         // sDate.setHours(0)
         // sDate.setMinutes(0)
         const dates = []
         delete reqBody['date']
         // console.log('sDate', sDate);
         // console.log('day', sDate.getDay());
         const currentDay = sDate.getDay()
         const currentDate = sDate.getDate()

         // console.log('days', tempDays);
         const daysTORecur = tempDays.map(item => {
            if (reqBody.day.includes(item.full)) return item.id
         }).filter(it => it !== undefined)
         // console.log('daysTORecur', daysTORecur);
         // console.log('req body days', reqBody.day);
         if (daysTORecur.length > 0) {
            daysTORecur.map(recurDay => {
               if (currentDay === recurDay) {
                  dates.push(sDate)
               } else if (recurDay > currentDay) {
                  let d1 = sDate
                  let up1 = new Date(d1).setDate(currentDate + recurDay - currentDay)
                  dates.push(new Date(up1))
               } else if (recurDay < currentDay) {
                  let d2 = sDate
                  let up2 = new Date(d2).setDate(currentDate + 7 + recurDay - currentDay)
                  dates.push(new Date(up2))
               }
            })
         } else {
            dates.push(sDate)
         }
         reqBody.date = dates
         console.log('dates', dates);
      }
      // console.log('reqBody', reqBody);
      // return
      if(isUpdating && isUpdatingAll) return  updateSession(reqBody, isUpdatingAll);
      if (isUpdating) return updateSession(reqBody, isUpdatingAll);

      submitSession(reqBody).then((res) => {
         console.log(res)
         setEventModalActive(false)
         refetchSessions()
      })
   }
   // console.log(data);
   const handleFeedbackSubmit = (rating) => {
      // console.log(rating)
      // console.log(sessionToUpdate)
      const { tutorId, studentId, _id } = sessionToUpdate
      const body = {
         tutorId: tutorId,
         studentId: studentId,
         sessionId: _id,
         rating: rating,
      }
      submitFeedback(body)
         .then(res => {
            if (res.error) {
               return console.log(res.error);
            }
            fetchFeedback()
            // console.log(res.data);
         })
   }

   const fetchFeedback = () => {
      getSessionFeedback(sessionToUpdate._id)
         .then(res => {
            if (res.error) {
               setInputFeedback(0)
               return console.log(res.error);
            }
            console.log('feedback', res.data);
            setInputFeedback(res.data.data.feedback.rating)
         })
   }
   useEffect(() => {
      if (!sessionToUpdate) return
      fetchFeedback()
   }, [sessionToUpdate])

   const handleDeleteSession = () => {
      deleteSession(sessionToUpdate._id)
         .then(res => {
            if (res.error) return console.log(res.error);
            console.log(res.data);
            refetchSessions()
            setEventModalActive(false)
         })
   }

   const handleDeleteAllSession = () => {
      deleteAllSession(sessionToUpdate._id)
         .then(res => {
            if (res.error) return console.log(res.error);
            console.log(res.data);
            refetchSessions()
            setEventModalActive(false)
         })
   }
   // console.log(convertTime12to24(`${data.time.end.time} ${data.time.end.timeType}`))
   // console.log(convertTime12to24('1:00 AM'))
   //console.log(data.feedbackStars);
   // console.log('sessionToUpdate', sessionToUpdate)
   // console.log('session data', data)

   const dataProps = { data, setData }
   return (
      <>
         <Modal
            classname="max-w-[750px] md:pl-6 md:pr-6 mx-auto max-h-[90vh] 2xl:max-h-[700px] overflow-y-auto scrollbar-content scrollbar-vertical"
            handleClose={() => setEventModalActive(false)}
            title={isEditable == false ? 'Session' : isUpdating ? "Update Session" : "Create a New Session"}
            body={
               <div className="text-sm" >
                  <SearchNames setStudent={setStudent}
                     setData={setData} student={student} tutor={tutor} data={data}
                     setTutor={setTutor}
                     isEditable={isEditable} />

                  <DateAndTimeInput {...dataProps} isEditable={isEditable} />

                  <div className="flex mb-3">
                     <CCheckbox checked={data.recurring} name='recurring' onChange={() =>
                        setData({
                           ...data,
                           recurring: !data.recurring,
                        })} disabled={!isEditable} />
                     <p className="font-medium text-primary-60 text-sm">
                        Recurring
                     </p>
                  </div>

                  <DaysEndDate isEditable={isEditable} days={days} setDays={setDays} {...dataProps} />

                  {/* SESSIONS */}
                  <SessionInputs {...dataProps} status={status} isEditable={isEditable} />
                  <div className="flex">
                     <InputSelect
                        label="Services"
                        labelClassname="ml-3"
                        value={data.service}
                        onChange={(val) =>
                           setData({ ...data, service: val })
                        }
                        optionData={services.map(item => item.text)}
                        inputContainerClassName={`bg-lightWhite pt-3.5 pb-3.5 border-0 font-medium pr-3
                       `}
                        inputClassName="bg-transparent appearance-none font-medium pt-4 pb-4"
                        placeholder="Service"
                        parentClassName={`w-full mr-4 max-w-373 self-end 
                        ${persona === "student" ? "mr-4" : ""} ${persona === "parent" ? " order-2" : ""}
                        `}
                        type="select"
                        disabled={!isEditable}
                     />

                     {persona === "student" && (
                        <div className="ml-4 mt-5">
                           <p className="font-medium mb-4">
                              Session Feedback
                           </p>
                           <div className="flex">
                              {[...Array(5)].map((x, i) => (
                                 <img
                                    src={inputFeedback - 1 < i ? StarIcon : StarActiveIcon}
                                    className="mr-7 cursor-pointer"
                                    onClick={() => {
                                       // setData(prev => ({ ...prev, feedbackStars: i + 1 }));
                                       // setInputFeedback(i + 1)
                                       handleFeedbackSubmit(i + 1)
                                    }}
                                 />
                              ))}
                           </div>
                        </div>
                     )}
                     {/* {persona === "parent" && (
                        <div className="mr-4 mt-5 order-1 flex-1">
                           <p className="font-medium mb-1">
                              Session Feedback
                           </p>
                           <div className="flex py-3 px-4 bg-lightWhite rounded-10">
                              {[...Array(5)].map((x, i) => (
                                 <img
                                    src={data.feedbackStars - 1 < i ? StarIcon : StarActiveIcon}
                                    className="mr-7 cursor-pointer"
                                    onClick={() => {
                                       setData(prev => ({ ...prev, feedbackStars: i + 1 }));
                                       handleFeedbackSubmit(i + 1)
                                    }}
                                 />
                              ))}
                           </div>
                        </div>
                     )} */}
                  </div>
                  {persona !== "student" && persona !== "parent" && (
                     <>
                        <div className="mt-7 mb-5">
                           <p className="font-medium mb-2.5">
                              Topics Covered
                           </p>
                           <div className="flex">
                              {topics.length > 0 &&
                                 topics.map((topic, idx) => {
                                    return (
                                       <div
                                          key={idx}
                                          className="flex mb-3 mr-3"
                                          onClick={() =>
                                             handleCheckboxChange(topic.text, topics,
                                                setTopics
                                             )
                                          }
                                       >
                                          <CCheckbox checked={topic.checked}
                                             name='topic'
                                          />
                                          <p className="font-medium text-primary-60 text-sm">
                                             {topic.text}
                                          </p>
                                       </div>
                                    );
                                 })}
                           </div>
                        </div>

                        <div className="mt-5 mb-5">
                           <p className="font-medium mb-2.5">
                              Student Mood
                           </p>
                           <div className="flex">
                              {studentMoods.length > 0 &&
                                 studentMoods.map((item, idx) => {
                                    return (
                                       <div
                                          key={idx}
                                          className="flex mb-3 mr-3"
                                          onClick={() => handleCheckboxChange(item.text, studentMoods, setStudentMoods)}
                                       >
                                          <CCheckbox checked={item.checked}
                                             name='moods'
                                          />
                                          <p className="font-medium text-primary-60 text-sm">
                                             {item.text}
                                          </p>
                                       </div>
                                    );
                                 })}
                           </div>
                        </div>

                        <div className="mt-5 mb-7">
                           <p className="font-medium  mb-2.5">
                              Homework Assigned
                           </p>
                           <div className="flex flex-wrap	">
                              {homeworks.length > 0 &&
                                 homeworks.map((item, idx) => {
                                    return (
                                       <div
                                          key={idx}
                                          className="flex mb-3 mr-6"
                                          onClick={() =>
                                             handleCheckboxChange(
                                                item.text,
                                                homeworks,
                                                setHomeworks
                                             )
                                          }
                                       >
                                          <CCheckbox checked={item.checked}
                                             name='homeworks'
                                          />
                                          <p className="font-medium text-primary-60 text-sm">
                                             {item.text}
                                          </p>
                                       </div>
                                    );
                                 })}
                           </div>
                        </div>

                        <div className="mt-5 mb-7">
                           <p className="font-medium mb-2.5">
                              Was the session Productive?
                           </p>
                           <div className="flex flex-wrap	">
                              {isProductive.map((item, idx) => {
                                 return (
                                    <div
                                       key={idx}
                                       className="flex mb-3 mr-6"
                                       onClick={() =>
                                          handleCheckboxChange(item.text, isProductive, setIsProductive, true)}
                                    >
                                       <CCheckbox checked={item.checked}
                                          name='productive'
                                       />
                                       <p className="font-medium text-primary-60 text-sm">
                                          {item.text}
                                       </p>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>

                        <div className="mb-8">
                           <p className="font-medium mb-2.5">
                              Session Notes
                           </p>
                           <textarea
                              placeholder="Session Notes"
                              value={data.sessionNotes}
                              onChange={(e) =>
                                 setData({
                                    ...data,
                                    sessionNotes: e.target.value,
                                 })
                              }
                              rows={3}
                              className="bg-lightWhite w-full outline-0 px-5 py-4 rounded"
                           ></textarea>
                           <p className="text-right text-xs text-primary-80">
                              0/200
                           </p>
                        </div>

                        <div className="flex justify-center">
                           {isUpdating && sessionToUpdate.recurring === true ?
                              <div className="flex flex-1 px-4 justify-between">
                                 <div>
                                    <SecondaryButton
                                       children="Delete Current"
                                       className="text-lg py-3 mr-3 pl-1 pr-1 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                       onClick={handleDeleteSession}
                                    />
                                    <SecondaryButton
                                       children="Delete All"
                                       className="text-lg py-3 mr-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                       onClick={handleDeleteAllSession}
                                    />
                                 </div>
                                 <div>
                                    <PrimaryButton
                                       children="Update Current"
                                       className="text-lg py-3 mr-3 pl-1 pr-1 whitespace-nowrap font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                       onClick={() => handleSubmit()}
                                       disabled={submitDisabled}
                                    />
                                    <PrimaryButton
                                       children="Update All"
                                       className="text-lg py-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                       onClick={() => handleSubmit(true)}
                                       disabled={submitDisabled}
                                    />
                                 </div>
                              </div>
                              : isUpdating ?
                                 <>
                                    <SecondaryButton
                                       children="Delete"
                                       className="text-lg py-3 mr-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                       onClick={handleDeleteSession}
                                    />
                                    <PrimaryButton
                                       children="Update"
                                       className="text-lg py-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                       onClick={handleSubmit}
                                       disabled={submitDisabled}
                                    />
                                 </> :
                                 <PrimaryButton
                                    children="Schedule"
                                    className="text-lg py-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                    onClick={handleSubmit}
                                    disabled={submitDisabled}
                                 />
                           }

                           {/* <PrimaryButton
                              children="Schedule"
                              className="text-lg py-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                              onClick={handleSubmit}
                              disabled={submitDisabled}
                           /> */}

                        </div>
                     </>
                  )}
               </div>
            }
         />
      </>
   );
}
