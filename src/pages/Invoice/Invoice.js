import React, { useEffect, useState } from 'react'
import InputField from '../../components/InputField/inputField';
import InputSelect from "../../components/InputSelect/InputSelect";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import inputStyle from "../Signup/signup.module.css";
import Table from '../../components/Table/Table';
import { tableData } from './tempdata';
import InputSearch from '../../components/InputSearch/InputSearch';
import { useLazyGetParentsByNameQuery, useAddInvoiceMutation, useLazyGetAllInvoiceQuery } from '../../app/services/admin';
import { getCurrentDate, getFormattedDate } from '../../utils/utils';

const options = ['package', 'hourly']

const tableHeaders = [
   "Client Name",
   "Current Bal.",
   "Invoice ID",
   "Create Date",
   "Status",
   "Paid On",
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
   const [fetchParents, parentsResponse] = useLazyGetParentsByNameQuery()
   const [fetchAllInvoice, allInvoiceResp] = useLazyGetAllInvoiceQuery()

   const [parents, setParents] = useState([])
   const [allInvoices, setAllInvoices] = useState([])

   useEffect(() => {
      if (invoiceData.clientName.length > 2) {
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
      const reqBody = {
         parentId: invoiceData.parentId,
         title: invoiceData.description,
         Date: getCurrentDate(),
         amountDue: invoiceData.amountDue,
         type: invoiceData.invoiceType,
         balanceChange: invoiceData.balance,
      }
      addInvoice(reqBody)
         .then(res => {
            console.log(res)
            setInvoiceData(initialState)
            fetchInvoices()
         })
   }

   const checkIfExist = val => val ? val : '-'

   const fetchInvoices = () => {
      fetchAllInvoice()
         .then(res => {
            console.log(res.data.data);
            const tempinvoices = res.data.data.invoice.map(invoice => {
               const { _id, createdAt, isPaid, amountDue, balanceChange, type } = invoice
               return {
                  _id,
                  name: '-',
                  currentBalance: '$230',
                  invoiceId: _id.slice(-8),
                  createDate: getFormattedDate(createdAt),
                  status: isPaid ? 'Paid' : 'Unpaid',
                  paidOn: '-',
                  type: checkIfExist(type),
                  amountDue: `$${amountDue}`,
                  balanceCredit: `$${balanceChange}`,
               }
            })
            setAllInvoices(tempinvoices)
         })
   }

   useEffect(() => {
      if (invoiceData.invoiceType === 'hourly') {
         setInvoiceData({
            ...invoiceData,
            balance: invoiceData.amountDue
         })
      }
      // console.log(invoiceData)
   }, [invoiceData.invoiceType, invoiceData.amountDue])

   useEffect(() => {
      fetchInvoices()
   }, [])

   return (
      <>

         {/* // <div className='lg:ml-pageLeft bg-lightWhite min-h-screen pt-[30px] pb-[50px] pl-[66px] pr-[41px]'>
         //    <div className=''>
         //       <p className='font-bold text-[48px] mb-[30px] text-[#25335A]'> Invoices </p>
         //       <div className='flex'>
         //          <div className='grid grid-cols-2 flex-1 gap-x-[46px] gap-y-[16px] mr-[50px]'> */}
         <div className='lg:ml-pageLeft bg-lightWhite min-h-screen pt-[30px] pb-[50px] pl-[61px] pr-[41px]'>
            <div className=''>
               <p className='font-bold text-[48px] mb-[30px] text-[#25335A]'> Invoice </p>
               <form className='flex' onSubmit={handleSubmit} >
                  <div className='grid grid-cols-2 flex-1 gap-x-[46px] gap-y-[16px] mr-[50px]'>

                     <InputSearch
                        label="Client Name"
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
                        parentClassName="relative"
                        label="Balance to be credited"
                        labelClassname="ml-2 mb-1.2"
                        inputContainerClassName="relative border bg-white border pt-2.5 pb-2.5"
                        inputClassName="ml-10"
                        type='number'
                        disabled={invoiceData.invoiceType === 'hourly' ? true : false}
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
                        <PrimaryButton type='submit' children='Create' className='py-[13.5px] px-[43px]' />
                     </div>
                  </div>
               </form>
               <div className="mt-10">
                  <Table
                     dataFor='invoice'
                     data={allInvoices}
                     tableHeaders={tableHeaders}
                     maxPageSize={10}
                  />
               </div>
            </div>
         </div>
      </>
   )
}
