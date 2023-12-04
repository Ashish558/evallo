import React from "react";
import styles from "./style.module.css";

export default function NumericSteppers({
  customFieldsPresents,
  fieldNames,
  totalSteps,
  currentStep,
  customFields,
  className,
  NumericStepperfontSize
}) {

  return (
    <div
      className={`lg:mt-6 relative ${
        currentStep === 5 ? "mb-[30px]" : "mb-[30px] mx-5"
      } flex justify-between items-start ${className ? className : ""} `}
    >
      {[...Array(totalSteps)].map((x, i) =>
        customFields?.length === 0 &&
        i === 2 + (customFieldsPresents ? 1 : 0) &&
        customFieldsPresents ? (
          ""
        ) : (
          <div key={i} className={`flex flex-col justify-center items-center ${totalSteps===4?"!w-[165px]":""}`}>
            <button
              key={i}
              className={`w-[40px] relative z-[5000] lg:block  h-[40px] bg-primary border rounded-full flex justify-center items-center font-medium
             ${
               i + 1 < parseInt(currentStep)
                 ? i+2===currentStep?"!bg-[#FFA28D] before:!bg-[#FFA28D]  !text-white ":"!bg-[#FFA28D] before:!bg-[#FFA28D]  !text-white "
                 : ""
             } 
             ${
               i + 1 === parseInt(currentStep)
                 ? " !bg-[#24A3D9]   !text-white"
                 : ""
             } 
             ${
               i + 1 > parseInt(currentStep)
                 ? "   text-white !bg-[#26435F] opacity-20"
                 : ""
             } 
             transition 
           
             ${
              totalSteps === 2 ? styles.line4 : totalSteps === 4 + (customFieldsPresents ? 1 : 0) &&
               i === 3 + (customFieldsPresents ? 1 : 0)
                 ? ""
                 : totalSteps === 3
                 ? styles.line2
                 : styles.line
             } 
            
             ${i + 1 === totalSteps ? styles.line5 : ""}
             `}

              // onClick={() => handleClick(i + 1)}
            >
              <span className="relative z-[999999] text-white text-base-17-5">{i + 1}</span>
            </button>

            <p
                className={`flex justify-center !tracking-wider  before:hidden items-center mt-2 mb-2 text-center ${NumericStepperfontSize} font-medium  
            ${i + 1 < parseInt(currentStep) ? "text-[#FFA28D]" : ""} 
             ${i + 1 === parseInt(currentStep) ? " text-[#24A3D9]  " : ""} 
             ${i + 1 > parseInt(currentStep) ? "opacity-20  text-[#26435F]" : ""}
             ${i + 1 === parseInt(currentStep) ? "text-[#24A3D9]  " : ""} 
             `}
            >
              {fieldNames ? fieldNames[i] : ""}{" "}
            </p>
          </div>
        )
      )}
      <div className="hidden absolute top-[-23px] left-[-16.5%] w-screen">
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
