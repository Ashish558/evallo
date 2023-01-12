import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResendConfirmation from "../../assets/assignedTests/resendConfirmation.svg";
import UploadIcon from "../../assets/assignedTests/upload.svg";
import DownloadIcon from "../../assets/icons/download.png";
import SuccessIcon from "../../assets/assignedTests/success.svg";
import FailIcon from "../../assets/assignedTests/fail.svg";
import YellowIcon from "../../assets/assignedTests/yellow.svg";
import LightBlueIcon from "../../assets/assignedTests/lightblue.svg";
import RedIcon from "../../assets/assignedTests/red.svg";
import GreenIcon from "../../assets/assignedTests/green.svg";
import GrayIcon from "../../assets/assignedTests/gray.svg";
import RemoveIcon from "../../assets/icons/remove.svg"
import InputSelect from "../InputSelect/InputSelect";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import { useLazyGetTutorDetailsQuery, useLazyGetUserDetailQuery, usePostTutorDetailsMutation, useUpdateTutorDetailsMutation, useUpdateUserDetailsMutation } from "../../app/services/users";

//can b made dynamic
export default function TableItem({ item, dataFor, onClick, excludes, fetch }) {

   // console.log(onClick)
   const [fetchSettings, settingsResp] = useLazyGetSettingsQuery()
   const [getUserDetail, getUserDetailResp] = useLazyGetUserDetailQuery()
   const [getTutorDetail, getTutorDetailResp] = useLazyGetTutorDetailsQuery()

   const [updateUserDetail, updateUserDetailResp] = useUpdateUserDetailsMutation()
   const [updateTutorDetail, updateTutorDetailResp] = useUpdateTutorDetailsMutation()
   const [postTutorDetails, postTutorDetailsResp] = usePostTutorDetailsMutation()

   const [userDetail, setUserDetail] = useState({})

// console.log(item);
   const [settings, setSettings] = useState({
      leadStatus: []
   })

   // useEffect(() => {
   //    if (dataFor === 'allUsers') {
   //       if (item.userType === 'tutor') {
   //          getTutorDetail({ id: item._id })
   //             .then(res => {
   //                if (res.data.data.details) {
   //                   setUserDetail(res.data.data.details)
   //                }
   //             })
   //       } else {
   //          getUserDetail({ id: item._id })
   //             .then(res => {
   //                // console.log(res.data.data);
   //                if (res.data.data.userdetails) {
   //                   setUserDetail(res.data.data.userdetails)
   //                }
   //             })
   //       }
   //    }
   // }, [item])

   useEffect(() => {
      fetchSettings()
         .then(res => {
            setSettings(res.data.data.setting)
         })
   }, [])

   const navigate = useNavigate();

   const handleChange = (field) => {
      // console.log(field)
      // console.log(item._id)
      // console.log(userDetail)
      if (item.userType === 'parent' || item.userType === 'student') {
         updateUserDetail({ fields: field, id: item._id })
            .then(res => {
               fetch && fetch(field, item._id)
            })
      } else if (item.userType === 'tutor') {
         if (Object.keys(userDetail).length === 0) {
            postTutorDetails({ fields: field, id: item._id })
               .then(res => {
                  fetch && fetch(field, item._id)
               })
         } else {
            updateTutorDetail({ fields: field, id: item._id })
               .then(res => {
                  fetch && fetch(field, item._id)
               })
         }
      }
   }

   const returnStatus = (status) => {
      return status === 'completed' ? (
         <img className="first:mr-2" src={GreenIcon} />
      ) : status === 'started' ? (
         <img className="first:mr-2" src={YellowIcon} />
      ) : status === "notStarted" ? (
         <img className="first:mr-2" src={LightBlueIcon} />
      ) : status === 3 ? (
         <img className="first:mr-2" src={LightBlueIcon} />
      ) : (
         <></>
      );
   };

   // const toExcludes = ['testId', '_id', 'isCompleted']

   return (
      <>
         {dataFor === "allUsers" && (
            <tr className="odd:bg-white shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-8">
               <td className="font-semibold text-sm px-1  min-w-14 py-4 text-primaryBlue text-left">
                  <span
                     className="inline-block cursor-pointer pl-4"
                     onClick={() => onClick.redirect(item)}
                  >
                     {item.name}
                  </span>
               </td>
               <td className="font-medium text-sm px-1 min-w-14 py-4">
                  <div className="my-[6px]">
                     {item.userType}
                  </div>
               </td>
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     {item.email}
                  </div>
               </td>
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     {item.phone}
                  </div>
               </td>
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     {item.assignedTutor}
                  </div>
               </td>
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     <InputSelect value={item.leadStatus ? item.leadStatus : '-'}
                        optionData={settings.leadStatus}
                        inputContainerClassName='min-w-[100px] pt-0 pb-0 pr-2 pl-0 text-center'
                        optionClassName='font-semibold opacity-60 text-sm'
                        labelClassname='hidden'
                        onChange={val => handleChange({ leadStatus: val })} />
                  </div>
               </td>
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     {/* {item.userType === 'tutor' ? */}
                     <span className="cursor-pointer inline-block px-1" onClick={() => onClick.handleTutorStatus(item,)}>
                        {item.block === false ? 'Active' : item.userType === 'parent' || item.userType === 'student' ? 'Blocked' : 'Dormant'}
                     </span>
                     {/* : */}
                     {/* item.tutorStatus} */}
                  </div>
               </td>
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     {item.services}
                  </div>
               </td>
            </tr>
         )}

         {dataFor === "assignedTests" && (
            <tr className="odd:bg-white text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-8">
               <td className="px-1 font-medium  min-w-14 py-4 text-left">
                  <span className="inline-block cursor-pointer pl-4">
                     {item.studentName}
                  </span>
               </td>
               <td className={`font-medium px-1 flex justify-center items-center min-w-14 py-4 relative ${item.late && 'text-[#EE3434]'}`}>
                  {item.late &&
                     <span className="inline-block w-[20px] h-[20px] rounded-full bg-[#EE3434]">
                     </span>}
                  {item.assignedOn}
               </td>
               <td className="font-medium px-1  min-w-14 py-4">
                  {item.testName}
               </td>
               <td className="font-medium px-1  min-w-14 py-4">
                  {item.duration}
               </td>
               <td className="font-medium px-1  min-w-14 py-4">
                  <div className="flex items-center no-wrap justify-center">
                     {returnStatus(item.status)}
                     {/* {returnStatus(item.status)} */}
                  </div>
               </td>
               <td
                  className="font-medium px-1 test-center text-left min-w-14 py-4"
               // style={{ padding: 0,}}
               >
                  <div className="text-center">
                     {item.scores}
                  </div>
               </td>
               <td className="font-medium px-1  min-w-14 py-4">
                  <button
                     className="px-2.5 py-1.8 rounded-md flex items-center leading-none bg-primary text-white"
                     onClick={() =>
                        navigate(`/assigned-tests/${item.testId}/report`)
                     }
                  >
                     Test details
                  </button>
               </td>
               <td className="font-medium px-1 min-w-14 py-4">
                  <img
                     src={ResendConfirmation}
                     className="cursor-pointer"
                     onClick={() => onClick.handleResend(item)}
                  />
               </td>
            </tr>
         )}

         {dataFor === "tests" && (
            <tr className="odd:bg-white text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-7">
               {Object.keys(item).map((key, i) =>
                  key === "Accuracy" ? (
                     <td key={i} className="font-medium px-1  min-w-14 py-4">
                        <div className="flex items-center justify-center">
                           <img
                              src={
                                 item[key] > 80
                                    ? SuccessIcon
                                    : FailIcon
                              }
                              className="flex"
                           />
                        </div>
                     </td>
                  ) : (
                     <td className="font-medium px-1  min-w-14 py-4">
                        {item[key]}
                     </td>
                  )
               )}
               <td className="font-medium px-1 min-w-14 py-4 flex justify-center items-center">
                  <button className="flex items-center">
                     <span className="inline-block mr-3 text-textBlue">
                        Upload Answer
                     </span>
                     <img src={UploadIcon} />
                  </button>
               </td>
            </tr>
         )}
         {dataFor === "assignedStudents" && (
            <tr className="odd:bg-white text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-7">
               {mapData(item, 'assignedStudents', excludes, onClick)}
               {/* <td>
                  <img src={RemoveIcon} />
               </td> */}
            </tr>
         )}
         {dataFor === "studentTestsReport" && (
            <tr className="odd:bg-white text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-7">
               {mapData(item)}
            </tr>
         )}
         {dataFor === "studentTestsReportSmall" && (
            <tr className="odd:bg-white text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-7">
               {mapData(item)}
            </tr>
         )}
         {dataFor === "studentTestsAnswers" && (
            <tr className="odd:bg-white text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-7">
               {mapData(item)}
               <td className="font-medium px-1 min-w-14 py-4 flex justify-center items-center">
                  <button className="flex items-center">
                     <span className="inline-block mr-3 text-textBlue">
                        Upload Answer
                     </span>
                     <img src={UploadIcon} />
                  </button>
               </td>
            </tr>
         )}
         {dataFor === "assignedTestsStudents" && (
            <tr className="odd:bg-white shadow-sm text-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-7">
               {Object.keys(item).map((key, i) =>
                  excludes.includes(key) ? <></> :
                     (
                        <td key={i} className="font-medium px-1  min-w-14 py-4">
                           {key === 'status' ?
                              <div className="flex justify-center">
                                 {returnStatus(item.status)}
                              </div>
                              :
                              item[key]
                           }
                        </td>
                     )
               )}
               <td className="font-medium px-1  min-w-14 py-4">
                  <div className="flex items-center">
                     <img src={DownloadIcon} className='w-[30px] cursor-pointer' onClick={()=> item.pdfLink !== null && window.open(item.pdfLink)} />
                     {
                        item.isCompleted ?
                           <button
                              className="px-2.5 py-1.8 rounded-md flex items-center leading-none bg-primary text-white ml-4"
                              onClick={() =>
                                 navigate(`/assigned-tests/${item.testId}/report`)
                              }
                           >
                              View Report
                           </button> :
                           <button
                              className="px-2.5 py-1.8 rounded-md flex items-center leading-none bg-primary text-white ml-4"
                              onClick={() =>
                                 navigate(`/all-tests/start-section/${item.testId}`)
                              }
                           >
                              Start Test
                           </button>
                     }
                  </div>
               </td>
            </tr>
         )}
         {dataFor === "invoice" && (
            <tr className="bg-white text-sm shadow-sm shadow-slate-200 rounded-2xl leading-7 mt-[10px]">
               {mapData(item, dataFor, excludes)}
            </tr>
         )}
         {dataFor === "testsDetailQuestions" && (
            <tr className="bg-white text-sm shadow-sm shadow-slate-200 rounded-2xl leading-7 mt-[10px]">
               {mapData(item, dataFor, excludes)}
            </tr>
         )}
         {dataFor === "allTests" && (
            <tr className="odd:bg-white font-medium text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl lead">
               <td>{item.testName}</td>
               <td>{item.updatedAt.split("T")[0]}</td>
               <td>{item.testType}</td>
               <td className="font-medium px-1 py-4 text-right w-240">
                  <div className="flex justify-end">
                     <button
                        className="flex bg-primaryOrange items-center leading-none text-white py-1.8 px-5 rounded"
                        onClick={() =>
                           navigate(`/all-tests/${item._id}`)
                        }
                     >
                        View Test
                     </button>
                  </div>
               </td>
               <td className="font-medium px-1 text-right w-240 py-4">
                  <div
                     className="flex"
                     onClick={() => onClick.openRemoveTestModal(item)}
                  >
                     <button className="flex ml-6 bg-textGray-400 flex items-center items-center leading-none text-white py-1.8 px-5 rounded">
                        Remove
                     </button>
                  </div>
               </td>
            </tr>
         )}
      </>
   );
}

