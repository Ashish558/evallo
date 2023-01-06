import React, { useState } from 'react'
import ProfileCard from '../../../components/ProfileCard/ProfileCard'
import styles from './style.module.css'
import EditableText from '../../../components/EditableText/EditableText'

import ProfileImg from '../../../assets/images/profile.png'
import TutorImg from '../../../assets/images/tutor.png'
import TutorSmallImg from '../../../assets/images/tutor-small.png'

import EditIcon from '../../../assets/icons/edit.svg'
import MailIcon from '../../../assets/icons/mail.svg'
import LinkedIn from '../../../assets/icons/linked-in.svg'
import WhatsappIcon from '../../../assets/icons/whatsapp.svg'
import RightIcon from '../../../assets/icons/chevron-right.svg'

import ValueOneIcon from '../../../assets/images/val-1.svg'
import ValueTwoIcon from '../../../assets/images/val-2.svg'
import ValueThreeIcon from '../../../assets/images/val-3.svg'

import TutorLevelOne from '../../../assets/profile/tutor-level-1.svg'
import TutorLevelTwo from '../../../assets/profile/tutor-level-2.svg'
import TutorLevelThree from '../../../assets/profile/tutor-level-3.svg'
import TutorLevelFour from '../../../assets/profile/tutor-level-4.svg'

import EducationIcon from '../../../assets/profile/education.svg'

import InterestOneIcon from '../../../assets/images/int-1.svg'
import InterestTwoIcon from '../../../assets/images/int-2.svg'
import InterestThreeIcon from '../../../assets/images/int-3.svg'
import SubjectSlider from '../../../components/SubjectSlider/SubjectSlider'
import BackBtn from '../../../components/Buttons/Back'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLazyGetTutorDetailsQuery } from '../../../app/services/users'
import { useLazyGetSettingsQuery, useLazyGetSingleSessionQuery } from '../../../app/services/session'
import { useSelector } from 'react-redux'
import ParentEditables from '../../Frames/Editables/ParentEditables/ParentEditables'
import { useLazyGetFeedbacksQuery } from '../../../app/services/dashboard'
import FeedbackTable from './FeedbackTable/FeedbackTable'
import { BASE_URL, getAuthHeader } from '../../../app/constants/constants'
import axios from 'axios'
import ProfilePhoto from '../../../components/ProfilePhoto/ProfilePhoto'


