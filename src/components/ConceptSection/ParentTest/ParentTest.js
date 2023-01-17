import React, { useEffect, useState } from 'react'
import { getDate, getScore, getScoreStr } from '../../../utils/utils'
import downloadImage from "../../../assets/icons/download.png";
import { useSelector } from 'react-redux';
import { useLazyGetTestResponseQuery } from '../../../app/services/test';
import { useNavigate } from 'react-router-dom';

export default function ParentTest({ styles, assignedTestId, testId, testName, studentId, dueDate, isCompleted, isStarted }) {


   const [score, setScore] = useState('-')
   const { role: persona } = useSelector(state => state.user)
   const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery()
   const navigate = useNavigate()

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
               let score = getScoreStr(responseData.testType, responseData.score, responseData.subjects)
               // let scr = getScore(res.data.data.response.testType, res.data.data.response.subjects)
               setScore(`${score.cumulative} ${score.right}`)
            })
      }
   }, [])

   const handleReportNavigate = () => {
      navigate(`/assigned-tests/${testId}/${assignedTestId}/report/${studentId._id}`)
   }

   return (
      <div
         className="flex items-center justify-between"
         style={{ padding: "10px 0" }}
      >
         <div className="w-1/2">
            <div className={styles.listedDataItem}>
               <h1> {testName} </h1>
               <div
                  className="flex mr-2"
                  style={{ gap: "6px" }}
               >
                  <p className="text-xs font-semibold opacity-50">Due Date</p>
                  <h3 className="opacity-60 text-xs font-semibold">
                     {getDate(dueDate)}
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
                     <img src={downloadImage} onClick={handleReportNavigate} alt="" className='cursor-pointer' />
                     <div className="button bg-[#EFECF9] text-[#0671E0] p-[10px] rounded-[6px] w-[111px] text-sm font-semibold">
                        {score}
                     </div>
                  </div>
               </div>
               : isStarted ?
                  <div className="w-1/2">
                     <div
                        className="flex items-center justify-end"
                        style={{ gap: "10px" }}
                     >
                        <img src={downloadImage} alt="" className='opacity-60' />
                        <div className="button bg-[#EFECF9] text-[#F6A429] p-[10px] rounded-[6px] w-[111px] text-sm font-semibold">
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
                        <img src={downloadImage} alt="" className='opacity-60' />
                        <div className="button bg-[#EFECF9] text-[#E02B1D] p-[10px] rounded-[6px] w-[111px] text-sm font-semibold">
                           Not Started
                        </div>
                     </div>
                  </div>
         }
      </div>
   )
}
