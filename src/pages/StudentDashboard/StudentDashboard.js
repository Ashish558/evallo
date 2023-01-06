import React, { useState } from "react";
import styles from "./StudentDashboard.module.css";
import Chart from "./../../components/Chart/Chart";
import arrowDown from "./../../assets/icons/arrow-down.png";
import StudentDashboardHeader from "../../components/StudentDashboardHeader/StudentDashboardHeader";
import TutorCarousel from "../../components/TutorCarousel/TutorCarousel";
import CompleteProfile from "../../components/CompleteProfile/CompleteProfile";
import SessionFeedback from "../../components/SessionFeedback/SessionFeedback";

const StudentDashboard = () => {
   const [subject, setSubject] = useState("Maths");
   const [slot, setSlot] = useState("Jun 20, 2022 - Jul 30, 2022 ");
   const [showSub, setShowSub] = useState(false);
   const [showSlot, setShowSlot] = useState(false);

   return (
      <div className={`${styles.studentDashboardContainer} ml-pageLeft`} id="container">
         <div className="flex" id={styles.studentDashboard}>
            <div className="w-7/12">
               <StudentDashboardHeader />
               <div className="flex items-center justify-between" style={{ gap: "20px" }}>
                  <h1>Concept Chart</h1>

                  <div className="flex">

                     <div className="dropdown mr-5" id={styles.subject}>
                        <label
                           className="flex items-center"
                           id={styles.dropdownHeading}
                           tabIndex={0}
                           htmlFor={styles.subjectCheck}
                        >
                           {subject}
                           <img
                              className={styles.arrowDown}
                              src={arrowDown}
                              alt=""
                           />
                        </label>
                        <input
                           type="checkbox"
                           className="hidden"
                           onChange={(e) => setShowSub(e.target.checked)}
                           id={styles.subjectCheck}
                        />
                        <ul
                           tabIndex={0}
                           className={`menu p-2 shadow bg-base-100 rounded-box w-52 ${showSub ? "visible" : "hidden"
                              }`}
                           id={styles.subjectList}
                        >
                           <li
                              onClick={(e) => {
                                 setSubject(e.target.innerText);
                                 setShowSub(false);
                              }}
                              className="py-2 cursor-pointer"
                           >
                              Math
                           </li>

                           <li
                              onClick={(e) => {
                                 setSubject(e.target.innerText);
                                 setShowSub(false);
                              }}
                              className="py-2 cursor-pointer"
                           >
                              Physic
                           </li>
                           <li
                              onClick={(e) => {
                                 setSubject(e.target.innerText);
                                 setShowSub(false);
                              }}
                              className="py-2 cursor-pointer"
                           >
                              Biology
                           </li>
                           <li
                              onClick={(e) => {
                                 setSubject(e.target.innerText);
                                 setShowSub(false);
                              }}
                              className="py-2 cursor-pointer"
                           >
                              Chemistry
                           </li>
                        </ul>
                     </div>

                     <div className="dropdown" id={styles.data}>
                        <label
                           className="flex items-center"
                           id={styles.dropdownHeading}
                           tabIndex={0}
                           htmlFor="slot"
                        >
                           {slot.length > 18 ? `${slot.substring(0, 18)}...` : slot}
                           <img
                              className={styles.arrowDown}
                              src={arrowDown}
                              alt=""
                           />
                        </label>
                        <input
                           type="checkbox"
                           className="hidden"
                           id="slot"
                           onChange={(e) => setShowSlot(e.target.checked)}
                        />
                        <ul
                           tabIndex={0}
                           className={`dropdown-content menu p-2 shadow bg-base-100 rounded-box absolute bg-white z-50 ${showSlot ? "visible" : "hidden"
                              }`}
                        >
                           <li
                              onClick={(e) => {
                                 setSlot(e.target.innerText);
                                 setShowSlot(false);
                              }}
                              className="py-2 cursor-pointer"
                           >
                              Jan 20, 2022 - Fab 30, 2022
                           </li>

                           <li
                              onClick={(e) => {
                                 setSlot(e.target.innerText);
                                 setShowSlot(false);
                              }}
                              className="py-2 cursor-pointer"
                           >
                              Feb 20, 2022 - Mar 30, 2022
                           </li>
                           <li
                              onClick={(e) => {
                                 setSlot(e.target.innerText);
                                 setShowSlot(false);
                              }}
                              className="py-2 cursor-pointer"
                           >
                              Mar 20, 2022 - Apr 30, 2022
                           </li>
                           <li
                              onClick={(e) => {
                                 setSlot(e.target.innerText);
                                 setShowSlot(false);
                              }}
                              className="py-2 cursor-pointer"
                           >
                              Apr 20, 2022 - May 30, 2022
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
               <div id={styles.chartContainer} className='scrollbar-content'>
                  <Chart></Chart>
               </div>
            </div>
            <div className="w-5/12" id={styles.studentDashboardRight}>
               <TutorCarousel></TutorCarousel>
               <CompleteProfile />
               <SessionFeedback />
            </div>
         </div>
      </div>
   );
};

export default StudentDashboard;
