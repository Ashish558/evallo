import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { TableHeader } from "./TableHeader";
import TableItem from "./tableItem";

export default function Table({
   dataFor,
   data,
   tableHeaders,
   maxPageSize,
   onClick,
   hidePagination,
   setMaxPageSize
}) {
   const [tableData, setTableData] = useState(data.sort((a,b) => a.name?.slice(0,1).toLowerCase() > b.name?.slice(0,1).toLowerCase()));
   const [currentPage, setCurrentPage] = useState(1);
   const dataLength = data.length > 30 ? 30 : data.length;

   // console.log();
   
   useEffect(() => {
      if (hidePagination === true) {
         setTableData(data)
      } else {
         const temp = data.slice(0, maxPageSize);
         // const temp = tableData.slice(0, maxPageSize); ***  it Was the Previous one  ***
         setTableData(temp);
         setCurrentPage(1);
      }
   }, [data, maxPageSize, data.length]);


   //change tabledata if current page changes
   useEffect(() => {
      if (hidePagination === true) return
      const temp = data.slice((currentPage - 1) * maxPageSize, (currentPage - 1) * maxPageSize + maxPageSize)
      setTableData(temp)
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
                        onClick={onClick}
                     />
                  );
               })}
            </tbody>
         </table>

         <div className="grid grid-cols-3 items-center">
            <aside></aside>
            {!hidePagination && <Pagination
               totalPages={Math.ceil(data.length / maxPageSize)}
               currentPage={currentPage}
               setCurrentPage={setCurrentPage}
            />}
            <aside className="ml-auto">
               <button className="mx-3 px-6 py-3 bg-primary disabled:bg-primary-300 text-white rounded" onClick={() => setMaxPageSize(10)} disabled={maxPageSize === 10}>Show 10 Entries</button>
               <button className="mx-3 px-6 py-3 bg-primary text-white rounded disabled:bg-primary-300" onClick={() => setMaxPageSize(data.length > 30 ? 30 : data.length)} disabled={maxPageSize >= dataLength}>Show {data.length > 30 ? "30" : `all ${data.length}`} Entries</button>
            </aside>
         </div>

      </div>
   );
}
