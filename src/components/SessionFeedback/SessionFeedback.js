import React, { useEffect, useState } from "react";
import styles from "./SessionFeedback.module.css";
import starGold from "./../../assets/icons/star-gold.png";
import starDark from "./../../assets/icons/star-dark.png";
import starLight from "./../../assets/icons/star-light.png";
import { TestItem } from "../TestItem/TestItem";
import { useLazyGetAssignedTestQuery } from "../../app/services/test";
import { getFormattedDate } from "../../utils/utils";

const SessionFeedback = () => {
   const [getTest, getTestResp] = useLazyGetAssignedTestQuery()
   const [allTests, setAllTests] = useState([])
   useEffect(() => {
      getTest()
         .then(res => {
            console.log('all-assigned-tests', res.data.data.test);
            let tempAllTests = res.data.data.test.map(test => {
               const { testId, studentId, dueDate, isCompleted, isStarted, createdAt } = test
               if(testId === null) return
               return {
                  testName: testId ? testId.testName : '-',
                  assignedOn: getFormattedDate(new Date(createdAt)),
                  studentId: studentId ? studentId : '-',
                  dueDate: getFormattedDate(new Date(test.dueDate)),
                  duration: test.timeLimit,
                  status: isCompleted === true ? 'completed' : isStarted ? 'started' : 'notStarted',
                  scores: '-',
                  _id: test._id,
                  pdfLink: testId ? testId.pdf : null,
                  testId: testId ? testId._id : '-',
                  isCompleted: test.isCompleted,
                  isStarted: test.isStarted,
               }
            })
            let sortedArr = tempAllTests.sort(function (a, b) {
               return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setAllTests(sortedArr.filter(item => item !== undefined))
         })

   }, [])
   // console.log('all-tests', allTests);

   return (
      <div id={styles.sessionFeedbackContainer} className="h-[382px] bg-white w-10/12 py-[21px] mt-[33px] rounded-[20px]">
         <div id={styles.sessionFeedback} className="bg-white px-[28px] rounded-[20px] h-full overflow-y-auto">
            {/* {/* <TestItem name="name" status="due date" date="june 20, 2022" action="Start" marks="1250/1250" /> */}

            {allTests.map(test => {
               return <TestItem key={test._id} {...test} />
            })}
            {/* <TestItem name="SAT Series #01" status="due date" date="june 20, 2022" action="Continue" />
            <TestItem name="Ex. Starte" status="due date" date="june 20, 2022" action="Start" marks="1250/1250" />
            <TestItem name="SAT B2" status="Completed" date="june 20, 2022" /> */}


         </div>
      </div>
   );
};

export default SessionFeedback;
