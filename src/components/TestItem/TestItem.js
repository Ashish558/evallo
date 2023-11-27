import React, { useEffect, useState } from 'react';
import Stat from './../../assets/icons/stat.svg';
import Download from './../../assets/icons/download.png';
import { useSelector } from 'react-redux';
import { useLazyGetTestResponseQuery } from '../../app/services/test';
import { getDate, getFormattedDate, getScore, getScoreStr } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import LoaderPage from './LoaderPage';
import TestInstructionpage from './TesInstructionPage.js';
import TestPage from '../../pages/DsatTestPage/TestPage';



export const TestItem = ({
  testName,
  assignedTestId,
  dueDate,
  pdfLink,
  testId,
  studentId,
  isCompleted,
  isStarted,
  awsLink,
  testype
}) => {
  const [pageState, setPageState] = useState('loading');
  const [showTestInstruction, setShowTestInstruction] = useState(false);
  const [score, setScore] = useState('-');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isLoadingPage, setIsLoadingPage] = useState(false); // Loading page state
  const { role: persona } = useSelector((state) => state.user);
  const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery();
  const navigate = useNavigate();
  const { dateFormat } = useSelector(state => state.user)
  const handleNavigate = () => {
    setIsLoading(true); 
    setIsLoadingPage(true);
    navigate('/loader');
    setPageState('instruction');
    
    
    
    setTimeout(() => {
      setIsLoading(false);  
      setIsLoadingPage(false);
      setShowTestInstruction(true);
      // navigate(`/all-tests/${testId}/${assignedTestId}`);
      testype=='DSAT'?
        navigate(`/testpage/${testId}/${assignedTestId}`)
      : navigate(`/all-tests/start-section/${testId}/${assignedTestId}`);

    }, 2000); 
  };
  const handleBackClick = () => {
    setPageState('loading'); 
  };

  const handleNextClick = () => {
    setPageState('test-page'); 
  };

  const handleReportNavigate = () => {
    navigate(`/assigned-tests/${testId}/${assignedTestId}/report`);
  };

  return (
    <div className='flex py-[8px] mb-2 last:mb-0'>
      
      <div className='w-1/2'>
        <h2 className='text-[18px] font-medium text-[#517CA8]'>{testName}</h2>
        <div className='flex gap-[12px]'>
          <h5 className='text-xs opacity-60 font-light text-[#517CA8]'>Due date:</h5>
          <h6 className='text-xs opacity-60 font-light text-[#517CA8]'>{getFormattedDate(dueDate, dateFormat)}</h6>
        </div>
      </div>
      <div className='flex-1 ml-5'>
        <div className='flex gap-[12px]'>
          <div className='flex items-center'>
            <div className=' mr-3  p-1'>
             {testype!=="DSAT"&& <img
                className='cursor-pointer h-[35px]'
                src={Download}
                onClick={() => window.open(`${awsLink}${pdfLink}`)}
                alt='download'
              />}
            </div>
          </div>
          {
  isLoadingPage ? (
    <LoaderPage />
  ) : isLoading ? (
    <div className='loader-container'>
      <div className='loader-text'>Loading...</div>
    </div>
  ) : pageState === 'instruction' ? (
    <testinstructionpage onNextClick={handleNextClick} />
  ) : pageState === 'test' ? (
    <TestPage /> 
  ) : isCompleted === true ? (
                      <div className='cursor-pointer     bg-[#38C980] px-2 py-2 text-center text-white rounded-[5px] w-[6.25vw] text-base-17-5'
      onClick={handleReportNavigate}
    >
      {/* {score} */}Report
    </div>
  ) : isStarted === true ? (
                        <div className='cursor-pointer  bg-[#FFCE84] px-2 py-2 text-center text-white rounded-[5px] w-[6.25vw] text-base-17-5'
      onClick={handleNavigate}
    >
      Continue
    </div>
  ) : (   <div className='cursor-pointer w-[6.25vw]  bg-[#FF7979] px-2 py-2 text-center text-white rounded-[5px] text-base-17-5'
      onClick={handleNavigate}
    >
      Start
    </div>
  )
}

        </div>
      </div>
    </div>
  );
};
