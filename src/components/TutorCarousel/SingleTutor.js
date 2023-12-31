import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTutorDetails } from "../../hooks/useTutorDetails";
import styles from "./TutorCarousel.module.css";
import left from "../../assets/YIcons/VectorleftParent.svg";
import right from "../../assets/YIcons/VectorrightParent.svg";
export default function SingleTutor({turorsLength, idx, tutor, handlePrev,handleNext}) {
  const navigate = useNavigate();
  const { awsLink } = useSelector((state) => state.user);
  console.log(turorsLength,'turorsLength')
  return (

    <div key={idx} className="item px-2 h-full  ">
      <div className="flex h-full items-center my-auto justify-between">

        <div className="w-2/3 mb-3 relative z-5000">
          {/* <h5 className={`${styles.tag}`}>
            {tutor.tutorLevel && `${tutor.tutorLevel} Belt`}
          </h5>
          <p>{tutor?.education}</p> */}
          <h3 className=" text-[#26435F] text-[22.5px] leading-4 font-semibold">
            {" "}
            {`${tutor.firstName} ${tutor.lastName}`}{" "}
          </h3>
          <div className="w-full h-32 flex flex-col flex-1 flex-grow-1 justify-between items-start gap-[21.5px] mt-[25.5px]">
          
          <div className="flex flex-col justify-start items-start gap-[5px]">
          <p className="text-[#517CA8] text-[17.5px] leading-[22px]">
                {tutor?.tagLine ?
                  tutor?.tagLine.length > 50 ?
                    `${tutor?.tagLine.slice(0, 50)}...` : tutor?.tagLine :
                  ''}
          </p>
          <p className="text-[#517CA8]  text-[17.5px] leading-[19px]">
            {tutor?.topic ? tutor?.topic : "No topic"}
          </p>
          </div>

          <button
            className="p-2 rounded-lg whitespace-nowrap text-sm px-4 bg-[#FFA28D] text-white"
            onClick={() => tutor._id && navigate(`/profile/tutor/${tutor._id}`)}
          >
            View Profile
          </button>
          </div>
        </div>
        <div className="h-fit pt-3 absolute right-[26px] top-0" >
          <div className="relative mt-[-10px]">
            <img
              src={
                tutor.photo ? `${awsLink}${tutor.photo}` : "/images/tutorDefault.svg"
              }
              className="absolute z-[500] left-[-15px] top-[6.2px] rounded-full w-[127.9px] h-[127.9px] object-cover shrink-0 border-2 border-[#26435F]"
              alt=""
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"

              className="z-[-1] rotate-[0.7deg]"
              width="127"
              height="142"
              viewBox="1 .5 100 143"
              fill="none"
              style={{zIndex: '-1'}}
            >
              <path
                d="M1.08485 11.1823C11.5308 5.14155 23.363 1.90312 35.4341 1.78098C47.5053 1.65883 59.406 4.65711 69.9823 10.4851C80.5587 16.3132 89.4518 24.7732 95.7996 35.045C102.147 45.3168 105.734 57.0519 106.213 69.1125C106.691 81.1731 104.045 93.15 98.5308 103.882C93.0163 114.614 84.8207 123.737 74.7387 130.367C64.6566 136.996 53.0301 140.907 40.9863 141.721C28.9425 142.534 16.8902 140.223 5.99775 135.01"
                stroke="#26435F"
                strokeWidth="3.19966"
              />
            </svg>

          </div>
          {
            turorsLength>=2 && <span className="flex px-9 pt-2 gap-2">
            <span><img onClick={handlePrev} src={left} className="w-2 h-3 m-0 p-0 cursor-pointer" alt="left"/></span>
            <span><img onClick={handleNext} src={right} className="w-2 h-3 m-0 p-0 cursor-pointer" alt="right"/></span>
          </span>
          }
        </div>
      </div>
    </div>
  );
}
