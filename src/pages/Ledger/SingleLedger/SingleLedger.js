import React, { useEffect, useState } from 'react'
import { useLazyGetSingleSessionQuery } from '../../../app/services/session'
import { useLazyGetInvoiceQuery } from '../../../app/services/users'
import ArrowIcon from '../../../assets/Dashboard/arrow.svg'
import DownloadIcon from '../../../assets/icons/download-ledger.svg'
import { getFormattedDate, tConvert } from '../../../utils/utils'

export default function SingleLedger({ _id, invoiceId, sessionId, title, Date: ledgerDate, amountPaid, balanceChange, newBalance, isOpen, toggleOpen }) {


   const [tutorName, setTutorName] = useState('')
   const [studentName, setStudentName] = useState('')

   const [sessionDetails, setSessionDetails] = useState({})
   const [invoiceDetail, setInvoiceDetail] = useState({})

   const [fetchSession, fetchSessionResponse] = useLazyGetSingleSessionQuery()
   const [fetchInvoice, fetchInvoiceResp] = useLazyGetInvoiceQuery()

   useEffect(() => {
      let names = title.split('<>')
      if (names.length > 1) {
         setTutorName(names[0])
         setStudentName(names[1])
      }
   }, [])

   useEffect(() => {
      if (!sessionId) return

      const { start, end } = sessionId.time
      const timeStr = `${start.time} ${start.timeType} - ${end.time} ${end.timeType} `
      setSessionDetails({ ...sessionId, timeStr });

   }, [])

   console.log('session', sessionDetails);
   useEffect(() => {
      if (!invoiceId) return
      fetchInvoice({ id: invoiceId })
         .then(res => {
            const invoice = res.data.data.invoice[0]
            invoice && setInvoiceDetail(invoice)
            // const { start, end } = res.data.data.session.time

         })
   }, [])

   const { service, total_hours, timeStr, sessionNotes } = sessionDetails
   const { description } = invoiceDetail

   let discountLedgerDate = new Date(ledgerDate)
   let hours = discountLedgerDate.getHours()
   let minutes = discountLedgerDate.getMinutes()
   if (hours < 10) {
      hours = `0${hours}`
   } else {
      hours = `${hours}`
   }

   if (minutes < 10) {
      minutes = `0${minutes}`
   } else {
      minutes = `${minutes}`
   }
   const discountPackageTime = tConvert(`${hours}:${minutes}`)
   // console.log(invoiceDetail)

   return (
      <>
         <div className='text-center py-[16px] px-3'>
            {`${_id.slice(-10)}`}
         </div>
         <div className='text-center  py-[16px] px-3'>
            {title}
         </div>
         <div className='text-center  py-[16px] px-3'>
            {getFormattedDate(ledgerDate)}
         </div>
         <div className='text-center  py-[16px] px-3'>
            $ {amountPaid}
         </div>
         <div className='text-center  py-[16px] px-3'>
            $ {balanceChange}
         </div>
         <div className='text-left flex justify-center items-center py-[16px] px-3'>
            $ {newBalance}
            <img src={ArrowIcon}
               onClick={() => toggleOpen(_id)}
               className={`ml-[41px] inline-block ease-out duration-100 ${isOpen ? 'rotate-180' : ''}`} />
         </div>

         {isOpen &&
            <>
               {/* <div></div> */}
               <div className={`col-span-6 bg-primaryWhite-400 py-4  ease-out duration-100 ${isOpen} `}>
                  <div className='grid grid-cols-6 px-[200px] grid-flow'>
                     {/* <div className='flex items-center'> */}
                     {
                        title !== "Discount Package" ?
                           <>
                              <div className='font-bold mx-1 py-6' > Student </div>
                              <div className='py-6 opacity-80'> {studentName !== '' ? studentName : '-'} </div>
                              {/* </div> */}
                              {/* <div className='flex items-center'> */}
                              <div className='font-bold mx-1 py-6'> Tutor </div>
                              <div className='py-6 opacity-80'> {tutorName !== '' ? tutorName : '-'} </div>
                              {/* </div> */}
                              {/* <div className='flex items-center'>   */}
                              <div className='font-bold mx-1 py-6'> Service </div>
                              <div className='py-6 opacity-80'> {service ? service : '-'} </div>
                              {/* </div> */}
                              {/* <div className='py-6'> Student </div> */}
                              <div className='font-bold mx-1 py-6' > Session Duration </div>
                              <div className='py-6 opacity-80'>
                                 {total_hours ? `${total_hours} ${total_hours === 1 ? 'hour' : 'hours'}` : '-'}
                              </div>

                              <div className='font-bold mx-1 py-6' > Time </div>
                              <div className='py-6 opacity-80'> {timeStr ? timeStr : '-'} </div>

                              <div className='font-bold mx-1 py-6' > Hourly Rate </div>
                              <div className='py-6 opacity-80'> {service ? '-' : '-'} </div>


                              <div className='font-bold mx-1 pt-3' > Session Notes </div>
                              <div className='col-span-5 pl-4 pt-3 opacity-80'>
                                 {sessionNotes ? sessionNotes : '-'}
                              </div>
                           </> :
                           <>

                              <div className='font-bold mx-1 py-6' > Time </div>
                              <div className='py-6 opacity-80'>
                                 {discountPackageTime ? `${discountPackageTime.time} ${discountPackageTime.timeType}` : '-'}
                              </div>


                              {/* <div className='flex items-center'> */}
                              <div className='col-span-4 flex justify-end'>
                                 <div className='opacity-0 pointer-events-none font-bold mx-1 py-6 flex items-center cursor-pointer'>
                                    <p className='text-[#0671E0] mr-1.5'>
                                       Download invoice
                                    </p>
                                    <img src={DownloadIcon} />
                                 </div>

                              </div>

                              <div className='font-bold mx-1 py-6'> Description </div>
                              <div className='py-6 opacity-80 col-span-5'>
                                 {invoiceId.description ? invoiceId.description : '-'}
                              </div>


                           </>
                     }
                  </div>
               </div>
            </>
         }
      </>
   )
}
