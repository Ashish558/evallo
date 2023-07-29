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
        className={`text-primary-dark font-medium flex justify-between mb-5 ${titleClassName ? titleClassName : ""
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
          <div className="flex items-center">
            <p className="text-[#AAAAAA] text-xs mr-2">Show icons / images</p>
            <div
              className={styles.toggleContainer}
              onClick={() => onToggle(toggle.key, !toggle.value)}
            >
              <img
                src={
                  toggle.value === false ? toggleRectIcon : toggleRectActiveIcon
                }
                alt="toggle"
              />
              <img
                src={toggleCircleIcon}
                className={`${toggle.value === false
                  ? styles.toggleCircle
                  : styles.toggleCircleActive
                  }`}
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
