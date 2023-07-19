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
                    <div className="flex items-center">
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
};

export default ToogleBar;