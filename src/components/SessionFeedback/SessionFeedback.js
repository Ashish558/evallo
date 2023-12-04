import React, { useEffect, useState } from "react";
import styles from "./SessionFeedback.module.css";
import starGold from "./../../assets/icons/star-gold.png";
import starDark from "./../../assets/icons/star-dark.png";
import starLight from "./../../assets/icons/star-light.png";
import { TestItem } from "../TestItem/TestItem";
import { useLazyGetAssignedTestQuery } from "../../app/services/test";
import { getFormattedDate } from "../../utils/utils";

const SessionFeedback = () => {
  const [getTest, getTestResp] = useLazyGetAssignedTestQuery();
  const [allTests, setAllTests] = useState([]);
  const [awsLink, setAwsLink] = useState("");
  useEffect(() => {
    getTest().then((res) => {
      console.log("all-assigned-tests", res.data);
      setAwsLink(res.data.data.baseLink);

      let tempAllTests = res.data.data.test.map((test) => {
        const {
          testId,
          studentId,
          dueDate,
          isCompleted,
          isStarted,
          createdAt,
          updatedAt,
        } = test;
        if (testId === null) return;
        return {
          testype: testId ? testId.testType : "-",
          testName: testId ? testId.testName : "-",
          assignedOn: getFormattedDate(new Date(createdAt)),
          studentId: studentId ? studentId : "-",
          dueDate: getFormattedDate(new Date(test.dueDate)),
          duration: test.timeLimit,
          status:
            isCompleted === true
              ? "completed"
              : isStarted
              ? "started"
              : "notStarted",
          scores: "-",
          _id: test._id,
          pdfLink: testId ? testId.pdf : null,
          testId: testId ? testId._id : "-",
          isCompleted: test.isCompleted,
          isStarted: test.isStarted,
          updatedAt,
          assignedTestId: test._id,
        };
      });
      let sortedArr = tempAllTests.sort(function (a, b) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      setAllTests(sortedArr.filter((item) => item !== undefined));
    });
  }, []);
  // console.log('all-tests', allTests);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="text-[20px] !font-semibold !text-[#26435F] w-full flex flex-grow-1 flex-1 justify-start items-center">
        Assigned Tests
      </div>
      <div
        id={styles.sessionFeedbackContainer}
        className="w-full shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller h-[451px] bg-white px-[16px] py-[21px] !rounded-md"
      >
        <div
          id={styles.sessionFeedback}
          className="bg-white px-[10px] custom-scroller !rounded-md h-full overflow-y-auto"
        >
          {/* {/* <TestItem name="name" status="due date" date="june 20, 2022" action="Start" marks="1250/1250" /> */}

          {allTests && allTests?.length > 0 ? (
            allTests.map((test) => {
              return <TestItem key={test._id} {...test} awsLink={awsLink} />;
            })
          ) : (
            <div id="stest2" className=" w-full  z-[5000] h-full rounded-md bg-white flex justify-center flex-col text-center items-center">
              <div className="w-[90%] mx-auto   flex flex-col items-center">
                <button className="bg-[#FF7979] text-white rounded-md p-2 py-1">
                  No Assignments Yet
                </button>
              </div>
            </div>
          )}
          {/* <TestItem name="SAT Series #01" status="due date" date="june 20, 2022" action="Continue" />
            <TestItem name="Ex. Starte" status="due date" date="june 20, 2022" action="Start" marks="1250/1250" />
            <TestItem name="SAT B2" status="Completed" date="june 20, 2022" /> */}
        </div>
      </div>
    </div>
  );
};

export default SessionFeedback;
