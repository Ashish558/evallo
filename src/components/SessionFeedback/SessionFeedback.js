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
   const [awsLink, setAwsLink] = useState('')
   useEffect(() => {
      getTest()
         .then(res => {
            console.log('all-assigned-tests', res.data);
            setAwsLink(res.data.data.baseLink)
            
            let tempAllTests = res.data.data.test.map(test => {
               const { testId, studentId, dueDate, isCompleted, isStarted, createdAt, updatedAt } = test
               if (testId === null) return
               return {
                  testype: testId ? testId.testType : '-',
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
                  updatedAt,
                  assignedTestId: test._id
               }
            })
            let sortedArr = tempAllTests.sort(function (a, b) {
               return new Date(b.updatedAt) - new Date(a.updatedAt);
            });
            setAllTests(sortedArr.filter(item => item !== undefined))
         })

   }, [])
   // console.log('all-tests', allTests);

   return (
      <div>
         <p className="mt-[5px] !text-xl !font-bold !text-[#26435F]" >Assigned Tests</p>
         <div id={styles.sessionFeedbackContainer} className="mt-[10px] shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller h-[383px] bg-white  py-[21px] !rounded-md">
            <div id={styles.sessionFeedback} className="bg-white px-[10px] custom-scroller !rounded-md h-full overflow-y-auto">
               {/* {/* <TestItem name="name" status="due date" date="june 20, 2022" action="Start" marks="1250/1250" /> */}
{console.log(allTests,'asdavhdvavdyajsvdjas jd as dhas ds h')}
               {allTests.map(test => {
                  return <TestItem key={test._id} {...test} awsLink={awsLink} />
               })}
               {/* <TestItem name="SAT Series #01" status="due date" date="june 20, 2022" action="Continue" />
            <TestItem name="Ex. Starte" status="due date" date="june 20, 2022" action="Start" marks="1250/1250" />
            <TestItem name="SAT B2" status="Completed" date="june 20, 2022" /> */}


            </div>
         </div>
      </div>
   );
};

export default SessionFeedback;
