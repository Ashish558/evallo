import React, { useState } from "react";
import explore from "./../../assets/images/explore-bg.png";
import styles from "./StudentDashboardHeader.module.css";
import TutorItem from "../TutorItem/TutorItem";
import { useLazyGetSingleSessionQuery, useLazyGetStudentFeedbackQuery } from "../../app/services/session";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLazyGetTutorDetailsQuery } from "../../app/services/users";

const StudentDashboardHeader = () => {
   const [subject, setSubject] = useState("Maths");
   const [slot, setSlot] = useState("Jun 20, 2022 - Jul 30, 2022 ");
   const [fetchFeedbacks, fetchFeedbacksResp] = useLazyGetStudentFeedbackQuery()
   const [feedbacks, setFeedbacks] = useState([])
   const [allFeedbacks, setAllFeedbacks] = useState([])
   const { id } = useSelector(state => state.user)

   const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery()
   const [getSession, getSessionResp] = useLazyGetSingleSessionQuery()

   // console.log(id);
   useEffect(() => {
      fetchFeedbacks({ id })
         .then(({ error, data }) => {
            if (error) {
               console.log(error)
               return
            }
            data.data.feedback.map(feedback => {
               getUserDetail({ id: feedback.tutorId })
                  .then(res => {
                     const tutor = res.data.data.user
                     getSession(feedback.sessionId)
                        .then(res => {
                           const session = res.data.data.session
                           setFeedbacks(prev => {
                              let obj = {
                                 ...feedback,
                                 tutorName: `${tutor.firstName} ${tutor.lastName}`,
                                 service: session.service
                              }
                              let allFeedbacks = [...prev,
                              { ...obj }
                              ]
                              return allFeedbacks.sort(function (a, b) {
                                 return new Date(b.updatedAt) - new Date(a.updatedAt);
                              });
                           })
                        })
                  })
            })
         })
   }, [])

   useEffect(() => {
      let tempdata = []
      let tempsessions = []
      feedbacks.map(feedback => {
         if (tempsessions.includes(feedback.sessionId)) {
            return
         } else {
            tempdata.push(feedback)
            tempsessions.push(feedback.sessionId)
         }
      })
      setAllFeedbacks(tempdata)
   }, [feedbacks])


   const tutors = [
      { name: "Shivam Shrivasaba", designation: "Subject Tutoring at 17:00 on Nov 21" },
      { name: "Rohit Ransore", designation: "{{Service}} on MM/DD/YY HH:MM" },
      { name: "Shivam Shrivasaba", designation: "Subject Tutoring at 17:00 on Nov 21" },
      { name: "Rohit Ransore", designation: "{{Service}} on MM/DD/YY HH:MM" },
      { name: "Shivam Shrivasaba", designation: "Subject Tutoring at 17:00 on Nov 21" },
      { name: "Rohit Ransore", designation: "{{Service}} on MM/DD/YY HH:MM" },
      { name: "Shivam Shrivasaba", designation: "Subject Tutoring at 17:00 on Nov 21" },
      { name: "Rohit Ransore", designation: "{{Service}} on MM/DD/YY HH:MM" },
   ]

   return (
      <div className="flex h-[250px]" id={styles.StudentDashboardHeader}>
         <div id={styles.admissionExpert} className="w-3/5">
            <div className="flex">
               <div className="w-1/2 flex items-center">
                  <h1>This fall get help from our Admission Experts.</h1>
               </div>

               <div className="w-1/2 items-center">
                  <img src={explore} className='w-full object-contain' alt="" />
               </div>
            </div>
         </div>
         <div className="w-2/5 bg-white rounded-[20px] p-[22px] pr-0 h-[100%]">
            <div className="overflow-y-scroll h-[100%] pr-[22px]" id={styles.tutorList}>
               {allFeedbacks.map((item, idx) => <TutorItem key={idx} {...item} />)}
            </div>
         </div>
      </div>
   );
};

export default StudentDashboardHeader;
