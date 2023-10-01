import React from "react";
import toggleRectIcon from "../../assets/icons/toggle-rect.svg";
import toggleRectActiveIcon from "../../assets/icons/toggle-rect-active.svg";
import toggleCircleIcon from "../../assets/icons/toggle-circle.svg";
import styles from "./style.module.css";
import QuestionMark from '../../assets/images/question-mark.svg'
import ToogleBar from "./ToogleBar";

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
    className={`${className ? className : ""} py-4  mb-5 pb-4 rounded-2xl
    `}
    >
      <div
        className={`text-primary-dark font-medium flex justify-between mb-1 ${titleClassName ? titleClassName : ""
          }`}
      >
        <div className="flex items-center">
          <p className="text-[#26435F]">{title}</p>
          <div>
            {
              title === "Edit Announcements" || <img className="ml-3" src={QuestionMark} alt="" />
            }
          </div>
        </div>
        {
          title == "Edit Announcements" || <div>
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
        }
      </div>
      {
        title == "Edit Announcements" || <div> {body && body}</div>
      }

      <div>
        {
          title == "Edit Announcements" &&

          <div>
            { false&&
            <div className="flex items-center bg-white rounded-tl-5 rounded-tr-5 pt-4">
              <div className="text-[#24A3D9] mr-3 pl-4 text-base-17-5">
                Show Announcement Images
              </div>
              <div>
                
                {toggle !== undefined && (
                
                  <div >
                  <div
                      className={`flex items-center h-[17px] w-[26px]  border-[2px] px-[2px] border-[#26435F] rounded-[20px] ${toggle.value === false?"justify-start":"justify-end"} `}
                      onClick={() => onToggle(toggle.key, !toggle.value)}
                  >
                     
                     
                      <div
                          // src={toggleCircleIcon}
                          className={`${toggle.value === false
                              ? (` ${false ? false:'bg-[#FF7979]'} `)
                              : (` ${false ? false:'bg-[#4bd657]'} `)
                              }  w-[9px] h-[9px]  rounded-[8px] inline-block`}
                          
                      />
                  </div>
              </div>
                )}
              </div>
            </div>}
            {body && body}
          </div>
        }
      </div>

    </div>
  );
}
