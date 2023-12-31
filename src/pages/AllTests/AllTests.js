import React, { useEffect, useState } from "react";
import InputSelect from "../../components/InputSelect/InputSelect";
import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import InputField from "../../components/InputField/inputField";

import AddIcon from "../../assets/icons/plus.svg";
import SearchIcon from "../../assets/icons/Search_shade.svg";
import styles from "./style.module.css";
import check from "../../assets/icons/checked 1.svg";
import data from "./tempData";
import upload from "./../../assets/icons/upload_icon.svg";
// import Papa from "papaparse";
import axios from "axios";
import { useAddPdfMutation, useAddTestMutation } from "../../app/services/test";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import StudentTest from "../StudentTest/StudentTest";
import FilterItems from "../../components/FilterItems/filterItems";
import { useSelector } from "react-redux";
import { json, useNavigate } from "react-router-dom";
import { getFormattedDateTime } from "../../utils/utils";

const optionData = ["option 1", "option 2", "option 3", "option 4", "option 5"];
const testTypeOptions = ["DSAT®", "SAT®", "ACT®", "Other"];

const initialState = {
  testName: "",
  dateModified: "",
  testType: "",
};
const tableHeaders = [
  "Assignment Name",
  "Type",
  "Created On",
  "Last Modified",
  "Total Assignments",
  "",
  "",
];

const SORT_STATES = {
  ASCENDING_ORDER: "ASCENDING_ORDER",
  DESCENDING_ORDER: "DESCENDING_ORDER",
  UNSORTED: "UNSORTED",
};

