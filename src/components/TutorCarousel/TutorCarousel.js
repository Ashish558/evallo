import React, { useEffect, useState } from "react";
import styles from "./TutorCarousel.module.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import shivam from "./../../assets/images/tutors/shivam-shrivastab.png";
import { useLazyGetStudentTutorsQuery, useLazyGetTutorDetailsQuery } from "../../app/services/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SingleTutor from "./SingleTutor";

const initData = [
   {
      firstName: 'Shivam',
      lastName: 'Shrivastava',
   }
]
//for student
const TutorCarousel = () => {

   const { id } = useSelector(state => state.user)
   const [tutors, setTutors] = useState([])
   const [fetchTutors, fetchTutorsResp] = useLazyGetStudentTutorsQuery()
   const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
   const navigate = useNavigate()
   const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery()
   const [totalTutors, setTotalTutors] = useState(0)

   useEffect(() => {
      fetchTutors({ id })
         .then(res => {
            console.log('tutors resp', res.data);
            setTotalTutors(res.data.tutors.length)
            res.data.tutors.map(tutor => {
               getUserDetail({ id: tutor._id })
                  .then(response => {
                     let details = response.data.data.details
                     if (details === null || details === undefined) {
                        details = {}
                     }
                     setTutors(prev => [...prev, { ...tutor, ...details, _id: tutor._id }])
                  })

            })
         })
   }, [])

   return (
      <div id={styles.tutorCarousel} className="mr-[0px] lg:mr-[60px]">
         <h2 className="pl-5 pt-4">Your Tutor</h2>
         {tutors.length >= totalTutors ?
            <OwlCarousel className="owl-theme pt-3" margin={30} items={1}
               onTranslated={(e) => {
                  setCurrentSlideIndex(e.item.index)
               }}
               startPosition={currentSlideIndex} >
               {
                  tutors.map((tutor, idx) => {
                     return (
                        <SingleTutor tutor={tutor} idx={idx} />
                     )
                  })
               }

            </OwlCarousel> :
            <div className="font-semibold text-center mt-12">
               No tutors added !
            </div>
         }
      </div>
   );
};

export default TutorCarousel;
