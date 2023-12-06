import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Pagination from "./Pagination";
import TableItem from "./TableItem";
import TableHeader from "./TableHeader";
import styles from "./styles.module.css";
import Loader from "../../../components/Loader";
import LoaderNew from "../../../components/Loader/LoaderNew";

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
    loading,
    noArrow,
    Icon,
    AdminLatestSignUp,
    className,
    tableClass
  } = props;

  const [dummy, setDummy] = useState([]);
  const [tableData, setTableData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const dataLength = data?.length > 30 ? 30 : data?.length;
  const [sorted, setSorted] = useState(false);
  useEffect(() => {
    let arr = [];
    let noOfkeys;
    noOfkeys = tableHeaders.length;
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

      setTableData(temp);
      setSorted(temp);
      setCurrentPage(1);
    }
  }, [data, maxPageSize, data?.length]);

  useEffect(() => {
    if (hidePagination === true) return;
    const temp = data.slice(
      (currentPage - 1) * maxPageSize,
      (currentPage - 1) * maxPageSize + maxPageSize
    );
    setTableData(temp);
  }, [currentPage, data]);

  const totalPages = Math.ceil(data.length / maxPageSize);

  return (
    <div className="w-full">
      <div className="overflow-x-auto custom-scroller-2   scroll-m-1 ">
        <table
          className={`${styles.customTable} px-[2px] border-collapse border-spacing-2 whitespace-nowrap  mb-3 text-center w-full min-h-[300px] ${tableClass??""}`}
        >
          <thead className="bg-[#26435F] whitespace-nowrap">
            <tr className=" whitespace-nowrap">
              {tableHeaders.map((item, idx) => {
                return <TableHeader className={className} noArrow={noArrow} key={idx} Icon={Icon} header={item} dataFor={dataFor} />;
              })}
            </tr>
          </thead>
          <tbody className="h-fit">
            {loading ? (
              <div
                className={`absolute w-full min-h-[100px] flex justify-center items-center`}
              >
                <div><LoaderNew /></div>
              </div>
            ) : (
              tableData.map((item, idx) => {
                return (
                  <TableItem
                  className={className}
                    dataFor={dataFor}
                    AdminLatestSignUp={AdminLatestSignUp}
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
                  className="bg-white leading-8 "
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


      <div className="flex justify-end items-center">
        <Pagination
          totalPages={Math.ceil(data.length / maxPageSize)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
