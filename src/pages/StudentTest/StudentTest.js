//y
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useAddBackupResponseMutation,
  useLazyGetAssignedTestQuery,
  useLazyGetParentsAssignedTestsQuery,
  useLazyGetTestDetailsQuery,
  useLazyGetTestResponseQuery,
} from "../../app/services/test";
import { useLazyGetUserDetailQuery } from "../../app/services/users";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import { getDuration, getFormattedDate } from "../../utils/utils";

import { tempTableData, studentsDataTable } from "../AssignedTests/tempData";
import InputField from "../../components/InputField/inputField";
import AssignedTestIndicator from "../../components/AssignedTestIndicator/AssignedTestIndicator";
import InputSelectNew from "../../components/InputSelectNew/InputSelectNew";
import { useNavigate, useParams } from "react-router-dom";

const studentTableHeaders2 = [
  "Test Name",
  "Assigned on",
  "Due Date",
  "Duration",
  "Status",
  "Scores",
  " ",
];

const parentTestInfo = [
  {
    bg: "#CBC0F5",
    text: "Not Started",
  },
  {
    bg: "#F6A429",
    text: "Started",
  },
  {
    bg: "#32D583",
    text: "Completed",
  },
];

const SORT_STATES = {
  ASCENDING_ORDER: "ASCENDING_ORDER",
  DESCENDING_ORDER: "DESCENDING_ORDER",
  UNSORTED: "UNSORTED",
}

