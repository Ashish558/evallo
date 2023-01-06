import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import InputSelect from "../../components/InputSelect/InputSelect";

import AddIcon from "../../assets/icons/add.svg";
import SearchIcon from "../../assets/icons/search.svg";

import { tempTableData, studentsDataTable } from "./tempData";
import InputField from "../../components/InputField/inputField";
import axios from "axios";
import { BASE_URL } from "../../app/constants/constants";
import { useAssignTestMutation, useLazyGetTestsByNameQuery } from "../../app/services/test";
import { useLazyGetStudentsByNameQuery } from "../../app/services/session";
import InputSearch from "../../components/InputSearch/InputSearch";
import calendar from "./../../assets/calendar/calendar.svg"
import AssignedTestIndicator from "../../components/AssignedTestIndicator/AssignedTestIndicator";

const optionData = ["1", "2", "3", "4", "5"];
const timeLimits = [30, 40, 50]
const testData = ["SAT", "ACT"];

const tempTableHeaders = [
   "Name",
   "Assigned on",
   "Test Name",
   "Duration",
   "Status",
   "Scores",
   "",
   "",
];

const studentTableHeaders = [
   "Test Name",
   "Assigned on",
   "Due Date",
   "Duration",
   "Status",
   "Scores",
   "",
];

export default function AssignedTests() {

   const [tableData, setTableData] = useState([])
   const [tableHeaders, setTableHeaders] = useState([])

   const [assignTestModalActive, setAssignTestModalActive] = useState(false);
   const [resendModalActive, setResendModalActive] = useState(false);

   const persona = sessionStorage.getItem("role");

   const handleClose = () => setAssignTestModalActive(false);
   
   const [filterData, setFilterData] = useState({
      studentName: '',
      testName: '',
      tutor: '',
      status: '',
   })

   const [assignTest, assignTestResp] = useAssignTestMutation()

   const [modalData, setModalData] = useState({
      name: "",
      limit: "",
      date: "",
      test: "",
   });

   const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery();
   const [students, setStudents] = useState([]);

   const [fetchTests, fetchTestsResp] = useLazyGetTestsByNameQuery()
   const [testsData, setTestsData] = useState([]);
   const [maxPageSize, setMaxPageSize] = useState(10);
   const [validData, setValidData] = useState(true);
   useEffect(() => {
      setValidData(modalData.name && modalData.limit && modalData.date && modalData.test);
   }, [modalData.name, modalData.limit, modalData.date, modalData.test])

   useEffect(() => {
      if (modalData.name.length > 2) {
         fetchStudents(modalData.name).then((res) => {
            // console.log(res.data.data)
            let tempData = res.data.data.students.map((student) => {
               return {
                  _id: student._id,
                  value: `${student.firstName} ${student.lastName}`,
               };
            });
            setStudents(tempData);
         });
      }
   }, [modalData.name]);

   useEffect(() => {
      if (modalData.test.length > 2) {
         fetchTests(modalData.test).then((res) => {
            let tempData = res.data.data.test.map((test) => {
               return {
                  _id: test._id,
                  value: test.testName,
                  testType: test.testType
               };
            });
            setTestsData(tempData);
         });
      }
   }, [modalData.test]);

   const handleResend = (item) => {
      console.log(item);
      setResendModalActive(true);
   };

   const handleResendTestSubmit = (item) => {
      setResendModalActive(false);
   };

   const handleAssignTestSubmit = () => {
      console.log(modalData)
      const body = {
         studentId: modalData.studentId,
         testId: modalData.testId,
         dueDate: modalData.date,
         timeLimit: modalData.limit,
      }
      assignTest(body)
         .then(res => {
            console.log(res.data.data.assign)
            setAssignTestModalActive(false)
         })

   }

   useEffect(() => {
      setTableData(tempTableData)
      setTableHeaders(tempTableHeaders)
   }, []);

   const status = [
      {
         text: "Not Started",
         color: "#CBC0F5"
      },
      {
         text: "Started",
         color: "#F6A429"
      },
      {
         text: "Completed",
         color: "#32D583"
      },
   ]

   return (
      <>
         <div className="lg:ml-pageLeft bg-lightWhite min-h-screen">
            <div className="py-14 px-5">
               <div className="flex justify-between items-center">
                  <p className={`font-bold text-4xl text-primary-dark`}
                  // style={{ color: "#25335A" }}
                  >
                     Assigned Tests
                  </p>

                  <button
                     className="bg-primaryOrange text-lg flex pt-4 pb-4 px-5 items-center text-white font-semibold rounded-lg mr-55"
                     onClick={() => setAssignTestModalActive(true)}
                    
                  >
                     Assign new test
                     <img src={AddIcon} className="ml-3" />
                  </button>

               </div>

               <div className="flex align-center mt-8">
                  <InputField
                     value={filterData.studentName}
                     IconRight={SearchIcon}
                     onChange={e => setFilterData({...filterData, studentName: e.target.value})}
                     optionData={optionData}
                     placeholder="Student Name"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     parentClassName="w-full mr-4 text-sm"
                     type="text"
                  />
                  <InputField
                     value={filterData.testName}
                     IconRight={SearchIcon}
                     onChange={e => setFilterData({...filterData, testName: e.target.value})}
                     optionData={optionData}
                     placeholder="Test Name"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     parentClassName="w-full mr-4 text-sm"
                     type="text"
                  />
                  <InputField
                     value={filterData.tutor}
                     onChange={e => setFilterData({...filterData, tutor: e.target.value})}
                     IconRight={SearchIcon}
                     parentClassName="w-full mr-4 text-sm"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     optionData={optionData}
                     placeholder="Tutor Name"
                     type="text"
                  />
                  <InputSelect
                     value={filterData.status}
                     onChange={val => setFilterData({...filterData, status: val})}
                     optionData={optionData}
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     placeholder="Completion Status"
                     parentClassName="w-full mr-4 text-sm"
                     type="select"
                  />
               </div>

               <div className="flex items-center justify-end gap-[20px] mt-[10px]">
                  {/* <AssignedTestIndicator /> */}
                  {status.map(({text, color}) => <AssignedTestIndicator
                     text={text}
                     color={color}
                  />)}
               </div>

               <div className="mt-6">
                  <Table
                     onClick={{ handleResend }}
                     dataFor='assignedTests'
                     data={tableData}
                     tableHeaders={tableHeaders}
                     maxPageSize={maxPageSize}
                     setMaxPageSize={setMaxPageSize}
                  />
               </div>
            </div>
         </div>
         {assignTestModalActive && (
            <Modal
               title="Assign New Test"
               classname={"max-w-[760px] mx-auto"}
               cancelBtn={true}
               cancelBtnClassName="max-w-140"
               primaryBtn={{
                  text: "Assign",
                  className: "max-w-140 pl-8 pr-8",
                  onClick: () => handleAssignTestSubmit(),
                  disabled: !validData
               }}
               handleClose={handleClose}
               body={
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5">
                     <div>
                        <InputSearch
                           label="Student Name"
                           value={modalData.name}
                           onChange={(val) =>
                              setModalData({
                                 ...modalData,
                                 name: val.target.value,
                              })
                           }
                           optionData={students}
                           onOptionClick={(item) => {
                              setModalData({
                                 ...modalData,
                                 name: item.value,
                                 studentId: item._id
                              })
                           }}
                           optionPrefix='s'
                           parentClassName="w-full mr-4"
                           labelClassname="ml-2 mb-0.5"
                           inputContainerClassName="px-5 py-3.5 text-sm bg-primary-50 border-0"
                           inputClassName="bg-transparent"
                           placeholder="Student Name"
                           type="select"
                        />
                     </div>
                     <div>
                        <InputSelect
                           label="Time Limit"
                           value={modalData.limit}
                           onChange={(val) =>  setModalData({ ...modalData, limit: val,}) }
                           optionData={timeLimits}
                           parentClassName="w-full mr-4 "
                           labelClassname="ml-2 mb-0.5"
                           inputContainerClassName="px-5 text-sm py-3.5 bg-primary-50 border-0"
                           inputClassName="bg-transparent"
                           placeholder="Select Time Limit"
                           type="select"
                        />
                     </div>
                     <div>
                        <InputField
                           label="Due Date"
                           iconSize="medium"
                           IconRight={calendar}
                           value={modalData.date}
                           onChange={(val) =>
                              setModalData({
                                 ...modalData,
                                 date: val.target.value,
                              })
                           }
                           parentClassName="w-full mr-4"
                           labelClassname="ml-2 mb-0.5"
                           inputContainerClassName="px-5 py-3.5 bg-primary-50 border-0"
                           inputClassName="bg-transparent text-sm"
                           optionData={optionData}
                           placeholder="Date"
                           type="date"
                        />
                     </div>
                     <div>
                        <InputSearch
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
                                 testId: item._id
                              })
                           }}
                           label="Test"
                           placeholder="Type Test Name"
                           parentClassName="w-full mr-4"
                           labelClassname="ml-2 mb-0.5"
                           inputContainerClassName="px-5 py-3.5 text-sm bg-primary-50 border-0"
                           inputClassName="bg-transparent"
                           type="select"
                        />
                     </div>
                  </div>
               }
            />
         )}
         {resendModalActive && (
            <Modal
               title={
                  <span className="leading-10">
                     Are you sure <br />
                     you want to resend the test ?
                  </span>
               }
               titleClassName="mb-12 leading-10"
               cancelBtn={true}
               cancelBtnClassName="max-w-140"
               primaryBtn={{
                  text: "Assign",
                  className: "max-w-140",
                  onClick: () => handleResendTestSubmit(),
               }}
               handleClose={() => setResendModalActive(false)}
               classname={"max-w-567 mx-auto"}
            />
         )}
      </>
   );
}
