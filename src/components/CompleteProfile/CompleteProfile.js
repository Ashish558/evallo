import React, { useState } from "react";
import styles from "./CompleteProfile.module.css";
import arrow from "./../../assets/icons/arrow-down.png";
import { ListData } from "../ListData/ListData";

const CompleteProfile = () => {
    const [profileProgress, setProfileProgress] = useState("65%");

    return (
        <div id={styles.completeProfile} className="lg:w-10/12">
            <div
                className="flex items-center"
                id={styles.completeProfileHeader}
            >
                <h1>Complete your Profile</h1>
                <img src={arrow} id={styles.arrowRight} alt="" />
            </div>

            <div id={styles.profileHeader}>
                <h2>Profile Status</h2>
                <h2>65%</h2>
            </div>

            <div id={styles.statusContainer}>
                <div
                    id={styles.statusBar}
                    style={{ width: profileProgress }}
                ></div>
            </div>
{/* 
            <div id={styles.practiceTest}>
                <h1>Practice Tests</h1>

                <div id={styles.practiceTestContainer}>
                    <ListData />
                </div>
            </div> */}
        </div>
    );
};

export default CompleteProfile;
