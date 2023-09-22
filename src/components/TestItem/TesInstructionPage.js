
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


const TestInstructionPage = ({ setisntructionpage }) => {
  const navigate = useNavigate();
  const { id, assignedTestId } = useParams();

  const handleNextClick = () => {
   
    setisntructionpage(false)
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 border rounded-lg shadow-md w-[80%] max-w-[400px] text-left relative">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">Practice Test</h2>
        </div>
        <div className="text-lg font-bold">Timing</div>
        <p className="text-gray-700">
          Full-length practice tests are timed like real exams, but you can save and exit the test any time. If you continue on a different device, you'll need to start over.
        </p>
        <div className="text-lg font-bold mt-4">Scores</div>
        <p className="text-gray-700">
          When you finish the practice test, go to My Practice to see your scores and get personalized study tips.
        </p>
        <div className="text-lg font-bold mt-4">Assistive Technology</div>
        <p className="text-gray-700">
          If you use assistive technology, you should try it out on the practice test so you know what to expect on test day.
        </p>
        <div className="text-lg font-bold mt-4">No Lockdown Mode</div>
        <p className="text-gray-700">
          We don't lock down practice tests. On test day, Dsat prevents you from accessing other programs or apps.
        </p>
        <div className="mt-4 flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-600"
          >
            Back
          </button>
          <button
            onClick={handleNextClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInstructionPage;
