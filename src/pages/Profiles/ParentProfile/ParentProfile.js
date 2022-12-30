import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from '../style.module.css'

import ProfileCard from '../../../components/ProfileCard/ProfileCard'
import ProfileImg from '../../../assets/images/profile.png'
import EditIcon from '../../../assets/icons/edit.svg'
import MailIcon from '../../../assets/icons/mail.svg'
import WhatsappIcon from '../../../assets/icons/whatsapp.svg'
import LeftIcon from '../../../assets/profile/left.svg'
import RightIcon from '../../../assets/profile/right.svg'

import EditableText from '../../../components/EditableText/EditableText'
import { act } from 'react-dom/test-utils'
import ParentEditables from '../../Frames/Editables/ParentEditables/ParentEditables'
import { useLazyGetUserDetailQuery } from '../../../app/services/users'
import { useLazyGetSettingsQuery } from '../../../app/services/session'
import { useSelector } from 'react-redux'

const students = [
   {
      id: 1,
      name: 'Joseph Brown',
      image: '/images/student-1.png',
   },
   {
      id: 2,
      name: 'Rebecca Brown',
      image: '/images/student-2.png',
   },
]

export default function ParentProfile({ isOwn }) {

   const [editable, setEditable] = useState(false)
   const [activeIndex, setActiveIndex] = useState(0)
   const [associatedStudents, setAssociatedStudents] = useState([])
   const [user, setUser] = useState({})
   const [userDetail, setUserDetail] = useState({})
   const [settings, setSettings] = useState({})

   const { id } = useSelector(state => state.user)

   const [fetchSettings, settingsResp] = useLazyGetSettingsQuery()
   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()

   const navigate = useNavigate()
   const params = useParams()

   const persona = sessionStorage.getItem('role')
   // console.log(id)

   useEffect(() => {
      fetchSettings()
         .then(res => {
            setSettings(res.data.data.setting)
         })
   }, [])

   const [toEdit, setToEdit] = useState({
      fullName: {
         active: false,
         firstName: '',
         lastName: '',
      },
      timeZone: {
         active: false,
         timeZone: '',
      },
      subscriptionType: {
         active: false,
         text: '',
      },
      birthYear: {
         active: false,
         birthyear: '',
      },
      industry: {
         active: false,
         industry: '',
      },
      contact: {
         active: false,
         email: '',
         phone: '',
      },
      address: {
         active: false,
         residentialAddress: '',
      },
      associatedStudents: {
         active: false,
         assiginedStudents: []
      },
      notes: {
         active: false,
         notes: ''
      },
      service: {
         active: false,
         service: []
      },
      subscribeType: {
         active: false,
         subscribeType: ''
      },
      leadStatus: {
         active: false,
         leadStatus: ''
      }
   })

   useEffect(() => {
      if (persona === 'admin' || isOwn) {
         setEditable(true)
      }
   }, [])

   const handleClose = () => {
      setToEdit(prev => {
         let tempToEdit = {}
         Object.keys(prev).map(key => {
            tempToEdit[key] = { ...prev[key], active: false }
         })
         return tempToEdit
      })
   }

   const fetchDetails = (closeModal) => {
      let userId = ''
      if (isOwn) {
         userId = id
      } else {
         userId = params.id
      }
      // console.log('USERID', userId);
      getUserDetail({ id: userId })
         .then(res => {
            console.log('response', res.data.data);
            const { firstName, lastName, phone, email, assiginedStudents } = res.data.data.user
            setUser(res.data.data.user)
            const { birthyear, industry, leadStatus, notes, residentialAddress, service, timeZone, subscribeType } = res.data.data.userdetails

            let studentsData = []
            if (assiginedStudents === undefined || assiginedStudents.length === 0) setAssociatedStudents(students)

            assiginedStudents !== undefined && assiginedStudents.map(student => {
               getUserDetail({ id: student })
                  .then(res => {
                     studentsData.push({
                        _id: res.data.data.user._id,
                        value: `${res.data.data.user.firstName} ${res.data.data.user.lastName}`
                     })
                  })
            })

            setToEdit({
               ...toEdit,
               fullName: {
                  ...toEdit.fullName, firstName, lastName,
               },
               timeZone: {
                  ...toEdit.timeZone,
                  timeZone
               },
               birthYear: {
                  ...toEdit.birthYear,
                  birthyear
               },
               industry: {
                  ...toEdit.industry,
                  industry
               },
               contact: {
                  ...toEdit.contact,
                  email: email,
                  phone: phone === null ? '' : phone
               },
               address: {
                  ...toEdit.address,
                  residentialAddress
               },
               notes: {
                  ...toEdit.notes,
                  notes
               },
               service: {
                  ...toEdit.service,
                  service,
               },
               subscriptionType: {
                  ...toEdit.subscriptionType,
                  subscribeType,
               },
               associatedStudents: {
                  ...toEdit.associatedStudents,
                  assiginedStudents: res.data.data.user.assiginedStudents,
                  studentsData: studentsData
               },
               leadStatus: {
                  ...toEdit.leadStatus,
                  leadStatus
               }
            })
            setUserDetail(res.data.data.userdetails)
            closeModal && handleClose()
         })
   }

   // console.log('userdetail', userDetail)
   // console.log('user', user) 
   // console.log(toEdit)
   // console.log(associatedStudents)

   useEffect(() => {
      if (user.assiginedStudents === undefined) return
      const fetch = async () => {
         let studentsData = []
         const students = await user.assiginedStudents.map(student => {
            getUserDetail({ id: student })
               .then(res => {
                  studentsData.push({
                     _id: res.data.data.user._id,
                     name: `${res.data.data.user.firstName} ${res.data.data.user.lastName}`
                  })
               })
         })
         setAssociatedStudents(studentsData)
         setActiveIndex(0)
      }
      fetch()
   }, [user])

   useEffect(() => {
      fetchDetails()
   }, [params.id])

   
   if (Object.keys(user).length < 1) return
   if (Object.keys(userDetail).length < 1) return
   // if (userDetail === undefined) return

   return (
      <>
         <div className='lg:ml-pageLeft bg-lightWhite min-h-screen pb-[100px]'>
            <div className='lg:px-[56px] lg:pt-10'>
               <div className={styles.profileCard}>
                  {/* <button className='absolute bg-[#D9BBFF] px-[14px] py-[12px] rounded-[8px] text-[#636363] text-[18px] font-medium top-[16px] left-[22px] flex gap-[12px] cursor-pointer'><img src={LeftIcon} alt="icon" /> Back</button> */}
                  <div className='rounded-t-40 bg-lightWhite lg:bg-transparent flex flex-col items-center relative'>
                     <div className={styles.imgContainer}>
                        <img src={ProfileImg} />
                     </div>
                     <div className='flex items-center mt-67 lg:mt-4'>
                        <EditableText text={`${user.firstName} ${user.lastName}`}
                           editable={editable}
                           onClick={() => setToEdit({ ...toEdit, fullName: { ...toEdit.fullName, active: true } })}
                           className='justify-center text-primary text-center font-bold text-21 lg:text-40 lg:text-[#F3F5F7]'
                           textClassName='flex-1'
                           imgClass='ml-auto' />
                     </div>
                  </div>
               </div>

               <div className='lg:inline-grid lg:w-full lg:grid-cols-13 grid-cols-3 grid-rws-3 lg:mt-10 gap-8 lg:pl-3'>

                  <ProfileCard className='mt-53 lg:h-140 lg:order-3 lg:mt-0 lg:col-span-5'
                     title={
                        <EditableText text='Contact' editable={editable}
                           onClick={() => setToEdit({ ...toEdit, contact: { ...toEdit.contact, active: true } })}
                           className='text-21 justify-center text-left'
                           textClassName='flex-1'
                           imgClass='ml-auto' />
                     }
                     body={
                        <div className='flex flex-col gap-[9px] justify-start mt-5 lg:mt-1'>
                           <div className='flex items-center gap-[11px]'>
                              <img src={MailIcon} className='w-[19px]' />
                              <p className='mt-1 font-medium opacity-60 text-[14px]'>
                                 {user.email !== null ? user.email : '-'}
                              </p>
                           </div>
                           <div className='flex items-center gap-[11px]'>
                              <img src={WhatsappIcon} className='w-[19px]' />
                              <p className='mt-1 font-medium.4 opacity-60 text-[14px]'>
                                 {user.phone !== null ? user.phone : '-'}
                              </p>
                           </div>
                        </div>
                     } />

                  <ProfileCard className='py-6 lg:h-140 px-4 mt-3 lg:order-4 lg:mt-0 lg:col-span-5'
                     body={
                        <div className='flex justify-center'>
                           <div className='flex flex-1 flex-col mr-8'>
                              {/* <p className='text-primary text-center font-bold flex lg:text-21 whitespace-nowrap'>
                                 Birth year
                                 <img src={EditIcon} className='ml-4' />
                              </p> */}
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, birthYear: { ...toEdit.birthYear, active: true } })}
                                 text='Birth year'
                                 className='text-21 justify-start'
                                 imgClass="w-[16px]"
                              />
                              <p className='mt-1 text-[16px] font-semibold lg:mt-6 lg:opacity-60'>
                                 {userDetail?.birthyear ? userDetail?.birthyear : '-'}
                              </p>
                           </div>
                           <div className='flex flex-1 flex-col'>
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, industry: { ...toEdit.industry, active: true } })}
                                 text='Industry'
                                 className='text-21 justify-start'
                                 imgClass="w-[16px]"
                              />
                              <p className='mt-1 font-semibold text-[16px] lg:mt-6 lg:opacity-60'>
                                 {userDetail?.industry ? userDetail?.industry : '-'}
                              </p>
                           </div>
                        </div>
                     } />

                  <ProfileCard
                     className='mt-6 lg:h-140 lg:order-5 lg:mt-0 lg:col-span-5'
                     title={
                        <EditableText editable={editable}
                           onClick={() => setToEdit({ ...toEdit, address: { ...toEdit.address, active: true } })}
                           text='Residential Address'
                           className='text-21 justify-between'
                        />
                     }
                     body={
                        <div className='overflow-x-auto scrollbar-content pb-7'>
                           <p className='mt-2 lg:mt-6 font-medium text-[18px] whitespace-nowrap	'>
                              {userDetail?.residentialAddress ? userDetail?.residentialAddress : '-'}
                           </p>
                        </div>
                     }
                  />

                  <ProfileCard
                     className='mt-4 lg:h-140 lg:order-2 lg:mt-0 lg:col-span-5'
                     body={
                        <div className='flex'>
                           <div className='flex-1 lg:mr-12'>
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, timeZone: { ...toEdit.timeZone, active: true } })}
                                 text='Time Zone'
                                 className='lg:text-21 whitespace-nowrap' />
                              <p className='font-semibold text-[16px] mt-2 lg:mt-6 lg:opacity-60'>
                                 {userDetail?.timeZone ? userDetail?.timeZone : '-'}
                              </p>
                           </div>
                           <div className='flex-1'>
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, subscribeType: { ...toEdit.subscribeType, active: true } })}
                                 text='Subscription'
                                 className='text-21 justify-between'
                              />
                              {/* <p className='text-primary font-bold lg:text-21'>Subscription</p> */}
                              <p className='text-[16px] font-semibold mt-2 lg:mt-6 lg:opacity-60'>
                                 {userDetail?.subscribeType ? userDetail?.subscribeType : '-'}
                              </p>
                           </div>
                        </div>
                     }
                  />
                  <ProfileCard
                     className=' row-span-2 lg:order-1 lg:col-span-3'
                     bgClassName='bg-primary-light'
                     body={
                        <div className='flex py-49 h-full lg:flex-col scrollbar-content overflow-x-hidden lg:py-0'>
                           <p className='hidden lg:block text-21 text-primaryDark font-bold text-center mb-10'>
                              <EditableText editable={true}
                                 onClick={() => setToEdit({ ...toEdit, associatedStudents: { ...toEdit.associatedStudents, active: true } })}
                                 text='Associated Students'
                                 className='lg:text-21 text-center' />
                           </p>
                           <div className={`${styles.studentsContainer} min-h-[200px] w-full`}>
                              <img src={LeftIcon}
                                 className={`${styles.sliderIcon} ${styles.sliderLeftIcon}`}
                                 onClick={() => activeIndex !== 0 && setActiveIndex(activeIndex - 1)} />
                              <img src={RightIcon}
                                 className={`${styles.sliderIcon} ${styles.sliderRightIcon}`}
                                 onClick={() => activeIndex < associatedStudents.length - 1 &&
                                    setActiveIndex(activeIndex + 1)} />

                              {associatedStudents.map((student, idx) => {
                                 return (
                                    <div key={idx} className={`${styles.student} ${activeIndex === idx ? styles.activeStudent : idx < activeIndex ? styles.previousStudent : styles.nextStudent} flex flex-col items-center px-10 lg:mb-10`}>
                                       <div className={styles.studentImageContainer}>
                                          <img src='/images/student-1.png' />
                                       </div>
                                       <div className='mt-6 opacity-60 font-inter text-center '
                                       // onClick={() => navigate('/profile/student/12')}
                                       >
                                          <p className='font-bold text-[18px] whitespace-nowrap'>
                                             {student.name}
                                          </p>
                                          {/* <span className='cursor-pointer text-[12px] font-semibold flex items-center gap-[8px] justify-center'> View Profile <img src={RightIcon} width="8px" alt="rightIcon" /> </span> */}
                                          <span className='cursor-pointer text-[12px] font-semibold flex items-center gap-[8px] justify-center' onClick={() => navigate(`/profile/student/${student._id}`)} > View Profile </span>
                                       </div>
                                    </div>
                                 )
                              })}
                           </div>
                        </div>
                     }
                  />
                  {
                     persona === 'admin' &&
                     <>
                        <ProfileCard
                           className='mt-4 lg:order-6 lg:mt-0 lg:col-span-3'
                           body={
                              <div className='flex' >
                                 <div className='flex-1 lg:mr-12'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, service: { ...toEdit.service, active: true } })}
                                       text='Service'
                                       className='lg:text-21 whitespace-nowrap' />
                                    <div className='font-medium text-sm mt-2 lg:mt-6 flex flex-wrap lg:opacity-60'>
                                       {/* {userDetail?.subscribeType ? userDetail?.subscribeType : '-'} */}
                                       {userDetail?.service ? userDetail?.service.map((service, idx) => {
                                          return <p className='opacity-80 mb-1 mr-1'>
                                             {service}{idx < userDetail?.service.length - 1 ? ',' : ''}
                                          </p>
                                       }) : '-'}
                                    </div>
                                 </div>
                              </div>
                           }
                        />
                        <ProfileCard
                           className='mt-4 lg:order-7 lg:mt-0 lg:col-span-10'
                           body={
                              <div className='flex' >
                                 <div className='flex-1 lg:mr-12'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, notes: { ...toEdit.notes, active: true } })}
                                       text='Notes'
                                       className='lg:text-21 whitespace-nowrap' />
                                    <p className='font-medium text-sm mt-2 lg:mt-6 lg:opacity-60'>
                                       {userDetail?.notes ? userDetail?.notes : '-'}

                                    </p>
                                 </div>
                              </div>
                           }
                        />
                        <ProfileCard
                           className='mt-4 lg:order-8 lg:mt-5 lg:col-span-3'
                           body={
                              <div className='flex' >
                                 <div className='flex-1 lg:mr-12'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, leadStatus: { ...toEdit.leadStatus, active: true } })}
                                       text='Lead Status'
                                       className='lg:text-21 whitespace-nowrap' />
                                    <p className='font-medium text-sm mt-2 lg:mt-6 lg:opacity-60'>
                                       {userDetail?.leadStatus ? userDetail?.leadStatus : '-'}
                                    </p>
                                 </div>
                              </div>
                           }
                        />
                        <ProfileCard
                           className='mt-4 lg:order-9 lg:mt-5 lg:col-span-10'
                           body={
                              <div className='flex' >
                                 <div className='flex-1 lg:mr-12'>
                                    <EditableText editable={false}
                                       onClick={() => setToEdit({ ...toEdit, timeZone: { ...toEdit.timeZone, active: true } })}
                                       text='Sign Up Form Details'
                                       className='lg:text-21 whitespace-nowrap' />
                                    <div className='grid grid-cols-2 py-4 pt-5' >

                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>First Name</p>
                                          <p className='opacity-80'> {user.firstName} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Last Name</p>
                                          <p className='opacity-80'> {user.lastName} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Are you a parent or student?</p>
                                          <p className='opacity-80'> Parent </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Phone Number</p>
                                          <p className='opacity-80'> {user.phone ? user.phone : '-'}  </p>
                                       </div>
                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'>What service are you seeking?</p>
                                          <div> {userDetail?.serviceSeeking.map((service, idx) => {
                                             return <p className='opacity-80 inline-block mr-1'>
                                                {service}{idx < userDetail?.serviceSeeking.length - 1 ? ',' : ''} </p>
                                          })}
                                          </div>
                                       </div>

                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Student First Name</p>
                                          <p className='opacity-80'> {userDetail?.FirstName} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Student Last Name  </p>
                                          <p className='opacity-80'> {userDetail?.LastName} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Student Email</p>
                                          <p className='opacity-80'> {userDetail?.Email} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Student Phone </p>
                                          <p className='opacity-80'> {userDetail?.Phone} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Student’s School Name</p>
                                          <p className='opacity-80'> {userDetail?.schoolName} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Student Grade</p>
                                          <p className='opacity-80'>{userDetail?.grade}  </p>
                                       </div>

                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'>Do you have any PSAT / P-ACT scores to share? How are your student's grades in school?</p>
                                          <p className='opacity-80'> - </p>
                                       </div>
                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'> Is your child taking any AP courses in school? Please select all that apply.</p>
                                          <div> {userDetail?.apCourses.map((service, idx) => {
                                             return <p className='opacity-80 inline-block mr-1'>
                                                {service}{idx < userDetail?.apCourses.length - 1 ? ',' : ''} </p>
                                          })}
                                          </div>
                                       </div>
                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'>Select if any of these apply to you </p>
                                          <div> {userDetail?.motive.map((service, idx) => {
                                             return <p className='opacity-80 mb-1'>
                                                {service}{idx < userDetail?.motive.length - 1 ? ',' : ''}
                                             </p>
                                          })}
                                          </div>
                                       </div>
                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'>Please enter the subscription code required to access Seven Square Learning and starting prep. </p>
                                          <p className='opacity-80'> {userDetail?.subscriptionCode} </p>
                                       </div>
                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'>How did you hear about us? </p>
                                          <div> {userDetail?.hearAboutUs.map((service, idx) => {
                                             return <p className='opacity-80 inline-block mr-1'>
                                                {service}{idx < userDetail?.hearAboutUs.length - 1 ? ',' : ''} </p>
                                          })}
                                          </div>
                                       </div>

                                    </div>
                                 </div>
                              </div>
                           }
                        />
                     </>
                  }
               </div>

            </div>
         </div>
         <ParentEditables settings={settings} fetchDetails={fetchDetails}
            userId={isOwn ? id : params.id} toEdit={toEdit} setToEdit={setToEdit}
            persona={user.role} />
      </>
   )
}
