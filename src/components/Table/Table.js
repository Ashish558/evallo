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
import { useSelector } from "react-redux";
export default function Table(props) {
  const navigate = useNavigate();
  const {
    noArrow,
    dataFor,
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
    setMaxPageSize,
    excludes,
    total_pages,
    handleAllOrgRefetch,
    isCallingApi,
    headerObject,
    fromProfile,
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
  } = props;
  const [dummy, setDummy] = useState([]);
  const [tableData, setTableData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const { role: persona } = useSelector((state) => state.user);

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
        <table className="bg-white  customTable mb-3 text-center w-full whitespace-nowrap !min-h-[400px]">
          <thead className="pb-2 whitespace-nowrap">
            <tr className=" whitespace-nowrap">
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
            ) : tableData && tableData?.length > 0 ? (
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
                    />
                  </React.Fragment>
                );
              })
            ) : fromProfile && dataFor === "assignedTestsStudents" ? (
              <div id="stests" className="absolute w-full  z-[5000] min-h-[300px] rounded-md bg-white flex justify-center flex-col text-center items-center">
                <div className="flex-1 w-full flex flex-col justify-center items-center h-full">
                  {persona === "admin" || persona === "tutor" ? (
                    <button className="bg-[#38C980] text-white rounded-md p-2 py-1">
                      Create New Assignment +
                    </button>
                  ) : (
                    <div className="w-[70%] mx-auto   flex flex-col items-start">
                      <button className="bg-[#FF7979] text-white rounded-md p-2 py-1">
                        No Assignments Yet
                      </button>
                      <p className=" !whitespace-normal !text-left text-[#517CA8]">
                        This student has not been given any assignments yet.
                        Once an assignment is given, the student will be able to
                        start it and view detailed score reports through this
                        table.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : dataFor === "tutorFeedback" ? (
              <div id="sfeed2" className="absolute w-[41%]  z-[5000] min-h-[300px] rounded-md bg-white flex justify-center flex-col text-center items-center">
                <div className="flex-1 w-full flex flex-col justify-center items-start h-full p-4">
                  <button className="bg-[#FF7979] text-white rounded-md p-2 py-1 mb-3">
                    No Feedback Received
                  </button>
                  <p className=" !whitespace-normal !text-left text-[#517CA8]">
                    This tutor has not received any feedback yet. This table
                    will populate after at least one student provides their
                    feedback rating for the tutor after a session with them.
                  </p>
                </div>
              </div>
            ) :  dataFor === "serviceRates" && (
              <div className="absolute w-[320px]  z-[5000] min-h-[300px] rounded-md bg-white flex justify-center flex-col text-center items-center">
                <div className="flex-1 w-full flex flex-col justify-center items-center h-full p-4">
                  <button className="bg-[#38C980] text-white rounded-md p-2 py-1 mb-3">
                  + Add Services
                  </button>
                  <p className=" !whitespace-normal !text-center text-[#517CA8]">
                  Currently, there are no services added for your business. To add services, go to “Settings” and click on “Add Service” under the “Manage Services and Topics” heading.
                  </p>
                </div>
              </div>
            
            )}
            {tableData?.length > 0 &&
              !belowBox &&
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
            className="inline-block rounded-[5.33px] bg-[#38C980] text-[#FFF] font-semibold py-[10px] px-[15.5px] text-base"
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
