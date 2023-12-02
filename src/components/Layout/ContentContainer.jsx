import React from "react";

const ContentContainer = (props) => {
  return (
    <>
      <div
        className={`w-[${props.containerWidth}] mr-[${props.containerMarginRight}] ml-[${props.containerMarginLeft}] mt-[${props.containerMarginTop}]`}
      >
        <div className={``}>Heading</div>
        <div className={`${props.contentMarginTop}`}>{props.content}</div>
      </div>
    </>
  );
};

export default ContentContainer;
