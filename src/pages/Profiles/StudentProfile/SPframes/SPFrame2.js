import React, { useEffect, useState } from "react";
import styles from "../style.module.css";
import cancelIcon from "../../../../assets/YIcons/cutIcon.svg";
import dot from "../../../../assets/YIcons/dotIcon.svg";
import EditableText from "../../../../components/EditableText/EditableText";
import { useUpdateUserDetailsMutation } from "../../../../app/services/users";
import act from "../../../../assets/YIcons/Official ACT® scores.svg";
import sat from "../../../../assets/YIcons/Official SAT® scores.svg";
import { useLazyGetTotalHoursQuery } from "../../../../app/services/session";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../../../utils/utils";

const SPFrame2 = ({
  userDetail,
  settings,
  editable,
  userId,
  fetchDetails,
  setToEdit,
  toEdit,
  totalTest,
  setSelectedScoreIndex,
}) => {
  const { role: persona } = useSelector((state) => state.user);
  const [updateDetails, updateDetailsResp] = useUpdateUserDetailsMutation();
  const [totalHours, setTotalHours] = useState(0);
  const [getHours, getHoursStatus] = useLazyGetTotalHoursQuery();
  const reduceArr = (id, key, update) => {
    //  //console.log({toEdit})
    let temp = [];
    if (!toEdit[key] || !toEdit[key][key]) return;
    temp = [...toEdit[key][key]];
    temp = temp?.filter((it, idd) => idd !== id);

    if (update) {
      handleSubmit(key, temp);
    }
  };
  useEffect(() => {
    if (userId) {
      getHours(userId).then((res) => {
        console.log("tutored hours",res)
        if(res?.data){
          setTotalHours(res?.data?.total_hours)
        }
      });
    }
  }, [userId]);
  const  dateFormat  = settings?.dateFormat||"dd/mm/yyyy";
  const handleSubmit = (key, e) => {
    //e.preventDefault();
    // setLoading(true);
    let reqBody = { [key]: e };
    // delete reqBody["active"];
    //  //console.log({reqBody,id:userId});
    const userDetailSave = (reqBody) => {
      // //console.log({reqBody,userDetail});
      // return
      updateDetails({ id: userId, fields: reqBody }).then((res) => {
        //  //console.log(res);
        //setLoading(false);
        fetchDetails(true, true);
        // handleClose()
      });
    };

    userDetailSave(reqBody);
  };


  return (
    <div>
      {" "}
      <div className="flex mt-0 justify-between gap-5 design:gap-10">
        <div className="flex-1 h-[200px] design:h-[230px] gap-7  flex flex-col">
          <div className="flex-1  flex justify-between">
            <p className=" text-sm text-[#26435F] font-semibold text-base-20">
              Hours Tutored
              <span className=" text-[#FFA28D] text-2xl block mt-1">{totalHours}</span>
            </p>
            <p className=" text-sm text-[#26435F] font-semibold text-base-20">
              No. Of Sessions
              <span className=" text-[#FFA28D] text-2xl block mt-1">90</span>
            </p>
          </div>
          <div className="flex-1  flex justify-between">
            <p className=" text-sm text-[#26435F] font-semibold text-base-20">
              No. of Assignments
              <span className=" text-[#FFA28D] text-2xl block mt-1">
                {totalTest}
              </span>
            </p>
            <p className=" text-sm text-[#26435F] font-semibold text-base-20 w-[122px] text-left">
              Join Date
              <span className=" text-[#FFA28D] text-xl block mt-1">
                {/* {new Date(userDetail?.createdAt).toLocaleDateString()} */}
                {getFormattedDate(userDetail?.createdAt, dateFormat)}
              </span>
            </p>
          </div>
        </div>
        <div className="flex-1 h-[200px] design:h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">
            <span>
              <img
                className="inline-block mb-1  -mt-1 !w-[150px] !h-5 design:!w-[180px] design:h-[30px] mr-2"
                src={sat}
                alt="copy"
              />
            </span>
            {persona === "admin" && (
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
            )}
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md its-center overflow-y-auto custom-scroller">
            {userDetail?.satScores?.length > 0 ? (
              userDetail?.satScores?.map((it, idx) => {
                return (
                  <div
                    key={idx}
                    className="beforeDot  p-2  flex-1 flex  w-full"
                  >
                    <img
                      src={dot}
                      className="inline-block !w-2 !h-2 mt-2"
                      alt="dot"
                    />
                    <div className="mx-2 flex flex-col text-xs text-base-15">
                      <p className="text-[#517CA8]">
                        {it.createdAt
                          ? getFormattedDate(it.createdAt, dateFormat)
                          : "NA"}
                      </p>

                      <p className="font-bold">
                        <span className="text-[#24A3D9]">
                          C{it?.maths + it?.verbal+" "}
                        </span>
                        <span className="text-[#517CA8]">
                          | M{it?.maths} V{it?.verbal}
                        </span>
                      </p>
                    </div>
                    <img
                      onClick={() => reduceArr(idx, "satScores", true)}
                      src={cancelIcon}
                      className="absolute right-3 design:!w-5 design:!h-5 inline-block float-right !w-3 !h-3"
                      alt="cancelIcon"
                    />
                  </div>
                );
              })
            ) : (
              <div
                id="sscores"
                className="w-full h-full rounded-md bg-white flex justify-center flex-col text-center items-center"
              >
                <div className="flex flex-col justify-center items-center h-full"></div>{" "}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 h-[200px] design:h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">
            <span>
              <img
                className="inline-block -mt-1  !w-[150px] !h-5 mr-2 design:!w-[180px] design:h-[30px] mb-1"
                src={act}
                alt="copy"
              />
            </span>

            {persona === "admin" && (
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
            )}
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md its-center overflow-y-auto custom-scroller">
            {userDetail?.actScores?.length > 0 ? (
              userDetail?.actScores?.map((it, idx) => {
                return (
                  <div
                    key={idx}
                    className="beforeDot  p-2  flex-1 flex  w-full"
                  >
                    <img
                      src={dot}
                      className="inline-block !w-2 !h-2 mt-2"
                      alt="dot"
                    />
                    <div className="mx-2 flex flex-col text-xs text-base-15">
                      <p className="text-[#517CA8]">
                        {it.createdAt
                          ? getFormattedDate(it.createdAt, dateFormat)
                          : "NA"}
                      </p>

                      <p className="font-bold">
                        <span className="text-[#24A3D9]">
                          C{it?.english + it?.science + it?.maths + it?.reading+" "}
                        </span>
                        <span className="text-[#517CA8]">
                          | E{it?.english} R{it?.reading} M{it?.maths} S
                          {it?.science}
                        </span>
                      </p>
                    </div>
                    <img
                      onClick={() => reduceArr(idx, "actScores", true)}
                      src={cancelIcon}
                      className="absolute right-3 design:!w-5 design:!h-5 inline-block float-right !w-3 !h-3"
                      alt="cancelIcon"
                    />
                  </div>
                );
              })
            ) : (
              <div
                id="sscores"
                className="w-full h-full rounded-md bg-white flex justify-center flex-col text-center items-center"
              >
                <div className="flex flex-col justify-center items-center h-full"></div>{" "}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 h-[200px] design:h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
            Baseline Scores
            {persona == "admin" && (
              <EditableText
                editable={editable}
                onClick={() =>
                  setToEdit({
                    ...toEdit,
                    baseLineScore: {
                      ...toEdit.baseLineScore,
                      active: true,
                    },
                  })
                }
                text="edit"
                textClassName="text-sm text-[#517CA8] text-underline  "
                className="text-sm my-0 flex justify-end   float-right"
              />
            )}
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md its-center overflow-y-auto custom-scroller">
            {userDetail?.baseLineScore ? (
              <>
                <div className="beforeDot  p-2  flex-1 flex  w-full">
                  <img
                    src={dot}
                    className="inline-block !w-2 !h-2 mt-2"
                    alt="dot"
                  />
                  <div className="mx-2 flex flex-col text-xs text-base-15">
                    <p className="text-[#517CA8]">SAT BaseLine Scores</p>

                    <p  className="font-bold">
                      <span className="text-[#24A3D9]">
                        C
                        {userDetail?.baseLineScore?.satBaseLineScore?.maths +
                          userDetail?.baseLineScore?.satBaseLineScore?.verbal+" "}
                      </span>
                      <span className="text-[#517CA8]">
                        | M{userDetail?.baseLineScore?.satBaseLineScore?.maths}{" "}
                        V{userDetail?.baseLineScore?.satBaseLineScore?.verbal}
                      </span>
                    </p>
                  </div>
                  <img
                    src={cancelIcon}
                    className="absolute right-3 design:!w-5 design:!h-5 inline-block float-right !w-3 !h-3"
                    alt="cancelIcon"
                  />
                </div>
                <div className="beforeDot  p-2  flex-1 flex  w-full">
                  <img
                    src={dot}
                    className="inline-block !w-2 !h-2 mt-2"
                    alt="dot"
                  />
                  <div className="mx-2 flex flex-col text-xs text-base-15">
                    <p className="text-[#517CA8] text-base-15">
                      ACT BaseLine Scores
                    </p>

                    <p className="font-bold">
                      <span className="text-[#24A3D9]">
                        C
                        {userDetail.baseLineScore?.actBaseLineScore?.english +
                          userDetail.baseLineScore?.actBaseLineScore?.science +
                          userDetail.baseLineScore?.actBaseLineScore?.maths +
                          userDetail.baseLineScore?.actBaseLineScore?.reading+" "}
                      </span>
                      <span className="text-[#517CA8]">
                        | E{userDetail.baseLineScore?.actBaseLineScore?.english}{" "}
                        R{userDetail.baseLineScore?.actBaseLineScore?.reading} M
                        {userDetail.baseLineScore?.actBaseLineScore?.maths} S
                        {userDetail.baseLineScore?.actBaseLineScore?.science}
                      </span>
                    </p>
                  </div>
                  <img
                    src={cancelIcon}
                    className="absolute right-3 design:!w-5 design:!h-5 inline-block float-right !w-3 !h-3"
                    alt="cancelIcon"
                  />
                </div>
              </>
            ) : (
              <div
                id="sscores"
                className="w-full h-full rounded-md bg-white flex justify-center flex-col text-center items-center"
              >
                <div className="flex flex-col justify-center items-center h-full"></div>{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPFrame2;
