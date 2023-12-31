import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

import { TableHeader } from "./TableHeader";
import TableItem from "./tableItem";
import ReactPaginate from "react-paginate";
import { TableHeaderNew } from "./tableHeaderObj";
import Pagination from "../../pages/SuperadminDashboard/Table/Pagination";

export default function ApiTable({
  noArrow,
  dataFor,
  data,
  tableHeaders,
  maxPageSize,
  handleCheckboxChange,
  onClick,
  hidePagination,
  isTickBoxInsideTableChecked,
  handleAllOrgRefetch,
  setMaxPageSize,
  excludes,
  total_pages,
  isCallingApi,
  currentPage,
  setCurrentPage,
  fetch,
  fromProfile,
  selectedId2,
  setSelectedId2,
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
    if (setcheckedHeaderHandler) setcheckedHeaderHandler(isChecked);
  }, [isChecked]);
  useEffect(() => {
    setIsChecked && setIsChecked(false);
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
    setIsChecked && setIsChecked(!isChecked);
  };
  const setcheckedHeaderHandler = (isChecked) => {
    setcheckedHeader(isChecked);
    if (isChecked && setnumberChecked) {
      setnumberChecked(tableData.length);
    } else setnumberChecked && setnumberChecked(tableData.length);
  };

  return (
    <div className="w-full">
      <div className=" users-table-scrollbar overflow-x-auto scrollbar-content custom-scroller-2 scroll-m-1 ">
        <table className="table-auto px-1 customTable px-[4px] mb-3 text-center w-full">
          <thead className="pb-2">
            <tr>
              {tableHeaders.map((item, idx) => {
                return headerObject === true ? (
                  <React.Fragment key={idx}>
                    <TableHeaderNew
                      noArrow={noArrow}
                      checkedHeader={checkedHeader}
                      Handler={topcheckedHandler}
                      header={item}
                      key={idx}
                      dataFor={dataFor}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment key={idx}>
                    <TableHeader key={idx} header={item} dataFor={dataFor} />
                  </React.Fragment>
                );
              })}
            </tr>
          </thead>
          <tbody className={styles.tBody} >
            {tableData?.length > 0 ? (
              tableData?.map((item, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <TableItem
                      dataFor={dataFor}
                      item={item}
                      selectedId2={selectedId2}
                      setSelectedId2={setSelectedId2}
                      key={idx}
                      excludes={excludes}
                      handleAllOrgRefetch={handleAllOrgRefetch}
                      onClick={onClick}
                      numberChecked={numberChecked}
                      setnumberChecked={setnumberChecked}
                      checkedHeader={checkedHeader}
                      fetch={fetch}
                  
                      extraData={extraData}
                    />
                  </React.Fragment>
                );
              })
            ) : fromProfile && dataFor === "assignedTestsStudents" ? (
              <div className="w-full h-full rounded-md bg-white flex justify-center flex-col text-center items-center">
                <div className="flex flex-col justify-center items-center h-full">
                  <button className="bg-[#38C980] text-white rounded-md p-2 py-1">
                    Add Interests +
                  </button>
                </div>
              </div>
            ) : (
              dataFor === "serviceRates" && (
                <div className="absolute w-[300px]  z-[5000] min-h-[300px] rounded-md bg-white flex justify-center flex-col text-center items-center">
                  <div className="flex-1 w-full flex flex-col justify-center items-start h-full p-4">
                    <button className="bg-[#38C980] text-white rounded-md p-2 py-1 mb-3">
                    + Add Services
                    </button>
                    <p className=" !whitespace-normal !text-left text-[#517CA8]">
                    Currently, there are no services added for your business. To add services, go to “Settings” and click on “Add Service” under the “Manage Services and Topics” heading.
                    </p>
                  </div>
                </div>
              )
            )}

            {dummy.map((it, iti) => {
              return (
                <tr key={iti} className="bg-white  leading-8 ">
                  {it.map((d, di) => {
                    return (
                      <td
                        key={di}
                        className="opacity-0 text-[17.5px] px-1 min-w-14 py-4 "
                      >
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
