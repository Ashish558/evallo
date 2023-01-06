import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import InputSelect from "../../components/InputSelect/InputSelect";

import AddIcon from "../../assets/icons/add.svg";
import SearchIcon from "../../assets/icons/search.svg";

import { tempTableData } from "./tempData";
import InputField from "../../components/InputField/inputField";
import { BASE_URL } from "../../app/constants/constants";
import InputSearch from "../../components/InputSearch/InputSearch";
import { useLazyGetUserDetailQuery } from "../../app/services/users";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const optionData = ["1", "2", "3", "4", "5"];
const testData = ["SAT", "ACT"];

const tempTableHeaders = [
   "Student Name",
   "Time Zone",
   "Service(s)",
   "Parent",
   // "Start Date",
   "Diagnostic Score",
   "Status",
   "",
];

export default function AssignedStudents() {

   const [tableData, setTableData] = useState([])
   const [tableHeaders, setTableHeaders] = useState([])
   const navigate = useNavigate()
   const persona = sessionStorage.getItem("role");
   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()

   const { id } = useSelector(state => state.user)
   const [students, setStudents] = useState([])

   const [filterData, setFilterData] = useState({
      studentName: '',
      timeZone: '',
      service: '',
      date: '',
      status: '',
   })

   useEffect(() => {
      setTableData(tempTableData)
      setTableHeaders(tempTableHeaders)
   }, [])

   // console.log(students)

   useEffect(() => {
      getUserDetail({ id })
         .then(resp => {
            console.log(resp.data.data.user)
            let studentsData = []
            const fetch = (cb) => {
               resp.data.data.user.assiginedStudents.map((studentId, idx) => {
                  getUserDetail({ id: studentId })
                     .then(res => {
                        const { _id, firstName, lastName } = res.data.data.user
                        const { serviceSeeking, FirstName, LastName, timeZone } = res.data.data.userdetails
                        studentsData.push({
                           _id,
                           name: `${firstName} ${lastName}`,
                           timeZone: timeZone ? timeZone : '-',
                           services: serviceSeeking ? serviceSeeking.join() : '-',
                           parentName: `${FirstName} ${LastName}`,
                           score: '-',
                           status: '-'
                        })
                        if (idx === resp.data.data.user.assiginedStudents.length - 1) cb()
                     })
               })
            }
            fetch(() => {
               setStudents(studentsData)
            })
         })
   }, [])

   const handleNavigate = (role, id) => {
      navigate(`/profile/${role}/${id}`)
   }

   return (
      <>
         <div className="lg:ml-pageLeft bg-lightWhite min-h-screen">
            <div className="py-14 px-5 pl-8 text-sm">
               <div className="flex justify-between items-center">
                  <p className={`font-bold text-4xl text-primary-dark`}
                  // style={{ color: "#25335A" }}
                  >
                     Assigned Students
                  </p>

               </div>

               <div className="flex align-center mt-8 max-w-[1200px]">
                  <InputField
                     value={filterData.studentName}
                     IconRight={SearchIcon}
                     onChange={e => setFilterData({ ...filterData, studentName: e.target.value })}
                     optionData={optionData}
                     placeholder="Student Name"
                     inputContainerClassName="border bg-white py-[16px] px-[20px]"
                     parentClassName="w-full mr-4"
                     type="text"
                  />
                  <InputSelect
                     value={filterData.timeZone}
                     onChange={val => setFilterData({ ...filterData, timeZone: val })}
                     optionData={optionData}
                     inputContainerClassName="py-[16px] px-[20px] border bg-white"
                     placeholder="Time Zones"
                     parentClassName="w-full mr-4"
                     type="select"
                  />
                  <InputSelect
                     value={filterData.service}
                     onChange={val => setFilterData({ ...filterData, service: val })}
                     optionData={optionData}
                     inputContainerClassName="py-[16px] px-[20px] border bg-white"
                     placeholder="Service"
                     parentClassName="w-full mr-4"
                     type="select"
                  />
                  {/* <InputSelect
                     value={filterData.date}
                     onChange={val => setFilterData({ ...filterData, date: val })}
                     optionData={optionData}
                     inputContainerClassName="py-[16px] px-[20px] border bg-white"
                     placeholder="Start Date"
                     parentClassName="w-full mr-4"
                     type="select"
                  /> */}
                  <InputSelect
                     value={filterData.status}
                     onChange={val => setFilterData({ ...filterData, status: val })}
                     optionData={optionData}
                     inputContainerClassName="py-[16px] px-[20px] border bg-white"
                     placeholder="Status"
                     parentClassName="w-full mr-4"
                     type="select"
                  />
               </div>

               <div className="mt-6">
                  <Table
                     onClick={{ handleNavigate }}
                     dataFor='assignedStudents'
                     data={students}
                     excludes={['_id']}
                     tableHeaders={tableHeaders}
                     maxPageSize={10}
                  />
               </div>
            </div>
         </div>

      </>
   );
}