const values = [
   {
      icon: ValueOneIcon,
      text: 'SAT Subject Test',
      bg: '#A5A3F6'
   },
   {
      icon: ValueTwoIcon,
      text: 'AP Biology',
      bg: '#85C396'
   },
   {
      icon: ValueThreeIcon,
      text: 'Physics',
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

const levels = {
   one: {
      bg: '#FBDB89',
      icon: TutorLevelOne,
      text: '#FF4300'
   },
   two: {
      bg: '#7152EB',
      icon: TutorLevelTwo,
      text: '#472D70'
   },
   three: {
      bg: '#DC8553',
      icon: TutorLevelThree,
      text: '#FFFFFF'
   },
   four: {
      bg: '#2D2C2C',
      icon: TutorLevelFour,
      text: '#FFFFFF'
   }
}

export default function TutorProfile({ isOwn }) {

   const navigate = useNavigate()
   const [editable, setEditable] = useState(false)
   const persona = sessionStorage.getItem('role')
   const [user, setUser] = useState({})
   const [userDetail, setUserDetail] = useState({})
   const [settings, setSettings] = useState({})

   const params = useParams()
   const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery()
   const [fetchSettings, settingsResp] = useLazyGetSettingsQuery()
   const [getFeedbacks, getFeedbacksResp] = useLazyGetFeedbacksQuery()
   const [getSession, getSessionResp] = useLazyGetSingleSessionQuery()
   const [feedbacks, setFeedbacks] = useState([])

   const { id } = useSelector(state => state.user)

   const [toEdit, setToEdit] = useState({
      fullName: {
         active: false,
         firstName: '',
         lastName: '',
      },
      tagLine: {
         active: false,
         tagLine: '',
         isPresent: false,
      },
      about: {
         active: false,
         about: '',
         isPresent: false,
      },
      tutorLevel: {
         active: false,
         tutorLevel: '',
         isPresent: false,
      },
      education: {
         active: false,
         education: '',
         isPresent: false,
      },
      rates: {
         active: false,
         testPrepRate: '',
         otherRate: '',
         subjectTutoringRate: '',
      },
      tutorAddress: {
         active: false,
         address: '',
         isPresent: false,
      },
      pincode: {
         active: false,
         pincode: '',
         isPresent: false,
      },
      paymentInfo: {
         active: false,
         isPresent: false,
         paymentInfo: {
            bankName: '',
            AccNo: '',
            ifcsCode: '',
         }
      },
      tutorRank: {
         active: false,
         tutorRank: '',
         isPresent: false,
      },
      income: {
         active: false,
         income: '',
         isPresent: false,
      },
      paymentStatus: {
         active: false,
         paymentStatus: '',
         isPresent: false,
      },
      tutorContact: {
         active: false,
         email: '',
         phone: '',
         linkedIn: '',
         isPresent: false,
      },
      interest: {
         active: false,
         interest: []
      },
      serviceSpecializations: {
         active: false,
         serviceSpecializations: []
      },
   })

   useEffect(() => {
      getFeedbacks()
         .then(({ error, data }) => {
            if (error) {
               console.log(error)
               return
            }
            data.data.feedback.map(feedback => {
               getUserDetail({ id: feedback.studentId })
                  .then(res => {
                     const student = res.data.data.user
                     getSession(feedback.sessionId)
                        .then(res => {
                           const session = res.data.data.session
                           setFeedbacks(prev => {
                              let obj = {
                                 ...feedback,
                                 studentName: `${student.firstName} ${student.lastName}`,
                                 service: session.service
                              }
                              let allFeedbacks = [...prev,
                              { ...obj }
                              ]
                              return allFeedbacks.sort(function (a, b) {
                                 return new Date(b.updatedAt) - new Date(a.updatedAt);
                              });
                           })
                        })
                  })
            })
         })
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
            // console.log('response', res.data.data);
            const { firstName, lastName, phone, email } = res.data.data.user
            setUser(res.data.data.user)
            let details = res.data.data.details

            // const { } = res.data.data.user
            // const { service } = res.data.data.userdetails
            const promiseState = async state => new Promise(resolve => {
               resolve(setToEdit(prevToEdit => {
                  return {
                     ...prevToEdit,
                     fullName: {
                        ...prevToEdit.fullName,
                        firstName,
                        lastName,
                     },
                     tutorContact: {
                        ...prevToEdit.tutorContact,
                        email: email,
                        phone: phone === null ? '' : phone,
                        linkedIn: '',
                        isPresent: details === null ? false : true
                     },
                     tagLine: {
                        ...prevToEdit.tagLine,
                        isPresent: details === null ? false : true
                     },
                     tutorLevel: {
                        ...prevToEdit.tutorLevel,
                        isPresent: details === null ? false : true
                     },
                     about: {
                        ...prevToEdit.about,
                        isPresent: details === null ? false : true
                     },
                     education: {
                        ...prevToEdit.education,
                        isPresent: details === null ? false : true
                     },
                     rates: {
                        ...prevToEdit.rates,
                        isPresent: details === null ? false : true
                     },
                     tutorAddress: {
                        ...prevToEdit.tutorAddress,
                        isPresent: details === null ? false : true
                     },
                     pincode: {
                        ...prevToEdit.pincode,
                        isPresent: details === null ? false : true
                     },
                     paymentInfo: {
                        ...prevToEdit.paymentInfo,
                        isPresent: details === null ? false : true
                     },
                     tutorRank: {
                        ...prevToEdit.tutorRank,
                        isPresent: details === null ? false : true
                     },
                     income: {
                        ...prevToEdit.income,
                        isPresent: details === null ? false : true
                     },
                     paymentStatus: {
                        ...prevToEdit.paymentStatus,
                        isPresent: details === null ? false : true
                     },
                     interest: {
                        ...prevToEdit.interest,
                        interest: details !== null ? details.interest : [],
                        isPresent: details === null ? false : true
                     },
                     serviceSpecializations: {
                        ...prevToEdit.serviceSpecializations,
                        serviceSpecializations: details !== null ? details.serviceSpecializations : [],
                        isPresent: details === null ? false : true
                     },
                  }
               }))
            })

            promiseState()
               .then(() => {
                  closeModal && handleClose()
               })

            if (res.data.data.details == null) {
               setUserDetail({})
            } else {
               setUserDetail(res.data.data.details)
            }
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

   // console.log('user', user)
   // console.log('To-edit', toEdit)
   // console.log('userdetail', userDetail)
   // console.log('settings', settings.serviceSpecialisation)
   const { about, education, tagLine, tutorLevel, testPrepRate, otherRate, subjectTutoringRate, address, pincode, paymentInfo, tutorRank, income, paymentStatus, linkedIn } = userDetail
   // console.log('userdetail', tutorLevel)

   if (Object.keys(user).length < 1) return
   if (Object.keys(settings).length < 1) return
   // if (Object.keys(userDetail).length < 1) return
   let tutorLevelIcon = TutorLevelOne
   let tutorLevelTextColor = 'text-[#ff4300]'
   let tutorLevelBg = '#FBDB89'

   const levels = {
      one: {
         bg: '#FBDB89',
         text: '#FF4300'
      },
      two: {
         bg: '#7152EB',
         text: '#472D70'
      },
      three: {
         bg: '#DC8553',
         text: '#FFFFFF'
      },
      four: {
         bg: '#2D2C2C',
         text: '#FFFFFF'
      }
   }
   if (tutorLevel === 'ORANGE') {
      tutorLevelIcon = TutorLevelOne
      tutorLevelTextColor = 'text-[#ff4300]'
      tutorLevelBg = '#fbdb89'
   } else if (tutorLevel === 'PURPLE') {
      tutorLevelIcon = TutorLevelTwo
      tutorLevelTextColor = 'text-[#472d70]'
      tutorLevelBg = '#7152eb'
   } else if (tutorLevel === 'BROWN') {
      tutorLevelIcon = TutorLevelThree
      tutorLevelTextColor = 'text-[#ffffff]'
      tutorLevelBg = '#dc8553'

   } else if (tutorLevel === 'BLACK') {
      tutorLevelIcon = TutorLevelFour
      tutorLevelTextColor = 'text-[#ffffff]'
      tutorLevelBg = '#2d2c2c'
   }

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

   return (
      <>
         <div className='lg:ml-pageLeft bg-lightWhite min-h-screen pb-120 pt-10'>
            <div className='lg:px-5 lg:pt-0 lg:pr-0 relative'>
               <div className={styles.backBtn} >
                  <BackBtn to={-1} />
               </div>
               <div className='relative pt-10'>
                  {/* <img src={TutorImg} style={{ transform: 'matrix(-1, 0, 0, 1, 0, 0)' }} />
                   */}
                  <div className='flex justify-center items-center'>
                     <ProfilePhoto src={user.photo ? user.photo : '/images/default.jpeg'}
                        handleChange={handleProfilePhotoChange} editable={editable} />
                  </div>
                  <div className={styles.imgContent} >
                     {/* <p className='text-[#4F33BD] font-bold text-[50px]'>
                     Kalpana srivastava
                  </p> */}
                     <EditableText text={`${user.firstName} ${user.lastName}`}
                        editable={editable}
                        onClick={() => setToEdit({ ...toEdit, fullName: { ...toEdit.fullName, active: true } })}
                        className='text-[#4F33BD] justify-center font-bold text-[50px] capitalize'
                        imgClass='ml-auto' />

                     <EditableText text={`${tagLine ? tagLine : 'Your tag line'}`}
                        editable={editable}
                        onClick={() => setToEdit({ ...toEdit, tagLine: { ...toEdit.tagLine, active: true } })}
                        className='text-black justify-center font-normal'
                        imgClass='ml-auto' />
                  </div>
               </div>

               <div className='lg:grid mt-12 px-2 grid-cols-12 grid-ros-6 lg:mt-[60px] gap-5 lg:pl-3'>

                  <div className='col-span-3 mt-53 lg:mt-0 flex flex-col'>
                     {
                        !isOwn &&
                        <div className={` mb-5 px-4 py-4 lg:bg-textGray-30 rounded-2xl`}
                           style={{ backgroundColor: tutorLevelBg }}
                        >
                           <EditableText text={`${user.firstName} ${user.lastName}`}
                              editable={editable}
                              onClick={() => setToEdit({ ...toEdit, tutorLevel: { ...toEdit.tutorLevel, active: true } })}
                              className={` justify-center font-bold text-lg capitalize `}
                              textClassName={`flex-1 ${tutorLevelTextColor}`}
                              imgClass='ml-auto' />
                           <div className='flex mt-4 mb-6 justify-center'>
                              <img src={tutorLevelIcon} />
                           </div>
                        </div>

                     }
                     <ProfileCard className='flex-1'
                        hideShadow={true}
                        body={
                           <>
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, serviceSpecializations: { ...toEdit.serviceSpecializations, active: true } })}
                                 text='Service Specializations'
                                 className='text-lg mb-2' textClassName="flex-1 text-center text-[21px]" />

                              <div className='flex flex-col row-span-2 overflow-x-auto scrollbar-content max-h-[500px] scrollbar-vertical'>
                                 {settings && settings.serviceSpecialisation.length > 0 && userDetail.serviceSpecializations && userDetail.serviceSpecializations.map((id, idx) => {
                                    return (
                                       <div key={idx} className='flex flex-col items-center mb-10'>
                                          <div className='flex h-90 w-90 rounded-full  items-center justify-center mb-3' >
                                             <img className='max-w-[90px] max-h-[90px]' src={settings.serviceSpecialisation.find(item => item._id === id).image}
                                             />
                                          </div>
                                          <p className='opacity-70 font-semibold text-lg'>
                                             {settings.serviceSpecialisation.find(item => item._id === id).text}
                                          </p>
                                       </div>
                                    )
                                 })}
                              </div>
                           </>
                        } />
                  </div>

                  <div className='col-span-6 row-span-10 flex flex-col'>
                     <ProfileCard hideShadow
                        titleClassName='text-left'
                        className='mt-53 lg:mt-0 flex-1'
                        title={
                           <EditableText text=''
                              editable={editable}
                              onClick={() => setToEdit({ ...toEdit, about: { ...toEdit.about, active: true } })}
                              className='text-primary text-lg capitalize'
                              textClassName='flex-1'
                              imgClass='ml-auto' />
                        }
                        body={
                           <>
                              <p className='mt-[90px]'>
                                 {about ? about : 'Your bio'}
                              </p>
                              <div>
                                 <img src={TutorSmallImg} className={styles.profileIcon} />
                              </div>
                           </>
                        } />

                     <ProfileCard className='lg:mt-4' hideShadow
                        title={
                           <EditableText text='Contact'
                              editable={editable}
                              onClick={() => setToEdit({ ...toEdit, tutorContact: { ...toEdit.tutorContact, active: true } })}
                              textClassName='flex-1 text-center'
                              className='text-primary text-lg capitalize  '
                              imgClass='ml-auto' />
                        }
                        body={
                           <div className='flex justify-center mt-5 lg:mt-3'>
                              <div className='flex flex-col items-center mr-8'>
                                 <img src={LinkedIn} />
                                 <p className='mt-1 font-medium opacity-60 text-xs'>
                                    {userDetail.linkedIn ? userDetail.linkedIn : 'Your linkedIn'}
                                 </p>
                              </div>
                              <div className='flex flex-col items-center mr-8'>
                                 <img src={MailIcon} />
                                 <p className='mt-1 font-medium opacity-60 text-xs'>
                                    {user.email ? user.email : ''}
                                 </p>
                              </div>
                              <div className='flex flex-col items-center'>
                                 <img src={WhatsappIcon} />
                                 <p className='mt-1 font-medium.4 opacity-60 text-xs'>
                                    {user.phone ? user.phone : ''}
                                 </p>
                              </div>
                           </div>
                        } />
                  </div>

                  <div className='mt-53 pb-0 col-span-3 lg:mt-0 flex flex-col'>
                     {
                        !isOwn &&
                        <ProfileCard hideShadow
                           className='col-span-3 mb-5 mt-6 lg:mt-0 flex items-center'
                           body={
                              <div className='overflow-x-auto flex-1 scrollbar-content'>
                                 <div className='mb-2'>
                                    <EditableText text='Education'
                                       editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, education: { ...toEdit.education, active: true } })}
                                       className='text-primary text-lg capitalize'
                                       textClassName='flex-1'
                                       imgClass='ml-auto' />
                                    <div className='flex mt-2 justify-center items-center bg-[#F6D0A3] w-[90px] h-[90px] mx-auto rounded-full'>
                                       <img src={EducationIcon} alt='education' />
                                    </div>
                                    <p className='mt-5 text-center font-medium text-sm'>
                                       {education ? education : 'Your Education'}
                                    </p>
                                 </div>

                              </div>
                           }
                        />
                     }
                     <ProfileCard className='flex-1' hideShadow
                        body={
                           <>
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, interest: { ...toEdit.interest, active: true } })}
                                 text='Interest'
                                 className='text-lg mb-2' textClassName="flex-1 text-center text-[21px]" />
                              <div className='flex flex-col overflow-x-auto scrollbar-content max-h-[500px] scrollbar-vertical'>
                                 {settings && settings.interest.length > 0 && userDetail.interest && userDetail.interest.map((id, idx) => {
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
                  </div>

                  {persona === 'admin' &&

                     <>
                        <ProfileCard hideShadow
                           className='col-span-3 mt-6 lg:mt-0'
                           body={
                              <div className='overflow-x-auto scrollbar-content'>
                                 <div className='mb-6'>
                                    <EditableText text='Test Prep Rate'
                                       editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, rates: { ...toEdit.rates, active: true } })}
                                       className='text-primary justify-between text-lg capitalize'
                                       imgClass='ml-auto' />
                                    <p className='mt-1.5  font-medium text-sm whitespace-nowrap'>
                                       {testPrepRate ? `$${testPrepRate}` : '-'}
                                    </p>
                                 </div>
                                 <div className='mb-6'>
                                    <EditableText text='Subject Tutoring Rate'
                                       editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, rates: { ...toEdit.rates, active: true } })}
                                       className='text-primary justify-between text-lg capitalize'
                                       imgClass='ml-auto' />
                                    <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                       {subjectTutoringRate ? `$${subjectTutoringRate}` : '-'}
                                    </p>
                                 </div>
                                 <div>
                                    <EditableText text='Other Rate'
                                       editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, rates: { ...toEdit.rates, active: true } })}
                                       className='text-primary justify-between text-lg capitalize'
                                       imgClass='ml-auto' />
                                    <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                       {otherRate ? `$${otherRate}` : '-'}
                                    </p>
                                 </div>
                              </div>
                           }
                        />
                        <ProfileCard hideShadow
                           className='col-span-3 mt-6 lg:mt-0 flex items-center'
                           body={
                              <div className='overflow-x-auto scrollbar-content'>
                                 <div className='mb-6'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, tutorAddress: { ...toEdit.tutorAddress, active: true } })}
                                       text='Address'
                                       className='text-xl justify-between'
                                    />
                                    <p className='mt-5  font-medium text-sm'>
                                       {address ? address : '-'}
                                    </p>
                                 </div>

                              </div>
                           }
                        />
                        <ProfileCard hideShadow
                           className='col-span-3 mt-6 lg:mt-0'

                           body={
                              <div className='overflow-x-auto scrollbar-content'>
                                 <div className='mb-6'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, paymentInfo: { ...toEdit.paymentInfo, active: true } })}
                                       text='Payment Info'
                                       className='text-xl justify-between'
                                    />
                                    <div className='mt-5  font-medium text-sm ma-w-[100px]'>
                                       <p className='flex items-center mb-3.5'>
                                          <span>
                                             Bank Name
                                          </span>
                                          <span className='inline-block pl-2'>
                                             {paymentInfo === undefined ? ' -' : paymentInfo.bankName ? paymentInfo.bankName : '-'}
                                          </span>
                                       </p>
                                       <p className='flex items-center mb-3.5'>
                                          <span>
                                             Acc No.
                                          </span>
                                          <span className='inline-block pl-2'>
                                             {paymentInfo === undefined ? ' -' : paymentInfo.AccNo ? paymentInfo.AccNo : '-'}
                                          </span>
                                       </p>
                                       <p className='flex items-center mb-3.5'>
                                          <span>
                                             IFCS Code
                                          </span>
                                          <span className='inline-block pl-2'>
                                             {paymentInfo === undefined ? ' -' : paymentInfo.ifcsCode ? paymentInfo.ifcsCode : '-'}
                                          </span>
                                       </p>
                                    </div>
                                 </div>

                              </div>
                           }
                        />
                        <ProfileCard hideShadow
                           className='col-span-3 mt-6 lg:mt-0'

                           body={
                              <div className='overflow-x-auto scrollbar-content'>
                                 <div className='mb-6'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, tutorRank: { ...toEdit.tutorRank, active: true } })}
                                       text='Tutor Rank'
                                       className='text-xl justify-between'
                                    />
                                    <p className='mt-1.5  font-medium text-sm whitespace-nowrap'>
                                       {tutorRank ? tutorRank : '-'}
                                    </p>
                                 </div>
                                 <div className='mb-6'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, income: { ...toEdit.income, active: true } })}
                                       text='Income'
                                       className='text-xl justify-between'
                                    />
                                    <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                       {income ? income : '-'}
                                    </p>
                                 </div>
                                 <div>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, paymentStatus: { ...toEdit.paymentStatus, active: true } })}
                                       text='Payment Status'
                                       className='text-xl justify-between'
                                    />
                                    <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                       {paymentStatus ? paymentStatus : '-'}
                                    </p>
                                 </div>
                              </div>
                           }
                        />
                        {
                           // persona === admin &&
                           <FeedbackTable feedbacks={feedbacks} />
                        }
                     </>}

               </div>

            </div>
         </div>
         <ParentEditables settings={settings} fetchDetails={fetchDetails}
            userId={isOwn ? id : params.id}
            toEdit={toEdit}
            setToEdit={setToEdit}
            persona={user.role} />
      </>
   )
}
