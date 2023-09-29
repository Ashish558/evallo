import React, { useEffect, useState } from "react";
import InputSelect from "../../components/InputSelect/InputSelect";
import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import InputField from "../../components/InputField/inputField";

import AddIcon from "../../assets/icons/plus.svg";
import SearchIcon from "../../assets/icons/search.svg";
import styles from "./style.module.css";
import check from "../../assets/icons/Group 31477.svg";
import data from "./tempData";
import upload from "./../../assets/icons/upload.png";
import Papa from "papaparse";
import axios from "axios";
import { useAddPdfMutation, useAddTestMutation } from "../../app/services/test";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import StudentTest from "../StudentTest/StudentTest";
import FilterItems from "../../components/FilterItems/filterItems";
import { useSelector } from "react-redux";

const optionData = ["option 1", "option 2", "option 3", "option 4", "option 5"];
const testTypeOptions = ["DSAT","SAT", "Other"];

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

export default function AllTests() {
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
  const [sortOrder,setSortOrder]= useState({
    testName:false,
    createdAt:false,
    updatedAt:false,
    testType:false,
  })


  const sortByString = (st) => {
    setFilteredTests((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        let fl=a[st].localeCompare(b[st])
        if(sortOrder[st])
        return fl<=0;
        else
        return fl>0;
      });
      
      return arr;
    });
    setSortOrder({
      ...sortOrder,
      [st]:!sortOrder[st]
    })
  };


