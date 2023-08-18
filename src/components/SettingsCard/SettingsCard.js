import React from "react";
import toggleRectIcon from "../../assets/icons/toggle-rect.svg";
import toggleRectActiveIcon from "../../assets/icons/toggle-rect-active.svg";
import toggleCircleIcon from "../../assets/icons/toggle-circle.svg";
import styles from "./style.module.css";
import QuestionMark from '../../assets/images/question-mark.svg'

export default function SettingsCard({
  title,
  titleClassName,
  className,
  body,
  toggle,
  onToggle,
}) {
  return (
    <div
      className={`rounded-2xl py-4  mb-5 pb-4 ${className ? className : ""}
      `}
    >
      <div
        className={`text-primary-dark font-medium flex justify-between mb-1 ${titleClassName ? titleClassName : ""
          }`}
      >
        <div className="flex items-center">
          <p className="">{title}</p>
          <div>
            {
              title === "Edit Announcements" || <img className="ml-3" src={QuestionMark} alt="" />
            }
          </div>
        </div>
        {toggle !== undefined && (
                    <div className="flex items-center  rounded-[9px]">
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
                            {
                                
                            }
                            <div
                                // src={toggleCircleIcon}
                                className={`${toggle.value === false
                                    ? styles.toggleCircle
                                    : styles.toggleCircleActive
                                    }  w-[16px] h-[16px] rounded-[10px]`}
                                alt="toggle"
                            />
                        </div>
                    </div>
                )}
      </div>
      {body && body}
    </div>
  );
}
