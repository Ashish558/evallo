import React from "react";
import LeftIcon from "../../../assets/Table/left.svg";
import RightIcon from "../../../assets/Table/right.svg";

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  const handleClick = (size) => {
    if (size <= 0 || size > totalPages)
      return false;
    setCurrentPage(size);
  };

  return (
    <div className="flex gap-x-3 items-center">
      <div
        className="p-1 cursor-pointer"
        onClick={() => handleClick(currentPage - 1)}
      >
        <img src={LeftIcon} alt="left" />
      </div>
      <div
        className="p-1 cursor-pointer"
        onClick={() => handleClick(currentPage + 1)}
      >
        <img src={RightIcon} alt="right" />
      </div>
    </div>
  );
}
