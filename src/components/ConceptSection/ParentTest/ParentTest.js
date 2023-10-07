import React, { useEffect, useState } from 'react'
import { getDate, getFormattedDate, getScore, getScoreStr } from '../../../utils/utils'
import downloadImage2 from "../../../assets/icons/download.png";
import downloadImage from "../../../assets/icons/download2.svg";
import { useSelector } from 'react-redux';
import { useLazyGetTestResponseQuery } from '../../../app/services/test';
import { useNavigate } from 'react-router-dom';

export default function ParentTest({ styles, assignedTestId, testId, testName, studentId, dueDate, isCompleted, isStarted, pdfLink }) {

   const { dateFormat } = useSelector(state => state.user)
   const [score, setScore] = useState('-')
   const { role: persona } = useSelector(state => state.user)
   const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery()
   const navigate = useNavigate()
   const { awsLink } = useSelector((state) => state.user);

   useEffect(() => {
      if (isCompleted === true) {
         let params = {}
         let url = `/api/test/getresponse/${assignedTestId}`
         if (persona !== 'student') {
            url = `/api/test/admin/getresponse/${assignedTestId}`
         }

         getTestResponse({ url, params: params })
            .then(res => {
               if (res.error) {
                  console.log('resp err', res.error)
                  return
               }
               // console.log('Resp score', res.data.data.response);
               let responseData = res.data.data.response
               let score = getScoreStr(responseData.testType, responseData.score, responseData.subjects, responseData.subjects.length)
               // let scr = getScore(res.data.data.response.testType, res.data.data.response.subjects)
               setScore(`${score.cumulative} ${score.right}`)
            })
      }
   }, [])

   const handleReportNavigate = () => {
      if(pdfLink){
         const anchor = document.createElement('a');
         anchor.href = `${awsLink}${pdfLink}`;
         anchor.target = '_blank';
         anchor.download = `${pdfLink}.pdf`; // Replace with the desired file name and extension
         anchor.click();
      }else{
         alert('The PDF file is no longer available.')
      }
   }

   const handleNavigate = () => {
      navigate(`/assigned-tests/${testId}/${assignedTestId}/report/${studentId._id}`)
   }

   return (
      <div
         className="flex items-center justify-between"
         style={{ padding: "10px 0" }}
      >
         <div className="w-1/2">
            <div className={styles.listedDataItem}>
               <h1 className='!text-[#517CA8] font-semibold text-base-20'> {testName} </h1>
               <div
                  className="flex mr-2"
                  style={{ gap: "6px" }}
               >
                  <p className="text-xs font-semibold opacity-50 text-[#517CA8] text-base-15">Due Date: </p>
                  <h3 className="opacity-60 text-xs font-semibold text-[#517CA8] text-base-15">
                  {getFormattedDate(dueDate, dateFormat)}
                  </h3>
               </div>
            </div>
         </div>
         {
            isCompleted ?
               <div className="w-1/2">
                  <div
                     className="flex items-center justify-end"
                     style={{ gap: "10px" }}
                  >
                     <img src={downloadImage} onClick={handleReportNavigate} alt='download-icon' className='cursor-pointer' />
                     <div className="button  text-[#7D7] p-[10px] rounded-[6px] w-[190px] text-center text-base-17-5 font-semibold cursor-pointer" onClick={handleNavigate} >
                        {/* {score} */}
                        View Report
                     </div>
                  </div>
               </div>
               : isStarted ?
                  <div className="w-1/2">
                     <div
                        className="flex items-center justify-end"
                        style={{ gap: "10px" }}
                     >
                        <img src={downloadImage} alt='download-icon' onClick={handleReportNavigate} className="cursor-pointer" />
                        <div className="button  text-[#FFCE84] p-[10px] rounded-[6px] w-[190px] text-center text-base-17-5 font-semibold">
                           Started
                        </div>
                     </div>
                  </div>
                  :
                  <div className="w-1/2">
                     <div
                        className="flex items-center justify-end"
                        style={{ gap: "10px" }}
                     >
                        <img alt='download-icon' src={downloadImage} onClick={handleReportNavigate} className="cursor-pointer" />
                        <div className="button  text-[#FF6961] p-[10px] rounded-[6px] w-[190px] text-center text-base-17-5 font-semibold">
                           Not Started
                        </div>
                     </div>
                  </div>
         }
      </div>
   )
}
