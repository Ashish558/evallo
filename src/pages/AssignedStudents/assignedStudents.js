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
import { timeZones } from "../../constants/constants";
import FilterItems from "../../components/FilterItems/filterItems";

const optionData = ["1", "2", "3", "4", "5"];
const testData = ["SAT", "ACT"];

const tempTableHeaders = [
   "Tutor Name",
   "Student Name",
   "Time Zone",
   "Service(s)",
   "Parent",
   // "Start Date",
   "Diagnostic Score",
   // "Status",
   "",
];
const initialState = {
   email: '',
   firstName: '',
   lastName: '',
   phone: '',
   userType: '',
}

export default function AssignedStudents() {

   const [tableData, setTableData] = useState([])
   const [tableHeaders, setTableHeaders] = useState([])
   const navigate = useNavigate()
   const [filterItems, setFilterItems] = useState([])
   const [modalActive, setModalActive] = useState(false)
   const [modalData, setModalData] = useState(initialState)

   const { role: persona } = useSelector(state => state.user)

   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()

   const { id } = useSelector(state => state.user)
   const [students, setStudents] = useState([])
   const [filteredStudents, setFilteredStudents] = useState([])

   const [filterData, setFilterData] = useState({
      tutorName: '',
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

   const handleSubmit = () => {

   }

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
               setFilteredStudents(studentsData)
            })
         })
   }, [])

   useEffect(() => {
      let tempdata = [...students]
      // console.log(usersData)
      if (filterData.timeZone !== '') {
         tempdata = tempdata.filter(user => user.timeZone === filterData.timeZone)
      } else {
         tempdata = tempdata.filter(user => user.timeZone !== '')
      }

      if (filterData.name !== '') {
         const regex2 = new RegExp(`${filterData.studentName.toLowerCase()}`, 'i')
         tempdata = tempdata.filter(user => user.name.match(regex2))
      } else {
         tempdata = tempdata.filter(user => user.name !== '')
      }
      setFilteredStudents(tempdata)
   }, [filterData])

   const onRemoveFilter = (item) => item.removeFilter(item.type)

   const removeFilter = key => {
      let tempFilterData = { ...filterData }
      tempFilterData[key] = ''
      setFilterData(tempFilterData)
   }

   //change filter items to display if input data changes
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

   const handleNavigate = (role, id) => {
      navigate(`/profile/${role}/${id}`)
   }


   // console.log('filterData', filterData)
   // console.log('filterItems', filterItems)

   const handleClose = () => setModalActive(false);
   const [validData, setValidData] = useState(true);
   useEffect(() => {
      setValidData(modalData.email && modalData.firstName && modalData.lastName && modalData.userType);
   }, [modalData, modalData.email.length, modalData.firstName.length, modalData.lastName.length, modalData.phone.length, modalData.userType.length,])

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

               <div className="flex align-center mt-8">
                  <InputField
                     value={filterData.tutorName}
                     IconRight={SearchIcon}
                     onChange={e => setFilterData({ ...filterData, tutorName: e.target.value })}
                     optionData={optionData}
                     placeholder="Tutor Name"
                     inputContainerClassName="border bg-white py-[16px] px-[20px]"
                     parentClassName="w-full mr-4"
                     type="text"
                  />
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
                     optionData={timeZones}
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
                  <button className='bg-primary py-3.5 w-full text-lg px-[21px] flex justify-center items-center text-white font-semibold rounded-lg'
                     onClick={() => setModalActive(true)}>
                     Assign Tutor
                     <img src={AddIcon} className='ml-3' />
                  </button>
                  {/* <InputSelect
                     value={filterData.date}
                     onChange={val => setFilterData({ ...filterData, date: val })}
                     optionData={optionData}
                     inputContainerClassName="py-[16px] px-[20px] border bg-white"
                     placeholder="Start Date"
                     parentClassName="w-full mr-4"
                     type="select"
                  /> */}
                  {/* <InputSelect
                     value={filterData.status}
                     onChange={val => setFilterData({ ...filterData, status: val })}
                     optionData={optionData}
                     inputContainerClassName="py-[16px] px-[20px] border bg-white"
                     placeholder="Status"
                     parentClassName="w-full mr-4"
                     type="select"
                  /> */}
               </div>
               <div className="pt-4 ">
                  <FilterItems items={filterItems} setData={setFilterItems}
                     onRemoveFilter={onRemoveFilter} />
               </div>

               <div className="mt-6">
                  <Table
                     onClick={{ handleNavigate }}
                     dataFor='assignedStudents'
                     data={filteredStudents}
                     excludes={['_id']}
                     tableHeaders={tableHeaders}
                     maxPageSize={10}
                  />
               </div>
            </div>
         </div>

         {
            modalActive &&
            <Modal
               classname={'max-w-[780px] mx-auto'}
               title='Assign Tutor'
               cancelBtn={true}
               cancelBtnClassName='w-140'
               primaryBtn={{
                  text: "Assign Tutor",
                  // className: 'w-140',
                  form: 'add-user-form',
                  // onClick: handleSubmit,
                  type: 'submit',
                  disabled: !validData
               }}
               handleClose={handleClose}
               body={
                  <form id='add-user-form' onSubmit={handleSubmit} className='px-[3px] mb-0.5' >
                     <div className='grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-4 mb-5'>
                        <InputSelect optionData={optionData}
                           placeholder='Select Tutor'
                           parentClassName='w-full'
                           type='select'
                           inputContainerClassName='text-sm border bg-lightWhite px-[20px] py-[16px]'
                           value={filterData.tutor}
                           onChange={val => setFilterData({ ...filterData, tutor: val })} />
                        <InputSelect optionData={optionData}
                           placeholder='Select Student'
                           parentClassName='w-full'
                           type='select'
                           inputContainerClassName='text-sm border bg-lightWhite px-[20px] py-[16px]'
                           value={filterData.tutor}
                           onChange={val => setFilterData({ ...filterData, tutor: val })} />
                     </div>
                  </form>
               }
            />
         }
      </>
   );
}
