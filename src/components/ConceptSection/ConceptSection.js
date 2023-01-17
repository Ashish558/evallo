import React, { useEffect, useRef, useState } from "react";
import styles from "./ConceptSection.module.css";
import arrowDown from "../../assets/icons/arrow-down.png";
import Chart from "../Chart/Chart";
import downloadImage from "../../assets/icons/download.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import shivam from '../../assets/images/tutors/shivam-shrivastab.png'
import { useLazyGetParentTutorsQuery } from "../../app/services/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputSelect from "../InputSelect/InputSelect";
import { useLazyGetParentsAssignedTestsQuery } from "../../app/services/test";
import { getDate, getDuration, getFormattedDate } from "../../utils/utils";
import ParentTest from "./ParentTest/ParentTest";


const initData = [
   {
      firstName: 'Shivam',
      lastName: 'Shrivastava',
   }
]
const ConceptSection = () => {
   const [subject, setSubject] = useState("Maths");
   const [slot, setSlot] = useState("Jun 20, 2022 - Jul 30, 2022 ");
   const [leftOpacity, setLeftOpacityy] = useState(1);
   const [rightOpacity, setRightOpacity] = useState(1);
   const [subVisisbility, setSubVisisbility] = useState("hidden");
   const [dateVisibility, setDateVisibility] = useState("hidden");
   const [tutors, setTutors] = useState([])
   const tutorCarouselRef = useRef()
   const { id } = useSelector(state => state.user)
   const [sub, setSub] = useState('Math')

   const [allTests, setAllTests] = useState([])

   const [fetchTutors, fetchTutorsResp] = useLazyGetParentTutorsQuery()
   const navigate = useNavigate()
   const [fetchAssignedTests, fetchAssignedTestsResp] = useLazyGetParentsAssignedTestsQuery()

   useEffect(() => {
      fetchAssignedTests(id)
         .then(res => {
            if (res.error) return console.log('assigned test parent resp', res.error);
            console.log('assigned test parent resp', res.data);
            let tempAllTests = res.data.data.test.map(test => {
               const { testId, studentId, isCompleted, multiple, isStarted, dueDate, createdAt, updatedAt } = test
               if (testId === null) return
               return {
                  testName: testId ? testId.testName : '-',
                  assignedOn: getFormattedDate(new Date(createdAt)),
                  studentId: studentId ? studentId : '-',
                  dueDate: getFormattedDate(new Date(test.dueDate)),
                  duration: multiple ? getDuration(multiple) : '-',
                  status: isCompleted === true ? 'completed' : isStarted ? 'started' : 'notStarted',
                  scores: '-',
                  _id: test._id,
                  pdfLink: testId ? testId.pdf : null,
                  testId: testId ? testId._id : '-',
                  isCompleted: test.isCompleted,
                  isStarted: test.isStarted,
                  assignedTestId: test._id,
                  updatedAt
               }
            })
            let sortedArr = tempAllTests.sort(function (a, b) {
               return new Date(b.updatedAt) - new Date(a.updatedAt);
            });
            setAllTests(sortedArr.filter(item => item !== undefined))
         })

   }, [])

   useEffect(() => {
      fetchTutors({ id })
         .then(res => {
            if (res.error) return console.log(res.error);
            // console.log(res.data);
            res.data.tutors.length > 0 && setTutors(res.data.tutors)
         })
   }, [])

   const goNext = () => {
      document.getElementsByClassName("owl-next")[1].click();
   };
   const goPrev = () => {
      document.getElementsByClassName("owl-prev")[1].click();
   };

   const buttons = document.getElementsByClassName("button")
   useEffect(() => {
      for (let i = 0; i < buttons.length; i++) {
         // console.log(buttons[i].innerText);
         buttons[i].innerText === "Not Started" && buttons[i].classList.add("text-[#E02B1D]");
         buttons[i].innerText === "Started" && buttons[i].classList.add("text-[#F6A429]");
         buttons[i].innerText === "1250 / 1250" && buttons[i].classList.add("text-[#0671E0]");
      }
   }, [buttons, buttons.length])

   // console.log(allTests);

   return (
      <div
         className="flex flex-col lg:flex-row justify-between lg:ml-[35px] lg:py-[20px] py-[10px] lg:px-[30px] px-[9px] lg:bg-[#d9d9d933]"
         id={styles.conceptSectionContainer}
      >
         <div className="w-full lg:w-2/3 lg:pl-[40px]" id={styles.conceptChart}>
            <div className="flex items-center" >
               <h1>Concept Chart</h1>

               <InputSelect value={sub} labelClassname='hidden'
                  parentClassName='w-[200px] mr-5 ml-auto'
                  inputContainerClassName='bg-[#d9d9d980] pt-2 pb-2'
                  optionData={['Math', 'Grammar', 'Reading', 'Science']}
                  onChange={val => setSub(val)} />

               {/* <div className="dropdown" id={styles.data}>
                  <label
                     className="flex items-center text-sm"
                     id={styles.dropdownHeading}
                     tabIndex={0}
                     htmlFor="dateVisisbility"
                  >
                     {slot.length > 18 ? `${slot.substring(0, 18)}...` : slot}
                     <img
                        id={styles.arrowDown}
                        src={arrowDown}
                        style={dateVisibility === "visible"
                           ? { transform: "rotate(180deg)" }
                           : { transform: "rotate(0)" }
                        }
                        alt=""
                     />
                  </label>
                  <input
                     type="checkbox"
                     className="hidden"
                     id="dateVisisbility"
                     onChange={(e) =>
                        setDateVisibility(e.target.checked === true ? "visible" : "hidden")
                     }
                  />
                  <ul
                     tabIndex={0}
                     className={`dropdown-content menu p-2 shadow bg-base-100 rounded-box absolute bg-white w-60 z-10 text-sm  ${dateVisibility}`}
                  >
                     <li
                        onClick={(e) => {
                           setSlot(e.target.innerText);
                           setDateVisibility("hidden");
                           document
                              .getElementById("dateVisisbility")
                              .click();
                        }}
                        className="py-2 cursor-pointer"
                     >
                        Jan 20, 2022 - Fab 30, 2022
                     </li>

                     <li
                        onClick={(e) => {
                           setSlot(e.target.innerText);
                           setDateVisibility("hidden");
                           document
                              .getElementById("dateVisisbility")
                              .click();
                        }}
                        className="py-2 cursor-pointer"
                     >
                        Feb 20, 2022 - Mar 30, 2022
                     </li>
                     <li
                        onClick={(e) => {
                           setSlot(e.target.innerText);
                           setDateVisibility("hidden");
                           document
                              .getElementById("dateVisisbility")
                              .click();
                        }}
                        className="py-2 cursor-pointer"
                     >
                        Mar 20, 2022 - Apr 30, 2022
                     </li>
                     <li
                        onClick={(e) => {
                           setSlot(e.target.innerText);
                           setDateVisibility("hidden");
                           document
                              .getElementById("dateVisisbility")
                              .click();
                        }}
                        className="py-2 cursor-pointer"
                     >
                        Apr 20, 2022 - May 30, 2022
                     </li>
                  </ul>
               </div> */}

            </div>

            <div id={styles.chartContainer} className='scrollbar-content mb-4'>
               <div id={styles.chart} className='scrollbar-content' >
                  <div>
                     <Chart />
                  </div>
               </div>
            </div>
         </div>

         <div className="w-full lg:w-1/3">
            <div className="concept" id={styles.studentCarousel}>

               <div id={styles.tutor}>
                  <h2>Your Tutor</h2>
                  {tutors.length >= 1 ?
                     <OwlCarousel ref={tutorCarouselRef} className="owl-theme" loop margin={8} items={1}>
                        {
                           tutors.map((tutor, idx) => {
                              return (
                                 <div key={idx} className="item flex" style={{ width: "100%" }}>
                                    <div className="w-3/5 flex justify-center flex-col">
                                       {/* <h5 className={styles.tag}>
                                          WIZARD TUTOR | UNDERGRADUATE
                                       </h5> */}
                                       <h3 className="mt-0 mb-1"> {`${tutor.firstName} ${tutor.lastName}`} </h3>
                                       <p>
                                          {/* Lorem ipsum dolor sit amet, consectetur
                                          adipiscing elit. */}
                                       </p>
                                       <button className="btn-gold" style={{ padding: '7px 9px', maxWidth: '110px' }}
                                          onClick={() => tutor._id && navigate(`/profile/tutor/${tutor._id}`)} >
                                          View Profile
                                       </button>
                                    </div>
                                    <div className="w-2/5">
                                       <img src={tutor.photo ? tutor.photo : '/images/default.jpeg'} className="mx-auto w-full object-contain w-[140px] h-[140px] rounded-full" alt="" />
                                    </div>
                                 </div>
                              )
                           })
                        }

                     </OwlCarousel>
                     :
                     <p className="text-white font-semibold pt-8 not-italic pb-8 text-lg" style={{ fontSize: '18px', fontStyle: 'normal', fontWeight: '500' }} >
                        No tutors to display
                     </p>
                  }
               </div>

            </div>
            <div id={styles.practiceTestContainer} >
               <h2 className="mb-[6px]" id={styles.practiceTestHeader}>Practice Test</h2>
               <div id={styles.listedData} className='scrollbar-content scrollbar-vertical' >

                  {allTests.map(test => {
                     return <ParentTest styles={styles} {...test} />
                  })}

               </div>
            </div>
         </div>
      </div>
   );
};

export default ConceptSection;