const sortBycreateDate = () => {
  setFilteredTests((prev) => {
    let arr = [...prev];
    arr = arr.sort(function (a, b) {
      if(sortOrder.createdAt)
      return new Date(a.createdAt) - new Date(b.createdAt);
        else
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return arr;
  });
  setSortOrder({
    ...sortOrder,
    createdAt:!sortOrder.createdAt
  })
};
  const sortByAssignedDate = () => {
    setFilteredTests((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        if(sortOrder.updatedAt)
        return new Date(a.updatedAt) - new Date(b.updatedAt);
          else
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
      return arr;
    });
    setSortOrder({
      ...sortOrder,
      updatedAt:!sortOrder.updatedAt
    })
  };

  const tableObjHeaders = [
 
    
    {
      id: 1,
      text: "Assignment Name",
      className: "text-left pl-6",
      onCick:()=> sortByString("testName"),
    },
    {
      id: 2,
      text: "Type",
      onCick:()=> sortByString("testType"),
    },
    {
      id: 3,
      text: "Created On",
      onCick: sortBycreateDate,
    },

    {
      id: 4,
      text: "Last Modified",
      onCick: sortByAssignedDate,
    },
    {
      id: 5,
      text: "Total Assignments",
      
    },
    {
      id: 6,
      text: "",
      
    },
    {
      id: 7,
      text: "",
      
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
    axios.delete(`${BASE_URL}api/test/${testForDelete._id}`, {headers: getAuthHeader() }).then((res) => {
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

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    setSubmitBtnDisabled(true);
    // console.log(modalData)
    let body = {
      testName: modalData.testName,
      testType: modalData.testType,
    };

    submitTest(body).then(async (res) => {
      // console.log(res);
      if (res.error) {
        alert(res.error.data.message);
        setLoading(false);
        return;
      }
      let testId = res.data.data.test._id;
      const formData = new FormData();
      formData.append("pdf", pdfFile);

      if (pdfFile !== null) {
        console.log(pdfFile);
        await axios
          .post(`${BASE_URL}api/test/addpdf/${testId}`, formData, {
            headers: getAuthHeader(),
          })
          .then((res) => {
            console.log("pdf post resp", res);
            alert("PDF UPLOADED");
            if (csvFile === null) {
              setModalData(initialState);
              setModalActive(false);
              setPDFFile(null);
            }
          })
          .catch((err) => {
            console.log("pdf err", err.response);
          });
      }

      if (csvFile !== null) {
        const formData = new FormData();
        formData.append("file", csvFile);
        await axios
          .post(`${BASE_URL}api/test/addans/${testId}`, formData, {
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
            console.log("excel err", err.response);
            axios.delete(`${BASE_URL}api/test/${testId}`).then((res) => {
              // console.log(res);
              setModalData(initialState);
              setModalActive(false);
              setCSVFile(null);
              setPDFFile(null);
            });
            if (err.response.data) {
              if (err.response.data.status === "fail") {
                alert("Concept field(s) missing.");
              }
            }
          });
      }
      setLoading(false);
      fetchTests();
      setSubmitBtnDisabled(false);
      console.log("submitted");
    });
  };

  useEffect(() => {
    if (tableData.length === 0) return;
    const regex2 = new RegExp(`${testName.toLowerCase()}`, "i");
    let tempdata = tableData.filter((test) => test.testName.match(regex2));
    setFilteredTests(tempdata);
  }, [testName]);

  // console.log(testName);
   console.log(tableData);
   console.log('filteredTests', filteredTests);

  const fetchTests = () => {
    const headers = getAuthHeader();
    axios
      .get(`${BASE_URL}api/test`, { headers })
      .then((res) =>{
        console.log('asdadasdasdasd',res.data.data.test);
      let dataofque=res.data.data.test
      let cutdata = dataofque.map((item) => ({
        testId:item._id,
        testtype:item.testType
      }));
      console.log(cutdata);
      settesttype2(cutdata)
      setTableData(res.data.data.test)});
  };

  useEffect(() => {
    fetchTests();
  }, []);
  
  useEffect(()=>{
    console.log(testtype2);
  },[testtype2])

  if (persona === "parent" || persona === "student") return <StudentTest testtype={testtype2}/>;

  return (
    <div className="w-[83.6989583333vw] mx-auto bg-lightWhite min-h-screen">
      <p className="text-[#24A3D9]  !mt-[calc(50*0.052vw)] !mb-[calc(25*0.052vw)] text-base-22-5">
          {organization?.company +
            "  >  " +
            firstName +
            "  " +
            lastName +
            "  >  "}
          <span className="font-semibold">Content</span>
        </p>
      <div className=" w-full">
        <div className="flex justify-between items-center">
          {/* <p
                  className="font-bold text-4xl"
                  style={{ color: "#25335A" }}
               >
                  All Tests
               </p>  */}
          <InputField
            value={testName}
            IconRight={SearchIcon}
            onChange={(e) => setTestName(e.target.value)}
            optionData={optionData}
          
            placeholder="Search"
            parentClassName="w-290 mr-4"
            inputClassName="placeholder:font-semibold pl-2 text-base-17-5"
            inputContainerClassName="bg-white border pt-3.5 pb-3.5 !rounded-lg"
            type="select"
          />
          <button
            className="bg-[#FFA28D] py-[10px] px-6 flex items-center text-white  rounded-lg  text-[15px] text-base-15"
            onClick={() => setModalActive(true)}
          >
            <span className="pt-1"> Add New Material</span>
            <img src={AddIcon} className="ml-1 " alt="add-icon" />
          </button>
        </div>
        {console.log('hwlooasd nas d ',testtype2)}


        <div className="mt-6 w-full">
          <Table
            testtype={testtype2}
            dataFor="allTests"
            data={filteredTests}
            tableHeaders={tableObjHeaders}
            headerObject={true}
            maxPageSize={10}
            onClick={{ openRemoveTestModal }}
          />
        </div>
      </div>

      {modalActive && (
        <Modal
          title="Upload New Material"
          titleClassName="text-start text-sm mb-3"
          classname={"max-w-[630px] mx-auto"}
          primaryBtn={{
            text: "Create",
            form: "add-test-form",
            onClick: handleSubmit,
            type: "submit",
            className:
              "w-[123px] pl-6 pr-6 py-1 mr-5 my-auto pr-2 flex gap-2 mt-7 h-min disabled:opacity-80",
            disabled: submitBtnDisabled,
            loading: loading,
            icon: <img src={check} alt="check" className="inline-block" />,
          }}
          otherBt={
            <div id={styles.handleFileUpload}>
              <div
                id={styles.uploadButtons}
                className="mt-7 ml-7 px-0  gap-2 flex justify-between"
              >
                {modalData.testType!='DSAT'?<div id={styles.pdfUpload}>
                  <label
                    htmlFor="pdf"
                    className={`${
                      pdfFile !== null ? "bg-[#26435F] " : "bg-[#26435F] "
                    } w-[160px]`}
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
                </div>:null}

                <div id={styles.csvUpload}>
                  <label
                    htmlFor="csv"
                    className={`${
                      csvFile !== null && styles.fileUploaded
                        ? "bg-[#26435F] "
                        : "bg-[#26435F] "
                    } w-[200px]`}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:gap-x-3  gap-y-4">
                <InputField
                  label="Assignment Name"
                  labelClassname="ml-2 mb-1.2"
                  optionData={optionData}
                  placeholder="Type Test Name"
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
                  labelClassname="ml-2 text-sm font-bold mb-1.2"
                  optionData={testTypeOptions}
                  placeholder="Select Type"
                  inputContainerClassName="pt-1 pb-3 bg-primary-50"
                  parentClassName="w-full mr-4"
                  inputClassName="bg-transparent"
                  isRequired={true}
                  type="select"
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
