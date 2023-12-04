import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import InputSelect from "../../components/InputSelect/InputSelect";
//import down from "../../assets/icons/down.png";
import down from "../../assets/YIcons/Group33.svg";
import AddIcon from "../../assets/icons/add.svg";
import SearchIcon from "../../assets/icons/search.svg";

import InputField from "../../components/InputField/inputField";
import axios from "axios";
import { BASE_URL } from "../../app/constants/constants";
import { useAssignTestMutation, useLazyDeleteTestQuery, useLazyGetAllAssignedTestQuery, useLazyGetAssignedTestQuery, useLazyGetTestsByNameQuery, useLazyGetTutorAssignedTestsQuery } from "../../app/services/test";
import { useLazyGetSettingsQuery, useLazyGetStudentsByNameQuery, useLazyGetTutorsByNameQuery } from "../../app/services/session";
import InputSearch from "../../components/InputSearch/InputSearch";
import calendar from "./../../assets/calendar/calendar.svg"
import AssignedTestIndicator from "../../components/AssignedTestIndicator/AssignedTestIndicator";
import { useSelector } from "react-redux";
import { getDuration, getFormattedDate } from "../../utils/utils";
import FilterItems from "../../components/FilterItems/filterItems";
import { useAddAssignedTutorMutation, useCRMBulkChangeAssignedTutorMutation, useDeleteAssignedTutorMutation, useLazyGetAllAssignedtutorsQuery } from "../../app/services/admin";
import { useNavigate } from "react-router-dom";

const optionData = []
const tempTableHeaders = [
   {
      id: 1,
      text: "Tutor Name",
      className: 'text-left pl-6'
   },
   {
      id: 2,
      text: "Student Name",
   },
   {
      id: 2,
      text: "Timezone",
   },
   {
      id: 3,
      text: "Specialization",
   },
   {
      id: 4,
      text: "Parent",
   },
   {
      id: 5,
      text: "Start Date",
   },
   {
      id: 1,
      text: "Diagnostic Score",
   },
   {
      id: 6,
      text: "Remove Tutor",
   },

];

const timeZones = [
   'Asia/Kolkata',
   'US/Alaska',
   'US/Central',
   'US/Eastern',
   'US/Hawaii',
   'US/Mountain',
   'US/Pacific',
]


const initialState = {
   studentName: '',
   studentId: '',
   tutorName: '',
   tutorId: '',
}

