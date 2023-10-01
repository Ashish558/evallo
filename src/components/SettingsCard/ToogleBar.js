import React from "react";
import toggleRectIcon from "../../assets/icons/toggle-rect.svg";
import toggleRectActiveIcon from "../../assets/icons/toggle-rect-active.svg";
import toggleCircleIcon from "../../assets/icons/toggle-circle.svg";
import styles from "./style.module.css";
import { useState } from "react";

const ToogleBar = ({
    title,
    titleClassName,
    className,
    body,
    toggle,
    manual,
    boxClass,
    onToggle,
    circleColor
}) => {
    const [set,unset]=useState(true)
    
    if(!manual)
    return (
        <div
            className={`rounded-3xl   ${className ? className : ""}
          `}
        >
            <div
                className={`text-primary-dark font-bold flex justify-between   ${titleClassName ? titleClassName : ""
                    }`}
            >
                <p className="">{title}</p>
                {toggle !== undefined && (
                    <div >
                        <div
                            className={`flex items-center h-[17px] w-[26px]  border-[2px] px-[2px] border-[#26435F] rounded-[20px] ${toggle.value === false?"justify-start":"justify-end"} ${boxClass}`}
                            onClick={() => onToggle(toggle.key, !toggle.value)}
                        >
                           
                           
                            <div
                                // src={toggleCircleIcon}
                                className={`${toggle.value === false
                                    ? (` ${circleColor ? circleColor:'bg-[#FF7979]'} `)
                                    : (` ${circleColor ? circleColor:'bg-[#4bd657]'} `)
                                    }  w-[9px] h-[9px]  rounded-[8px] inline-block`}
                                
                            />
                        </div>
                    </div>
                )}
            </div>
            {body && body}
        </div>
    );
   //console.log("================================",set)
if(manual){
    return (
        <div
            className={`rounded-3xl   ${className ? className : ""}
          `}
        >
            <div
                className={`text-primary-dark font-bold flex justify-between   ${titleClassName ? titleClassName : ""
                    }`}
            >
                <p className="">{title}</p>
                {toggle !== undefined && (
                    <div >
                        <div
                            className={`flex items-center h-[17px] w-[26px]  border-[2px] px-[2px] border-[#26435F] rounded-[20px] ${set === false?"justify-start":"justify-end"} ${boxClass}`}
                            onClick={() => unset((prev)=>!prev)}
                        >
                           
                           
                            <div
                                // src={toggleCircleIcon}
                                className={`${set === false
                                    ? 'bg-[#FF7979]'
                                    :'bg-[#4bd657]'
                                    }  w-[9px] h-[9px]  rounded-[8px] inline-block`}
                                
                            />
                        </div>
                    </div>
                )}
            </div>
            {body && body}
        </div>
    );
}


};

export default ToogleBar;