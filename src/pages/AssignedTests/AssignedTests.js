import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import InputSelect from "../../components/InputSelect/InputSelect";

import AddIcon from "../../assets/icons/add.svg";
import SearchIcon from "../../assets/icons/Search_shade.svg";
import ResendIcon from "../../assets/icons/resend.svg";
import DeleteIcon from "../../assets/icons/ic_outline-delete-black.svg";
import styles from "./styles.module.css";
import { tempTableData, studentsDataTable } from "./tempData";
import InputField from "../../components/InputField/inputField";
import axios from "axios";
import { BASE_URL } from "../../app/constants/constants";
import {
  useAssignTestMutation,
  useLazyDeleteTestQuery,
  useLazyGetAllAssignedTestQuery,
  useLazyGetAssignedTestQuery,
  useLazyGetTestsByNameQuery,
  useLazyGetTutorAssignedTestsQuery,
} from "../../app/services/test";
import {
  useLazyGetStudentsByNameQuery,
  useLazyGetTutorStudentsByNameQuery,
} from "../../app/services/session";
import InputSearch from "../../components/InputSearch/InputSearch";
import calendar from "./../../assets/calendar/calendar.svg";
import pdfUpload from "./../../assets/icons/Group 31220.svg";
import AssignedTestIndicator from "../../components/AssignedTestIndicator/AssignedTestIndicator";
import { useSelector } from "react-redux";
import { getDuration, getFormattedDate } from "../../utils/utils";
import FilterItems from "../../components/FilterItems/filterItems";
import { useNavigate } from "react-router-dom";
import SCheckbox from "../../components/CCheckbox/SCheckbox";
import {
  useCRMBulkdeleteMutation,
  useCRMBulkmarkcompletedMutation,
  useCRMBulkresentMutation,
} from "../../app/services/admin";
const optionData = ["1", "2", "3", "4", "5"];
const timeLimits = ["Regular", "1.1x", "1.25x", , "1.5x", "Unlimited"];
const testData = ["SAT", "ACT"];

const initialState = {
  name: "",
  limit: "",
  date: "",
  test: "",
  testId: "",
  studentId: "",
  instruction: "",
};

const SORT_STATES = {
  ASCENDING_ORDER: "ASCENDING_ORDER",
  DESCENDING_ORDER: "DESCENDING_ORDER",
  UNSORTED: "UNSORTED",
}

