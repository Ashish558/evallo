import React, { useEffect, useState } from 'react';
import Stat from "./../../assets/icons/stat.svg"
import Download from "./../../assets/icons/download.png"
import { useSelector } from 'react-redux';
import { useLazyGetTestResponseQuery } from '../../app/services/test';
import { getDate, getScore, getScoreStr } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

export const TestItem = ({ testName, assignedTestId, dueDate, pdfLink, testId, studentId, isCompleted, isStarted, awsLink }) => {

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
            // console.log('resp err', testName,res.error)
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

  const handleNavigate = () => {
    navigate(`/all-tests/start-section/${testId}/${assignedTestId}`)
  }

  const handleReportNavigate = () => {
    navigate(`/assigned-tests/${testId}/${assignedTestId}/report`)
  }

  return (
    <div className='flex py-[8px] mb-2 last:mb-0'>
      <div className='w-1/2'>
        <h2 className='text-[16px] font-semibold text-[#517CA8]'>{testName}</h2>
        <div className="flex gap-[12px] whitespace-nowrap">
          <h5 className="text-xs opacity-60  font-medium text-[#517CA8]">
            Due date:
          </h5>
          <h6 className="text-xs opacity-60 font-medium text-[#517CA8]">  {getDate(dueDate)}</h6>
        </div>
      </div>
      <div className='flex-1 ml-5'>
        <div className="flex gap-[12px]">
          <div className='flex items-center'>
            {/* <div className='w-[24px]'>
              {isCompleted === false ?
                <img className='cursor-pointer' src={Download} onClick={() => window.open(pdfLink)} width="34px" alt="download" />
                :
                <img className='cursor-pointer' src={Stat} width='34px' alt="Stat" onClick={handleReportNavigate} />
              }
            </div> */}
            <div className='w-[24px]'>

              <img className='cursor-pointer' src={Download} onClick={() => window.open(`${awsLink}${pdfLink}`)} width="34px" alt="download" />

            </div>
          </div>

          {/* {action === 'Start' && <div className="w-full font-bold bg-[#F6A429CC] px-2 py-2 text-center text-white rounded-[6px]">{action}</div>} */}
          {isCompleted === true ?
            <div className="cursor-pointer  break-al  w-full text-sm font-semibold bg-[#FFCE84] px-2 py-2 text-center text-black rounded-[6px]" onClick={handleReportNavigate} >
              {/* {score} */}
              Report
            </div> :
            isStarted === true ?
              <div className="cursor-pointer w-full text-sm font-semibold bg-[#FFCE84] px-2 py-2 text-center text-white rounded-[6px]" onClick={handleNavigate}>
                Continue
              </div> :
              <div className="cursor-pointer w-full text-sm font-semibold bg-[#FF7979] px-2 py-2 text-center text-white rounded-[6px]" onClick={handleNavigate} >
                Start
              </div>
          }

          {/* {status === 'Completed' && <div className="w-full bg-[#CBC0F5] px-[34px] py-[10px] text-center text-black rounded-[6px]">{marks}</div>} */}
        </div>
      </div>
    </div>
  )
}
