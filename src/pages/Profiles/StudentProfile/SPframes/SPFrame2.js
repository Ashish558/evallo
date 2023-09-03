import React from "react";
import styles from "../style.module.css";
import cancelIcon from "../../../../assets/YIcons/cutIcon.svg";
import dot from "../../../../assets/YIcons/dotIcon.svg";
import EditableText from "../../../../components/EditableText/EditableText";
const SPFrame2 = ({
  userDetail,
  settings,
  editable,
  setToEdit,
  toEdit,
  setSelectedScoreIndex,
}) => {
 // console.log("frame2", settings, userDetail);
  return (
    <div>
      {" "}
      <div className="flex mt-7 justify-between gap-5">
        <div className="flex-1 h-[230px] gap-7 flex flex-col">
          <div className="flex-1  flex justify-between">
            <p className=" text-sm text-[#26435F] font-semibold">
              hours tutored
              <span className=" text-[#FFA28D] text-2xl block">90</span>
            </p>
            <p className=" text-sm text-[#26435F] font-semibold">
              no. of sessions
              <span className=" text-[#FFA28D] text-2xl block">90</span>
            </p>
          </div>
          <div className="flex-1  flex justify-between">
            <p className=" text-sm text-[#26435F] font-semibold">
              # of practice tests
              <span className=" text-[#FFA28D] text-2xl block">90</span>
            </p>
            <p className=" text-sm text-[#26435F] font-semibold">
              Join date
              <span className=" text-[#FFA28D] text-xl block">
                {new Date(userDetail?.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
        <div className="flex-1 h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">
            Official SAT® scores
            <EditableText
              editable={editable}
              onClick={() => {
                setSelectedScoreIndex(2);
                setToEdit({
                  ...toEdit,
                  satScores: {
                    ...toEdit.satScores,
                    active: true,
                  },
                });
              }}
              text="edit"
              textClassName="text-sm text-[#517CA8] text-underline  "
              className="text-sm my-0 flex justify-end   float-right"
            />
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md items-center overflow-y-auto custom-scroller">
            {userDetail?.satScores?.map((it, idx) => {
              return (
                <div key={idx} className="beforeDot  p-2  flex-1 flex  w-full">
                  <img
                    src={dot}
                    className="inline-block !w-2 !h-2 mt-2"
                    alt="dot"
                  />
                  <div className="mx-2 flex flex-col text-xs">
                    <p className="text-[#517CA8]">February 05, 2023</p>

                    <p>
                      <span className="text-[#24A3D9]">
                        C{it?.maths + it?.verbal}
                      </span>
                      <span className="text-[#517CA8]">
                        | M{it?.maths} V{it?.verbal}
                      </span>
                    </p>
                  </div>
                  <img
                    src={cancelIcon}
                    className="absolute right-3 inline-block float-right !w-3 !h-3"
                    alt="cancelIcon"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">
            Official ACT® scores
            <EditableText
              editable={editable}
              onClick={() => {
                setSelectedScoreIndex(1);
                setToEdit({
                  ...toEdit,
                  actScores: {
                    ...toEdit.actScores,
                    active: true,
                  },
                });
              }}
              text="edit"
              textClassName="text-sm text-[#517CA8] text-underline  "
              className="text-sm my-0 flex justify-end   float-right"
            />
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md items-center overflow-y-auto custom-scroller">
            {userDetail?.actScores?.map((it, idx) => {
              return (
                <div key={idx} className="beforeDot  p-2  flex-1 flex  w-full">
                  <img
                    src={dot}
                    className="inline-block !w-2 !h-2 mt-2"
                    alt="dot"
                  />
                  <div className="mx-2 flex flex-col text-xs">
                    <p className="text-[#517CA8]">February 05, 2023</p>

                    <p>
                      <span className="text-[#24A3D9]">
                        C{it?.english + it?.science + it?.maths + it?.reading}
                      </span>
                      <span className="text-[#517CA8]">
                        | E{it?.english} R{it?.reading} M{it?.maths} S
                        {it?.science}
                      </span>
                    </p>
                  </div>
                  <img
                    src={cancelIcon}
                    className="absolute right-3 inline-block float-right !w-3 !h-3"
                    alt="cancelIcon"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1 h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">
            Baseline Scores
            <EditableText
              editable={editable}
              onClick={() =>
                setToEdit({
                  ...toEdit,
                  subscriptionCode: {
                    ...toEdit.subscriptionCode,
                    active: true,
                  },
                })
              }
              text="edit"
              textClassName="text-sm text-[#517CA8] text-underline  "
              className="text-sm my-0 flex justify-end   float-right"
            />
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md items-center overflow-y-auto custom-scroller">
            {userDetail?.acScores?.map((it, idx) => {
              return (
                <div key={idx} className="beforeDot  p-2  flex-1 flex  w-full">
                  <img
                    src={dot}
                    className="inline-block !w-2 !h-2 mt-2"
                    alt="dot"
                  />
                  <div className="mx-2 flex flex-col text-xs">
                    <p className="text-[#517CA8]">February 05, 2023</p>

                    <p>
                      <span className="text-[#24A3D9]">
                        C{it?.english + it?.science + it?.maths + it?.reading}
                      </span>
                      <span className="text-[#517CA8]">
                        | E{it?.english} R{it?.reading} M{it?.maths} S
                        {it?.science}
                      </span>
                    </p>
                  </div>
                  <img
                    src={cancelIcon}
                    className="absolute right-3 inline-block float-right !w-3 !h-3"
                    alt="cancelIcon"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPFrame2;
