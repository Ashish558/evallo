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
import { useLazyGetSessionsQuery } from '../../app/services/session';
import { useSelector } from 'react-redux';
import Message from '../../components/Message/Message';

const students = [
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

const studentsData = [
   {
      name: 'Joseph Brown',
      img: StudentImg,
      dueDate: 'June 20, 2022'
   },
   {
      name: 'Joseph Brown',
      img: StudentImg,
      dueDate: 'June 20, 2022'
   },
   {
      name: 'Joseph Brown',
      img: StudentImg,
      dueDate: 'June 20, 2022'
   },
]
export default function TutorDashboard() {

   const [fetchUserSessions, fetchUserSessionsResponse] =
      useLazyGetSessionsQuery();

   const [sessions, setSessions] = useState([])
   const [isOpen, setIsOpen] = useState(false)
   const { id } = useSelector(state => state.user)

   useEffect(() => {
      const url = `/api/session/tutor/${id}`;
      fetchUserSessions(url)
         .then(res => {
            console.log(res.data.data.session)
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

   const handleLinkClick = (text) => {
      setIsOpen(true)
      navigator.clipboard.writeText(text)
      setTimeout(() => {
         setIsOpen(false)
      }, 5000);
   }

   return (
      <div className="lg:ml-pageLeft bg-lightWhite min-h-screen overflow-x-hidden">
         <div className="py-8 px-5">

            <div className='flex items-start'>

               <div className='flex flex-col items-start flex-[7]' >
                  <div className='px-4 mb-[50px]'>
                     <p className='text-primary-dark font-semibold text-[21px] mb-8'>Latest Students</p>
                     <div className={styles.studentImages} >
                        <OwlCarousel items={5} autoWidth margin={20} >
                           {students.map(student => {
                              return <div className='flex flex-col items-center'>
                                 <img src={student.src} className='w-[100px]' />
                                 <p className='text-lg font-semibold mt-4'> {student.name} </p>
                              </div>
                           })}

                        </OwlCarousel>
                     </div>
                  </div>

                  <div className='flex w-full pl-6'>
                     <DashboardCard data={{ title: '14', subtitle: 'Hours', }}
                        header='Completed'
                        subHeader='this month'
                        className='bg-[#7E82F0]' />
                     <DashboardCard data={{ title: '2.4k', subtitle: 'INR', titleClassName: 'text-[30px]' }}
                        header='Earned'
                        subHeader='this month'
                        className='bg-[#4BBD94]' />
                  </div>


                  <div className='w-full pl-6 mt-10'>
                     <p className='text-primary-dark font-semibold text-[21px] mb-4'>Today’s Schedule</p>
                     <div className='px-[29px] py-[31px] bg-white  rounded-[20px] scrollbar-content scrollbar-vertical max-h-[600px] overflow-auto'>
                        {sessions.map((item, idx) => {
                           return <TutorSchedule {...item} setIsOpen={setIsOpen} handleLinkClick={handleLinkClick} />
                        })}
                     </div>
                  </div>


               </div>
               <div className='flex-1 flex-[6] px-4 pl-6 bg-[#D9D9D9]/10 mt-[20px] rounded-[20px] pt-[65px]'>

                  <div className='px-4'>
                     <div className='flex justify-between items-center px-4 mb-3'>
                        <p className='text-primary font-semibold text-[21px]'>
                           Complete your Profile
                        </p>
                        <img src={RightIcon} />
                     </div>
                     <p className='text-lg font-semibold px-4 mb-[10px]'>Profile Status</p>
                     <ProgressBar num={65} />
                  </div>

                  <div className='px-8 mt-8'>
                     <p className='text-primary font-semibold text-[21px] mb-4'>
                        Rank
                     </p>
                     <div className={`max-w-[500px] py-[17px] px-[19px] flex flex-1 text-white rounded-20  first:mr-[30px] bg-primary`}>
                        <div className='self-stretch min-w-[80px] h-[80px] text-center bg-black/20 rounded-[15px] flex flex-col justify-center'>
                           <img src={HatIcon} className='objects-contain' />
                        </div>

                        <div className='px-6'>
                           <p className='pt-[6px] font-bold text-[27px]'>
                              Tutor Rank
                           </p>
                           <p className='text-xs font-semibold'>
                              Total Tutoring Hours:
                              Avg Session Feedback:
                              Total Client Referrals:
                           </p>
                        </div>

                     </div>
                  </div>

                  <div className='px-8 pr-4 mt-8'>
                     <p className='text-primary font-semibold text-[21px] mb-4'>
                        Latest Practice Test
                     </p>
                     <div className='px-[25px] py-[25px] bg-white rounded-20'>
                        {studentsData.map(item => {
                           return (
                              <div className='flex items-center mb-8'>
                                 <div>
                                    <img src={item.img} className='w-[62px] h-[62px] rounded-full' />
                                 </div>
                                 <div className='ml-[21px] mr-[8px] flex-1'>
                                    <p className='font-semibold text-lg mb-1'> SAT B2 </p>
                                    <div className='text-xs font-semibold flex opacity-50'>
                                       <p>Due Date</p>
                                       <p className='ml-3'> {item.dueDate} </p>
                                    </div>
                                 </div>
                                 <button className='bg-primaryOrange font-semibold text-sm rounded-[6px] px-8 py-3 text-white'>
                                    View
                                 </button>
                              </div>
                           )
                        })}
                     </div>
                  </div>


               </div>
            </div>

         </div>
         <Message text='Session link has been copied to your clipboard' isOpen={isOpen} />
      </div>
   )
}
