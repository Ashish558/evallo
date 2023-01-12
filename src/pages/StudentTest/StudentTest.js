import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyGetAssignedTestQuery, useLazyGetParentsAssignedTestsQuery, useLazyGetTestDetailsQuery, useLazyGetTestResponseQuery } from "../../app/services/test";
import { useLazyGetUserDetailQuery } from "../../app/services/users";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import { getFormattedDate } from "../../utils/utils";

import { tempTableData, studentsDataTable } from "../AssignedTests/tempData";

const studentTableHeaders = [
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
      bg: '#CBC0F5',
      text: 'Not Started'
   },
   {
      bg: '#F6A429',
      text: 'Started'
   },
   {
      bg: '#32D583',
      text: 'Completed'
   },
]


export default function StudentTest() {

   const [tableData, setTableData] = useState(studentsDataTable)
   const [tableHeaders, setTableHeaders] = useState(studentTableHeaders)
   const [user, setUser] = useState({})
   const [associatedStudents, setAssociatedStudents] = useState([]);
   const [selectedStudent, setSelectedStudent] = useState(null)

   const [getTest, getTestResp] = useLazyGetAssignedTestQuery()
   const [getTestDetails, getTestDetailsResp] = useLazyGetTestDetailsQuery()
   const [getResponse, getResponseRes] = useLazyGetTestResponseQuery()
   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()
   const [fetchAssignedTests, fetchAssignedTestsResp] = useLazyGetParentsAssignedTestsQuery()

   const [assignedTestDetails, setassignedTestDetails] = useState([])

   const [allTests, setAllTests] = useState([])
   const [filteredTests, setfilteredTests] = useState([])

   const [testDetails, setTestDetails] = useState([])

   const { role: persona, id } = useSelector(state => state.user)

   // useEffect(() => {
   //    getResponse({ id: '63b567682cbfe817fe551afb' })
   //       .then(res => {
   //          console.log(res.data);
   //       })
   // }, [])

   useEffect(() => {
      if (persona === 'student') {
         getTest()
            .then(res => {
               console.log('all-assigned-tests', res.data.data.test);
               let tempAllTests = res.data.data.test.map(test => {
                  const { testId, studentId, dueDate, isCompleted, isStarted, createdAt } = test
                  return {
                     testName: testId ? testId.testName : '-',
                     assignedOn: getFormattedDate(new Date(createdAt)),
                     studentId: studentId ? studentId : '-',
                     dueDate: getFormattedDate(new Date(test.dueDate)),
                     duration: test.timeLimit,
                     status: isCompleted === true ? 'completed' : isStarted ? 'started' : 'notStarted',
                     scores: '-',
                     _id: test._id,
                     pdfLink: testId.pdf ? testId.pdf : null, 
                     testId: testId ? testId._id : '-',
                     isCompleted: test.isCompleted
                  }
               })
               setAllTests(tempAllTests)
            })
      }
   }, [persona])

   //fetch parents students
   useEffect(() => {
      if (persona === 'parent') {
         getUserDetail({ id })
            .then(res => {
               // console.log('response', res.data.data);
               setUser(res.data.data.user)
               setAssociatedStudents([])
               res.data.data.user.assiginedStudents.map((student, idx) => {
                  getUserDetail({ id: student })
                     .then(res => {
                        setAssociatedStudents(prev => [...prev, {
                           _id: res.data.data.user._id,
                           name: `${res.data.data.user.firstName} ${res.data.data.user.lastName}`,
                           photo: res.data.data.user.photo ? res.data.data.user.photo : '/images/default.jpeg',
                           selected: idx === 0 ? true : false
                        }])
                     })
               })

            })
      }
   }, [persona])

   useEffect(() => {
      if (persona === 'parent') {
         fetchAssignedTests(id)
            .then(res => {
               if (res.error) return console.log('assigned test parent resp', res.error);
               // console.log('assigned test parent resp', res.data);
               let tempAllTests = res.data.data.test.map(test => {
                  const { testId, studentId, isCompleted, isStarted, dueDate, createdAt } = test
                  return {
                     testName: testId ? testId.testName : '-',
                     assignedOn: getFormattedDate(new Date(createdAt)),
                     studentId: studentId ? studentId : '-',
                     dueDate: getFormattedDate(new Date(test.dueDate)),
                     duration: test.timeLimit,
                     status: isCompleted === true ? 'completed' : isStarted ? 'started' : 'notStarted',
                     scores: '-',
                     _id: test._id,
                     pdfLink: testId.pdf ? testId.pdf : null,
                     testId: testId ? testId._id : '-',
                     isCompleted: test.isCompleted
                  }
               })

               setAllTests(tempAllTests)
            })
      }
   }, [])


   useEffect(() => {
      // console.log('associatedStudents', associatedStudents);
      // console.log('allTests', allTests);
      if (associatedStudents.length === 0) return
      if (associatedStudents.length >= 1) {
         setSelectedStudent(associatedStudents[0])
      }
   }, [associatedStudents])

   useEffect(() => {
      if (selectedStudent === null) return
      if (Object.keys(selectedStudent).length === 0) return
      let tempdata = allTests.filter(test => test.studentId._id === selectedStudent._id)
      // console.log(tempdata);
      setfilteredTests(tempdata)
      // console.log('selectedStudent', selectedStudent);
      // console.log('allTests', allTests);
   }, [selectedStudent])

   const handleStudentChange = item => {
      let obj = {}
      let tempdata = associatedStudents.map(student => {
         if (student._id === item._id) {
            obj = { ...student, selected: true }
            return { ...student, selected: true }
         } else {
            return { ...student, selected: false }
         }
      })
      setSelectedStudent(obj)
      setAssociatedStudents(tempdata)
   }

   // useEffect(() => {
   // }, [selectedStudent])
   // console.log(selectedStudent);
   // console.log(allTests);
   // console.log(associatedStudents);
 
   return (
      <>
         <div className="lg:ml-pageLeft bg-lightWhite min-h-screen">
            <div className="py-14 px-5">
               <div className="flex justify-between items-center">
                  <p className={`font-bold text-[80px]`}
                     style={{ color: "#25335A" }} >
                     Tests
                  </p>
                  {persona === "student" ? (
                     <div className="flex flex-col items-center justify-end">
                        {parentTestInfo.map(item => {
                           return <div className="flex items-center mb-[20px]">
                              <div className="w-[20px] h-[20px] rounded-full mr-[20px]" style={{ backgroundColor: item.bg }}></div>
                              <div className="font-semibold w-[90px]"> {item.text} </div>
                           </div>
                        })}
                     </div>
                  ) : persona === 'parent' &&
                  <div className="pl-4">
                     <div className="flex items-center justify-end">
                        {parentTestInfo.map((item, idx) => {
                           return <>
                              <div key={idx} className="w-[20px] h-[20px] rounded-full mr-[20px]" style={{ backgroundColor: item.bg }}></div>
                              <div className="mr-[20px] font-semibold"> {item.text} </div>
                           </>
                        })}
                     </div>
                     <div className="flex mt-[29px]">
                        {associatedStudents.map((student, idx) => {
                           return <div key={idx} className='border px-5 py-[7px] flex justify-center' onClick={() => handleStudentChange(student)} >
                              <p className={`text-lg ${student.selected ? 'font-bold underline underline-offset-3' : ''}`}> {student.name} </p>
                           </div>
                        })}
                     </div>
                  </div>

                  }
               </div>

               <div className="mt-6">
                  <Table
                     dataFor='assignedTestsStudents'
                     data={persona === 'parent' ? filteredTests : allTests}
                     tableHeaders={tableHeaders}
                     maxPageSize={10}
                     excludes={['_id', 'studentId', 'testId', 'isCompleted', 'pdfLink']}
                  />
               </div>
            </div>
         </div>

      </>
   );
}
