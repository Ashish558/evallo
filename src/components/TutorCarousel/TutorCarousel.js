import React, { useEffect, useState,useRef } from "react";
import styles from "./TutorCarousel.module.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import swipeRight from "./../../assets/icons/rightArrowS.svg"
import shivam from "./../../assets/images/tutors/shivam-shrivastab.png";
import {
  useLazyGetStudentTutorsQuery,
  useLazyGetTutorDetailsQuery,
} from "../../app/services/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SingleTutor from "./SingleTutor";

const initData = [
  {
    firstName: "Shivam",
    lastName: "Shrivastava",
  },
];
//for student
const TutorCarousel = () => {
  const { id } = useSelector((state) => state.user);
  const [tutors, setTutors] = useState([]);
  const [fetchTutors, fetchTutorsResp] = useLazyGetStudentTutorsQuery();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery();
  const [totalTutors, setTotalTutors] = useState(0);

  useEffect(() => {
    fetchTutors({ id }).then((res) => {
      console.log("tutors resp", res.data);
      setTotalTutors(res.data.tutors.length);
      res.data.tutors.map((tutor) => {
        getUserDetail({ id: tutor._id }).then((response) => {
          let details = response.data.data.details;
          if (details === null || details === undefined) {
            details = {};
          }
          setTutors((prev) => [
            ...prev,
            { ...tutor, ...details, _id: tutor._id },
          ]);
        });
      });
    });
  }, []);
  const handlePrev = () => {

    if (sliderRef.current) {
       sliderRef.current.prev();
    }
 };
 const sliderRef = useRef(null);
 const handleNext = () => {

    if (sliderRef.current) {
       sliderRef.current.next();
    }
 };
  const options = {
  
    nav: false,
    responsiveClass: true,
    dots: false,
 };
  return (

    <div className="h-full relative items-center  flex py-2 mr-[5%]">

      <h2 className="pl-5 pt-4">{""}</h2>
      {tutors.length >= totalTutors  ? (
        <OwlCarousel
        ref={sliderRef}
        {...options}
          className="owl-theme flex-1 h-full relative z-40  w-full"
          margin={30}
          items={1}
          onTranslated={(e) => {
            setCurrentSlideIndex(e.item.index);
          }}
          startPosition={currentSlideIndex}
        >
          {tutors.map((tutor, idx) => {
            return <SingleTutor turorsLength={tutors?.length} handlePrev={handlePrev} handleNext={handleNext} tutor={tutor} idx={idx} />;
          })}
        </OwlCarousel>
      ) : (
     
        <div id="stutoradd" className=" w-full  z-[5000] h-full rounded-md bg-white flex justify-center flex-col text-center items-center">
        <div className="w-[95%] mx-auto   flex flex-col items-end">
          
         <button className="bg-[#FF7979] text-white rounded-md p-2 py-1">
         No Tutors Assigned
         </button>
      
       </div>
     </div>
      )}


    </div>
  );
};

export default TutorCarousel;
