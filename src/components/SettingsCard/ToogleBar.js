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
                className={`text-primary-dark font-bold flex justify-between   ${titleClassName ? titleClassName : ""
                    }`}
            >
                <p className="">{title}</p>
                {toggle !== undefined && (
                    <div className="flex items-center border-[2px] border-[#26435F] rounded-[15px]">
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
                                    ? (`${styles.toggleCircle} ${circleColor ? circleColor:'bg-[#FF7979]'} `)
                                    : (`${styles.toggleCircleActive} ${circleColor ? circleColor:'bg-[#4bd657]'} `)
                                    }  w-[12.7px] h-[12.7px] rounded-[6px]`}
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