export default function AssignedTests() {
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const navigate = useNavigate();
  const [testNameOptions, setTestNameOptions] = useState([]);
  const [studentNameOptions, setStudentNameOptions] = useState([]);
  const [allAssignedTests, setAllAssignedTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [studentNameSortState, setStudentNameSortState] = useState(SORT_STATES.UNSORTED);
  const [testNameSortState, setTestNameSortState] = useState(SORT_STATES.UNSORTED);
  const [assignedOnSortState, setAssignedOnSortState] = useState(SORT_STATES.UNSORTED);
  const [dueOnSortState, setDueOnSortState] = useState(SORT_STATES.UNSORTED);
  const [assignedBySortState, setAssignedBySortState] = useState(SORT_STATES.UNSORTED);
  const [statusSortState, setStatusSortState] = useState(SORT_STATES.UNSORTED);
  const [durationSortState, setDurationSortState] = useState(SORT_STATES.UNSORTED);
  const [scoreSortState, setScoreSortState] = useState(SORT_STATES.UNSORTED);
  const { dateFormat } = useSelector((state) => state.user);

  const sortByName = () => {
    console.log("allAssignedTests");
    console.log(allAssignedTests);
    setAllAssignedTests((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        if (a.studentName < b.studentName) {
          return -1;
        }
        if (a.studentName > b.studentName) {
          return 1;
        }
        return 0;
      });
      return arr;
    });

    setFilteredTests((prev) => {
      let arr = [...prev];
      console.log("arr", arr);
      arr = arr.sort(function (a, b) {
        if (a.studentName < b.studentName) {
          return -1;
        }
        if (a.studentName > b.studentName) {
          return 1;
        }
        return 0;
      });
      return arr;
    });
  };

  const sortByStudentName = () => {
    if (studentNameSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllAssignedTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.studentName < b.studentName) {
            return -1;
          }
          if (a.studentName > b.studentName) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setFilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.studentName < b.studentName) {
            return -1;
          }
          if (a.studentName > b.studentName) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setStudentNameSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if (studentNameSortState === SORT_STATES.UNSORTED || studentNameSortState === SORT_STATES.ASCENDING_ORDER) {

      setAllAssignedTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.studentName < b.studentName) {
            return 1;
          }
          if (a.studentName > b.studentName) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setFilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.studentName < b.studentName) {
            return 1;
          }
          if (a.studentName > b.studentName) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setStudentNameSortState(SORT_STATES.DESCENDING_ORDER);
    }
  }

  const sortByTestName = () => {
    if (testNameSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

      setTestNameSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if (testNameSortState === SORT_STATES.UNSORTED || testNameSortState === SORT_STATES.ASCENDING_ORDER) {

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

      setTestNameSortState(SORT_STATES.DESCENDING_ORDER);
    }
  }

  const sortByAssignedDate = () => {
    if (assignedOnSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

    if (dueOnSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

      setDueOnSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if (dueOnSortState === SORT_STATES.UNSORTED || dueOnSortState === SORT_STATES.ASCENDING_ORDER) {

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

      setDueOnSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const sortByAssignedBy = () => {
    if (assignedBySortState === SORT_STATES.DESCENDING_ORDER) {

      setAllAssignedTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.assignedBy < b.assignedBy) {
            return -1;
          }
          if (a.assignedBy > b.assignedBy) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setFilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.assignedBy < b.assignedBy) {
            return -1;
          }
          if (a.assignedBy > b.assignedBy) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setAssignedBySortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if (assignedBySortState === SORT_STATES.UNSORTED || assignedBySortState === SORT_STATES.ASCENDING_ORDER) {

      setAllAssignedTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.assignedBy < b.assignedBy) {
            return 1;
          }
          if (a.assignedBy > b.assignedBy) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setFilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.assignedBy < b.assignedBy) {
            return 1;
          }
          if (a.assignedBy > b.assignedBy) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setAssignedBySortState(SORT_STATES.DESCENDING_ORDER);
    }
  }

  const sortByStatus = () => {
    if (statusSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

  const sortByDuration = () => {
    if (durationSortState === SORT_STATES.DESCENDING_ORDER) {

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

      setAllAssignedTests((prev) => {
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

      setFilteredTests((prev) => {
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

  const tempTableHeaders = [
    // setFilteredTests
    {
      id: 1,
      text: "Student Name", // studentName
      // className: "no-arrow",
      onCick: sortByStudentName,
      willDisplayDownArrow: studentNameSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 2,
      // className: "no-arrow",
      text: "Test Name", // testName
      onCick: sortByTestName,
      willDisplayDownArrow: testNameSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 3,
      text: "Assigned On", // createdAt , assignedOn
      // className: "text-left pl-6 no-arrow",
      onCick: sortByAssignedDate,
      willDisplayDownArrow: assignedOnSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 4,
      text: "Due On", // dueDate
      // className: "text-left pl-6 no-arrow",
      onCick: sortByDueDate,
      willDisplayDownArrow: dueOnSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 5,
      // className: "no-arrow",
      text: "Tutor", // assignedBy
      onCick: sortByAssignedBy,
      willDisplayDownArrow: assignedBySortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 6,
      // className: "no-arrow",
      text: "Completion", // status
      onCick: sortByStatus,
      willDisplayDownArrow: statusSortState !== SORT_STATES.DESCENDING_ORDER,
    },

    {
      id: 7,
      // className: "no-arrow",
      text: "Duration", // duration
      onCick: sortByDuration,
      willDisplayDownArrow: durationSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 8,
      text: "Score", // scores
      onCick: sortByScore,
      willDisplayDownArrow: scoreSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 9,
      // className: "no-arrow",
      text: "",
      noArrow: true
    },
  ];

  const [assignTestModalActive, setAssignTestModalActive] = useState(false);
  const [resendModalActive, setResendModalActive] = useState(false);
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [testToResend, setTestToResend] = useState({});
  const [testToDelete, setTestToDelete] = useState({});

  const { role: persona, id } = useSelector((state) => state.user);
  const handleClose = () => setAssignTestModalActive(false);
  const { organization } = useSelector((state) => state.organization);
  const [filterData, setFilterData] = useState({
    studentName: "",
    testName: "",
    assignedBy: "",
    status: "",
  });

  const [assignTest, assignTestResp] = useAssignTestMutation();

  const [modalData, setModalData] = useState(initialState);

  const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery();
  const [fetchAssignedTests, assignedTestsResp] =
    useLazyGetAllAssignedTestQuery();
  const [fetchTutorAssignedTests, fetchTutorAssignedTestsResp] =
    useLazyGetTutorAssignedTestsQuery();
  const [fetchTests, fetchTestsResp] = useLazyGetTestsByNameQuery();
  const [deleteAssignedTest, deleteAssignedTestResp] = useLazyDeleteTestQuery();
  const [fetchTutorStudents, tutorStudentsResp] =
    useLazyGetTutorStudentsByNameQuery();
  const [assignedBys, setAssignedBys] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: "english" });
  const [students, setStudents] = useState([]);
  const { firstName, lastName } = useSelector((state) => state.user);
  const [testsData, setTestsData] = useState([]);
  const [maxPageSize, setMaxPageSize] = useState(10);
  const [validData, setValidData] = useState(true);
  const [alldata, setalldata] = useState([])
  const [selectedstudent, setslecetedstudent] = useState([])
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filterItems, setFilterItems] = useState([]);
  const [studentMultiple, setStudentMultiple] = useState([]);
  useEffect(() => {
    setValidData(
      modalData.name &&
      modalData.limit &&
      modalData.date &&
      modalData.test === "" &&
      modalData.instruction === ""
    );
  }, [modalData.name, modalData.limit, modalData.date, modalData.test]);

  const handleMultipleStudent = (student) => {

    let bool = studentMultiple?.find(
      (student1) => student1?._id === student?._id
    );
    if (bool) {
      let updated = studentMultiple.filter((test) => test?._id !== student._id);
      setStudentMultiple(updated);
      let updated2 = selectedstudent.filter((test) => test?._id !== student._id)
      setslecetedstudent(updated2)
    } else {
      setStudentMultiple((prev) => {
        return [...prev, { _id: student?._id, value: student?.value }];
      });
      const foundObject = alldata.find(obj => obj._id === student?._id);
      const updated2 = selectedstudent;
      updated2.push(foundObject);
      setslecetedstudent(updated2)
    }
    checkTextWidth()
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zeros if necessary
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };
  const handleOptionCLose = () => {
    return
    if (studentMultiple?.length > 0) {
      setModalData((prev) => {
        return { ...prev, name: studentMultiple[0].value };
      });
    }
  };

  useEffect(() => {
    //modalData.name.trim() === "" ||
    //modalData.studentId.trim() === ""
    if (
      studentMultiple?.length === 0 ||
      modalData.limit.trim() === "" ||
      modalData.date === "" ||
      modalData.testId === ""
    ) {
      setSubmitBtnDisabled(true);
    } else {
      let date = new Date(modalData.date);
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      let dueDate = date.getDate();
      console.log(date - currentDate);
      if (date - currentDate < 0) {
        setSubmitBtnDisabled(true);
      } else {
        setSubmitBtnDisabled(false);
      }
    }
  }, [
    modalData.name,
    modalData.limit,
    modalData.date,
    modalData.testId,
    modalData.studentId,
  ]);
  const handleNavigate = (role, id) => {
    console.log("clicked");
    navigate(`/profile/${role}/${id}`);
  };


  useEffect(() => {
    if (modalData.name.length >= 0) {
      if (persona === "admin") {
        fetchStudents(modalData.name).then((res) => {
          console.log("res", res);
          if (res.error) {
            return;
          }
          setalldata(res.data.data.students)
          let tempData = res.data.data.students.map((student) => {
            return {
              _id: student._id,
              value: `${student.firstName} ${student.lastName}`,
            };
          });
          setStudents(tempData);
        });
      } else {
        fetchTutorStudents(modalData.name).then((res) => {
          if (res.error) {
            return;
          }
          setalldata(res.data.data.students)
          let tempData = res.data.data.students.map((student) => {
            return {
              _id: student._id,
              value: `${student.firstName} ${student.lastName}`,
            };
          });

          setStudents(tempData);
        });
      }
    }
  }, [modalData.name]);

  useEffect(() => {
    if (modalData.test.length >= 0) {
      fetchTests(modalData.test).then((res) => {
        let tempData = res.data.data.test.map((test) => {
          return {
            _id: test._id,
            value: test.testName,
            testType: test.testType,
          };
        });
        setTestsData(tempData);
      });
    }
  }, [modalData.test]);

  const fetchAllAssignedTests = () => {
    fetchAssignedTests().then((res) => {
      if (res.error) return console.log(res.error);
      console.log("assigned res", res.data.data);

      let allAssignedBys = [];
      let data = res.data.data.test.map((item) => {
        const {
          createdAt,
          studentId,
          testId,
          dueDate,
          multiple,
          timeLimit,
          isCompleted,
          isStarted,
          assignedBy,
        } = item;
        const assignedByName = `${assignedBy?.firstName ? assignedBy?.firstName : "-"
          } ${assignedBy?.lastName ? assignedBy?.lastName : ""}`;
        if (assignedBy) {
          if (!allAssignedBys.includes(assignedByName)) {
            allAssignedBys.push(assignedByName);
          }
        }
        return {
          studentName: studentId
            ? `${studentId.firstName} ${studentId.lastName}`
            : "-",
          studentId: studentId ? studentId._id : "-",
          assignedOn: createdAt,
          assignedBy: assignedBy
            ? `${assignedBy?.firstName} ${assignedBy?.lastName}`
            : "-",
          testName: testId ? testId.testName : "-",
          testId: testId ? testId._id : null,
          pdfLink: testId ? testId.pdf : null,
          scores: "-",
          duration: getDuration(multiple),
          dueDate: dueDate,
          status:
            isCompleted === true
              ? "completed"
              : isStarted
                ? "started"
                : "notStarted",
          createdAt,
          assignedTestId: item._id,
        };
      });
      setAssignedBys(allAssignedBys);
      let sortedArr = data.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      if (persona === "admin")
        setFilterData({
          studentName: "",
          testName: "",
          assignedBy: "",
          status: "",
        });
      setAllAssignedTests(sortedArr);
      setFilteredTests(sortedArr);
    });
  };

  const fetchTutorTests = () => {
    fetchTutorAssignedTests(id).then((res) => {
      if (res.error) return console.log("tutor assignedtest", res.error);
      console.log("tutor assignedtest", res.data);
      let allAssignedBys = [];

      let data = res.data.data.test.map((item) => {
        const {
          createdAt,
          studentId,
          dueDate,
          testId,
          multiple,
          timeLimit,
          isCompleted,
          isStarted,
          assignedBy,
        } = item;
        const assignedByName = `${assignedBy?.firstName ? assignedBy?.firstName : "-"
          } ${assignedBy?.lastName ? assignedBy?.lastName : ""}`;
        if (assignedBy) {
          if (!allAssignedBys.includes(assignedByName)) {
            allAssignedBys.push(assignedByName);
          }
        }
        return {
          studentName: studentId
            ? `${studentId.firstName} ${studentId.lastName}`
            : "-",
          studentId: studentId ? studentId._id : "-",
          assignedOn: getFormattedDate(createdAt),
          assignedBy: assignedBy
            ? `${assignedBy?.firstName ? assignedBy?.firstName : "-"} ${assignedBy?.lastName ? assignedBy?.lastName : ""
            }`
            : "-",
          testName: testId ? testId.testName : "-",
          testId: testId ? testId._id : null,
          pdfLink: testId ? testId.pdf : null,
          scores: "-",
          duration: getDuration(multiple),
          status:
            isCompleted === true
              ? "completed"
              : isStarted
                ? "started"
                : "notStarted",
          createdAt,
          dueDate: getFormattedDate(dueDate),
          assignedTestId: item._id,
        };
      });
      console.log("allAssignedBys", allAssignedBys);
      setAssignedBys(allAssignedBys);
      let sortedArr = data.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      if (persona === "tutor")
        setFilterData({
          studentName: "",
          testName: "",
          assignedBy: "",
          status: "",
        });
      setAllAssignedTests(sortedArr);
      setFilteredTests(sortedArr);
    });
  };

  const getTimeLimit = (val) => {
    if (val === "Regular") return 1;
    if (val === "1.1x") return 1.1;
    if (val === "1.25x") return 1.25;
    if (val === "1.5x") return 1.5;
    if (val === "Unlimited") return 0;
    return 1;
  };

  const fetch = () => {
    if (persona === "admin") {
      fetchAllAssignedTests();
    } else if (persona === "tutor") {
      fetchTutorTests();
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  const handleResend = (item) => {
    setTestToResend(item);
    setResendModalActive(true);
  };

  const handleResendTestSubmit = (item) => {
    setResendLoading(true);
    const body = {
      studentId: testToResend.studentId,
      testId: testToResend.testId,
      dueDate: testToResend.dueDate,
      timeLimit: getTimeLimit(testToResend.duration),
    };
    assignTest(body).then((res) => {
      if (res.error) {
        return alert("Something went wrong");
      }
      alert("Assignment Resent");
      setResendModalActive(false);
      setResendLoading(false);
      console.log(res.data.data.assign);
      setAssignTestModalActive(false);
      fetch();
    });
  };

  const handleAssignTestSubmit = () => {
    console.log("test assignment");
    setLoading(true);
    studentMultiple?.map((it) => {
      const body = {
        studentId: it?._id,
        testId: modalData.testId,
        name: it?._value,
        dueDate: new Date(modalData.date),
        instruction: modalData.instruction,
        timeLimit: getTimeLimit(modalData.limit),
      };
      console.log(body);

      assignTest(body).then((res) => {
        setLoading(false);
        if (res.error) {
          console.log(res.error);
          if (res.error.data) {
            if (res.error.data.message) {
              alert(res.error.data.message);
              return;
            }
          }
          alert("Something went wrong");
          return;
        }
        setModalData(initialState);
        console.log("test assigned", res.data.data.assign);
        //alert("Test Assigned!");
        setAssignTestModalActive(false);
        setStudentMultiple([]);
        setslecetedstudent([])
        selselectedtext('')
        fetch();
      });
    });
  };

  useEffect(() => {
    let tempdata = [...allAssignedTests];

    if (filterData.studentName !== "") {
      const regex2 = new RegExp(`${filterData.studentName.toLowerCase()}`, "i");
      tempdata = tempdata.filter((test) => test.studentName.match(regex2));
    } else {
      tempdata = tempdata.filter((test) => test.studentName !== "");
    }

    if (filterData.testName !== "") {
      const regex2 = new RegExp(`${filterData.testName.toLowerCase()}`, "i");
      tempdata = tempdata.filter((test) => test.testName.match(regex2));
    } else {
      tempdata = tempdata.filter((test) => test.testName !== "");
    }

    if (filterData.status !== "") {
      const selectedStatus = getStatus(filterData.status);
      tempdata = tempdata.filter((user) => user.status === selectedStatus);
    } else {
      tempdata = tempdata.filter((user) => user.status !== "");
    }

    if (filterData.assignedBy !== "") {
      tempdata = tempdata.filter(
        (user) => user.assignedBy === filterData.assignedBy
      );
    } else {
      tempdata = tempdata.filter((user) => user.assignedBy !== "");
    }

    setFilteredTests(tempdata);
  }, [filterData]);

  const removeFilter = (key) => {
    let tempFilterData = { ...filterData };
    tempFilterData[key] = "";
    setFilterData(tempFilterData);
  };

  const getStatus = (status) => {
    if (status === "Completed") return "completed";
    if (status === "Started") return "started";
    if (status === "Not Started") return "notStarted";
  };

  useEffect(() => {
    let arr = Object.keys(filterData)
      .map((key) => {
        if (filterData[key] !== "") {
          return {
            text: filterData[key],
            type: key,
            removeFilter: (key) => removeFilter(key),
          };
        }
      })
      .filter((item) => item !== undefined);
    setFilterItems(arr);
  }, [filterData]);

  const onRemoveFilter = (item) => item.removeFilter(item.type);

  useEffect(() => {
    setTableData(tempTableData);
    setTableHeaders(tempTableHeaders);
  }, []);

  const deleteTest = () => {
    console.log("deleteTest", testToDelete);
    setDeleteLoading(true);
    deleteAssignedTest({ id: testToDelete.assignedTestId }).then((res) => {
      setDeleteLoading(false);
      if (res.error) {
        console.log("delete err", res.error.data);
        if (res.error.data.message) {
          alert(res?.error?.data?.message);
          setDeleteModalActive(false);
        }
        setDeleteModalActive(false);
        return;
      }
      fetch();
      alert("Assignment Deleted");
      setDeleteModalActive(false);
      console.log("delete test res", res.data);
    });
  };

  const handleDelete = (item) => {
    setTestToDelete(item);
    setDeleteModalActive(true);
  };

  const handleCurrentUser = (item) => {
    setCurrentUser({
      name: item.text.toLowerCase(),
    });
  };
  const status = [
    {
      text: "Completed",
      color: "#32D583",
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
  const [numberChecked, setnumberChecked] = useState(0);
  useEffect(() => {
    if (!allAssignedTests) return;
    let testNames = [];
    let studentNames = [];
    allAssignedTests.forEach((item) => {
      if (!testNames.includes(item.testName)) {
        testNames.push(item.testName);
      }
      if (!studentNames.includes(item.studentName)) {
        studentNames.push(item.studentName);
      }
    });
    setTestNameOptions(testNames);
    setStudentNameOptions(studentNames);
  }, [allAssignedTests]);
  const handleStatus = (val) => {
    setFilterData({ ...filterData, status: val });
  };
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    if (!isChecked) {
      let data = filteredTests;
      data = data?.slice(0, maxPageSize);
      setSelectedId([...data]);
    } else {
      setSelectedId([]);
    }
    setIsChecked(!isChecked);
  };
  useEffect(() => {
    setIsChecked(false);
    setSelectedId([]);
  }, [filteredTests]);

  const [filterOptions, setFilterOptions] = useState(false);
  const handleOptionData = (val) => {
    let data = [];

    testNameOptions?.map((it, id) => {
      if (it?.toLowerCase()?.includes(val?.toLowerCase()))
        data.push({
          _id: id.toString(),
          value: it,
        });
    });
    setFilterOptions(data);
    return;
  };
  useEffect(() => {
    handleOptionData("");
  }, [testNameOptions]);
  const [selectedId, setSelectedId] = useState([]);

  const [addDeleteUser, slsdu] = useCRMBulkdeleteMutation();
  const [addMark, slmr] = useCRMBulkmarkcompletedMutation();
  const [addResend, slrsn] = useCRMBulkresentMutation();
  const bulkSelectDelete = () => {
    let assignmentIds = selectedId?.map((ii) => ii?.assignedTestId);
    if (!assignmentIds || assignmentIds?.length === 0) return;
    setDeleteSelectLoading(true);
    addDeleteUser({ assignmentIds }).then((res) => {
      console.log("successDelete", res, assignmentIds);
      if (res?.data) alert("Assignments deleted successfully!");
      setDeleteSelectLoading(false);
      setDeleteBulkModalActive(false);
      fetch();
    });
  };
  const markSelectDelete = () => {
    let assignmentIds = selectedId?.map((ii) => ii?.assignedTestId);
    if (!assignmentIds || assignmentIds?.length === 0) return;
    setMarkSelectLoading(true);
    addMark({ assignmentIds }).then((res) => {
      console.log("successMark", res, assignmentIds);
      if (res?.data) alert("Selected Assignments marked completed!");
      setMarkSelectLoading(false);
      setMarkBulkModalActive(false);
      fetch();
    });
  };
  const resendSelectDelete = () => {
    let assignmentIds = selectedId?.map((ii) => ii?.assignedTestId);
    if (!assignmentIds || assignmentIds?.length === 0) return;
    setResendSelectLoading(true);
    addResend({ assignmentIds }).then((res) => {
      console.log("successResend", res, assignmentIds);
      if (res?.data) alert("Assignments resent!");
      setResendSelectLoading(false);
      setResendBulkModalActive(false);
      fetch();
    });
  };
  const [deleteBulkModalActive, setDeleteBulkModalActive] = useState(false);
  const [deleteSelectLoading, setDeleteSelectLoading] = useState(false);

  const [markBulkModalActive, setMarkBulkModalActive] = useState(false);
  const [markSelectLoading, setMarkSelectLoading] = useState(false);
  const [resendBulkModalActive, setResendBulkModalActive] = useState(false);
  const [resendSelectLoading, setResendSelectLoading] = useState(false);
  const [selectedtext, selselectedtext] = useState('');
  const checkTextWidth = () => {
    const container = document.querySelector('.student-name-container');
    const text = document.querySelector('.text-container');
    console.log(text.innerHTML.length, container);

    if (text && container) {

      const limit22 = 3.4;
      const maxStringLength = Math.floor((container.offsetWidth - 100) / limit22) - 20;
      let stri = '';

      let f = false;
      let tot = 0;
      console.log(selectedstudent);
      for (const student of selectedstudent) {
        console.log(stri.length + student.firstName.length, maxStringLength);
        if (stri.length + student.firstName.length < maxStringLength) {
          if (f) {
            stri += ', ' + student.firstName;
          } else {
            f = true;
            stri += student.firstName;
          }
        } else {
          stri += ` ... total ${studentMultiple.length} selected`;
          break;
        }

        tot += student.firstName.length;
      }

      console.log('Text has covered the whole width. Needs to be cropped.');
      console.log('Cropped Text:', stri);
      selselectedtext(stri)
    }
  };



  return (
    <>
      <div className="w-[83.3333333333vw] mx-auto min-h-screen mb-[40px]">
        <div className="">
          <div className="flex justify-between items-center ">
            <p className="text-[#24A3D9] text-base-20 mb-8 mt-[50px]">
              <span onClick={() => navigate("/")} className="cursor-pointer">
                {organization?.company +
                  "  >  " +
                  firstName +
                  "  " +
                  lastName +
                  "  >  "}
              </span>
              <span className="font-bold">Assignments</span>
            </p>

            {persona === "parent" && (
              <div className="flex justify-between whitespace-nowrap items-center gap-6">
                <InputField
                  IconRight={SearchIcon}
                  value={filterData.studentName}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      studentName: e.target.value,
                    })
                  }
                  placeholder="Search Student"
                  inputClassName="text-base-17-5 pl-4 text-[#667085] placeholder:text-base-15"
                  parentClassName="w-[22.03125vw]  py-1"
                  inputContainerClassName="text-base-17-5  mt-1 shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white   mb-1"
                  type="text"
                />
                <div className="flex items-center justify-end gap-[20px] mt-[10px]">
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

          {(persona === "admin" || persona === "tutor") && (
            <>
              <div className="flex gap-4 justify-between items-start">
                {persona === "student" ? (
                  <p className={`font-bold text-4xl text-primary-dark`}>
                    Assigned Tests
                  </p>
                ) : (
                  <></>
                )}

                <InputField
                  IconRight={SearchIcon}
                  value={filterData.studentName}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      studentName: e.target.value,
                    })
                  }
                  placeholder="Search Student"
                  inputClassName="pl-4 py-[12px] text-base-17-5 text-md text-[#667085]   placeholder:text-base-17-5 placeholder:text-[#667085] pl-2"
                  parentClassName="w-[20.83vw]  text-md"
                  inputContainerClassName=" shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white  !py-0 h-[50px]"
                  type="text"
                />
                <InputSearch
                  IconRight={SearchIcon}
                  placeholderClass="text-base-17-5 text-[#667085]"
                  optionListClassName="text-base-17-5 text-[#667085]"
                  inputClassName="placeholder:text-[#667085] text-base-17-5 !py-3 text-[#667085]"
                  inputContainerClassName=" !py-3 shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white  h-[50px] text-[#667085]"
                  placeholder="Search Assignment"
                  parentClassName="w-[20.83vw] text-base-17-5 text-[#667085] h-[50px]"
                  labelClassname='hidden'
                  type="select"
                  value={filterData.testName}
                  onChange={(e) => {
                    setFilterData({
                      ...filterData,
                      testName: e.target.value,
                    });
                    handleOptionData(e.target.value);
                  }}
                  optionData={filterOptions}
                  onOptionClick={(item) => {
                    setFilterData({ ...filterData, testName: item?.value });
                  }}
                />
                {/* <InputSelect
                  IconSearch={SearchIcon}
                  value={filterData.testName}
                  onChange={(val) =>
                    setFilterData({ ...filterData, testName: val })
                  }
                  placeholderClass="text-base-17-5"
                  optionData={testNameOptions}
                  optionListClassName="text-base-17-5 text-[#667085]"
                  inputClassName="text-base-17-5 !py-3"
                  inputContainerClassName=" !py-3 shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] border-white bg-white  h-[50px]"
                  placeholder="Search Assignment"
                  parentClassName="w-[23.75vw] text-base-17-5 text-[#667085] h-[50px]"
                  type="select"
                /> */}
                <InputSelect
                  value={filterData.status}
                  onChange={(val) => handleStatus(val)}
                  optionListClassName="text-base-17-5 text-[#667085]"
                  placeholderClass="text-base-17-5"
                  optionData={["Started", "Not Started", "Completed"]}
                  inputClassName="text-base-17-5 !py-3"
                  inputContainerClassName=" shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px]  bg-white !py-3 h-[50px]"
                  optionClassName=""
                  placeholder="Completion"
                  parentClassName="w-[11.98vw] text-base-17-5 text-[#667085]"
                  type="select"
                />
                {persona === "tutor" ? (
                  <div className="w-2/6 flex justify-end">
                    <div>
                      <button
                        className="bg-[#FFA28D] text-[15px] justify-center flex py-[7px]  pl-1 items-center text-white font-bold rounded-[7.5px] text-base-15 w-[10.05vw] h-[50px]"
                        onClick={() => setAssignTestModalActive(true)}
                      >
                        New Assignment
                        <img src={AddIcon} className="ml-3" alt="new test" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <InputSelect
                    value={filterData.assignedBy}
                    onChange={(val) =>
                      setFilterData({ ...filterData, assignedBy: val })
                    }
                    optionListClassName="text-base-17-5 text-[#667085]"
                    parentClassName="w-[11.98vw] text-base-17-5 "
                    inputClassName="text-base-17-5 py-3"
                    inputContainerClassName="shadow-[0px_0px_2px_rgba(0,0,0,0.25)] rounded-[7.5px] bg-white h-[50px]"
                    placeholderClass="text-base-17-5"
                    optionData={assignedBys}
                    placeholder="Tutor"
                    type="text"
                  />
                )}
                {persona !== "parent" &&
                  persona !== "student" &&
                  persona !== "tutor" && (
                    <button
                      className="bg-[#FFA28D] text-[15px] justify-center flex py-[7px]  pl-1 items-center text-white font-bold rounded-[7.5px] text-base-15 w-[10.05vw] h-[50px]"
                      onClick={() => setAssignTestModalActive(true)}
                    >
                      New Assignment
                      <img src={AddIcon} className="ml-3" alt="new test" />
                    </button>
                  )}
              </div>

              <div className="mt-[50px] mb-[23.75px]">
                <FilterItems
                  items={filterItems}
                  setData={setFilterItems}
                  onRemoveFilter={onRemoveFilter}
                />
              </div>

              <div className="flex items-center  justify-between gap-[20px] mt-[10px]">
                <div className="flex text-[#26435F] items-center text-[17.5px] text-base-17-5">
                  <div className="ml-6 flex gap-3 items-center">
                    <SCheckbox
                      stopM={true}
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <span className="inline-block text-[17.5px] mt-[-1px] text-base-17-5">
                      {selectedId?.length} Selected
                    </span>
                    {/* <label className={`  text-[#26435F] font-medium flex items-center`}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span
                className={`${styles["custom-checkbox"]} ${isChecked ? "checked" : ""
                  }`}
              ></span>
             
            </label> */}
                  </div>
                  {(persona === "admin" ||
                    (persona === "tutor" &&
                      organization?.settings?.permissions &&
                      organization?.settings?.permissions[0]
                        ?.choosedValue)) && (
                      <div
                        // onClick={() =>
                        //   false && selectedId?.length > 0 && setDeleteBulkModalActive(true)
                        // }
                        className="opacity-70 !cursor-not-allowed pointer-events-none gap-x-[5px] px-1 w-[5.9375vw] py-[9px] bg-[#FFF] rounded-5 ml-6 flex items-center justify-center text-base-17-5"
                      >
                        <p>Delete</p>
                        <p>
                          <img className="w-5 h-5" src={DeleteIcon} alt="" />
                        </p>
                      </div>
                    )}
                  <div
                    onClick={() =>
                      selectedId?.length > 0 && setResendBulkModalActive(true)
                    }
                    className="cursor-pointer gap-x-[5px] px-1 py-[11px] bg-[#FFF] rounded-5 ml-6 flex w-[5.9375vw] items-center justify-center text-base-17-5"
                  >
                    <p>Resend</p>
                    <img src={ResendIcon} alt="" />
                  </div>
                  <div
                    onClick={() =>
                      selectedId?.length > 0 && setMarkBulkModalActive(true)
                    }
                    className="px-1 py-[11px] cursor-pointer bg-[#FFF] rounded-5 ml-6 w-[8.9583vw] text-center"
                  >
                    <p>Mark Completed</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-x-[20px] text-base-17-5">
                  {status.map(({ text, color }, idx) => (
                    <AssignedTestIndicator
                      key={idx}
                      text={text}
                      color={color}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="mt-3">
            <Table
              selectedId2={selectedId}
              setSelectedId2={setSelectedId}
              onClick={{ handleResend, handleDelete, handleNavigate }}
              dataFor="assignedTests"
              data={filteredTests}
              headerObject={true}
              excludes={["createdAt", "assignedTestId", "pdf"]}
              tableHeaders={tempTableHeaders}
              maxPageSize={maxPageSize}
              setMaxPageSize={setMaxPageSize}
              setAllAssignedTests={setAllAssignedTests}
              setFilteredTests={setFilteredTests}
            />
          </div>
        </div>
      </div>
      {assignTestModalActive && (
        <Modal
          title="New Assignment"
          buttonParentClassName="justify-center"
          titleClassName=" text-start pb-2"
          classname={"max-w-[700px] mx-auto"}
          cancelBtn={true}
          cancelBtnClassName="max-w-140 !bg-[rgba(38,67,95,0.20)] !text-[#26435F]"
          primaryBtn={{
            text: "Assign",
            className: "max-w-140 pl-8 pr-8 !bg-[#FFA28D] !text-white ",
            onClick: () => handleAssignTestSubmit(),
            disabled: submitBtnDisabled,

            loading: loading,
          }}
          handleClose={handleClose}
          body={
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6  gap-y-0 mb-7">
                <div className="mb-10 student-name-container">
                  <InputSearch
                    label="Student Name"
                    labelClassname="text-base-20 text-[#26435F] mb-1"
                    placeholder="Search Student"
                    placeholderClass="text-base-17-5"
                    parentClassName=" text-base-17-5 py-0 w-full"
                    inputContainerClassName=" text-base-17-5 bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                    inputClassName="bg-[#F3F5F7]"
                    type="text"
                    value={modalData.name}
                    checkbox={{
                      visible: true,
                      name: "student",
                      match: studentMultiple?.map((itt) => itt?._id),
                    }}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        name: e.target.value,
                      })
                    }
                    onOptionClose={handleOptionCLose}
                    optionListClassName="text-base-17-5"
                    optionClassName="text-base-17-5"
                    optionData={students}
                    // right={<img className="" src={down} />}
                    onOptionClick={(item) => {
                      handleMultipleStudent(item);
                      // handleTestChange(item);
                      // setStudent(item.value);
                      // handleStudentsChange(item)
                      // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                    }}
                  />
                  {/* <InputSearch
                    label="Student Name"
                    value={modalData.name}
                    onChange={(val) =>
                      setModalData({
                        ...modalData,
                        name: val.target.value,
                      })
                    }
                    placeholderClass="text-base-17-5"
                    optionData={students}
                    onOptionClick={(item) => {
                      setModalData({
                        ...modalData,
                        name: item.value,
                        studentId: item._id,
                      });
                    }}
                    optionPrefix="s"
                    parentClassName="w-full mr-4"
                    labelClassname=" !font-medium text-[#26435F] ml-2 mb-0.5 !font-semibold text-[#26435F]"

                    inputContainerClassName="px-5 py-3.5 text-base-17-5 bg-primary-50 border-0"
                    inputClassName="text-base-17-5 bg-transparent "
                    placeholder="Student Name"
                    type="select"
                  /> */}
                  <div className="flex flex-row items-center">
                    <p className="font-medium whitespace-nowrap text-container text-base-15 mt-1 text-[#667085]">
                      {selectedtext}
                    </p>

                  </div>
                </div>
                <div>
                  <InputSearch
                    placeholderClass="text-base-17-5"
                    optionData={testsData}
                    value={modalData.test}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        test: e.target.value,
                      })
                    }
                    onOptionClick={(item) => {
                      setModalData({
                        ...modalData,
                        test: item.value,
                        testId: item._id,
                      });
                    }}
                    label="Assignment"
                    placeholder="Select Assignment Name"
                    parentClassName="w-full mr-4"
                    labelClassname=" !font-medium text-[#26435F] text-base-20 ml-2 mb-0.5 !font-semibold text-[#26435F]"
                    inputContainerClassName="px-5 py-3.5 text-base-17-5 bg-primary-50 border-0"
                    inputClassName="text-base-17-5 bg-transparent"
                    type="select"
                  />
                </div>
                <div>
                  <InputSelect
                    label="Time Limit"
                    value={modalData.limit}
                    onChange={(val) =>
                      setModalData({ ...modalData, limit: val })
                    }
                    placeholderClass="text-base-17-5"
                    optionData={timeLimits}
                    parentClassName="w-full mr-4 "
                    labelClassname=" !font-medium text-[#26435F] text-base-20 ml-2 mb-1 !font-semibold text-[#26435F]"
                    inputContainerClassName="px-5 text-base-17-5 py-3.5 bg-primary-50 border-0"
                    inputClassName="text-base-17-5 bg-transparent"
                    placeholder="Select Duration"
                    type="select"
                  />
                </div>
                <div>
                  <InputField
                    label="Due Date"
                    iconSize="medium"
                    labelClassname=" !font-medium text-[#26435F] text-base-20 ml-2 mb-0.5 !font-semibold text-[#26435F]"
                    min={getCurrentDate()}
                    value={modalData.date}
                    onChange={(val) =>
                      setModalData({
                        ...modalData,
                        date: val.target.value,
                      })
                    }
                    parentClassName="w-full mr-4"
                    inputContainerClassName="px-5 py-3.5 bg-primary-50 border-0"
                    inputClassName="text-base-17-5 bg-transparent text-base-17-5"
                    placeholderClass="text-base-17-5"
                    optionData={optionData}
                    placeholder="Date"
                    type="date"
                  />
                </div>
              </div>
              <div className="relative  mx-1">
                <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
                  Assignment Instructions{" "}
                  <span className="text-[#667085]">(optional)</span>
                </p>
                <textarea
                  rows="2"
                  value={modalData.instruction}
                  onChange={(val) =>
                    setModalData({
                      ...modalData,
                      instruction: val.target.value,
                    })
                  }
                  className="mt-2 block  mb-7 resize-none focus:!ring-blue-500 p-3 focus:!border-blue-500 placeholder-[#CBD6E2] text-base-18  placeholder:text-base-18  w-full h-[100px] shadow-small  rounded-[5px]"
                  placeholder="Please add any custom instructions related to the test here. These will be visible to the students before they start a section during the assignment."
                ></textarea>
              </div>
              {/* <InputField
                label="Instruction From Tutor"
                type="text"
                iconSize="medium"

                value={modalData.instruction}
                onChange={(val) =>
                  setModalData({
                    ...modalData,
                    instruction: val.target.value,
                  })
                }
                parentClassName="w-full mr-4"
                labelClassname=" !font-medium text-[#26435F] ml-2 mb-0.5"
                
                inputContainerClassName="px-5 py-3.5 bg-primary-50 border-0 mb-5"
                inputClassName="text-base-17-5 bg-transparent text-base-17-5"
                placeholderClass="text-base-17-5"
                optionData={optionData}
                placeholder="Instruction"
              /> */}
            </>
          }
        />
      )}
      {resendModalActive && (
        <Modal
          title={
            <span className="leading-10  capitalize">
              Do you want to resend the assignments via email?
            </span>
          }
          titleClassName="mb-5 leading-10"
          cancelBtn={true}
          cancelBtnClassName="max-w-140"
          primaryBtn={{
            text: "Send Email",
            className: "w-[140px] pl-4 px-4",
            onClick: () => handleResendTestSubmit(),
            loading: resendLoading,
          }}
          handleClose={() => setResendModalActive(false)}
          classname={"max-w-[630px] mx-auto"}
        />
      )}
      {deleteModalActive && (
        <Modal
          title={
            <span className="leading-10 capitalize">
              Are you sure you want to delete the assigned test ?
            </span>
          }
          titleClassName="mb-5 leading-10"
          cancelBtn={true}
          cancelBtnClassName="w-[140px] px-3"
          primaryBtn={{
            text: "Delete",
            className: "w-[140px] pl-4 px-4",
            onClick: () => deleteTest(),
            bgDanger: true,
            loading: deleteLoading,
          }}
          handleClose={() => setDeleteModalActive(false)}
          classname={"max-w-[630px] mx-auto"}
        />
      )}
      {deleteBulkModalActive && (
        <Modal
          title={
            <span className="leading-10 capitalize">
              Are you sure you want to Delete the Assignments?
            </span>
          }
          titleClassName="mb-5 leading-10"
          cancelBtn={true}
          crossBtn={true}
          cancelBtnClassName="w-[140px] !bg-[#26435F1A] px-3  !text-[#26435F] !rounded-md"
          primaryBtn={{
            text: "Delete",
            className: "w-[140px]  pl-4 px-4 !bg-[#FF7979] text-white",
            onClick: () => bulkSelectDelete(),
            bgDanger: true,
            loading: deleteSelectLoading,
          }}
          handleClose={() => setDeleteBulkModalActive(false)}
          classname={"max-w-[630px]  mx-auto"}
        />
      )}
      {markBulkModalActive && (
        <Modal
          title={
            <span className="leading-10 whitespace-nowrap capitalize">
              Do you want to mark the Assignments As Completed?
            </span>
          }
          titleClassName="mb-5 leading-10"
          cancelBtn={true}
          crossBtn={true}
          cancelBtnClassName="w-[140px] !bg-[#26435F1A] px-4  !text-[#26435F] rounded-md"
          primaryBtn={{
            text: "Confirm",
            className: "w-[140px]  pl-4 px-4 !bg-[#32D583] text-white",
            onClick: () => markSelectDelete(),
            bgDanger: true,
            loading: markSelectLoading,
          }}
          body={
            <>
              <p className="text-base-17-5 mt-[-5px] text-[#667085] mb-6">
                <span className="font-semibold mr-1">
                  <div className="!scale-[0.8] mr-[-4px] mt-[-4px] inline-block">
                    ⚠️
                  </div>{" "}
                  Note:
                </span>
                Once the assignments are marked as “Complete”, the students will
                not be able to attempt any remaining sections and will be able
                to access the score report. Read detailed documentation in
                Evallo’s{" "}
                <span className="text-[#24A3D9]  border-b border-b-[#24A3D9] cursor-pointer" onClick={() => window.location.href = process.env.REACT_APP_SUPPORT_LINK}>
                  {" "}
                  knowledge base.
                </span>
              </p>
            </>
          }
          handleClose={() => setMarkBulkModalActive(false)}
          classname={"max-w-[630px] mx-auto"}
        />
      )}
      {resendBulkModalActive && (
        <Modal
          title={
            <span className="leading-10 whitespace-nowrap capitalize">
              Do you want to resend the assignments via email?
            </span>
          }
          titleClassName="mb-4 leading-10"
          cancelBtn={true}
          crossBtn={true}
          cancelBtnClassName="max-w-140 !bg-[#26435F1A]  !text-[#26435F] rounded-md"
          primaryBtn={{
            text: "Resend",
            className: "w-[140px]  pl-4 px-4 !bg-[#FFA28D] text-white",
            onClick: () => resendSelectDelete(),
            bgDanger: true,
            loading: resendSelectLoading,
          }}
          body={
            <>
              <p className="text-base-17-5 mt-[-5px] text-[#667085] mb-6">
                <span className="font-semibold mr-1">⚠️ Note:</span>
                This will NOT create another assignment for the students.
                Instead, it will resend the email with the PDF file (containing
                the assignment content) attached to it. Read detailed
                documentation in Evallo’s{" "}
                <span className="text-[#24A3D9] cursor-pointer border-b border-b-[#24A3D9]" onClick={() => window.location.href = process.env.REACT_APP_SUPPORT_LINK}>
                  {" "}
                  knowledge base.
                </span>
              </p>
            </>
          }
          handleClose={() => setResendBulkModalActive(false)}
          classname={"max-w-[630px]  mx-auto"}
        />
      )}
    </>
  );
}
