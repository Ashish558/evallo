import React, { useState, useEffect } from "react";
import styles from "./ParentDashboardHeader.module.css";
import explore from "./../../assets/images/explore-bg.png";
import i from "./../../assets/icons/i.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import shivam from "./../../assets/images/tutors/shivam-shrivastab.png";
import { Link, useNavigate } from "react-router-dom";
import josephBrown from "../../assets/images/joseph-brown.png";
import rightArrow from "../../assets/icons/arrow-down.png";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import ImageSlideshow from "../ImageSlideshow/ImageSlideshow";
import { useLazyGetUserDetailQuery } from "../../app/services/users";
import { useSelector } from "react-redux";
import InputSelect from "../InputSelect/InputSelect";
import Ledger from "./../../pages/Ledger/Ledger"
import { useLazyPayBalanceQuery } from "../../app/services/dashboard";
import { useDisableBodyScroll } from "../../hooks/useDisableBodyScroll";

const ParentDashboardHeader = ({ selectedStudent, setSelectedStudent }) => {
   const [images, setImages] = useState([])
   const [user, setUser] = useState({})
   const [associatedStudents, setAssociatedStudents] = useState([]);

   const [ledgerVisible, setLedgerVisible] = useState(false)

   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()
   const [fetchSettings, fetchSettingsResp] = useLazyGetSettingsQuery()
   const [payBalance, payBalanceResp] = useLazyPayBalanceQuery()

   const [detailStudent, setDetailStudent] = useState(null)

   const navigate = useNavigate()
   //  sessionStorage
   const { id, amountToPay, credits } = useSelector(state => state.user)

   useDisableBodyScroll(ledgerVisible)
   useEffect(() => {
      fetchSettings()
         .then(res => {
            setImages(res.data.data.setting.offerImages)
            console.log(res.data.data.setting);
         })
      getUserDetail({ id })
         .then(res => {
            // console.log('response', res.data.data);
            setUser(res.data.data.user)
            setAssociatedStudents([])
            res.data.data.user.assiginedStudents.map((student, idx) => {
               getUserDetail({ id: student })
                  .then(res => {
                     // console.log('detail', res.data.data.userdetails.serviceSeeking);
                     setAssociatedStudents(prev => [...prev, {
                        _id: res.data.data.user._id,
                        name: `${res.data.data.user.firstName} ${res.data.data.user.lastName}`,
                        photo: res.data.data.user.photo ? res.data.data.user.photo : '/images/default.jpeg',
                        serviceSeeking: res.data.data.userdetails?.serviceSeeking
                     }])
                     idx === 0 && setSelectedStudent({
                        _id: res.data.data.user._id,
                        value: `${res.data.data.user.firstName} ${res.data.data.user.lastName}`,
                        photo: res.data.data.user.photo ? res.data.data.user.photo : '/images/default.jpeg',
                        serviceSeeking: res.data.data.userdetails?.serviceSeeking
                     })
                     idx === 0 && setDetailStudent(res.data.data.userdetails)
                  })
            })

         })
   }, [])

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
         // setAssociatedStudents(studentsData)
      }
      fetch()
   }, [user])

   const handlePay = () => {
      payBalance()
         .then(res => {
            if (res.error) {
               console.log(res.error)
               if (res.error.data) alert(res.error.data.message)
               return
            }
            console.log(res.data.data)
            if (res.data.data) {
               if (res.data.data.link) window.open(res.data.data.link)
            }
         })
   }

   // console.log('associatedStudents', associatedStudents);
   // console.log('selectedStudent', selectedStudent);

   return (
      <>
         {ledgerVisible && <Ledger setLedgerVisible={setLedgerVisible} />}
         <div
            className="flex flex-col lg:flex-row 2xl:gap-[78px] xl:gap-[50px] ml-[9px] pr-[9px] lg:pr-[40px] pt-[50px] pb-[30px] pl-0 lg:ml-[55px]"
            id={styles.parentDashboardHeader}
         >
            <div className="w-full lg:w-2/3 pr-[40px]">
               <div className="flex flex-col lg:flex-row" style={{ gap: 16 }}>
                  <div className="w-full lg:w-2/3 h-[206px] lg:h-auto flex items-center" id={styles.explore}>
                     <div className="flex mx-auto">
                        <div className="w-full flex-1 h-full flex items-center"
                           id={styles.exploreBgDisable}
                           style={{ position: 'absolute', top: '0', left: '0' }} >
                           {
                              images.length >= 1 &&
                              <ImageSlideshow images={images} text='text' />
                           }
                        </div>
                     </div>
                  </div>

                  {/* PAY btn widget */}
                  <div className={`w-full lg:w-1/3 ${credits > 0 && credits < 250 ? "bg-primaryOrange" : credits >= 250 ? "bg-[#4BBD94]" : "bg-[#F36262]"}`} id={styles.availableCredit}>
                     <div className="flex justify-between mb-2">
                        <h3 className="2xl:text-[19.6px] font-semibold">{credits > 0 && credits < 250 ? "Available Credit" : credits >= 250 ? "Available Credit" : "Amount Due"}</h3>
                        <img src={i} alt="" title="Give Value List" />
                     </div>

                     <div id={styles.creditBalance}>
                        <p className="whitespace-nowrap text-3xl leading-none mb-1" >
                           {credits < 0 ? -credits : credits} USD
                        </p>
                        <p className="text-[13.17px] font-bold cursor-pointer"
                           onClick={() => setLedgerVisible(true)}>
                           View details
                        </p>
                     </div>
                     <button className={`${styles.btnDark} ${credits > 0 && credits < 250 ? 'bg-primaryOrangeDark' : credits >= 250 ? "bg-[#095740]" : 'bg-[#BB2F2F]'}`} disabled={amountToPay === 0} onClick={handlePay} >
                        {amountToPay !== 0 ? <>Pay Now: $ {amountToPay}</> : <>No invoice Due</>}
                     </button>
                  </div>
               </div>
            </div>

            <div
               className="w-full lg:w-1/3"
            >
               <div className="flex justify-between items-center px-[11px]">
                  <h2 className="text-[#4715D7] font-semibold text-[21px] mt-[16px]">Your Student</h2>
                  {/* <img src={rightArrow} className="h-[15px] w-[15px]" alt="" /> */}
                  {associatedStudents.length > 0 &&
                     <InputSelect optionType='object'
                        parentClassName='mb-2'
                        inputContainerClassName='pt-1 pb-1'
                        optionData={associatedStudents.map(item => ({ _id: item._id, value: item.name, photo: item.photo, serviceSeeking: item.serviceSeeking }))}
                        optionClassName='w-[130px] text-sm'
                        optionListClassName="text-sm"
                        value={selectedStudent === null ? '' : selectedStudent.value}
                        onChange={val => setSelectedStudent(val)} />}
               </div>
               <div className={`item ${styles.student} w-100 min-h-[175px] px-[22px] 2xl:px-[32px] 2xl:py-[13px]`}>
                  <div className="flex flex-1 items-center">
                     {associatedStudents.length > 0 &&
                        <>
                           <div className="w-1/2">
                              <h2>
                                 {/* {selectedStudent !== null && 'Joseph Brown'}  */}
                                 {selectedStudent === null ? 'No students associated' :
                                    selectedStudent.value}
                              </h2>

                              {/* <h6 className="text-[10px]">SAT Tutoring <br />Subject Tutoring</h6> */}

                              <ul className="text-[12px]">
                                 {selectedStudent?.serviceSeeking?.map((item, idx) => <li>{item}
                                    {idx < selectedStudent?.serviceSeeking?.length - 1 ? ',' : ''} </li>)}
                              </ul>

                              <Link className="btn-gold"
                                 to={selectedStudent !== null && `/profile/student/${selectedStudent._id}`}>
                                 View Profile
                              </Link>

                           </div>
                        </>
                     }
                     {associatedStudents.length === 0 &&
                        <p>No students Associated</p>
                     }
                     {associatedStudents.length > 0 &&
                        <div className="w-1/2 flex justify-end">
                           {selectedStudent !== null &&
                              <img className="w-[40px] h-[40px] rounded-full" src={selectedStudent.photo ? selectedStudent.photo : ''} alt="" />
                           }
                        </div>
                     }
                  </div>
               </div>

            </div>

         </div>

      </>
   );
};

export default ParentDashboardHeader;
