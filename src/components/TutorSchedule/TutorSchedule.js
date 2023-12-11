import React from "react";
import { useNavigate } from "react-router-dom";
import calendar from "../../assets/images/uiw_date.png";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../utils/utils";

export default function TutorSchedule({
  service,
  date,
  studentName,
  time,
  timeZone,
  session,
  _id,
  handleLinkClick,
  specialization,
}) {
  const { dateFormat } = useSelector((state) => state.user);
  const startTime = time.start;
  const endTime = time.end;
  let startDate = new Date(date);
  let dateStr = `${startDate.getDate()}  ${startDate.toLocaleString("default", {
    month: "short",
  })} ${startDate.getFullYear()}`;

  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/calendar/edit/${_id}`);
  };

  return (
    <div className="w-full bg-[#F5F8FA] shadow-[0px_0px_2.6px_0px_rgba(0,0,0,0.25)]">
      <div className="flex  rounded-[5.333px] pt-[25px] pb-[18.75px] pl-[48px] pr-[152.83px]">
        <div className="mr-[169.8px]">
          <p className="text-[#24A3D9] font-medium text-[20.003px] ">
            {studentName}
          </p>
          <div className=" text-[#26435F] text-[17.05px] mt-[10px] flex w-[135px]">
            {service} | {specialization}
       
          </div>
        </div>
        <div className="flex flex-row justify-start items-center mr-[92px]" >
          <div className="h-full flex justify-start items-start mr-[16.25px] pt-[9px]">
          
              <img width="25px" height={`25px`} src={calendar} alt="" />
           
          </div>
          <div className=" flex flex-col justify-start items-start">
            <div className="text-[#517CA8] text-[17.503px]">
              {getFormattedDate(dateStr, dateFormat)}
            </div>
            <div className=" font-bold text-[#517CA8] mt-[10px] text-[17.503px]">

              {startTime.time} {startTime.timeType} {"-"} {endTime.time}{" "}
              {endTime.timeType} ({timeZone})
 
            </div>
          </div>
        </div>
        <div>
          <div>
            <button
              className="bg-[#FFA28D] text-[15.002px]   rounded-5 px-[16px] py-[15px] text-white w-[136px] h-[43.8px] flex justify-center items-center"
              onClick={() => handleLinkClick(session)}
            >
              Meeting Link
            </button>
          </div>
          <div className="mt-[10px]">
            <button
              className="bg-[#667085] text-[15.002px] rounded-5 pl-[25px] pr-[23px] py-[13.75px]  text-white w-[136px] h-[43.8px] flex justify-center items-center"
              onClick={handleEdit}
            >
              Edit Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  //     return <><div className='flex flex-col'>
  //    <p className='text-primary text-2xl font-bold mb-4'> {service} </p>
  //    <p> With {studentName} </p>
  // </div>
  // <div className='flex flex-col justify-center'>
  //    <p className='text-sm font-semibold mb-7'> {dateStr} </p>
  //    <p className='text-sm font-semibold'>
  //       {startTime.time} {startTime.timeType} {'-'} {endTime.time} {endTime.timeType} ({timeZone})
  //    </p>
  // </div>
  // <div className='flex flex-col justify-center'>
  //    <button className='bg-[#DFDFDF]  font-semibold text-sm rounded-[6px] px-4 py-[10px] text-black mb-[7px]' onClick={handleEdit} >
  //       Edit Session
  //    </button>
  //    <button className='bg-primaryOrange font-semibold text-sm rounded-[6px] px-4 py-[10px] text-white' onClick={() => handleLinkClick(session)} >
  //       Meeting Link
  //    </button>
  // </div> </>
}
