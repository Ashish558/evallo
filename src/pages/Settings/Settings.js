import React, { useEffect, useRef, useState } from 'react'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import EditIcon from '../../assets/icons/edit-white.svg'
import SettingsCard from '../../components/SettingsCard/SettingsCard'
import AddTag from '../../components/Buttons/AddTag'
import FilterItems from '../../components/FilterItems/filterItems'
import InputField from '../../components/InputField/inputField'
import Modal from '../../components/Modal/Modal'
import { useLazyGetSettingsQuery } from '../../app/services/session'
import { useUpdateOfferImageMutation, useUpdateSettingMutation } from '../../app/services/settings'
import { getSessionTagName } from '../../utils/utils'
import { BASE_URL, getAuthHeader } from '../../app/constants/constants'
import axios from 'axios'

const testFilters = [
   {
      text: 'test',
   },
   {
      text: 'test',
   },
   {
      text: 'test',
   },
]

const sessionTags = [
   {
      name: 'Topics Covered',
      items: [
         {
            text: 'test',
         },
         {
            text: 'test',
         }
      ]
   },
   {
      name: 'Student Mood',
      items: [
         {
            text: 'test',
         },
         {
            text: 'test',
         }
      ]
   },
   {
      name: 'Homework Assigned',
      items: [
         {
            text: 'test',
         },
         {
            text: 'test',
         }
      ]
   },
   {
      name: 'Was the Session Productive',
      items: [
         {
            text: 'test',
         },
         {
            text: 'test',
         }
      ]
   },
]

