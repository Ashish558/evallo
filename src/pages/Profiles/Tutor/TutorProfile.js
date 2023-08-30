import React, { useState } from 'react'
import ProfileCard from '../../../components/ProfileCard/ProfileCard'
import styles from './style.module.css'
import EditableText from '../../../components/EditableText/EditableText'

import ProfileImg from '../../../assets/images/profile.png'
import TutorImg from '../../../assets/images/tutor.png'
import TutorSmallImg from '../../../assets/images/tutor-small.png'
import sat from '../../../assets/icons/sat.png'
import linkedin from '../../../assets/icons/linkedin.png'
import call from '../../../assets/icons/call.png'
import mail from '../../../assets/icons/mail.png'
import education from '../../../assets/icons/education.png'
import experience from '../../../assets/icons/experience.png'


import EditIcon from '../../../assets/icons/edit.svg'
import MailIcon from '../../../assets/icons/mail.svg'
import LinkedIn from '../../../assets/icons/linked-in.svg'
import WhatsappIcon from '../../../assets/icons/whatsapp.svg'
import RightIcon from '../../../assets/icons/chevron-right.svg'
import SecondaryButton from '../../../components/Buttons/SecondaryButton'
import ValueOneIcon from '../../../assets/images/val-1.svg'
import ValueTwoIcon from '../../../assets/images/val-2.svg'
import ValueThreeIcon from '../../../assets/images/val-3.svg'

import TutorLevelOne from '../../../assets/profile/tutor-level-1.svg'
import TutorLevelTwo from '../../../assets/profile/tutor-level-2.svg'
import TutorLevelThree from '../../../assets/profile/tutor-level-3.svg'
import TutorLevelFour from '../../../assets/profile/tutor-level-4.svg'
import Table from "../../../components/Table/Table"
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
import YoutubeEmbed from './YoutubeEmbed/YoutubeEmbed'
import CircleButton from '../../../components/CircleButton/CircleButton'


