import React from "react";
import styles from "./SessionFeedback.module.css";
import starGold from "./../../assets/icons/star-gold.png";
import starDark from "./../../assets/icons/star-dark.png";
import starLight from "./../../assets/icons/star-light.png";
import { TestItem } from "../TestItem/TestItem";

const SessionFeedback = () => {
    return (
        <div id={styles.sessionFeedbackContainer} className="h-[382px] bg-white w-10/12 py-[21px] mt-[33px] rounded-[20px]">
            <div id={styles.sessionFeedback} className="bg-white px-[28px] rounded-[20px] h-full overflow-y-auto">
                {/* <TestItem name="name" status="due date" date="june 20, 2022" action="Start" marks="1250/1250" />
                <TestItem name="SAT Series #01" status="due date" date="june 20, 2022" action="Continue" />
                <TestItem name="Ex. Starte" status="due date" date="june 20, 2022" action="Start" marks="1250/1250" />
                <TestItem name="SAT B2" status="Completed" date="june 20, 2022" /> 
               */}

            </div>
        </div>
    );
};

export default SessionFeedback;
