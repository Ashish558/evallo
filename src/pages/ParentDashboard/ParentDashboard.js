import React from "react";
import { useState } from "react";
import ConceptSection from "../../components/ConceptSection/ConceptSection";
import ParentDashboardHeader from "../../components/ParentDashboardHeader/ParentDashboardHeader";
import styles from "./ParentDashboard.module.css";

const ParentDashboard = () => {
   const [selectedStudent, setSelectedStudent] = useState(null);

    return (
        <div
            id={styles.ParentDashboardContainer}
            className="flex-auto overflow-x-hiden !mx-[calc(160*0.0522vw)]"
        >
            <ParentDashboardHeader selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
            <ConceptSection selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
        </div>
    );
};

export default ParentDashboard;
