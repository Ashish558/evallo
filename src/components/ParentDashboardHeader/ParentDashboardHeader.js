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

const ParentDashboardHeader = () => {
   const [images, setImages] = useState([])
   const [user, setUser] = useState({})
   const [associatedStudents, setAssociatedStudents] = useState([])

   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()
   const [fetchSettings, fetchSettingsResp] = useLazyGetSettingsQuery()
   const [selectedStudent, setSelectedStudent] = useState(null)

   const navigate = useNavigate()

   const { id } = useSelector(state => state.user)

   useEffect(() => {
      fetchSettings()
         .then(res => {
            setImages(res.data.data.setting.offerImages)
         })
      getUserDetail({ id })
         .then(res => {
            // console.log('response', res.data.data);
            setUser(res.data.data.user)
            setAssociatedStudents([])
            res.data.data.user.assiginedStudents.map((student, idx) => {
               getUserDetail({ id: student })
                  .then(res => {
                     setAssociatedStudents(prev => [...prev, {
                        _id: res.data.data.user._id,
                        name: `${res.data.data.user.firstName} ${res.data.data.user.lastName}`
                     }])
                     idx === 0 && setSelectedStudent({
                        _id: res.data.data.user._id,
                        value: `${res.data.data.user.firstName} ${res.data.data.user.lastName}`
                     })
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


   return (
      <div
         className="flex 2xl:gap-[78px] xl:gap-[50px]"
         id={styles.parentDashboardHeader}
      >
         <div className="w-2/3 flex">
            <div className="flex" style={{ gap: 16 }}>
               <div className="w- flex items-center" id={styles.explore}>
                  <div className="flex">
                     <div className="w-1/2" id={styles.exploreLeft}>
                        <h2 className="">
                           This fall get help from our Admission
                           Experts.
                        </h2>
                        <button className="ml-[32px] text-sm 2xl:ml-[46px] bg-[#f3f5f7] rounded-[5px] py-[8px] px-[15px]">
                           Know More {">"}
                        </button>
                     </div>
                     <div className="w-1/2 flex items-center px-2 pr-4" id={styles.exploreBgDisable}>
                        {/* <div className="relative w-full h-fll">
                           {
                              images.length > 0 ? <img src={images[0]} alt="" />
                                 :
                                 <img src={explore} alt="" />
                           }
                        </div> */}{
                           images.length >= 1 &&
                           <ImageSlideshow images={images} />
                        }
                     </div>
                  </div>
               </div>

               <div className="w-" id={styles.availableCredit}>
                  <div className="flex justify-between">
                     <h3 className="2xl:text-[19.6px] font-semibold">Available Credit</h3>
                     <img src={i} alt="" />
                  </div>

                  <div id={styles.creditBalance}>
                     <p className="whitespace-nowrap text-3xl leading-none mb-1" >
                        820 USD
                     </p>
                     <p className="text-[13.17px] font-bold cursor-pointer"
                        onClick={() => navigate('/ledger')}>
                        View details
                     </p>
                  </div>
                  <button className={styles.btnDark}>
                     Pay Now: $ 2600
                  </button>
               </div>
            </div>
         </div>

         <div
            className="w-1/3"
         >
            <div className="flex justify-between items-center px-[11px]">
               <h2 className="text-[#4715D7] font-semibold text-[21px] mt-[16px]">Your Student</h2>
               {/* <img src={rightArrow} className="h-[15px] w-[15px]" alt="" /> */}
               {associatedStudents.length > 0 &&
                  <InputSelect optionType='object'
                     parentClassName='mb-2'
                     inputContainerClassName='pt-1 pb-1'
                     optionData={associatedStudents.map(item => ({ _id: item._id, value: item.name }))}
                     optionClassName='w-[130px] text-sm'
                     value={selectedStudent === null ? '' : selectedStudent.value}
                     onChange={val => setSelectedStudent(val)} />}
            </div>
            <div class={`item ${styles.student} w-100 px-[22px] 2xl:px-[32px] 2xl:py-[13px]`}>
               <div className="flex items-center">
                  <div className="w-1/2">
                     <h2>
                        {/* {selectedStudent !== null && 'Joseph Brown'}  */}
                        {selectedStudent === null ? 'Dummy name' :
                           selectedStudent.value}
                     </h2>
                     <h6 className="text-[10px]">SAT Tutoring <br />Subject Tutoring</h6>
                     <Link className="btn-gold"
                        to={selectedStudent !== null && `/profile/student/${selectedStudent._id}`}>
                        View Profile
                     </Link>
                  </div>
                  <div className="w-1/2 flex justify-end">
                     <img src={shivam} alt="" />
                  </div>
               </div>
            </div>

         </div>

      </div>
   );
};

export default ParentDashboardHeader;
