import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import ApiTable from "./ApiTAble";
import Pagination from "./Pagination";
import { TableHeader } from "./TableHeader";
import TableItem from "./tableItem";

export default function Table(props) {
   const {
      dataFor,
      data,
      tableHeaders,
      maxPageSize,
      onClick,
      hidePagination,
      setMaxPageSize,
      excludes,
      total_pages,
      isCallingApi
   } = props

   const [tableData, setTableData] = useState(data);
   const [currentPage, setCurrentPage] = useState(1);
   const dataLength = data.length > 30 ? 30 : data.length;
   const [sorted, setSorted] = useState(false)


   useEffect(() => {
      // console.log(tableData[0]?.dueDate?.split("-").join(""));
      // const newTeble = tableData.sort((a, b) => a.dueDate?.split("-").join("") - b.dueDate?.split("-").join(""));
      // console.log(newTeble);
   }, [tableData])


   useEffect(() => {
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

   const sorting = () => {
      // console.log("object");
      // setTableData(tableData.sort((a, b) => b.dueDate?.split("-").join("") - a.dueDate?.split("-").join("")))
   }


   //change tabledata if current page changes
   useEffect(() => {
      if (hidePagination === true) return
      const temp = data.slice((currentPage - 1) * maxPageSize, (currentPage - 1) * maxPageSize + maxPageSize)
      setTableData(temp)
   }, [currentPage, data])

   if (isCallingApi) return <ApiTable {...props} />
   return (
      <div>
         <table className="table-auto mb-3 text-center w-full">
            <thead className="pb-2">
               <tr>
                  {tableHeaders.map((item, idx) => {
                     return <TableHeader key={idx} header={item} onClick={sorting} setSorted={setSorted} dataFor={dataFor} />;
                  })}
               </tr>
            </thead>
            <tbody>
               {/* {dataFor === "invoice" ? sorted ? tableData.sort((a, b) => a.createDate?.split("-").join("") - b.createDate?.split("-").join("")).map((item, idx) => { */}
                  {/* return ( */}
                  {tableData.map((item, idx) => {
                  return (
                     <TableItem
                        dataFor={dataFor}
                        item={item}
                        key={idx}
                        excludes={excludes}
                        onClick={onClick}
                     />
                  );
               })}
                {/*}  );
                }) : tableData.sort((a, b) => b.assignedOn?.split("-").join("") - a.assignedOn?.split("-").join("")).map((item, idx) => <TableItem
               //    dataFor={dataFor}
               //    item={item}
               //    key={idx}
               //    excludes={excludes}
               //    onClick={onClick}
               // />) : sorted ? tableData.sort((a, b) => a.dueDate?.split("-").join("") - b.dueDate?.split("-").join("")).map((item, idx) => {
               //    return (
               //       <TableItem
               //          dataFor={dataFor}
               //          item={item}
               //          key={idx}
               //          excludes={excludes}
               //          onClick={onClick}
               //       />
               //    );
               // }) : tableData.sort((a, b) => b.assignedOn?.split("-").join("") - a.assignedOn?.split("-").join("")).map((item, idx) => <TableItem
               //    dataFor={dataFor}
               //    item={item}
               //    key={idx}
               //    excludes={excludes}
               //    onClick={onClick}
               // />)} */}
            </tbody>
         </table>

         <div className="flex grid-cols- justify-center items-center">
            <aside></aside>
            {!hidePagination &&
               // <Pagination
               //    totalPages={isCallingApi ? total_pages : Math.ceil(data.length / maxPageSize)}
               //    currentPage={currentPage}
               //    setCurrentPage={setCurrentPage}
               // />
               <ReactPaginate
                  className='table-pagination-container flex justify-center mt-5'
                  pageClassName={`flex justify-center items-center w-[38.12px] h-[38.12px] border border-primary rounded-full mr-5 cursor-pointer
            ${'text-primary'}`}
                  activeClassName={`bg-primary text-white`}
                  breakLabel="..."
                  // nextLabel="next >"
                  onPageChange={(val) => setCurrentPage(val.selected + 1)}
                  pageRangeDisplayed={3}
                  pageCount={isCallingApi ? total_pages : Math.ceil(data.length / maxPageSize)}
                  // previousLabel="< previous"
                  previousClassName='hidden'
                  nextClassName='hidden'
                  renderOnZeroPageCount={null}
                  pageLinkClassName='w-full h-full flex justify-center items-center'
               />
            }
            {/* <aside className="ml-auto flex items-center whitespace-nowrap">
               <button className="mx-3 px-6 py-3 bg-primary disabled:bg-primary-300 text-white rounded" onClick={() => setMaxPageSize(10)} disabled={maxPageSize === 10}>Show 10 Entries</button>
               <button className="mx-3 px-6 py-3 bg-primary text-white rounded disabled:bg-primary-300" onClick={() => setMaxPageSize(data.length > 30 ? 30 : data.length)} disabled={maxPageSize >= dataLength}>Show {data.length > 30 ? "30" : `all ${data.length}`} Entries</button>
            </aside> */}
         </div>

      </div>
   );
}