export default function StudentTest({ fromProfile, testtype, setTotaltest, studentId }) {
  const [user, setUser] = useState({});
  const [associatedStudents, setAssociatedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { firstName, lastName } = useSelector((state) => state.user);
  const { organization } = useSelector((state) => state.organization);
  const [getTest, getTestResp] = useLazyGetAssignedTestQuery();

  const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery();
  const [fetchAssignedTests, fetchAssignedTestsResp] =
    useLazyGetParentsAssignedTestsQuery();

  const [assignedTestDetails, setassignedTestDetails] = useState([]);

  const [allTests, setAllTests] = useState([]);
  const [filteredTests, setfilteredTests] = useState([]);

  const [testDetails, setTestDetails] = useState([]);

  const { role: persona, id, dateFormat } = useSelector((state) => state.user);
  const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery();
  const [awsLink, setAwsLink] = useState("");

  const [assignmentNameSortState, setAssignmentNameSortState] = useState(SORT_STATES.UNSORTED);
  const [assignedOnSortState, setAssignedOnSortState] = useState(SORT_STATES.UNSORTED);
  const [dueDateSortState, setDueDateSortState] = useState(SORT_STATES.UNSORTED);
  const [durationSortState, setDurationSortState] = useState(SORT_STATES.UNSORTED);
  const [statusSortState, setStatusSortState] = useState(SORT_STATES.UNSORTED);
  const [scoreSortState, setScoreSortState] = useState(SORT_STATES.UNSORTED);

  const sortByAssignmentName = () => {
    if (assignmentNameSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.testName < b.testName) {
            return -1;
          }
          if (a.testName > b.testName) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.testName < b.testName) {
            return -1;
          }
          if (a.testName > b.testName) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setAssignmentNameSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if (assignmentNameSortState === SORT_STATES.UNSORTED || assignmentNameSortState === SORT_STATES.ASCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.testName < b.testName) {
            return 1;
          }
          if (a.testName > b.testName) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.testName < b.testName) {
            return 1;
          }
          if (a.testName > b.testName) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setAssignmentNameSortState(SORT_STATES.DESCENDING_ORDER);
    }
  }

  const sortByAssignedDate = () => {

    if (assignedOnSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.assignedOn) < new Date(b.assignedOn)) {
            return -1;
          }
          if (new Date(a.assignedOn) > new Date(b.assignedOn)) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.assignedOn) < new Date(b.assignedOn)) {
            return -1;
          }
          if (new Date(a.assignedOn) > new Date(b.assignedOn)) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setAssignedOnSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if (assignedOnSortState === SORT_STATES.UNSORTED || assignedOnSortState === SORT_STATES.ASCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.assignedOn) < new Date(b.assignedOn)) {
            return 1;
          }
          if (new Date(a.assignedOn) > new Date(b.assignedOn)) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.assignedOn) < new Date(b.assignedOn)) {
            return 1;
          }
          if (new Date(a.assignedOn) > new Date(b.assignedOn)) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setAssignedOnSortState(SORT_STATES.DESCENDING_ORDER);
    }

  };

  const sortByDueDate = () => {

    if (dueDateSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.dueDate) < new Date(b.dueDate)) {
            return -1;
          }
          if (new Date(a.dueDate) > new Date(b.dueDate)) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.dueDate) < new Date(b.dueDate)) {
            return -1;
          }
          if (new Date(a.dueDate) > new Date(b.dueDate)) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setDueDateSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if (dueDateSortState === SORT_STATES.UNSORTED || dueDateSortState === SORT_STATES.ASCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.dueDate) < new Date(b.dueDate)) {
            return 1;
          }
          if (new Date(a.dueDate) > new Date(b.dueDate)) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.dueDate) < new Date(b.dueDate)) {
            return 1;
          }
          if (new Date(a.dueDate) > new Date(b.dueDate)) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setDueDateSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const sortByDuration = () => {
    if (durationSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.duration < b.duration) {
            return -1;
          }
          if (a.duration > b.duration) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.duration < b.duration) {
            return -1;
          }
          if (a.duration > b.duration) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setDurationSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if (durationSortState === SORT_STATES.UNSORTED || durationSortState === SORT_STATES.ASCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.duration < b.duration) {
            return 1;
          }
          if (a.duration > b.duration) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.duration < b.duration) {
            return 1;
          }
          if (a.duration > b.duration) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setDurationSortState(SORT_STATES.DESCENDING_ORDER);
    }
  }

  const sortByStatus = () => {
    if (statusSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.status < b.status) {
            return -1;
          }
          if (a.status > b.status) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.status < b.status) {
            return -1;
          }
          if (a.status > b.status) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setStatusSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if (statusSortState === SORT_STATES.UNSORTED || statusSortState === SORT_STATES.ASCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.status < b.status) {
            return 1;
          }
          if (a.status > b.status) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.status < b.status) {
            return 1;
          }
          if (a.status > b.status) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setStatusSortState(SORT_STATES.DESCENDING_ORDER);
    }
  }

  const sortByScore = () => {
    /* console.log("sortByScore");
    console.log(filteredTests); */
    const hasProperScoresProperty = (item) => {
      if (item.scores === "-" || item.scores === undefined || item.scores === null || Object.keys(item).length === 0) {
        return false;
      }

      if (item.scores.cumulative === undefined || item.scores.cumulative === null) {
        return false;
      }

      return true;
    }

    if (scoreSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {

          if (!hasProperScoresProperty(a) && !hasProperScoresProperty(b)) {
            return -1;
          }

          if (!hasProperScoresProperty(a) && hasProperScoresProperty(b)) {
            return -1;
          }

          if (hasProperScoresProperty(a) && !hasProperScoresProperty(b)) {
            return 1;
          }

          if (a.scores.cumulative < b.scores.cumulative) {
            return -1;
          }
          if (a.scores.cumulative > b.scores.cumulative) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {

          if (!hasProperScoresProperty(a) && !hasProperScoresProperty(b)) {
            return -1;
          }

          if (!hasProperScoresProperty(a) && hasProperScoresProperty(b)) {
            return -1;
          }

          if (hasProperScoresProperty(a) && !hasProperScoresProperty(b)) {
            return 1;
          }

          if (a.scores.cumulative < b.scores.cumulative) {
            return -1;
          }
          if (a.scores.cumulative > b.scores.cumulative) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setScoreSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if (scoreSortState === SORT_STATES.UNSORTED || scoreSortState === SORT_STATES.ASCENDING_ORDER) {

      setAllTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {

          if (!hasProperScoresProperty(a) && !hasProperScoresProperty(b)) {
            return -1;
          }

          if (!hasProperScoresProperty(a) && hasProperScoresProperty(b)) {
            return 1;
          }

          if (hasProperScoresProperty(a) && !hasProperScoresProperty(b)) {
            return -1;
          }

          if (a.scores.cumulative < b.scores.cumulative) {
            return 1;
          }
          if (a.scores.cumulative > b.scores.cumulative) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setfilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {

          if (!hasProperScoresProperty(a) && !hasProperScoresProperty(b)) {
            return -1;
          }

          if (!hasProperScoresProperty(a) && hasProperScoresProperty(b)) {
            return 1;
          }

          if (hasProperScoresProperty(a) && !hasProperScoresProperty(b)) {
            return -1;
          }

          if (a.scores.cumulative < b.scores.cumulative) {
            return 1;
          }
          if (a.scores.cumulative > b.scores.cumulative) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setScoreSortState(SORT_STATES.DESCENDING_ORDER);
    }
  }

  const studentTableHeaders = [
    {
      id: 1,
      text: "Assignment Name", // testName
      className: "text-left pl-6",
      onCick: sortByAssignmentName,
      // willDisplayDownArrow: assignmentNameSortState !== SORT_STATES.DESCENDING_ORDER,
      willDisplayDownArrow: null,
    },
    {
      id: 2,
      text: "Assigned on", // assignedOn
      onCick: sortByAssignedDate,
      // willDisplayDownArrow: assignedOnSortState !== SORT_STATES.DESCENDING_ORDER,
      willDisplayDownArrow: null,
    },

    {
      id: 3,
      text: "Due Date", // dueDate
      onCick: sortByDueDate,
      // willDisplayDownArrow: dueDateSortState !== SORT_STATES.DESCENDING_ORDER,
      willDisplayDownArrow: null,
    },
    {
      id: 4,
      text: "Duration", // duration
      onCick: sortByDuration,
      // willDisplayDownArrow: durationSortState !== SORT_STATES.DESCENDING_ORDER,
      willDisplayDownArrow: null,
    },
    {
      id: 1,
      text: "Status", // status
      onCick: sortByStatus,
      // willDisplayDownArrow: statusSortState !== SORT_STATES.DESCENDING_ORDER,
      willDisplayDownArrow: null,
    },
    {
      id: 5,
      text: "Scores",
      onCick: sortByScore,
      // willDisplayDownArrow: scoreSortState !== SORT_STATES.DESCENDING_ORDER,
      willDisplayDownArrow: null,
    },
    {
      id: 6,
      text: "",
      noArrow: true
    },
  ];
  const [tableHeaders, setTableHeaders] = useState(studentTableHeaders);
  const params = useParams()

  useEffect(() => {
    if (persona === "student" || persona == 'admin') {
      getTest(studentId).then((res) => {
        console.log("all-assigned-tests", res?.data?.data);
        setAwsLink(res?.data?.data?.baseLink);
        let tempAllTests = res?.data?.data?.test ? res?.data?.data?.test?.map((test) => {
          const {
            testId,
            studentId,
            dueDate,
            multiple,
            assignedBy,
            isCompleted,
            isStarted,
            createdAt,
            updatedAt,
          } = test;
          // if (testId === null) return;
          return {
            // assignedBy: assignedBy ? assignedBy.firstName + " " + assignedBy.lastName : "-",

            testName: testId ? testId.testName : "-",
            assignedOn: new Date(createdAt).toDateString(),
            studentId: studentId ? studentId : "-",
            testtype: testId ? testId.testType : "-",
            dueDate: new Date(test.dueDate).toDateString(),
            duration: multiple ? getDuration(multiple) : "Unlimited",
            status:
              isCompleted === true
                ? "completed"
                : isStarted
                  ? "started"
                  : "notStarted",
            scores: "-",
            _id: test._id,
            pdfLink: testId ? `${res.data.data.baseLink}${testId.pdf}` : null,
            testId: testId ? testId._id : "-",
            isCompleted: test.isCompleted,
            isStarted: test.isStarted,
            createdAt,
            assignedTestId: test._id,
            updatedAt,
          };
        }) : [];

        let sortedArr = tempAllTests.sort(function (a, b) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        // console.log({tempAllTests,sortedArr})
        setTotaltest && setTotaltest(sortedArr?.length)
        setAllTests(sortedArr.filter((item) => item !== undefined));
      });
    }
  }, [persona]);

  //fetch parents students
  useEffect(() => {
    if (persona === "parent") {
      getUserDetail({ id }).then((res) => {
        // console.log('response', res.data.data);
        setUser(res.data.data.user);
        setAssociatedStudents([]);
        res.data.data.user.assiginedStudents.map((student, idx) => {
          getUserDetail({ id: student }).then((res) => {
            if (res.error) return;
            setAssociatedStudents((prev) => [
              ...prev,
              {
                _id: res.data.data.user._id,
                name: `${res.data.data.user.firstName} ${res.data.data.user.lastName}`,
                photo: res.data.data.user.photo
                  ? res.data.data.user.photo
                  : "/images/default.jpeg",
                selected: idx === 0 ? true : false,
              },
            ]);
          });
        });
      });
    }

  }, [persona, id]);

  useEffect(() => {
    if (persona === "parent") {
      fetchAssignedTests(id).then((res) => {
        if (res.error)
          return console.log("assigned test parent resp", res.error);
        let tempAllTests = res?.data?.data?.test?.map((test) => {
          const {
            testId,
            studentId,
            isCompleted,
            multiple,
            isStarted,
            assignedBy,
            dueDate,
            createdAt,
            updatedAt,
          } = test;
          
          // if (testId === null) return;
          
          return {
            // assignedBy: assignedBy ? assignedBy.firstName + " " + assignedBy.lastName : "-",
            testName: testId ? testId.testName : "-",
            testtype: testId ? testId.testType : "-",
            assignedOn: new Date(createdAt).toLocaleDateString(),
            studentId: studentId ? studentId : "-",
            dueDate:new Date(test?.dueDate).toLocaleDateString(),
            duration: multiple ? getDuration(multiple) : "Unlimited",
            status:
              isCompleted === true
                ? "completed"
                : isStarted
                  ? "started"
                  : "notStarted",
            scores: "-",
            _id: test._id,
            pdfLink: testId ? testId.pdf ? testId.pdf : null : null,
            testId: testId ? testId._id : "-",
            isCompleted: test.isCompleted,
            assignedTestId: test._id,
            updatedAt,
          };
        });
        let sortedArr = tempAllTests?.sort(function (a, b) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        console.log({ tempAllTests, sortedArr })
        setAllTests(sortedArr?.filter((item) => item !== undefined));
      });
    }
  }, [persona, id]);

  useEffect(() => {
    if (associatedStudents.length === 0) return;
    let selectedCount = 0;
    associatedStudents.map((student) => {
      if (student.selected === true) {
        selectedCount += 1;
      }
    });
    if (selectedCount > 0) return;
    if (associatedStudents.length >= 1) {
      setAssociatedStudents((prev) => {
        return prev.map((student, idx) => {
          if (idx === 0) {
            setSelectedStudent({ ...student, selected: true });
            return { ...student, selected: true };
          }
          return { ...student, selected: false };
        });
      });
    }
  }, [associatedStudents]);

  const navigate = useNavigate()
  useEffect(() => {
    if (selectedStudent === null) return;
    if (Object.keys(selectedStudent).length === 0) return;
    if (allTests?.length === 0) return;

    const selected = associatedStudents.find(
      (student) => student.selected === true
    );
    if (!selected) return;
    let tempdata = allTests?.filter(
      (test) => test.studentId._id === selected._id
    );
    setfilteredTests(tempdata);
  }, [selectedStudent, associatedStudents, allTests]);

  const handleStudentChange = (item) => {
    let tempdata = associatedStudents.map((student) => {
      if (student._id === item._id) {
        setSelectedStudent({ ...student, selected: true });
        return { ...student, selected: true };
      } else {
        return { ...student, selected: false };
      }
    });
    setAssociatedStudents(tempdata);
  };
  const status = [
    {
      text: "Completed",
      color: "#38C980",
    },
    {
      text: "Not Started",
      color: "#FF7979",
    },
    {
      text: "Started",
      color: "#FFCE84",
    },
  ];
  console.log("profile", fromProfile)



  return (
    <div className="w-[1599px] mx-auto">
      <div className={`  ${fromProfile ? '!mx-0' : 'min-h-screen'}`}>
        <div className={`pb-4 mt-[35px]  ${fromProfile ? 'px-0 py-0 ' : ''}`}>
          {(persona === "student" || persona === "parent") && !fromProfile && (
            <div
              className={`${persona === "student" || true ? "flex justify-between items-center" : ""
                }`}
            >
              <p className="text-[#24A3D9]   text-[20px] font-normal">
                <span className="cursor-pointer" onClick={() => navigate('/')}>
                  {organization?.company +
                    "  >  " +
                    firstName +
                    "  " +
                    lastName +
                    "  >  "}
                </span>
                <span className="font-bold">Assignments</span>
              </p>
              <div className="flex justify-end items-center">

                {persona === "student" ? (
                  <></>
                ) : (

                  persona === "parent" && (
                    <div className="pl-4">

                      <div className="flex mr-4 mt-[34px]">
                        <InputSelectNew


                          placeholder="Select Student"
                          parentClassName="ml-0 w-full  items-center flex text-[#517CA8] text-xs  whitespace-nowrap "
                          inputContainerClassName="bg-white h-[45px] !w-[200px] shadow-[0px_0px_2.500001907348633px_0px_#00000040] my-0 py-[5px] px-[35px] text-[#517CA8]"

                          labelClassname="text-sm text-base-17-5"
                          inputClassName="text-[#517CA8]"
                          optionContainerClassName="!w-[200px]"


                          value={selectedStudent?.name}
                          optionType={"object"}
                          optionData={associatedStudents?.map((it) => {
                            return {
                              ...it,
                              value: it?.name
                            }
                          })}
                          onChange={(e) => {
                            handleStudentChange(e)

                          }}



                        />
                        {/* {associatedStudents.map((student, idx) => {
                          return (
                            <div
                              key={idx}
                              className="border cursor-pointer px-5 py-[7px] flex justify-center"
                              onClick={() => handleStudentChange(student)}
                            >
                              <p
                                className={`text-lg ${
                                  student.selected
                                    ? "font-bold underline underline-offset-3"
                                    : ""
                                }`}
                              >
                                {" "}
                                {student.name}{" "}
                              </p>
                            </div>
                          );
                        })} */}
                      </div>
                    </div>
                  )
                )}
                <div>
                  {(persona === "student" || persona === 'parent') && (
                    <div className="flex justify-between whitespace-nowrap items-center gap-6">
                      <div className="flex items-center justify-end gap-[20px] mt-[34px]">
                        {/* <AssignedTestIndicator /> */}
                        {status.map(({ text, color }, idx) => (
                          <AssignedTestIndicator
                            key={idx}
                            text={text}
                            color={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className={`mt-6 ${fromProfile ? '!mt-0' : ''}`}>
            <Table
              tableClass="table-auto !mt-0 !bg-transparent"
              theadWidth={"w-[1598px]"}
              widthFullTable={true}
              testtype={testtype}
              fromProfile={fromProfile}
              awsLink={awsLink}
              dataFor="assignedTestsStudents"
              headerObject={true}
              data={persona === "parent" ? filteredTests : allTests}
              tableHeaders={studentTableHeaders}
              maxPageSize={10}
              persona={persona}
              excludes={[
                "_id",
                "studentId",
                "testId",
                "isCompleted",
                "pdfLink",
                "isStarted",
                "createdAt",
                "assignedTestId",
                "updatedAt",
              ]}
              setAllTestsForStudentTest={setAllTests}
              setfilteredTestsForStudentTest={setfilteredTests}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
