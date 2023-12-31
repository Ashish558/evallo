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
   useUpdateAllSessionMutation,
   useUpdateSessionMutation,
} from "../../../app/services/session";
import SearchNames from "./Sections/searchNames";
import DateAndTimeInput from "./Sections/dateAndTimeInput";
import CCheckbox from "../../../components/CCheckbox/CCheckbox";
import DaysEndDate from "./Sections/daysEndDate";
import SessionInputs from "./Sections/sessionInputs";
import { sessionSchema } from "./schema/schema";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import { useLazyGetTutorDetailsQuery } from "../../../app/services/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
      specialization: "",
      topicsCovered: "",
      rescheduling: false,
      partialSession: false,
      studentMood: "",
      homeworkAssigned: "",
      sessionNotes: "",
      clientNotes: {
         date: "",
         note: ""
      },
      internalNotes: {
         date: "",
         note: ""
      },
      feedbackStars: 0,
      whiteboardLink: '',
      sessionTags: []
   });

   // console.log('defaultEventData---', defaultEventData);
   // console.log('isUpdating---', isUpdating);
   // console.log('data---', data);
   const [submitDisabled, setSubmitDisabled] = useState(false)
   const navigate = useNavigate()
   const [days, setDays] = useState(tempDays);
   const [topics, setTopics] = useState([]);
   const [studentMoods, setStudentMoods] = useState([]);
   const [homeworks, setHomeworks] = useState([]);
   const [isProductive, setIsProductive] = useState([]);
   const [servicesAndSpecialization, setServicesAndSpecialization] = useState([])
   const [allServicesAndSpec, setAllServicesAndSpec] = useState([])
   const [specializations, setSpecializations] = useState([])
   const [tutor, setTutor] = useState("");
   const [loading, setLoading] = useState(false)

   // noteType
   const [noteType, setNoteType] = useState("clients");

   const [submitSession, sessionResponse] = useSubmitSessionMutation();
   const [updateUserSession, updateUserSessionResp] = useUpdateSessionMutation();
   const [updateAllUserSession, updateAllUserSessionResp] = useUpdateAllSessionMutation();
   const [updateSessionStatus, updateSessionStatusResp] = useLazyUpdateSessionStatusQuery();
   const [submitFeedback, submitFeedbackResp] = useSubmitFeedbackMutation();
   const [getSessionFeedback, getSessionFeedbackResp] = useLazyGetSessionFeedbackQuery();
   const [cancelSession, cancelSessionResp] = useLazyCancelSessionQuery()
   const [missSession, missSessionResp] = useLazySessionMissedQuery()
   const [deleteSession, deleteSessionResp] = useDeleteSessionMutation()
   const [deleteAllSession, deleteAllSessionResp] = useDeleteAllRecurringSessionMutation()
   const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery()
   const [allSessionTags, setAllSessionTags] = useState([])

   const [inputFeedback, setInputFeedback] = useState(0)

   const [student, setStudent] = useState("");

   const [fetchSettings, settingsResponse] = useLazyGetSettingsQuery();
   const [services, setServices] = useState([])
   const { id: currentUserId } = useSelector(state => state.user)
   const { organization } = useSelector((state) => state.organization);
   const [tutorId2, setTutorId2] = useState(null)
   const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
   const [editingAllowed, setEditingAllowed] = useState(true)

   useEffect(() => {
      if (organization?.settings?.permissions && persona === 'tutor') {
         if (organization?.settings?.permissions[5].choosedValue === false) {
            setEditingAllowed(false)
         } else {
            setEditingAllowed(true)
         }
      } else {
         setEditingAllowed(true)
      }
   }, [organization])

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
            data.service === '' ||
            data.tutorId === '' ||
            data.studentId === ''
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
            data.tutorId === '' ||
            data.studentId === '' ||
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
         const { date, tutorId, tutorName, timeZone } = defaultEventData
         let formattedDate = date?.getDate()
         if (formattedDate < 10) {
            formattedDate = `0${formattedDate}`
         }
         // let defDate = `${date.getFullYear()}-${date.getMonth() + 1}-${formattedDate}`
         let defDate = getFormattedDate(date)
         let hours = defaultEventData.date?.getHours()
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

         let tz = ''
         if (timeZone === 'Asia/Kolkata') {
            tz = 'IST'
         } else if (timeZone === 'US/Alaska') {
            tz = 'AKST'
         } else if (timeZone === 'US/Central') {
            tz = 'CST'
         } else if (timeZone === 'US/Eastern') {
            tz = 'EST'
         } else if (timeZone === 'US/Hawaii') {
            tz = 'HST'
         } else if (timeZone === 'US/Mountain') {
            tz = 'MST'
         } else if (timeZone === 'US/Pacific') {
            tz = 'PST'
         }
         setData((prev) => {
            return {
               ...prev,
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
               timeZone: tz ? tz : ''
            }

         })
         setTutorId2(tutorId)
         setTutor(tutorName ? tutorName : '')

      }
   }, [defaultEventData, isUpdating])
   const [stopUpdating, setStopUpdating] = useState(true)

   useEffect(() => {
      if (organization?.settings) {
         if (persona === "tutor" && organization && organization?.settings?.permissions?.length > 5 && organization?.settings?.permissions[5]?.choosedValue === false) {
            setStopUpdating(false)
         }
         if (Object.keys(organization?.settings).length > 0) {
            // console.log('organization', organization.settings);
            let sessionTags = organization.settings.sessionTags;
            setAllSessionTags(sessionTags)
            let tempSessionTags = sessionTags.map(item => {
               return {
                  ...item,
                  items: []
               }
            })
            setData((prev) => {
               return {
                  ...prev,
                  sessionTags: tempSessionTags
               }

            })
            setAllServicesAndSpec(organization.settings.servicesAndSpecialization)
            setServices(organization.settings.Expertise);
            setIsSettingsLoaded(true);
         }
      }
   }, [organization]);

   useEffect(() => {
      if (isUpdating) {
         let startTime = convertTime12to24(
            `${sessionToUpdate.time.start.time} ${sessionToUpdate.time.start.timeType}`
         );
         // console.log(startTime)
         // console.log("isUpdating")
         let startDate = new Date(sessionToUpdate.date)
         const offset = startDate.getTimezoneOffset() * 60000
         if (offset > 0) {
            // startDate = startDate + offset
            startDate = new Date(startDate.getTime() + offset)
         }
         startDate.setHours(0);
         startDate.setMinutes(0);

         setData({
            ...data,
            studentName: sessionToUpdate.studentName,
            studentId: sessionToUpdate.studentId,
            tutorId: sessionToUpdate.tutorId,
            // date: getFormattedDate(sessionToUpdate.date),
            date: getFormattedDate(startDate),
            time: sessionToUpdate.time,
            timeZone: sessionToUpdate.timeZone,
            recurring: sessionToUpdate.recurring,

            endDate: getFormattedDate(sessionToUpdate.endDate),
            session: sessionToUpdate.session,
            sessionStatus: sessionToUpdate.sessionStatus,
            rescheduling: sessionToUpdate.resheduling,
            service: sessionToUpdate.service,
            sessionNotes: sessionToUpdate.sessionNotes,
            sessionTags: sessionToUpdate.sessionTags,
            specialization: sessionToUpdate.specialization,
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
      if (isUpdating) {
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
   }, [sessionToUpdate]);

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

   const updateSession = async (reqBody, isUpdaingAll, sDate) => {
      // console.log(sessionToUpdate)
      // console.log(reqBody)
      let body = { ...reqBody }
      if (isUpdaingAll !== true) {
         delete body['date']
         body.date = sDate
      }

      // console.log('isUpdaingAll', isUpdaingAll);
      console.log('sDate', sDate);
      console.log('body', body);
      // return
      if (body.sessionStatus === "Completed") {
         await updateSessionStatus(sessionToUpdate._id)
            .then(res => {
               if (res.error) return
               // updateUserSession({ id: sessionToUpdate._id, body: { sessionStatus: 'Completed', _id: sessionToUpdate._id } }).then(
               //    (res) => {
               //       console.log(res);
               //       refetchSessions()
               //       setEventModalActive(false);
               //    }
               // );
            })
      }
      if (body.sessionStatus === "Missed") {
         await missSession(sessionToUpdate._id)
            .then(res => {
               if (res.error) {
                  alert(res.error.data.message)
                  console.log('miss session err', res.error);
               }
               // updateUserSession({ id: sessionToUpdate._id, body: { sessionStatus: 'Missed', _id: sessionToUpdate._id } }).then(
               //    (res) => {
               //       console.log(res);
               //       refetchSessions()
               //       setEventModalActive(false);
               //    }
               // );
               console.log(res.data)
            })
      }
      if (body.sessionStatus === "Cancelled") {
         await cancelSession(sessionToUpdate._id)
            .then(res => {
               if (res.error) {
                  if (res.error.data && res.error.data.message) {
                     console.log(res.error.data.message);
                     alert(res.error.data.message)
                  }
                  return
               }
               // updateUserSession({ id: sessionToUpdate._id, body: { sessionStatus: 'Cancelled', _id: sessionToUpdate._id } }).then(
               //    (res) => {
               //       console.log(res);
               //       refetchSessions()
               //       setEventModalActive(false);
               //    }
               // );
            })
      }
      delete body['sessionStatus']
      if (isUpdaingAll === true) {
         updateAllUserSession({ id: sessionToUpdate._id, body: { ...body, sessionStatus: 'Scheduled' } }).then(
            (res) => {
               console.log(res);
               setLoading(false)
               refetchSessions()
               setEventModalActive(false);
            }
         );

      } else {
         delete body['sessionStatus']
         updateUserSession({ id: sessionToUpdate._id, body: { ...body, _id: sessionToUpdate._id } }).then(
            (res) => {
               console.log(res);
               refetchSessions()
               setEventModalActive(false);
            }
         );
      }
   };

   const handleSubmit = (isUpdatingAll) => {
      //  sessionSchema.validate(data)
      // .then(valid => {
      //    console.log(valid)
      // }).catch(err => {
      //    console.log(err)
      // })
      // console.log('s name', data.studentId);
      // console.log('t name', data.tutorId);
      // return

      if (!isUpdating && data.recurring === true) {
         if (new Date(data.endDate) < new Date()) {
            return alert('End date should be a future date')
         }
      }
      setLoading(true)
      let reqBody = { ...data }
      const offset = new Date(reqBody.endDate).getTimezoneOffset() * 60000
      if (offset > 0) {
         const endDateUpdated = new Date(new Date(reqBody.endDate).getTime() + offset)
         reqBody.endDate = endDateUpdated
      }
      reqBody.studentName = student
      reqBody.tutorName = tutor
      let day = []
      days.map((d) => {
         if (d.checked) day.push(d.full);
      });
      reqBody.day = day;
      // reqBody.topicsCovered = getCheckedString(topics)
      // reqBody.homeworkAssigned = getCheckedString(homeworks)
      // reqBody.studentMood = getCheckedString(studentMoods)
      // reqBody.sessionProductive = getCheckedString(isProductive)[0]
      if (reqBody.sessionProductive === undefined) {
         reqBody.sessionProductive = ''
      }
      const { start, end } = reqBody.time

      if (reqBody.time.start.timeType === 'am') {
         reqBody.time.start.timeType = 'AM'
      }
      if (reqBody.time.start.timeType === 'pm') {
         reqBody.time.start.timeType = 'PM'
      }
      if (reqBody.time.end.timeType === 'am') {
         reqBody.time.end.timeType = 'AM'
      }
      if (reqBody.time.end.timeType === 'pm') {

         reqBody.time.end.timeType = 'PM'
      }
      let startTime = convertTime12to24(`${start.time} ${start.timeType}`)
      let endTime = convertTime12to24(`${end.time} ${end.timeType}`)
      let startT = moment(`2016-06-06T${startTime}:00`)
      let endT = moment(`2016-06-06T${endTime}:00`)

      var duration = endT.diff(startT, 'hours')
      reqBody.total_hours = duration
      if (reqBody.timeZone === '') reqBody.timeZone = 'Asia/Kolkata'
      let date = moment(new Date(reqBody.date));
      // console.log(date);
      // let rInterval = moment((date)).recur().every(["Saturday"]).daysOfWeek().every(2).week();
      // console.log(rInterval);
      let sDate = reqBody.date
      if (reqBody.recurring === false) {
         delete reqBody['date']
         reqBody.date = [sDate]
      } else {
         let sDate = new Date(reqBody.date)
         const offset = sDate.getTimezoneOffset() * 60000
         if (offset > 0) {
            // startDate = startDate + offset
            sDate = new Date(sDate.getTime() + offset)
         }
         // sDate.setHours(0)
         // sDate.setMinutes(0)
         const dates = []
         delete reqBody['date']
         // console.log('sDate', sDate);
         // console.log('day', sDate.getDay());
         sDate.setHours(0);
         sDate.setMinutes(0);
         const currentDay = sDate.getDay()
         const currentDate = sDate.getDate()
         // console.log('START DATE ', sDate);

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

      // if (reqBody.timeZone === 'CST') {
      //    reqBody.timeZone = "US/Central"
      // }
      // if (reqBody.timeZone === 'EST') {
      //    reqBody.timeZone = "US/Eastern"
      // }
      // if (reqBody.timeZone === 'IST') {
      //    reqBody.timeZone = "Asia/Kolkata"
      // }
      // if (reqBody.timeZone === 'AKST') {
      //    reqBody.timeZone = "US/Alaska"
      // }
      // if (reqBody.timeZone === 'HST') {
      //    reqBody.timeZone = "US/Hawaii"
      // }
      // if (reqBody.timeZone === 'MST') {
      //    reqBody.timeZone = "US/Mountain"
      // }
      // if (reqBody.timeZone === 'PST') {
      //    reqBody.timeZone = "US/Pacific"
      // }

      // setLoading(false)
      // return
      if (isUpdating && isUpdatingAll) return updateSession(reqBody, isUpdatingAll, sDate);
      if (isUpdating) return updateSession(reqBody, isUpdatingAll, sDate);

      submitSession(reqBody).then((res) => {
         // console.log(res)
         setLoading(false)
         if (res?.error?.data?.message) {
            alert("Error occured while scheduling a session , please try again!")
         }
         else {
            setEventModalActive(false)
            refetchSessions()
         }

      })
   }
   //console.log(data);
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
   const [deleteAll, SetDeleteAll] = useState(false)
   const handleDeleteSession = () => {
      setLoading(true)
      deleteSession(sessionToUpdate._id)
         .then(res => {
            setLoading(false)
            if (res.error) return console.log(res.error);
            console.log(res.data);
            refetchSessions()
            setEventModalActive(false)
         })
   }

   const handleDeleteAllSession = () => {
      setLoading(true)
      deleteAllSession(sessionToUpdate._id)
         .then(res => {
            setLoading(false)
            if (res.error) return console.log(res.error);
            console.log(res.data);
            refetchSessions()
            setEventModalActive(false)
         })
   }
   useEffect(() => {
      if (persona === 'tutor') {
         setData((prev) => {
            return {
               ...prev,
               tutorId: tutorId2,
               tutorName: tutor
            }
         })

      }
   }, [tutorId2])

   useEffect(() => {
      // if (persona === 'tutor') {
      // console.log(data.tutorId);
      if (!data.tutorId) return
      // console.log("tutorDetails", data.tutorId)
      getUserDetail({ id: data.tutorId })
         .then(res => {
            if (res.error) {
               console.log('tutor err', res.error);
               return
            }
            // console.log(res.data.data);
            let details = res.data.data.details
            if (details === null) return
            if (details?.tutorServices?.length === 0) return alert('Tutor does not have any services')
            let services = details?.tutorServices?.map(item => item.service)
            let tutorServs = []
            allServicesAndSpec.forEach(item => {
               if (services?.includes(item.service)) {
                  tutorServs.push(item.service)
               }
            })
            // console.log('servicesallServicesAndSpec', allServicesAndSpec);
            // console.log('services', details.tutorServices, services);
            setServicesAndSpecialization(tutorServs)
         })
      // }

   }, [persona, data.tutorId, allServicesAndSpec])

   useEffect(() => {
      // console.log('all', allServicesAndSpec)

      let specs = []
      allServicesAndSpec.map(item => {
         if (item.service === data.service) {
            specs = item.specialization
         }
      })
      // console.log('spec', specs)
      // console.log('servicesAndSpecialization', servicesAndSpecialization, specs)
      setSpecializations(specs)
   }, [servicesAndSpecialization, data.service, allServicesAndSpec])

   useEffect(() => {
      if (isUpdating) {
         const { time: initialTime } = sessionToUpdate
         const { time: changedTime } = data

         let startDate = new Date(sessionToUpdate.date)
         const offset = startDate.getTimezoneOffset() * 60000
         if (offset > 0) {
            startDate = new Date(startDate.getTime() + offset)
         }
         startDate.setHours(0);
         startDate.setMinutes(0);

         if (initialTime.start.time === changedTime.start.time &&
            initialTime.start.timeType === changedTime.start.timeType &&
            initialTime.end.time === changedTime.end.time &&
            initialTime.end.timeType === changedTime.end.timeType &&
            sessionToUpdate.timeZone === data.timeZone &&
            getFormattedDate(startDate) === data.date
         ) {
            setData(prev => ({ ...prev, rescheduling: false }))
         } else {
            setData(prev => ({ ...prev, rescheduling: true }))
         }
      }
   }, [isUpdating, sessionToUpdate?.time, data?.time, sessionToUpdate?.date, data?.date])
   const [deleteBulkModalActive, setDeleteBulkModalActive] = useState(false)
   const handleSessiontagChange = (item, tagId) => {
      console.log("tagssss", data.sessionTags, item, tagId)
      let check = false;
      data.sessionTags.map(tag => {
         if (tag._id === tagId) {
            check = true;
         }
      })
      console.log("tagss", check)
      if (!check) {
         let tempSessionTag = data.sessionTags
         tempSessionTag.push({ _id: tagId, items: [item] })
         setData({ ...data, sessionTags: tempSessionTag })
         return
      }

      const tempSessionTag = data.sessionTags.map(tag => {
         if (tag._id === tagId) {
            let items = [...tag.items]
            if (tag.items.includes(item)) {
               items = items.filter(text => text !== item)
            } else {
               items.push(item)
            }
            return { ...tag, items }
         } else {
            return { ...tag }
         }
      })
      setData({ ...data, sessionTags: tempSessionTag })

   }
   const dataProps = { data, setData }
   //  console.log({isEditable})
   return (
      <>
         <Modal
            classname="max-w-[827px]  mx-auto overflow-y-auto custom-scroller h-full"
            handleClose={() => setEventModalActive(false)}
            wrapperClassName='flex flex-col h-full'
            title={isEditable === false ? 'Session Details' : isUpdating ? "Update Session" : ` ${persona == "tutor" ? "Session Details" : "Schedule New Session"}`}

            body={
               <>
                  <div className="overflow-y-auto custom-scroller">
                     <div className={`pr-4 ${editingAllowed ? '' : 'disabled pointer-events-none'}`}>
                        <SearchNames setStudent={setStudent}
                           setData={setData} student={student} tutor={tutor} data={data}
                           setTutor={setTutor}
                           isEditable={isEditable && stopUpdating} />

                        <DateAndTimeInput {...dataProps} isEditable={isEditable && stopUpdating} />

                        <div className={`flex mb-3 items-center ${!isEditable ? 'pointer-events-none ' : ''} `}>
                           <CCheckbox checked={data.recurring} name='recurring' onChange={() =>
                              setData({
                                 ...data,
                                 recurring: !data.recurring,
                              })} disabled={!isEditable || !stopUpdating} />
                           <p className="font-medium text-[#26435F] text-[18.6px]">
                              Recurring
                           </p>
                        </div>

                        <DaysEndDate isEditable={isEditable && stopUpdating} days={days} setDays={setDays} {...dataProps} />


                        <div className="flex mb-7">
                           <InputSelect
                              label="Service"
                              labelClassname="font-semibold text-[18.6px] text-[#26435F]"
                              value={data.service}
                              onChange={(val) => {
                                 // console.log(val)
                                 data.service !== val && setData({ ...data, service: val, specialization: '' })
                              }}
                              required={true}
                              optionData={servicesAndSpecialization}
                              inputContainerClassName={`bg-lightWhite pt-3.5 pb-3.5 border-0 font-medium pr-3 text-[#507CA8] shadow-[0_0_2px_0_rgba(0, 0, 0, 0.25)]
                       `}
                              inputClassName="bg-transparent appearance-none font-medium pt-4 pb-4 text-[#507CA8]"
                              placeholder="Select"
                              parentClassName={`w-full mr-8 
                         ${persona === "parent" ? " order-2" : ""}
                        `}
                              type="select"
                              disabled={!isEditable || !stopUpdating}
                           />
                           <InputSelect
                              label="Topic"
                              labelClassname="font-semibold text-[18.6px] text-[#26435F]"
                              value={data.specialization}
                              onChange={(val) => {
                                 // console.log(val)
                                 setData({ ...data, specialization: val })
                              }}
                              // optionType='object'
                              optionData={specializations}
                              inputContainerClassName={`bg-lightWhite pt-3.5 pb-3.5 border-0 font-medium pr-3 text-[#507CA8]
                       `}
                              inputClassName="bg-transparent appearance-none font-medium pt-4 pb-4 text-[#507CA8] shadow-[0_0_2px_0_rgba(0, 0, 0, 0.25)]"
                              placeholder="Select"
                              parentClassName={`w-full ml-2
                        ${persona === "parent" ? " order-2" : ""}
                        `}
                              type="select"
                              disabled={!isEditable || !stopUpdating}

                           />

                           {
                              persona === 'admin' || persona === 'tutor' ?
                                 <></>
                                 // <InputSelect
                                 //    label="Services"
                                 //    labelClassname="ml-3"
                                 //    value={data.specialization}
                                 //    onChange={(val) =>
                                 //       setData({ ...data, specialization: val })
                                 //    }
                                 //    optionData={servicesAndSpecialization.filter(item => item.service)}
                                 //    inputContainerClassName={`bg-lightWhite pt-3.5 pb-3.5 border-0 font-medium pr-3
                                 //   `}
                                 //    inputClassName="bg-transparent appearance-none font-medium pt-4 pb-4"
                                 //    placeholder="Service"
                                 //    parentClassName={`w-full mr-4 max-w-373 self-end`}
                                 //    type="select"
                                 //    disabled={!isEditable}
                                 // />
                                 : <></>
                           }

                        </div>


                        <div className="mt-4  flex ">
                           <InputField
                              label="Meeting Link"
                              biggerText={true}
                              labelClassname="ml-3 text-[#26435F] font-medium text-[18.6px]"
                              placeholder="Add a meeting link or GPS location here"
                              parentClassName="w-full mr-8"
                              inputContainerClassName="bg-lightWhite border-0 pt-3.5 pb-3.5 h-[53px]"
                              inputClassName="bg-transparent text-[16px] text-[#507CA8] shadow-[0_0_2px_0_rgba(0, 0, 0, 0.25)]"
                              type="text"
                              required={true}
                              value={data.session}
                              onChange={(e) =>
                                 setData({
                                    ...data,
                                    session: e.target.value,
                                 })
                              }
                              disabled={!isEditable || !stopUpdating}
                           />
                           <InputField
                              parentClassName="w-full ml-2"
                              label="Whiteboard Link"
                              biggerText={true}
                              placeholder="Add a relevant whiteboard link here"
                              labelClassname="ml-3 text-[#26435F] font-medium text-[18.6px]"
                              inputContainerClassName="bg-lightWhite border-0  pt-3.5 pb-3.5 h-[53px]"
                              inputClassName="bg-transparent appearance-none text-[16px] text-[#507CA8] shadow-[0_0_2px_0_rgba(0, 0, 0, 0.25)]"
                              value={data.whiteboardLink}
                              type="text"
                              onChange={(e) =>
                                 setData({ ...data, whiteboardLink: e.target.value })
                              }
                              disabled={!isEditable || !stopUpdating}
                           />


                        </div>
                        {
                           persona == "parent" &&
                           <div className="h-[1.3px] mt-[28px] bg-[rgba(0,0,0,0.20)] "></div >
                        }
                        <div className="h-[1.33px] w-full bg-[rgba(0,0,0,0.20)] mt-[28px]"></div>
                        {/* SESSIONS */}
                        <SessionInputs {...dataProps} status={status} isEditable={isEditable && stopUpdating} />



                        {
                           (persona == "parent" || persona == "student") && <div className="mt-[30px] mb-8">
                              <p className="font-medium  text-[#26435F] text-xl">
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
                                 rows={6}
                                 className="bg-white border border-[#D0D5DD] w-full outline-0 px-[17px] py-[14px] rounded-[6px] text-[#507CA8] text-[18.6px]"
                              ></textarea>
                              {/* <p className="text-right text-xs text-primary-80">
                           0/200
                        </p> */}
                           </div>
                        }
                        {
                           persona == "student" &&
                           <div className="h-[1.33px] bg-[rgba(0,0,0,0.20)]"></div>
                        }
                        {persona !== "student" && persona !== "parent" && (
                           <>
                              <div className="mt-7 mb-5 w-full  ">
                                 {
                                    allSessionTags.map(tag => {
                                       return <div key={tag._id} >
                                          <p className="font-medium mb-2.5">
                                             {tag.heading}
                                          </p>
                                          <div className="flex !flex-wrap gap-3">
                                             {tag.items.length > 0 &&
                                                tag.items.map((item, idx) => {
                                                   const currentUserSession = data.sessionTags.find(dataSessionTag => dataSessionTag._id === tag._id)
                                                   let checked = false
                                                   if (currentUserSession?.items.includes(item)) {
                                                      checked = true
                                                   }
                                                   return (
                                                      <div
                                                         key={idx}
                                                         className="flex mb-4 mr-3"
                                                         onClick={() => {
                                                            if (stopUpdating)
                                                               handleSessiontagChange(
                                                                  item,
                                                                  tag._id,
                                                               )
                                                         }
                                                         }
                                                      >
                                                         <CCheckbox
                                                            checked={checked}
                                                            name="topic"
                                                         />
                                                         <p className="font-medium text-[#507CA8] text-[18.667px]">
                                                            {item}
                                                         </p>
                                                      </div>
                                                   );
                                                })}
                                          </div>
                                       </div>;
                                    })
                                 }
                              </div>

                              {persona == "admin" ? <div className="mb-8">
                                 <div className="w-[320px] h-[30px] flex justify-start items-center border-b border-[#B3BDC7]">
                                    <p
                                       className={`w-[140px] h-[40px] font-medium mb-2.5 text-[#26435F] text-[18.6px] mr-[40px] ${noteType == "clients" ? "border-b-2 border-[#FFA28D]" : "border-0"}`}
                                       onClick={() => {
                                          setNoteType("clients")
                                       }}>
                                       Clients Notes
                                    </p>

                                    <p className={`w-[140px] h-[40px] font-medium mb-2.5 text-[#26435F] text-[18.6px] ${noteType == "internal" ? "border-b-2 border-[#FFA28D]" : "border-0"}`}
                                       onClick={() => {
                                          setNoteType("internal")
                                       }}
                                    >
                                       Internal Notes
                                    </p>
                                 </div>
                                 <div className="py-2">
                                    {noteType == "clients" ? <textarea
                                       placeholder="Session notes that are added in this box will be visible to clients (parents and students). If you want to add notes that are hidden from them, please use Internal Notes."
                                       value={data.sessionNotes}
                                       onChange={(e) => {
                                          let internalNotes2 = { note: "", date: "" }
                                          if (persona === 'tutor' && e.target.value) {
                                             internalNotes2 = {
                                                note: e.target.value,
                                                date: new Date()
                                             }
                                          }

                                          let clientNotes2 = { note: "", date: "" }
                                          if (persona === 'admin' && e.target.value) {
                                             clientNotes2 = {
                                                note: e.target.value,
                                                date: new Date()
                                             }
                                          }
                                          if (persona === 'tutor')
                                             setData({
                                                ...data,
                                                sessionNotes: e.target.value,
                                                internalNotes: internalNotes2,

                                             })
                                          if (persona === 'admin')
                                             setData({
                                                ...data,
                                                sessionNotes: e.target.value,
                                                clientNotes: clientNotes2,

                                             })
                                       }
                                       }
                                       rows={3}
                                       className="bg-lightWhite outline-0 px-5 py-4 rounded w-full h-[200px]"
                                    ></textarea>
                                       :
                                       <textarea
                                          placeholder="Session notes that are added in this box will be visible to clients (parents and students). If you want to add notes that are hidden from them, please use Internal Notes."
                                          value={data.sessionNotes}
                                          onChange={(e) => {
                                             let internalNotes2 = { note: "", date: "" }
                                             if (persona === 'tutor' && e.target.value) {
                                                internalNotes2 = {
                                                   note: e.target.value,
                                                   date: new Date()
                                                }
                                             }

                                             let clientNotes2 = { note: "", date: "" }
                                             if (persona === 'admin' && e.target.value) {
                                                clientNotes2 = {
                                                   note: e.target.value,
                                                   date: new Date()
                                                }
                                             }
                                             if (persona === 'tutor')
                                                setData({
                                                   ...data,
                                                   sessionNotes: e.target.value,
                                                   internalNotes: internalNotes2,

                                                })
                                             if (persona === 'admin')
                                                setData({
                                                   ...data,
                                                   sessionNotes: e.target.value,
                                                   clientNotes: clientNotes2,

                                                })
                                          }
                                          }
                                          rows={3}
                                          className="bg-lightWhite w-full h-[200px] outline-0 px-5 py-4 rounded"
                                       ></textarea>
                                    }
                                 </div>

                              </div> : <div className="mb-8">
                                 <div>
                                    <p className="font-medium mb-2.5 text-[#26435F] text-[18.6px]">
                                       Session Notes
                                    </p>
                                 </div>
                                 <textarea
                                    placeholder="Session Notes"
                                    value={data.sessionNotes}
                                    onChange={(e) => {
                                       let internalNotes2 = { note: "", date: "" }
                                       if (persona === 'tutor' && e.target.value) {
                                          internalNotes2 = {
                                             note: e.target.value,
                                             date: new Date()
                                          }
                                       }

                                       let clientNotes2 = { note: "", date: "" }
                                       if (persona === 'admin' && e.target.value) {
                                          clientNotes2 = {
                                             note: e.target.value,
                                             date: new Date()
                                          }
                                       }
                                       if (persona === 'tutor')
                                          setData({
                                             ...data,
                                             sessionNotes: e.target.value,
                                             internalNotes: internalNotes2,

                                          })
                                       if (persona === 'admin')
                                          setData({
                                             ...data,
                                             sessionNotes: e.target.value,
                                             clientNotes: clientNotes2,

                                          })
                                    }
                                    }
                                    rows={3}
                                    className="bg-lightWhite w-full outline-0 px-5 py-4 rounded"
                                 ></textarea>
                                 <p className="text-right text-xs text-primary-80">
                                    {data.sessionNotes ? data.sessionNotes.length : '0'}/200
                                 </p>
                              </div>}


                           </>
                        )}
                     </div>
                  </div>

                  <div className={styles['bottom-buttons']} >
                     {persona === 'student' ? (
                        <div className="ml-4 mt-5">
                           <p className="font-medium text-center mb-4 text-[18px] text-[#26435F]">
                              How did this session go?
                           </p>
                           <div className="flex justify-center">
                              {[...Array(5)].map((x, i) => (
                                 <img
                                    src={inputFeedback - 1 < i ? StarIcon : StarActiveIcon}
                                    className={`mr-7 cursor-pointer ${data.sessionStatus?.toLowerCase() !== 'completed' ? 'pointer-events-none' : ''} `}
                                    onClick={() => {
                                       // setData(prev => ({ ...prev, feedbackStars: i + 1 }));
                                       // setInputFeedback(i + 1)
                                       handleFeedbackSubmit(i + 1)
                                    }}
                                 />
                              ))}
                           </div>
                        </div>
                     ) : <></>}
                     {
                        persona !== "student" && persona !== "parent" && stopUpdating && <div className="flex justify-center pt-4">
                           {isUpdating && sessionToUpdate.recurring === true ?
                              <div className="flex flex-1 px-4 justify-between">
                                 <div>

                                    <SecondaryButton
                                       children="Delete Current"
                                       className="text-lg py-3 mr-3 pl-1 pr-1 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60 text-white"
                                       onClick={() => {
                                          setDeleteBulkModalActive(true)
                                          SetDeleteAll(false)
                                       }}

                                       loading={loading}
                                    />
                                    <SecondaryButton
                                       children="Delete All"
                                       className="text-lg py-3 mr-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60 text-white"
                                       onClick={() => {
                                          setDeleteBulkModalActive(true)
                                          SetDeleteAll(true)
                                       }}

                                       loading={loading}
                                    />
                                 </div>
                                 <div className="flex items-center">
                                    <PrimaryButton
                                       children="Update Current"
                                       className="text-lg py-3 mr-3 pl-1 pr-1 whitespace-nowrap font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                       onClick={() => handleSubmit(false)}
                                       disabled={submitDisabled}
                                       loading={loading}
                                    />
                                    <PrimaryButton
                                       children="Update All"
                                       className="text-lg py-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                       onClick={() => handleSubmit(true)}
                                       disabled={submitDisabled}
                                       loading={loading}
                                    />
                                 </div>
                              </div>
                              : isUpdating ?
                                 <>

                                    <SecondaryButton
                                       children="Delete"
                                       className="text-lg py-3 mr-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                       onClick={() => {
                                          setDeleteBulkModalActive(true)
                                          SetDeleteAll(false)
                                       }}

                                       loading={loading}
                                    />
                                    <PrimaryButton
                                       children="Update"
                                       className="text-lg py-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                       onClick={() => handleSubmit(false)}
                                       disabled={submitDisabled}
                                       loading={loading}
                                    />
                                 </> :
                                 <PrimaryButton
                                    children="Schedule"
                                    className="text-lg py-3 !text-white font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                                    onClick={() => handleSubmit()}
                                    disabled={submitDisabled}
                                    loading={loading}
                                 />
                           }

                           {/* <PrimaryButton
                              children="Schedule"
                              className="text-lg py-3 pl-2 pr-2 font-medium px-7 h-[50px] w-[140px] disabled:opacity-60"
                              onClick={handleSubmit}
                              disabled={submitDisabled}
                           /> */}

                        </div>
                     }
                     {deleteBulkModalActive && (
                        <Modal
                           title={
                              <span className="leading-10 text-center">
                                 Please confirm that you want to delete the session(s).

                              </span>
                           }
                           titleClassName="mb-5 leading-10"
                           cancelBtn={true}
                           crossBtn={true}
                           cancelBtnClassName="max-w-140 !bg-transparent !border  !border-[#FFA28D]  text-[#FFA28D]"
                           primaryBtn={{
                              text: "Delete",
                              className: "w-[140px]  pl-4 px-4 !bg-[#FF7979] text-white",
                              onClick: () => deleteAll ? handleDeleteAllSession() : handleDeleteSession(),
                              bgDanger: true,
                              loading: loading,
                           }}
                           body={
                              <>
                                 <p className="text-base-17-5 mt-[-5px] text-[#667085] mb-10">
                                    <span className="font-semibold mr-1">⚠️ Note:</span>
                                    All deleted session data will be lost and you will NOT be able to recover it later. Note that this might also impact the Client's digital wallet accordingly. Read detailed documentation in Evallo’s  <span className="text-[#24A3D9] cursor-pointer" onClick={() => navigate('/support')}> knowledge base.</span>
                                 </p>
                              </>
                           }
                           handleClose={() => setDeleteBulkModalActive(false)}
                           classname={"max-w-[700px]  mx-auto"}
                        />
                     )}
                  </div>

               </>
            }
         />
      </>
   );
}
