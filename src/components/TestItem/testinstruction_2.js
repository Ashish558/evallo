import React, { useState } from "react";
import BackBtn from "../Buttons/Back";
import PrimaryButton from "../Buttons/PrimaryButton";
import { TestDetail } from "../TestDetail/TestDetail";
import Modal from "../Modal/Modal";
import Warning from "../../assets/images/warning.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMonthName } from "../../utils/utils";

const Testinstruction_2 = ({
  setloader,
  setstarttestindex,
  starttestindex,
  testHeaderDetails,
  desc,
  timer,
  loader,
  setisntructionpage,
  testStarted,
  subjects,
  completedSectionIds,
  activeSection,
}) => {
  const formatDate2= (value)=>{
    const [ day, month, year] = value.split("-");
    const monthName = getMonthName(month-1);
    
    const formattedDate = `${day}` + "/" + `${month}` + `/` + `${year}`;
    return formattedDate
   }
  const [popup, setpopup] = useState(false);
  const navigate = useNavigate();
  const { organization } = useSelector((state) => state.organization);

  function closeinstruct() {
    setpopup(false);
    setisntructionpage(false);
  }
  const tasksWithCompletion = subjects.map((task) => ({
    ...task,
    completed: completedSectionIds.includes(task._id) ? true : false,
  }));
  //console.log({tasksWithCompletion,testHeaderDetails});
  return (
    <>
      {console.log("testName", loader)}
      <div className="w-[1920px] flex justify-center items-center">
      <div className="w-[1600px] relative">
        <p className="text-[#24A3D9] ml-8 !mt-[50px] !mb-[25px] text-base-20">
          <span onClick={() => navigate("/")} className="cursor-pointer">
            {organization?.company +
              "  >  " +
              testHeaderDetails?.name +
              "  >  "}
          </span>
          <span
            onClick={() => navigate("/all-tests")}
            className=" cursor-pointer"
          >
            {"Assignments > "}{" "}
          </span>
          <span className="font-semibold">{testHeaderDetails.testName}</span>
        </p>
        <p className="text-[#26435F] ml-8 text-[20px] font-bold mb-8">
          {testHeaderDetails.testName}
        </p>

        <div className="grid grid-cols-3 ml-4 min-w-full text-sm px-4 gap-y-4 mt-2">
          <div className="min-w-full grid grid-flow-col grid-rows-3 mr-3 justify-start items-start">
            <div className="min-w-full flex mb-3 justify-between">
              <div className="inline-block min-w-30 mr-4 font-medium text-[20px] text-[#517CA8] opacity-60">
                {" "}
                Student’s Name
              </div>

              <div className="inline-block w-1/2 font-light  text-[20px] text-[#517CA8]">
              {testHeaderDetails?.name?.length>18?testHeaderDetails?.name.substring(0,15)+' ...':testHeaderDetails?.name}
              </div>
            </div>
            <div className="w-full flex mb-3 justify-between">
              <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                {" "}
                Date Assigned{" "}
              </p>
           
              <p className="inline-block w-1/2 font-light  text-[20px] text-[#517CA8]">
                {formatDate2(testHeaderDetails.dateAssigned)}
              </p>
            </div>
            <div className="w-full flex mb-3 justify-between">
              <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                {" "}
                Duration{" "}
              </p>

              <p className="inline-block w-1/2 font-light  text-[20px] text-[#517CA8]">
                {testHeaderDetails.duration}
              </p>
            </div>
          </div>
          <div className=" grid grid-flow-col  grid-rows-3 mr-3 justify-start items-start">
            <div className="w-full flex mb-3 justify-between">
              <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                {" "}
                Due on{" "}
              </p>

              <p className="inline-block w-1/2 font-light  text-[20px] text-[#517CA8] ">
                {testHeaderDetails.dueDate ? formatDate2(testHeaderDetails.dueDate) : "-"}
              </p>
            </div>
            <div className="w-full flex mb-3 justify-between">
              <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                {" "}
                Started on{" "}
              </p>

              <p className="inline-block w-1/2 font-light  text-[20px] text-[#517CA8]">
                {testHeaderDetails.startedOn
                  ? formatDate2(testHeaderDetails.startedOn)
                  : "-"}
              </p>
            </div>
            <div className="w-full flex mb-3 justify-between">
              <p className="inline-block w-1/2 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                {" "}
                Completed on{" "}
              </p>

              <p className="inline-block w-[160px] font-light  text-[20px] text-[#517CA8]">
              {testHeaderDetails.completedOn
                  ? testHeaderDetails.completedOn
                  : "-"}
              </p>
            </div>
          </div>
          <div className="w-full flex mb-3 justify-between">
            <div className="flex flex-col">
              <p className="inline-block w-64 mr-4 font-medium  text-[20px] text-[#517CA8] opacity-60">
                {" "}
                Instruction from tutor{" "}
              </p>

              <p className="inline-block w-full font-light  text-[20px] text-[#517CA8]">
              {testHeaderDetails.instruction?.length
                  ? testHeaderDetails.instruction
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex relative w-fit flex-row gap-2 mx-4 mt-12 overflow-x-auto">
            {tasksWithCompletion.map((item, idx) => {
              return (
                <PrimaryButton
                  roundedClass="rounded-0"
                  children={item?.name}
                  onClick={() => {
                    setstarttestindex(idx);
                  }}
                  className={`pt-2 pb-2 px-0 mr-0 rounded-0 text-[17.5px] font-normal w-fit bg-transparent
                            ${!item.completed ? "text-[#26435F]" : ""} ${
                    idx === starttestindex
                      ? "text-[#FFA28D] border-b-2 border-b-[#FFA28D]"
                      : ""
                  } disabled:opacity-40`}
                  disabled={item.completed}
                />
              );
            })}
            <div className="bg-gray-300 absolute bottom-[0px] z-10 h-[1px] w-full"></div>
          </div>
          <div className="border shadow-lg border-1 bg-white pt-[60px] pr-8 pl-12 pb-[50px] m-4 relative">
            <div className="bg-[#24A3D9] absolute top-4 right-4 rounded px-4 flex items-center flex-col py-2">
              <p className="text-[15px] text-[#FFFFFF] font-medium">Time</p>
              <p className="text-[25px] text-[#FFFFFF] font-bold">
                {desc[starttestindex]?.timer >= 10
                  ? desc[starttestindex]?.timer + ":00"
                  : "0" + desc[starttestindex]?.timer + ":00"}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="text-[#26435F] text-[17.5] font-bold mb-4">
                Section Instructions:
              </p>
              <p className="text-[#26435F] text-[17.5] font-medium">
                Time: {desc[starttestindex]?.timer} minutes
              </p>
              <p className="text-[#26435F] text-[17.5] font-normal">
                {desc[starttestindex]?.description}
              </p>
            </div>

            <div className="flex items-start flex-col mt-16 relative">
              <div className="flex flex-row justify-start items-center bg-[#FF696133] py-2 px-5 rounded-20 mb-[15px]">
                <img src={Warning} />
                <p className="text-red-500 text-[15px] font-medium">Warning</p>
                <p className="text-[#FF6961] text-[15px] font-light">
                  : Once Started, you will not be able to pause the timer.
                </p>
              </div>
              <PrimaryButton
                children="Start Section"
                className="font-semibold h-[60px] text-[20px] text-[#FFFFFF] py-2 px-4 "
                onClick={() => {
                  setpopup(true);
                }}
              />
              {/* <PrimaryButton children='Start Section' className='w-[300px] h-[60px] text-[21px]' onClick={handleStartTest} /> */}
            </div>
          </div>
          {popup && (
            <div className="max-w-1/2 relative flex justify-center items-center h-full">
              {" "}
              <Modal
                classname="max-w-[700px] mx-auto"
                title="Note that the time will begin as soon as you start this section. make sure that you have everything set up."
                titleClassName="mr-4 mb-4 font-normal"
                primaryBtn={{
                  text: "Okay",
                  className: "bg-[#FF7979] w-[146.67px] h-[46.67px] ml-0 font-medium",
                  onClick: closeinstruct,
                }}
                handleClose={() => setpopup(false)}
              />
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Testinstruction_2;
