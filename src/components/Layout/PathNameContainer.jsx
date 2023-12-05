import React from "react";

const PathNameContainer = (props) => {
  return (
    <div className="w-full flex justify-start items-center text-[#24A3D9] text-[20px] font-semibold">
      {props.path}
    </div>
  );
};

export default PathNameContainer;
