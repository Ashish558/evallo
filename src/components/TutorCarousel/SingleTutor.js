import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTutorDetails } from '../../hooks/useTutorDetails'
import styles from "./TutorCarousel.module.css";

export default function SingleTutor({ idx, tutor }) {

   const navigate = useNavigate()

   return (
      <div key={idx} className="item px-4">
         <div className="flex items-center justify-center">
            <div className="w-2/3">
               <h5 className={`${styles.tag}`}>
                  {tutor.tutorLevel && `${tutor.tutorLevel} Belt`}
               </h5>
               <p>
                  {tutor?.education}
               </p>
               <h3 className="mt-0 mb-1 mt-2"> {`${tutor.firstName} ${tutor.lastName}`} </h3>
               <p>
                  {tutor?.tagLine}
               </p>
               <button className="btn-gold" style={{ marginTop: '20px' }}
                  onClick={() => tutor._id && navigate(`/profile/tutor/${tutor._id}`)} >View Profile</button>
            </div>
            <div className="w-1/3">
               <img src={tutor.photo ? tutor.photo : '/images/default.jpeg'} className="mx-auto rounded-full" alt="" />
            </div>
         </div>
      </div>
   )
}
