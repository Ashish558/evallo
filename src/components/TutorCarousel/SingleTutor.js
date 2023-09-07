import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTutorDetails } from "../../hooks/useTutorDetails";
import styles from "./TutorCarousel.module.css";

export default function SingleTutor({ idx, tutor }) {
  const navigate = useNavigate();
  const { awsLink } = useSelector((state) => state.user);

  return (
    <div key={idx} className="item px-4 h-full">
      <div className="flex items-center gap-5 my-auto justify-center">
        <div className="w-2/3">
          <h5 className={`${styles.tag}`}>
            {tutor.tutorLevel && `${tutor.tutorLevel} Belt`}
          </h5>
          <p>{tutor?.education}</p>
          <h3 className="mt-0 mb-1 mt-2 text-[#517CA8]">
            {" "}
            {`${tutor.firstName} ${tutor.lastName}`}{" "}
          </h3>
          <p className="text-[#517CA8]">
            {tutor?.tagLine ? tutor?.tagLine : "Test Prep Math Tutoring"}
          </p>
          <button
            className="p-2 mt-5 rounded-lg whitespace-nowrap text-sm px-4 bg-[#FFA28D] text-white"
            onClick={() => tutor._id && navigate(`/profile/tutor/${tutor._id}`)}
          >
            View Profile
          </button>
        </div>

        <div className="relative translate-x-[30%] design:translate-x-[20%] -mt-4">
          <img
            src={
              tutor.photo ? `${awsLink}${tutor.photo}` : "/images/default.jpeg"
            }
            className="absolute z-[500] left-[-15px] top-[8.2px] design:top-[6px] rounded-full w-[70px] h-[95px] design:!w-[100px] design:!h-[100px] object-cover shrink-0"
            alt=""
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
           
            className="z-5000 rotate-[0.7deg]"
            width="100"
            height="112"
            viewBox="0 0 108 144"
            fill="none"
          >
            <path
              d="M1.08485 11.1823C11.5308 5.14155 23.363 1.90312 35.4341 1.78098C47.5053 1.65883 59.406 4.65711 69.9823 10.4851C80.5587 16.3132 89.4518 24.7732 95.7996 35.045C102.147 45.3168 105.734 57.0519 106.213 69.1125C106.691 81.1731 104.045 93.15 98.5308 103.882C93.0163 114.614 84.8207 123.737 74.7387 130.367C64.6566 136.996 53.0301 140.907 40.9863 141.721C28.9425 142.534 16.8902 140.223 5.99775 135.01"
              stroke="#26435F"
              strokeWidth="3.19966"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
