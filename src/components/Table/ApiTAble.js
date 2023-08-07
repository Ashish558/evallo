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
    <div>
      <table className="table-auto mb-3 text-center w-full">
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
        </tbody>
      </table>

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