export default function TutorProfile({ isOwn }) {

   const navigate = useNavigate()
   const [editable, setEditable] = useState(false)
   const { role: persona } = useSelector(state => state.user)
   const [user, setUser] = useState({})
   const [userDetail, setUserDetail] = useState({})
   const [settings, setSettings] = useState({})

   const params = useParams()
   const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery()
   const [fetchSettings, settingsResp] = useLazyGetSettingsQuery()
   const [getFeedbacks, getFeedbacksResp] = useLazyGetFeedbacksQuery()
   const [getSession, getSessionResp] = useLazyGetSingleSessionQuery()
   const [feedbacks, setFeedbacks] = useState([])
   const [awsLink, setAwsLink] = useState('')
   const { organization } = useSelector((state) => state.organization);

   const { id } = useSelector(state => state.user)
   const tableHeaders1 = [
      {
         id: 1,
         text: 'Student Name'
      },
      {
         id: 2,
         text: 'Feedback'
      }, {
         id: 3,
         text: 'Comment'
      },
      {
         id: 4,
         text: 'Serivce'
      },
      {
         id: 5,
         text: 'Session Date'
      }
   ]
   const tableHeaders2 = [
      {
         id: 1,
         text: 'Service'
      }, {
         id: 2,
         text: 'Currency',
      }, {
         id: 3,
         text: 'Hourly Rate'
      }

   ]
   const data2 = [
      {
         id: 1,
         service: 'Test Prep',
         currency: 'USD',
         hourlyrate: '$130'
      }
   ]
   const data = [
      {
         id: 1,
         studentname: 'Lorem Ipsum',
         feedback: '5',
         comment: 'Loream',
         service: 'Loream',
         sessiondata: 'May 12,2002'
      },
      {
         id: 1,
         studentname: 'Lorem Ipsum',
         feedback: '5',
         comment: 'Loream',
         service: 'Loream',
         sessiondata: 'May 12,2002'
      }

   ]

   const [toEdit, setToEdit] = useState({
      profileData: {
         active: false,
         firstName: '',
         lastName: '',
         tagLine: ''
      },
      tutorAddress: {
         state: '',
         country: '',
         city: '',
         pincode: '',
         address: '',
      },
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
      pincode: {
         active: false,
         pincode: '',
         isPresent: false,
      },
      paymentInfo: {
         active: false,
         paymentInfo: ''
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
         phoneCode: '',
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
      tutorServices: {
         active: false,
         tutorServices: []
      },
      videoLink: {
         active: false,
         videoLink: ''
      },

   })

   useEffect(() => {
      let userId = ''
      if (isOwn) {
         userId = id
      } else {
         console.log("userid" + params.id)
         userId = params.id
      }
      getFeedbacks({ id: userId })
         .then(({ error, data }) => {
            if (error) {
               console.log('feedback error', error)
               return
            }
            console.log('feedback', data)
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
            console.log('response', res.data.data);
            setAwsLink(res.data.data.baseLink)
            const { firstName, lastName, phone, email, phoneCode } = res.data.data.user
            setUser(res.data.data.user)
            console.log(user.phone + "phone")
            let details = res.data.data.details
            console.log('details', details);
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
                     profileData: {
                        ...prevToEdit.profileData,
                        firstName,
                        lastName,
                        tagLine,
                        phone,
                        phoneCode,
                        linkedIn: !details ? '' : details?.linkedIn,
                        about: !details ? '' : details?.about,
                        education: !details ? '' : details?.education,
                        experience: !details ? '' : details?.experience,
                     },
                     tutorAddress: {
                        ...prevToEdit.addressData,
                        city: !details ? '' : details?.city,
                        country: !details ? '' : details?.country,
                        pincode: !details ? '' : details?.pincode,
                        state: !details ? '' : details?.state,
                        address: !details ? '' : details?.address,
                        isPresent: details === null ? false : true
                     },
                     tutorContact: {
                        ...prevToEdit.tutorContact,
                        email: email,
                        phone: phone === null ? '' : phone,
                        phoneCode: phoneCode === null ? '' : phoneCode,
                        linkedIn: details === null ? '' : details.linkedIn,
                        isPresent: details === null ? false : true
                     },
                     tagLine: {
                        ...prevToEdit.tagLine,
                        tagLine: details === null ? '' : details.tagLine,
                        isPresent: details === null ? false : true
                     },
                     tutorLevel: {
                        ...prevToEdit.tutorLevel,
                        tutorLevel: details === null ? '' : details.tutorLevel,
                        isPresent: details === null ? false : true
                     },
                     about: {
                        ...prevToEdit.about,
                        about: details === null ? '' : details.about,
                        isPresent: details === null ? false : true
                     },
                     education: {
                        ...prevToEdit.education,
                        education: details === null ? '' : details.education,
                        isPresent: details === null ? false : true
                     },
                     rates: {
                        ...prevToEdit.rates,
                        isPresent: details === null ? false : true
                     },
                     // tutorAddress: {
                     //    ...prevToEdit.tutorAddress,
                     //    address: details === null ? '' : details.address,
                     //    isPresent: details === null ? false : true
                     // },
                     pincode: {
                        ...prevToEdit.pincode,
                        pincode: details === null ? '' : details.pincode,
                        isPresent: details === null ? false : true
                     },
                     paymentInfo: {
                        ...prevToEdit.paymentInfo,
                        paymentInfo: details === null ? '' : details.paymentInfo,
                        isPresent: details === null ? false : true
                     },
                     tutorRank: {
                        ...prevToEdit.tutorRank,
                        tutorRank: details === null ? '' : details.tutorRank,
                        isPresent: details === null ? false : true
                     },
                     income: {
                        ...prevToEdit.income,
                        income: details === null ? '' : details.income,
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
                     tutorServices: {
                        ...prevToEdit.tutorServices,
                        tutorServices: details !== null ? details.tutorServices : [],
                        isPresent: details === null ? false : true
                     },
                     serviceSpecializations: {
                        ...prevToEdit.serviceSpecializations,
                        serviceSpecializations: details !== null ? details.serviceSpecializations : [],
                        isPresent: details === null ? false : true
                     },
                     videoLink: {
                        ...prevToEdit.videoLink,
                        videoLink: details !== null ? details.videoLink : [],
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
      // fetchSettings()
      //    .then(res => {

      //    })
      console.log("UserDetails", userDetail)
      console.log("organizations" + organization.settings)
      setSettings(organization.settings)
   }, [])

   // console.log('user', user)
   // console.log('To-edit', toEdit)
   // console.log('userdetail', userDetail.serviceSpecializations)
   // console.log('settings', settings.Expertise)
   const { about, education, tagLine, tutorLevel, testPrepRate, otherRate, subjectTutoringRate, address, pincode, paymentInfo, tutorRank, income, paymentStatus, linkedIn, videoLink,city,state,country } = userDetail
   // console.log('userdetail', tutorLevel)

   // console.log(user);
   // console.log('settings', settings.servicesAndSpecialization);
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
   // console.log(isOwn);
   // console.log(tutorRank);
   return (
      <>

         <div className='lg:ml-pageLeft min-h-screen pb-120 pt-0 mr-pageRight'>

            <div className='grid grid-cols-12'>
            <ProfileCard hideShadow
                        titleClassName='text-left'
                        bgClassName='bg-profilecard'
                        className='mt-53 lg:mt-0 flex-1 h-inherit col-span-10 '
                        // title={
                        //    <EditableText text=''
                        //       editable={editable}
                        //       onClick={() => setToEdit({ ...toEdit, about: { ...toEdit.about, active: true } })}
                        //       className='text-primary text-lg capitalize '
                        //       textClassName='flex-1'
                        //       imgClass='ml-auto' />
                        // }
                        
                        body={
                           <>
                           <div className='bg-white border border-[#00000010]'>
                              <div className=' flex relative ' style={{background:'#26435F'}}>
                                 <div className='ml-40 mt-auto pt-10'>
                                    <div className='flex items-center'>
                                    <p className='text-white ' style={{fontWeight:'600',fontSize:'32px'}}>{user.firstName+" "}{user.lastName}</p>
                                    {(isOwn===true || persona==='admin') && <p className='text-white ml-5 underline cursor-pointer' onClick={()=>setToEdit({ ...toEdit, profileData: { ...toEdit.profileData, active: true } })}>edit</p>}                       {/* <EditableText text='edit'
                                    editable={editable}
                              onClick={() => setToEdit({ ...toEdit, about: { ...toEdit.about, active: true } })}
                              className='text-green'
                                /> */}
                                 </div>
                                 <p className='text-white' style={{ fontWeight: '400', fontSize: '18.67px' }}>{userDetail.tagLine}</p>
                              </div>
                              <div className='ml-auto mt-auto pt-10 mr-10'>
                                 <div className='flex gap-4 items-center '>
                                    <img src={mail}></img>
                                    <p className='text-white' style={{ fontWeight: '400', fontSize: '18.67px' }}>{user.email}</p>
                                 </div>
                                 <div className='flex gap-4 items-center '>
                                    <img src={call}></img>
                                    <p className='text-white' style={{ fontWeight: '400', fontSize: '18.67px' }}>{user.phoneCode}{user.phone}</p>
                                 </div>
                                 <div className='flex gap-4 items-center '>
                                    <img src={linkedin}></img>
                                    <p className='text-white' style={{ fontWeight: '400', fontSize: '18.67px' }}>{userDetail.linkedIn}</p>
                                 </div>
                              </div>
                              <div className={`absolute ml-5 mt-12`}  >
                                 <ProfilePhoto isTutor={true}
                                    src={user.photo ? `${awsLink}${user.photo}` : '/images/default.jpeg'}
                                    handleChange={handleProfilePhotoChange}  />
                                 </div>
                              </div>
                                 <div className='ml-40 mt-6 '>
                                    <span style={{fontSize:'18.67px',color:'#517CA8',fontWeight:'400'}}>
                                       {userDetail.about}
                                 </span>
                                 </div>  
                              </div>

                        {/* <div>
                                 <img src={user.photo ? user.photo : '/images/default.jpeg'} className={} />
                              </div> */}
                           </>
                        } />
                        <div className='col-span-2 mt-53 '>
                        <div className='flex items-start gap-4'>
                                 <img src={experience} ></img>
                                 <div>
                                 <div>
                                 <p className='' style={{color:'#24A3D9',fontWeight:'700',fontSize:'21.33px'}} >Education</p>
                                 </div>
                                 <div>
                                 <p style={{color:'#517CA8',fontWeight:'400',fontSize:'18.67px'}}>{userDetail.education}</p>
                                 </div>
                              </div>
                              </div>


                  <div className='flex items-start gap-4 items-start mt-5'>
                     <img src={experience}></img>
                     <div >
                        <div>
                           <p className='' style={{ color: '#24A3D9', fontWeight: '700', fontSize: '21.33px' }}>Experience</p>
                        </div>
                        <div>
                           <p style={{ color: '#517CA8', fontWeight: '400', fontSize: '18.67px' }}>Lorem ipsum dolor sit amet,cosect</p>
                        </div>
                     </div>
                  </div>



               </div>
            </div>


            <div className='lg:px-5 lg:pt-0 lg:pr-0 relative mt-20'>

               <div className='grid grid-cols-12 gap-4'>

                  <div className='col-span-3 mt-53 lg:mt-0 flex flex-col '>
                     {/* {
                        !isOwn &&
                        <div className={` mb-5 px-4 py-4 lg:bg-textGray-30 rounded-2xl`}
                           style={{ backgroundColor: tutorLevelBg }}
                        >
                           <EditableText text={tutorLevel === undefined ? '' : `${tutorLevel} belt`}
                              editable={editable}
                              onClick={() => setToEdit({ ...toEdit, tutorLevel: { ...toEdit.tutorLevel, active: true } })}
                              className={` justify-center font-bold text-lg capitalize `}
                              textClassName={`flex-1 capitalize ${tutorLevelTextColor}`}
                              imgClass='ml-auto' />
                           <div className='flex mt-4 mb-6 justify-center'>
                              <img src={tutorLevelIcon} />
                           </div>
                        </div>

                     }  */}
                    <div>
                     <div className='flex'>
                    <div className='ml-3' style={{color:'#26435F', fontSize:'21.33px' ,fontWeight:'600'}}>Expertise</div>
                    {(isOwn==true || persona==='admin') && <p className='text-[#667085] ml-auto underline cursor-pointer' onClick={()=>setToEdit({ ...toEdit, serviceSpecializations: { ...toEdit.serviceSpecializations, active: true } })}>edit</p>}
                    </div>
                     <ProfileCard className='flex-1 '
                        hideShadow={true}
                        bgClassName="bg-profilecard"
                        body={
                           <>
                                 {settings && settings.Expertise?.length > 0 && userDetail.serviceSpecializations && userDetail.serviceSpecializations.map((id, idx) => {
                                    return (
                                       settings?.Expertise?.find(item => item._id === id) ?
                                       <div className=' mt-3 overflow-x-auto scrollbar-content max-h-[500px] scrollbar-vertical '>
                                       <div className=' bg-white rounded min-h-[60px] flex items-center '>
                                                <div className='ml-3'>
                                                   <img className='max-w-[40px] max-h-[40px]' src={`${awsLink}${settings?.Expertise?.find(item=>item._id===id).image}`}></img>
                                                </div>
                                                <div className=' ml-10'>
                                                   <p className='text-[#517CA8] ' style={{fontWeight:'400'}}>{settings?.Expertise?.find(item=>item._id===id).text}</p>
                                                </div>
                                             </div>
                                             </div>
                                                
                                          :
                                          <></>
                                    )
                                 })}
                             {/* <div className='overflow-x-auto scrollbar-content max-h-[500px] scrollbar-vertical '>
                                                         <div className=' bg-white rounded min-h-[60px] flex items-center '>
                                 <div className='ml-3'>
                                    <img src={sat}></img>
                                 </div>
                                 <div className=' ml-10'>
                                    <p className='text-[#517CA8] ' style={{fontWeight:'400'}}></p>
                                 </div>
                              </div>
                              </div> */}

                                 

                                 {/* <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, serviceSpecializations: { ...toEdit.serviceSpecializations, active: true } })}
                                 text='Expertise'
                                 className='text-lg mb-2' textClassName="flex-1 text-center text-[21px]" /> */}
                                 {/* May Be Useful */}
                                 {/* <div className='flex flex-col row-span-2 overflow-x-auto scrollbar-content max-h-[500px] scrollbar-vertical'>
                                 {settings && settings.Expertise?.length > 0 && userDetail.serviceSpecializations && userDetail.serviceSpecializations.map((id, idx) => {
                                    return (
                                       settings.Expertise?.find(item => item._id === id) ?
                                          <div key={idx} className='flex flex-col items-center mb-10'>
                                             <div className='flex h-90 w-90 rounded-full  items-center justify-center mb-3' >
                                                <img className='max-w-[90px] max-h-[90px]' src={settings.Expertise.find(item => item._id === id).image}
                                                />
                                             </div>
                                             <p className='opacity-70 font-semibold text-lg'>
                                                {settings.Expertise.find(item => item._id === id).text}
                                             </p>
                                          </div>
                                          :
                                          <></>
                                    )
                                 })}
                              </div> */}
                              </>
                           } />
                     </div>
                  </div>
               <div className='col-span-6'>
                  <div className='flex'>
                  {(isOwn==true && persona==='admin') && <p className='text-[#667085] ml-auto underline cursor-pointer' onClick={()=>setToEdit({ ...toEdit, videoLink: { ...toEdit.videoLink, active: true } })}>edit</p>}
                  </div>
                  <div className='  pt-10 min-h-[680px]  relative z-10 flex items-end ' >
             
                     <YoutubeEmbed embedId={videoLink} />
                     {/* <div className={`${styles.backBtn} mt-10`} >
                     </div> */}
                        {
                           (isOwn === true) || (persona === 'admin') ?
                              <div className={`${styles.editButton} mt-10`} >
                                 {/* <BackBtn to={-1} /> */}
                                 {/* <CircleButton
                                 className='flex items-center rounded-full'
                                 children={
                                    <EditableText editable={persona === "tutor" || persona === "admin"} />
                                 }
                                 onClick={() => setToEdit({ ...toEdit, videoLink: { ...toEdit.videoLink, active: true } })}
                              /> */}
                                 {/* <EditableText editable={true} className="right-0" /> */}
                              </div> : <></>
                        }

                     </div>
                     <div className='ml-3' style={{ color: '#26435F', fontSize: '21.33px', fontWeight: '600' }}>Reviews</div>
                     <ProfileCard className='border border-[#00000010]' hideShadow
                        bgClassName="bg-white"
                        body={
                           <div>
                              <p style={{ color: '#24A3D9', fontWeight: '400' }}>May 05,2022</p>
                              <div>
                                 <p style={{ color: '#24A3D9', fontWeight: '300', fontSize: '18.67px' }}> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu. </p>
                              </div>
                              <div className='flex mt-5'>
                                 <div>
                                    <button className=' h-[33px] rounded-full w-[160px] mr-5' style={{ background: '#26435F33', color: '#26435F' }}>Parent / Student</button>
                                 </div>
                                 <div>
                                    <button className='rounded-full h-[33px] w-[133px]' style={{ background: '#26435F33', color: '#26435F' }}>"Service"</button>
                                 </div>
                              </div>
                           </div>
                        } />

                  </div>





                  <div className='col-span-3'>
                  <div className='flex'>
                    <div className='ml-3' style={{color:'#26435F', fontSize:'21.33px' ,fontWeight:'600'}}>Interest</div>
                    {(isOwn === true || persona==='admin') && <p className='text-[#667085] ml-auto underline cursor-pointer' onClick={()=>setToEdit({ ...toEdit, interest: { ...toEdit.interest, active: true } })}>edit</p>}
                    </div>
                   
               <ProfileCard className='flex-1 ' hideShadow
                        bgClassName="bg-profilecard"
                        body={
                           <> {settings && settings.interest.length > 0 && userDetail.interest && userDetail.interest.map((id, idx) => {
                              return (
                                 settings?.interest?.find(item => item._id === id) ?
                                 <div className='mt-3 overflow-x-auto scrollbar-content max-h-[500px] scrollbar-vertical'>
                                 <div className=' bg-white rounded min-h-[60px]  flex items-center'>
                           <div className='ml-3'>
                              <img className='max-w-[40px] max-h-[40px]' src={`${awsLink}${settings?.interest?.find(item=> item._id===id).image}`}></img>
                           </div>
                           <div className=' ml-10'>
                              <p className='text-[#517CA8] ' style={{fontWeight:'400'}}>{settings?.interest?.find(item=> item._id===id).text}</p>
                           </div>
                        </div>
                        </div>
                                    :
                                    <></>
                              )
                           })}

                              {/* <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, interest: { ...toEdit.interest, active: true } })}
                                 text='Interests'
                                 className='text-lg mb-2 ' textClassName="flex-1 text-center text-[21px]" /> */}
                              {/* <div className='flex flex-col overflow-x-auto scrollbar-content max-h-[500px] scrollbar-vertical'>
                                 {settings && settings.interest.length > 0 && userDetail.interest && userDetail.interest.map((id, idx) => {
                                    return (
                                       settings?.interest?.find(item => item._id === id) ?
                                          <div key={idx} className='flex flex-col items-center mb-10'>
                                             <div className='flex h-90 w-90 rounded-full  items-center justify-center mb-3' >
                                                <img className='max-w-[90px] max-h-[90px]' src={settings?.interest?.find(item => item._id === id).image}
                                                />
                                             </div>
                                             <p className='opacity-70 font-semibold text-lg'>
                                                {settings?.interest?.find(item => item._id === id).text}
                                             </p>
                                          </div>
                                          :
                                          <></>
                                    )
                                 })}
                              </div> */}


                                    
                           </>

                        } />
                  </div>
               </div>
               <div class="mt-20 border-4 ml-20 mr-20 border-t border-[#CBD6E2]-300 justify-center border-dotted"></div>
               {/* address row */}
               <div className='grid grid-cols-12 mt-20 gap-4'>
                  <div className='col-span-7'>
                  <div className='flex'>
                    <div className='ml-3' style={{color:'#26435F', fontSize:'21.33px' ,fontWeight:'600'}}>Address</div>
                    {(isOwn==true || persona==='admin')&& <p className='text-[#667085] ml-auto underline cursor-pointer' onClick={()=>setToEdit({ ...toEdit, tutorAddress: { ...toEdit.tutorAddress, active: true } })}>edit</p>}
                    </div>
                     <div>
                        {
                           (isOwn === true) || (persona === 'admin') ?
                              <ProfileCard
                                 bgClassName="bg-white" hideShadow
                                 className='col-span-3  lg:mt-0 flex items-center border border-[#00000010]'
                                 body={
                                    <div className='grid grid-cols-12'>
                                       <div className='col-span-4'>
                                          <div style={{ color: '#24A3D9', fontWeight: '600' }}>
                                             street Adress
                                          </div>
                                          <div style={{ fontWeight: '400', color: "#517CA8" }}>
                                            {userDetail.address}
                                          </div>
                                       </div>

                                       <div className='col-span-2'>
                                          <div style={{ color: '#24A3D9', fontWeight: '600' }}>
                                             city
                                          </div>
                                          <div style={{ fontWeight: '400', color: "#517CA8" }}>{userDetail.city}
                                          </div>
                                       </div>

                                       <div className='col-span-3'>
                                          <div style={{ color: '#24A3D9', fontWeight: '600' }}>         state
                                          </div>
                                          <div style={{ fontWeight: '400', color: "#517CA8" }}>{userDetail.state}
                                          </div>
                                       </div>

                                       <div className='col-span-2'>
                                          <div style={{ color: '#24A3D9', fontWeight: '600' }}>
                                             country
                                          </div>
                                          <div style={{ fontWeight: '400', color: "#517CA8" }}>{userDetail.country}
                                          </div>
                                       </div>

                                       <div className='col-span-1'>
                                          <div style={{ color: '#24A3D9', fontWeight: '600' }}>
                                             zip
                                          </div>
                                          <div style={{ fontWeight: '400', color: "#517CA8" }}>{userDetail.pincode}
                                          </div>
                                       </div>
                                    </div>
                                 }
                              /> : <></>

                        }
                     </div>
                  </div>

                  <div className='col-span-2'>
                  <div className='flex'>
                    <div className='ml-3' style={{color:'#26435F', fontSize:'21.33px' ,fontWeight:'600'}}>Tutor Income</div>
                    {(isOwn==true || persona==='admin')&& <p className='text-[#667085] ml-auto underline cursor-pointer' onClick={()=>setToEdit({ ...toEdit, income: { ...toEdit.income, active: true } })}>edit</p>}
                    </div>
                     <ProfileCard
                        bgClassName="bg-white"
                        hideShadow
                        className="flex items-center justify-center min-h-[96px] border border-[#00000010]"
                        body={
                           <>
                              <div>
                                 <div style={{ fontWeight: '400', color: "#517CA8", fontSize: '21.33px' }}>{"$" + userDetail.income}
                                 </div>
                              </div>
                           </>
                        }
                     />


                  </div>
                { (isOwn===true || persona==="admin")  ?( <div className='col-span-3'>
                  <div className='flex'>
                    <div className='ml-3' style={{color:'#26435F', fontSize:'21.33px' ,fontWeight:'600'}}>Payment Info</div>
                    {(isOwn==true || persona==='admin')&&<p className='text-[#667085] ml-auto underline cursor-pointer' onClick={()=>setToEdit({ ...toEdit, paymentInfo: { ...toEdit.paymentInfo, active: true } })}>edit</p>}
                    </div>
                  <ProfileCard
                  bgClassName="bg-white "
                     hideShadow
                     className="flex items-center justify-center min-h-[96px] border border-[#00000010]"
                     body={
                        <>
                        <div>
                        {/* <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, paymentInfo: { ...toEdit.paymentInfo, active: true } })}
                                     
                                    /> */}
                                 <div style={{ fontWeight: '400', color: "#517CA8", fontSize: '21.33px' }}>
                                    {userDetail.paymentInfo}
                                 </div>
                              </div>
                           </>
                        }
                     />
                  </div>) : (<></>)}
               </div>


               <div className='grid grid-cols-12 gap-8 mt-20'>
                  <div className='col-span-7'>
                     <div className='ml-3 ' style={{ color: '#26435F', fontSize: '21.33px', fontWeight: '600' }}>Recent Feedback History</div>
                     <div className='flex'>
                        <Table
                           tableHeaders={tableHeaders1}
                           // onClick={{ handleDelete, handleNavigate }}
                           dataFor='tutorFeedback'
                           data={feedbacks}
                           // excludes={['assiginedTutor', 'student_id', 'parentFirstName', 'parentLast']}
                           // tableHeaders={tableHeaders}
                           headerObject={true}
                           maxPageSize={9}

                        // loading={tableLoading}

                        />
                        <div className=" ml-10 w-px h-[490px] bg-[#CBD6E2] "></div>
                     </div>

                  </div>

                     <div className='col-span-5'>     <div className='flex'>
                    <div className='ml-3' style={{color:'#26435F', fontSize:'21.33px' ,fontWeight:'600'}}>Tutor Status</div>
                    {(isOwn === true || persona==='admin') && <p className='text-[#667085] ml-auto underline cursor-pointer' onClick={()=>setToEdit({ ...toEdit, paymentInfo: { ...toEdit.paymentInfo, active: true } })}>edit</p>}
                   </div>
                     <ProfileCard
                        hideShadow
                        className="border border-[#00000010]"
                        bgClassName="bg-white"
                        body={
                           <>
                              <div style={{ fontWeight: '400', color: "#517CA8", fontSize: '21.33px' }}>
                                 {userDetail.tutorLevel}
                              </div>

                           </>
                        }
                     />

                     <div className='mt-3'>
                     <div className='ml-3 mt-3' style={{color:'#26435F', fontSize:'21.33px' ,fontWeight:'600'}}>Service Rates</div>
                     <Table
                     tableHeaders={tableHeaders2}
                     dataFor="serviceRates"
                     data={userDetail.tutorServices}
                     maxPageSize={7}
                     headerObject={true}>

                        </Table>
                     </div>
                  </div>
               </div>

               {/* <div className='lg:grid mt-12 px-2 grid-cols-12 grid-ros-6 lg:mt-[60px] gap-5 lg:pl-3'>


                  <div className='col-span-6 row-span-10 flex flex-col'> */}


               {/* <ProfileCard className='lg:mt-4' hideShadow
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
                                 <p className='mt-1 font-medium opacity-60 text-xs cursor-pointer'
                                    onClick={() => window.open(userDetail.linkedIn)} >
                                    {userDetail.linkedIn ? userDetail.linkedIn : 'Your linkedIn'}
                                 </p>
                              </div>
                              <div className='flex flex-col items-center mr-8'>
                                 <img src={MailIcon} />
                                 <p className='mt-1 font-medium opacity-60 text-xs cursor-pointer'
                                    onClick={() => window.open(`mailto:${user.email}`)} >
                                    {user.email ? user.email : ''}
                                 </p>
                              </div>
                              <div className='flex flex-col items-center'>
                                 <img src={WhatsappIcon} />
                                 <p className='mt-1 font-medium.4 opacity-60 text-xs cursor-pointer'
                                    onClick={() => window.open(`https://wa.me/${user.phone}`)}>
                                    {user.phone ?
                                       <>
                                          {`${user.phoneCode ? user.phoneCode : ''} ${user.phone}`}
                                       </>
                                       : ''}
                                 </p>
                              </div>
                           </div>
                        } /> */}
            </div>

            {/* <div className='mt-53 pb-0 col-span-3 lg:mt-0 flex flex-col'>
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
                     
                  </div> */}


            {/* //for address */}

            {/* {
                     (isOwn === true) || (persona === 'admin') ?
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
                        /> : <></>
                  } */}


            {/* {
                     (isOwn === true) || (persona === 'admin') ?
                        <ProfileCard hideShadow
                           className='col-span-6 mt-6 lg:mt-0'
                           body={
                              <div className='overflow-x-auto scrollbar-content'>
                                 <div className='mb-6'>
                                    <EditableText editable={editable}
                                       onClick={() => setToEdit({ ...toEdit, paymentInfo: { ...toEdit.paymentInfo, active: true } })}
                                       text='Payment Info'
                                       className='text-xl justify-between'
                                    />
                                    <div className='mt-5  font-medium text-sm ma-w-[100px]'>
                                       <span className='inline-block pl-2'>
                                          {paymentInfo === undefined ? ' -' : paymentInfo ? paymentInfo : '-'}
                                       </span>
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
                        /> : <></>
                  } */}

            {/* {
                     (isOwn === true) || (persona === 'admin') ?
                        <ProfileCard hideShadow
                           className='col-span-3 mt-6 lg:mt-0'
                           body={
                              <div className='overflow-x-auto scrollbar-content'>
                                 <div className='mb-6'>
                                    <EditableText editable={persona === 'admin' ? true : false}
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
                        /> : <></>
                  } */}

                  {/* rates */}
                  {
                     persona === 'admin' &&
                     <ProfileCard hideShadow
                        className='col-span-3 mt-6 lg:mt-0  max-h-[300px] overflow-y-auto scrollbar-content'
                        body={
                           <div className=''>
                              {
                                 organization.settings?.servicesAndSpecialization?.map((service, idx) => {
                                    let price = '-'
                                    let isPresent = false
                                    if (userDetail !== undefined || userDetail !== null) {
                                       let obj = userDetail?.tutorServices?.find(serv => serv.service === service.service)
                                       // console.log('obj', obj);
                                       if (obj !== undefined) {
                                          price = obj.price
                                          isPresent = true
                                       }
                                    }
                                    return (
                                       <div className='mb-6'>
                                          <EditableText
                                             // text='Test Prep Rate'
                                             text={service.service}
                                             editable={editable}
                                             onClick={() => setToEdit({
                                                ...toEdit,
                                                tutorServices: {
                                                   ...toEdit.tutorServices, active: true, selectedIdx: idx,
                                                   servicePresent: isPresent
                                                }
                                             })}
                                             className='text-primary justify-between text-lg capitalize'
                                             imgClass='ml-auto' />
                                          <p className='mt-1.5  font-medium text-sm whitespace-nowrap'>
                                             {price}
                                          </p>
                                       </div>
                                    )
                                 })
                              }
                               <div className='mb-6'>
                                 <EditableText
                                    // text='Test Prep Rate'
                                    text='Service 1'
                                    editable={editable}
                                    onClick={() => setToEdit({
                                       ...toEdit,
                                       tutorServices: { ...toEdit.tutorServices, active: true, selectedIdx: 0 }
                                    })}
                                    className='text-primary justify-between text-lg capitalize'
                                    imgClass='ml-auto' />
                                 <p className='mt-1.5  font-medium text-sm whitespace-nowrap'>
                                    {testPrepRate ? `$${testPrepRate}` : '-'}
                                 </p>
                              </div>
                              <div className='mb-6'>
                                 <EditableText
                                    //  text='Subject Tutoring Rate'
                                    text='Service 2'
                                    editable={editable}
                                    onClick={() => setToEdit({ ...toEdit, rates: { ...toEdit.rates, active: true } })}
                                    className='text-primary justify-between text-lg capitalize'
                                    imgClass='ml-auto' />
                                 <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                    {subjectTutoringRate ? `$${subjectTutoringRate}` : '-'}
                                 </p>
                              </div>
                              <div>
                                 <EditableText
                                    //  text='Other Rate'
                                    text='Service 3'
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

                  }
                  {
                     persona === 'admin' &&
                     <FeedbackTable feedbacks={feedbacks} />
                  }


            {/* </div>

            </div> */}
         </div>
         <ParentEditables settings={settings} fetchDetails={fetchDetails}
            userId={isOwn ? id : params.id}
            toEdit={toEdit}
            setToEdit={setToEdit}
            persona={user.role}
            awsLink={awsLink} />
      </>
   )
}
