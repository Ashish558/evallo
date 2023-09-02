import React from "react";
import toggleRectIcon from "../../assets/icons/toggle-rect.svg";
import toggleRectActiveIcon from "../../assets/icons/toggle-rect-active.svg";
import toggleCircleIcon from "../../assets/icons/toggle-circle.svg";
import styles from "./style.module.css";

const ToogleBar = ({
    title,
    titleClassName,
    className,
    body,
    toggle,
    onToggle,
    circleColor
}) => {
    return (
        <div
            className={`rounded-2xl   ${className ? className : ""}
          `}
        >
            <div
                className={`text-primary-dark font-bold flex justify-between  ${titleClassName ? titleClassName : ""
                    }`}
            >
                <p className="">{title}</p>
                {toggle !== undefined && (
                    <div className="flex items-center border-[2px] border-[#26435F] rounded-[9px]">
                        <div
                            className={styles.toggleContainer}
                            onClick={() => onToggle(toggle.key, !toggle.value)}
                        >
                            <img
                                src={
                                    toggle.value === false ? toggleRectIcon : toggleRectIcon 
                                }
                                alt="toggle"
                            />
                           
                            <div
                                // src={toggleCircleIcon}
                                className={`${toggle.value === false
                                    ? (`${styles.toggleCircle} ${circleColor ? circleColor:'bg-[#4bd657]'} `)
                                    : (`${styles.toggleCircleActive} ${circleColor ? circleColor:'bg-[#FFA28D]'} `)
                                    }  w-[13px] h-[13px] rounded-[6px]`}
                                alt="toggle"
                            />
                        </div>
                    </div>
                )}
            </div>
            {body && body}
        </div>
    );
};

export default ToogleBar;