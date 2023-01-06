import React, { useEffect, useState } from "react";
import InputSelect from "../../components/InputSelect/InputSelect";
import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import InputField from "../../components/InputField/inputField";

import AddIcon from "../../assets/icons/add.svg";
import SearchIcon from "../../assets/icons/search.svg";
import styles from "./style.module.css";

import data from "./tempData";
import upload from "./../../assets/icons/upload.png";
import Papa from "papaparse";
import axios from "axios";
import { useAddPdfMutation, useAddTestMutation } from "../../app/services/test";
import { BASE_URL } from "../../app/constants/constants";
import StudentTest from "../StudentTest/StudentTest";
import FilterItems from "../../components/FilterItems/filterItems";

const optionData = ["option 1", "option 2", "option 3", "option 4", "option 5"];
const testTypeOptions = ["SAT", "ACT"];
const tableHeaders = ["Test Name", "Date Modified", "Test Type", "", ""];

const initialState = {
   testName: "",
   dateModified: "",
   testType: "",
};

export default function AllTests() {
   const [tableData, setTableData] = useState([]);
   const [modalActive, setModalActive] = useState(false);
   const [testName, setTestName] = useState("");
   const [pdfFile, setPDFFile] = useState({});
   const [csvFile, setCSVFile] = useState({});
   const [csvError, setCSVError] = useState("");
   const [PDFError, setPDFError] = useState("");
   const [testForDelete, setTestForDelete] = useState("");
   const [filteredTests, setFilteredTests] = useState([])
   const [filterItems, setFilterItems] = useState([])

   const [removeQuestionModal, setRemoveQuestionModal] = useState(false);
   const [submitTest, submitTestResp] = useAddTestMutation();
   const [submitPdf, submitPdfResp] = useAddPdfMutation();

   const [modalData, setModalData] = useState(initialState);

   const handleClose = () =>{ 
      setModalActive(false)
      setModalData(initialState);
      setPDFFile({})
      setCSVFile({})
   }
   const closeRemoveModal = () => setRemoveQuestionModal(false);

   const persona = sessionStorage.getItem("role");

   const openRemoveTestModal = (item) => {
      setRemoveQuestionModal(true);
      setTestForDelete(item);
   };

   const removeTest = (item) => {
      setRemoveQuestionModal(false);
      // console.log(testForDelete._id);
      axios
         .delete(
            `${BASE_URL}api/test/${testForDelete._id}`
         )
         .then((res) => {
            console.log(res);
            fetchTests();
         });
   };

   useEffect(() => {
      setFilteredTests(tableData)
   }, [tableData])

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
         setCSVFile({});
         setCSVError("Not a CSV File");
      }
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      // console.log(modalData)
      let body = {
         testName: modalData.testName,
         testType: modalData.testType,
      };
      submitTest(body).then(async (res) => {
         // console.log(res);
         if (res.error) {
            alert(res.error.data.message);
            return;
         }
         let testId = res.data.data.test._id;
         const formData = new FormData();
         formData.append("pdf", pdfFile);
         pdfFile && await axios
            .post(
               `${BASE_URL}api/test/addpdf/${testId}`,
               formData
            )
            .then((res) => {
               console.log('pdf post resp', res);
               setModalData(initialState);
               setModalActive(false);
               setPDFFile({});
               // fetchTests()
            });

         if (csvFile) {
            const formData = new FormData();
            formData.append("file", csvFile);
            await axios.post(`${BASE_URL}api/test/addans/${testId}`, formData)
               .then((res) => {
                  console.log('csv post resp', res);
                  setModalData(initialState);
                  setModalActive(false);
                  setCSVFile({});
                  // fetchTests()
               });
         }

         console.log('submitted');
      });
   };

   useEffect(() => {
      if (tableData.length === 0) return
      const regex2 = new RegExp(`${testName.toLowerCase()}`, 'i')
      let tempdata = tableData.filter(test => test.testName.match(regex2))
      setFilteredTests(tempdata)
   }, [testName])

   // console.log(testName);
   // console.log(tableData);
   // console.log(filteredTests);

   const fetchTests = () => {
      axios
         .get(`${BASE_URL}api/test`)
         .then((res) => setTableData(res.data.data.test));
   };

   useEffect(() => {
      fetchTests();
   }, []);

   if (persona === 'parent' || persona === 'student') return <StudentTest />

   return (
      <div className="lg:ml-pageLeft bg-lightWhite min-h-screen">
         <div className="py-14 px-5">
            <div className="flex justify-between items-center">
               <p
                  className="font-bold text-4xl"
                  style={{ color: "#25335A" }}
               >
                  All Tests
               </p>
               <button
                  className="bg-primaryOrange py-3.5 px-6 flex items-center text-white font-semibold rounded-lg mr-55"
                  onClick={() => setModalActive(true)}
               >
                  Add new Test
                  <img src={AddIcon} className="ml-3" />
               </button>
            </div>
            <div className="flex align-center mt-8">
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
            </div>

            <div className="mt-6">
               <Table
                  dataFor="allTests"
                  data={filteredTests}
                  tableHeaders={tableHeaders}
                  maxPageSize={10}
                  onClick={{ openRemoveTestModal }}
               />
            </div>
         </div>

         {modalActive && (
            <Modal
               title="Create a New Test"
               classname={"max-w-[700px] mx-auto"}
               cancelBtn={true}
               primaryBtn={{
                  text: "Assign",
                  form: "add-test-form",
                  onClick: handleSubmit,
                  type: "submit",
                  className: 'w-[123px] pl-6 pr-6'
               }}
               handleClose={handleClose}
               body={
                  <form onSubmit={handleSubmit} id="add-test-form">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:gap-x-3 gap-y-2 gap-y-4">
                        <InputField
                           label="Test Name"
                           labelClassname="ml-2 mb-1.2"
                           optionData={optionData}
                           placeholder="Type Test Name"
                           parentClassName="w-full mr-4"
                           inputContainerClassName="pt-3 pb-3 bg-primary-50"
                           inputClassName='bg-transparent'
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
                           label="Test Type"
                           labelClassname="ml-2 mb-1.2"
                           optionData={testTypeOptions}
                           placeholder="Select Test Type"
                           inputContainerClassName="pt-3 pb-3 bg-primary-50"
                           parentClassName="w-full mr-4"
                           inputClassName='bg-transparent'
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

                     <div id={styles.testUploadContainer}>
                        <span id={styles.testUpload}>
                           Upload the Test
                        </span>

                        <div id={styles.handleFileUpload}>
                           <div id={styles.uploadButtons}>
                              <div id={styles.pdfUpload}>
                                 <label
                                    htmlFor="pdf"
                                    className={
                                       pdfFile.name &&
                                       styles.fileUploaded
                                    }
                                 >
                                    Upload PDF
                                    <img src={upload} alt="Upload" />
                                 </label>
                                 <div className={styles.error}>
                                    {PDFError}
                                 </div>
                                 <input
                                    id="pdf"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={e => handlePDFFile(e.target.files[0])}
                                 />
                                 <div id={styles.filename}>
                                    {pdfFile?.name || pdfFile?.name}
                                 </div>
                              </div>

                              <div id={styles.csvUpload}>
                                 <label
                                    htmlFor="csv"
                                    className={csvFile.name && styles.fileUploaded}>
                                    Upload CSV
                                    <img src={upload} alt="Upload" />
                                 </label>
                                 <div className={styles.error}>
                                    {csvError}
                                 </div>
                                 <input id="csv"
                                    type="file"
                                    accept=".xls,.xlsx"
                                    // onChange={e => {    
                                    onChange={e => setCSVFile(e.target.files[0])}
                                 />
                                 <div id={styles.filename}>
                                    {csvFile ? csvFile?.name : ''}
                                 </div>
                              </div>
                           </div>
                           {/* 
                           <div id={styles.filename}>
                              {pdfFile?.name || csvFile?.name}
                           </div> */}
                        </div>
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
