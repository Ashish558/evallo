import React from "react";

function VerticalNumericSteppers({
    className,
    labels,
    currentIndex,
}) {
    return (
        <div
            className={`flex flex-col items-center justify-between h-full w-full ${className}`}
        >
            {
                !(labels === undefined || labels === null || labels.length === 0) ?
                (
                    labels.map((item, index) => {
                        return (
                            <React.Fragment key={index} >
                                <div className="flex flex-col items-center" >
                                    <div className={`aspect-square flex items-center justify-center rounded-[8px] align-middle text-[#fff] text-center w-[35px]
                                                     ${currentIndex === index ? "bg-[#24A3D9]" : "bg-[#B3BDC7]"}
                                                     ${currentIndex === index ? "shadow-[0px_0px_20px_rgba(36,163,217,0.25)]" : ""}
                                                     ${currentIndex === index ? "w-[40px]" : ""}
                                    `}>
                                        <div
                                            className={`
                                                        ${currentIndex === index ? "text-[18px]" : " text-[14px]"}
                                            `}
                                        >
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className={`font-[100] text-[14px]
                                                     ${currentIndex === index ? "text-[#24A3D9]" : " text-[#B3BDC7]"}
                                    `} >{item}</div>
                                </div>
                                {
                                    index < labels.length - 1 ? (
                                        <div className={`border-l-[1px] mt-[5px] mb-[5px] grow
                                                         ${currentIndex === index ? "border-[#24A3D9]" : "border-[#B3BDC7]"}
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