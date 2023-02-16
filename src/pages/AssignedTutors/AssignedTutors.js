import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import InputSelect from "../../components/InputSelect/InputSelect";

import AddIcon from "../../assets/icons/add.svg";
import SearchIcon from "../../assets/icons/search.svg";

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

const optionData = []
const tempTableHeaders = [
   "Tutor Name",
   "Student Name",
   "Timezone",
   "Sercides",
   "Parent",
   "Start Date",
   "Diagnostic Score",
   "Remove Tutor",
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

export default function AssignedTutors(props) {

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
      tutorName: '',
      studentName: '',
      timeZone: '',
      specialization: '',
   })

   const [modalData, setModalData] = useState(initialState);
   const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery();


   const [students, setStudents] = useState([]);

   const [maxPageSize, setMaxPageSize] = useState(10);

   const [filterItems, setFilterItems] = useState([])

   const fetch = () => {

   }
   useEffect(() => {
      fetch()
   }, [])

   const handleResend = (item) => {
      setTestToResend(item)
      setResendModalActive(true);
   };


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


   const handleDelete = item => {
      setTestToDelete(item)
      setDeleteModalActive(true)
   }


   // console.log('allAssignedTests', allAssignedTests);
   return (
      <>
         <div className="lg:ml-pageLeft bg-lightWhite min-h-screen">
            <div className="py-14 px-5">
               <div className="flex gap-4 justify-between items-center">
                  {localStorage.getItem('role') === "parent" || localStorage.getItem('role') === 'student' ? <p className={`font-bold text-4xl text-primary-dark`}
                  // style={{ color: "#25335A" }}
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
                  <InputField
                     value={filterData.timeZone}
                     onChange={e => setFilterData({ ...filterData, timeZone: e.target.value })}
                     IconRight={SearchIcon}
                     parentClassName="w-full text-sm"
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     optionData={optionData}
                     placeholder="TimeZone"
                     type="text"
                  />
                  <InputSelect
                     value={filterData.specialization}
                     onChange={val => setFilterData({ ...filterData, specialization: val })}
                     optionData={['Started', 'Not Started', 'Completed']}
                     inputContainerClassName="px-[20px] py-[16px] bg-white"
                     placeholder="Specialization"
                     parentClassName="w-full text-sm"
                     type="select"
                  />

                  <button
                     className="bg-primaryOrange w-full text-lg justify-center flex pt-4 pb-4 px-5 items-center text-white font-semibold rounded-lg"
                  // onClick={() => setAssignTestModalActive(true)}

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
                     onClick={{}}
                     dataFor='assignedTests'
                     data={[]}
                     excludes={['createdAt', 'assignedTestId']}
                     tableHeaders={tableHeaders}
                     maxPageSize={maxPageSize}
                     setMaxPageSize={setMaxPageSize}
                  />
               </div>
            </div>
         </div>

      </>
   );
}