export default function AssignedTutors({ setAssignedTutorOpen, assignedTutorOpen, fetch2 }) {

   const [tableData, setTableData] = useState([])
   const [filteredData, setFilteredData] = useState([])

   const [tableHeaders, setTableHeaders] = useState([])
   const [loading, setLoading] = useState(false)
   const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)
   const [specializations, setSpecializations] = useState([])

   const [modalData, setModalData] = useState(initialState);
   const [assignStudentModalActive, setAssignStudentModalActive] = useState(false)
   const [fetchTutors, tutorResponse] = useLazyGetTutorsByNameQuery();
   const [tutors, setTutors] = useState([]);
   const [tableLoading, setTableLoading] = useState(false)
   const handleClose = () => {
      setAssignedTutorOpen(false)
      setAssignStudentModalActive(false);
   }
   const navigate = useNavigate()
   const [filterData, setFilterData] = useState({
      tutorName: '',
      studentName: '',
      timeZone: '',
      specialization: '',
   })

   const { role: persona, id } = useSelector(state => state.user)
   const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery();
   const [fetchAssignedTutors, fetchAssignedTutorsResp] = useLazyGetAllAssignedtutorsQuery();
   const [addAssignedTutor, addAssignedTutorResp] = useAddAssignedTutorMutation();
   const [deleteAssignedTutor, deleteAssignedTutorResp] = useDeleteAssignedTutorMutation();
   const [fetchSettings, settingsResp] = useLazyGetSettingsQuery()
   const [settings, setSettings] = useState({})
   const [studentMultiple, setStudentMultiple] = useState([])
   const [students, setStudents] = useState([]);
   const [maxPageSize, setMaxPageSize] = useState(10);
   const [filterItems, setFilterItems] = useState([])
   const [addAssignedTutor2, slsAt] = useCRMBulkChangeAssignedTutorMutation()
   //fetch names
   useEffect(() => {
      console.log("calling names for students")
      let name2=""
      if (modalData?.studentName?.length > 0) {
name2=modalData?.studentName
      }
         fetchStudents(name2).then((res) => {
             console.log("students",res)
            let tempData = res?.data?.data?.students.map((tutor) => {
               return {
                  _id: tutor._id,
                  value: `${tutor.firstName} ${tutor.lastName}`,
               };
            });
            setStudents(tempData);
         });
      
   }, [modalData.studentName]);

   useEffect(() => {
      if (modalData.tutorName.length >= 0) {
         fetchTutors(modalData.tutorName).then((res) => {
            // console.log(res.data.data.tutor)
            let tempData = res.data.data.tutor.map((tutor) => {
               return {
                  _id: tutor._id,
                  value: `${tutor.firstName} ${tutor.lastName}`,
               };
            });
            setTutors(tempData);
         });
      }
   }, [modalData.tutorName]);

   useEffect(() => {
      fetchSettings()
         .then(res => {
            setSettings(res.data.data.setting)
         })
   }, [])

   useEffect(() => {
      if (!settings.servicesAndSpecialization) return
      let specs = []
      settings.servicesAndSpecialization.map(service => {
         specs.push(...service.specialization)
      })
      setSpecializations(specs)

   }, [settings])

   const handleSubmit = () => {
      setLoading(true)
      const body = {
         tutorId: modalData.tutorId,
         studentId: modalData.studentId
      }
      addAssignedTutor(body)
         .then(res => {
            setLoading(false)
            if (res.error) {
               console.log(res.error);
               return
            }
            if (res.data.status === 'Tutor already assigned') {
               return alert('Tutor already assigned')
            }
            fetch()
            setModalData(initialState)
            setAssignStudentModalActive(false)
            setAssignedTutorOpen(false)
            console.log(res.data);

         })
   }

   const handleDelete = (itemToDelete) => {
      console.log(itemToDelete);
      const body = {
         tutorId: itemToDelete.assiginedTutor,
         studentId: itemToDelete.student_id,
      }
      deleteAssignedTutor(body)
         .then(res => {
            if (res.error) {
               console.log(res.error);
               return
            }
            // fetch()
            if (res.data.status === 'success') {
               // let temp = tableData.filter(item => item.assiginedTutor !==  itemToDelete.assiginedTutor &&  item.student_id !==  itemToDelete.student_id)
               let temp = tableData.map(item => {
                  if (item.assiginedTutor === itemToDelete.assiginedTutor && item.student_id === itemToDelete.student_id) {
                     return undefined
                  }
                  return item
               }).filter(item => item !== undefined)
               setTableData(temp)
            }

         })
   }

   const fetch = () => {
      setTableLoading(true)
      fetchAssignedTutors()
         .then(res => {
            setTableLoading(false)
            if (res.error) {
               console.log(res.error);
               return
            }
            console.log('assignedtutors-', res.data);
            let data = res.data.assignedTutors?.map(item => {
               const { assignedTutor, associatedParent, firstName, lastName, specialization, student_id, timeZone, tutorFirstName, tutorLastName, parentFirstName, parentLast } = item
               return {
                  tutorName: `${tutorFirstName} ${tutorLastName}`,
                  assiginedTutor: assignedTutor,
                  studentName: `${firstName} ${lastName}`,
                  timeZone: timeZone ? timeZone : '-',
                  student_id,
                  specialization: specialization ? specialization : '-',
                  associatedParent,
                  parentFirstName,
                  parentLast,
                  startDate: '-',
                  score: '-',
               }
            })
            setTableData(data)
            console.log(res.data);
         })
   }
   useEffect(() => {
      fetch()
   }, [])


   useEffect(() => {
      let tempdata = [...tableData]
      // console.log(usersData)

      //NAME FILTER 
      if (filterData.studentName !== '') {
         const regex2 = new RegExp(`${filterData.studentName.toLowerCase()}`, 'i')
         tempdata = tempdata.filter(test => test.studentName.match(regex2))
      } else {
         tempdata = tempdata.filter(test => test.studentName !== '')
      }
      //TEST NAME FILTER 
      if (filterData.tutorName !== '') {
         const regex2 = new RegExp(`${filterData.tutorName.toLowerCase()}`, 'i')
         tempdata = tempdata.filter(test => test.tutorName.match(regex2))
      } else {
         tempdata = tempdata.filter(test => test.tutorName !== '')
      }

      // if (filterData.status !== '') {
      //    const selectedStatus = getStatus(filterData.status)
      //    tempdata = tempdata.filter(user => user.status === selectedStatus)
      // } else {
      //    tempdata = tempdata.filter(user => user.status !== '')
      // }

      if (filterData.specialization !== '') {
         tempdata = tempdata.filter(user => user.specialization === filterData.specialization)
      } else {
         tempdata = tempdata.filter(user => user.specialization !== '')
      }

      if (filterData.timeZone !== '') {
         tempdata = tempdata.filter(user => user.timeZone === filterData.timeZone)
      } else {
         tempdata = tempdata.filter(user => user.timeZone !== '')
      }

      setFilteredData(tempdata)
   }, [filterData, tableData])

   // console.log('f', filteredData);

   const removeFilter = key => {
      let tempFilterData = { ...filterData }
      tempFilterData[key] = ''
      setFilterData(tempFilterData)
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
      // setTableData(tempTableData)
      setTableHeaders(tempTableHeaders)
   }, []);

   const handleNavigate = (item) => {
      console.log(item);
      navigate(item)
   }

   const handleAssign = (item) => {
      if (!modalData?.tutorId || studentMultiple?.length === 0) {
         alert("Select students and tutor both for maping.")
         return
      }
      setLoading(true)
      let users = studentMultiple?.map(ii => ii?._id)
      addAssignedTutor2({ tutorId: modalData?.tutorId, users }).then((res) => {
         console.log("successassignedTutor", res)
         if (res?.data) {
            alert("Successfully mapped students to tutor.")

         }
         fetch2()
         setLoading(false)
         fetch()
         setStudentMultiple([])

         setModalData(initialState)
         setAssignStudentModalActive(false)
         setAssignedTutorOpen(false)
         console.log(res.data);
      })
   }
   useEffect(() => {
      setAssignStudentModalActive(assignedTutorOpen)
   }, [assignedTutorOpen])
   const handleMultipleStudent = (student) => {
      console.log({ student })
      console.log({ studentMultiple, modalData })
      let bool = studentMultiple?.find((student1) => student1?._id === student?._id)
      if (bool) {
         let updated = studentMultiple.filter(
            (test) => test?._id !== student._id
         );
         setStudentMultiple(updated);
      } else {
         setStudentMultiple((prev) => {
            return [...prev,
            { _id: student?._id, value: student?.value }]
         })
      }
   }

   // console.log({studentMultiple,modalData})
   // console.log('allAssignedTests', allAssignedTests);
   return (
      <>
         {/* <button
                     className="bg-primaryOrange w-full text-lg justify-center flex pt-4 pb-4 px-5 items-center text-white font-semibold rounded-lg"
                     onClick={() => setAssignStudentModalActive(true)}
                  >
                     Assign Tutor
                     <img src={AddIcon} className="ml-3" />
                  </button> */}
         {/* <div className="lg:ml-pageLeft bg-lightWhite min-h-screen">
            <div className="py-14 px-5">
              <div className="flex gap-4 justify-between items-center">
                  {localStorage.getItem('role') === "parent" || localStorage.getItem('role') === 'student' ? <p className={`font-bold text-4xl text-primary-dark`}
                  style={{ color: "#25335A" }}
                  >
                     Assigned Tutors
                  </p> : <></>}

                  <InputField
                     value={filterData.tutorName}
                     IconRight={SearchIcon}
                     onChange={e => setFilterData({ ...filterData, tutorName: e.target.value })}
                     optionData={optionData}
                     placeholder="Tutor Name"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     parentClassName="w-full text-sm"
                     type="text"
                  />
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
                  <InputSelect
                     value={filterData.timeZone}
                     onChange={val => setFilterData({ ...filterData, timeZone: val })}
                     optionData={timeZones}
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     placeholder="Timezone"
                     parentClassName="w-full text-sm"
                     type="select"
                  />
                  <InputSelect
                     value={filterData.specialization}
                     onChange={val => setFilterData({ ...filterData, specialization: val })}
                     optionData={specializations}
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     placeholder="Specialization"
                     parentClassName="w-full text-sm"
                     type="select"
                  />

                  <button
                     className="bg-primaryOrange w-full text-lg justify-center flex pt-4 pb-4 px-5 items-center text-white font-semibold rounded-lg"
                     onClick={() => setAssignStudentModalActive(true)}
                  >
                     Assign Tutor
                     <img src={AddIcon} className="ml-3" />
                  </button>

               </div>

               <div className='mt-4' >
                  <FilterItems items={filterItems} setData={setFilterItems} onRemoveFilter={onRemoveFilter} />
               </div> 


               <div className="mt-6">
                  <Table
                     onClick={{ handleDelete, handleNavigate }}
                     dataFor='assignedTutors'
                     data={filteredData}
                     excludes={['assiginedTutor', 'student_id', 'parentFirstName', 'parentLast']}
                     tableHeaders={tableHeaders}
                     headerObject={true}
                     maxPageSize={maxPageSize}
                     setMaxPageSize={setMaxPageSize}
                     loading={tableLoading}
                  />
               </div>
            </div>
         </div> */}

         {assignStudentModalActive && (
            <Modal
               title="Map Tutor - Student"
               classname={"max-w-[666px] mx-auto"}
               cancelBtn={true}
               cancelBtnClassName="max-w-140 text-[#FFA28D] border-[1.5px] border-[#FFA28D] bg-white hover:bg-[#FFA28D] hover:text-white  font-medium rounded-lg  px-[10px] py-[17.33px] text-center dark:bg-white dark:hover:bg-[#FFA28D] !w-[146px]"
               buttonParentClassName="justify-center"
               primaryBtn={{
                  text: "Confirm",
                  className: "pl-4 px-4 !bg-[#FFA28D] text-white w-[146px]",
                  onClick: () => handleAssign(),
                  disabled: submitBtnDisabled,
                  loading: loading
               }}
               handleClose={handleClose}
               body={
                  <>
                     <div className="grid grid-cols-1 mt-[-10px] md:grid-cols-2 gap-x-5 md:gap-x-8 gap-y-1 mb-10">
                        <div>
                           {/* <InputSearch
                              label="Student Name"
                              value={modalData.studentName}
                              onChange={e =>
                                 setModalData({
                                    ...modalData,
                                    studentName: e.target.value,
                                 })
                              }
                              optionData={students}
                              onOptionClick={(item) => {
                                 setModalData({
                                    ...modalData,
                                    studentName: item.value,
                                    studentId: item._id
                                 })
                              }}
                              optionPrefix='s'
                              parentClassName="w-full mr-4"
                              labelClassname="ml-2 mb-0.5 text-[#26435F]"                                 
                              inputContainerClassName="px-5 py-3.5 text-sm bg-primary-50 border-0"
                              inputClassName="bg-transparent"
                              placeholder="Student Name"
                              type="select"
                           /> */}
                           <InputSearch
                              label="Student Name"
                              labelClassname="text-base-20 text-[#26435F] mb-1 tracking-wide"
                              placeholder="Search Student"
                              placeholderClass="text-base-17-5"

                              inputContainerClassName=" text-base-17-5 bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                              inputClassName="bg-[#F3F5F7]"
                              type="text"
                              value={studentMultiple.length==0?modalData?.studentName:studentMultiple?.map(itt => itt?.value)}
                              checkbox={{
                                 visible: true,
                                 name: "student",
                                 match: studentMultiple?.map(itt => itt?._id),
                              }}
                              onChange={e =>
                                 setModalData({
                                    ...modalData,
                                    studentName: e.target.value,
                                 })
                              }
                              rightIcon={down} 
                              optionListClassName="text-base-17-5"
                              optionClassName="text-base-17-5"
                              optionData={students}
                              // right={<img className="" src={down} />}
                              onOptionClick={(item) => {

                                 handleMultipleStudent(item)


                                 // handleTestChange(item);
                                 // setStudent(item.value);
                                 // handleStudentsChange(item)
                                 // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                              }}
                           />
                        </div>
                        <div>

                           <InputSearch
                              label="Tutor Name"
                              value={modalData.tutorName}
                              onChange={e =>
                                 setModalData({
                                    ...modalData,
                                    tutorName: e.target.value,
                                 })
                              }
                              optionData={tutors}
                              onOptionClick={(item) => {
                                 setModalData({
                                    ...modalData,
                                    tutorName: item.value,
                                    tutorId: item._id
                                 })
                              }}
                              rightIcon={down} 
                              optionPrefix='t'
                              parentClassName="w-full mr-4"
                              labelClassname=" mb-1 text-base-20 tracking-wide text-[#26435F]"
                              inputContainerClassName="px-5 py-3.5 text-sm bg-primary-50 border-0"
                              inputClassName="bg-transparent"
                              placeholder="Select Tutor"
                              type="select"
                           />
                        </div>
                     </div>
                  </>
               }
            />
         )}
      </>
   );
}
