import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLazyGetParentLedgerQuery, useLazyPayBalanceQuery } from '../../app/services/dashboard'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import SingleLedger from './SingleLedger/SingleLedger'

const headers = [
   'ID', 'Title', 'Date', 'Amount Paid', 'Balance Change', 'Available Credit'
]
export default function Ledger() {

   const [fetchLedgers, ledgerResp] = useLazyGetParentLedgerQuery()
   const [ledgers, setLedgers] = useState([])
   const [searchParams, setSearchParams] = useSearchParams();
   const navigate = useNavigate()
   const [payBalance, payBalanceResp] = useLazyPayBalanceQuery()

   const { id, amountToPay, credits } = useSelector(state => state.user)
   const handlePay = () => {
      payBalance()
         .then(res => {
            if (res.error) {
               console.log(res.error)
               if (res.error.data) alert(res.error.data.message)
               return
            }
            console.log(res.data.data)
            if (res.data.data) {
               if (res.data.data.link) window.open(res.data.data.link)
            }
         })
   }

   useEffect(() => {
      fetchLedgers()
         .then(res => {
            console.log(res.data);
            let temp = res.data.data.ledger.map(item => ({ ...item, isOpen: false }))
            setLedgers(temp)
         })
   }, [])

   useEffect(() => {
      if (searchParams.get('status')) {
         if (searchParams.get('status') === 'paid') {
            alert('Payment Successful')
            navigate('/ledger')
            // searchParams.delete('status')
            // searchParams.delete('parentId')
         } else {
            alert('Payment not successful')
            navigate('/ledger')
            // searchParams.delete('status')
            // searchParams.delete('parentId')
         }
      }
   }, [])

   const toggleOpen = _id => {
      let temp = ledgers.map(item => {
         return item._id === _id ? { ...item, isOpen: !item.isOpen } : { ...item }
      })
      setLedgers(temp)
   }
console.log(ledgers);

   return (
      <div className='lg:ml-pageLeft bg-lightWhite min-h-screen pb-51'>
         <div className='lg:px-5 lg:pt-10'>

            <div className="flex justify-between items-center">
               <p className="font-bold text-4xl text-primary-dark">
                  Ledger
               </p>
               <PrimaryButton children={`Pay Now:  $${amountToPay}`} onClick={handlePay} />
            </div>

            <div className='grid grid-cols-6 mt-[43px]'>
               {headers.map((head, idx) => {
                  return <div key={idx} className='bg-primary py-[22px] text-white text-center px-4'> <p> {head} </p> </div>
               })}
               {
                  ledgers.map(ledger => {
                     return <SingleLedger key={ledger._id} {...ledger} toggleOpen={toggleOpen} />
                  })
               }
            </div>

         </div>
      </div>
   )
}
