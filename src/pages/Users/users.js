import React, { useEffect, useState } from 'react'

import Table from '../../components/Table/Table'
import FilterItems from '../../components/FilterItems/filterItems'
import Modal from '../../components/Modal/Modal'
import InputField from '../../components/InputField/inputField'
import InputSelect from '../../components/InputSelect/InputSelect'

import AddIcon from '../../assets/icons/add.svg'
import SearchIcon from '../../assets/icons/search.svg'
import { tableData, userTypesList } from './tempData'
import { useAddUserMutation, useLazyGetAllUsersQuery } from '../../app/services/users'
import { useSignupUserMutation } from '../../app/services/auth'
import { useNavigate } from 'react-router-dom'
import { roles } from '../../constants/constants'
import { useBlockUserMutation, useUnblockUserMutation } from '../../app/services/admin'

const optionData = [
   'option 1',
   'option 2',
   'option 3',
   'option 4',
   'option 5',
]

const tableHeaders = [
   'Full Name', 'User Type', "Email", 'Phone', 'Assigned Tutor', 'Lead Status', 'User Status',
   'Services'
]

const userTypeOptions = ['tutor', 'parent', 'student']

const initialState = {
   email: '',
   firstName: '',
   lastName: '',
   phone: '',
   userType: '',
}
export default function Users() {
   
   // const [filterItems, setFilterItems] = useState(['Student', 'Parent', 'Active'])
   const [modalActive, setModalActive] = useState(false)
   // const [modalUserType, setModalUserType] = useState('')
   const navigate = useNavigate()
   const [modalData, setModalData] = useState(initialState)
   const [validData, setValidData] = useState(true);
   useEffect(() => {
      setValidData(modalData.email && modalData.firstName && modalData.lastName && modalData.userType);
   }, [modalData, modalData.email.length, modalData.firstName.length, modalData.lastName.length, modalData.phone.length, modalData.userType.length,])

   const [usersData, setUsersData] = useState([])
   const [filteredUsersData, setFilteredUsersData] = useState([])
   
   const [filterItems, setFilterItems] = useState([])

   const [blockUser, blockUserResp] = useBlockUserMutation()
   const [unblockUser, unblockUserResp] = useUnblockUserMutation()

   const [fetchUsers, fetchUsersResp] = useLazyGetAllUsersQuery()
   const [addUser, addUserResp] = useAddUserMutation()
   const [signupUser, signupUserResp] = useSignupUserMutation();
   const [maxPageSize, setMaxPageSize] = useState(10)

   const [filterData, setFilterData] = useState({
      typeName: '',
      userType: '',
      status: '',
      services: '',
      tutor: ''
   })

   const fetch = () => {
      fetchUsers()
         .then(res => {
            console.log(res.data.data);
            let data = res.data.data.user.map(user => {
               return {
                  _id: user._id,
                  block: user.block,
                  name: `${user.firstName} ${user.lastName}`,
                  email: user.email ? user.email : '-',
                  userType: user.role ? user.role : '-',
                  phone: user.phone ? user.phone : '-',
                  assignedTutor: '-',
                  leadStatus: '-',
                  tutorStatus: '-',
                  services: '-',
               }
            })
            setUsersData(data)
            setFilteredUsersData(data)
         })
   }
   useEffect(() => {
      fetch()
   }, [maxPageSize])

   useEffect(() => {
      let tempdata = [...usersData]
      // console.log(usersData)
      if (filterData.userType !== '') {
         tempdata = tempdata.filter(user => user.userType === filterData.userType)
      } else {
         tempdata = tempdata.filter(user => user.userType !== '')
      }
      if (filterData.typeName !== '') {
         const regex2 = new RegExp(`${filterData.typeName.toLowerCase()}`, 'i')
         tempdata = tempdata.filter(user => user.name.match(regex2))
      } else {
         tempdata = tempdata.filter(user => user.name !== '')
      }
      setFilteredUsersData(tempdata)
   }, [filterData])

   const removeFilter = key => {
      let tempFilterData = { ...filterData }
      tempFilterData[key] = ''
      // console.log(key)
      // console.log(tempFilterData)
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
      // console.log(arr)
      setFilterItems(arr)
   }, [filterData])


   const onRemoveFilter = (item) => item.removeFilter(item.type)

   const handleSubmit = e => {
      e.preventDefault()
      if (modalData.userType === '') return alert('Fill all the fields')
      let body = {
         firstName: modalData.firstName,
         lastName: modalData.lastName,
         email: modalData.email,
      }
      if (modalData.userType === 'tutor') {
         console.log(body)
         addUser(body)
            .then(res => {
               console.log(res)
               if (res.error) {
                  alert(res.error.data.message)
                  return
               }
               setModalData(initialState)
               handleClose()
            })
         return
      } else {
         body.role = modalData.userType
         console.log(body)
         signupUser(body)
            .then(res => {
               console.log(res)
               if (res.error) {
                  alert(res.error.data.message)
                  return
               }
               setModalData(initialState)
               handleClose()
            })
      }
   }

   const handleClose = () => setModalActive(false)

   const redirect = item => {
      // console.log(item)
      if (roles.includes(item.userType) && item.userType !== 'admin') {
         navigate(`/profile/${item.userType}/${item._id}`)
      }
   }

   const handleTutorStatus = item => {
      console.log(item)
      if (item.block === false) {
         blockUser({ id: item._id })
            .then((res) => {
               if (res.data.status === 'success') {
                  let temp = usersData.map(user => {
                     if (user._id === item._id) {
                        return { ...user, block: true }
                     } else {
                        return { ...user }
                     }
                  })
                  setUsersData(temp)
                  setFilterData({...filterData})
               }
            })
      } else if (item.block === true) {
         unblockUser({ id: item._id })
            .then((res) => {
               let temp = usersData.map(user => {
                  if (user._id === item._id) {
                     return { ...user, block: false }
                  } else {
                     return { ...user }
                  }
               })
               setUsersData(temp)
               setFilterData({...filterData})
            })
      }
   }

   return (
      <div className='lg:ml-pageLeft bg-lightWhite min-h-screen'>
         <div className='py-14 px-5'>
            <div className='flex justify-between items-center'>
               <p className='font-bold text-4xl text-primary-dark'>All Users</p>
               <button className='bg-primary py-3.5 text-lg px-[21px] flex items-center text-white font-semibold rounded-lg mr-55'
                  onClick={() => setModalActive(true)}>
                  Add new User
                  <img src={AddIcon} className='ml-3' />
               </button>
            </div>
            <div className='flex align-center mt-8 gap-[20px]'>
               <InputField
                  IconRight={SearchIcon}
                  placeholder='Type Name'
                  parentClassName='w-full'
                  inputContainerClassName='text-sm text-sm bg-white  px-[20px] py-[16px] border'
                  type='text'
                  value={filterData.typeName}
                  onChange={e => setFilterData({ ...filterData, typeName: e.target.value })} />
               <InputSelect optionData={userTypesList}
                  inputContainerClassName='text-sm border bg-white px-[20px] py-[16px]'
                  placeholder='User Type'
                  parentClassName='w-full'
                  type='select'
                  value={filterData.userType}
                  onChange={val => setFilterData({ ...filterData, userType: val })} />
               <InputSelect optionData={optionData}
                  placeholder='Lead Status'
                  parentClassName='w-full'
                  inputContainerClassName='text-sm border bg-white px-[20px] py-[16px]'
                  type='select'
                  value={filterData.status}
                  onChange={val => setFilterData({ ...filterData, status: val })} />
               <InputSelect optionData={optionData}
                  placeholder='Services'
                  parentClassName='w-full'
                  type='select'
                  inputContainerClassName='text-sm border bg-white px-[20px] py-[16px]'
                  value={filterData.services}
                  onChange={val => setFilterData({ ...filterData, services: val })} />
               <InputSelect optionData={optionData}
                  placeholder='Tutor'
                  parentClassName='w-full'
                  type='select'
                  inputContainerClassName='text-sm border bg-white px-[20px] py-[16px]'
                  value={filterData.tutor}
                  onChange={val => setFilterData({ ...filterData, tutor: val })} />
            </div>
            <div className='mt-4' >
               <FilterItems items={filterItems} setData={setFilterItems} onRemoveFilter={onRemoveFilter} />
            </div>
            <div className='mt-6'>
               <Table dataFor='allUsers'
                  data={filteredUsersData}
                  onClick={{ redirect, handleTutorStatus }}
                  tableHeaders={tableHeaders}
                  maxPageSize={maxPageSize} 
                  setMaxPageSize={setMaxPageSize} />
            </div>
         </div>

         {
            modalActive &&
            <Modal
               classname={'max-w-[780px] mx-auto'}
               title='Add a New User'
               cancelBtn={true}
               cancelBtnClassName='w-140'
               primaryBtn={{
                  text: "Add",
                  className: 'w-140',
                  form: 'add-user-form',
                  // onClick: handleSubmit,
                  type: 'submit',
                  disabled: !validData
               }}
               handleClose={handleClose}
               body={
                  <form id='add-user-form' onSubmit={handleSubmit} className='px-[3px] mb-0.5' >
                     <div className='grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-3 gap-y-4 mb-5'>
                        <div>
                           <InputField label='First Name'
                              labelClassname='ml-4 mb-0.5'
                              placeholder='First Name'
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.firstName}
                              isRequired={true}
                              onChange={e => setModalData({ ...modalData, firstName: e.target.value })} />
                        </div>
                        <div>
                           <InputField label='Last Name'
                              labelClassname='ml-4 mb-0.5'
                              isRequired={true}
                              placeholder='Last Name'
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.lastName}
                              onChange={e => setModalData({ ...modalData, lastName: e.target.value })} />
                        </div>
                        <div>
                           <InputField label='Email Addresss'
                              labelClassname='ml-4 mb-0.5'
                              isRequired={true}
                              placeholder='Email Addresss'
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full' type='text'
                              value={modalData.email}
                              onChange={e => setModalData({ ...modalData, email: e.target.value })} />
                        </div>
                        <div>
                           <InputSelect value={modalData.userType}
                              onChange={val => setModalData({ ...modalData, userType: val })}
                              isRequired={true}
                              type='select'
                              placeholder='Select User Type'
                              label='User Type'
                              labelClassname='ml-4 mb-0.5'
                              optionData={userTypeOptions}
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 bg-primary-50 px-5 border-0'
                              parentClassName='w-full' />
                        </div>
                     </div>
                  </form>
               }
            />
         }

      </div>
   )
}
