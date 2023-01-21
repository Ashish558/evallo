import React, { useEffect, useState } from 'react';
import Stat from "./../../assets/icons/stat.svg"
import Download from "./../../assets/icons/download.png"
import { useSelector } from 'react-redux';
import { useLazyGetTestResponseQuery } from '../../app/services/test';
import { getScore, getScoreStr } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

export const TestItem = ({ testName, assignedTestId, dueDate, pdfLink, testId, studentId, isCompleted, isStarted }) => {

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
          let responseData =  res.data.data.response
          let score = getScoreStr(responseData.testType, responseData.score, responseData.subjects)
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
        <h2 className='text-[18px] font-medium'>{testName}</h2>
        <div className="flex gap-[12px]">
          <h5 className="text-xs opacity-60 font-semibold">
            due date
          </h5>
          <h6 className="text-xs opacity-60 font-medium">{dueDate}</h6>
        </div>
      </div>
      <div className='flex-1 ml-5'>
        <div className="flex gap-[12px]">
          <div className='flex items-center'>
            <div className='w-[24px]'>
              {isCompleted === false ?
                <img className='cursor-pointer' src={Download} onClick={() => window.open(pdfLink)} width="34px" alt="download" />
                :
                <img className='cursor-pointer' src={Stat} width='34px' alt="Stat" onClick={handleReportNavigate} />
              }
            </div>
          </div>

          {/* {action === 'Start' && <div className="w-full font-bold bg-[#F6A429CC] px-2 py-2 text-center text-white rounded-[6px]">{action}</div>} */}
          {isCompleted === true ?
            <div className="cursor-pointer text-sm break-al  w-full text-sm font-bold bg-[#CBC0F5]/50 px-2 py-2 text-center text-black rounded-[6px]">
              {score}
            </div> :
            isStarted === true ?
              <div className="cursor-pointer w-full font-bold bg-[#32D583] px-2 py-2 text-center text-white rounded-[6px]" onClick={handleNavigate}>
                Continue
              </div> :
              <div className="cursor-pointer w-full font-bold bg-[#F6A429CC] px-2 py-2 text-center text-white rounded-[6px]" onClick={handleNavigate} >
                Start
              </div>
          }

          {/* {status === 'Completed' && <div className="w-full bg-[#CBC0F5] px-[34px] py-[10px] text-center text-black rounded-[6px]">{marks}</div>} */}
        </div>
      </div>
    </div>
  )
}
