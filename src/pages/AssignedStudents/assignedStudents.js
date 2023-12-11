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
   "Student Name",
   "Email",
   "Phone",
   // "Parent",
   "Service(s)",
   "Topic(s)",
   "Status",
   "Date Assigned",
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
   const [user, setUser] = useState({});
   const { role: persona } = useSelector(state => state.user)
   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery();
   const { organization } = useSelector((state) => state.organization);
   const { id } = useSelector(state => state.user)
   const [students, setStudents] = useState([]);
   const { firstName, lastName } = useSelector((state) => state.user);
   const [filteredStudents, setFilteredStudents] = useState([]);
   const [filterData, setFilterData] = useState({
      tutorName: '',
      studentName: '',
      timeZone: '',
      specialization: '',
   })

   useEffect(() => {
      setTableData(tempTableData)
      setTableHeaders(tempTableHeaders)
   }, [])

   const handleSubmit = () => {

   }

   useEffect(() => {
      console.log("rescaniting")
      getUserDetail({ id })
         .then(resp => {
            console.log('res', resp.data.data.user)
            let studentsData = []
            const fetch = (cb) => {
               resp.data.data.user.assiginedStudents.map((studentId, idx) => {
                  getUserDetail({ id: studentId })
                     .then(res => {
                        console.log('detail res', res?.data?.data)
                        if (res?.data?.data) {
                           const { _id, firstName, lastName, email, phone, services, topics, userStatus, assignedDate } = res.data.data.user
                           const { specialization, FirstName, LastName, timeZone } = res.data.data.userdetails
                           studentsData.push({
                              _id,
                              name: `${firstName} ${lastName}`,
                              email: `${email}`,
                              phone: `${phone}`,
                              services: `${services == undefined ? '_' : services}`,
                              topics: `${topics == undefined ? '_' : topics}`,
                              status: `${userStatus == undefined ? '_' : userStatus}`,
                              assignedDate: `${assignedDate == undefined ? '_' : assignedDate}`
                              // specialization: ['we', 'ew'].join(','),
                              // parentName: `${FirstName} ${LastName}`,
                              // score: '-',
                              // assignedDate: '_'
                           })
                        }
                        //   console.log("rescb",idx,resp.data.data.user.assiginedStudents.length - 1)
                        if (idx === resp.data.data.user.assiginedStudents.length - 1) {
                           console.log("rescb: student")
                           cb()
                        }
                     })
               })
            }
            fetch(() => {
               setStudents(studentsData)
               setFilteredStudents(studentsData)
            })
         })
   }, [id])

   useEffect(() => {
      let tempdata = [...students]
      // console.log(usersData)
      if (filterData.timeZone !== '') {
         tempdata = tempdata.filter(user => user.timeZone === filterData.timeZone)
      } else {
         tempdata = tempdata.filter(user => user.timeZone !== '')
      }
      if (filterData.specialization !== '') {
         tempdata = tempdata.filter(user => {
            let userSpecs = user.specialization.split(',')
            const regex2 = new RegExp(`${filterData.specialization.toLowerCase()}`, 'i')
            let isMatch = false
            // console.log('userSpecs', userSpecs);
            userSpecs.forEach(item => {
               if (item.match(regex2)) {
                  isMatch = true
               }
            })
            // console.log('isMatch', isMatch);
            if (isMatch) return user
         })
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

   const handleClose = () => setModalActive(false);
   const [validData, setValidData] = useState(true);
   useEffect(() => {
      setValidData(modalData.email && modalData.firstName && modalData.lastName && modalData.userType);
   }, [modalData, modalData.email.length, modalData.firstName.length, modalData.lastName.length, modalData.phone.length, modalData.userType.length,])
   

   

   return (
      <>
         <div className="w-[1920px] h-auto flex justify-center items-center bg-lightWhite">
           <div className="w-[1600px] h-full flex flex-col justify-center items-center">

            {/*  route path  */}
               <p className="w-full text-[#24A3D9] text-[20px] mt-[50px] mb-[30px]">
          {persona === "admin" ? (
            <span>
              <span className="!cursor-pointer" onClick={() => navigate("/")}>
                {organization?.company + "  >  " + firstName + "  " + lastName}{" "}
              </span>
              <span
                className="!cursor-pointer"
                onClick={() => navigate("/users")}
              >
                {"  >  CRM > "}
              </span>
              <span className="font-semibold">
                {user?.firstName + " " + user?.lastName}
              </span>
            </span>
          ) : (
            <span>
              <span onClick={() => navigate("/")} className="cursor-pointer">
                {organization?.company +
                  " > " +
                  firstName +
                  " " +
                  lastName +
                  " > "}
              </span>
              <span className="font-semibold">Profile</span>
            </span>
          )}
          {/*  route path ends here */}
         </p> 

               <div className="w-full flex justify-between items-center">

                  {
                     persona === "tutor" || <p className={`font-bold text-4xl text-primary-dark`}
                     >
                        Assigned Students
                     </p>
                  }
               </div>
               

               <div className="w-full flex justify-start items-center mb-[30px]">
               {
                  persona === "tutor" ?
                     <InputField
                        value={filterData.studentName}
                        IconRight={SearchIcon}
                        onChange={e => setFilterData({ ...filterData, studentName: e.target.value })}
                        optionData={optionData}
                        placeholder="Search"
                        iconPadding="pl-[18.75px]"
                        inputContainerClassName="border bg-white h-full w-full px-[21.25px] rounded-[7.5px]"
                        parentClassName="w-[423.75px] h-[50px]"
                        type="text"
                     /> :
                     <div className="flex align-center">
                        <InputField
                           value={filterData.tutorName}
                           IconRight={SearchIcon}
                           onChange={e => setFilterData({ ...filterData, tutorName: e.target.value })}
                           optionData={optionData}
                           placeholder="Tutor Name"
                           inputContainerClassName="border bg-white py-[16px] px-[20px] w-[250px]"
                           parentClassName="w-full mr-4"
                           type="text"
                        />
                        <InputField
                           value={filterData.studentName}
                           IconRight={SearchIcon}
                           onChange={e => setFilterData({ ...filterData, studentName: e.target.value })}
                           optionData={optionData}
                           placeholder="Student Name"
                           inputContainerClassName="border bg-white py-[16px] px-[20px] w-[250px]"
                           parentClassName="w-full mr-4"
                           type="text"
                        />
                        <InputSelect
                           optionData={timeZones}
                           // onChange={val => setFilterData({ ...filterData, timeZone: val })}
                           inputContainerClassName="border bg-white px-[20px] py-[16px] h-[39.55px] w-[200px]"
                           placeholder="Time Zones"
                           parentClassName="w-full mr-4"
                           type="select"
                           value={filterData.timeZone.length > 0 ? filterData.timeZone[0] : ""}
                           checkbox={{
                              visible: true,
                              name: "test",
                              match: filterData.timeZone,
                           }}
                           onChange={(val) =>
                              setFilterData({
                                 ...filterData,
                                 timeZone: filterData.timeZone.includes(val)
                                    ? filterData.timeZone.filter((item) => item !== val)
                                    : [...filterData.timeZone, val],
                              })
                           }
                        />
                        <InputField
                           value={filterData.specialization}
                           IconRight={SearchIcon}
                           onChange={e => setFilterData({ ...filterData, specialization: e.target.value })}
                           placeholder="Specialization"
                           inputContainerClassName="border bg-white py-[16px] px-[20px] w-[250px]"
                           parentClassName="w-full mr-4"
                           type="text"
                        />
                        {/* <button className='bg-primary py-3.5 w-full text-lg px-[21px] flex justify-center items-center text-white font-semibold rounded-lg'
                     onClick={() => setModalActive(true)}>
                     Assign Tutor
                     <img src={AddIcon} className='ml-3' />
                  </button> */}
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
               }
               </div>

               <div className="">
                  <FilterItems items={filterItems} setData={setFilterItems}
                     onRemoveFilter={onRemoveFilter} />
               </div>
               {console.log(filteredStudents, "students")}
               <div className="w-full mb-[100px]">
                  <Table
                     onClick={{ handleNavigate }}
                     dataFor='assignedStudents'
                     data={filteredStudents}
                     excludes={['_id']}
                     tableHeaders={tableHeaders}
                     maxPageSize={10}
                     widthFullTable={true}
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
