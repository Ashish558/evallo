import React from "react";
import styles from "./style.module.css";

function VerticalNumericSteppers({
    className,
    labels,
    currentIndex,
    restrictedIndices,
    completedIndices,
    incompleteIndices,
    onStepClicked,
}) {

    return (
        <div
            className={`flex flex-col items-center justify-between h-full w-full ${className}`}
        >
            {
                !(labels === undefined || labels === null || labels.length === 0) ?
                (
                    labels.map((item, index) => {
                        let isRestricted = false;
                        let isIncomplete = false;
                        if(restrictedIndices && restrictedIndices.length > 0 && restrictedIndices.includes(index)) {
                            isRestricted = true;
                            console.log("restricted");
                            console.log(index);
                        }

                        if(incompleteIndices && incompleteIndices.length > 0 && incompleteIndices.includes(index)) {
                            isIncomplete = true;
                            console.log("incomplete");
                            console.log(index);
                        }

                        return (
                            <React.Fragment key={index} >
                                <div 
                                    className={`flex flex-col items-center 
                                                ${isRestricted ? "" : "hover:cursor-pointer"}
                                    `}
                                    onClick={() => {
                                        if(isRestricted) return;
                                        if(onStepClicked.constructor && onStepClicked.constructor.name ) {
                                            onStepClicked(index);
                                        }
                                    }} 
                                >
                                    <div className={`aspect-square flex items-center justify-center rounded-[8px] align-middle text-[#fff] text-center w-[35px]
                                                     ${styles.numContainer}
                                                     ${isRestricted ? styles.restricted : currentIndex > index && !isIncomplete ? styles.completed : ""}
                                                     ${currentIndex === index ? styles.currentIndex : ""}
                                                     
                                    `}
                                    >
                                        <div
                                            className={`
                                                        ${currentIndex === index ? "text-[30px]" : " text-[20px]"}
                                            `}
                                        >
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className={`font-[100] text-[18px]
                                                    ${styles.label}
                                                    ${isRestricted ? styles.restricted : currentIndex > index && !isIncomplete ? styles.completed : ""}
                                                    ${currentIndex === index ? styles.currentIndex : ""}
                                                    ${currentIndex === index ? "text-[22px]" : ""}
                                                     
                                    `} >{item}</div>
                                </div>
                                {
                                    index < labels.length - 1 ? (
                                        <div className={`border-l-[1px] mt-[5px] mb-[5px] grow
                                                         ${styles.verticalLine}
                                                         ${isRestricted ? styles.restricted : currentIndex > index && !isIncomplete ? styles.completed : ""}
                                                         ${currentIndex === index ? styles.currentIndex : ""}
                                        `} >
                                        </div>
                                    ) : (<></>)
                                }
                            </React.Fragment>
                        )
                    })
                ) : (<></>)
            }
        </div>
    )
}

export default VerticalNumericSteppers;