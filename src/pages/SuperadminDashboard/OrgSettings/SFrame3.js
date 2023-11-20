import React, { useState } from "react";

import { useEffect } from "react";

let signupData = [
  {
    label: "First Name",
    key: "firstName",
  },
  {
    label: "Last Name",
    key: "lastName",
  },
  {
    label: "Email",
    key: "email",
  },
  {
    label: "Phone",
    key: "phone",
  },

  {
    label: "Are You A Company or Individual?",
    key: "registrationAs",
  },
  {
    label: "Country ",
    key: "country",
  },
  {
    label: "State",
    key: "state",
  },
  {
    label: "City",
    key: "city",
  },
  {
    label: "What Service(S) Are You Seeking?",
    key: "solutionYouAreLookingFor",
  },
  
  {
    label: "Student Served",
    key: "studentServed",
  },
  {
    label: "Subject tutoring",
    key: "subjectTutoring",
  },
  {
    label: "Test Preparation",
    key: "testPreparation",
  },
  {
    label: "Specialization",
    key: "specialization",
  },
  {
    label: "Coaching",
    key: "coaching",
  },
  {
    label: "Format Of Instruction",
    key: "formatOfInstruction",
  },
  {
    label: "Hear About Us From?",
    key: "hearAbout",
  },
];
const SPFrame3 = ({ userDetail }) => {


  console.log("frame1 Stud", { userDetail });
  return (
    <div className="flex w-full justify-between pl-[5%]">
      
 
          <div className="bg-white  py-3   flex flex-col flex-1 !h-full overflow-y-auto custom-scroller    ">
            {signupData?.map((it, id) => {
              return (
                <p key={id} className="flex gap-3 my-2 text-base-17-5">
                  <span className="text-[#517CA8] font-semibold">
                    {" "}
                    {it.label}{" "}
                  </span>
                  <span>:</span>

                  <span className="text-[#517CA8] font-medium">
                    {it?.key ?Array.isArray(userDetail[it.key])?userDetail[it.key]?.map((ix,n)=>{
                      return (
                        <span > {ix} {n!==userDetail[it.key]?.length-1?" , ":""} </span>
                      )
                    }): userDetail[it.key] : it?.default}
                  </span>
                </p>
              );
            })}
          </div>
       
     
    </div>
  );
};

export default SPFrame3;
