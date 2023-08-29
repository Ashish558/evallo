import React from "react";
import styles from "../style.module.css";
import cancelIcon from "../../../../assets/YIcons/cutIcon.svg";
import dot from "../../../../assets/YIcons/dotIcon.svg";
const SPFrame2 = () => {
  return (
    <div>
      {" "}
      <div className="flex mt-7 justify-between gap-5">
        <div className="flex-1 h-[230px] gap-7 flex flex-col">
          <div  className="flex-1  flex justify-between">
            <p className=" text-sm text-[#26435F] font-semibold">
            hours tutored
              <span className=" text-[#FFA28D] text-2xl block">90</span>
            </p>
            <p className=" text-sm text-[#26435F] font-semibold">
            no. of sessions
              <span className=" text-[#FFA28D] text-2xl block">90</span>
            </p>
          </div>
          <div  className="flex-1  flex justify-between">
            <p className=" text-sm text-[#26435F] font-semibold">
            # of practice tests
              <span className=" text-[#FFA28D] text-2xl block">90</span>
            </p>
            <p className=" text-sm text-[#26435F] font-semibold">
            Join date
              <span className=" text-[#FFA28D] text-2xl block">90</span>
            </p>
          </div>
        </div>
        <div className="flex-1 h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">
            Official SAT® scores
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md items-center overflow-y-auto custom-scroller">
            {[1, 2, 3, 4, 5, 7, 8, 8, 9, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(
              (it) => {
                return (
                  <div className="beforeDot  p-2  flex-1 flex  w-full">
                    <img
                      src={dot}
                      className="inline-block !w-2 !h-2 mt-2"
                      alt="dot"
                    />
                    <div className="mx-2 flex flex-col text-xs">
                      <p className="text-[#517CA8]">February 05, 2023</p>

                      <p>
                        <span className="text-[#24A3D9]">C1450</span>
                        <span className="text-[#517CA8]">| V700 M750</span>
                      </p>
                    </div>
                    <img
                      src={cancelIcon}
                      className="absolute right-3 inline-block float-right !w-3 !h-3"
                      alt="cancelIcon"
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="flex-1 h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">
            Official ACT® scores
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md items-center overflow-y-auto custom-scroller">
            {[1, 2, 3, 4, 5, 7, 8, 8, 9, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(
              (it) => {
                return (
                  <div className="beforeDot  p-2  flex-1 flex  w-full">
                    <img
                      src={dot}
                      className="inline-block !w-2 !h-2 mt-2"
                      alt="dot"
                    />
                    <div className="mx-2 flex flex-col text-xs">
                      <p className="text-[#517CA8]">February 05, 2023</p>

                      <p>
                        <span className="text-[#24A3D9]">C1450</span>
                        <span className="text-[#517CA8]">| V700 M750</span>
                      </p>
                    </div>
                    <img
                      src={cancelIcon}
                      className="absolute right-3 inline-block float-right !w-3 !h-3"
                      alt="cancelIcon"
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="flex-1 h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">
            Baseline Scores
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md items-center overflow-y-auto custom-scroller">
            {[1, 2, 3, 4, 5, 7, 8, 8, 9, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(
              (it) => {
                return (
                  <div className="beforeDot  p-2  flex-1 flex  w-full">
                    <img
                      src={dot}
                      className="inline-block !w-2 !h-2 mt-2"
                      alt="dot"
                    />
                    <div className="mx-2 flex flex-col text-xs">
                      <p className="text-[#517CA8]">February 05, 2023</p>

                      <p>
                        <span className="text-[#24A3D9]">C1450</span>
                        <span className="text-[#517CA8]">| V700 M750</span>
                      </p>
                    </div>
                    <img
                      src={cancelIcon}
                      className="absolute right-3 inline-block float-right !w-3 !h-3"
                      alt="cancelIcon"
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPFrame2;
