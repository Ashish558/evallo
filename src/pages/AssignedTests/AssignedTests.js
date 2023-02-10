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
import { useAssignTestMutation, useLazyDeleteTestQuery, useLazyGetAllAssignedTestQuery, useLazyGetAssignedTestQuery, useLazyGetTestsByNameQuery, useLazyGetTutorAssignedTestsQuery } from "../../app/services/test";
import { useLazyGetStudentsByNameQuery } from "../../app/services/session";
import InputSearch from "../../components/InputSearch/InputSearch";
import calendar from "./../../assets/calendar/calendar.svg"
import AssignedTestIndicator from "../../components/AssignedTestIndicator/AssignedTestIndicator";
import { useSelector } from "react-redux";
import { getDuration, getFormattedDate } from "../../utils/utils";
import FilterItems from "../../components/FilterItems/filterItems";

const optionData = ["1", "2", "3", "4", "5"];
const timeLimits = ['Regular', '1.5x', 'Unlimited']
const testData = ["SAT", "ACT"];

const tempTableHeaders = [
   "Name",
   "Assigned on",
   "Due Date",
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
   // 'Assigned by',
   "Due Date",
   "Duration",
   "Status",
   "Scores",
   "",
];

const initialState = {
   name: "",
   limit: "",
   date: "",
   test: "",
   testId: '',
   studentId: '',
   instruction: ''
}

