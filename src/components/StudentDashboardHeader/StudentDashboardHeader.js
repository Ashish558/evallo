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
  console.log(feedbackSessions);
  // console.log(id);
  const [isFeedback, SetisFeedback] = useState(false);
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
    window.open(link);
  };

  // console.log('images', images);
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

      <div className="flex justify-between relative  gap-8 mb-[57px] mt-[31px] ">
        <div className="flex flex-col justify-start items-start gap-2.5">
          <p className="text-[20px] leading-[12.5px] text-[#26435F] font-semibold">
            Announcements
          </p>

          <div
            className=" relative  flex rounded-md items-center  shadow-[0px_0px_2.500001907348633px_0px_#00000040] w-[550px]  h-[250px] "
            id={styles.exploreBgDisable}
          >
            <div className={styles.images}>
              {images?.length >= 1 ? (
                <OwlCarousel
                  ref={tutorCarouselRef}
                  className="owl-theme h-full"
                  loop
                  margin={8}
                  items={1}
                >
                  {images.map((image, idx) => {
                    return (
                      <div
                        className={` rounded-md bg-cover	bg-center	 ${styles.img}`}
                        style={{
                          backgroundImage: `url(${awsLink}${image.image})`,
                        }}
                      >
                        <p className="absolute top-5 left-4 z-10 font-bold text-base-25 text-white"></p>

                        <button
                          onClick={() => openLink(image.link)}
                          className="bg-[#FFA28D] text-white p-2 text-base-17-5 px-4 rounded-lg absolute left-[30px] bottom-[26px]"
                        >
                          {image?.buttonText ? image?.buttonText : ""}
                        </button>
                      </div>
                    );
                  })}
                </OwlCarousel>
              ) : (
                <div className="w-full h-full flex justify-center items-center bg-white">
                 <button className="bg-[#FF7979] text-white rounded-md p-2 py-1">
                 No Announcements
                    </button>
              </div>)}
            </div>
            {/* {images?.length >= 1 && (
              <ImageSlideshow images={images} text="text" />
            )} */}
          </div>
        </div>

        <div className=" mx-auto flex flex-col justify-start items-start gap-2.5 relative">
        <svg className="absolute bottom-0 left-0 z-10" xmlns="http://www.w3.org/2000/svg" width="490" height="99" viewBox="0 0 490 99" fill="none">
  <path d="M489.25 93.7501V0C486.489 0 484.25 2.23853 484.25 4.99989L484.25 50.6251L484.25 88.1251C484.25 90.8865 482.012 93.1251 479.25 93.1251H11.125C8.36358 93.1251 6.125 90.8865 6.125 88.1251V49.3751L6.125 5.625C6.125 2.5184 3.6066 0 0.5 0V93.7501C0.5 96.5115 2.73858 98.7501 5.5 98.7501H484.25C487.012 98.7501 489.25 96.5115 489.25 93.7501Z" fill="#26435F"/>
</svg>
          <p className=" text-[20px] leading-[12.5px] text-[#26435F] font-semibold">
            Assigned Tutors
          </p>
          <div className=".mybox relative shadow-[0px_0px_2.5px_0px_rgba(0,0,0,0.25)] rounded-md w-[489px] h-[250px] z-5000">
            <div id="borderLeft" className="rounded-t-r-md"></div>
            <TutorCarousel />

            <div id="borderRight" className="rojunded"></div>
            <div id="borderBottom" className="rounded-b-lg"></div>
          </div>
        </div>

        <div className=" flex flex-col justify-start items-start gap-2.5 relative ">
          <p className=" text-[20px] leading-[12.5px] text-[#26435F] font-semibold ">
            Session Feedback
          </p>
          <div className=" bg-white  rounded-md  shadow-[0px_0px_2.500001907348633px_0px_#00000040] w-[480px] h-[250px]">
            <div
              className="overflow-y-auto flex-1  p-4  h-[100%] custom-scroller"
              id={styles.tutorList}
            >
             
              {isFeedback &&
              feedbackSessions &&
              feedbackSessions?.length >= 1 ? (
                feedbackSessions.map((item, idx) => (
                  <TutorItem
                    SetisFeedback={SetisFeedback}
                    key={idx}
                    {...item}
                    setFeedbackSessions={setFeedbackSessions}
                  />
                ))
              ) : (
                <div
                  id="sfeed"
                  className=" w-full  z-[5000] h-full rounded-md bg-white flex justify-center flex-col text-center items-center"
                >
                  <div className="w-[90%] mx-auto   flex flex-col items-center">
                    <button className="bg-[#FF7979] text-white rounded-md p-2 py-1">
                      No Sessions Added
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboardHeader;
