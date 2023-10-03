import React, { useRef, useState } from "react";
import explore from "./../../assets/images/explore-bg.png";
import styles from "./StudentDashboardHeader.module.css";
import TutorItem from "../TutorItem/TutorItem";
import OwlCarousel from "react-owl-carousel";
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
  const { awsLink } = useSelector((state) => state.user);
  const tutorCarouselRef = useRef();
  const [fetchSettings, fetchSettingsResp] = useLazyGetSettingsQuery();
  const [fetchUserSessions, fetchUserSessionsResponse] =
    useLazyGetCompletedSessionsQuery();
  const [feedbackSessions, setFeedbackSessions] = useState([]);
  const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery();
  const [getSession, getSessionResp] = useLazyGetSingleSessionQuery();
  const [updateFeedback, updateFeedbackResp] = useUpdateFeedbackMutation();
  const { organization } = useSelector((state) => state.organization);
  console.log(feedbackSessions)
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
  const openLink = (link) => {
    window.open(link)
  }
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

      <div className="flex justify-between relative  gap-8 mb-[92px] mt-[31px] ">
        <div className="  w-[28.65vw] h-[250px] ">
          <p className="text-xl text-[#26435F] font-semibold">Announcements</p>

          <div
            className="w-full relative h-full flex rounded-md items-center  shadow-[0px_0px_2.500001907348633px_0px_#00000040]"
            id={styles.exploreBgDisable}
          >
            <div className={styles.images}>
              {images?.length > 0 ? (
                <OwlCarousel
                  ref={tutorCarouselRef}
                  className="owl-theme h-full"
                  loop
                  margin={8}
                  items={1}
                >
                  {images.map((image, idx) => {
                    return (
                      <div className={` rounded-md bg-cover	bg-center	 ${styles.img}`}
                        style={{ backgroundImage: `url(${awsLink}${image.image})` }}
                      >
                        <p className="absolute top-5 left-4 z-10 font-bold text-base-25 text-white"></p>

                        <button onClick={() => openLink(image.link)} className="bg-[#FFA28D] text-white p-2 text-base-17-5 px-4 rounded-lg absolute left-5 bottom-4">
                          {image?.buttonText ? image?.buttonText : "Register"}
                        </button>
                      </div>
                    );
                  })}
                </OwlCarousel>
              ) : (
                <p
                  className="text-white  text-center w-full font-semibold pt-8 not-italic pb-8 text-lg"
                  style={{
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: "500",
                  }}
                >
                  No Announcements
                </p>
              )}
            </div>
            {/* {images?.length >= 1 && (
              <ImageSlideshow images={images} text="text" />
            )} */}
          </div>
        </div>

        <div className="w-[25vw] mx-auto h-[250px]">
          <p className=" text-xl text-[#26435F] font-semibold">
            Assigned Tutors
          </p>
          <div className=".mybox bg-white relative shadow-[0px_0px_2.5px_0px_rgba(0,0,0,0.25)] border-b-4 border-b-[#26435F] h-full rounded-md max-w-[440px]  design:max-w-[460px]">
            <div id="borderLeft" className="rounded-t-r-md"></div>
            <TutorCarousel />

            <div id="borderRight" className="rojunded"></div>
            <div id="borderBottom" className="rounded-b-lg"></div>
          </div>
        </div>

        <div className="w-[25vw] h-[250px]">
          <p className=" text-xl text-[#26435F] font-semibold ">
            Session Feedback
          </p>
          <div className="h-full bg-white  rounded-md  shadow-[0px_0px_2.500001907348633px_0px_#00000040]">
            <div
              className="overflow-y-auto flex-1  p-4  h-[100%] custom-scroller"
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
                <p className="font-medium pt-6">No feedbacks given!</p>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboardHeader;
