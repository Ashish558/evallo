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
import { useNavigate } from "react-router-dom";
export default function Table(props) {
  const navigate = useNavigate();
  const {
    noArrow,
    dataFor,
    persona,
    isChecked,
    selectedId2,
    testtype,
    extratableitem,
    setSelectedId2,
    data,
    tableHeaders,
    maxPageSize,
    onClick,
    hidePagination,
    current_usertype,
    setMaxPageSize,
    excludes,
    total_pages,
    awsLink,
    handleAllOrgRefetch,
    isCallingApi,
    headerObject,
    extraData,
    changePageAfterUpdate,
    isTickBoxInsideTableChecked,
    handleCheckboxChange,
    loading,
    AdminLatestSignUp,
    headerWidth,
    belowBoxLink,
    belowBox,
    belowBoxHeight,
    belowBoxText,
    belowBoxIcon,
    noScrollbar,
    dummyRowStarClients,
    setAllAssignedTests,
    setFilteredTests
  } = props;
  const [dummy, setDummy] = useState([]);
  const [tableData, setTableData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const dataLength = data?.length > 30 ? 30 : data?.length;
  const [sorted, setSorted] = useState(false);
  useEffect(() => {
    let arr = [];
    let noOfkeys;
    if (headerObject) noOfkeys = Object.keys(tableHeaders)?.length;
    else noOfkeys = tableHeaders?.length;
    arr.length = noOfkeys;
    for (let i = 0; i < maxPageSize - tableData?.length; i++) {
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
      const temp = data?.slice(0, maxPageSize);

      setTableData(temp);
      setSorted(temp);
      setCurrentPage(1);
    }
  }, [data, maxPageSize, data?.length]);

  const sorting = () => {};

  useEffect(() => {
    if (hidePagination === true) return;
    const temp = data?.slice(
      (currentPage - 1) * maxPageSize,
      (currentPage - 1) * maxPageSize + maxPageSize
    );
    setTableData(temp);
  }, [currentPage, data]);

  if (isCallingApi) return <ApiTable noArrow={noArrow} {...props} />;

  return (
    <div className="w-full">
      <div
        className={`  ${
          noScrollbar
            ? ` lg:overflow-x-auto scrollbar-content custom-scroller-2 scroll-m-1 ${styles.noOverflow}`
            : "overflow-x-auto scrollbar-content custom-scroller-2 scroll-m-1"
        }  p-[2px]  `}
      >
        <table className="bg-white customTable mb-3 text-center w-full whitespace-nowrap">
          <thead className="pb-2 whitespace-nowrap bg-[#26435f]">
            <tr className=" whitespace-nowrap bg-[#26435f]">
              {tableHeaders.map((item, idx) => {
                return headerObject === true ? (
                  <React.Fragment key={idx}>
                    <TableHeaderNew
                      noArrow={noArrow}
                      header={item}
                      dataFor={dataFor}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment key={idx}>
                    <TableHeader
                      noArrow={noArrow}
                      key={idx}
                      header={item}
                      onClick={sorting}
                      setSorted={setSorted}
                      dataFor={dataFor}
                      headerWidth={headerWidth}
                    />
                  </React.Fragment>
                );
              })}
            </tr>
          </thead>
          <tbody className=" whitespace-nowrap">
            {loading ? (
              <div
                className={`absolute w-full min-h-[100px] flex justify-center items-center`}
              >
                <div>
                  <Loader size="medium" />
                </div>
              </div>
            ) : (
              tableData?.map((item, idx) => {
                return AdminLatestSignUp ? (
                  <React.Fragment key={idx}>
                    <LatestSignUpTableItem
                      dataFor={dataFor}
                      selectedId2={selectedId2}
                      setSelectedId2={setSelectedId2}
                      item={item}
                      key={idx}
                      excludes={excludes}
                      onClick={onClick}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment key={idx}>
                    <TableItem
                      persona={persona}
                      testtype={testtype}
                      extratableitem={extratableitem}
                      index={idx}
                      dataFor={dataFor}
                      selectedId2={selectedId2}
                      handleAllOrgRefetch={handleAllOrgRefetch}
                      setSelectedId2={setSelectedId2}
                      item={item}
                      key={idx}
                      excludes={excludes}
                      onClick={onClick}
                      awsLink={awsLink}
                      setAllAssignedTests={setAllAssignedTests}
                      setFilteredTests={setFilteredTests}
                    />
                  </React.Fragment>
                );
              })
            )}
            {!belowBox &&
              dummy.map((it, iti) => {
                return (
                  <tr
                    key={iti}
                    className="bg-white leading-8 shadow-[0px_0px_2px_rgba(0,0,0,0.25)] text-[17.5px] "
                  >
                    {it.map((d, di) => {
                      return (
                        <td
                          key={di}
                          className="opacity-0 text-[17.5px] px-[10px] min-w-14 py-4 "
                        >
                          {d}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            {/* {console.log(dummyRowStarClients)} */}
            {dummyRowStarClients &&
              dummyRowStarClients.map((it, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white leading-8 shadow-[0px_0px_2px_rgba(0,0,0,0.25)] text-[17.5px] "
                  >
                    <td className="opacity-0 text-[17.5px] px-[10px] min-w-14 py-4 ">
                      {it.service}
                    </td>
                    <td className="opacity-0 text-[17.5px] px-[10px] min-w-14 py-4 ">
                      {it.actively_using}
                    </td>
                    <td className="opacity-0 text-[17.5px] px-[10px] min-w-14 py-4 ">
                      {it.total_used}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
       
      </div>
      {belowBox && (
          <div
            className={`${belowBoxHeight} bg-white mt-[6px] rounded-5 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] flex items-center justify-center w-full`}
          >
            <button
              onClick={() => navigate(`/${belowBoxLink}`)}
              className="inline-block rounded-[5.33px] bg-[#FFA28D] text-[#FFF] font-semibold py-[10px] px-[15.5px] text-base"
            >
              {belowBoxText}
              <img className="inline-block pl-2" src={belowBoxIcon} alt="" />
            </button>
          </div>
        )}
      {!hidePagination ? (
        <div className="flex justify-between px-1 items-center">
          <p className="text-[#517CA8] text-xs">
            Showing {tableData?.length} of {data?.length}
          </p>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={
              isCallingApi ? total_pages : Math.ceil(data?.length / maxPageSize)
            }
          />
        </div>
      ) : (
        <div
          className={`flex grid-cols- justify-center items-center ${
            loading ? "mt-7" : ""
          } `}
        >
          <aside></aside>
          {!hidePagination && (
            <ReactPaginate
              className="table-pagination-container flex justify-center mt-5"
              pageClassName={`flex justify-center items-center w-[38.12px] h-[38.12px] border border-primary rounded-full mr-5 cursor-pointer
            ${"text-primary"}`}
              activeClassName={`${styles["active-pagination"]}`}
              breakLabel="..."
              onPageChange={(val) => setCurrentPage(val.selected + 1)}
              pageRangeDisplayed={3}
              pageCount={
                isCallingApi
                  ? total_pages
                  : Math.ceil(data?.length / maxPageSize)
              }
              previousClassName="hidden"
              nextClassName="hidden"
              renderOnZeroPageCount={null}
              pageLinkClassName="w-full h-full flex justify-center items-center"
            />
          )}
        </div>
      )}
    </div>
  );
}
