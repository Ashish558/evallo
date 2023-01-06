import React, { useEffect, useState } from 'react'
import ProfileCard from '../../../components/ProfileCard/ProfileCard'
import styles from './style.module.css'
import EditableText from '../../../components/EditableText/EditableText'

import ProfileImg from '../../../assets/images/profile.png'
import EditIcon from '../../../assets/icons/edit.svg'
import MailIcon from '../../../assets/icons/mail.svg'
import WhatsappIcon from '../../../assets/icons/whatsapp.svg'
import RightIcon from '../../../assets/icons/chevron-right.svg'
import LeftIcon from '../../../assets/profile/left.svg'
import ValueOneIcon from '../../../assets/images/val-1.svg'
import ValueTwoIcon from '../../../assets/images/val-2.svg'
import ValueThreeIcon from '../../../assets/images/val-3.svg'

import InterestOneIcon from '../../../assets/images/int-1.svg'
import InterestTwoIcon from '../../../assets/images/int-2.svg'
import InterestThreeIcon from '../../../assets/images/int-3.svg'
import SubjectSlider from '../../../components/SubjectSlider/SubjectSlider'
import { useNavigate, useParams } from 'react-router-dom'
import { useLazyGetUserDetailQuery } from '../../../app/services/users'
import { useSelector } from 'react-redux'
import ParentEditables from '../../Frames/Editables/ParentEditables/ParentEditables'
import { useLazyGetSettingsQuery } from '../../../app/services/session'
import ProfilePhoto from '../../../components/ProfilePhoto/ProfilePhoto'
import axios from 'axios'
import { BASE_URL, getAuthHeader } from '../../../app/constants/constants'
const students = [
   {
      id: 1,
      name: 'Joseph Brown',
      image: '/images/student-1.png',
   },
   {
      id: 1,
      name: 'Rebecca Brown',
      image: '/images/student-2.png',
   },
]

const values = [
   {
      icon: ValueOneIcon,
      text: 'Honesty',
      bg: '#A5A3F6'
   },
   {
      icon: ValueTwoIcon,
      text: 'Confidence',
      bg: '#85C396'
   },
   {
      icon: ValueThreeIcon,
      text: 'Brave',
      bg: '#FFA7C1'
   },
]
const interests = [
   {
      icon: InterestOneIcon,
      text: 'Video Game',
      bg: '#F6D0A3'
   },
   {
      icon: InterestTwoIcon,
      text: 'Cooking',
      bg: '#7BEA9A'
   },
   {
      icon: InterestThreeIcon,
      text: 'Yoga',
      bg: '#AADFEB'
   },
]

const subjects = [
   'Biology',
   'Biology',
   'Chemistry',
   'Chemistry',
   'Physics',
   'Physics',
]
const subjects1 = [
   {
      marks: '-',
      name: 'Verbal Score',
      bg: '#FEDCC3'
   },
   {
      marks: '-',
      name: 'Maths Score',
      bg: '#DACDFF'
   },
]

