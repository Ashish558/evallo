import React, { useState } from "react";
import styles from "./StudentDashboard.module.css";
import Chart from "./../../components/Chart/Chart";
import arrowDown from "./../../assets/icons/arrow-down.png";
import StudentDashboardHeader from "../../components/StudentDashboardHeader/StudentDashboardHeader";
import TutorCarousel from "../../components/TutorCarousel/TutorCarousel";
import CompleteProfile from "../../components/CompleteProfile/CompleteProfile";
import SessionFeedback from "../../components/SessionFeedback/SessionFeedback";
import InputSelect from "../../components/InputSelect/InputSelect";

const StudentDashboard = () => {
   const [subject, setSubject] = useState("Maths");
   const [slot, setSlot] = useState("Jun 20, 2022 - Jul 30, 2022 ");
   const [showSub, setShowSub] = useState(false);
   const [showSlot, setShowSlot] = useState(false);

   const [sub, setSub] = useState('Math')
   return (
      <div className={`lg:ml-pageLeft`} id="container">
         <div className="flex flex-col lg:flex-row pt-[10px] pl-2 gap-[39px]">
            <div className="w-full lg:w-7/12">
               <StudentDashboardHeader />
               <div className="flex items-center justify-between" style={{ gap: "20px" }}>
                  <h1>Concept Chart</h1>

                  <div className="flex">

                     <InputSelect value={sub} labelClassname='hidden'
                        parentClassName='w-[200px] mr-5'
                        inputContainerClassName='bg-[#d9d9d980] pt-2 pb-2'
                        optionData={['Math', 'Grammar', 'Reading', 'Science']}
                        onChange={val => setSub(val)} />
                     {/* <InputSelect value={sub} labelClassname='hidden'
                        parentClassName='w-[200px] mr-5'
                        inputContainerClassName='bg-[#d9d9d980] pt-2 pb-2'
                        optionData={['Math', 'Grammar', 'Reading', 'Science']}
                        onChange={val => setSub(val) } /> */}
                  </div>
               </div>
               <div id={styles.chartContainer} className='scrollbar-content mr-[9px]'>
                  <Chart></Chart>
               </div>
            </div>
            <div className="w-full lg:w-5/12 lg:p-[30px] lg:bg-[#d9d9d966]" id={styles.studentDashboardRight}>
               <TutorCarousel></TutorCarousel>
               <CompleteProfile />
               <SessionFeedback />
            </div>
         </div>
      </div>
   );
};

export default StudentDashboard;
