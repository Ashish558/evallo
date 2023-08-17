import React, { useEffect, useState } from "react";

import { TableHeader } from "./TableHeader";
import TableItem from "./tableItem";
import ReactPaginate from "react-paginate";
import { TableHeaderNew } from "./tableHeaderObj";
import Pagination from "../../pages/SuperadminDashboard/Table/Pagination";

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
  fetch,
  headerObject,
  extraData,
  isChecked,
  setIsChecked,
  numberChecked,
  setnumberChecked,
}) {
  const [dummy, setDummy] = useState([]);
  const [tableData, setTableData] = useState(
    data.sort(
      (a, b) =>
        a.name?.slice(0, 1).toLowerCase() > b.name?.slice(0, 1).toLowerCase()
    )
  );
  const dataLength = data.length > 30 ? 30 : data.length;
  const [checkedHeader, setcheckedHeader] = useState(isChecked);
  useEffect(() => {
    setcheckedHeaderHandler(isChecked);
  }, [isChecked]);
  useEffect(() => {
    setIsChecked(false);
  }, [currentPage]);
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
    if (hidePagination === true) {
      setTableData(data);
    } else {
      const temp = data.slice(0, maxPageSize);
        setTableData(temp);
    }
  }, [data, maxPageSize, data.length]);

  
  useEffect(() => {
    if (hidePagination === true) return;
    
  }, [currentPage, data]);
  const topcheckedHandler = () => {
    setIsChecked(!isChecked);
  };
  const setcheckedHeaderHandler = (isChecked) => {
    setcheckedHeader(isChecked);
    if (isChecked) {
      setnumberChecked(tableData.length);
    } else setnumberChecked(0);
  };

  return (
    <div className="w-full">
    <div className="overflow-x-auto scrollbar-content  my-7  scroll-m-1 ">

      <table className="table-auto px-[2.5px] mb-3 text-center w-full">
        <thead className="pb-2">
          <tr>
            {tableHeaders.map((item, idx) => {
              return headerObject === true ? (
                <TableHeaderNew
                  checkedHeader={checkedHeader}
                  Handler={topcheckedHandler}
                  header={item}
                  key={idx}
                  dataFor={dataFor}
                />
              ) : (
                <TableHeader key={idx} header={item} dataFor={dataFor} />
                );
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
                numberChecked={numberChecked}
                setnumberChecked={setnumberChecked}
                checkedHeader={checkedHeader}
                fetch={fetch}
                extraData={extraData}
              />
            );
          })}
           {dummy.map((it, iti) => {
            return (
              <tr
                key={iti}
                className="shadow-sm shadow-slate-200 rounded-2xl leading-8 "
              >
                {it.map((d, di) => {
                  return (
                    <td  key={di} className="opacity-0 text-sm px-1 min-w-14 py-3 ">
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
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={
            isCallingApi ? total_pages : Math.ceil(data.length / maxPageSize)
          }
        />
        
      </div>
    </div>
  );
}
