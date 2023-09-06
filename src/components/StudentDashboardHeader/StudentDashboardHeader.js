import React, { useState } from "react";
import explore from "./../../assets/images/explore-bg.png";
import styles from "./StudentDashboardHeader.module.css";
import TutorItem from "../TutorItem/TutorItem";
import {
  useLazyGetCompletedSessionsQuery,
  useLazyGetSessionsQuery,
  useLazyGetSettingsQuery,
  useLazyGetSingleSessionQuery,
  useLazyGetStudentFeedbackQuery,
  useUpdateFeedbackMutation,
} from "../../app/services/session";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLazyGetTutorDetailsQuery } from "../../app/services/users";
import ImageSlideshow from "../ImageSlideshow/ImageSlideshow";
import TutorCarousel from "../TutorCarousel/TutorCarousel";

const StudentDashboardHeader = () => {
  const [subject, setSubject] = useState("Maths");
  const [fetchFeedbacks, fetchFeedbacksResp] = useLazyGetStudentFeedbackQuery();
  const [feedbacks, setFeedbacks] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const { id } = useSelector((state) => state.user);
  const [images, setImages] = useState([]);
  const [fetchSettings, fetchSettingsResp] = useLazyGetSettingsQuery();
  const [fetchUserSessions, fetchUserSessionsResponse] =
    useLazyGetCompletedSessionsQuery();
  const [feedbackSessions, setFeedbackSessions] = useState([]);
  const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery();
  const [getSession, getSessionResp] = useLazyGetSingleSessionQuery();
  const [updateFeedback, updateFeedbackResp] = useUpdateFeedbackMutation();
  const { organization } = useSelector((state) => state.organization);

  // console.log(id);

  const fetchSessions = () => {
    fetchUserSessions(id).then((res) => {
      if (res.error) return console.log(res.error);
      console.log("sessions", res.data.data.sessions);
      if (!res.data.data.sessions) return;
      setFeedbackSessions(res.data.data.sessions);
    });
  };
  useEffect(() => {
    fetchSessions();
  }, []);
  useEffect(() => {
    feedbacks.map((feedback) => {
      updateFeedback({ id: feedback._id, viewed: true }).then(
        ({ error, data }) => {
          if (error) {
            console.log(error);
            return;
          }
          // console.log('res', data);
        }
      );
    });
  }, [feedbacks]);

  useEffect(() => {
    setImages(organization?.settings?.offerImages);
  }, [organization?.settings?.offerImages]);

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

      <div className="flex flex-1  h-[210px] justify-between relative gap-[50px] mb-[42px] mt-[37px] ">
        <div className="flex-1 h-[215px]">
          <p className=" text-sm text-[#26435F] font-semibold">Announcements</p>

          <div
            className="w-full relative h-full flex rounded-md items-center overflow-hidden shadow-[0px_0px_2.500001907348633px_0px_#00000040]"
            id={styles.exploreBgDisable}
          >
            {images?.length >= 1 && (
              <ImageSlideshow images={images} text="text" />
            )}
          </div>
        </div>

        <div className="flex-1 mx-auto h-[210px]">
          <p className=" text-sm text-[#26435F] font-semibold">
            Assigned Tutors
          </p>
          <div className=".mybox relative shadow-[0px_0px_2.500001907348633px_0px_#00000040] border-b-4 border-b-[#26435F] h-[215px] rounded-md max-w-[440px]  design:max-w-[460px]">
          <div id="borderLeft" className="rounded-r-lg"></div>
            <TutorCarousel />
            
            <div id="borderRight" className="rounded-l-lg"></div>
            <div id="borderBottom" className="rounded-b-lg"></div>
          </div>
        </div>

        <div className=" flex-1 h-[210px]">
          <p className=" text-sm text-[#26435F] font-semibold ">
            Session Feedback
          </p>
          <div className="p-4 h-[215px] bg-white  rounded-md  shadow-[0px_0px_2.500001907348633px_0px_#00000040]">
            <div
              className="overflow-y-auto flex-1  h-[100%]"
              id={styles.tutorList}
            >
              {feedbackSessions.length >= 1 ? (
                feedbackSessions.map((item, idx) => (
                  <TutorItem
                    key={idx}
                    {...item}
                    setFeedbackSessions={setFeedbackSessions}
                  />
                ))
              ) : (
                <p className="font-medium pt-6">No feedbacks given</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboardHeader;
