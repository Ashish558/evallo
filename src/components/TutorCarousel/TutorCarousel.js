import React, { useEffect, useState } from "react";
import styles from "./TutorCarousel.module.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import shivam from "./../../assets/images/tutors/shivam-shrivastab.png";
import { useLazyGetStudentTutorsQuery } from "../../app/services/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const initData = [
   {
      firstName: 'Shivam',
      lastName: 'Shrivastava',
   }
]
const TutorCarousel = () => {

   const { id } = useSelector(state => state.user)
   const [tutors, setTutors] = useState([])
   const [fetchTutors, fetchTutorsResp] = useLazyGetStudentTutorsQuery()
   const navigate = useNavigate()

   useEffect(() => {
      fetchTutors({ id })
         .then(res => {
            res.data.tutors.length > 0 && setTutors(res.data.tutors)
         })
   }, [])

   return (
      <div id={styles.tutorCarousel}>
         <h2 className="pl-5 pt-4">Your Tutor</h2>
         {tutors.length >= 1 ?
            <OwlCarousel className="owl-theme" loop margin={30} items={1}>
               {
                  tutors.map((tutor, idx) => {
                     return (
                        <div ley={idx} className="item pl-5">
                           <div className="flex items-center justify-center">
                              <div className="w-2/3">
                                 <h5 className={styles.tag}>
                                    WIZARD TUTOR <br /> UNDERGRADUATE
                                 </h5>
                                 <h3 className="mt-2"> {`${tutor.firstName} ${tutor.lastName}`} </h3>
                                 <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit.
                                 </p>
                                 <button className="btn-gold"
                                    onClick={() => tutor._id && navigate(`/profile/tutor/${tutor._id}`)} >View Profile</button>
                              </div>
                              <div className="w-1/3">
                                 <img src={shivam} className="mx-auto" alt="" />
                              </div>
                           </div>
                        </div>
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
