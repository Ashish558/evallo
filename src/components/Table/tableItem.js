import React from "react";
import { useNavigate } from "react-router-dom";
import ResendConfirmation from "../../assets/assignedTests/resendConfirmation.svg";
import UploadIcon from "../../assets/assignedTests/upload.svg";
import SuccessIcon from "../../assets/assignedTests/success.svg";
import FailIcon from "../../assets/assignedTests/fail.svg";
import YellowIcon from "../../assets/assignedTests/yellow.svg";
import RedIcon from "../../assets/assignedTests/red.svg";
import GreenIcon from "../../assets/assignedTests/green.svg";
import GrayIcon from "../../assets/assignedTests/gray.svg";
import RemoveIcon from "../../assets/icons/remove.svg"

//can b made dynamic
export default function TableItem({ item, dataFor, onClick }) {

   // console.log(onClick)

   const navigate = useNavigate();
   // console.log(dataFor)

   const returnStatus = (status) => {
      return status === 0 ? (
         <img className="first:mr-2" src={YellowIcon} />
      ) : status === 1 ? (
         <img className="first:mr-2" src={RedIcon} />
      ) : status === 2 ? (
         <img className="first:mr-2" src={GreenIcon} />
      ) : status === 3 ? (
         <img className="first:mr-2" src={GrayIcon} />
      ) : (
         <></>
      );
   };

   const toExcludes = ['testId', '_id', 'isCompleted']
   const toExcludeInvoice = ['_id']


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
                     {item.leadStatus}
                  </div>
               </td>
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     {/* {item.userType === 'tutor' ? */}
                     <span className="cursor-pointer inline-block px-1" onClick={() => onClick.handleTutorStatus(item,)}>
                        {item.block === false ? 'Active' : item.userType === 'parent' || item.userType ==='student' ? 'Blocked' : 'Dormant'}
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
                     {item.name}
                  </span>
               </td>
               <td className={`font-medium px-1 flex justify-center items-center min-w-14 py-4 relative ${item.late && 'text-[#EE3434]'}`}>
                  {item.late && <span className="inline-block w-[20px] h-[20px] rounded-full bg-[#EE3434]"></span>} {item.assigedOn}
               </td>
               <td className="font-medium px-1  min-w-14 py-4">
                  {item.testName}
               </td>
               <td className="font-medium px-1  min-w-14 py-4">
                  {item.duration}
               </td>
               <td className="font-medium px-1  min-w-14 py-4">
                  <div className="flex items-center no-wrap justify-center">
                     {returnStatus(item.status[0])}
                     {returnStatus(item.status[1])}
                  </div>
               </td>
               <td
                  className="font-medium pl-7 text-left min-w-14 py-4"
                  style={{ padding: 0, paddingLeft: "27px" }}
               >
                  {item.score}
               </td>
               <td className="font-medium px-1  min-w-14 py-4">
                  <button
                     className="px-2.5 py-1.8 rounded-md flex items-center leading-none bg-primary text-white"
                     onClick={() =>
                        navigate("/assigned-tests/321/report")
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
                     <td className="font-medium px-1  min-w-14 py-4">
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
               {mapData(item, 'assignedStudents')}
               <td>
                  <img src={RemoveIcon} />
               </td>
            </tr>
         )}
         {dataFor === "studentTestsReport" && (
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
                  toExcludes.includes(key) ? <></> :
                     (
                        <td className="font-medium px-1  min-w-14 py-4">
                           {key === 'status' ?
                              <img className="first:mr-2 mx-auto inline-block" src={GreenIcon} />
                              :

                              item[key]
                           }
                        </td>
                     )
               )}
               <td className="font-medium px-1  min-w-14 py-4">
                  <div className="flex items-center">
                     <img src={UploadIcon} />
                     {
                        item.isCompleted ?
                           <button
                              className="px-2.5 py-1.8 rounded-md flex items-center leading-none bg-primary text-white ml-4"
                              onClick={() =>
                                 navigate("/assigned-tests/321/report")
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
               {mapData(item, dataFor, toExcludeInvoice)}
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

const mapData = (data, dataFor, exclude = []) => {

   return Object.keys(data).map((key, i) =>
      dataFor === 'invoice' && exclude.includes(key) ? <></> :
         (
            key === "Accuracy" ? (
               <td className="font-medium px-1  min-w-14 py-4">
                  <div className="flex items-center justify-center">
                     <img
                        src={
                           data[key] > 80
                              ? SuccessIcon
                              : FailIcon
                        }
                        className="flex"
                     />
                  </div>
               </td>
            ) :
               dataFor === 'invoice' && key === 'currentBalance' ? (
                  <td className='font-medium px-1 text-[#009262]  py-4'>
                     <p className={`font-semibold ${data.status === 'Paid' && "text-[#E02B1D]"} ${data.status === 'Unpaid' && "text-[#009262]"} ${data.status === 'Cancelled' && "text-[#E48900]"}`}>
                        {data[key] === "Paid" && "-"}{data[key]}
                     </p>
                  </td>
               ) :
                  dataFor === 'assignedStudents' && key === 'name' || key === 'parent' ? (
                     <td className={`font-medium px-1 ${data[key] === "Unpaid" && 'text-[#E02B1D]'} ${data[key] === "Paid" && 'text-[#009262]'} ${data[key] === "Cancelled" && 'text-[#7C859C]'} min-w-14 py-4 ${key === "paidOn" && "text-[16px]"}`}>
                        <p className={`pl-4 ${key === 'name' ? 'text-left' : ''} font-semibold`}>
                           {data[key]}
                        </p>
                     </td>
                  ) :
                     (
                        <td className={`font-medium px-1 ${data[key] === "Unpaid" && "text-[#E02B1D]"} ${data[key] === 'Paid' && "text-[#009262]"} ${data[key] === 'Cancelled' && "text-[#7C859C]"} min-w-14 py-4`}>
                           {data[key]}
                        </td>
                     )
         ))

}