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

import EducationIcon from '../../../assets/profile/education.svg'

import InterestOneIcon from '../../../assets/images/int-1.svg'
import InterestTwoIcon from '../../../assets/images/int-2.svg'
import InterestThreeIcon from '../../../assets/images/int-3.svg'
import SubjectSlider from '../../../components/SubjectSlider/SubjectSlider'
import BackBtn from '../../../components/Buttons/Back'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLazyGetTutorDetailsQuery } from '../../../app/services/users'
import { useLazyGetSettingsQuery } from '../../../app/services/session'
import { useSelector } from 'react-redux'
import ParentEditables from '../../Frames/Editables/ParentEditables/ParentEditables'


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
      icon: TutorLevelOne
   },
   two: {
      bg: '#FBDB89',
      icon: TutorLevelOne
   },
   three: {
      bg: '#FBDB89',
      icon: TutorLevelOne
   },
   four: {
      bg: '#FBDB89',
      icon: TutorLevelOne
   },
   five: {
      bg: '#FBDB89',
      icon: TutorLevelOne
   },
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
      },
      about: {
         active: false,
         about: '',
      },
      tutorLevel: {
         active: false,
         tutorLevel: '',
      },
      education: {
         active: false,
         education: ''
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
      },
      pincode: {
         active: false,
         pincode: '',
      },
      paymentInfo: {
         active: false,
         bankName: '',
         AccNo: '',
         ifcsCode: ''
      },
      tutorRank: {
         active: false,
         tutorRank: '',
      },
      income: {
         active: false,
         income: '',
      },
      paymentStatus: {
         active: false,
         paymentStatus: '',
      },
      tutorContact: {
         active: false,
         email: '',
         phone: '',
         linkedIn: '',
      }
   })

   const handleClose = () => {
      setToEdit(prevToEdit => {
         let obj = {}
         Object.keys(prevToEdit).map(key => {
            obj[key] = { ...toEdit[key], active: false }
         })
         return obj
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
            const { firstName, lastName } = res.data.data.user
            setUser(res.data.data.user)

            const { phone, email } = res.data.data.user
            // const { service } = res.data.data.userdetails

            setToEdit(prevToEdit => {
               return {
                  ...prevToEdit,
                  fullName: {
                     ...prevToEdit.fullName,
                     firstName,
                     lastName,
                  },
                  timeZone: {
                     ...prevToEdit.timeZone,
                  },
                  tutorContact: {
                     ...prevToEdit.tutorContact,
                     email: email,
                     phone: phone === null ? '' : phone,
                     linkedIn: ''
                  },
                  notes: {
                     ...prevToEdit.notes,
                  },
               }
            })
            closeModal && handleClose()

            // setUserDetail(res.data.data.userdetails)
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
   // console.log(userDetail)

   if (Object.keys(user).length < 1) return
   // if (Object.keys(userDetail).length < 1) return


   return (
      <>
         <div className='lg:ml-pageLeft bg-lightWhite min-h-screen pb-120'>
            <div className='lg:px-5 lg:pt-0 lg:pr-0 relative'>
               <div className={styles.backBtn} >
                  <BackBtn to={-1} />
               </div>
               <div className='relative'>
                  <img src={TutorImg} style={{ transform: 'matrix(-1, 0, 0, 1, 0, 0)' }} />
                  <div className={styles.imgContent} >
                     {/* <p className='text-[#4F33BD] font-bold text-[50px]'>
                     Kalpana srivastava
                  </p> */}
                     <EditableText text={`${user.firstName} ${user.lastName}`}
                        editable={editable}
                        onClick={() => setToEdit({ ...toEdit, fullName: { ...toEdit.fullName, active: true } })}
                        className='text-[#4F33BD] justify-center font-bold text-[50px] capitalize'
                        imgClass='ml-auto' />

                     <EditableText text={`${'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}`}
                        editable={editable}
                        onClick={() => setToEdit({ ...toEdit, tagLine: { ...toEdit.tagLine, active: true } })}
                        className='text-black justify-center font-normal'
                        imgClass='ml-auto' />
                  </div>
               </div>

               <div className='lg:grid mt-12 px-2 grid-cols-12 grid-ros-6 lg:mt-[60px] gap-5 lg:pl-3'>

                  <div className='col-span-3 mt-53 lg:mt-0'>
                     {
                        !isOwn &&
                        <div className={` mb-5 px-4 py-4 lg:bg-textGray-30 rounded-2xl`}
                           style={{ backgroundColor: levels.one.bg }}
                        >
                           <EditableText text={`${user.firstName} ${user.lastName}`}
                              editable={editable}
                              onClick={() => setToEdit({ ...toEdit, tutorLevel: { ...toEdit.tutorLevel, active: true } })}
                              className='text-primaryOrangeDark justify-center font-bold text-lg capitalize'
                              textClassName='flex-1'
                              imgClass='ml-auto' />
                           <div className='flex mt-4 mb-6 justify-center'>
                              <img src={levels.one.icon} />
                           </div>
                        </div>

                     }
                     <ProfileCard className=''
                        hideShadow={true}
                        body={
                           <>
                              <p className='text-primary font-bold lg:text-21 text-center mb-10'>
                                 Service Specializations</p>
                              <div className='flex flex-col row-span-2 overflow-x-auto scrollbar-content'>
                                 {values.map(val => {
                                    return (
                                       <div className='flex flex-col items-center mb-10'>
                                          <div className='flex h-90 w-90 rounded-full  items-center justify-center mb-3' style={{ backgroundColor: val.bg }}>
                                             <img src={val.icon} />
                                          </div>
                                          <p className='opacity-70 font-semibold text-lg'> {val.text} </p>
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
                                 Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra
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
                                    linkedin.com/in/sha-shanks/
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

                  <div className='mt-53 pb-0 col-span-3 lg:mt-0'>
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
                                       Bachelores in Science (Physics)
                                    </p>
                                 </div>

                              </div>
                           }
                        />
                     }
                     <ProfileCard className='flex-1' hideShadow
                        body={
                           <>
                              <p className='text-primary font-bold lg:text-21 text-center mb-10'>Interest</p>
                              <div className='flex flex-col overflow-x-auto scrollbar-content'>
                                 {interests.map(val => {
                                    return (
                                       <div className='flex flex-col items-center mb-10 last:mb-9'>
                                          <div className='flex h-90 w-90 rounded-full  items-center justify-center mb-3' style={{ backgroundColor: val.bg }}>
                                             <img src={val.icon} />
                                          </div>
                                          <p className='opacity-70 font-semibold text-sm whitespace-nowrap'> {val.text} </p>
                                       </div>
                                    )
                                 })}
                              </div>
                           </>
                        } />
                  </div>

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
                                 Add tutor’s rate
                              </p>
                           </div>
                           <div className='mb-6'>
                              <EditableText text='Subject Tutoring Rate'
                                 editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, rates: { ...toEdit.rates, active: true } })}
                                 className='text-primary justify-between text-lg capitalize'
                                 imgClass='ml-auto' />
                              <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                 Add tutor’s rate
                              </p>
                           </div>
                           <div>
                              <EditableText text='Other Rate'
                                 editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, rates: { ...toEdit.rates, active: true } })}
                                 className='text-primary justify-between text-lg capitalize'
                                 imgClass='ml-auto' />
                              <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                 Add tutor’s level
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
                                 1315 N State St, Ukiah, California, USA
                                 Postal Code- 95482
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
                              <p className='mt-1.5  font-medium text-sm max-w-[100px]'>
                                 Bank Name
                                 Acc No.
                                 IFCS Code
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
                                 onClick={() => setToEdit({ ...toEdit, tutorRank: { ...toEdit.tutorRank, active: true } })}
                                 text='Tutor Rank'
                                 className='text-xl justify-between'
                              />
                              <p className='mt-1.5  font-medium text-sm whitespace-nowrap'>
                                 #23
                              </p>
                           </div>
                           <div className='mb-6'>
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, income: { ...toEdit.income, active: true } })}
                                 text='Income'
                                 className='text-xl justify-between'
                              />
                              <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                 Open
                              </p>
                           </div>
                           <div>
                              <EditableText editable={editable}
                                 onClick={() => setToEdit({ ...toEdit, paymentStatus: { ...toEdit.paymentStatus, active: true } })}
                                 text='Payment Status'
                                 className='text-xl justify-between'
                              />
                              <p className='mt-1.5 font-medium text-sm whitespace-nowrap'>
                                 Unpaid
                              </p>
                           </div>
                        </div>
                     }
                  />

               </div>

            </div>
         </div>
         <ParentEditables settings={settings} fetchDetails={fetchDetails}
            userId={isOwn ? id : params.id} toEdit={toEdit} setToEdit={setToEdit} />
      </>
   )
}
