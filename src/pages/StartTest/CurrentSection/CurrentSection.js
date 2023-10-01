import React, { useEffect, useState } from 'react';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import Modal from '../../../components/Modal/Modal';
import SectionLoader from '../SectionLoader';
import { useNavigate } from 'react-router-dom';
export default function CurrentSection({ answers, submitSection, submitBtnLoading }) {
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
   navigate('/section-loader');
    
  };

  return (
    <div className='mt-10 flex-1 flex flex-col'>
      <p className='font-semibold mb-1'>Total Questions: {totalQues}</p>
      <p className='font-semibold mb-1'>Attempted: {attempted}</p>
      <p className='font-semibold mb-1'>Marked for Review: {marked}</p>
      <PrimaryButton
        children="Submit Section"
        className="mt-auto mb-4 w-[300px] h-[60px] text-[21px]"
        onClick={handleSubmission}
      />
      {isLoading && <SectionLoader />}
      {popUp && (
        <Modal
          classname="w-1/2 mx-auto"
          handleClose={() => setPopUp(false)}
          title="Are you sure you want to Submit the Section?"
          primaryBtn={{
            onClick: handleSubmitConfirm,
            text: "Submit",
            className: "bg-primaryDark",
            loading: submitBtnLoading,
          }}
        />
      )}
    </div>
  );
}
