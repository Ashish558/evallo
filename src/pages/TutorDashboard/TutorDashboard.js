import React, { useEffect, useState } from 'react'
import StudentImg from '../../assets/images/tutor-student.png'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import styles from './style.module.css'
import RightIcon from '../../assets/icons/right.svg'
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import { scheduleData } from './tempData';
import TutorSchedule from '../../components/TutorSchedule/TutorSchedule';
import HatIcon from '../../assets/images/hat.svg'
import download from '../../assets/images/basil_file-download-outline.svg'
import { useLazyGetSessionsQuery, useLazyGetSingleSessionQuery } from '../../app/services/session';
import { useSelector } from 'react-redux';
import Message from '../../components/Message/Message';
import { useLazyGetTutorDetailsQuery, useLazyGetUserDetailQuery } from '../../app/services/users';
import { useLazyGetFeedbacksQuery } from '../../app/services/dashboard';
import { useNavigate } from 'react-router-dom';
import { useLazyGetTutorAssignedTestsQuery } from '../../app/services/test';
import { getDate, getDuration, getFormattedDate } from '../../utils/utils';

const studentsArr = [
   {
      src: StudentImg,
      name: 'Joseph'
   },
   {
      src: StudentImg,
      name: 'Lilly'
   },
   {
      src: StudentImg,
      name: 'Emily'
   },
   {
      src: StudentImg,
      name: 'Sam'
   },
   {
      src: StudentImg,
      name: 'Kate'
   },
]

