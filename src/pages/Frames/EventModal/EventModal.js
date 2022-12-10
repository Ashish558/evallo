import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import InputField from "../../../components/InputField/inputField";
import Modal from "../../../components/Modal/Modal";
import CalendarIcon from "../../../assets/form/calendar.svg";
import StarIcon from "../../../assets/form/star.svg";
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
   useLazyGetSettingsQuery,
   useSubmitSessionMutation,
   useUpdateSessionMutation,
} from "../../../app/services/session";
import SearchNames from "./Sections/searchNames";
import DateAndTimeInput from "./Sections/dateAndTimeInput";
import CCheckbox from "../../../components/CCheckbox/CCheckbox";
import DaysEndDate from "./Sections/daysEndDate";
import SessionInputs from "./Sections/sessionInputs";
import { sessionSchema } from "./schema/schema";

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
      checked: true,
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
      id: 7,
      text: "S",
      full: "Sun",
      checked: false,
   },
];
const status = ["Scheduled", "Option 2"];

export default function EventModal({
   setEventModalActive,
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
   });

   const [days, setDays] = useState(tempDays);
   const [topics, setTopics] = useState([]);
   const [studentMoods, setStudentMoods] = useState([]);
   const [homeworks, setHomeworks] = useState([]);
   const [isProductive, setIsProductive] = useState([]);

   const [tutor, setTutor] = useState("");

   const [submitSession, sessionResponse] = useSubmitSessionMutation();
   const [updateUserSession, updateUserSessionResp] = useUpdateSessionMutation();

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
      if (defaultEventData !== null && !isUpdating) {
         console.log(defaultEventData)
         const { date } = defaultEventData
         let formattedDate = date.getDate()
         if (formattedDate < 10) {
            formattedDate = `0${formattedDate}`
         }
         let defDate = `${date.getFullYear()}-${date.getMonth() + 1}-${formattedDate}`
         
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
         if(endHours === 24) formattedEndTime={time: "12:00", timeType: 'AM'}

         setData({
            ...data,
            date: defDate,
            time: {
               ...data.time,
               start: {
                  ...formattedTime
               },
               end:{
                  ...formattedEndTime
               }
            },
         })

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

   const updateSession = (reqBody) => {
      // console.log(sessionToUpdate)
      console.log(reqBody);
      updateUserSession({ id: sessionToUpdate._id, body: reqBody }).then(
         (res) => {
            console.log(res);
            refetchSessions()
            setEventModalActive(false);
         }
      );
   };

   const handleSubmit = () => {
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

      if (isUpdating) return updateSession(reqBody);

      submitSession(reqBody).then((res) => {
         console.log(res)
         setEventModalActive(false)
         refetchSessions()
      })
   }

   // console.log(convertTime12to24(`${data.time.end.time} ${data.time.end.timeType}`))
   // console.log(convertTime12to24('1:00 AM'))
   const dataProps = { data, setData }
   return (
      <>
         <Modal
            classname="max-w-[800px] mx-auto xl:max-h-[95vh] overflow-y-auto scrollbar-content scrollbar-vertical"
            handleClose={() => setEventModalActive(false)}
            title={isUpdating ? "Update Session" : "Create a New Session"}
            body={
               <div>
                  <SearchNames setStudent={setStudent}
                     setData={setData} student={student} tutor={tutor} data={data}
                     setTutor={setTutor} />

                  <DateAndTimeInput {...dataProps} />

                  <div className="flex mb-3">
                     <CCheckbox checked={data.recurring} name='recurring' onChange={() =>
                        setData({
                           ...data,
                           recurring: !data.recurring,
                        })} />
                     <p className="font-medium text-primary-60 text-sm">
                        Recurring
                     </p>
                  </div>

                  <DaysEndDate days={days} setDays={setDays} {...dataProps} />

                  {/* SESSIONS */}
                  <SessionInputs {...dataProps} status={status} />
                  <div className="flex">
                     <InputSelect
                        label="Services"
                        labelClassname="ml-3"
                        value={data.service}
                        onChange={(val) =>
                           setData({ ...data, service: val })
                        }
                        optionData={services}
                        inputContainerClassName={`bg-lightWhite pt-3.5 pb-3.5 border-0 font-medium pr-3
                       `}
                        inputClassName="bg-transparent appearance-none font-medium pt-4 pb-4"
                        placeholder="Service"
                        parentClassName={`w-full mr-4 max-w-373 self-end 
                        ${persona === "student" ? "mr-4" : ""} ${persona === "parent" ? " order-2" : ""}
                        `}
                        type="select"
                     />

                     {persona === "student" && (
                        <div className="ml-4 mt-5">
                           <p className="font-medium mb-4">
                              Session Feedback
                           </p>
                           <div className="flex">
                              {[...Array(5)].map((x, i) => (
                                 <img
                                    src={StarIcon}
                                    className="mr-7"
                                 />
                              ))}
                           </div>
                        </div>
                     )}
                     {persona === "parent" && (
                        <div className="mr-4 mt-5 order-1 flex-1">
                           <p className="font-medium mb-1">
                              Session Feedback
                           </p>
                           <div className="flex py-3 px-4 bg-lightWhite rounded-10">
                              {[...Array(5)].map((x, i) => (
                                 <img
                                    src={StarIcon}
                                    className="mr-7"
                                 />
                              ))}
                           </div>
                        </div>
                     )}
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
                           <PrimaryButton
                              children="Schedule"
                              className="text-lg py-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px]"
                              onClick={handleSubmit}
                           />
                        </div>
                     </>
                  )}
               </div>
            }
         />
      </>
   );
}
