import React, { useEffect, useState } from 'react'

import Table from '../../components/Table/Table'
import FilterItems from '../../components/FilterItemsNew/filterItems'
import Modal from '../../components/Modal/Modal'
import InputField from '../../components/InputField/inputField'
import InputSelect from '../../components/InputSelect/InputSelect'

import AddIcon from '../../assets/icons/add.svg'
import SearchIcon from '../../assets/icons/search.svg'
import { tableData, userTypesList } from './tempData'
import { useAddUserMutation, useLazyGetAllUsersQuery, useLazyGetTutorDetailsQuery, useLazyGetUserDetailQuery } from '../../app/services/users'
import { useSignupUserMutation } from '../../app/services/auth'
import { useNavigate } from 'react-router-dom'
import { roles } from '../../constants/constants'
import { useBlockUserMutation, useDeleteUserMutation, useUnblockUserMutation } from '../../app/services/admin'
import { useLazyGetSettingsQuery } from '../../app/services/session'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import CountryCode from '../../components/CountryCode/CountryCode'
import { isPhoneNumber } from '../Signup/utils/util'
import { checkIfExistInNestedArray } from '../../utils/utils'

const optionData = [
   'option 1',
   'option 2',
   'option 3',
   'option 4',
   'option 5',
]

const tableHeaders = [
   'Full Name', 'User Type', "Email", 'Phone', 'Tutor', 'Lead Status', 'User Status',
   'Specialization', 'Created On'
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

   const [modalActive, setModalActive] = useState(false)
   const navigate = useNavigate()
   const [modalData, setModalData] = useState(initialState)
   const [validData, setValidData] = useState(true);
   const [deleteModalActive, setDeleteModalActive] = useState(false)
   const [deleteLoading, setDeleteLoading] = useState(false)
   const [specializations, setSpecializations] = useState([])
   const [numberPrefix, setNumberPrefix] = useState("+1")

   useEffect(() => {
      setValidData(isEmail(modalData.email) && modalData.firstName && modalData.lastName && modalData.userType && modalData.phone)
   }, [modalData, modalData.email.length, modalData.firstName.length, modalData.lastName.length, modalData.phone.length, modalData.userType.length,])

   const [settings, setSettings] = useState({
      leadStatus: []
   })
   const [usersData, setUsersData] = useState([])
   const [filteredUsersData, setFilteredUsersData] = useState([])
   const [getUserDetail, getUserDetailResp] = useLazyGetUserDetailQuery()
   const [getTutorDetail, userDetailResp] = useLazyGetTutorDetailsQuery()

   const [filterItems, setFilterItems] = useState([])
   const [addUserBtnDisabled, setAddUserBtnDisabled] = useState(false)

   const [blockUser, blockUserResp] = useBlockUserMutation()
   const [unblockUser, unblockUserResp] = useUnblockUserMutation()
   const [fetchSettings, settingsResp] = useLazyGetSettingsQuery()
   const [userToDelete, setUserToDelete] = useState({})

   const [fetchUsers, fetchUsersResp] = useLazyGetAllUsersQuery()
   const [addUser, addUserResp] = useAddUserMutation()
   const [signupUser, signupUserResp] = useSignupUserMutation();
   const [deleteUser, deleteUserResp] = useDeleteUserMutation();

   const [maxPageSize, setMaxPageSize] = useState(10)
   const [loading, setLoading] = useState(false)

   const [totalPages, setTotalPages] = useState(0)
   const [currentPage, setCurrentPage] = useState(1)

   const [filterData, setFilterData] = useState({
      typeName: '',
      userType: [],
      status: [],
      specialization: [],
      userStatus: [],
      tutor: [],
   })

   useEffect(() => {
      fetchSettings()
         .then(res => {
            setSettings(res.data.data.setting)
         })
   }, [])

   // console.log(settings)

   const fetch = () => {
      setUsersData([])
      setFilteredUsersData([])
      fetchUsers({ currentPage, maxPageSize })
         .then(res => {
            console.log('all-users', res.data.data);
            setTotalPages(res.data.data.total_users)

            const fetchDetails = async () => {
               await res.data.data.user.map(async (user) => {
                  let obj = {
                     _id: user._id,
                     block: user.block,
                     userStatus: user.userStatus,
                     name: `${user.firstName} ${user.lastName}`,
                     email: user.email ? user.email : '-',
                     userType: user.role ? user.role : '-',
                     phone: user.phone ? user.phone : '-',
                     createdAt: user.createdAt,
                     assignedTutor: '-',
                     leadStatus: '-',
                     tutorStatus: '-',
                     specialization: user.specialization ? user.specialization : [],
                  }
                  if (user.role === 'tutor') {
                     // console.log('tutor', user._id);
                     await getTutorDetail({ id: user._id })
                        .then(resp => {
                           console.log('TUTOR RESp', resp);
                           
                           setFilterItems(prev => [...prev])
                           // console.log('tutor-details', resp.data.data);
                           let status = '-'
                           if (resp.data.data.details) {
                              status = resp.data.data.details.leadStatus
                              obj.leadStatus = status ? status : '-'
                           }
                           setUsersData(prev => [...prev, obj])
                           setFilteredUsersData(prev => [...prev, obj])
                        })
                  } else {
                     await getUserDetail({ id: user._id })
                        .then(resp => {
                           setFilterItems(prev => [...prev])
                           // console.log('user-details', resp.data.data);
                           let status = '-'
                           if (resp.data.data.userdetails) {
                              status = resp.data.data.userdetails.leadStatus
                              obj.leadStatus = status ? status : '-'
                           }
                           setUsersData(prev => [...prev, obj])
                           setFilteredUsersData(prev => [...prev, obj])
                        })
                  }

               })
            }

            fetchDetails()
            // setUsersData(data)
            // setFilteredUsersData(data)
         })
   }


   const changeUserField = (field, id) => {
      let temp = filteredUsersData.map(item => {
         // console.log(item[Object.keys(field)[0]]);
         if (item._id === id) {
            return { ...item, ...field }
         } else {
            return { ...item }
         }
      })
      let tempAllusers = usersData.map(item => {
         if (item._id === id) {
            return { ...item, ...field }
         } else {
            return { ...item }
         }
      })
      // console.log(temp);
      setFilteredUsersData(temp)
      setUsersData(tempAllusers)
   }

   useEffect(() => {
      fetch()
   }, [maxPageSize, currentPage])

   useEffect(() => {
      let tempdata = [...usersData]
      // console.log('all users data', usersData)
      // console.log('filterData.specialization', filterData.specialization)
      //USER TYPE FILTER
      if (filterData.userType.length > 0) {
         tempdata = tempdata.filter(user => filterData.userType.includes(user.userType))
      } else {
         tempdata = tempdata.filter(user => user.userType !== '')
      }

      //LEAD STATUS FILTER
      if (filterData.status.length > 0) {
         tempdata = tempdata.filter(user => filterData.status.includes(user.leadStatus))
      } else {
         tempdata = tempdata.filter(user => user.leadStatus !== '')
      }

      if (filterData.specialization.length > 0) {
         tempdata = tempdata.filter(user => checkIfExistInNestedArray(user.specialization, filterData.specialization))
      } else {
         tempdata = tempdata.filter(user => user.specialization !== '')
      }
      if (filterData.userStatus.length > 0) {
         tempdata = tempdata.filter(user => filterData.userStatus.includes(user.userStatus))
      } else {
         tempdata = tempdata.filter(user => user.userStatus !== '')
      }

      //NAME FILTER 
      if (filterData.typeName !== '') {
         const regex2 = new RegExp(`${filterData.typeName.toLowerCase()}`, 'i')
         tempdata = tempdata.filter(user => user.name.match(regex2))
      } else {
         tempdata = tempdata.filter(user => user.name !== '')
      }
      setFilteredUsersData(tempdata)
   }, [filterData])

   const removeFilter = (key, text, isArray) => {
      if (isArray) {
         let tempFilterData = { ...filterData }
         tempFilterData[key] = tempFilterData[key].filter(item => item !== text)
         // tempFilterData[key] = [ tempFilterData[key].filter(text => text !==)]
         setFilterData(tempFilterData)
      } else {
         let tempFilterData = { ...filterData }
         tempFilterData[key] = ''
         console.log('tempFilterData', tempFilterData);
         setFilterData(tempFilterData)
      }
   }

   useEffect(() => {
      let arr = Object.keys(filterData).map(key => {
         if (filterData[key] !== '') {
            return {
               text: filterData[key],
               type: key,
               removeFilter: (key, text, isArray) => removeFilter(key, text, isArray)
            }
         }
      }).filter(item => item !== undefined)
      setFilterItems(arr)
   }, [filterData])


   const onRemoveFilter = (item, text, isArray) => {
      // console.log(item, text, isArray);
      item.removeFilter(item.type, text, isArray)
   }

   const handleSubmit = e => {
      e.preventDefault()
      if (modalData.userType === '') return alert('Fill all the fields')
      let body = {
         firstName: modalData.firstName,
         lastName: modalData.lastName,
         email: modalData.email,
         phone: `${numberPrefix}${modalData.phone}`,
      }
      setLoading(true)
      if (modalData.userType === 'tutor') {
         console.log(body)
         addUser(body)
            .then(res => {
               console.log(res)
               setLoading(false)
               if (res.error) {
                  alert(res.error.data.message)
                  return
               }
               alert('Invitation sent!')
               setModalData(initialState)
               handleClose()
            })
         return
      } else {
         body.role = modalData.userType
         console.log(body)
         signupUser(body)
            .then(res => {
               setLoading(false)
               console.log(res)
               if (res.error) {
                  alert(res.error.data.message)
                  return
               }
               alert('Invitation sent!')
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
                  setFilterData({ ...filterData })
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
               setFilterData({ ...filterData })
            })
      }
   }

   const handleDelete = item => {
      console.log(item);
      setUserToDelete(item)
      setDeleteModalActive(true)
   }

   const onDelete = () => {
      setDeleteLoading(true)
      deleteUser(userToDelete._id)
         .then(res => {
            setDeleteLoading(false)
            setDeleteModalActive(false)
            if (res.error) {
               return console.log(res.error);
            }
            console.log(res.data);
            fetch()
         })
   }

   function isEmail(val) {
      let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regEmail.test(val)) {
         return false
      } else {
         return true
      }
   }

   useEffect(() => {
      if (modalData.email.trim() === '' || modalData.firstName.trim() === '' || modalData.lastName.trim() === '' || modalData.phone.trim() === '' || modalData.userType.trim() === '') {
         setAddUserBtnDisabled(true)
      } else {
         if (modalData.phone.length < 10 || !isEmail(modalData.email) || !isPhoneNumber(modalData.phone)) {
            setAddUserBtnDisabled(true)
         } else {
            setAddUserBtnDisabled(false)
         }
      }
   }, [modalData.email, modalData.firstName, modalData.lastName, modalData.phone, modalData.userType])

   useEffect(() => {
      if (!settings.servicesAndSpecialization) return
      let specs = []
      settings.servicesAndSpecialization.map(service => {
         specs.push(...service.specialization)
      })
      setSpecializations(specs)
      console.log('specs', specs);

   }, [settings])
   // console.log('users', filteredUsersData);
   // console.log('settings', settings);
   // console.log('filterItems', filterItems);
   // console.log('filterData', filterData);
   // console.log('ALL USERS DATA', usersData)

   return (
      <div className='lg:ml-pageLeft bg-lightWhite min-h-screen'>
         <div className='py-14 px-5'>
            <div className='flex justify-between items-center gap-4'>
               <InputField
                  IconRight={SearchIcon}
                  placeholder='Type Name'
                  parentClassName='w-full w-1/6'
                  inputContainerClassName='text-sm text-sm bg-white  px-[20px] py-[16px] border'
                  type='text'
                  value={filterData.typeName}
                  onChange={e => setFilterData({ ...filterData, typeName: e.target.value })} />
               <InputSelect optionData={userTypesList}
                  inputContainerClassName='text-sm border bg-white px-[20px] py-[16px]'
                  placeholder='User Type'
                  parentClassName='w-full w-1/6'
                  type='select'
                  value={filterData.userType.length > 0 ? filterData.userType[0] : ''}
                  checkbox={{
                     visible: true,
                     name: 'test',
                     match: filterData.userType
                  }}
                  onChange={val => setFilterData({
                     ...filterData,
                     userType: filterData.userType.includes(val) ?
                        filterData.userType.filter(item => item !== val)
                        : [...filterData.userType, val]
                  })}
               />
               <InputSelect optionData={settings.leadStatus}
                  placeholder='Lead Status'
                  parentClassName='w-full w-1/6'
                  inputContainerClassName='text-sm border bg-white px-[20px] py-[16px]'
                  type='select'
                  checkbox={{
                     visible: true,
                     name: 'test',
                     match: filterData.status
                  }}
                  onChange={val => setFilterData({
                     ...filterData,
                     status: filterData.status.includes(val) ?
                        filterData.status.filter(item => item !== val)
                        : [...filterData.status, val]
                  })}
                  value={filterData.status.length > 0 ? filterData.status[0] : ''}
               />
               <InputSelect optionData={specializations}
                  placeholder='Specializations'
                  parentClassName='w-full w-1/6'
                  type='select'
                  inputContainerClassName='text-sm border bg-white px-[20px] py-[16px]'
                  value={filterData.specialization.length > 0 ? filterData.specialization[0] : ''}
                  checkbox={{
                     visible: true,
                     name: 'test',
                     match: filterData.specialization
                  }}
                  onChange={val => setFilterData({
                     ...filterData,
                     specialization: filterData.specialization.includes(val) ?
                        filterData.specialization.filter(item => item !== val)
                        : [...filterData.specialization, val]
                  })}
               />
               <InputSelect optionData={['active', 'blocked', 'dormant']}
                  placeholder='User Status'
                  parentClassName='w-full w-1/6 capitalize'
                  type='select'
                  inputContainerClassName='text-sm border bg-white px-[20px] py-[16px]'
                  value={filterData.userStatus.length > 0 ? filterData.userStatus[0] : ''}
                  checkbox={{
                     visible: true,
                     name: 'test',
                     match: filterData.userStatus
                  }}
                  onChange={val => setFilterData({
                     ...filterData,
                     userStatus: filterData.userStatus.includes(val) ?
                        filterData.userStatus.filter(item => item !== val)
                        : [...filterData.userStatus, val]
                  })}
               />
               <InputSelect optionData={[]}
                  placeholder='Tutor'
                  parentClassName='w-full w-1/6'
                  type='select'
                  inputContainerClassName='text-sm border bg-white px-[20px] py-[16px]'

                  value={filterData.tutor.length > 0 ? filterData.tutor[0] : ''}
                  onChange={val => setFilterData({ ...filterData, tutor: val })} />

               <PrimaryButton type='submit'
                  children={
                     <>
                        Add new User
                        <img src={AddIcon} className='ml-3' />
                     </>
                  }
                  onClick={() => setModalActive(true)}
                  className='pt-[14px] flex items-center text-lg font-semibold pb-[14px] pl-[21px] pr-[21px]' />
            </div>
            <div className='flex align-center mt-0 gap-[20px]'>

            </div>
            <div className='mt-4' >
               <FilterItems items={filterItems} setData={setFilterItems} onRemoveFilter={onRemoveFilter} />
            </div>
            <div className='mt-6'>
               <Table dataFor='allUsers'
                  data={filteredUsersData}
                  onClick={{ redirect, handleTutorStatus, handleDelete }}
                  tableHeaders={tableHeaders}
                  maxPageSize={maxPageSize}
                  isCallingApi={true}
                  total_pages={Math.ceil(totalPages / maxPageSize)}
                  setMaxPageSize={setMaxPageSize}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  fetch={changeUserField} />
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
                  text: "Send Invite",
                  // className: 'w-140',
                  form: 'add-user-form',
                  // onClick: handleSubmit,
                  loading: loading,
                  type: 'submit',
                  disabled: addUserBtnDisabled
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

                        <div>
                           <InputField label='Phone Number'
                              labelClassname='ml-4 mb-0.5'
                              isRequired={true}
                              placeholder='Phone Number'
                              inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5  bg-primary-50 border-0'
                              inputClassName='bg-transparent pl-[60px]'
                              parentClassName='w-full' type='text'
                              value={modalData.phone}
                              inputLeftField={
                                 <CountryCode numberPrefix={numberPrefix} setNumberPrefix={setNumberPrefix} />
                              }
                              onChange={e => setModalData({ ...modalData, phone: e.target.value })} />
                        </div>
                     </div>
                  </form>
               }
            />
         }
         {deleteModalActive && (
            <Modal
               title={
                  <span className="leading-10">
                     Are you sure <br />
                     you want to delete user {`${userToDelete.name} ${userToDelete._id}`} and all associated data ?
                  </span>
               }
               titleClassName="mb-12 leading-10"
               cancelBtn={true}
               cancelBtnClassName="max-w-140"
               primaryBtn={{
                  text: "Delete",
                  className: "w-[140px] pl-4 px-4",
                  onClick: () => onDelete(),
                  bgDanger: true,
                  loading: deleteLoading
               }}
               handleClose={() => setDeleteModalActive(false)}
               classname={"max-w-567 mx-auto"}
            />
         )}
      </div>
   )
}
