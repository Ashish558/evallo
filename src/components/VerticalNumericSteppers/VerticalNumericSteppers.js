import React from "react";
import styles from "./style.module.css";

function VerticalNumericSteppers({
    className,
    labels,
    currentIndex,
    restrictedIndices,
}) {

    console.log(restrictedIndices);
    return (
        <div
            className={`flex flex-col items-center justify-between h-full w-full ${className}`}
        >
            {
                !(labels === undefined || labels === null || labels.length === 0) ?
                (
                    labels.map((item, index) => {
                        let isRestricted = false;
                        if(restrictedIndices && restrictedIndices.length > 0 && restrictedIndices.includes(index)) {
                            isRestricted = true;
                            console.log("restricted");
                            console.log(index);
                        }

                        return (
                            <React.Fragment key={index} >
                                <div className="flex flex-col items-center" >
                                    <div className={`aspect-square flex items-center justify-center rounded-[8px] align-middle text-[#fff] text-center w-[35px]
                                                     ${styles.numContainer}
                                                     ${isRestricted ? styles.restricted : ""}
                                                     ${currentIndex === index ? styles.currentIndex : ""}
                                    `}
                                    >
                                        <div
                                            className={`
                                                        ${currentIndex === index ? "text-[18px]" : " text-[14px]"}
                                            `}
                                        >
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className={`font-[100] text-[14px]
                                                    ${styles.label}
                                                    ${isRestricted ? styles.restricted : ""}
                                                    ${currentIndex === index ? styles.currentIndex : ""}
                                                     
                                    `} >{item}</div>
                                </div>
                                {
                                    index < labels.length - 1 ? (
                                        <div className={`border-l-[1px] mt-[5px] mb-[5px] grow
                                                         ${styles.verticalLine}
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