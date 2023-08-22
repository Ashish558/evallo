import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import ApiTable from "./ApiTAble";
import { TableHeader } from "./TableHeader";
import { TableHeaderNew } from "./tableHeaderObj";
import TableItem from "./tableItem";
import Loader from "../Loader";
import styles from "./styles.module.css";
import LatestSignUpTableItem from "./LatestSignUpTableItem";
import Pagination from "../../pages/SuperadminDashboard/Table/Pagination";
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
    isCallingApi,
    headerObject,
    extraData,
    changePageAfterUpdate,
    loading,
    AdminLatestSignUp,
  } = props;
  const [dummy, setDummy] = useState([]);
  const [tableData, setTableData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const dataLength = data?.length > 30 ? 30 : data?.length;
  const [sorted, setSorted] = useState(false);
  useEffect(() => {
    let arr = [];
    let noOfkeys;
    if (headerObject) noOfkeys = Object.keys(tableHeaders).length;
    else noOfkeys = tableHeaders.length;
    arr.length = noOfkeys;
    for (let i = 0; i < maxPageSize - tableData.length; i++) {
      let curr = [];
      for (let j = 0; j < noOfkeys; j++) {
        curr.push(" Dummy ");
      }
      arr.push(curr);
    }
    setDummy(arr);
  }, [tableData]);
  useEffect(() => {
    if (changePageAfterUpdate === false) return;
    if (hidePagination === true) {
      setTableData(data);
    } else {
      const temp = data.slice(0, maxPageSize);
      // const temp = tableData.slice(0, maxPageSize); ***  it Was the Previous one  ***
      setTableData(temp);
      setSorted(temp);
      setCurrentPage(1);
    }
  }, [data, maxPageSize, data?.length]);

  const sorting = () => {
    // console.log("object");
    // setTableData(tableData.sort((a, b) => b.dueDate?.split("-").join("") - a.dueDate?.split("-").join("")))
  };

  //change tabledata if current page changes
  useEffect(() => {
    if (hidePagination === true) return;
    const temp = data.slice(
      (currentPage - 1) * maxPageSize,
      (currentPage - 1) * maxPageSize + maxPageSize
    );
    setTableData(temp);
  }, [currentPage, data]);

  if (isCallingApi) return <ApiTable {...props} />;

  return (
    <div className="w-full">
      <div className="overflow-x-auto scrollbar-content    scroll-m-1 ">
        <table className="table-auto customTable px-[2px] mb-3 text-center w-full whitespace-nowrap">
          <thead className="pb-2 whitespace-nowrap">
            <tr className=" whitespace-nowrap">
              {tableHeaders.map((item, idx) => {
                return headerObject === true ? (
                  <TableHeaderNew header={item} dataFor={dataFor} />
                ) : (
                  <TableHeader
                    key={idx}
                    header={item}
                    onClick={sorting}
                    setSorted={setSorted}
                    dataFor={dataFor}
                  />
                );
              })}
            </tr>
          </thead>
          <tbody className="relative whitespace-nowrap">
            {loading ? (
              <div
                className={`absolute w-full min-h-[100px] flex justify-center items-center`}
              >
                <div>
                  <Loader size="medium" />
                </div>
              </div>
            ) : (
              tableData.map((item, idx) => {
                return AdminLatestSignUp ? (
                  <LatestSignUpTableItem
                    dataFor={dataFor}
                    item={item}
                    key={idx}
                    excludes={excludes}
                    onClick={onClick}
                  />
                ) : (
                  <TableItem
                    dataFor={dataFor}
                    item={item}
                    key={idx}
                    excludes={excludes}
                    onClick={onClick}
                  />
                );
              })
            )}
            {dummy.map((it, iti) => {
              return (
                <tr
                  key={iti}
                  className="bg-white leading-8 shadow-sm text-sm shadow-slate-300"
                >
                  {it.map((d, di) => {
                    return (
                      <td key={di} className="opacity-0 text-sm px-1 min-w-14 py-3 ">
                        {d}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>

      {true ? (
        <div className="flex justify-end items-center">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={
              isCallingApi ? total_pages : Math.ceil(data.length / maxPageSize)
            }
          />
        </div>
      ) : (
        <div
          className={`flex grid-cols- justify-center items-center ${loading ? "mt-7" : ""
            } `}
        >
          <aside></aside>
          {!hidePagination && (
            // <Pagination
            //    totalPages={isCallingApi ? total_pages : Math.ceil(data.length / maxPageSize)}
            //    currentPage={currentPage}
            //    setCurrentPage={setCurrentPage}
            // />
            <ReactPaginate
              className="table-pagination-container flex justify-center mt-5"
              pageClassName={`flex justify-center items-center w-[38.12px] h-[38.12px] border border-primary rounded-full mr-5 cursor-pointer
            ${"text-primary"}`}
              activeClassName={`${styles["active-pagination"]}`}
              breakLabel="..."
              // nextLabel="next >"
              onPageChange={(val) => setCurrentPage(val.selected + 1)}
              pageRangeDisplayed={3}
              pageCount={
                isCallingApi
                  ? total_pages
                  : Math.ceil(data.length / maxPageSize)
              }
              // previousLabel="< previous"
              previousClassName="hidden"
              nextClassName="hidden"
              renderOnZeroPageCount={null}
              pageLinkClassName="w-full h-full flex justify-center items-center"
            />
          )}
          {/* <aside className="ml-auto flex items-center whitespace-nowrap">
               <button className="mx-3 px-6 py-3 bg-primary disabled:bg-primary-300 text-white rounded" onClick={() => setMaxPageSize(10)} disabled={maxPageSize === 10}>Show 10 Entries</button>
               <button className="mx-3 px-6 py-3 bg-primary text-white rounded disabled:bg-primary-300" onClick={() => setMaxPageSize(data.length > 30 ? 30 : data.length)} disabled={maxPageSize >= dataLength}>Show {data.length > 30 ? "30" : `all ${data.length}`} Entries</button>
            </aside> */}
        </div>
      )}
    </div>
  );
}
