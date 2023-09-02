import React from "react";
import Chart from "../../../../components/Chart/Chart";
import styles from "../style.module.css";
import { useState } from "react";
import { useScoreProgressionStudentMutation } from "../../../../app/services/users";
import { useEffect } from "react";
const SPFrame3 = ({ userDetail, subjects }) => {
    const [scoreProgression,setProgression]= useState()
    const [getProgression,Progstatus]= useScoreProgressionStudentMutation()
    useEffect(()=>{
    if(userDetail?._id){
        getProgression({studentId:userDetail?._id,testType:"SAT"}).then((res)=>{
     console.log("progression",res)
        })
    }
    },[userDetail])
  return (
    <div className="flex flex-col gap-5">
      {" "}
      <div
        id={styles.chartContainer}
        className="!rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller "
      >
        <Chart
          setSubjects={[]}
          subjects={subjects}
          selectedSubject={[]}
          selectedConceptIdx={[]}
          setSelectedConceptIdx={[]}
          currentSubData={[]}
          setCurrentSubData={[]}
        />
      </div>
      <div
        id={styles.chartContainer}
        className="!rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller "
      >
        <Chart
          setSubjects={[]}
          subjects={subjects}
          selectedSubject={[]}
          selectedConceptIdx={[]}
          setSelectedConceptIdx={[]}
          currentSubData={[]}
          setCurrentSubData={[]}
        />
      </div>
      <div
        id={styles.chartContainer}
        className="!rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller "
      >
        <Chart
          setSubjects={[]}
          subjects={subjects}
          selectedSubject={[]}
          selectedConceptIdx={[]}
          setSelectedConceptIdx={[]}
          currentSubData={[]}
          setCurrentSubData={[]}
        />
      </div>
    </div>
  );
};

export default SPFrame3;