export default function AllTests({
  isOwn,
  setTotaltest,
  studentId,
  fromProfile,
}) {
  const { organization } = useSelector((state) => state.organization);
  const { firstName, lastName } = useSelector((state) => state.user);
  const [tableData, setTableData] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [testName, setTestName] = useState("");
  const [pdfFile, setPDFFile] = useState(null);
  const [csvFile, setCSVFile] = useState(null);
  const [csvError, setCSVError] = useState("");
  const [PDFError, setPDFError] = useState("");
  const [testForDelete, setTestForDelete] = useState("");
  const [filteredTests, setFilteredTests] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [testtype2, settesttype2] = useState();
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [removeQuestionModal, setRemoveQuestionModal] = useState(false);
  const [submitTest, submitTestResp] = useAddTestMutation();
  const [submitPdf, submitPdfResp] = useAddPdfMutation();
  const [modalData, setModalData] = useState(initialState);
  const [sortOrder, setSortOrder] = useState({
    testName: false,
    createdAt: false,
    updatedAt: false,
    testType: false,
  });
  const [assignmentNameSortState, setAssignmentNameSortState] = useState(
    SORT_STATES.UNSORTED
  );
  const [typeSortState, setTypeSortState] = useState(SORT_STATES.UNSORTED);
  const [createdOnSortState, setCreatedOnSortState] = useState(
    SORT_STATES.UNSORTED
  );
  const [lastModifiedSortState, setLastModifiedSortState] = useState(
    SORT_STATES.UNSORTED
  );
  const [totalAssignmentsSortState, setTotalAssignmentsSortState] = useState(
    SORT_STATES.UNSORTED
  );

  const sortByString = (st) => {
    setFilteredTests((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        let fl = a[st].localeCompare(b[st]);
        if (sortOrder[st]) return fl <= 0;
        else return fl > 0;
      });

      return arr;
    });

    setSortOrder({
      ...sortOrder,
      [st]: !sortOrder[st],
    });
  };

  const sortByAssignmentName = () => {
    console.log("sortByAssignmentName");
    if (assignmentNameSortState === SORT_STATES.DESCENDING_ORDER) {
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

      setAssignmentNameSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (
      assignmentNameSortState === SORT_STATES.UNSORTED ||
      assignmentNameSortState === SORT_STATES.ASCENDING_ORDER
    ) {
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

      setAssignmentNameSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const sortByType = () => {
    console.log("sortByType");
    if (typeSortState === SORT_STATES.DESCENDING_ORDER) {
      setFilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.testType < b.testType) {
            return -1;
          }
          if (a.testType > b.testType) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setTypeSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (
      typeSortState === SORT_STATES.UNSORTED ||
      typeSortState === SORT_STATES.ASCENDING_ORDER
    ) {
      setFilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.testType < b.testType) {
            return 1;
          }
          if (a.testType > b.testType) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setTypeSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const sortByTotalAssignments = () => {
    console.log("data");
    console.log(filteredTests);

    console.log("sortByTotalAssignments");
    if (totalAssignmentsSortState === SORT_STATES.DESCENDING_ORDER) {
      setFilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.no_of_assign < b.no_of_assign) {
            return -1;
          }
          if (a.no_of_assign > b.no_of_assign) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setTotalAssignmentsSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (
      totalAssignmentsSortState === SORT_STATES.UNSORTED ||
      totalAssignmentsSortState === SORT_STATES.ASCENDING_ORDER
    ) {
      setFilteredTests((prev) => {
        let arr = [...prev];
        arr = arr.sort(function (a, b) {
          if (a.no_of_assign < b.no_of_assign) {
            return 1;
          }
          if (a.no_of_assign > b.no_of_assign) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setTotalAssignmentsSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const sortBycreateDate = () => {
    if (createdOnSortState === SORT_STATES.DESCENDING_ORDER) {
      setFilteredTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.createdAt) < new Date(b.createdAt)) {
            return -1;
          }
          if (new Date(a.createdAt) > new Date(b.createdAt)) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setCreatedOnSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (
      createdOnSortState === SORT_STATES.UNSORTED ||
      createdOnSortState === SORT_STATES.ASCENDING_ORDER
    ) {
      setFilteredTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.createdAt) < new Date(b.createdAt)) {
            return 1;
          }
          if (new Date(a.createdAt) > new Date(b.createdAt)) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setCreatedOnSortState(SORT_STATES.DESCENDING_ORDER);
    }

    /* setFilteredTests((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        if (sortOrder.createdAt)
          return new Date(a.createdAt) - new Date(b.createdAt);
        else
          return new Date(b.createdAt) - new Date(a.createdAt);
      });
      return arr;
    });
    setSortOrder({
      ...sortOrder,
      createdAt: !sortOrder.createdAt
    }) */
  };

  const sortByAssignedDate = () => {
    if (lastModifiedSortState === SORT_STATES.DESCENDING_ORDER) {
      setFilteredTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.updatedAt) < new Date(b.updatedAt)) {
            return -1;
          }
          if (new Date(a.updatedAt) > new Date(b.updatedAt)) {
            return 1;
          }
          return 0;
        });
        return arr;
      });

      setLastModifiedSortState(SORT_STATES.ASCENDING_ORDER);
    } else if (
      lastModifiedSortState === SORT_STATES.UNSORTED ||
      lastModifiedSortState === SORT_STATES.ASCENDING_ORDER
    ) {
      setFilteredTests((prev) => {
        let arr = [...prev];
        //console.log("arr", arr);
        arr = arr.sort(function (a, b) {
          if (new Date(a.updatedAt) < new Date(b.updatedAt)) {
            return 1;
          }
          if (new Date(a.updatedAt) > new Date(b.updatedAt)) {
            return -1;
          }
          return 0;
        });
        return arr;
      });

      setLastModifiedSortState(SORT_STATES.DESCENDING_ORDER);
    }
  };

  const tableObjHeaders = [
    {
      id: 1,
      text: "Assignment Name",
      // className: "text-left pl-6",
      // className:"pl-3",
      // onCick: () => sortByString("testName"),
      onCick: sortByAssignmentName,
      willDisplayDownArrow:
        assignmentNameSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 2,
      text: "Type",
      // onCick: () => sortByString("testType"),
      onCick: sortByType,
      className:"pl-7",
      willDisplayDownArrow: typeSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 3,
      text: "Created On",
      onCick: sortBycreateDate,
      willDisplayDownArrow: createdOnSortState !== SORT_STATES.DESCENDING_ORDER,
    },

    {
      id: 4,
      text: "Last Modified",
      onCick: sortByAssignedDate,
      willDisplayDownArrow:
        lastModifiedSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 5,
      text: "Total Assignments",
      onCick: sortByTotalAssignments, // no_of_assign
      willDisplayDownArrow:
        totalAssignmentsSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 6,
      text: "",
      noArrow: true,
    },
    {
      id: 7,
      text: "",
      noArrow: true,
    },
  ];

  useEffect(() => {
    if (
      modalData.testName.trim() === "" ||
      modalData.testType.trim() === "" ||
      csvFile === null
    ) {
      setSubmitBtnDisabled(true);
    } else if (
      (pdfFile === null || csvFile === null) &&
      !getTestType(modalData.testType).includes("DSAT")
    ) {
      setSubmitBtnDisabled(true);
    } else if (
      csvFile != null &&
      getTestType(modalData.testType).includes("DSAT") &&
      modalData.testName.length > 0
    ) {
      setSubmitBtnDisabled(false);
    } else {
      setSubmitBtnDisabled(false);
    }
  }, [modalData, csvFile]);

  const handleClose = () => {
    setModalActive(false);
    setModalData(initialState);
    setPDFFile(null);
    setCSVFile(null);
  };
  const closeRemoveModal = () => setRemoveQuestionModal(false);

  const { role: persona } = useSelector((state) => state.user);

  const openRemoveTestModal = (item) => {
    setRemoveQuestionModal(true);
    setTestForDelete(item);
  };
  // console.log({ testForDelete })
  const removeTest = (item) => {
    setRemoveQuestionModal(false);
    // console.log(testForDelete._id);
    axios
      .delete(`${BASE_URL}api/test/${testForDelete._id}`, {
        headers: getAuthHeader(),
      })
      .then((res) => {
        console.log(res);
        fetchTests();
      });
  };

  useEffect(() => {
    setFilteredTests(tableData);
  }, [tableData]);

  const handlePDFFile = (file) => {
    // if (file.type.includes("pdf")) {
    setPDFError("");
    setPDFFile(file);
  };

  const handleCSVFile = (file) => {
    if (file.type.includes("csv")) {
      setCSVError("");
      setCSVFile(file);
    } else {
      setCSVFile(null);
      setCSVError("Not a CSV File");
    }
  };

  const getTestType = (type) => {
    return type === "SAT®"
      ? "SAT®"
      : type === "ACT®"
      ? "ACT®"
      : type === "DSAT®"
      ? "DSAT®"
      : type;
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setSubmitBtnDisabled(true);
    // console.log(modalData)
    let body = {
      testName: modalData.testName,
      testType: getTestType(modalData.testType).includes("®")
        ? getTestType(modalData.testType).slice(0, -1)
        : getTestType(modalData.testType),
      ...(!getTestType(modalData.testType).includes("DSAT")
        ? { pdf: pdfFile }
        : {}),
      file: csvFile,
    };
    const formData = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });
    console.log(formData);

    await axios
      .post(`${BASE_URL}api/test/add/addNewTest`, formData, {
        headers: getAuthHeader(),
      })
      .then((res) => {
        alert("Test metadata uploaded");
        console.log("csv post resp", res);
        setModalData(initialState);
        setModalActive(false);
        setCSVFile(null);
        setPDFFile(null);
      })
      .catch((err) => {
        // setModalData(initialState);
        // // setModalActive(false);
        // setCSVFile(null);
        // setPDFFile(null);
        if (err?.response?.data) {
          alert(err?.response?.data?.message);
        }
      });
    setLoading(false);
    fetchTests();
    setSubmitBtnDisabled(false);
    console.log("submitted");
  };

  useEffect(() => {
    if (tableData.length === 0) return;
    const regex2 = new RegExp(`${testName.toLowerCase()}`, "i");
    let tempdata = tableData.filter((test) => test.testName.match(regex2));
    setFilteredTests(tempdata);
  }, [testName]);

  // console.log(testName);
  //console.log(tableData);
  console.log("filteredTests", filteredTests);

  const fetchTests = () => {
    const headers = getAuthHeader();
    axios.get(`${BASE_URL}api/test`, { headers }).then((res) => {
      console.log("all test content", res.data.data.test);
      let dataofque = res.data.data.test;
      let tempSuper = [];
      let testAdmin = [];
      res.data.data.test?.map((it) => {
        if (
          it?.hasOwnProperty("superAdminTestQnId") &&
          it?.superAdminTestQnId !== null
        ) {
          tempSuper.push(it);
        } else {
          testAdmin.push(it);
        }
      });
      let finalTests = [...testAdmin];
      tempSuper?.map((itt) => {
        let f = true;
        testAdmin?.map((mit) => {
          if (itt?.testName?.trim() === mit?.testName?.trim()) {
            f = false;
          }
        });
        if (f) {
          finalTests.push(itt);
        } else {
          console.log("all hidden test", itt, tempSuper);
        }
      });

      console.log("all test super  content", finalTests);
      finalTests?.sort(
        (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
      );
      let cutdata = finalTests.map((item) => ({
        testId: item._id,
        testtype: item.testType,
      }));
      console.log(cutdata);
      settesttype2(cutdata);
      setTableData(finalTests);
    });
  };
  const navigate = useNavigate("/");
  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    console.log(testtype2);
  }, [testtype2]);
  
  if (fromProfile)
    return (
      <StudentTest
        testtype={testtype2}
        isOwn={isOwn}
        setTotaltest={setTotaltest}
        studentId={studentId}
        fromProfile={true}
      />
    );
  else if (persona === "parent" || persona === "student")
    return <StudentTest testtype={testtype2} />;

  return (
    <div className="w-[1920px] flex justify-center items-center">
      <div className="w-[1600px] h-auto mt-[50px] mb-[112.17px]">
        <p className="text-[#24A3D9] text-[20px] mb-[25px]">
          <span onClick={() => navigate("/")} className="cursor-pointer">
            {organization?.company +
              "  >  " +
              firstName +
              "  " +
              lastName +
              "  >  "}
          </span>
          <span className="font-semibold">Content</span>
        </p>

        <div className=" w-full">
          <div className="flex justify-between items-center">
          
            <InputField
              value={testName}
              IconRight={SearchIcon}
              onChange={(e) => setTestName(e.target.value)}
              optionData={optionData}
              placeholder="Search"
              parentClassName="w-[375px] h-[50px]"
              inputClassName="placeholder:text-[#667085] pl-2 text-[17.5px]"
              inputContainerClassName="bg-white border pt-3.5 pb-3.5 !rounded-lg"
              type="select"
            />
            <button
              className="bg-[#FFA28D] w-[200px] h-[50px] flex justify-center items-center text-white  rounded-lg text-[15px]"
              onClick={() => setModalActive(true)}
            >
              <span className="text-[15px]"> Add New Material</span>
              <img
                src={AddIcon}
                className="ml-[5px] h-[25px] w-[25px]"
                alt="add-icon"
              />
            </button>
          </div>

          <div className="mt-[37.5px] w-[1600px]">
            <Table
            tableClass="table-auto !mt-0"
              widthFullTable={true}
              testtype={testtype2}
              dataFor="allTests"
              data={filteredTests}
              tableHeaders={tableObjHeaders}
              headerObject={true}
              maxPageSize={30}
              onClick={{ openRemoveTestModal }}
            />
          </div>
        </div>

        {modalActive && (
          <Modal
            crossBtn={true}
            title="Upload New Material"
            titleClassName="text-start text-sm mb-3"
            classname={"max-w-[600px] mx-auto"}
            primaryBtn={{
              text: "Create  ",
              form: "add-test-form",
              onClick: handleSubmit,
              type: "submit",
              className:
                "!ml-5 text-sm  py-1 mr-auto mt-7 w-[137.33px] h-[53.33px] flex gap-2 px-4 disabled:opacity-80 flex items-center  text-sm !font-medium  inline-block bg-[#FFA28D]",
              disabled: submitBtnDisabled,
              loading: loading,
              icon: (
                <img
                  src={check}
                  alt="check"
                  className="ml-2 inline-block mt-[-8px]"
                />
              ),
            }}
            otherBt={
              <div id={styles.handleFileUpload}>
                <div
                  id={styles.uploadButtons}
                  className="mt-7 px-0 gap-5 flex justify-between  "
                >
                  {modalData.testType !== "DSAT®" ? (
                    <div id={styles.pdfUpload}>
                      <label
                        htmlFor="pdf"
                        className={`${
                          pdfFile !== null ? "bg-[#26435F] " : "bg-[#26435F] "
                        } w-[173px] h-[53.33px] text-sm !font-medium text-center pl-5 flex justify-center items-center`}
                      >
                        Upload PDF
                        <img src={upload} alt="Upload" />
                      </label>
                      <div className={styles.error}>{PDFError}</div>
                      <input
                        id="pdf"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handlePDFFile(e.target.files[0])}
                      />
                      <div id={styles.filename}>
                        {pdfFile?.name || pdfFile?.name}
                      </div>
                    </div>
                  ) : null}

                  <div className="" id={styles.csvUpload}>
                    <label
                      htmlFor="csv"
                      className={`${
                        csvFile !== null && styles.fileUploaded
                          ? "bg-[#26435F] "
                          : "bg-[#26435F] "
                      } w-[209px] h-[53.33px] text-sm !font-medium text-center flex justify-center items-center`}
                    >
                      Upload Metadata
                      <img src={upload} alt="Upload" />
                    </label>
                    <div className={styles.error}>{csvError}</div>
                    <input
                      id="csv"
                      type="file"
                      accept=".xls,.xlsx"
                      // onChange={e => {
                      onChange={(e) => setCSVFile(e.target.files[0])}
                    />
                    <div id={styles.filename}>
                      {csvFile ? csvFile?.name : ""}
                    </div>
                  </div>
                </div>
                {/* 
                     <div id={styles.filename}>
                        {pdfFile?.name || csvFile?.name}
                     </div> */}
              </div>
            }
            handleClose={handleClose}
            body={
              <form onSubmit={handleSubmit} id="add-test-form">
                <div className="w-full flex justify-between items-center">
                  <InputField
                    label="Assignment Name"
                    labelClassname="ml-2 mb-1.2 text-[#26435F] !text-[16px] "
                    biggerText={true}
                    optionData={optionData}
                    placeholder="Text"
                    parentClassName="w-full mr-[33.33px] mt-1"
                    inputContainerClassName="pt-3 pb-3 bg-primary-50"
                    inputClassName="bg-transparent"
                    type="select"
                    isRequired={true}
                    value={modalData.testName}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        testName: e.target.value,
                      })
                    }
                  />

                  <InputSelect
                    label="Type"
                    labelClassname="ml-2 !font-semibold mb-[9px] mt-1 !text-[#26435F]  !text-[16px]"
                    biggerText={true}
                    optionData={testTypeOptions}
                    placeholder="Select"
                    inputContainerClassName="pt-3 pb-3 bg-primary-50 h-[45px]"
                    parentClassName="w-full"
                    inputClassName="bg-transparent"
                    isRequired={true}
                    type="select"
                    valueSuffix={<span>&#174;</span>}
                    value={modalData.testType}
                    onChange={(val) =>
                      setModalData({
                        ...modalData,
                        testType: val,
                      })
                    }
                  />
                </div>
              </form>
            }
          />
        )}
        {removeQuestionModal && (
          <Modal
            title={
              <>
                Are you sure you want to Delete{" "}
                {testForDelete?.testName ? testForDelete?.testName : "Test"}?
              </>
            }
            titleClassName="leading-9 mb-2"
            cancelBtn={true}
            cancelBtnClassName="py-4 !bg-[#26435F1A]  !text-[#26435F] rounded-[5px]"
            primaryBtn={{
              text: "Delete",
              className: "bg-danger  w-[123px]  pl-4 pr-4",
              onClick: removeTest,
            }}
            handleClose={closeRemoveModal}
            body={<div className="mb-10"></div>}
            classname={"max-w-[600px] !mx-auto"}
          />
        )}
      </div>
    </div>
  );
}
