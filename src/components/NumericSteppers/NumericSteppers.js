import React from "react";
import styles from "./style.module.css";

export default function NumericSteppers({
  customFieldsPresents,
  fieldNames,
  totalSteps,
  currentStep,
  customFields,
  className,
}) {
  console.log({currentStep})

  return (
    <div
      className={`lg:mt-6 relative ${
        currentStep === 5 ? "mb-[30px]" : "mb-[30px]"
      } flex justify-between ${className ? className : ""} `}
    >
      {[...Array(totalSteps)].map((x, i) =>
        customFields?.length === 0 &&
        i === 2 + (customFieldsPresents ? 1 : 0) &&
        customFieldsPresents ? (
          ""
        ) : (
          <div key={i} className="flex flex-col justify-center items-center">
            <button
              key={i}
              className={`w-[36px] relative z-[5000] lg:block  h-[36px] bg-primary border rounded-full  font-medium
             ${
               i + 1 < parseInt(currentStep)
                 ? "!bg-[#FFA28D] before:!bg-[#FFA28D]  !text-white "
                 : ""
             } 
             ${
               i + 1 === parseInt(currentStep)
                 ? " !bg-[#24A3D9]  !text-white"
                 : ""
             } 
             ${
               i + 1 > parseInt(currentStep)
                 ? "   text-white !bg-[rgba(156,163,175,0.6)]"
                 : ""
             } 
             transition 
           
             ${
               totalSteps === 4 + (customFieldsPresents ? 1 : 0) &&
               i === 3 + (customFieldsPresents ? 1 : 0)
                 ? ""
                 : totalSteps === 3
                 ? styles.line2
                 : styles.line
             } 
             ${totalSteps === 2 ? styles.line4 : ""}
             ${i + 1 === totalSteps ? styles.line5 : ""}
             `}

              // onClick={() => handleClick(i + 1)}
            >
              <span className="relative z-[999999] text-white">{i + 1}</span>
            </button>

            <p
              className={`flex justify-center !tracking-wider  before:hidden items-center mt-2 mb-2 text-center text-[15px] font-semibold  
            ${i + 1 < parseInt(currentStep) ? "text-[#FFA28D]" : ""} 
             ${i + 1 === parseInt(currentStep) ? " text-[#24A3D9]  " : ""} 
             ${i + 1 > parseInt(currentStep) ? "opacity-60  text-gray-400" : ""}
             ${i + 1 === parseInt(currentStep) ? "text-[#24A3D9]  " : ""} 
             `}
            >
              {fieldNames ? fieldNames[i] : ""}{" "}
            </p>
          </div>
        )
      )}
      <div className="absolute top-[-23px] left-[-16.5%] w-screen">
        <div className="flex gap-0.5">
          {[...Array(totalSteps)].map((x, i) => (
            <div
              key={i}
              className={`w-1/3 h-[10px] lg:hidden border font-bold
               ${i + 1 < currentStep ? "bg-primary text-[#F3F5F7]" : ""} 
               ${
                 i + 1 === currentStep
                   ? "bg-[#D9D9D9] opacity-50 before:hidden text-primary"
                   : ""
               } 
               ${
                 i + 1 > currentStep
                   ? "opacity-50 before:hidden text-[#F3F5F7] bg-[#D9D9D9]"
                   : ""
               } 
               transition 
               `}

              // onClick={() => handleClick(i + 1)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