// const studentsData = [
//    {
//       name: 'Joseph Brown',
//       img: StudentImg,
//       dueDate: 'June 20, 2022'
//    },
//    {
//       name: 'Joseph Brown',
//       img: StudentImg,
//       dueDate: 'June 20, 2022'
//    },
//    {
//       name: 'Joseph Brown',
//       img: StudentImg,
//       dueDate: 'June 20, 2022'
//    },
// ]
export default function TutorDashboard() {
   const [profileProgress, setProfileProgress] = useState(0);
   const [fetchUserSessions, fetchUserSessionsResponse] =
      useLazyGetSessionsQuery();
   // const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()
   const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery()
   const [fetchTutorAssignedTests, fetchTutorAssignedTestsResp] = useLazyGetTutorAssignedTestsQuery();
   const [allAssignedTests, setAllAssignedTests] = useState([])
   console.log(allAssignedTests)
   const [tutorHours, setTutorHours] = useState(0)
   const navigate = useNavigate()

   const [sessions, setSessions] = useState([])
   const [isOpen, setIsOpen] = useState(false)
   const { id } = useSelector(state => state.user)
   const [students, setStudents] = useState([])
   const [tutorRank, setTutorRank] = useState('-')
   // const [awsLink, setAwsLink] = useState('')
   const { awsLink } = useSelector(state => state.user)

   useEffect(() => {
      const url = `/api/session/tutor/${id}`;
      fetchUserSessions(url)
         .then(res => {
            // console.log(res.data.data.session)
            let temp = res.data.data.session.filter(session => {
               let date = new Date(session.date).getDate()
               let now = new Date().getDate()
               return date === now
               // console.log('d -- ', now);
               // console.log('sd -- ', date);
            })
            setSessions(temp)
         })
   }, [])
   const checkIfFilled = (value) => {
      let filled = false
      if (value !== '' && value !== undefined && value !== null) {
         filled = true
      }
      return filled
   }
   useEffect(() => {
      getUserDetail({ id })
         .then(resp => {
            // console.log(resp.data.data.user.assiginedStudents)
            console.log(resp.data.data);
            let awsLink = resp.data.data.baseLink
            const { details } = resp.data.data
            // console.log('tutor details', details);
            if (resp.data.data.user.tutorHours) {
               let currMonth = new Date().getMonth()
               let currYear = new Date().getFullYear()
               console.log('currMonth', currMonth);
               console.log('currYear', currYear);
               resp.data.data.user.tutorHours?.forEach(item => {
                  if (item.month === currMonth + 1 && item.year === currYear) {
                     setTutorHours(item.hours)
                  }
               })
            }
            if (details !== null || details !== undefined) {
               setTutorRank(details.tutorRank ? details.tutorRank : '-')
            }
            if (details !== null) {
               const { about, address, interest, paymentInfo, videoLink, tagLine, serviceSpecializations } = details
               let total = 7
               let filled = 0
               if (checkIfFilled(about)) {
                  filled += 1
               }
               if (checkIfFilled(tagLine)) {
                  filled += 1
               }
               if (checkIfFilled(address)) {
                  filled += 1
               }
               if (checkIfFilled(paymentInfo)) {
                  filled += 1
               }
               if (serviceSpecializations !== undefined && serviceSpecializations?.length >= 1) {
                  filled += 1
               }
               if (interest !== undefined && interest?.length >= 1) {
                  filled += 1
               }
               if (checkIfFilled(videoLink)) {
                  filled += 1
               }
               let percent = filled * 100 / total
               setProfileProgress(Math.round(percent))
            }
            let studentsData = []
            const fetch = (cb) => {
               resp.data.data.user.assiginedStudents.map((studentId, idx) => {
                  getUserDetail({ id: studentId })
                     .then(res => {
                        const { _id, firstName, lastName } = res.data.data.user
                        studentsData.push({
                           _id,
                           name: `${firstName} ${lastName}`,
                           photo: res.data.data.user.photo ? `${res.data.data.user.photo}` : null
                        })
                        if (idx === resp.data.data.user.assiginedStudents.length - 1) cb()
                     })
               })
            }
            fetch(() => {
               // console.log(studentsData)
               setStudents(studentsData)
            })
         })
   }, [])

   const handleLinkClick = (text) => {
      setIsOpen(true)
      navigator.clipboard.writeText(text)
      setTimeout(() => {
         setIsOpen(false)
      }, 5000);
   }

   const fetchTutorTests = () => {
      fetchTutorAssignedTests(id)
         .then(res => {
            if (res.error) return console.log('tutor assignedtest', res.error)
            // console.log('tutor assignedtest', res.data)
            let data = res.data.data.test.map(item => {
               const { createdAt, studentId, dueDate, photo, testId, multiple, timeLimit, isCompleted, isStarted } = item
               // console.log(photo);
               let profile = studentId.photo ? studentId.photo : null
               return {
                  studentName: studentId ? `${studentId.firstName} ${studentId.lastName}` : '-',
                  studentId: studentId ? studentId._id : '-',
                  assignedOn: getFormattedDate(createdAt),
                  testName: testId ? testId.testName : '-',
                  testId: testId ? testId._id : null,
                  scores: '-',
                  duration: multiple ? getDuration(multiple) : 'Unlimited',
                  status: isCompleted === true ? 'completed' : isStarted ? 'started' : 'notStarted',
                  createdAt,
                  photo: profile,
                  dueDate: getFormattedDate(dueDate),
                  assignedTestId: item._id
               }
            })
            let sortedArr = data.sort(function (a, b) {
               return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setAllAssignedTests(sortedArr)
         })
   }

   useEffect(() => {
      fetchTutorTests()
   }, [])
   // console.log(students);
   // console.log(tutorRank);
   // console.log('allAssignedTests', allAssignedTests);
   // console.log('prof', profileProgress);

   return (
      <div className='bg-[#F5F8FA]'>
         <div className="lg:ml-pageLeft  min-h-screen overflow-x-hidden">
            <div className="py-8 pr-5">
               <p className='text-[#24A3D9] text-xl mx-4'>Dashboard</p>


               <div className='px-4 w-[521px] mx-auto'>
                  <div className='flex justify-between items-center px-4'>
                     <p className='text-[#26435F]  text-[21px] cursor-pointer'
                        onClick={() => navigate('/profile')}>
                        Complete your Profile
                     </p>
                     <img src={RightIcon} className='cursor-pointer' onClick={() => navigate('/profile')} alt="RightIcon" />
                  </div>
                  <div className='px-4  text-lg font-medium  flex justify-between items-center'>
                     {/* <p className=''>Profile Status</p> */}
                     <ProgressBar num={profileProgress} />
                     <p className='pl-3'>
                        {`${profileProgress}%`}
                     </p>
                  </div>

               </div>

               <div className='flex items-start'>

                  <div className='flex flex-col items-start flex-[7]' >
                     <div className='px-4 mb-[50px]'>
                        <p className='text-primary-dark font-semibold text-[21px] mb-8 '>Latest Students</p>
                        <div className={styles.studentImages} >
                           {
                              students.length > 0 &&
                              <OwlCarousel items={5} autoWidth margin={20} >
                                 {students.map(student => {
                                    return <div className='flex flex-col items-center text-center w-[110px]'>
                                       <img src={`${student.photo ? `${awsLink}${student.photo}` : '/images/default.jpeg'} `} className='w-[100px]' alt='studentImage' />
                                       <p className='text-lg font-semibold mt-4 cursor-pointer'
                                          onClick={() => navigate(`/profile/student/${student._id}`)} >
                                          {student.name.split(" ")[0]} <br /> {student.name.split(" ")[1]} </p>
                                    </div>
                                 })}
                              </OwlCarousel>
                           }
                        </div>
                     </div>

                     <div className='flex w-full pl-5'>
                        <DashboardCard data={{
                           title: tutorHours,
                           subtitle: `${tutorHours > 1 ? 'Hours' : 'Hour'}`
                        }}
                           header='Completed'
                           subHeader='This Month'
                           className='bg-[#63A1FD]' />
                        <DashboardCard data={{ title: '-', subtitle: 'USD', titleClassName: 'text-[32px]' }}
                           header='Earned'
                           subHeader='This Month'
                           className='bg-[#4BBD94]' />
                        <div className='ml-[30px] flex justify-center items-center w-[290px] bg-[#F4F4F4] mr-[30px] rounded-[5px]'>
                           <div>     <p className='text-[32px] text-center text-[#667085] font-semibold'>Tutor Rank</p>
                              <p className='text-[#667085] text-center text-xl'>Coming Soon</p></div>
                        </div>
                     </div>


                     <div className='w-full pl-6 mt-10'>
                        <p className='text-primary-dark font-semibold text-[21px] mb-4'>Today’s Schedule</p>
                        <div className='px-[29px] py-[31px] bg-white mr-5 rounded-[5.333px] scrollbar-content scrollbar-vertical max-h-[600px] overflow-auto shadow-[0px_0px_2.6px_0px_rgba(0,0,0,0.25)]'>
                           {sessions.map((item, idx) => {
                              return <TutorSchedule {...item} setIsOpen={setIsOpen} handleLinkClick={handleLinkClick} />
                           })}
                        </div>
                     </div>


                  </div>
                  <div className=' flex-2 '>

                     <p className='text-[21px] text-[#26435F] mb-2 font-semibold'>Latest Practice Test</p>
                     <div className='bg-[#FFFFFF]  rounded-[5px] shadow-[0px_0px_2.6px_0px_rgba(0,0,0,0.25)]'>
                        <div className=''>

                           {/* <div className={`py-[17px] px-[19px] flex flex-1 text-white rounded-20  first:mr-[30px] bg-primary`}>
                           <div className='self-stretch w-[80px] h-[80px] my-auto text-center bg-black/20 rounded-[15px] flex flex-col justify-center'>
                              <img src={HatIcon} className='objects-contain' />
                           </div>

                           <div className='px-6 flex flex-1'>
                              <div className='flex-1'>
                                 <div className='pt-[6px] font-bold text-[27px] flex items-center justify-between'>
                                    <p>
                                       Tutor Rank
                                    </p>
                                 </div>
                                 <p className='text-xs font-semibold'>
                                    <p>
                                       Total Tutoring Hours: -
                                    </p>
                                    <p>
                                       Avg Session Feedback: -
                                    </p>
                                    <p>
                                       Total Client Referrals: -
                                    </p>
                                 </p>
                              </div>
                              <div className='flex items-center justify-center px-4 pr-0'>
                                 <p className='inline-block pr-4 text-[#392976] font-bold text-[30px]'>
                                    {tutorRank === '-' ? '-' : tutorRank}
                                 </p>
                              </div>
                           </div>

                        </div> */}
                        </div>

                        <div className='min-w-[330px]'>
                           {/* <p className='text-primary font-semibold text-[21px] mb-4'>
                           Latest Practice Test
                        </p> */}
                           <div className='px-[19px] h-[331px] overflow-auto py-[19px] bg-white rounded-20'>
                              {allAssignedTests.map(item => {
                                 return (
                                    <div className=' mb-5' key={item._id} >
                                       <div>
                                          {/* <img src={`${item.photo ? `${awsLink}${item.photo}` : '/images/default.jpeg'} `} className='w-[62px] h-[62px] rounded-full' /> */}
                                       </div>
                                       <div className=' flex justify-between items-center'>
                                          <div>
                                             <p className='text-[#24A3D9] text-lg font-bold'> {item.testName} </p>
                                             <div className=' text-[#517CA8] flex opacity-50'>
                                                <p className='font-semibold'>Due:</p>
                                                <p className='ml-2'> {getDate(item.dueDate)} </p>
                                             </div>
                                          </div>
                                          <div>
                                             <img className='cursor-pointer' width="25px" src={download} alt="" />
                                          </div>
                                          <div>
                                             {
                                                item.status = "notStarted" ? <p className='text-[#32D583] underline'>
                                                   Not started
                                                </p> :
                                                   <p className='text-[#FFCE84] underline'>
                                                      {item.status?.props?.children === 'completed' ? 'Completed' : 'Started'}
                                                   </p>
                                             }

                                          </div>
                                       </div>
                                       {/* <button className={`bg-primaryOrange font-semibold text-sm rounded-[6px] px-8 py-3 text-white ${item.status !== 'completed' && item.status !== 'started' ? 'opacity-50 pointer-events-none' : ''}`}
                                          onClick={() => navigate(`/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId}`)} >
                                          View
                                       </button> */}
                                       <div className='mt-3 h-[1px] w-[100%] bg-[#D9D9D9]' ></div>
                                    </div>
                                 )
                              })}
                           </div>
                        </div>
                     </div>

                  </div>
               </div>

            </div>
            <Message text='Session link has been copied to your clipboard' isOpen={isOpen} />
         </div>
      </div>
   )
}
