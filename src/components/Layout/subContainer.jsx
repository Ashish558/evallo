import React from "react";

const subContainer = (props) => {
  return (
    <div
      className={`w-full flex flex-col justify-center items-center ${
        props.marginTop ? props.marginTop : "mt-0"
      }`}
    >
      {/*  heading and date range inputs */}
      {props.headerVisibility && <div
        className="w-full
       flex justify-between items-center text-[#FFA28D] text-[20px] "
      >
        {props.heading && (
          <div className=" uppercase">{props.headingContent}</div>
        )}

        {props.inputDateRangeVisibility && (
          <div className="text-[#FFA28D] text-[20px] ">
            1 May - May 12, 2023 icn
          </div>
        )}
      </div> }

      {/* content container */}
      <div
        className={`w-full ${
          props.contentMarginTop ? props.contentMarginTop : ""
        } px-[37.5px] py-[32.5px] bg-white flex justify-start items-center rounded-[5px]`}
        style={{
          boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        {props.content}
      </div>
    </div>
  );
};

export default subContainer;
