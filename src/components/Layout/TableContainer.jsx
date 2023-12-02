import React from "react";

const TableContainer = (props) => {
  return (
    <>
      
      {/* tablecontnt */}
      <div>TableContainer</div>
      
      {/* table pagination */}
      {props.pagination && (
        <div className="w-full font-medium mt-[7.17px]">pagination</div>
      )}
    </>
  );
};

export default TableContianer;
