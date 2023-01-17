import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { TableHeader } from "./TableHeader";
import TableItem from "./tableItem";
import ReactPaginate from 'react-paginate';

export default function ApiTable({
   dataFor,
   data,
   tableHeaders,
   maxPageSize,
   onClick,
   hidePagination,
   setMaxPageSize,
   excludes,
   total_pages,
   isCallingApi,
   currentPage,
   setCurrentPage,
   fetch
}) {
   const [tableData, setTableData] = useState(data.sort((a, b) => a.name?.slice(0, 1).toLowerCase() > b.name?.slice(0, 1).toLowerCase()));
   const dataLength = data.length > 30 ? 30 : data.length;

   // console.log();

   useEffect(() => {
      if (hidePagination === true) {
         setTableData(data)
      } else {
         const temp = data.slice(0, maxPageSize);
         // const temp = tableData.slice(0, maxPageSize); ***  it Was the Previous one  ***
         setTableData(temp);

      }
   }, [data, maxPageSize, data.length]);


   //change tabledata if current page changes
   useEffect(() => {
      if (hidePagination === true) return
      // const temp = data.slice((currentPage - 1) * maxPageSize, (currentPage - 1) * maxPageSize + maxPageSize)
      // setTableData(temp)
   }, [currentPage, data])

   return (
      <div>
         <table className="table-auto mb-3 text-center w-full">
            <thead className="pb-2">
               <tr>
                  {tableHeaders.map((item, idx) => {
                     return <TableHeader key={idx} header={item} dataFor={dataFor} />;
                  })}
               </tr>
            </thead>
            <tbody>
               {tableData.map((item, idx) => {
                  return (
                     <TableItem
                        dataFor={dataFor}
                        item={item}
                        key={idx}
                        excludes={excludes}
                        onClick={onClick}
                        fetch={fetch}
                     />
                  );
               })}
            </tbody>
         </table>

         <div className="flex justify-center items-center">
            {/* {!hidePagination && <Pagination
               totalPages={total_pages}
               currentPage={currentPage}
               setCurrentPage={setCurrentPage}
            />} */}
            <ReactPaginate
               className='table-pagination-container flex justify-center mt-5'
               pageClassName={`flex justify-center items-center w-[38.12px] h-[38.12px] border border-primary rounded-full mr-5 cursor-pointer
               ${'text-primary'}`}
               activeClassName={`bg-primary text-white`}
               breakLabel="..."
               // nextLabel="next >"
               onPageChange={(val) => setCurrentPage(val.selected + 1)}
               pageRangeDisplayed={3}
               pageCount={total_pages}
               // previousLabel="< previous"
               previousClassName='hidden'
               nextClassName='hidden'
               renderOnZeroPageCount={null}
               pageLinkClassName='w-full h-full flex justify-center items-center'
            />

         </div>

      </div>
   );
}
