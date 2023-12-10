import React, { useEffect, useState } from 'react';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import Modal from '../../../components/Modal/Modal';
import SectionLoader from '../SectionLoader';
import { useNavigate } from 'react-router-dom';
export default function CurrentSection({ answers,activeSection, submitSection, submitBtnLoading }) {
  const [details, setDetails] = useState(answers);
  const [totalQues, setTotalQues] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [marked, setMarked] = useState(0);
  const [popUp, setPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  const navigate = useNavigate();

  useEffect(() => {
    let tempAttempted = 0;
    let tempMarked = 0;
    answers.map((answer) => {
      if (answer.isMarked) {
        tempMarked += 1;
      }
      if (answer.ResponseAnswer !== '') {
        tempAttempted += 1;
      }
      setAttempted(tempAttempted);
      setMarked(tempMarked);
      setTotalQues(details.length);
    });
  }, [answers]);

  const handleSubmission = () => { 
    setPopUp(true); 
  };

  const handleSubmitConfirm = () => {
  //  navigate('/section-loader');
  submitSection();    
  };

  return (
    <>
    <div className='min-h-[414px] mt-[21.25px] flex-1 flex flex-col mb-6 bg-white rounded w-full px-[32.5px] pt-[16.5px] pb-[23.75px]'>
      <p className='font-medium text-[#26435F] text-[20px] mb-1'>Total Questions: {totalQues}</p>
      <p className='font-medium text-[#38C980] text-[20px] mb-1'>Attempted: {attempted}</p>
      <p className='font-medium text-[#FF7979] text-[20px] mb-1'>Marked for Review: {marked}</p>
      <p className='font-medium text-[#FFCE84] text-[20px] mb-6'>Remaining: {totalQues-attempted}</p>
      
      <p className='font-light text-[#517CA8] text-[17.5px] mb-1'>Section Instructions:</p>
      <p className='font-light text-[#517CA8] text-[17.5px] leading-[31.25px] mb-1'>{activeSection.description}</p>
      </div>  
      <button className="mt-auto mb-4 w-[200px] rounded bg-[#38C980] h-[75px] text-[20px] font-semibold text-white"
        onClick={handleSubmission}>
        Submit Section
        </button>
      {isLoading && <SectionLoader />}
      {popUp && (
        <Modal
        classname="max-w-[700px] mx-auto"
        parentClass="flex flex-col justify-center items-center"
        topClass={"!h-[110%] !mt-0"}
        handleClose={() => setPopUp(false)}
          title="Are you sure you want to Submit the Section?"
          primaryBtn={{
            onClick: handleSubmitConfirm,
            text: "Yes",
            className: "!bg-[#38C980] w-[146.67px] h-[46.67px] ml-0 text-white",
            loading: submitBtnLoading,
          }}
        />
      )}
    </>
  );
}