export default function AssignedTests() {

   const [tableData, setTableData] = useState([])
   const [tableHeaders, setTableHeaders] = useState([])

   const [assignTestModalActive, setAssignTestModalActive] = useState(false);
   const [resendModalActive, setResendModalActive] = useState(false);
   const [deleteModalActive, setDeleteModalActive] = useState(false)
   const [loading, setLoading] = useState(false)

   const [testToResend, setTestToResend] = useState({})
   const [testToDelete, setTestToDelete] = useState({})

   const { role: persona, id } = useSelector(state => state.user)
   const handleClose = () => setAssignTestModalActive(false);

   const [filterData, setFilterData] = useState({
      studentName: '',
      testName: '',
      tutor: '',
      status: '',
   })

   const [assignTest, assignTestResp] = useAssignTestMutation()

   const [modalData, setModalData] = useState(initialState);

   const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery();
   const [fetchAssignedTests, assignedTestsResp] = useLazyGetAllAssignedTestQuery();
   const [fetchTutorAssignedTests, fetchTutorAssignedTestsResp] = useLazyGetTutorAssignedTestsQuery();
   const [fetchTests, fetchTestsResp] = useLazyGetTestsByNameQuery()
   const [deleteAssignedTest, deleteAssignedTestResp] = useLazyDeleteTestQuery()

   const [students, setStudents] = useState([]);
   const [allAssignedTests, setAllAssignedTests] = useState([])
   const [filteredTests, setFilteredTests] = useState([])

   const [testsData, setTestsData] = useState([]);
   const [maxPageSize, setMaxPageSize] = useState(10);
   const [validData, setValidData] = useState(true);
   const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)

   const [filterItems, setFilterItems] = useState([])

   useEffect(() => {
      setValidData(modalData.name && modalData.limit && modalData.date && modalData.test === '' && modalData.instruction === '');
   }, [modalData.name, modalData.limit, modalData.date, modalData.test])

   useEffect(() => {
      // if (modalData.name.trim() === '' || modalData.limit.trim() === '' || modalData.date === '' || modalData.testId === '' || modalData.studentId.trim() === '') {
      if (modalData.name.trim() === '' || modalData.limit.trim() === '' || modalData.date === '' || modalData.testId === '' || modalData.studentId.trim() === '') {
         setSubmitBtnDisabled(true)
      } else {
         let date = new Date(modalData.date)
         let currentDate = new Date()
         currentDate.setHours(0, 0, 0, 0);
         let dueDate = date.getDate()
         console.log(date - currentDate);
         if (date - currentDate < 0) {
            setSubmitBtnDisabled(true)
         } else {
            setSubmitBtnDisabled(false)
         }
      }
   }, [modalData.name,
   modalData.limit,
   modalData.date,
   modalData.testId,
   modalData.studentId,])

   // console.log(modalData);
   useEffect(() => {
      if (modalData.name.length > 0) {
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
      if (modalData.test.length > 0) {
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


   const fetchAllAssignedTests = () => {
      fetchAssignedTests()
         .then(res => {
            if (res.error) return console.log(res.error)
            console.log(res);
            let data = res.data.data.test.map(item => {
               const { createdAt, studentId, testId, dueDate, multiple, timeLimit, isCompleted, isStarted } = item
               return {
                  studentName: studentId ? `${studentId.firstName} ${studentId.lastName}` : '-',
                  studentId: studentId ? studentId._id : '-',
                  assignedOn: getFormattedDate(createdAt),
                  testName: testId ? testId.testName : '-',
                  testId: testId ? testId._id : null,
                  scores: '-',
                  duration: multiple ? getDuration(multiple) : 'Unlimited',
                  dueDate : getFormattedDate(dueDate),
                  status: isCompleted === true ? 'completed' : isStarted ? 'started' : 'notStarted',
                  createdAt,
                  assignedTestId: item._id
               }
            })
            let sortedArr = data.sort(function (a, b) {
               return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setAllAssignedTests(sortedArr)
            setFilteredTests(sortedArr)
         })
   }
 
   const fetchTutorTests = () => {
      fetchTutorAssignedTests(id)
         .then(res => {
            if (res.error) return console.log('tutor assignedtest', res.error)
            console.log('tutor assignedtest', res.data)
            let data = res.data.data.test.map(item => {
               const { createdAt, studentId, dueDate, testId, multiple, timeLimit, isCompleted, isStarted } = item
               return {
                  studentName: studentId ? `${studentId.firstName} ${studentId.lastName}` : '-',
                  studentId: studentId ? studentId._id : '-',
                  assignedOn: getFormattedDate(createdAt),
                  testName: testId ? testId.testName : '-',
                  testId: testId ? testId._id : null,
                  scores: '-',
                  duration: multiple ? getDuration(multiple) : 'Unlimited',
                  status: isCompleted === true ? 'completed' : isStarted ? 'started' : 'notStarted',
                  createdAt,
                  dueDate : getFormattedDate(dueDate) ,
                  assignedTestId: item._id
               }
            })
            let sortedArr = data.sort(function (a, b) {
               return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setAllAssignedTests(sortedArr)
            setFilteredTests(sortedArr)
         })
   }

   const getTimeLimit = val => {
      if (val === 'Regular') return 1
      if (val === '1.5x') return 1.5
      if (val === 'Unlimited') return 0
      return 1
   }

   const fetch = () => {
      if (persona === 'admin') {
         fetchAllAssignedTests()
      } else if (persona === 'tutor') {
         fetchTutorTests()
      }
   }
   useEffect(() => {
      fetch()
   }, [])

   const handleResend = (item) => {
      setTestToResend(item)
      setResendModalActive(true);
   };

   const handleResendTestSubmit = (item) => {
      console.log(testToResend);
      setResendModalActive(false);
      const body = {
         studentId: testToResend.studentId,
         testId: testToResend.testId,
         dueDate: testToResend.dueDate,
         timeLimit: getTimeLimit(testToResend.duration),
      }
      assignTest(body)
         .then(res => {
            console.log(res.data.data.assign)
            setAssignTestModalActive(false)
            fetch()
         })
   };

   const handleAssignTestSubmit = () => {
      setLoading(true)
      const body = {
         studentId: modalData.studentId,
         testId: modalData.testId,
         dueDate: modalData.date,
         timeLimit: getTimeLimit(modalData.limit),
      }
      console.log(body)
      // return
      assignTest(body)
         .then(res => {
            setLoading(false)
            if (res.error) {
               console.log(res.error);
               if (res.error.data) {
                  if (res.error.data.message) {
                     alert(res.error.data.message)
                     return
                  }
               }
               alert('Something went wrong')
               return
            }
            setModalData(initialState)
            console.log(res.data.data.assign)
            alert("Test Assigned!")
            setAssignTestModalActive(false)
            fetch()
         })

   }

   useEffect(() => {
      let tempdata = [...allAssignedTests]
      // console.log(usersData)

      //NAME FILTER 
      if (filterData.studentName !== '') {
         const regex2 = new RegExp(`${filterData.studentName.toLowerCase()}`, 'i')
         tempdata = tempdata.filter(test => test.studentName.match(regex2))
      } else {
         tempdata = tempdata.filter(test => test.studentName !== '')
      }
      //TEST NAME FILTER 
      if (filterData.testName !== '') {
         const regex2 = new RegExp(`${filterData.testName.toLowerCase()}`, 'i')
         tempdata = tempdata.filter(test => test.testName.match(regex2))
      } else {
         tempdata = tempdata.filter(test => test.testName !== '')
      }

      if (filterData.status !== '') {
         const selectedStatus = getStatus(filterData.status)
         tempdata = tempdata.filter(user => user.status === selectedStatus)
      } else {
         tempdata = tempdata.filter(user => user.status !== '')
      }

      setFilteredTests(tempdata)
   }, [filterData])

   const removeFilter = key => {
      let tempFilterData = { ...filterData }
      tempFilterData[key] = ''
      setFilterData(tempFilterData)
   }

   const getStatus = (status) => {
      if (status === 'Completed') return 'completed'
      if (status === 'Started') return 'started'
      if (status === 'Not Started') return 'notStarted'
   }

   useEffect(() => {
      let arr = Object.keys(filterData).map(key => {
         if (filterData[key] !== '') {
            return {
               text: filterData[key],
               type: key,
               removeFilter: (key) => removeFilter(key)
            }
         }
      }).filter(item => item !== undefined)
      setFilterItems(arr)
   }, [filterData])

   const onRemoveFilter = (item) => item.removeFilter(item.type)

   useEffect(() => {
      setTableData(tempTableData)
      setTableHeaders(tempTableHeaders)
   }, []);

   const deleteTest = () => {
      console.log('deleteTest', testToDelete);
      deleteAssignedTest({ id: testToDelete.assignedTestId })
         .then(res => {
            if (res.error) {
               console.log('delete err', res.error)
               return
            }
            fetch()
            setDeleteModalActive(false)
            console.log('delete test res', res.data);
         })
   }

   const handleDelete = item => {
      setTestToDelete(item)
      setDeleteModalActive(true)
   }

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

   // console.log('allAssignedTests', allAssignedTests);
   return (
      <>
         <div className="lg:ml-pageLeft bg-lightWhite min-h-screen">
            <div className="py-14 px-5">
               <div className="flex gap-4 justify-between items-center">
                  {localStorage.getItem('role') === "parent" || localStorage.getItem('role') === 'student' ? <p className={`font-bold text-4xl text-primary-dark`}
                  // style={{ color: "#25335A" }}
                  >
                     Assigned Tests
                  </p> : <></>}

                  <InputField
                     value={filterData.studentName}
                     IconRight={SearchIcon}
                     onChange={e => setFilterData({ ...filterData, studentName: e.target.value })}
                     optionData={optionData}
                     placeholder="Student Name"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     parentClassName="w-full text-sm"
                     type="text"
                  />
                  <InputField
                     value={filterData.testName}
                     IconRight={SearchIcon}
                     onChange={e => setFilterData({ ...filterData, testName: e.target.value })}
                     optionData={optionData}
                     placeholder="Test Name"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     parentClassName="w-full text-sm"
                     type="text"
                  />
                  <InputField
                     value={filterData.tutor}
                     onChange={e => setFilterData({ ...filterData, tutor: e.target.value })}
                     IconRight={SearchIcon}
                     parentClassName="w-full text-sm"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     optionData={optionData}
                     placeholder="Tutor Name"
                     type="text"
                  />
                  <InputSelect
                     value={filterData.status}
                     onChange={val => setFilterData({ ...filterData, status: val })}
                     optionData={['Started', 'Not Started', 'Completed']}
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     placeholder="Completion Status"
                     parentClassName="w-full text-sm"
                     type="select"
                  />

                  <button
                     className="bg-primaryOrange w-full text-lg justify-center flex pt-4 pb-4 px-5 items-center text-white font-semibold rounded-lg"
                     onClick={() => setAssignTestModalActive(true)}

                  >
                     Assign new test
                     <img src={AddIcon} className="ml-3" />
                  </button>

               </div>

               {/* <div className="flex align-center mt-8">
                  <InputField
                     value={filterData.studentName}
                     IconRight={SearchIcon}
                     onChange={e => setFilterData({ ...filterData, studentName: e.target.value })}
                     optionData={optionData}
                     placeholder="Student Name"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     parentClassName="w-full text-sm"
                     type="text"
                  />
                  <InputField
                     value={filterData.testName}
                     IconRight={SearchIcon}
                     onChange={e => setFilterData({ ...filterData, testName: e.target.value })}
                     optionData={optionData}
                     placeholder="Test Name"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     parentClassName="w-full text-sm"
                     type="text"
                  />
                  <InputField
                     value={filterData.tutor}
                     onChange={e => setFilterData({ ...filterData, tutor: e.target.value })}
                     IconRight={SearchIcon}
                     parentClassName="w-full text-sm"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     optionData={optionData}
                     placeholder="Tutor Name"
                     type="text"
                  />
                  <InputSelect
                     value={filterData.status}
                     onChange={val => setFilterData({ ...filterData, status: val })}
                     optionData={['Started', 'Not Started', 'Completed']}
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     placeholder="Completion Status"
                     parentClassName="w-full text-sm"
                     type="select"
                  />
               </div> */}
               <div className='mt-4' >
                  <FilterItems items={filterItems} setData={setFilterItems} onRemoveFilter={onRemoveFilter} />
               </div>

               <div className="flex items-center justify-end gap-[20px] mt-[10px]">
                  {/* <AssignedTestIndicator /> */}
                  {status.map(({ text, color }, idx) => <AssignedTestIndicator
                     key={idx}
                     text={text}
                     color={color}
                  />)}
               </div>

               <div className="mt-6">
                  <Table
                     onClick={{ handleResend, handleDelete }}
                     dataFor='assignedTests'
                     data={filteredTests}
                     excludes={['createdAt', 'assignedTestId']}
                     tableHeaders={tableHeaders}
                     maxPageSize={maxPageSize}
                     setMaxPageSize={setMaxPageSize}
                  />
               </div>
            </div>
         </div>
         {console.log(!modalData.name)}
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
                  disabled: !modalData.name || !modalData.limit || !modalData.date || !modalData.testId || !modalData.studentId,

                  loading: loading
               }}
               handleClose={handleClose}
               body={
                  <>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:gap-x-3 gap-y-4 mb-5">
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
                              onChange={(val) => setModalData({ ...modalData, limit: val, })}
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
                              // IconRight={calendar}
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
                     <InputField
                        label="Instruction From Tutor"
                        type="text"
                        iconSize="medium"
                        // IconRight={calendar}
                        value={modalData.instruction}
                        onChange={(val) =>
                           setModalData({
                              ...modalData,
                              instruction: val.target.value,
                           })
                        }
                        parentClassName="w-full mr-4"
                        labelClassname="ml-2 mb-0.5"
                        inputContainerClassName="px-5 py-3.5 bg-primary-50 border-0 mb-5"
                        inputClassName="bg-transparent text-sm"
                        optionData={optionData}
                        placeholder="Instruction"
                     />
                  </>
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
                  className: "w-[140px] pl-4 px-4",
                  onClick: () => handleResendTestSubmit(),
               }}
               handleClose={() => setResendModalActive(false)}
               classname={"max-w-567 mx-auto"}
            />
         )}
         {deleteModalActive && (
            <Modal
               title={
                  <span className="leading-10">
                     Are you sure <br />
                     you want to delete the assigned test ?
                  </span>
               }
               titleClassName="mb-12 leading-10"
               cancelBtn={true}
               cancelBtnClassName="max-w-140"
               primaryBtn={{
                  text: "Delete",
                  className: "w-[140px] pl-4 px-4",
                  onClick: () => deleteTest(),
               }}
               handleClose={() => setDeleteModalActive(false)}
               classname={"max-w-567 mx-auto"}
            />
         )}
      </>
   );
}
