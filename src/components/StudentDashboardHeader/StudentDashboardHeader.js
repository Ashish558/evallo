import React, { useState } from "react";
import explore from "./../../assets/images/explore-bg.png";
import styles from "./StudentDashboardHeader.module.css";
import TutorItem from "../TutorItem/TutorItem";
import { useLazyGetSettingsQuery, useLazyGetSingleSessionQuery, useLazyGetStudentFeedbackQuery, useUpdateFeedbackMutation } from "../../app/services/session";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLazyGetTutorDetailsQuery } from "../../app/services/users";
import ImageSlideshow from "../ImageSlideshow/ImageSlideshow";

const StudentDashboardHeader = () => {
   const [subject, setSubject] = useState("Maths");
   const [fetchFeedbacks, fetchFeedbacksResp] = useLazyGetStudentFeedbackQuery()
   const [feedbacks, setFeedbacks] = useState([])
   const [allFeedbacks, setAllFeedbacks] = useState([])
   const { id } = useSelector(state => state.user)
   const [images, setImages] = useState([])
   const [fetchSettings, fetchSettingsResp] = useLazyGetSettingsQuery()

   const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery()
   const [getSession, getSessionResp] = useLazyGetSingleSessionQuery()
   const [updateFeedback, updateFeedbackResp] = useUpdateFeedbackMutation()

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
      feedbacks.map(feedback => {
         updateFeedback({ id: feedback._id, viewed: true })
            .then(({ error, data }) => {
               if (error) {
                  console.log(error)
                  return
               }
               // console.log('res', data);
            })
      })
   }, [feedbacks])

   useEffect(() => {
      fetchSettings()
         .then(res => {
            setImages(res.data.data.setting.offerImages)
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
      tempdata = tempdata.filter(item => item.viewed === false)
      setAllFeedbacks(tempdata)
   }, [feedbacks])


   return (
      <>
         {/* <div className="flex h-[250px]" id={styles.StudentDashboardHeader}>
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
         </div> */}

         <div className="flex flex-col lg:flex-row h-[500px] lg:h-[250px] max-w-[840px] relative gap-[16px] mb-[42px] mt-[37px] mr-[9px]">
            <div className="w-full relative h-full flex rounded-lg items-center overflow-hidden"
               id={styles.exploreBgDisable}
            // style={{ position: 'static', top: '0', left: '0' }} 
            >
               {
                  images.length >= 1 &&
                  <ImageSlideshow images={images} text='text' />
               }
            </div>
            <div className="w-full lg:w-2/5 bg-white rounded-[20px] p-[22px] pr-0 h-[100%]">
               <div className="overflow-y-auto h-[100%] pr-[22px]" id={styles.tutorList}>
                  {
                     allFeedbacks.length >= 1 ?
                        allFeedbacks.map((item, idx) => <TutorItem key={idx} {...item} />)
                        :
                        <p className="font-medium pt-6">No feedbacks given</p>
                  }
               </div>
            </div>
         </div>
      </>
   );
};

export default StudentDashboardHeader;