const mapData = (data, dataFor, exclude = [], onClick) => {
   // console.log(data);
   return Object.keys(data).map((key, i) =>
      exclude.includes(key) ? <></> :
         (
            key === "isCorrect" ? (
               <td key={i} className="font-medium px-1  min-w-14 py-4">
                  <div className="flex items-center justify-center">
                     <img
                        src={
                           data[key] === true 
                              ? SuccessIcon
                              : FailIcon
                        }
                        className="flex"
                     />
                  </div>
               </td>
            ) :
               dataFor === 'invoice' && key === 'currentBalance' ? (
                  <td key={i} className='font-medium px-1 text-[#009262]  py-4'>
                     <p className={`font-semibold ${data.status === 'Paid' && "text-[#009262]"} ${data.status === 'Unpaid' && "text-[#E02B1D]"} ${data.status === 'Cancelled' && "text-[#E48900]"}`}>
                        {data[key] === "Paid" && "-"}{data[key]}
                     </p>
                  </td>
               ) :
                  dataFor === 'assignedStudents' && key === 'name' || key === 'parent' ? (
                     <td key={i} className={`font-medium px-1 `}>
                        <p className={`pl-4 ${key === 'name' ? 'text-left' : ''} font-semibold`}
                           onClick={() => key === 'name' && onClick.handleNavigate('student', data._id)}
                        >
                           {data[key]}
                        </p>
                     </td>
                  ) :
                     (
                        <td key={i} className={`font-medium px-1 ${data[key] === "Unpaid" && "text-[#E02B1D]"} ${data[key] === 'Paid' && "text-[#009262]"} ${data[key] === 'Cancelled' && "text-[#7C859C]"} min-w-14 py-4`}>
                           {data[key]}
                        </td>
                     )
         ))

}