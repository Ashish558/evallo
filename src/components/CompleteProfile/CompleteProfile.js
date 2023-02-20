import React, { useEffect, useState } from "react";
import styles from "./CompleteProfile.module.css";
import arrow from "./../../assets/icons/arrow-down.png";
import { ListData } from "../ListData/ListData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLazyGetUserDetailQuery } from "../../app/services/users";

const CompleteProfile = () => {
   const [profileProgress, setProfileProgress] = useState("0%");
   const navigate = useNavigate()
   const { id } = useSelector(state => state.user)
   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()

   const checkIfFilled = (value) => {
      let filled = false
      if (value !== '' && value !== undefined && value !== null) {
         filled = true
      }
      return filled
   }
   useEffect(() => {
      getUserDetail({ id })
         .then(res => {
            console.log('details -- ', res.data.data.userdetails);
            let { service, subjects, aboutScore, accomodations, timeZone, birthyear, personality, interest, satScores, actScores, } = res.data.data.userdetails
            let total = 9
            let filled = 0
            if (checkIfFilled(birthyear)) {
               filled += 1
            } 
             if (subjects !== undefined && subjects?.length >= 1) {
               filled += 1
            } 
             if (checkIfFilled(aboutScore)) {
               filled += 1
            } 
             if (checkIfFilled(accomodations)) {
               filled += 1
            } 
             if (personality !== undefined && personality?.length >= 1) {
               filled += 1
            } 
             if (satScores !== undefined) {
               filled += 1
            } 
             if (actScores !== undefined) {
               filled += 1
            } 
             if (interest !== undefined && interest?.length >= 1) {
               filled += 1
            } 
             if (checkIfFilled(timeZone)) {
               filled += 1
            }
            let percent = filled*100/total
            console.log('filled', Math.round(percent));
            setProfileProgress(`${Math.round(percent)}%`)
         })
   }, [id])

   return (
      <div id={styles.completeProfile} className="lg:w-10/12">
         <div
            className="flex items-center"
            id={styles.completeProfileHeader}
         >
            <h1>Complete your Profile</h1>
            <img src={arrow} className="cursor-pointer p-1 w-[25px]" onClick={() => navigate("/profile")} style={{ transform: 'rotate(-90deg)' }} alt="" />

         </div>

         <div id={styles.profileHeader}>
            <h2>Profile Status</h2>
            <h2>
               {profileProgress}
            </h2>
         </div>

         <div id={styles.statusContainer}>
            <div
               id={styles.statusBar}
               style={{ width: profileProgress }}
            ></div>
         </div>
         {/* 
            <div id={styles.practiceTest}>
                <h1>Practice Tests</h1>

                <div id={styles.practiceTestContainer}>
                    <ListData />
                </div>
            </div> */}
      </div>
   );
};

export default CompleteProfile;
