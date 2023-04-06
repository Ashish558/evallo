import React, { useEffect, useRef, useState } from "react";
import styles from "./ConceptSection.module.css";
import arrowDown from "../../assets/icons/arrow-down.png";
import Chart from "../Chart/Chart";
import downloadImage from "../../assets/icons/download.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import shivam from '../../assets/images/tutors/shivam-shrivastab.png'
import { useLazyGetParentTutorsQuery, useLazyGetTutorDetailsQuery, useLazyGetUserDetailQuery } from "../../app/services/users";
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
const ConceptSection = ({ selectedStudent, setSelectedStudent }) => {

   const [tutors, setTutors] = useState([])
   const [filteredTutors, setFilteredTutors] = useState([])

   const tutorCarouselRef = useRef()
   const { id } = useSelector(state => state.user)
   const [sub, setSub] = useState('Math')
   const [profileProgress, setProfileProgress] = useState("0%");

   const [subjects, setSubjects] = useState([])
   const [selectedSubject, setSelectedSubject] = useState('')

   const [allTests, setAllTests] = useState([])

   const [fetchTutors, fetchTutorsResp] = useLazyGetParentTutorsQuery()
   const navigate = useNavigate()
   const [fetchAssignedTests, fetchAssignedTestsResp] = useLazyGetParentsAssignedTestsQuery();
   const [filteredAssignedTests, setFilteredAssignedTests] = useState([])
   const [getTutorDetail, getTutorDetailResp] = useLazyGetTutorDetailsQuery()
   const [totalTutors, setTotalTutors] = useState(0)
   const { awsLink } = useSelector(state => state.user)

   useEffect(() => {
      fetchAssignedTests(id)
         .then(res => {
            if (res.error) return console.log('assigned test parent resp', res.error);
            // console.log('assigned test parent resp', res.data);
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
      setTutors([])
      fetchTutors({ id })
         .then(res => {
            // console.log('tutors resp', res.data);
            setTotalTutors(res.data.tutors.length)
            res.data.tutors.map(tutor => {
               getTutorDetail({ id: tutor._id })
                  .then(response => {
                     // console.log('tutors response', response.data);
                     let details = response.data.data.details
                     if (details === null || details === undefined) {
                        details = {}
                     }
                     setTutors(prev => [...prev, { ...tutor, ...details, _id: tutor._id }])
                  })

            })
         })
   }, [])

   useEffect(() => {
      if (selectedStudent === null) return
      if (allTests.length === 0) return
      let filtered = allTests.filter(item => item.studentId._id === selectedStudent._id)
      // console.log('filtered', filtered);
      // console.log('selectedStudent', selectedStudent._id);
      setFilteredAssignedTests(filtered)
   }, [selectedStudent, allTests])

   const buttons = document.getElementsByClassName("button")
   useEffect(() => {
      for (let i = 0; i < buttons.length; i++) {
         // console.log(buttons[i].innerText);
         buttons[i].innerText === "Not Started" && buttons[i].classList.add("text-[#E02B1D]");
         buttons[i].innerText === "Started" && buttons[i].classList.add("text-[#F6A429]");
         buttons[i].innerText === "1250 / 1250" && buttons[i].classList.add("text-[#0671E0]");
      }
   }, [buttons, buttons.length])
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
            // console.log('details -- ', res.data.data.userdetails);
            let { industry, residentialAddress, timeZone, birthyear, } = res.data.data.userdetails
            let total = 4
            let filled = 0
            if (checkIfFilled(birthyear)) {
               filled += 1
            }
            if (checkIfFilled(industry)) {
               filled += 1
            }
            if (checkIfFilled(residentialAddress)) {
               filled += 1
            }
            if (checkIfFilled(timeZone)) {
               filled += 1
            }
            let percent = filled * 100 / total
            // console.log('filled', Math.round(percent));
            setProfileProgress(`${Math.round(percent)}%`)
         })
   }, [id])

   useEffect(() => {
      if (selectedStudent === null) return
      if (tutors.length === 0) return
      // console.log('tutors', tutors);
      let filtered = tutors.filter(tutor => tutor.assiginedStudents?.includes(selectedStudent._id))
      setFilteredTutors([])
      setTimeout(() => {
         setFilteredTutors(filtered)
      }, 0);
      // tutorCarouselRef.current.trigger('refresh.owl.carousel'); 
   }, [selectedStudent, tutors])

   useEffect(() => {
      subjects.map(sub => {
         if (sub.selected === true) {
            setSelectedSubject(sub.name)
         }
      })
   }, [subjects])

   const handleSubjectChange = name => {
      let updated = subjects.map(sub => {
         if (sub.name === name) {
            return { ...sub, selected: true }
         } else {
            return { ...sub, selected: false }
         }
      })
      setSubjects(updated)
   }

   // console.log('tutors', tutors);
   // console.log('selectedSubject', selectedSubject);
   // console.log('subjects', subjects);
   // console.log('filteredTutors', filteredTutors);
   // console.log('tutorCarouselRef', tutorCarouselRef.current);

   return (
      <div
         className="flex flex-col lg:flex-row justify-between lg:ml-[35px] lg:py-[20px] py-[10px] lg:px-[30px] px-[9px] lg:bg-[#d9d9d933]"
         id={styles.conceptSectionContainer}
      >
         <div className="w-full lg:w-2/3 lg:pl-[40px]" id={styles.conceptChart}>
            <div className="flex items-center" >
               <h1>Concept Chart</h1>

               <InputSelect value={selectedSubject} labelClassname='hidden'
                  parentClassName='w-[200px] mr-5 ml-auto'
                  inputContainerClassName='bg-[#d9d9d980] pt-2 pb-2'
                  optionData={subjects.map(item => item.name)}
                  onChange={val => handleSubjectChange(val)} />

            </div>

            <div id={styles.chartContainer} className='scrollbar-content mb-4'>
               <div id={styles.chart} className='scrollbar-content' >
                  <div>
                     <Chart selectedStudent={selectedStudent} selectedSubject={selectedSubject} setSubjects={setSubjects} />
                  </div>
               </div>
            </div>
         </div>

         <div className="w-full lg:w-1/3">
            <div className="concept" id={styles.studentCarousel}>

               <div id={styles.tutor}>
                  <h2>Your Tutor</h2>
                  {filteredTutors.length >= totalTutors ?
                     <OwlCarousel ref={tutorCarouselRef} className="owl-theme" loop margin={8} items={1}>
                        {
                           filteredTutors.map((tutor, idx) => {
                              return (
                                 <div key={idx} className="item flex" style={{ width: "100%" }}>
                                    <div className="w-3/5 flex justify-center flex-col">
                                       <h5 className={`${styles.tag}`}>
                                          {tutor.tutorLevel && `${tutor.tutorLevel} Belt`}
                                       </h5>
                                       <p>
                                          {tutor?.education}
                                       </p>
                                       <h3 className="mt-0 mb-1 mt-2.5"> {`${tutor.firstName} ${tutor.lastName}`} </h3>
                                       <p>
                                          {tutor?.tagLine}
                                       </p>
                                       <button className="btn-gold" style={{ padding: '7px 9px', maxWidth: '110px' }}
                                          onClick={() => tutor._id && navigate(`/profile/tutor/${tutor._id}`)} >
                                          View Profile
                                       </button>
                                    </div>
                                    <div className="w-2/5">
                                       <img src={tutor.photo ? `${awsLink}${tutor.photo}` : '/images/default.jpeg'} className="mx-auto w-full object-contain w-[140px] h-[140px] rounded-full" alt='profile-icon' />
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
            <div className="flex mt-[64px] justify-between pr-4 items-center">
               <h1 className="text-[#4715D7] text-[21px] font-semibold">Complete Your Profile</h1>
               <img src={arrowDown} className="cursor-pointer p-1 w-[25px]" onClick={() => navigate("/profile")} style={{ transform: 'rotate(-90deg)' }} alt="" />
            </div>
            <div className="flex mt-[10px] mb-[10px] justify-between px-5 items-center text-black">
               <h2 className="text-[18px] font-medium">Profile Status</h2>
               <h2 className="text-[18px] font-medium">
                  {profileProgress}
               </h2>
            </div>
            <div className="w-full bg-[#D9D9D9] h-[9px] rounded-full mt-[10px] overflow-auto">
               <div className="rounded-full" style={{ width: profileProgress, height: "100%", background: "#62DD43" }}></div>
            </div>
            <div id={styles.practiceTestContainer} >
               <h2 className="mb-[16px]" id={styles.practiceTestHeader}>Practice Tests</h2>
               <div id={styles.listedData} className='scrollbar-content scrollbar-vertical' >

                  {filteredAssignedTests.map(test => {
                     return <ParentTest styles={styles} {...test} />
                  })}

               </div>
            </div>
         </div>
      </div>
   );
};

export default ConceptSection;
