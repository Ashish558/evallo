import React, { useEffect, useState } from 'react'
import InputField from '../../components/InputField/inputField';
import InputSelect from "../../components/InputSelect/InputSelect";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import inputStyle from "../Signup/signup.module.css";
import Table from '../../components/Table/Table';
import { tableData } from './tempdata';
import InputSearch from '../../components/InputSearch/InputSearch';
import { useLazyGetParentsByNameQuery, useAddInvoiceMutation, useLazyGetAllInvoiceQuery, useEditInvoiceMutation } from '../../app/services/admin';
import { getCurrentDate, getFormattedDate } from '../../utils/utils';
import { useLazyGetUserDetailQuery } from '../../app/services/users';
import styles from './styles.module.css'
import { useNavigate } from 'react-router-dom';

const options = ['Discounted Package']

const tableHeaders = [
   "Client Name",
   "Current Bal.",
   "Invoice ID",
   "Create Date",
   "Status",
   "Paid On",
   "Remark",
   "Type",
   "Amt. Due",
   "Bal. Credit(ed)",
];

const initialState = {
   parentId: '',
   clientName: '',
   invoiceType: '',
   amountDue: '',
   balance: '',
   description: '',
}
export default function Invoice() {
   const [invoiceData, setInvoiceData] = useState(initialState)

   const [addInvoice, addInvoiceResponse] = useAddInvoiceMutation()
   const [editInvoice, editInvoiceResponse] = useEditInvoiceMutation()
   const [loading, setLoading] = useState(false)
   const [fetchParents, parentsResponse] = useLazyGetParentsByNameQuery()
   const [getUserDetail, getUserDetailResp] = useLazyGetUserDetailQuery()
   const [fetchAllInvoice, allInvoiceResp] = useLazyGetAllInvoiceQuery()

   const [parents, setParents] = useState([])
   const [allInvoices, setAllInvoices] = useState([])

   useEffect(() => {
      if (invoiceData.clientName.length > 0) {
         fetchParents(invoiceData.clientName).then((res) => {
            // console.log(res.data)
            let tempData = res.data.data.parents.map((parent) => {
               return {
                  _id: parent._id,
                  value: `${parent.firstName} ${parent.lastName}`,
               };
            });
            setParents(tempData);
         });
      }
   }, [invoiceData.clientName]);

   const handleSubmit = e => {
      e.preventDefault()
      setLoading(true)
      const reqBody = {
         parentId: invoiceData.parentId,
         title: invoiceData.description,
         description: invoiceData.description,
         Date: getCurrentDate(),
         amountDue: parseInt(invoiceData.amountDue),
         type: invoiceData.invoiceType,
         balanceChange: parseInt(invoiceData.balance),
      }
      addInvoice(reqBody)
         .then(res => {
            setLoading(false)
            console.log(res)
            setInvoiceData(initialState)
            // fetchInvoices()
         })
   }
   const checkIfExist = val => val ? val : '-'

   const handleEdit = updatedInvoice => {
      console.log('payload', updatedInvoice);
      editInvoice(updatedInvoice)
         .then(res => {
            console.log('response', res)
            if (res.error) {
               if (res.error?.data?.states) {
                  alert(res.error?.data?.states)
               } else if (res.error?.data?.status) {
                  alert(res.error?.data?.status)
               }
               else {
                  alert(res.error?.data?.message)
               }
               return
            }
            // console.log('invoiceData', res.invoiceData)
            if (res.data?.invoiceData) {
               setAllInvoices(prev => {
                  return prev.map(invoice => {
                     if (invoice._id === updatedInvoice._id) {
                        let obj = {
                           ...updatedInvoice,
                           invoiceType: res.data?.invoiceData?.invoiceType,
                           remark: res.data?.invoiceData?.remark,
                        }
                        return obj
                     } else {
                        return invoice
                     }
                  }).sort(function (a, b) {
                     return new Date(b.updatedAt) - new Date(a.updatedAt);
                  });
               })
            }
            // setInvoiceData(initialState)
            // fetchInvoices()
         }).catch(err => {
            console.log(err)

         })
   }

   // const fetchInvoices = () => {
   //    fetchAllInvoice()
   //       .then(resp => {
   //          setAllInvoices([])
   //          console.log('all invoices', resp.data.data.invoice)
   //          resp.data.data.invoice.map((invoice, idx) => {
   //             const { _id, createdAt, isPaid, status, invoiceType, amountDue, balanceChange, type, parentId, updatedAt, remark } = invoice

   //             getUserDetail({ id: parentId }).then((res) => {
   //                const { firstName, lastName, credits } = res.data.data.user
   //                setAllInvoices(prev => {
   //                   let obj = {
   //                      _id,
   //                      name: `${firstName} ${lastName}`,
   //                      currentBalance: `$${credits}`,
   //                      invoiceId: _id.slice(-8),
   //                      createDate: getFormattedDate(createdAt),
   //                      // status: isPaid ? 'Paid' : 'Unpaid',
   //                      invoiceType: invoiceType,
   //                      paidOn: '-',
   //                      remark: remark,
   //                      type: checkIfExist(type),
   //                      amountDue: `$${amountDue}`,
   //                      balanceCredit: `$${balanceChange}`,
   //                      parentId,
   //                      updatedAt
   //                   }
   //                   let allinvs = [...prev, { ...obj }]
   //                   return allinvs.sort(function (a, b) {
   //                      return new Date(b.updatedAt) - new Date(a.updatedAt);
   //                   });

   //                })
   //             })
   //          })
   //       })
   // }

   useEffect(() => {
      if (invoiceData.invoiceType === 'hourly') {
         setInvoiceData({
            ...invoiceData,
            balance: invoiceData.amountDue
         })
      }
      // console.log(invoiceData)
   }, [invoiceData.invoiceType, invoiceData.amountDue])

   // useEffect(() => {
   //    fetchInvoices()
   // }, [])

   // console.log(allInvoices);
   const navigate=useNavigate()
const handleNavigate=()=>{
   console.log('back')
   navigate(-1)
}
   return (
      <div className='relative'>
         <div className={styles.box}>
            <div className={`bg-[#FFFFFF] w-[500px]  px-4 py-3 border-4 border-[#FFA28D] rounded-3xl`}>
               <p className='text-[#517CA8] '>We are working hard to build a reliable invoicing system to ensure that you can easily send invoices to your clients, and they can process your payments on time in a secure manner.<br></br>
                  We will be offering this feature, along with many others, during our alpha launch.</p>
            </div>
            <p className='text-center text-[#FFFFFF]'><button onClick={handleNavigate} >Back</button> </p>
         </div>
         <svg xmlns="http://www.w3.org/2000/svg"
            width="1920"
            height="992"
            viewBox="0 0 1920 992"
            fill="none">

            <path d="M0 0.998047H1920V991.665H0V0.998047Z"
               fill="rgba(38, 67, 95, 0.50)"
               fillOpacity="">
            </path>
         </svg>
         {/* // <div className='lg:ml-pageLeft bg-lightWhite min-h-screen pt-[30px] pb-[50px] pl-[66px] pr-[41px]'>
         //    <div className=''>
         //       <p className='font-bold text-[48px] mb-[30px] text-[#25335A]'> Invoices </p>
         //       <div className='flex'>
         //          <div className='grid grid-cols-2 flex-1 gap-x-[46px] gap-y-[16px] mr-[50px]'> */}
         <div className={` lg:ml-pageLeft bg-lightWhite min-h-screen pt-[30px] pb-[50px] pl-[41px] pr-[41px] ${styles.container}`}>

            <div >
               <p className='font-bold text-[48px] mb-[30px] text-[#25335A]'> Invoice </p>
               <form className='flex' onSubmit={handleSubmit} >
                  <div className='grid grid-cols-2 flex-1 gap-x-[46px] gap-y-[16px] mr-[50px]'>

                     <InputSearch
                        label="Client Name"
                        disabled={true}
                        labelClassname="ml-2 mb-1.2"
                        placeholder="Select Test Type"
                        parentClassName="w-full"
                        inputContainerClassName="bg-white border pt-2.5 pb-2.5"
                        inputClassName="bg-transparent"
                        type="text"
                        optionPrefix='p'
                        value={invoiceData.clientName}
                        onChange={e => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                        optionData={parents}
                        onOptionClick={(item) => setInvoiceData({ ...invoiceData, clientName: item.value, parentId: item._id })}
                     />
                     <InputField
                        disabled={true}
                        parentClassName="relative"
                        label="Amount Due"
                        labelClassname="ml-2 mb-1.2"
                        inputContainerClassName="relative border bg-white border pt-2.5 pb-2.5"
                        inputClassName="ml-10"
                        type='number'
                        inputLeftField={
                           <div className={`relative z-5000 flex items-center justify-center ${inputStyle.phoneNumberField}`}
                              style={{ width: '50px' }} >
                              <div className='flex items-center justify-center ' >
                                 <p className='text-[18px] font-semibold'> $ </p>
                              </div>
                           </div>

                        }
                        value={invoiceData.amountDue}
                        onChange={(e) => setInvoiceData({ ...invoiceData, amountDue: e.target.value, })}
                     />
                     <InputSelect
                        disabled={true}
                        label="Invoice Type"
                        labelClassname="ml-2 mb-1.2"
                        optionData={options}
                        placeholder="Select Test Type"
                        inputContainerClassName="bg-white border py-2.5 px-[20px]"
                        parentClassName="w-full"
                        inputClassName='bg-transparent'
                        type="select"
                        value={invoiceData.invoiceType}
                        onChange={(val) =>
                           setInvoiceData({
                              ...invoiceData,
                              invoiceType: val,
                           })
                        }
                     />
                     <InputField
                        disabled={true}
                        parentClassName="relative"
                        label="Balance to be credited"
                        labelClassname="ml-2 mb-1.2"
                        inputContainerClassName="relative border bg-white border pt-2.5 pb-2.5"
                        inputClassName="ml-10"
                        type='number'
                        // disabled={invoiceData.invoiceType === 'hourly' ? true : false}
                        inputLeftField={
                           <div className={`relative z-5000 flex items-center justify-center ${inputStyle.phoneNumberField}`}
                              style={{ width: '50px' }} >
                              <div className='flex items-center justify-center ' >
                                 <p className='text-[18px] font-semibold'> $ </p>
                              </div>
                           </div>

                        }
                        value={invoiceData.balance}
                        onChange={(e) => setInvoiceData({ ...invoiceData, balance: e.target.value, })}
                     />

                  </div>
                  <div className='flex-1 flex items-start'>
                     <div className='flex flex-1 flex-col self-stretch'>
                        <label className='font-semibold ml-2 mb-1.2'> Invoice Description </label>
                        <textarea
                           disabled={true}
                           placeholder="Session Notes"
                           value={invoiceData.description}
                           onChange={(e) =>
                              setInvoiceData({ ...invoiceData, description: e.target.value })
                           }
                           rows={3}
                           className="resize-none scrollbar-content scrollbar-vertical bg-white flex-1 border w-full outline-0 px-5 py-4 rounded-10"
                        ></textarea>
                     </div>
                     {/* <div className='ml-[36px] mt-[30px]'>
                        <PrimaryButton children='Create' className='py-[13.5px] px-[43px]' /> */}
                     <div className='ml-[36px] mt-[30px]'>
                        <PrimaryButton disabled={true} type='submit' children='Create' className='py-[13.5px] px-[43px]' loading={loading} />
                     </div>
                  </div>
               </form>
               <div className="mt-10">
                  <Table
                     dataFor='invoice'
                     data={allInvoices}
                     tableHeaders={tableHeaders}
                     maxPageSize={10}
                     changePageAfterUpdate={false}
                     excludes={['_id', 'updatedAt', 'parentId']}
                     onClick={{ handleEdit }}
                  />
               </div>
            </div>
         </div>

      </div>
   )
}
