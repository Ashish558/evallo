import React, { useEffect, useState } from 'react'
import { useLazyGetParentsByNameQuery } from '../../../../app/services/admin'
import { useLazyGetStudentsByNameQuery } from '../../../../app/services/session'
import { useUpdateTutorDetailsMutation, useUpdateUserDetailsMutation, useUpdateUserFieldsMutation, usePostTutorDetailsMutation } from '../../../../app/services/users'
import InputField from '../../../../components/InputField/inputField'
import InputSearch from '../../../../components/InputSearch/InputSearch'
import InputSelect from '../../../../components/InputSelect/InputSelect'
import Modal from '../../../../components/Modal/Modal'
import SimpleCalendar from '../../../../components/SimpleCalendar/SimpleCalendar'
import Slider from '../../../../components/Slider/Slider'
import styles from './style.module.css'

// 637b9df1e9beff25e9c2aa83
export default function ParentEditables({ userId, setToEdit, toEdit, fetchDetails, settings, persona }) {
   const [title, setTitle] = useState('')
   const [currentField, setCurrentField] = useState({})
   const [currentToEdit, setCurrentToEdit] = useState({})

   const [student, setStudent] = useState('')
   const [fetchStudents, studentResponse] = useLazyGetStudentsByNameQuery()
   const [students, setStudents] = useState([]);

   const [parent, setParent] = useState('')
   const [fetchParents, fetchParentsResp] = useLazyGetParentsByNameQuery()
   const [parents, setParents] = useState([])

   const [updateFields, updateFieldsResp] = useUpdateUserFieldsMutation()
   const [updateDetails, updateDetailsResp] = useUpdateUserDetailsMutation()
   const [updateTutorDetails, updateTutorDetailsResp] = useUpdateTutorDetailsMutation()
   const [postTutorDetails, postTutorDetailsResp] = usePostTutorDetailsMutation()


   const data = [
      {
         name: 'fullName',
         title: 'Full Name',
         api: 'user',
      },
      {
         name: 'timeZone',
         title: 'Time Zone',
         api: 'userDetail',
      },
      {
         name: 'subscribeType',
         title: 'Subscription',
         api: 'userDetail',
      },
      {
         name: 'birthYear',
         title: 'Birth Year',
         api: 'userDetail',
      },
      {
         name: 'industry',
         title: 'Industry',
         api: 'userDetail',
      },
      {
         name: 'contact',
         title: 'Contact',
         api: 'user',
      },
      {
         name: 'address',
         title: 'Residential Address',
         api: 'userDetail',
      },
      {
         name: 'associatedStudents',
         title: 'Associated Students',
         api: 'user',
      },
      {
         name: 'notes',
         title: 'Notes',
         api: 'userDetail',
      },
      {
         name: 'service',
         title: 'Service',
         api: 'userDetail',
      },
      {
         name: 'leadStatus',
         title: 'Lead Status',
         api: 'userDetail',
      },
      {
         name: 'subjects',
         title: 'Subjects',
         api: 'userDetail',
      },
      {
         name: 'accomodations',
         title: 'Accomodations',
         api: 'userDetail',
      },
      {
         name: 'personality',
         title: 'Keywords that describe you',
         api: persona === 'tutor' ? 'tutorDetail' : 'userDetail',
      },
      {
         name: 'interest',
         title: 'Your Interests',
         api: persona === 'tutor' ? 'tutorDetail' : 'userDetail',
      },
      {
         name: 'serviceSpecializations',
         title: 'Service Specialisation',
         api: persona === 'tutor' ? 'tutorDetail' : 'userDetail',
      },
      {
         name: 'associatedParent',
         title: 'Associated Parent',
         api: 'userDetail',
      },
      {
         name: 'tutorLevel',
         title: 'Tutor Level',
         api: 'tutorDetail',
      },
      {
         name: 'education',
         title: 'Education',
         api: 'tutorDetail',
      },
      {
         name: 'rates',
         title: 'Rates',
         api: 'tutorDetail',
      },
      {
         name: 'tutorAddress',
         title: 'Address',
         api: 'tutorDetail',
      },
      {
         name: 'pincode',
         title: 'pincode',
         api: 'tutorDetail',
      },
      {
         name: 'paymentInfo',
         title: 'Payment Info',
         api: 'tutorDetail',
      },
      {
         name: 'tutorRank',
         title: 'Tutor Rank',
         api: 'tutorDetail',
      },
      {
         name: 'income',
         title: 'Income',
         api: 'tutorDetail',
      },
      {
         name: 'paymentStatus',
         title: 'Payment Status',
         api: 'tutorDetail',
      },
      {
         name: 'tagLine',
         title: 'Tag Line',
         api: 'tutorDetail',
      },
      {
         name: 'about',
         title: 'Bio',
         api: 'tutorDetail',
      },
      {
         name: 'tutorContact',
         title: 'Contact',
         api: 'user',
      },
   ]

   // console.log(currentField)

   const getCurrentField = keyName => {
      Object.keys(data).map(key => {
         if (data[key].name === keyName) {
            // console.log(data[key]);
            setCurrentField(data[key])
         }
      })
   }

   useEffect(() => {
      Object.keys(toEdit).map(key => {
         if (toEdit[key].active === true) {
            getCurrentField(key)
            // console.log(toEdit);
            // setEditFieldValue(toEdit[key])
            setCurrentToEdit(toEdit[key])
         }
      })
   }, [toEdit])

   const handleClose = () => {
      let tempToEdit = {}
      Object.keys(toEdit).map(key => {
         return tempToEdit[key] = { ...toEdit[key], active: false }
      })
      setToEdit(tempToEdit)
      // setToEdit()
   }


   useEffect(() => {
      if (student.length > 0) {
         fetchStudents(student).then((res) => {
            let tempData = res.data.data.students.map((tutor) => {
               return {
                  _id: tutor._id,
                  value: `${tutor.firstName} ${tutor.lastName}`,
               };
            });
            setStudents(tempData);
         });
      }
   }, [student]);

   useEffect(() => {
      if (parent.length > 0) {
         fetchParents(parent).then((res) => {
            let tempData = res.data.data.parents.map((parent) => {
               // console.log(parent);
               return {
                  _id: parent._id,
                  value: `${parent.firstName} ${parent.lastName}`,
                  fname: parent.firstName,
                  lname: parent.lastName,
                  email: parent.email
               };
            });
            setParents(tempData);
         });
      }
   }, [parent]);

   const handleStudentsChange = item => {
      let tempStudents = [...currentToEdit.assiginedStudents]
      let tempStudentsData = [...currentToEdit.studentsData]
      if (tempStudents.includes(item._id)) {
         tempStudents = tempStudents.filter(student => student !== item._id)
         tempStudentsData = tempStudentsData.filter(student => student._id !== item._id)
      } else {
         tempStudents.push(item._id)
         tempStudentsData.push(item)
      }
      console.log(tempStudentsData)
      setCurrentToEdit({ ...currentToEdit, assiginedStudents: tempStudents, studentsData: tempStudentsData })
   }

   const handleServiceChange = item => {
      let tempService = [...currentToEdit.service]
      if (tempService.includes(item)) {
         // console.log(tempService);
         tempService = tempService.filter(service => service !== item)
      } else {
         tempService.push(item)
      }
      setCurrentToEdit({ ...currentToEdit, service: tempService })
   }

   const handleSubjectChange = item => {
      let tempSubjects = [...currentToEdit.subjects]
      if (tempSubjects.includes(item)) {
         // console.log(tempSubjects);
         tempSubjects = tempSubjects.filter(subject => subject !== item)
      } else {
         tempSubjects.push(item)
      }
      setCurrentToEdit({ ...currentToEdit, subjects: tempSubjects })
   }

   // useEffect(() => {
   //    updateFields({ id: '637b1522e00aeb4098e8952a', fields: { amountToPay: 5 } })
   //       .then(res => {
   //          console.log(res);
   //       })
   // }, [])

   const handleSubmit = e => {
      e.preventDefault()
      let reqBody = { ...currentToEdit }
      delete reqBody['active']
      // console.log(reqBody);

      if (currentField.api === 'user') {
         updateFields({ id: userId, fields: reqBody })
            .then(res => {
               console.log(res)
               if (reqBody.linkedIn) {
                  if (currentToEdit.isPresent === false) {
                     delete reqBody['isPresent']
                     postTutorDetails({ id: userId, fields: { linkedIn: reqBody.linkedIn } })
                        .then(res => {
                           fetchDetails(true, true)
                           // handleClose()
                        })
                  } else {
                     delete reqBody['isPresent']
                     updateTutorDetails({ id: userId, fields: { linkedIn: reqBody.linkedIn } })
                        .then(res => {
                           fetchDetails(true, true)
                           // handleClose()
                        })
                  }
               }
               fetchDetails(true, true)
               // handleClose()
            })
      } else if (currentField.api === 'userDetail') {
         updateDetails({ id: userId, fields: reqBody })
            .then(res => {
               console.log(res)
               fetchDetails(true, true)
               // handleClose()
            })
      } else if (currentField.api === 'tutorDetail') {
         if(reqBody.tutorLevel){
            const level = getLevel(reqBody.tutorLevel)
            reqBody.tutorLevel = level
         }
         console.log(reqBody)
         if (currentToEdit.isPresent === false) {
            delete reqBody['isPresent']
            postTutorDetails({ id: userId, fields: reqBody })
               .then(res => {
                  console.log('posted', res)
                  fetchDetails(true, true)
                  // handleClose()
               })
         } else {
            delete reqBody['isPresent']
            updateTutorDetails({ id: userId, fields: reqBody })
               .then(res => {
                  console.log('patched', res)
                  fetchDetails(true, true)
                  // handleClose()
               })
         }

      }
   }

   const getLevel = str => {
      const levels = ['ORANGE', 'PURPLE', 'BROWN', 'BLACK']
      if(str === 'Level - 1'){
         return levels[0]
      }
      if(str === 'Level - 2'){
         return levels[1]
      }
      if(str === 'Level - 3'){
         return levels[2]
      }
      if(str === 'Level - 4'){
         return levels[3]
      }else{
         return ''
      }
   }
   // console.log('toedit', currentToEdit)
   // console.log('setting', settings)
   // console.log('field', currentField)
   // console.log('sett', settings)
   // console.log('students', students)
   // console.log('parents', parents)

   const [startDate, setStartDate] = useState(new Date());

   return (
      Object.keys(toEdit).map(key => {
         return toEdit[key].active === true &&
            <Modal
               key={key}
               classname={'max-w-[500px] md:pb-5 mx-auto overflow-visible'}
               title=''
               cancelBtn={false}
               primaryBtn={{
                  text: "Save",
                  className: 'w-[100px] bg-primaryOrange text-base pt-2 ml-0 pb-2 text-lg pl-3 pr-3 ',
                  form: 'editable-form',
                  // onClick: handleSubmit,
                  type: 'submit',
               }}
               cancelBtnStyle={{ top: '18px' }}
               handleClose={handleClose}
               body={
                  <>
                     <div className={styles.titleContainer}>
                        {currentField.title}
                     </div>
                     <form className='mt-20 mb-4' id='editable-form' onSubmit={handleSubmit} >
                        {/* {currentField.fields && currentField.fields} */}
                        {currentField.name === 'fullName' &&
                           <div>
                              <div className='flex items-center mb-5'>
                                 <p className='font-medium mr-4 text-[20px]'> First Name </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='First Name'
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.firstName}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, firstName: e.target.value })} />
                              </div>
                              <div className='flex items-center'>
                                 <p className='font-medium mr-4 text-[20px]'> Last Name </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Last Name'
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.lastName}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, lastName: e.target.value })} />
                              </div>
                           </div>
                        }
                        {currentField.name === 'associatedStudents' &&
                           <div>
                              <div className=' mb-5'>
                                 {/* <p className='font-medium mr-4'> Associated Students </p> */}
                                 <div className='max-w-[250px] mx-auto'>
                                    <Slider images={currentToEdit.studentsData} />
                                 </div>

                                 <InputSearch
                                    labelClassname='hidden'
                                    placeholder="Type Student Name"
                                    parentClassName="w-full  mb-10"
                                    inputContainerClassName="bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                                    inputClassName="bg-[#F3F5F7]"
                                    type="text"
                                    optionPrefix='s'
                                    value={student}
                                    checkbox={{
                                       visible: true,
                                       name: 'name',
                                       match: currentToEdit.assiginedStudents
                                    }}
                                    onChange={(e) => setStudent(e.target.value)}
                                    optionData={students}
                                    onOptionClick={(item) => {
                                       // setStudent(item.value);
                                       handleStudentsChange(item)
                                       // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                                    }}
                                 />
                              </div>

                           </div>
                        }
                        {currentField.name === 'contact' &&
                           <div>
                              <div className='flex items-center mb-5'>
                                 <p className='font-medium mr-4 min-w-[80px] text-[20px]'> Email Id </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Email Id'
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.email}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, email: e.target.value })} />
                              </div>
                              <div className='flex items-center'>
                                 <p className='font-medium mr-4 min-w-[80px] text-[20px]'> Phone </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Phone'
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.phone}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, phone: e.target.value })} />
                              </div>
                           </div>
                        }
                        {currentField.name === 'birthYear' &&
                           <div className='bg-[#F3F5F7] '>
                              {/* <div className='flex items-center mb-5 bg-white rounded-10' style={{ boxShadow: "-3px -4px 24px rgba(0, 0, 0, 0.25)" }}> */}
                              <p className='font-medium mr-4 min-w-[60px]'>  </p>
                              <InputField
                                 labelClassname='hidden'
                                 placeholder='Enter your birth year'
                                 inputContainerClassName='text-sm pt-3 pb-3 rounded-sm bg-primary-50 border-0'
                                 inputClassName='bg-transparent'
                                 parentClassName='flex-1 ' type='text'
                                 value={currentToEdit.birthyear}
                                 onChange={e => setCurrentToEdit({ ...currentToEdit, birthyear: e.target.value })} />
                              {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /> 
                                 <SimpleCalendar setCurrentDate={setCurrentToEdit} /> */}
                              {/* </div> */}
                           </div>
                        }
                        {currentField.name === 'industry' &&
                           <div>
                              <div className='flex items-center mb-5 pt-2'>
                                 <InputSelect
                                    value={currentToEdit.industry}
                                    onChange={val =>
                                       setCurrentToEdit({ ...currentToEdit, industry: val })
                                    }
                                    optionData={['Medical', 'Law', 'Teaching']}
                                    radio={true}
                                    inputContainerClassName="pt-3 pb-3 border bg-[#D9D9D999]"
                                    placeholder="Select"
                                    parentClassName="w-full mr-4"
                                    type="select"
                                 />
                              </div>
                           </div>
                        }
                        {currentField.name === 'address' &&
                           <div>
                              <div className='flex items-center mb-5 pt-6'>
                                 {/* <p className='font-medium mr-4 min-w-[60px]'>  </p> */}
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Enter your Residential Address'
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.residentialAddress}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, residentialAddress: e.target.value })} />
                              </div>
                           </div>
                        }
                        {currentField.name === 'timeZone' &&
                           <div>
                              <div className='flex items-center mb-5 pt-3 pb-5'>
                                 <InputSelect
                                    value={currentToEdit.timeZone}
                                    onChange={val =>
                                       setCurrentToEdit({ ...currentToEdit, timeZone: val })
                                    }
                                    optionData={['IST', 'EST', 'PTD']}
                                    radio={true}
                                    inputContainerClassName="pt-3 pb-3 border bg-[#D9D9D999]"
                                    placeholder="Select"
                                    parentClassName="w-full mr-4"
                                    type="select"
                                 />
                              </div>
                           </div>
                        }
                        {currentField.name === 'notes' &&
                           <div>
                              <div className='flex items-center mb-5 pt-6'>
                                 {/* <p className='font-medium mr-4 min-w-[60px]'>  </p> */}
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Enter your notes'
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.notes}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, notes: e.target.value })} />
                              </div>
                           </div>
                        }
                        {currentField.name === 'subscribeType' &&
                           <div>
                              <div className='flex items-center mb-5 pt-1 pb-5'>
                                 <InputSelect
                                    value={currentToEdit.subscribeType}
                                    onChange={val =>
                                       setCurrentToEdit({ ...currentToEdit, subscribeType: val })
                                    }
                                    optionData={['Unsubscribed', '3 Months Trial', '6 Months Trial', 'Subscribed']}
                                    radio={true}
                                    inputContainerClassName="pt-3 pb-3 border bg-white"
                                    placeholder="Subscription Type"
                                    parentClassName="w-full mr-4"
                                    type="select"
                                 />
                              </div>
                           </div>
                        }
                        {currentField.name === 'service' &&
                           <div>
                              <div className='flex items-center mb-5 pt-1 pb-5'>
                                 <InputSelect
                                    value={currentToEdit.service.length === 0 ? '' : currentToEdit.service[0]}
                                    checkbox={{
                                       visible: true,
                                       name: 'services',
                                       match: currentToEdit.service
                                    }}
                                    optionData={settings.serviceSpecialisation.map(item => item.text)}
                                    inputContainerClassName="pt-3 pb-3 border bg-white"
                                    placeholder="Service"
                                    parentClassName="w-full mr-4"
                                    type="select"
                                    onChange={val =>
                                       handleServiceChange(val)
                                       // setCurrentToEdit({ ...currentToEdit, service: val })
                                    }
                                    onOptionClick={(item) => {
                                       // setStudent(item.value);
                                       console.log(item);
                                       // handleStudentsChange(item)
                                       // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                                    }}
                                 />

                              </div>
                           </div>
                        }
                        {currentField.name === 'subjects' &&
                           <div>
                              <div className='flex items-center mb-5 pt-1 pb-5'>
                                 <InputSelect
                                    value={currentToEdit.subjects.length === 0 ? '' : currentToEdit.subjects[0]}
                                    checkbox={{
                                       visible: true,
                                       name: 'subjects',
                                       match: currentToEdit.subjects
                                    }}
                                    optionData={['Maths', 'English']}
                                    inputContainerClassName="pt-3 pb-3 border bg-white"
                                    placeholder="Subjects"
                                    parentClassName="w-full mr-4"
                                    type="select"
                                    onChange={val =>
                                       handleSubjectChange(val)
                                       // setCurrentToEdit({ ...currentToEdit, service: val })
                                    }
                                    onOptionClick={(item) => {
                                       // setStudent(item.value);
                                       console.log(item);
                                       // handleStudentsChange(item)
                                       // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                                    }}
                                 />

                              </div>
                           </div>
                        }
                        {currentField.name === 'leadStatus' &&
                           <div>
                              <div className='flex items-center mb-5 pt-2'>
                                 <InputSelect
                                    value={currentToEdit.leadStatus}
                                    onChange={val =>
                                       setCurrentToEdit({ ...currentToEdit, leadStatus: val })
                                    }
                                    optionData={settings.leadStatus}
                                    radio={true}
                                    inputContainerClassName="pt-3 pb-3 border bg-white"
                                    placeholder="Lead Status"
                                    parentClassName="w-full mr-4"
                                    type="select"
                                 />
                              </div>
                           </div>
                        }
                        {currentField.name === 'accomodations' &&
                           <div>
                              <div className='flex items-center mb-5 pt-6'>
                                 {/* <p className='font-medium mr-4 min-w-[60px]'>  </p> */}
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Accomodations'
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.accomodations}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, accomodations: e.target.value })} />
                              </div>
                           </div>
                        }
                        {
                           currentField.name === 'associatedParent' &&
                           <InputSearch
                              labelClassname='hidden'
                              placeholder="Type Parent Name"
                              parentClassName="w-full  mb-10"
                              inputContainerClassName="bg-[#F3F5F7] border-0 pt-3.5 pb-3.5"
                              inputClassName="bg-[#F3F5F7]"
                              type="text"
                              optionPrefix='s'
                              value={parent}
                              onChange={(e) => setParent(e.target.value)}
                              optionData={parents}
                              onOptionClick={(val) => {
                                 // setStudent(item.value);
                                 console.log(val);
                                 setCurrentToEdit({
                                     ...currentToEdit,
                                      associatedParent: val._id,
                                      FirstName: val.fname,
                                      LastName: val.lname,
                                      Email: val.email
                                     })
                                 // setCurrentToEdit({ ...currentToEdit, students: [... item._id] });
                              }} />
                        }
                        {currentField.name === 'tutorLevel' &&
                           <div>
                              <div className='flex items-center mb-5  pb-5'>
                                 <InputSelect
                                    value={currentToEdit.tutorLevel}
                                    onChange={val =>
                                       setCurrentToEdit({ ...currentToEdit, tutorLevel: val })
                                    }
                                    optionData={['Level - 1', 'Level - 2', 'Level - 3', 'Level - 4']}
                                    radio={true}
                                    inputContainerClassName="pt-3 pb-3 border bg-white"
                                    placeholder="Tutor Level"
                                    parentClassName="w-full mr-4"
                                    type="select"
                                 />
                              </div>
                           </div>
                        }
                        {currentField.name === 'education' &&
                           <div>
                              <div className='flex items-center mb-5'>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Education'
                                    inputContainerClassName='text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1' type='text'
                                    value={currentToEdit.education}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, education: e.target.value })} />
                              </div>
                           </div>
                        }
                        {currentField.name === 'tutorAddress' &&
                           <div>
                              <div className='flex items-center mb-5'>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Education'
                                    inputContainerClassName='text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1' type='text'
                                    value={currentToEdit.address}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, address: e.target.value })} />
                              </div>
                           </div>
                        }
                        {currentField.name === 'tagLine' &&
                           <div>
                              <div className='flex items-center mb-5'>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Tagline'
                                    inputContainerClassName='text-sm pt-3.5 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1' type='text'
                                    value={currentToEdit.tagLine}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, tagLine: e.target.value })} />
                              </div>
                           </div>
                        }
                        {currentField.name === 'rates' &&
                           <div>
                              <div className='flex items-center mb-4'>
                                 <p className='font-medium mr-4 min-w-[150px]'>
                                    Test Prep Rate
                                 </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder=''
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputLeftField={
                                       <div>
                                          $
                                       </div>
                                    }
                                    inputClassName='bg-transparent pl-4 rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.testPrepRate}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, testPrepRate: e.target.value })} />
                              </div>
                              <div className='flex items-center mb-4'>
                                 <p className='font-medium mr-4 min-w-[150px] '>
                                    Subject Tutoring
                                 </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder=''
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputLeftField={
                                       <div>
                                          $
                                       </div>
                                    }
                                    inputClassName='bg-transparent pl-4 rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.subjectTutoringRate}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, subjectTutoringRate: e.target.value })} />
                              </div>
                              <div className='flex items-center'>
                                 <p className='font-medium mr-4 min-w-[150px] '>
                                    Other Rate
                                 </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder=''
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputLeftField={
                                       <div>
                                          $
                                       </div>
                                    }
                                    inputClassName='bg-transparent pl-4 rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.otherRate}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, otherRate: e.target.value })} />
                              </div>
                           </div>
                        }
                        {currentField.name === 'paymentInfo' &&
                           <div>
                              <div className='flex items-center mb-4'>
                                 <p className='font-medium mr-4 min-w-[100px]'>
                                    Bank Name
                                 </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder=''
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.bankName}
                                    onChange={e => setCurrentToEdit({
                                       ...currentToEdit,
                                       paymentInfo: { ...currentToEdit.paymentInfo, bankName: e.target.value }
                                    })} />
                              </div>
                              <div className='flex items-center mb-4'>
                                 <p className='font-medium mr-4 min-w-[100px] '>
                                    Acc No.
                                 </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder=''
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.AccNo}
                                    onChange={e => setCurrentToEdit({
                                       ...currentToEdit,
                                       paymentInfo: { ...currentToEdit.paymentInfo, AccNo: e.target.value }
                                    })} />
                              </div>
                              <div className='flex items-center'>
                                 <p className='font-medium mr-4 min-w-[100px] '>
                                    IFSC Code
                                 </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder=''
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.ifcsCode}
                                    onChange={e => setCurrentToEdit({
                                       ...currentToEdit,
                                       paymentInfo: { ...currentToEdit.paymentInfo, ifcsCode: e.target.value }
                                    })} />
                              </div>
                           </div>
                        }
                        {currentField.name === 'tutorRank' &&
                           <div>
                              <div className='flex items-center mb-5  pb-5'>
                                 <InputSelect
                                    value={currentToEdit.tutorRank}
                                    onChange={val =>
                                       setCurrentToEdit({ ...currentToEdit, tutorRank: val })
                                    }
                                    optionData={['Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5', 'Rank 6']}
                                    radio={true}
                                    inputContainerClassName="pt-3 pb-3 border bg-white"
                                    placeholder="Tutor Rank"
                                    parentClassName="w-full mr-4"
                                    type="select"
                                 />
                              </div>
                           </div>
                        }
                        {currentField.name === 'income' &&
                           <div className='flex justify-center items-center mb-4 pb-4'>
                              <p className='font-medium mr-6 '>
                                 Enter Income for Tutor
                              </p>
                              <InputField
                                 labelClassname='hidden'
                                 placeholder=''
                                 inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                 inputLeftField={
                                    <div>
                                       $
                                    </div>
                                 }
                                 inputClassName='bg-transparent pl-4 rounded-[4px]'
                                 parentClassName='flex-1 max-w-[152px]' type='text'
                                 value={currentToEdit.income}
                                 onChange={e => setCurrentToEdit({ ...currentToEdit, income: e.target.value })} />
                           </div>
                        }
                        {currentField.name === 'paymentStatus' &&
                           <div>
                              <div className='flex items-center mb-5 pb-5'>
                                 <InputSelect
                                    value={currentToEdit.paymentStatus}
                                    onChange={val =>
                                       setCurrentToEdit({ ...currentToEdit, paymentStatus: val })
                                    }
                                    optionData={['Paid', 'Unpaid']}
                                    radio={true}
                                    inputContainerClassName="pt-3 pb-3 border bg-white"
                                    placeholder="Select"
                                    parentClassName="w-full mr-4"
                                    type="select"
                                 />
                              </div>
                           </div>
                        }
                        {currentField.name === 'about' &&
                           <div>
                              <textarea
                                 placeholder=""
                                 value={data.about}
                                 onChange={e =>
                                    setCurrentToEdit({ ...currentToEdit, about: e.target.value })
                                 }
                                 rows={5}
                                 className="bg-lightWhite w-full outline-0 px-5 py-4 rounded"
                              ></textarea>
                           </div>
                        }
                        {currentField.name === 'personality' &&
                           <div className='flex flex-wrap'>
                              {settings.personality.map(item => {
                                 return (
                                    !currentToEdit.personality.includes(item._id) ?
                                       <div className={`px-3 mr-2 rounded rounded-md py-1.5 border border-primary text-primary cursor-pointer`}
                                          onClick={() => setCurrentToEdit({
                                             ...currentToEdit,
                                             personality: [...currentToEdit.personality, item._id]
                                          })} >
                                          <p className='font-medium'>
                                             {item.text}
                                          </p>
                                       </div> :
                                       <div className={`px-3 mr-2 rounded rounded-md text-white py-1.5 border border-primary bg-primary text-primary cursor-pointer`}
                                          onClick={() => setCurrentToEdit({
                                             ...currentToEdit,
                                             personality: currentToEdit.personality.filter(id => id !== item._id)
                                          })}>
                                          <p className='font-medium'>
                                             {item.text}
                                          </p>
                                       </div>
                                 )
                              })}
                           </div>
                        }
                        {currentField.name === 'interest' &&
                           <div className='flex flex-wrap'>
                              {settings.interest.map(item => {
                                 return (
                                    !currentToEdit.interest.includes(item._id) ?
                                       <div className={`px-3 mr-2 rounded rounded-md py-1.5 border border-primary text-primary cursor-pointer`}
                                          onClick={() => setCurrentToEdit({
                                             ...currentToEdit,
                                             interest: [...currentToEdit.interest, item._id]
                                          })} >
                                          <p className='font-medium'>
                                             {item.text}
                                          </p>
                                       </div> :
                                       <div className={`px-3 mr-2 rounded rounded-md text-white py-1.5 border border-primary bg-primary text-primary cursor-pointer`}
                                          onClick={() => setCurrentToEdit({
                                             ...currentToEdit,
                                             interest: currentToEdit.interest.filter(id => id !== item._id)
                                          })}>
                                          <p className='font-medium'>
                                             {item.text}
                                          </p>
                                       </div>
                                 )
                              })}
                           </div>
                        }
                        {currentField.name === 'serviceSpecializations' &&
                           <div className='flex flex-wrap'>
                              {settings.serviceSpecialisation.map(item => {
                                 return (
                                    !currentToEdit.serviceSpecializations.includes(item._id) ?
                                       <div className={`px-3 mr-2 rounded rounded-md py-1.5 border border-primary text-primary cursor-pointer`}
                                          onClick={() => setCurrentToEdit({
                                             ...currentToEdit,
                                             serviceSpecializations: [...currentToEdit.serviceSpecializations, item._id]
                                          })} >
                                          <p className='font-medium'>
                                             {item.text}
                                          </p>
                                       </div> :
                                       <div className={`px-3 mr-2 rounded rounded-md text-white py-1.5 border border-primary bg-primary text-primary cursor-pointer`}
                                          onClick={() => setCurrentToEdit({
                                             ...currentToEdit,
                                             serviceSpecializations: currentToEdit.serviceSpecializations.filter(id => id !== item._id)
                                          })}>
                                          <p className='font-medium'>
                                             {item.text}
                                          </p>
                                       </div>
                                 )
                              })}
                           </div>
                        }
                        {currentField.name === 'tutorContact' &&
                           <div>
                              <div className='flex items-center mb-5'>
                                 <p className='font-medium mr-4 min-w-[80px] text-[20px]'> Linked In </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Linked in'
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.linkedIn}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, linkedIn: e.target.value })} />
                              </div>

                              <div className='flex items-center mb-5'>
                                 <p className='font-medium mr-4 min-w-[80px] text-[20px]'> Email Id </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Email Id'
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.email}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, email: e.target.value })} />
                              </div>
                              <div className='flex items-center'>
                                 <p className='font-medium mr-4 min-w-[80px] text-[20px]'> Phone </p>
                                 <InputField
                                    labelClassname='hidden'
                                    placeholder='Phone'
                                    inputContainerClassName='text-sm pt-3 pb-3 px-5 bg-primary-50 border-0'
                                    inputClassName='bg-transparent rounded-[4px]'
                                    parentClassName='flex-1 ' type='text'
                                    value={currentToEdit.phone}
                                    onChange={e => setCurrentToEdit({ ...currentToEdit, phone: e.target.value })} />
                              </div>
                           </div>
                        }
                        {/* <InputField label='First Name'
                           labelClassname='ml-4 mb-0.5'
                           placeholder='First Name'
                           inputContainerClassName='text-sm pt-3.5 pb-3.5 px-5 bg-primary-50 border-0'
                           inputClassName='bg-transparent'
                           parentClassName='w-full mr-4' type='text' /> */}
                     </form>
                  </>
               }
            />
      })

   )
}
