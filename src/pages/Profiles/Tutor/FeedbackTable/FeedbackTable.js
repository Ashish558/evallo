import React, { useEffect, useState } from 'react'
import ProfileCard from '../../../../components/ProfileCard/ProfileCard'
import Feedback from './feedback'
import Pagination from './Pagination'

const maxPageSize = 10
export default function FeedbackTable({ feedbacks }) {

   const [tableData, setTableData] = useState(feedbacks)
   const [currentPage, setCurrentPage] = useState(1)

   useEffect(() => {
      const temp = feedbacks.slice(0, maxPageSize);
      // const temp = tableData.slice(0, maxPageSize); ***  it Was the Previous one  ***
      setTableData(temp);
      setCurrentPage(1);

   }, [feedbacks, maxPageSize, feedbacks.length]);

   useEffect(() => {
      const temp = feedbacks.slice((currentPage - 1) * maxPageSize, (currentPage - 1) * maxPageSize + maxPageSize)
      setTableData(temp)
   }, [currentPage, feedbacks])

   // console.log(tableData);
   return (
      <>
         <ProfileCard hideShadow
            className='col-span-12 mt-6 lg:mt-0'
            body={
               <div className='overflow-x-auto scrollbar-content'>
                  <p className='text-primaryDark text-left font-bold text-lg capitalize pl-2 mb-5'> 
                  Feedback 
                  </p>

                  <div className='flex flex-wrap'>
                     {
                        tableData.map(item => {
                           return (
                              <div className='flex w-[50%] odd:pr-4 even:pl-4 pb-6'>
                                 <Feedback {...item} />
                              </div>
                           )
                        })
                     }
                  </div>

                  <Pagination
                     totalPages={Math.ceil(feedbacks.length / maxPageSize)}
                     currentPage={currentPage}
                     setCurrentPage={setCurrentPage}
                  />
               </div>

            }
         />
      </>
   )
}
