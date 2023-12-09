import React, { useEffect, useState } from "react";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import Table from "../../../../components/Table/Table";
import Modal from "../../../../components/Modal/Modal";
import InputField from "../../../../components/InputField/inputField";

import AddIcon from "../../../../assets/icons/plus.png";
import SearchIcon from "../../../../assets/icons/search.svg";
import styles from "./style.module.css";
import upload from "../../../../assets/icons/upload_icon.svg";
import check from "../../../../assets/icons/checked 1.svg";
import axios from "axios";
import {
  useAddPdfMutation,
  useAddTestMutation,
} from "../../../../app/services/test";
import { BASE_URL, getAuthHeader } from "../../../../app/constants/constants";
import StudentTest from "../../../StudentTest/StudentTest";
import FilterItems from "../../../../components/FilterItems/filterItems";
import { useSelector } from "react-redux";

const optionData = ["option 1", "option 2", "option 3", "option 4", "option 5"];
const testTypeOptions = ["DSAT®", "SAT®", "ACT®","Other"];
/* const tableHeaders = [
  "Assignment",
  "Type",
  "Created On",
  "Last Modified",
  "Total Assigned",
  "View",
  "",
  "Available For",
]; */

const initialState = {
  testName: "",
  dateModified: "",
  testType: "",
};

const SORT_STATES = {
  ASCENDING_ORDER: "ASCENDING_ORDER",
  DESCENDING_ORDER: "DESCENDING_ORDER",
  UNSORTED: "UNSORTED",
}

