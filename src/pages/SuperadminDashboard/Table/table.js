import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Pagination from "./Pagination";
import TableItem from "./TableItem";
import TableHeader from "./TableHeader";
import styles from './styles.module.css'

export default function Table(props) {
   const {
      dataFor,
      data,
      tableHeaders,
      maxPageSize,
      onClick,
      hidePagination,
      excludes,
      changePageAfterUpdate,
      loading
   } = props

   const [tableData, setTableData] = useState(data);
   const [currentPage, setCurrentPage] = useState(1);
   const dataLength = data.length > 30 ? 30 : data.length;
   const [sorted, setSorted] = useState(false)

   useEffect(() => {
      if (changePageAfterUpdate === false) return
      if (hidePagination === true) {
         setTableData(data)
      } else {
         const temp = data.slice(0, maxPageSize);
         // const temp = tableData.slice(0, maxPageSize); ***  it Was the Previous one  ***
         setTableData(temp);
         setSorted(temp)
         setCurrentPage(1);
      }
   }, [data, maxPageSize, data.length]);

   //change tabledata if current page changes
   useEffect(() => {
      if (hidePagination === true) return
      const temp = data.slice((currentPage - 1) * maxPageSize, (currentPage - 1) * maxPageSize + maxPageSize)
      setTableData(temp)
   }, [currentPage, data])

   const totalPages = Math.ceil(data.length / maxPageSize)
   console.log('cp', currentPage)
   return (
      <div>
         <table className={`${styles.customTable} mb-3 text-center w-full min-h-[300px]`}>
            <thead className="bg-[#26435F]">
               <tr>
                  {tableHeaders.map((item, idx) => {
                     return <TableHeader key={idx} header={item} dataFor={dataFor} />;
                  })}
               </tr>
            </thead>
            <tbody className="relative">
               {
                  loading ?
                     <div className={`absolute w-full min-h-[100px] flex justify-center items-center`}>
                        <div>
                        </div>
                     </div> :
                     tableData.map((item, idx) => {
                        return (
                           <TableItem
                              dataFor={dataFor}
                              item={item}
                              key={idx}
                              excludes={excludes}
                              onClick={onClick}

                           />
                        );
                     })
               }

            </tbody>
         </table>
         {/* <div className="flex justify-between items-center mt-[17px]">
            <p className="text-left text-[#517CA8] text-sm">Showing 5 out of 10</p>
            <p className='text-[10px]  text-right'><span className='text-[#26435F ]  font-medium '>Prev</span><span className='pl-2 text-[#FFA28D] font-bold'>01</span><span className='pl-2 text-[#B7C2CB] '>02</span><span className='pl-2'>...</span><span className='pl-2 text-[#B7C2CB] '>06</span><span className='text-[#26435F ] font-medium pl-2'>Next</span></p>
         </div>
         <div className="flex grid-cols- justify-center items-center">
         </div> */}
         <div className="flex grid-cols- justify-center items-center">
            <Pagination totalPages={Math.ceil(data.length / maxPageSize)}
               currentPage={currentPage}
               setCurrentPage={setCurrentPage} />

         </div>
      </div>
   );
}
