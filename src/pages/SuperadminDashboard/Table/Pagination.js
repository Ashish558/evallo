import React from "react";
import LeftIcon from "../../../assets/Table/left.svg";
import RightIcon from "../../../assets/Table/right.svg";
import dots from "../../../assets/icons/Group 20719.svg";
export default function Pagination({
  
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  const handleClick = (size) => {
    if (size <= 0 || size > totalPages) return false;
    setCurrentPage(size);
  };

  return (
    <>
      <div className="flex gap-x-3 justify-end items-center">
        <div
          className="p-1 cursor-pointer text-[#26435F] text-[12.5px]"
          onClick={() => handleClick(currentPage - 1)}
        >
          Prev
        </div>
        <div
          className="p-1 cursor-pointer  text-[#FFA28D] text-[12.5px]"
          onClick={() => handleClick(currentPage)}
        >
          {currentPage < 10 ? "0" : ""}
          {currentPage}
        </div>
        {currentPage + 1 <= totalPages ? (
          <div
            className="p-1 cursor-pointer text-[#B7C2CB]"
            onClick={() => handleClick(currentPage + 1)}
          >
            {currentPage + 1 < 10 ? "0" : ""}
            {currentPage + 1}
          </div>
        ) : (
          ""
        )}
        {currentPage + 1 <= totalPages ? (
          <div
            className="p-1 cursor-pointer mt-2 scale-150 text-[#B7C2CB]"
            onClick={() => handleClick(currentPage + 1)}
          >
            <img src={dots} alt="pagination dots" />
          </div>
        ) : (
          ""
        )}

        {currentPage !== totalPages && totalPages !== 0 ? (
          <div
            className="p-1 cursor-pointer  text-[#B7C2CB]"
            onClick={() => handleClick(totalPages)}
          >
            {totalPages < 10 ? "0" : ""}
            {totalPages}
          </div>
        ) : (
          ""
        )}

        <div
          className="p-1 cursor-pointer text-[#26435F] text-[12.5px]"
          onClick={() => handleClick(currentPage + 1)}
        >
          Next
        </div>
      </div>
    </>
  );
}