const subjects2 = [
   {
      marks: '-',
      name: 'Verbal',
      bg: '#FFCBCB'
   },
   {
      marks: '-',
      name: 'Maths',
      bg: '#A7EAF9'
   },
   {
      marks: '-',
      name: 'Verbal',
      bg: '#FFF38B'
   },
   {
      marks: '-',
      name: 'Maths',
      bg: '#A4FFA7'
   },
]
export default function StudentProfile({ isOwn }) {

   const navigate = useNavigate()
   const [editable, setEditable] = useState(false)
   const persona = sessionStorage.getItem('role')
   const [user, setUser] = useState({})
   const [userDetail, setUserDetail] = useState({})
   const [settings, setSettings] = useState({})
   const [associatedParent, setAssociatedParent] = useState({})
   const params = useParams()
   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()
   const [fetchSettings, settingsResp] = useLazyGetSettingsQuery()

   const { id } = useSelector(state => state.user)

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
      subscribeType: {
         active: false,
         subscribeType: ''
      },
      birthYear: {
         active: false,
         birthyear: '',
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
      accomodations: {
         active: false,
         accomodations: ''
      },
      service: {
         active: false,
         service: []
      },
      leadStatus: {
         active: false,
         leadStatus: ''
      },
      associatedParent: {
         active: false,
         associatedParent: ''
      },
      subjects: {
         active: false,
         subjects: []
      },
      personality: {
         active: false,
         personality: []
      },
      interest: {
         active: false,
         interest: []
      },
   })

   const handleClose = () => {
      setToEdit(prev => {
         let tempToEdit = {}
         Object.keys(prev).map(key => {
            tempToEdit[key] = { ...prev[key], active: false }
         })
         return tempToEdit
      })
   }

   useEffect(() => {
      if (persona === 'admin' || isOwn) {
         setEditable(true)
      }
   }, [])

   const fetchDetails = (closeModal) => {
      let userId = ''
      if (isOwn) {
         userId = id
      } else {
         userId = params.id
      }
      getUserDetail({ id: userId })
         .then(res => {
            console.log('response', res.data.data);
            const { firstName, lastName, phone, email } = res.data.data.user
            const { service, accomodations, timeZone, birthyear, associatedParent, personality, interest } = res.data.data.userdetails
            associatedParent && getUserDetail({ id: associatedParent })
               .then(res => {
                  const { firstName, lastName, _id, } = res.data.data.user
                  setAssociatedParent({
                     firstName, lastName, _id
                  })
               })
            setUser(res.data.data.user)
            const promiseState = async state => new Promise(resolve => {
               resolve(
                  setToEdit(prev => {
                     return {
                        ...prev,
                        fullName: {
                           ...prev.fullName,
                           firstName,
                           lastName,
                        },
                        timeZone: {
                           ...prev.timeZone,
                           timeZone: timeZone ? timeZone : ''
                        },
                        contact: {
                           ...prev.contact,
                           email: email,
                           phone: phone === null ? '' : phone
                        },
                        birthYear: {
                           ...prev.birthYear,
                           birthyear,
                        },
                        notes: {
                           ...prev.notes,
                        },
                        service: {
                           ...prev.service,
                           service: service ? [...service] : []
                        },
                        accomodations: {
                           ...prev.accomodations,
                           accomodations: accomodations
                        },
                        personality: {
                           ...prev.personality,
                           personality: personality
                        },
                        interest: {
                           ...prev.interest,
                           interest,
                        },
                     }
                  })
               )
            })
            promiseState()
               .then(() => {
                  closeModal && handleClose()
               })
            setUserDetail(res.data.data.userdetails)
         })
   }

   useEffect(() => {
      fetchDetails()
   }, [params.id])

   useEffect(() => {
      fetchSettings()
         .then(res => {
            setSettings(res.data.data.setting)
         })
   }, [])

   const handleProfilePhotoChange = (file) => {
      // console.log(file)
      let url = ''
      const formData = new FormData
      formData.append('photo', file)
      if (persona === 'admin') {
         url = `${BASE_URL}api/user/admin/addphoto/${params.id} `
      } else {
         url = `${BASE_URL}api/user/addphoto`
      }
      axios.patch(url, formData, { headers: getAuthHeader() })
         .then((res) => {
            console.log(res)
            fetchDetails()
         })
   }
   // console.log(user)
   // console.log(userDetail)
   // console.log(associatedParent)
   // console.log(settings)

   if (Object.keys(user).length < 1) return
   if (Object.keys(userDetail).length < 1) return
   if (Object.keys(settings).length < 1) return

   return (
      <>
         <div className='lg:ml-pageLeft bg-lightWhite min-h-screen pb-120'>
            <div className='lg:px-5 lg:pt-10'>
               <div className={`${styles.profileCard} relative`}>
                  <div className='rounded-t-40 bg-lightWhite lg:bg-transparent flex flex-col items-center'>
                     {/* <button className='absolute bg-[#D9BBFF] px-[14px] py-[12px] rounded-[8px] text-[#636363] text-[18px] font-medium top-[16px] left-[22px] flex gap-[12px] cursor-pointer' onClick={() => window.history.back()}><img src={LeftIcon} alt="icon" /> Back</button> */}
                     <ProfilePhoto src={user.photo ? user.photo : '/images/default.jpeg'}
                        handleChange={handleProfilePhotoChange} editable={editable} />
                     <div className='flex items-center mt-67 lg:mt-4 text-[#F3F5F7]'>
                        <EditableText text={`${user.firstName} ${user.lastName}`}
                           editable={editable}
                           onClick={() => setToEdit({ ...toEdit, fullName: { ...toEdit.fullName, active: true } })}
                           className='text-21 capitalize justify-center text-[#F3F5F7] text-center font-bold text-21 lg:text-40 lg:text-[#F3F5F7]'
                           textClassName='flex-1'
                           imgClass='ml-auto' />
                     </div>
                     <div className='flex items-center text-[#F3F5F7]'>
                        <p className='font-semibold text-[22px] mr-4'>
                           {/* 11th Grade */}
                        </p>
                        <p className='font-semibold text-[22px]'>
                           {/* Cambridge High School */}
                        </p>
                     </div>
                  </div>
               </div>

               <div className='lg:grid px-2 grid-cols-12 grid-ros-6 lg:mt-10 gap-5 lg:pl-3'>

                  <ProfileCard className='col-span-3 py-6 px-4 mt-3  lg:mt-0'
                     body={
                        <div className='flex justify-center flex-col'>
                           <div className='flex flex-1 flex-col mr-8'>
                              {/* <p className='text-primary text-center font-bold flex lg:text-lg whitespace-nowrap mb-1.5'>
                              Birth year
                           </p> */}
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, birthYear: { ...toEdit.birthYear, active: true } })}
                                 text='Birth year'
                                 className='text-lg mb-2' textClassName="text-[21px]" />
                              <p className=' font-medium text-[16px] lg:opacity-60 mb-5'>
                                 {userDetail.birthyear ? userDetail.birthyear : '-'}
                              </p>
                           </div>
                           <div className='flex flex-1 flex-col'>
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, subjects: { ...toEdit.subjects, active: true } })}
                                 text='Subjects'
                                 className='text-lg mb-2' textClassName='text-[21px]' />
                              <div className='grid grid-cols-2'>
                                 {userDetail.subjects ?
                                    userDetail.subjects.map((sub, idx) => {
                                       return <p key={idx} className='mt-1 gap-1 font-medium text-[16px] lg:mt-2 lg:opacity-60'>{sub} </p>
                                    }) : '-'
                                 }
                              </div>
                           </div>
                        </div>
                     } />

                  <div className='col-span-2 flex  justify-center items-center  scrollbar-content overflow-x-auto lg:py-5 bg-primary-light px-4 py-5 rounded-15'>
                     <div className='flex flex-col items-center mb-3'>
                        {/* <p className='text-lg text-center text-primary font-semibold mb-5 text-[21px]'>Associated Parent</p> */}
                        <EditableText editable={persona === 'admin' ? true : false}
                           onClick={() => setToEdit({ ...toEdit, associatedParent: { ...toEdit.associatedParent, active: true } })}
                           text='Associated Parent'
                           className='text-[21px] mb-2 flex justify-start text-center' />

                        <div>
                           <img src='/images/default.jpeg' className='rounded-full' width="98px" height="98px" />
                        </div>
                        <p className='font-bold text-[18px] opacity-[68%] mb-1'>
                           {Object.keys(associatedParent).length > 1 ? `${associatedParent.firstName} ${associatedParent.lastName}` : `${userDetail.FirstName} ${userDetail.LastName}`}
                        </p>

                        <div className='flex items-center'>
                           <span className='text-xs font-semibold opacity-60 inline-block mr-1'
                              onClick={() => Object.keys(associatedParent).length > 1 && navigate(`/profile/parent/${associatedParent._id}`)} >
                              View Profile
                           </span>
                           <img src={RightIcon} />
                        </div>

                     </div>

                  </div>

                  <div className='col-span-4 flex flex-col justify-between'>

                     <ProfileCard className='lg:mt-0 flex-1'
                        title={
                           <EditableText editable={editable}
                              onClick={() => setToEdit({ ...toEdit, contact: { ...toEdit.contact, active: true } })}
                              text='Contact'
                              className='text-[21px] mb-2 flex justify-start' />
                        }
                        body={
                           <div className='flex justify-center mt-5 lg:mt-1'>
                              <div className='flex flex-col items-center mr-8'>
                                 <img src={MailIcon} />
                                 <p className='mt-1 font-medium opacity-60 text-[14px]'>
                                    {user.email !== null ? user.email : '-'}
                                 </p>
                              </div>
                              <div className='flex flex-col items-center'>
                                 <img src={WhatsappIcon} />
                                 <p className='mt-1 font-medium.4 opacity-60 text-[14px]'>
                                    {user.phone !== null ? user.phone : '-'}
                                 </p>
                              </div>
                           </div>
                        } />

                     <ProfileCard className='mt-5 mt-auto flex-1'
                        title='PSAT / P-ACT Scores'
                        titleClassName='text-left'
                        body={
                           <div className='flex mt-5 lg:mt-5'>
                              <p className=' font-semibold text-[18px]'>
                                 -
                              </p>
                           </div>
                        } />
                  </div>

                  <ProfileCard
                     className='col-span-3 mt-6 lg:mt-0'

                     body={
                        <div className='overflow-x-auto scrollbar-content'>
                           <div className='mb-6'>
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, timeZone: { ...toEdit.timeZone, active: true } })}
                                 text='Time Zone'
                                 textClassName="text-[21px]"
                                 className='text-lg mb-2' />
                              <p className='mt-1.5 font-medium text-[18px] text-[#00000099] whitespace-nowrap'>
                                 {userDetail.timeZone ? userDetail.timeZone : '-'}

                              </p>
                           </div>
                           <div className='mb-6'>
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, subscribeType: { ...toEdit.subscribeType, active: true } })}
                                 text='Subscription'
                                 textClassName="text-[21px]"
                                 className='text-lg mb-2' />
                              <p className='mt-1.5 font-medium text-[18px] text-[#00000099] whitespace-nowrap'>
                                 {userDetail.subscribeType ? userDetail.subscribeType : '-'}
                              </p>
                           </div>
                           <div>
                              <p className='text-primary font-bold text-lg'>
                                 <EditableText editable={editable}
                                    onClick={() => setToEdit({ ...toEdit, accomodations: { ...toEdit.accomodations, active: true } })}
                                    text='Accomodations'
                                    textClassName="text-[21px]"
                                    className='text-lg mb-2' />
                              </p>
                              <p className='mt-1.5 font-medium text-[18px] text-[#00000099] whitespace-nowrap'>
                                 {userDetail.accomodations ? userDetail.accomodations : '-'}

                              </p>
                           </div>
                        </div>
                     }
                  />

                  <ProfileCard className='mt-53 col-span-3 lg:mt-0'
                     body={
                        <>
                           <EditableText editable={editable}
                              onClick={() => setToEdit({ ...toEdit, personality: { ...toEdit.personality, active: true } })}
                              text='Personality'
                              className='text-lg mb-2' textClassName="flex-1 text-center text-[21px]" />
                           <div className='flex scrollbar-content max-h-[500px]  scrollbar-vertical flex-col row-span-2 overflow-x-auto scrollbar-content h-[450px]'>
                              {settings && settings.personality && settings.personality.length > 0 && userDetail.personality && userDetail.personality.map((id, idx) => {
                                 return (
                                    <div key={idx} className='flex flex-col items-center mb-10'>
                                       <div className='flex h-90 w-90 rounded-full  items-center justify-center mb-3' >
                                          <img className='max-w-[90px] max-h-[90px]' src={settings.personality.find(item => item._id === id).image}
                                          />
                                       </div>
                                       <p className='opacity-70 font-semibold text-lg'>
                                          {settings.personality.find(item => item._id === id).text}
                                       </p>
                                    </div>
                                 )
                              })}
                           </div>
                        </>
                     } />

                  <div className='col-span-6'>
                     <ProfileCard
                        titleClassName='text-left text-[21px]'
                        className='mt-53 lg:mt-0'
                        body={
                           <>
                              <SubjectSlider totalMarks={'-'} outOf={'-'}
                                 header="Official SAT Scores"
                                 subjects={subjects1} title='Cumilative Score'
                              />
                           </>
                        } />
                     <ProfileCard
                        titleClassName='text-left'
                        className='mt-8'
                        body={
                           <>
                              <SubjectSlider totalMarks={'-'} outOf={'-'}
                                 header="Official ACT Scores"
                                 subjects={subjects2} title='Cumilative Score'
                              />
                           </>
                        } />
                  </div>
                  <ProfileCard className='mt-53 pb-0 col-span-3 lg:mt-0 overflow-auto '
                     body={
                        <>
                           <EditableText editable={editable}
                              onClick={() => setToEdit({ ...toEdit, interest: { ...toEdit.interest, active: true } })}
                              text='Interest'
                              className='text-lg mb-2' textClassName="flex-1 text-center text-[21px]" />
                           <div className='flex scrollbar-content max-h-[500px]  scrollbar-vertical flex-col overflow-x-auto'>
                              {settings && settings.interest.length > 0 && userDetail.interest.map((id, idx) => {
                                 return (
                                    <div key={idx} className='flex flex-col items-center mb-10'>
                                       <div className='flex h-90 w-90 rounded-full  items-center justify-center mb-3' >
                                          <img className='max-w-[90px] max-h-[90px]' src={settings.interest.find(item => item._id === id).image}
                                          />
                                       </div>
                                       <p className='opacity-70 font-semibold text-lg'>
                                          {settings.interest.find(item => item._id === id).text}
                                       </p>
                                    </div>
                                 )
                              })}
                           </div>
                        </>
                     } />
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
                                       {/* {userDetail.subscribeType ? userDetail.subscribeType : '-'} */}
                                       {userDetail.service ? userDetail.service.map((service, idx) => {
                                          return <p key={idx} className='opacity-80 mb-1 mr-1'>
                                             {service}{idx < userDetail.service.length - 1 ? ',' : ''}
                                          </p>
                                       }) : '-'}
                                    </div>
                                 </div>
                              </div>
                           }
                        />
                        <ProfileCard
                           className='mt-4 lg:order-7 lg:mt-0 lg:col-span-9'
                           body={
                              <div className='flex' >
                                 <div className='flex-1 lg:mr-12'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, notes: { ...toEdit.notes, active: true } })}
                                       text='Additional Note'
                                       className='lg:text-21 whitespace-nowrap' />
                                    <p className='font-medium text-sm mt-2 lg:mt-6 lg:opacity-60'>
                                       {userDetail.notes ? userDetail.notes : '-'}

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
                                       {userDetail.leadStatus ? userDetail.leadStatus : '-'}
                                    </p>
                                 </div>
                              </div>
                           }
                        />
                        <ProfileCard
                           className='mt-4 lg:order-9 lg:mt-5 lg:col-span-9'
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
                                          <p className='opacity-80'> Student </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Phone Number</p>
                                          <p className='opacity-80'> {user.phone ? user.phone : '-'}  </p>
                                       </div>
                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'>What service are you seeking?</p>
                                          <div>
                                             {userDetail.serviceSeeking.map((service, idx) => {
                                                return <p key={idx} className='opacity-80 inline-block mr-1'>
                                                   {service}{idx < userDetail.serviceSeeking.length - 1 ? ',' : ''} </p>
                                             })}
                                          </div>
                                       </div>

                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Parent First Name</p>
                                          <p className='opacity-80'> {userDetail.FirstName} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Parent Last Name  </p>
                                          <p className='opacity-80'> {userDetail.LastName} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Parent Email</p>
                                          <p className='opacity-80'> {userDetail.Email} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>Parent Phone </p>
                                          <p className='opacity-80'> {userDetail.Phone} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'>School Name</p>
                                          <p className='opacity-80'> {userDetail.schoolName} </p>
                                       </div>
                                       <div className='mb-7'>
                                          <p className='font-semibold mb-2'> Grade</p>
                                          <p className='opacity-80'>{userDetail.grade}  </p>
                                       </div>

                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'>Do you have any PSAT / P-ACT scores to share? How are your student's grades in school?</p>
                                          <p className='opacity-80'> - </p>
                                       </div>
                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'> Is your child taking any AP courses in school? Please select all that apply.</p>
                                          <div>
                                             {userDetail.apCourses.map((service, idx) => {
                                                return <p key={idx} className='opacity-80 inline-block mr-1'>
                                                   {service}{idx < userDetail.apCourses.length - 1 ? ',' : ''} </p>
                                             })}
                                          </div>
                                       </div>
                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'>Select if any of these apply to you </p>
                                          <div> {userDetail.motive.map((service, idx) => {
                                             return <p key={idx} className='opacity-80 mb-1'>
                                                {service}{idx < userDetail.motive.length - 1 ? ',' : ''}
                                             </p>
                                          })}
                                          </div>
                                       </div>
                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'>Please enter the subscription code required to access Seven Square Learning and starting prep. </p>
                                          <p className='opacity-80'> {userDetail.subscriptionCode} </p>
                                       </div>
                                       <div className='mb-7 col-span-2'>
                                          <p className='font-semibold mb-2'>How did you hear about us? </p>
                                          <div> {userDetail.hearAboutUs.map((service, idx) => {
                                             return <p key={idx} className='opacity-80 inline-block mr-1'>
                                                {service}{idx < userDetail.hearAboutUs.length - 1 ? ',' : ''} </p>
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
