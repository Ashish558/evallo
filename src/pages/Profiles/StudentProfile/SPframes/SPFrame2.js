import React, { useEffect, useState } from "react";
import styles from "../style.module.css";
import cancelIcon from "../../../../assets/YIcons/cutIcon.svg";
import dot from "../../../../assets/YIcons/dotIcon.svg";
import EditableText from "../../../../components/EditableText/EditableText";
import { useUpdateUserDetailsMutation } from "../../../../app/services/users";
import act from "../../../../assets/YIcons/Official ACT® scores.svg";
import sat from "../../../../assets/YIcons/Official SAT® scores.svg";
import {
  useLazyGetSessionQuery,
  useLazyGetTotalHoursQuery,
} from "../../../../app/services/session";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../../../utils/utils";
import { getFormattedDateWithSlash } from "../../../../utils/utils";
import { getMonthName } from "../../../../utils/utils";

const SPFrame2 = ({
  userDetail,
  settings,
  editable,
  session_no,
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
  const [getTotalSessions, setGetTotalSessions] = useLazyGetSessionQuery();
  const [totalSessions, setTotalSessions] = useState();
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
        console.log("tutored hours", res);
        if (res?.data) {
          setTotalHours(res?.data?.total_hours);
        }
      });
    }
    getTotalSessions().then((res) => {
      console.log("total sessions", res);
    });
  }, [userId]);
  const dateFormat = settings?.dateFormat || "dd/mm/yyyy";
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
  const formatDate = (value) => {
    const [month, day, year] = value.split("-");
    const monthName = getMonthName(day - 1);
    console.log({
      value: value,
      day: day,
      month: month,
      year: year,
      monthName: monthName,
    });

    const formattedDate =
      `${monthName.substring(0, 3)}` + " " + `${month}` + `,` + `${year}`;
    return formattedDate;
  };

  const formatDate2 = (value) => {
    const [day, month, year] = value.split("-");
    const monthName = getMonthName(month - 1);

    const formattedDate = `${day}` + "/" + `${month}` + `/` + `${year}`;
    return formattedDate;
  };

  return (
    <div>
      {" "}
      <div className="flex mt-0 justify-between w-[1625px] gap-5 design:gap-10">
        <div className="flex-1 h-[200px]  design:h-[230px] gap-7  flex flex-col">
          <div className="flex-1  flex justify-between">
            <p className=" text-[20px] text-[#26435F] font-semibold text-base-20 !font-lexend-deca">
              Hours Tutored
              <span className=" text-[#FFA28D] text-[37.5px] block mt-1 font-semibold !font-lexend-deca">
                {totalHours}
              </span>
            </p>
            <p className=" text-[20px] text-[#26435F] font-semibold text-base-20 !font-lexend-deca">
              No. Of Sessions
              <span className=" text-[#FFA28D] text-[37.5px] block mt-1 font-semibold !font-lexend-deca">
                {session_no}
              </span>
            </p>
          </div>
          <div className="flex-1  flex justify-between items-start ">
            <p className=" text-[20px] text-[#26435F] font-semibold text-base-20 !font-lexend-deca">
              No. of Assignments
              <span className=" text-[#FFA28D] text-[37.5px] block mt-1 !font-lexend-deca">
                {totalTest}
              </span>
            </p>
            <p className=" text-[20px] text-[#26435F] font-semibold text-base-20 w-[165px] text-left !font-lexend-deca">
              Join Date
              <span className=" text-[#FFA28D] text-[25px] block mt-1 !font-lexend-deca">
                {formatDate2(
                  getFormattedDate(userDetail?.createdAt, dateFormat)
                )}
              </span>
            </p>
          </div>
        </div>
        <div className="flex-1 h-[200px] design:h-[230px]">
          <p className="mb-2.5 text-[20px] text-[#26435F] leading-[12.5px] font-semibold flex justify-between items-end">
            Official SAT&reg; Scores
            {/* <span>
              <img
                className="inline-block mb-1  -mt-1 !w-[150px] !h-5 design:!w-[180px] design:h-[30px] mr-2"
                src={sat}
                alt="copy"
              />
            </span> */}
            {(persona === "admin" || persona === "tutor") && (
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
                textClassName="text-sm text-[#517CA8] text-underline"
                className="text-sm my-0 flex justify-end float-right"
              />
            )}
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md its-center overflow-y-auto custom-scroller">
            {userDetail?.satScores?.length > 0 ? (
              userDetail?.satScores?.map((it, idx) => {
                return (
                  <div
                    key={idx}
                    className="beforeDot p-2 flex w-full h-[45.75px]"
                  >
                    <div className="h-full w-3 flex justify-start items-start py-0.5">
                      <img
                        src={dot}
                        className="inline-block !w-2 !h-2"
                        alt="dot"
                      />
                    </div>
                    <div className="mx-2 flex flex-col text-xs text-base-15">
                      <p className="text-[#517CA8] mb-[6.25px]">
                        {it.createdAt
                          ? formatDate(
                              getFormattedDate(it.createdAt, dateFormat)
                            )
                          : "NA"}
                      </p>

                      <p className="">
                        <span className="text-[#24A3D9] font-medium">
                          <span className="font-bold">C</span>{" "}
                          {it?.maths + it?.verbal + " "}
                        </span>
                        <span className="text-[#517CA8]">
                          {" "}
                          | <span className="font-bold">M</span>
                          {it?.maths} <span className="font-bold">V</span>
                          {it?.verbal}
                        </span>
                      </p>
                    </div>
                    <img
                      onClick={() => reduceArr(idx, "satScores", true)}
                      src={cancelIcon}
                      className="absolute right-3 design:!w-5 design:!h-5 inline-block cursor-pointer float-right !w-3 !h-3"
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
          <p className="mb-2.5 text-[20px] text-[#26435F] leading-[12.5px] font-semibold flex justify-between items-end">
            Official ACT&reg; Scores
            {/* <span>
              <img
                className="inline-block -mt-1  !w-[150px] !h-5 mr-2 design:!w-[180px] design:h-[30px] mb-1"
                src={act}
                alt="copy"
              />
            </span> */}
            {(persona === "admin" || persona === "tutor") && (
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
                textClassName="text-sm text-[#517CA8] text-underline"
                className="text-sm my-0 flex justify-end float-right"
              />
            )}
          </p>

          <div className="w-full bg-white relative h-full p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md its-center overflow-y-auto custom-scroller">
            {userDetail?.actScores?.length > 0 ? (
              userDetail?.actScores?.map((it, idx) => {
                return (
                  <div
                    key={idx}
                    className="beforeDot p-2 h-[45.75px] flex w-full"
                  >
                    <div className="h-full w-3 flex justify-start items-start py-0.5">
                      <img
                        src={dot}
                        className="inline-block !w-2 !h-2"
                        alt="dot"
                      />
                    </div>
                    <div className="mx-2 flex flex-col text-xs text-base-15">
                      <p className="text-[#517CA8] mb-[6.25px]">
                        {it.createdAt
                          ? formatDate(
                              getFormattedDate(it.createdAt, dateFormat)
                            )
                          : "NA"}
                      </p>

                      <p className="font-medium">
                        <span className="text-[#24A3D9]">
                          <span className="font-bold">C</span>
                          {it?.english +
                            it?.science +
                            it?.maths +
                            it?.reading +
                            " "}
                        </span>
                        <span className="text-[#517CA8] font-medium">
                          | <span className="font-bold">E</span>
                          {it?.reading} <span className="font-bold">M</span>
                          {it?.english} <span className="font-bold">R</span>
                          {it?.maths} <span className="font-bold">S</span>
                          {it?.science}
                        </span>
                      </p>
                    </div>
                    <img
                      onClick={() => reduceArr(idx, "actScores", true)}
                      src={cancelIcon}
                      className="absolute right-3 w-[18px] h-[18px] cursor-pointer inline-block float-right "
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
          <p className="mb-2.5 text-[20px] text-[#26435F] leading-[12.5px] font-semibold flex justify-between items-end">
            Baseline Scores
            {(persona === "admin" || persona === "tutor") && (
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
                textClassName="text-sm text-[#517CA8] text-underline"
                className="text-sm my-0 flex justify-end pr-9 float-right"
              />
            )}
          </p>

          <div className="w-[341.16px] bg-white relative h-[216.25px]  p-1 flex flex-col gap-1 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] rounded-md its-center overflow-y-auto custom-scroller">
            {userDetail?.baseLineScore ? (
              <>
                <div className="beforeDot  p-2 h-[45.75px] flex  w-full">
                  <div className="h-full w-4 flex justify-start items-start py-0.5">
                    <img
                      src={dot}
                      className="inline-block !w-2 !h-2"
                      alt="dot"
                    />
                  </div>
                  <div className="mx-2 flex flex-col text-xs text-base-15">
                    <p className="text-[#517CA8] mb-[6.25px]">
                      SAT BaseLine Scores
                    </p>

                    <p className="font-medium">
                      <span className="text-[#24A3D9]">
                        <span className="font-bold">C</span>
                        {userDetail?.baseLineScore?.satBaseLineScore?.maths +
                          userDetail?.baseLineScore?.satBaseLineScore?.verbal +
                          " "}
                      </span>
                      <span className="text-[#517CA8]">
                        {"| "} <span className="font-bold">M</span>
                        {
                          userDetail?.baseLineScore?.satBaseLineScore?.maths
                        }{" "}
                        <span className="font-bold">V</span>
                        {userDetail?.baseLineScore?.satBaseLineScore?.verbal}
                      </span>
                    </p>
                  </div>
                  <img
                    src={cancelIcon}
                    className="absolute right-3 w-[18px] h-[18px] cursor-pointer inline-block float-right "
                    alt="cancelIcon"
                  />
                </div>
                <div className="beforeDot  p-2 h-[45.75px] flex  w-full">
                  <div className="h-full w-4 flex justify-start items-start py-0.5">
                    <img
                      src={dot}
                      className="inline-block !w-2 !h-2"
                      alt="dot"
                    />
                  </div>
                  <div className="mx-2 flex flex-col text-xs text-base-15 ">
                    <p className="text-[#517CA8] text-base-15 mb-[6.25px]">
                      ACT BaseLine Scores
                    </p>

                    <p className="font-medium">
                      <span className="text-[#24A3D9]">
                        <span className="font-bold">C</span>
                        {userDetail.baseLineScore?.actBaseLineScore?.english +
                          userDetail.baseLineScore?.actBaseLineScore?.science +
                          userDetail.baseLineScore?.actBaseLineScore?.maths +
                          userDetail.baseLineScore?.actBaseLineScore?.reading +
                          " "}
                      </span>
                      <span className="text-[#517CA8]">
                        {"| "} <span className="font-bold">E</span>
                        {
                          userDetail.baseLineScore?.actBaseLineScore?.english
                        }{" "}
                        <span className="font-bold">M</span>
                        {userDetail.baseLineScore?.actBaseLineScore?.maths}{" "}
                        <span className="font-bold">R</span>
                        {
                          userDetail.baseLineScore?.actBaseLineScore?.reading
                        }{" "}
                        <span className="font-bold">S</span>
                        {userDetail.baseLineScore?.actBaseLineScore?.science}
                      </span>
                    </p>
                  </div>
                  <img
                    src={cancelIcon}
                    className="absolute right-3 w-[18px] cursor-pointer h-[18px] inline-block float-right "
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