const initialState = {
   name: '',
   phone: '',
   email: '',
}
export default function Settings() {

   const [modalActive, setModalActive] = useState(false)
   const [tagModalActive, setTagModalActive] = useState(false)

   const [settingsData, setSettingsData] = useState({})
   const inputRef = useRef()
   const [image, setImage] = useState(null)
   const [getSettings, getSettingsResp] = useLazyGetSettingsQuery()
   const [updateSetting, updateSettingResp] = useUpdateSettingMutation()
   // const [updateImage, updateImageResp] = useUpdateOfferImageMutation()
   const [selectedImageTag, setSelectedImageTag] = useState('')
   const [toggleImage, setToggleImage] = useState({
      personality: false,
      interest: false,
      offer: false,
      Expertise: false
   })

   const imageUploadRef = useRef()
   const [tagImage, setTagImage] = useState(null)
   const [imageName, setImageName] = useState('')
   const [tagText, setTagText] = useState('')
   const [modalData, setModalData] = useState(initialState)

   const handleClose = () => setModalActive(false)

   const handleTagModal = text => {
      console.log(text);
      setTagModalActive(true)
      setSelectedImageTag(text)
   }

   const handleSubmit = e => {
      e.preventDefault()
   }

   const fetchSettings = () => {
      getSettings()
         .then(res => {
            if (res.error) {
               console.log('settings fetch err', res.error)
               return
            }
            console.log('settings', res.data)
            if (res.data.data.setting === null) return
            setSettingsData(res.data.data.setting)
         })
   }

   const onRemoveTextImageTag = (item, key, idx) => {
      // console.log(item)
      // console.log(key)
      // console.log(idx)
      let updatedField = settingsData[key].filter((item, i) => i !== idx)
      let updatedSetting = {
         [key]: updatedField
      }
      // console.log(updatedSetting)
      updateAndFetchsettings(updatedSetting)
   }

   const onRemoveFilter = (item, key, idx) => {
      if (key === undefined || item === undefined) return
      // let updatedField = settingsData[key].filter(text => text !== item)
      let updatedField = settingsData[key].filter((text, i) => i !== idx)
      let updatedSetting = {
         [key]: updatedField
      }
      updateAndFetchsettings(updatedSetting)
   }

   const onRemoveSessionTag = (item, key, idx) => {
      let updatedSessionTag = { ...settingsData.sessionTags }
      // let updatedField = settingsData.sessionTags[key].filter(text => text !== item)
      let updatedField = settingsData.sessionTags[key].filter((text, i) => i !== idx)
      updatedSessionTag[key] = updatedField

      const updatedSetting = { sessionTags: updatedSessionTag }
      updateAndFetchsettings(updatedSetting)

   }

   const handleAddTag = (text, key) => {
      let tempSettings = { ...settingsData }
      let updatedSetting = {
         [key]: [...tempSettings[key], text]
      }
      updateAndFetchsettings(updatedSetting)
   }


   const handleSessionAddTag = (text, key) => {
      let tempSettings = { ...settingsData }
      let updatedSessionTag = {
         ...tempSettings.sessionTags,
         [key]: [...tempSettings.sessionTags[key], text]
      }
      const updatedSetting = { sessionTags: updatedSessionTag }
      updateAndFetchsettings(updatedSetting)
   }

   const updateAndFetchsettings = updatedSetting => {
      updateSetting(updatedSetting)
         .then(res => {
            setSettingsData(res.data.data.setting)
         })
   }

   const submitImageModal = e => {
      e.preventDefault()
      // console.log(tagText)
      // console.log(tagImage)
      // console.log(selectedImageTag)

      const formData = new FormData();
      formData.append('text', tagText)
      formData.append("image", tagImage)

      let append = ''
      if (selectedImageTag === 'Expertise') {
         append = 'addservicespecialisation'
      } else if (selectedImageTag === 'personality') {
         append = 'addpersonality'
      } else if (selectedImageTag === 'interest') {
         append = 'addinterest'
      } else if (selectedImageTag === 'offer') {
         append = 'addimage'
         formData.append('link', tagText)
         formData.append("offer", tagImage)
         formData.delete('text')
         formData.delete('image')
      }

      console.log(append)

      if (append === '') return
      axios.patch(`${BASE_URL}api/user/setting/${append}`, formData, { headers: getAuthHeader() })
         .then((res) => {
            console.log(res)
            setTagImage(null)
            setTagText('')
            setSelectedImageTag('')
            setImageName('')
            setTagModalActive(false)
            fetchSettings()
         })
   }

   const handleImageUpload = () => {
      inputRef.current.click()
   }

   const onImageChange = e => {
      //   console.log(e.target.files[0])
      setImage(e.target.files[0])
      const formData = new FormData();
      formData.append("offer", e.target.files[0])
      // updateImage(formData)
      //    .then(res => {
      //       console.log(res)
      //       setSettingsData(res.data.data.setting)
      //    })
      axios.patch(`${BASE_URL}api/user/setting/addimage`, formData)
         .then((res) => {
            // console.log(res)
            setImage(null)
            fetchSettings()
         })
   }


   const onRemoveImage = (link) => {
      let updatedField = settingsData.offerImages.filter(item => item.image !== link)
      let updatedSetting = {
         offerImages: updatedField
      }
      updateAndFetchsettings(updatedSetting)
   }

   useEffect(() => {
      fetchSettings()
   }, [])

   const onAddService = val => {
      console.log(val);
      let tempSettings = { ...settingsData }
      let updatedSetting = {
         servicesAndSpecialization: [
            ...tempSettings['servicesAndSpecialization'],
            {
               service: val,
               specialization: []
            }
         ]
      }

      updateAndFetchsettings(updatedSetting)
   }
   const handleAddSpecialization = (text, key) => {

      let tempSettings = { ...settingsData }

      let updated = servicesAndSpecialization.map(serv => {
         if (serv.service === key) {
            return {
               ...serv,
               specialization: [...serv.specialization, text]
            }
         } else {
            return { ...serv }
         }
      })

      let updatedSetting = {
         servicesAndSpecialization: updated
      }
      updateAndFetchsettings(updatedSetting)
      // console.log('updatedSetting', updatedSetting)
   }

   const onRemoveSpecialization = (text, service) => {
      // console.log(text);
      // console.log(service);
      let updated = servicesAndSpecialization.map(serv => {
         if (serv.service === service) {
            let updatedSpec = serv.specialization.filter(spec => spec !== text)
            return { ...serv, specialization: updatedSpec }
         }else{
            return { ...serv }
         }
      })
      let updatedSetting = {
         servicesAndSpecialization: updated
      }
      updateAndFetchsettings(updatedSetting)
   }

   const onToggle = (key, value) => {
      setToggleImage(prev => {
         return {
            ...prev,
            [key]: value
         }
      })
   }

   // if (Object.keys(settingsData).length === 0) return <></>
   const { classes, servicesAndSpecialization, Expertise, sessionTags, leadStatus, tutorStatus, offerImages, subscriptionCode, personality, interest } = settingsData

   // console.log('sessionTags', sessionTags);
   // console.log('servicesAndSpecialization', servicesAndSpecialization);
   // console.log(offerImages)

   return (
      <>

         <div className='lg:ml-pageLeft bg-lightWhite min-h-screen px-8 pt-[50px] pb-[50px]'>
            <div className='flex justify-between items-center mb-[45px]'>

               <div>
                  <p className='font-bold text-4xl mb-[54px] text-[#25335A]'> Settings </p>
                  <div className='text-base'>
                     <div className='flex items-center mb-4'>
                        <p className='opacity-60  mr-[15px]'> Full Name:</p>
                        <p className='font-bold'> Kartik Sarda</p>
                     </div>
                     <div className='flex items-center mb-4'>
                        <p className='opacity-60 mr-[23px]'>  Email:</p>
                        <p className='font-bold'> kartik@sevensquarelearning.com</p>
                     </div>
                     <div className='flex items-center mb-4'>
                        <p className='opacity-60 mr-[15px]'>Phone:</p>
                        <p className='font-bold'> +91 1234567890</p>
                     </div>
                  </div>
               </div>

               <PrimaryButton
                  className='w-[174px] px-4'
                  onClick={() => setModalActive(true)}
                  children={
                     <div className='flex items-center justify-center'>
                        <p className='mr-3 text-lf font-semibold whitespace-nowrap text-[18px]'>
                           Edit Details
                        </p>
                        <img src={EditIcon} />
                     </div>} />
            </div>

            <div>
               <SettingsCard title='Lead Status Items'
                  body={
                     <div className='flex items-center flex-wrap [&>*]:mb-[10px]'>
                        <AddTag onAddTag={handleAddTag} keyName='leadStatus' />
                        <FilterItems onlyItems={true}
                           isString={true}
                           items={leadStatus ? leadStatus : []}
                           keyName='leadStatus'
                           onRemoveFilter={onRemoveFilter}
                           className='pt-1 pb-1 mr-15' />
                     </div>
                  } />

               <SettingsCard title='Tutor Status Items'
                  body={
                     <div className='flex items-center flex-wrap [&>*]:mb-[10px]'>
                        <AddTag onAddTag={handleAddTag} keyName='tutorStatus' />
                        <FilterItems onlyItems={true}
                           isString={true}
                           items={tutorStatus ? tutorStatus : []}
                           keyName='tutorStatus'
                           onRemoveFilter={onRemoveFilter}
                           className='pt-1 pb-1 mr-15' />
                     </div>
                  } />
               <SettingsCard title='Subscription Code'
                  body={
                     <div className='flex items-center flex-wrap [&>*]:mb-[10px]'>
                        <AddTag onAddTag={handleAddTag} keyName='subscriptionCode' />
                        <FilterItems onlyItems={true}
                           isString={true}
                           items={subscriptionCode ? subscriptionCode : []}
                           keyName='subscriptionCode'
                           onRemoveFilter={onRemoveFilter}
                           className='pt-1 pb-1 mr-15' />
                     </div>
                  } />

               <SettingsCard title='Session Tags'
                  titleClassName='text-[21px] mb-[15px]'
                  body={
                     <div>
                        {sessionTags !== undefined && Object.keys(sessionTags).map((tag, i) => {
                           return <div key={i}>
                              <p className='font-bold text-primary-dark mb-[25px]'>
                                 {getSessionTagName(Object.keys(sessionTags)[i])}
                              </p>
                              <div className='flex items-center flex-wrap [&>*]:mb-[10px]'>
                                 <AddTag onAddTag={handleSessionAddTag}
                                    keyName={Object.keys(sessionTags)[i]} />
                                 <FilterItems isString={true} onlyItems={true}
                                    keyName={Object.keys(sessionTags)[i]}
                                    items={sessionTags[tag]}
                                    onRemoveFilter={onRemoveSessionTag}
                                    className='pt-1 pb-1 mr-15' />
                              </div>
                           </div>
                        })}
                     </div>
                  } />

               <SettingsCard title='Expertise' toggle={{ value: toggleImage.Expertise, key: 'Expertise' }} onToggle={onToggle}
                  body={
                     <div className='flex items-center flex-wrap [&>*]:mb-[10px]'>
                        <AddTag keyName='Expertise' openModal={true}
                           onAddTag={() => handleTagModal('Expertise')} />
                        <FilterItems isString={false} onlyItems={true} image={toggleImage.Expertise}
                           items={sessionTags !== undefined ? Expertise.map(item => item) : []}
                           keyName='Expertise'
                           onRemoveFilter={onRemoveTextImageTag}
                           className='pt-1 pb-1 mr-15' />
                     </div>
                  } />

               <SettingsCard title='Service and specialization'
               className=''
                  titleClassName='text-[21px] mb-[15px]'
                  body={
                     <div className='max-h-[360px] overflow-auto scrollbar-content scrollbar-vertical'>
                        {servicesAndSpecialization !== undefined && servicesAndSpecialization.map((service, i) => {
                           return <div key={i}>
                              <p className='font-bold text-primary-dark mb-4'>
                                 {service.service}
                              </p>
                              <div className='flex items-center flex-wrap [&>*]:mb-[18px]'>
                                 <AddTag onAddTag={handleAddSpecialization}
                                    keyName={service.service}
                                    text='Add Specialization'
                                 />
                                 <FilterItems isString={true} onlyItems={true}
                                    keyName={service.service}
                                    items={service.specialization}
                                    onRemoveFilter={onRemoveSpecialization}
                                    className='pt-1 pb-1 mr-15'
                                 />
                              </div>
                           </div>
                        })}
                        <AddTag children='Add service' className='pl-3 pr-3 pt-1.4 pb-1.5 mt-5 bg-primary text-white'
                           text='Add service'
                           hideIcon={true}
                           onAddTag={onAddService} />
                     </div>
                  } />

               <SettingsCard title='Personality' toggle={{ value: toggleImage.personality, key: 'personality' }} onToggle={onToggle}
                  body={
                     <div className='flex items-center flex-wrap [&>*]:mb-[10px]'>
                        <AddTag keyName='personality' openModal={true}
                           onAddTag={() => handleTagModal('personality')} />
                        <FilterItems isString={false} onlyItems={true} image={toggleImage.personality}
                           items={personality !== undefined ? personality.map(item => item) : []}
                           keyName='personality'
                           onRemoveFilter={onRemoveTextImageTag}
                           className='pt-1 pb-1 mr-15' />
                     </div>
                  } />

               <SettingsCard title='Interest' toggle={{ value: toggleImage.interest, key: 'interest' }} onToggle={onToggle}
                  body={
                     <div className='flex items-center flex-wrap [&>*]:mb-[10px]'>
                        <AddTag keyName='interest' openModal={true}
                           onAddTag={() => handleTagModal('interest')} />
                        <FilterItems isString={false} onlyItems={true} image={toggleImage.interest}
                           items={interest !== undefined ? interest.map(item => item) : []}
                           keyName='interest'
                           onRemoveFilter={onRemoveTextImageTag}
                           className='pt-1 pb-1 mr-15' />
                     </div>
                  } />

               <SettingsCard title='Subjects'
                  body={
                     <div className='flex items-center flex-wrap [&>*]:mb-[10px]'>
                        <AddTag onAddTag={handleAddTag} keyName='classes' />
                        <FilterItems isString={true}
                           onlyItems={true}
                           keyName='classes'
                           items={classes ? classes : []}
                           onRemoveFilter={onRemoveFilter}
                           className='pt-1 pb-1 mr-15' />
                     </div>
                  } />

               <SettingsCard title='Images in Offer Slide' toggle={{ value: toggleImage.offer, key: 'offer' }} onToggle={onToggle}
                  body={
                     <div className='flex items-center flex-wrap [&>*]:mb-[10px]'>
                        <AddTag openModal={true}
                           onAddTag={() => handleTagModal('offer')} />
                        {/* <input type='file' ref={inputRef} className='hidden' accept="image/*"
                           onChange={e => onImageChange(e)} /> */}
                        <FilterItems isString={false}
                           image={toggleImage.offer}
                           onlyItems={true}
                           sliceText={true}
                           items={offerImages !== undefined ? offerImages.map(item => ({ ...item, text: item.image })) : []}
                           onRemoveFilter={onRemoveImage}
                           // onRemoveFilter={onRemoveFilter}
                           className='pt-1 pb-1 mr-15' />
                     </div>
                  } />
            </div>
         </div >
         {
            modalActive &&
            <Modal
               classname={'max-w-840 mx-auto'}
               title='Edit Details'
               titleClassName='mb-[18px]'
               cancelBtn={true}
               cancelBtnClassName='w-140'
               primaryBtn={{
                  text: "Save",
                  className: 'w-140',
                  form: 'settings-form',
                  type: 'submit',
               }}
               handleClose={handleClose}
               body={
                  <form id='settings-form' onSubmit={handleSubmit}>
                     <div className='grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5'>
                        <div>
                           <InputField label='Admin Name'
                              labelClassname='ml-4 mb-0.5'
                              placeholder='Admin Name'
                              inputContainerClassName='px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full mr-4' type='text'
                              value={modalData.name}
                              isRequired={true}
                              onChange={e => setModalData({ ...modalData, name: e.target.value })} />
                        </div>
                        <div>
                           <InputField label='Phone No.'
                              labelClassname='ml-4 mb-0.5'
                              isRequired={true}
                              placeholder='+91 Phone Number'
                              inputContainerClassName='px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full mr-4' type='text'
                              value={modalData.phone}
                              onChange={e => setModalData({ ...modalData, phone: e.target.value })} />
                        </div>
                        <div>
                           <InputField label='Email Address'
                              labelClassname='ml-4 mb-0.5'
                              isRequired={true}
                              placeholder='Email Address'
                              type='email'
                              inputContainerClassName='px-5 bg-primary-50 border-0'
                              inputClassName='bg-transparent'
                              parentClassName='w-full mr-4'
                              value={modalData.email}
                              onChange={e => setModalData({ ...modalData, email: e.target.value })} />
                        </div>

                     </div>
                  </form>
               }
            />
         }
         {
            tagModalActive &&
            <Modal
               classname={'max-w-[540px] mx-auto'}
               title=''
               titleClassName='mb-[18px]'
               cancelBtn={true}
               cancelBtnClassName='w-140 hidden'
               primaryBtn={{
                  text: "Save",
                  className: `w-140 ml-0 bg-primaryOrange mt-2 ${tagText.trim().length < 1 || tagImage === null ? 'pointer-events-none opacity-60' : ''} `,
                  form: 'settings-form',
                  type: 'submit',
               }}
               handleClose={() => setTagModalActive(false)}
               body={
                  <form id='settings-form' onSubmit={submitImageModal}>
                     <div className='flex flex-col items-start mb-5'>
                        <InputField label='Text'
                           labelClassname='ml-4 mb-0.5'
                           placeholder='Text'
                           inputContainerClassName='px-5 pt-3 pb-3 bg-primary-50 border-0'
                           inputClassName='bg-transparent'
                           parentClassName='w-full mr-4 mb-3' type='text'
                           value={tagText}
                           isRequired={true}
                           onChange={e => setTagText(e.target.value)} />
                        <input type='file'
                           accept='/image'
                           onChange={e => {
                              setTagImage(e.target.files[0]);
                              setImageName(e.target.files[0].name)
                           }}
                           className='hidden '
                           ref={imageUploadRef} />

                        <PrimaryButton children='Upload image'
                           className='mx-auto pt-2.5 pb-2.5 pl-4 pr-4'
                           // disabled={`${tagImage === null ? true : false}`}
                           onClick={() => imageUploadRef.current.click()} />
                        <p className='text-center w-full'>
                           {imageName !== '' ? imageName : ''}
                        </p>
                     </div>
                  </form>
               }
            />
         }

      </>

   )
}
