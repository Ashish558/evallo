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

export default function StudentTest({ fromProfile, setTotaltest,studentId }) {
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

  const sortByDueDate = () => {
    setAllTests((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        return new Date(b.dueDate) - new Date(a.dueDate);
      });
      return arr;
    });
    setfilteredTests((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        return new Date(b.dueDate) - new Date(a.dueDate);
      });
      return arr;
    });
  };

  const sortByAssignedDate = () => {
    setAllTests((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        return new Date(b.assignedOn) - new Date(a.assignedOn);
      });
      return arr;
    });
    setfilteredTests((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        return new Date(b.assignedOn) - new Date(a.assignedOn);
      });
      return arr;
    });
  };

  const studentTableHeaders = [
    {
      id: 1,
      text: "Assignment Name",
      className: "text-left pl-6",
    },
    {
      id: 2,
      text: "Assigned on",
      onCick: sortByAssignedDate,
    },

    {
      id: 3,
      text: "Due Date",
      onCick: sortByDueDate,
    },
    
    {
      id: 5,
      text: "Duration",
    },
    {
      id: 1,
      text: "Status",
    },
    {
      id: 6,
      text: "Scores",
    },
    {
      id: 7,
      text: "",
    },
  ];
  const [tableHeaders, setTableHeaders] = useState(studentTableHeaders);
  const params = useParams()
  useEffect(() => {
    if (persona === "student"||true) {
      getTest(studentId).then((res) => {
        console.log("all-assigned-tests", res.data.data);
        setAwsLink(res.data.data.baseLink);
        let tempAllTests = res.data.data.test.map((test) => {
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
          if (testId === null) return;
          console.log("test inside test", test)
          return {
           // assignedBy: assignedBy ? assignedBy.firstName + " " + assignedBy.lastName : "-",

            testName: testId ? testId.testName : "-",
            assignedOn: getFormattedDate(new Date(createdAt), dateFormat),
            studentId: studentId ? studentId : "-",
            dueDate: getFormattedDate(new Date(test.dueDate), dateFormat),
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
        });

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
        console.log("assigned test parent resp", res.data);
        let tempAllTests = res.data.data.test.map((test) => {
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
          if (testId === null) return;
          console.log("parent", test)
          return {
           // assignedBy: assignedBy ? assignedBy.firstName + " " + assignedBy.lastName : "-",
            testName: testId ? testId.testName : "-",
            assignedOn:new Date(createdAt).toLocaleDateString(),
            studentId: studentId ? studentId : "-",
            dueDate:new Date(test.dueDate).toLocaleDateString(),
            duration: multiple ? getDuration(multiple) : "Unlimited",
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
            assignedTestId: test._id,
            updatedAt,
          };
        });
        let sortedArr = tempAllTests.sort(function (a, b) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        console.log({ tempAllTests, sortedArr })
        setAllTests(sortedArr.filter((item) => item !== undefined));
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
  console.log({ selectedStudent, associatedStudents })
  console.log({ allTests })
  const navigate=useNavigate()
  useEffect(() => {
    if (selectedStudent === null) return;
    if (Object.keys(selectedStudent).length === 0) return;
    if (allTests.length === 0) return;

    const selected = associatedStudents.find(
      (student) => student.selected === true
    );
    if (!selected) return;
    let tempdata = allTests.filter(
      (test) => test.studentId._id === selected._id
    );
    setfilteredTests(tempdata);
  }, [selectedStudent,associatedStudents, allTests]);

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

  return (
    <div className="w-[83.23vw] mx-auto">
      <div className={`  ${fromProfile ? '!mx-0' : 'min-h-screen'}`}>
        <div className={`pb-4 mt-[35px]  ${fromProfile ? 'px-0 py-0 ' : ''}`}>
          {(persona === "student" || persona === "parent") && !fromProfile && (
            <div
              className={`${persona === "student" || true ? "flex justify-between items-center" : ""
                }`}
            >
              <p className="text-[#24A3D9]   text-base-20">
               <span className="cursor-pointer" onClick={()=>navigate('/')}>
               {organization?.company +
                  "  >  " +
                  firstName +
                  "  " +
                  lastName +
                  "  >  "}
               </span>
                <span className="font-semibold">Assignments</span>
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
              noArrow={true}
              dataFor="assignedTestsStudents"
              headerObject={true}
              data={persona === "parent" ? filteredTests : allTests}
              tableHeaders={tableHeaders}
              maxPageSize={10}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