export default function AllTests() {
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
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [removeQuestionModal, setRemoveQuestionModal] = useState(false);
  const [submitTest, submitTestResp] = useAddTestMutation();
  const [submitPdf, submitPdfResp] = useAddPdfMutation();
  const [modalData, setModalData] = useState(initialState);
  const [assignmentSortState, setAssignmentSortState] = useState(SORT_STATES.UNSORTED);
  const [typeSortState, setTypeSortState] = useState(SORT_STATES.UNSORTED);
  const [createdOnSortState, setCreatedOnSortState] = useState(SORT_STATES.UNSORTED);
  const [lastModifiedSortState, setLastModifiedSortState] = useState(SORT_STATES.UNSORTED);
  const [totalAssignedSortState, setTotalAssignedSortState] = useState(SORT_STATES.UNSORTED);

  const sortByAssignment = () => {
    // setFilteredTests
    console.log("sortByAssignment");
    if(assignmentSortState === SORT_STATES.DESCENDING_ORDER) {
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

      setAssignmentSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if(assignmentSortState === SORT_STATES.UNSORTED || assignmentSortState === SORT_STATES.ASCENDING_ORDER) {
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

      setAssignmentSortState(SORT_STATES.DESCENDING_ORDER);
    }
  }

  const sortByType = () => {
    console.log("sortByType");
    if(typeSortState === SORT_STATES.DESCENDING_ORDER) {
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
    }
    else if(typeSortState === SORT_STATES.UNSORTED || typeSortState === SORT_STATES.ASCENDING_ORDER) {
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
  }

  const sortBycreateDate = () => {

    if(createdOnSortState === SORT_STATES.DESCENDING_ORDER) { 
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
    }
    else if(createdOnSortState === SORT_STATES.UNSORTED || createdOnSortState === SORT_STATES.ASCENDING_ORDER) {  
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
  };

  const sortByLastModified = () => {

    if(lastModifiedSortState === SORT_STATES.DESCENDING_ORDER) { 
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
    }
    else if(lastModifiedSortState === SORT_STATES.UNSORTED || lastModifiedSortState === SORT_STATES.ASCENDING_ORDER) {  
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

  const sortByTotalAssigned = () => {
    console.log("data");
    console.log(filteredTests);

    console.log("sortByTotalAssigned");
    if(totalAssignedSortState === SORT_STATES.DESCENDING_ORDER) {
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

      setTotalAssignedSortState(SORT_STATES.ASCENDING_ORDER);
    }
    else if(totalAssignedSortState === SORT_STATES.UNSORTED || totalAssignedSortState === SORT_STATES.ASCENDING_ORDER) {
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

      setTotalAssignedSortState(SORT_STATES.DESCENDING_ORDER);
    }
  }

  const tableHeaders = [
    {
      id: 1,
      text: "Assignment", //testName
      onCick: sortByAssignment,
      willDisplayDownArrow: assignmentSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 2,
      text: "Type", // testType
      onCick: sortByType,
      willDisplayDownArrow: typeSortState !== SORT_STATES.DESCENDING_ORDER,
      className:'pr-[50px]'
    },
    {
      id: 3,
      text: "Created On", // createdAt
      onCick: sortBycreateDate,
      willDisplayDownArrow: createdOnSortState !== SORT_STATES.DESCENDING_ORDER,
      className:'pl-[50px]'
    },
    {
      id: 4,
      text: "Last Modified", // updatedAt
      onCick: sortByLastModified,
      willDisplayDownArrow: lastModifiedSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 5,
      text: "Total Assigned", // no_of_assign
      onCick: sortByTotalAssigned,
      willDisplayDownArrow: totalAssignedSortState !== SORT_STATES.DESCENDING_ORDER,
    },
    {
      id: 6,
      text: "View",
      noArrow: true
    },
    {
      id: 7,
      text: "",
      noArrow: true
    },
    {
      id: 8,
      text: "Available For",
      noArrow: true
    },
  ];

  useEffect(() => {
    if (
      modalData.testName.trim() === "" ||
      modalData.testType.trim() === "" ||
      csvFile === null
    ) {
      setSubmitBtnDisabled(true);
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
    let arr=tableData?.sort((a,b) =>{return new Date(b.createdAt)-new Date(a.createdAt)})
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

  const handleSubmit = async(e) => {
    setLoading(true);
    e.preventDefault();
    setSubmitBtnDisabled(true);
    // console.log(modalData)
    let body = {
      testName: modalData.testName,
      testType: modalData.testType.includes('®')?modalData.testType.slice(0, -1):modalData.testType,
      ...(!modalData.testType.includes('DSAT')?{pdf:pdfFile}:{}),
      file:csvFile
    };
    const formData = new FormData();

    Object.entries(body).forEach(([key, value]) =>{
  formData.append(key, value);
})
    console.log(formData);
    
        await axios
        .post(`${BASE_URL}api/test/add/addNewTest`, formData, {
              headers: getAuthHeader(),
          })
          .then((res) => {
            alert("CSV UPLOADED");
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
                  alert(err?.response?.data);
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
  // console.log(tableData);
  // console.log('filteredTests', filteredTests);

  const fetchTests = () => {
    const headers = getAuthHeader();
    axios
      .get(`${BASE_URL}api/test/${persona}/getAllTest`, { headers })
      .then((res) => {
        console.log("res", res.data.data);
        setTableData(res.data.data);
      });
  };

  useEffect(() => {
    fetchTests();
  }, []);

  if (persona === "parent" || persona === "student") return <StudentTest />;

  return (
    <div className=" bg-lightWhite min-h-screen">
      <div className="py-14  pt-0">
        <div className="flex justify-end items-center w-[1700px]">
          <button
            className="bg-[#FFA28D] py-3.5 px-6 flex items-center text-white  rounded-lg "
            onClick={() => setModalActive(true)}
          >
            New Test
            <img src={AddIcon} className="ml-3" />
          </button>
        </div>
        {/* <div className="flex align-center mt-8">
               <InputField
                  value={testName}
                  IconRight={SearchIcon}
                  onChange={(e) => setTestName(e.target.value)}
                  optionData={optionData}
                  placeholder="Test Name"
                  parentClassName="w-290 mr-4"
                  inputContainerClassName="bg-white border pt-3.5 pb-3.5"
                  type="select"
               />
            </div> */}

        <div className="mt-6 w-[1700px] ">
          <Table
          widthFullTable={true}
          theadWidth={"w-[1700px]"}
            headerWidth="pl-6 pr-1"
            // noArrow={true}
            dataFor="allTestsSuperAdmin"
            data={filteredTests}
            tableHeaders={tableHeaders}
            wrapperClassName={'pl-2'}
            headerObject={true}
            maxPageSize={10}
            onClick={{ openRemoveTestModal }}
            hidePagination={true}
          />
        </div>
      </div>
      {modalActive && (
        <Modal
          title="Upload New Material"
          titleClassName="text-start text-sm mb-3"
          classname={"max-w-[630px] mx-auto"}
          primaryBtn={{
            text: "Create  ",
            form: "add-test-form",
            onClick: handleSubmit,
            type: "submit",
            className:
              "!ml-5   py-1 mr-auto mt-7  flex gap-2  h-[49px] disabled:opacity-80 flex items-center !text-[0.8333vw] !font-medium  inline-block bg-[#FFA28D]",
            disabled: submitBtnDisabled,
            loading: loading,
            icon: <img src={check} alt="check" className="ml-2 inline-block" />,
          }}
          otherBt={
            <div id={styles.handleFileUpload}>
              <div
                id={styles.uploadButtons}
                className="mt-7   px-0  gap-5 flex justify-between"
              >
                {modalData.testType != "DSAT®" ? (
                  <div id={styles.pdfUpload}>
                    <label
                      htmlFor="pdf"
                      className={`${
                        pdfFile !== null ? "bg-[#26435F] " : "bg-[#26435F] "
                      } w-[8.9vw] min-w-[160px] text-sm !font-medium`}
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

                <div id={styles.csvUpload}>
                  <label
                    htmlFor="csv"
                    className={`${
                      csvFile !== null && styles.fileUploaded
                        ? "bg-[#26435F] "
                        : "bg-[#26435F] "
                    } w-[11vw] min-w-[185px] text-sm !font-medium`}
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
                  <div id={styles.filename}>{csvFile ? csvFile?.name : ""}</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 !items-center  gap-y-4">
                <InputField
                  label="Assignment Name"
                  labelClassname="ml-2 mb-1.2 text-[#26435F] !text-[16px] "
                  biggerText={true}
                  optionData={optionData}
                  placeholder="Text"
                  parentClassName="w-full mr-4 mt-1"
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
                  labelClassname="ml-2   !font-semibold mb-[9px] mt-1 !text-[#26435F]  !text-[16px]"
                  biggerText={true}
                  optionData={testTypeOptions}
                  placeholder="Select"
                  inputContainerClassName="pt-3 pb-3 bg-primary-50 h-[45px]"
                  parentClassName="w-full mr-4"
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
              Are you sure <br />
              you want to remove the test ?
            </>
          }
          titleClassName="leading-9"
          cancelBtn={true}
          cancelBtnClassName="py-4"
          primaryBtn={{
            text: "Remove",
            className: "bg-danger w-[123px] pl-4 pr-4",
            onClick: removeTest,
          }}
          handleClose={closeRemoveModal}
          body={<div className="mb-10"></div>}
          classname={"max-w-567 mx-auto"}
        />
      )}
    </div>
  );
}
