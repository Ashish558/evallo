import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMonthName } from "../../utils/utils";

import UploadIcon from "../../assets/assignedTests/upload.svg";
import DownloadIcon from "../../assets/icons/download.png";
import SuccessIcon from "../../assets/assignedTests/success_green.svg";
import FailIcon from "../../assets/assignedTests/fail_red.svg";
import YellowIcon from "../../assets/assignedTests/yellow.svg";
import LightBlueIcon from "../../assets/icons/Test Statusred.svg";
import GreenIcon from "../../assets/assignedTests/green.svg";
import editIcon3 from "../../assets/YIcons/material-symbols_edit-outline.svg";
import TrashIcon from "../../assets/icons/ic_outline-delete.svg";
import TrashIcon2 from "../../assets/icons/trash-blue.svg";
import AddIcon from "../../assets/icons/plus_colored.svg";
import DeleteIcon from "../../assets/icons/delete_logo.svg";
import DeleteIconAllOrgs from "../../assets/icons/blue_delete.svg";
import DeleteTutorIcon from "../../assets/icons/delete-tutor.svg";
import InputSelect from "../InputSelect/InputSelect";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import {
  useLazyGetTutorDetailsQuery,
  useLazyGetUserDetailQuery,
  usePostTutorDetailsMutation,
  useUpdateTutorDetailsMutation,
  useUpdateUserDetailsMutation,
  useUpdateUserFieldsMutation,
} from "../../app/services/users";
import { useSelector } from "react-redux";
import { useLazyGetTestResponseQuery } from "../../app/services/test";
import { checkTest, getFormattedDate, getScoreStr } from "../../utils/utils";
import InputField from "../InputField/inputField";
import SCheckbox from "../CCheckbox/SCheckbox";
import Modal from "../Modal/Modal";
import { useDeleteAdminMutation } from "../../app/services/superAdmin";

export default function TableItem({
  item,
  dataFor,
  awsLink,
  extratableitem,
  index,
  handleAllOrgRefetch,
  onClick,
  excludes,
  fetch,
  checkedHeader,
  extraData,
  selectedId2,
  setSelectedId2,
  numberChecked,
  setnumberChecked,
  testtype,
  setAllAssignedTests,
  setFilteredTests,
  setAllTestsForStudentTest,
  setfilteredTestsForStudentTest,
}) {
  const [dateFormat, setDateFormat] = useState("dd/mm/yy");

  const [score, setScore] = useState("-");
  const navigate = useNavigate();
  const [fetchSettings, settingsResp] = useLazyGetSettingsQuery();
  const [updateFields, updateFieldsResp] = useUpdateUserFieldsMutation();
  const [getUserDetail, getUserDetailResp] = useLazyGetUserDetailQuery();
  const [getTutorDetail, getTutorDetailResp] = useLazyGetTutorDetailsQuery();
  const [updateUserDetail, updateUserDetailResp] =
    useUpdateUserDetailsMutation();
  const [updateTutorDetail, updateTutorDetailResp] =
    useUpdateTutorDetailsMutation();
  const [postTutorDetails, postTutorDetailsResp] =
    usePostTutorDetailsMutation();
  const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery();

  const { role: persona } = useSelector((state) => state.user);
  const { organization: organization2 } = useSelector(
    (state) => state.organization
  );
  const [userDetail, setUserDetail] = useState({});
  const [leadStatus, setLeadStatus] = useState("");
  const [tutorStatus, setTutorStatus] = useState("");

  const [settings, setSettings] = useState({
    leadStatus: [],
  });

  useEffect(() => {
    if (organization2 && organization2?.settings) {
      setDateFormat(organization2?.settings?.dateFormat);
    }
  }, [organization2]);

  useEffect(() => {
    if (item?.userType === "tutor") setTutorStatus(item?.tutorStatus);
  }, [item]);
  useEffect(() => {
    if (dataFor === "assignedTestsStudents") {
      let params = {};
      let url = `/api/test/getresponse/${item?.assignedTestId}`;
      if (persona !== "student") {
        url = `/api/test/admin/getresponse/${item?.assignedTestId}`;
      }
      if (item?.isCompleted === true) {
        getTestResponse({ url, params: params }).then((res) => {
          if (res.error) {
            //console.log("resp err", res.error);
            return;
          }

          let responseData = res?.data?.data?.response;
          let score = getScoreStr(
            responseData.testType,
            responseData.score,
            responseData.subjects,
            responseData.subjects.length
          );

          setScore(`${score.cumulative} ${score.right}`);

          setAllTestsForStudentTest((list) => {
            if (list === undefined || list === null || list.length === 0)
              return list;
            const newList = [...list];
            newList.find(
              (i) => i.assignedTestId === item.assignedTestId
            ).scores = score;
            return newList;
          });

          setfilteredTestsForStudentTest((list) => {
            if (list === undefined || list === null || list.length === 0)
              return list;
            const newList = [...list];
            newList.find(
              (i) => i.assignedTestId === item.assignedTestId
            ).scores = score;
            return newList;
          });
        });
      }
    }
  }, [dataFor, item]);

  useEffect(() => {
    if (dataFor === "assignedTests") {
      let url = `/api/test/admin/getresponse/${item.assignedTestId}`;
      let params = { userId: item.studentId };
      if (item.status === "completed") {
        getTestResponse({ url, params: params }).then((res) => {
          if (res.error) {
            //console.log("resp err", res.error);
            return;
          }

          let responseData = res?.data?.data?.response;
          let score = getScoreStr(
            responseData.testType,
            responseData.score,
            responseData.subjects,
            responseData.subjects.length
          );

          setScore(`${score.cumulative},${score.right}`);

          setAllAssignedTests((list) => {
            if (list === undefined || list === null || list.length === 0)
              return list;
            if (list === undefined || list === null || list.length === 0)
              return list;
            const newList = [...list];
            newList.find(
              (i) => i.assignedTestId === item.assignedTestId
            ).scores = score;
            newList.find(
              (i) => i.assignedTestId === item.assignedTestId
            ).scores = score;
            return newList;
          });

          setFilteredTests((list) => {
            if (list === undefined || list === null || list.length === 0)
              return list;
            if (list === undefined || list === null || list.length === 0)
              return list;
            const newList = [...list];
            newList.find(
              (i) => i.assignedTestId === item.assignedTestId
            ).scores = score;
            newList.find(
              (i) => i.assignedTestId === item.assignedTestId
            ).scores = score;
            return newList;
          });
        });
      }
    }
  }, [dataFor, item]);

  useEffect(() => {
    fetchSettings().then((res) => {
      setSettings(res.data.data.setting);
    });
  }, []);

  const handlestatusChange = (field) => {
    if (item.userType === "parent" || item.userType === "student") {
      return;
    }
    updateFields({ id: item._id, fields: field }).then((res) => {
      if (res.error) {
        return; //console.log("error updating");
      }
      fetch && fetch(field, item._id);
      // console.log("update res", item?._id, field, res.data);
    });
  };

  const [deleteAdmin, setDeleteAdmin] = useDeleteAdminMutation();
  const [deleteAdminModalActive, setDeleteAdminModalActive] = useState(false);
  const [deleteSelectLoading, setDeleteSelectLoading] = useState(false);
  const handleDeleteAdmin = () => {
    setDeleteSelectLoading(true);
    deleteAdmin({ id: item?.associatedOrg?._id }).then((res) => {
      setDeleteSelectLoading(false);
      if (res?.data) {
        setDeleteAdminModalActive(false);
        alert("Successfully deleted Admin!");
        handleAllOrgRefetch();
      } else if (res?.error) {
        alert("Error deleting Admin!");
      }
      // console.log(res)
    });
  };
  const handleChange = (field) => {
    if (item.userType === "parent" || item.userType === "student") {
      updateUserDetail({ fields: field, id: item._id }).then((res) => {
        // console.log("lead", { res })
        fetch && fetch(field, item._id);
      });
    } else if (item.userType === "tutor") {
      if (Object.keys(userDetail).length === 0) {
        postTutorDetails({ fields: field, id: item._id }).then((res) => {
          fetch && fetch(field, item._id);
        });
      } else {
        updateTutorDetail({ fields: field, id: item._id }).then((res) => {
          fetch && fetch(field, item._id);
        });
      }
    }
  };

  const returnStatus = (status) => {
    return status === "completed" ? (
      <img className="first:mr-2 w-[22px] h-[22px] " src={GreenIcon} />
    ) : status === "started" ? (
      <img className="first:mr-2 w-[22px] h-[22px]" src={YellowIcon} />
    ) : status === "notStarted" ? (
      <img className="first:mr-2 w-[22px] h-[22px]" src={LightBlueIcon} />
    ) : status === 3 ? (
      <img className="first:mr-2 w-[22px] h-[22px]" src={LightBlueIcon} />
    ) : (
      <></>
    );
  };
  const handlePdfNavigate = () => {
    if (item.pdfLink) {
      window.open(item.pdfLink);
    } else {
      alert("PDF doesnt exist");
    }
  };

  useEffect(() => {
    if (dataFor === "allUsers") {
      if (item.role === "tutor") {
        getTutorDetail({ id: item._id }).then((resp) => {
          let status = "-";
          if (resp?.data?.data?.details) {
            status = resp.data.data.details?.leadStatus;
            // setLeadStatus(status);
            setTutorStatus(resp.data.data.details?.tutorStatus);
          }
        });
      } else {
        getUserDetail({ id: item._id }).then((resp) => {
          let status = "-";
          if (resp?.data?.data?.userdetails) {
            status = resp.data.data.userdetails.leadStatus;
            if (item.userType === "parent" || item.userType === "student")
              setLeadStatus(status);
            setTutorStatus(resp.data.data.details?.tutorStatus);
          }
        });
      }
    }
  }, [item]);
  const [isChecked, setIsChecked] = useState(false);
  // const handleCheckboxChange = () => {
  //   setIsChecked(!isChecked);
  //   let fl = isChecked ? 1 : -1
  //   setnumberChecked && setnumberChecked(numberChecked - fl)
  // };

  const timestamp = item?.createdAt;
  const date = new Date(timestamp);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  //  format monthName date, year
  const formatDate = (value) => {
    return value;
    let [year, month, day] = value.split("-");
    if (dateFormat === "dd/mm/yy") {
      [day, month, year] = value.split("-");
    } else if (dateFormat === "mm/dd/yy") {
      [month, day, year] = value.split("-");
    } else [year, month, day] = value.split("-");
    const monthName = getMonthName(month - 1);
    console.log({
      value: value,
      day: day,
      month: month,
      year: year,
      monthName: monthName,
    });

    let formattedDate = `${monthName}` + " " + `${year}` + `,` + `${day}`;

    return formattedDate;
  };

  const getPhone = (val) => {
    //console.log(item)
    //console.log(val)
  };

  const handleSelect = (item2, key) => {
    if (selectedId2 && setSelectedId2) {
      let temp = selectedId2;
      let bool = temp?.find((itt) => itt[key] === item2[key]);
      if (bool) {
        temp = temp?.filter((idd) => {
          return idd[key] !== item2[key];
        });
      } else {
        temp?.push(item2);
      }
      setSelectedId2([...temp]);
    }
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (selectedId2) {
      let temp = selectedId2;
      let key = "assignedTestId";
      if (dataFor === "allUsers") key = "_id";
      let bool = temp?.find((itt) => itt[key] === item[key]);
      setIsChecked(bool ? true : false);
    }
  }, [selectedId2]);
  const iconForReview = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="31"
      height="30"
      viewBox="0 0 31 30"
      fill="none"
    >
      <g clip-path="url(#clip0_19652_18826)">
        <path
          d="M30.4722 28.4039C30.6578 28.5894 30.7505 28.8092 30.7505 29.0631C30.7505 29.317 30.6578 29.5367 30.4722 29.7223C30.2867 29.9078 30.067 30.0006 29.813 30.0006C29.5591 30.0006 29.3394 29.9078 29.1539 29.7223L17.6548 18.2379C16.7271 19.0191 15.7017 19.6099 14.5787 20.0103C13.4556 20.4107 12.2837 20.6158 11.063 20.6256C10.1158 20.6256 9.20269 20.5035 8.32379 20.2594C7.44488 20.0152 6.62457 19.6685 5.86285 19.2193C5.10113 18.7701 4.40289 18.233 3.76812 17.608C3.13336 16.983 2.59625 16.2896 2.15679 15.5279C1.71734 14.7662 1.37066 13.941 1.11675 13.0523C0.862847 12.1636 0.740777 11.2506 0.750543 10.3131C0.750543 9.36579 0.872613 8.4527 1.11675 7.57379C1.36089 6.69489 1.70757 5.87457 2.15679 5.11285C2.60601 4.35113 3.14312 3.65289 3.76812 3.01812C4.39312 2.38336 5.08648 1.84625 5.8482 1.40679C6.60992 0.967341 7.43511 0.620661 8.32379 0.366754C9.21246 0.112847 10.1255 -0.0092231 11.063 0.000542535C12.0103 0.000542535 12.9234 0.122613 13.8023 0.366754C14.6812 0.610895 15.5015 0.957575 16.2632 1.40679C17.025 1.85601 17.7232 2.39312 18.358 3.01812C18.9927 3.64313 19.5298 4.33649 19.9693 5.09821C20.4087 5.85993 20.7554 6.68512 21.0093 7.57379C21.2632 8.46247 21.3853 9.37556 21.3755 10.3131C21.3755 11.524 21.1754 12.691 20.775 13.814C20.3746 14.9371 19.7789 15.9674 18.9879 16.9049L30.4722 28.4039ZM12.0005 15.0006H10.1255V16.8756H12.0005V15.0006ZM12.1177 13.1256C12.1177 12.8326 12.2105 12.5689 12.3961 12.3345C12.5816 12.1002 12.8111 11.8707 13.0845 11.6461C13.358 11.4215 13.6607 11.1871 13.9927 10.9429C14.3248 10.6988 14.6226 10.4254 14.8863 10.1226C15.15 9.81989 15.3843 9.47809 15.5894 9.09723C15.7945 8.71637 15.8873 8.26715 15.8677 7.74958C15.8677 7.11481 15.7261 6.54352 15.4429 6.03571C15.1597 5.52789 14.7935 5.09821 14.3443 4.74664C13.8951 4.39508 13.3824 4.12164 12.8062 3.92633C12.23 3.73102 11.649 3.63336 11.063 3.63336C10.4869 3.63336 9.91558 3.71148 9.34918 3.86774C8.78277 4.02399 8.26519 4.26813 7.79644 4.60016C7.32769 4.93219 6.9566 5.33258 6.68316 5.80133C6.40972 6.27008 6.26812 6.83649 6.25836 7.50055H8.36773C8.36773 7.17829 8.45562 6.90485 8.6314 6.68024C8.80719 6.45563 9.03668 6.27496 9.31988 6.13825C9.60308 6.00153 9.89605 5.89899 10.1988 5.83063C10.5015 5.76227 10.7896 5.73297 11.063 5.74274C11.3462 5.74274 11.6441 5.78668 11.9566 5.87457C12.2691 5.96246 12.5621 6.08942 12.8355 6.25543C13.1089 6.42145 13.3287 6.62653 13.4947 6.87067C13.6607 7.11481 13.7486 7.40778 13.7584 7.74958C13.7584 8.04255 13.6656 8.30622 13.48 8.54059C13.2945 8.77497 13.065 9.00446 12.7916 9.22907C12.5181 9.45368 12.2154 9.68806 11.8834 9.9322C11.5513 10.1763 11.2535 10.4498 10.9898 10.7525C10.7261 11.0552 10.4918 11.397 10.2867 11.7779C10.0816 12.1588 9.98883 12.608 10.0084 13.1256H12.1177Z"
          fill="#FFC700"
        />
      </g>
      <defs>
        <clipPath id="clip0_19652_18826">
          <rect
            width="30"
            height="30"
            fill="white"
            transform="translate(0.75 0.00390625)"
          />
        </clipPath>
      </defs>
    </svg>
  );
  return (
    <>
      {dataFor === "tutorFeedback" && (
        <>
          <tr className=" text-[17.5px] font-medium">
            <td className="pb-[15px] pt-[15px] px-[10px]">
              {item?.studentName}
            </td>
            <td className="pb-[15px] pt-[15px] px-[10px]">{item?.service}</td>
            <td className="pb-[15px] pt-[15px] px-[10px]">{item?.rating}</td>

            <td className="pb-[15px] pt-[15px] px-[10px]">
              {getFormattedDate(formattedDate, dateFormat)}
            </td>
          </tr>
        </>
      )}
      {dataFor === "popularServices" && (
        <>
          <tr className=" text-[17.5px] font-medium">
            <td className="!py-[18.5px] px-[10px] w-[205.6px] !pl-[31.25px] text-left">
              {item?.service?.length > 15 ? (
                <div className="flex flex-col">
                  <p>{item.service?.slice(0, 15)}</p>
                  <p>{item?.service?.slice(15, item?.service?.length)}</p>
                </div>
              ) : (
                item?.service
              )}
            </td>
            <td className="!py-[18.5px] px-[10px] w-[178.5px] !pr-[31.5px] text-center">
              {item?.actively_using}
            </td>
            <td className="!py-[18.5px] px-[10px] w-[147.13px] !pr-[36.13px] text-center">
              {item?.total_used}
            </td>
            <td className="!py-[18.5px] px-[10px] w-[207.13px] !pr-[31.13px] text-center">
              {item?.scheduled_hours}
            </td>
            <td className="!py-[18.5px] px-[10px] w-[211.11px] !pr-[31.11px] text-center">
              {item?.completed_hours}
            </td>
            <td className="!py-[18.5px] px-[10px] w-[174.37px] !pr-[31.37px] text-center">
              {item?.percent_of_business}
            </td>
          </tr>
        </>
      )}
      {dataFor === "serviceRates" && (
        <>
          <tr className=" text-[17.5px] font-medium">
            <td className="py-4 px-[10px]">{item?.service}</td>

            <td className="py-4 px-[10px]">
              <div className="text-[#517CA8] font-semibold text-base-20 mr-[2px] inline-block">
                $
              </div>
              {item?.price}
            </td>
          </tr>
        </>
      )}
      {dataFor === "tutorPerformance" && (
        <>
          <tr className=" text-[17.5px] font-medium">
            <td className="py-4 px-[10px]">{item.tutor_name}</td>

            <td className="py-4 px-[10px]">{item.tutor_status}</td>
            <td className="py-4 px-[10px]">
              {item.avg_hourly_rate ? item.avg_hourly_rate : "-"}
            </td>
            <td className="py-4 px-[10px]">{item.no_of_referrals}</td>
            <td className="py-4 px-[10px]">{item.no_of_hours_completed}</td>
            <td className="py-4 px-[10px]">{item.no_of_hours_scheduled}</td>
            <td className="py-4 px-[10px]">{item.no_of_hours_cancelled}</td>
            <td className="py-4 px-[10px]">{item.no_of_hours_missed}</td>
            <td className="py-4 px-[10px]">
              {item.avg_sat_improvement ? item.avg_sat_improvement : "-"}
            </td>
            <td className="py-4 px-[10px]">
              {item.avg_act_improvement ? item.avg_act_improvement : "-"}
            </td>
            <td className="py-4 px-[10px]">{item.no_of_active_students}</td>
            <td className="py-4 px-[10px]">{item.no_of_total_students}</td>
            <td className="py-4 px-[10px]">
              {item.avg_hourly_rate ? item.avg_hourly_rate : "-"}
            </td>
          </tr>
        </>
      )}

      {dataFor === "allUsers" && (
        <tr className="odd:bg-white h-full leading-8">
          <td className=" text-[17.5px] min-w-14 h-full text-left  ">
            <div className="w-full flex justify-center items-center cursor-pointer ">
              <div className="w-full h-full flex items-center justify-start px-4">
                {dataFor === "allUsers" ? (
                  <div className="">
                    <SCheckbox
                      checked={isChecked}
                      stopM={true}
                      onChange={() => handleSelect(item, "_id")}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div
                  onClick={() => onClick.redirect(item)}
                  className="capitalize whitespace-nowrap overflow-hidden text-ellipsis text-left"
                >
                  {item.name}
                </div>
              </div>
            </div>
          </td>
          <td className=" text-[17.5px] px-1 min-w-14  capitalize text-left">
            <div className="my-[6px]">{item?.userType}</div>
          </td>
          <td className=" text-[17.5px] px-1  min-w-14 text-left">
            <div className="my-[6px]">
              {item?.email?.toLowerCase().length > 15
                ? item?.email?.toLowerCase().slice(0, 15) + "..."
                : item?.email?.toLowerCase()}
            </div>
          </td>

          <td className=" text-[17.5px] !pl-6 pr-1  min-w-14  text-left capitalize">
            <div className="my-[6px]">
              {item?.phoneCode}
              {item?.phone}
            </div>
          </td>
          <td className=" text-[17.5px] px-1  min-w-14  capitalize flex justify-center">
            <div className="my-[6px] whitespace-nowrap overflow-hidden text-ellipsis w-[100px] ">
              {item.assignedTutor?.length > 0
                ? item.assignedTutor?.map((id, idx) => {
                    const name = extraData.find((item) => item._id === id);
                    if (name === undefined) return "l";
                    return `${name.value} ${
                      idx + 1 < item.assignedTutor.length ? "," : ""
                    } `;
                  })
                : "-"}
            </div>
          </td>
          <td className=" text-[17.5px] px-1  min-w-14 ">
            <div className="my-[6px]">
              {item?.specialization?.map((specialization, idx) => {
                return `${specialization}${
                  idx + 1 === item.specialization.length ? "" : ","
                }`;
              })}
            </div>
          </td>
          <td className=" text-[17.5px] px-1  min-w-14 ">
            <div className="my-[6px]">
              <InputSelect
                disabled={
                  item?.userType === "parent" || item?.userType === "student"
                    ? false
                    : true
                }
                tableDropdown={true}
                value={
                  organization2?.settings?.leadStatus?.includes(leadStatus)
                    ? leadStatus
                    : "-"
                }
                placeholderClass="text-base-17-5"
                optionData={organization2?.settings?.leadStatus}
                inputContainerClassName={`min-w-[100px] pt-0 pb-0 pr-2 pl-0 text-center capitalize `}
                optionClassName="text-[17.5px]"
                labelClassname="hidden"
                onChange={(val) => handleChange({ leadStatus: val })}
                // customPadding
              />
            </div>
          </td>
          <td className=" text-[17.5px] px-1  min-w-14 ">
            <InputSelect
              disabled={item?.userType === "tutor" ? false : true}
              tableDropdown={true}
              value={
                organization2?.settings?.tutorStatus?.includes(tutorStatus)
                  ? tutorStatus
                  : "-"
              }
              optionData={organization2?.settings?.tutorStatus}
              inputContainerClassName="min-w-[100px] pt-0 pb-0 pr-2 pl-0 text-center capitalize text-base-17-5"
              optionClassName="text-[17.5px] text-base-17-5"
              labelClassname="hidden"
              onChange={(val) => handlestatusChange({ tutorStatus: val })}
            />
          </td>

          <td className=" text-[17.5px] px-1  min-w-14  text-[#507CA8]">
            <div className="my-[6px] capitalize">{item?.accountStatus}</div>
          </td>
          <td className=" text-[17.5px] px-1 min-w-14  text-[#507CA8]">
            <div className="my-[6px] capitalize">
              {formatDate(getFormattedDate(item.createdAt, dateFormat))}
            </div>
          </td>

          {false && (
            <td className=" px-1 min-w-14 ">
              {item.userType !== "admin" ? (
                <div className=" flex items-center justify-center">
                  <img
                    src={TrashIcon}
                    className="cursor-pointer"
                    alt=""
                    onClick={() => onClick.handleDelete(item)}
                  />
                </div>
              ) : (
                ""
              )}
            </td>
          )}
        </tr>
      )}
      {dataFor === "allUsersSuperAdmin" && (
        <tr className="odd:bg-white even:!shadow-[0px_0px_3.00000476837158px_0px_#00000040]  leading-8">
          <td className="font-normal text-[17.5px] px-1  min-w-14   text-center">
            <span
              className="inline-block cursor-pointer"
              onClick={() => onClick.redirect(item)}
            >
              {item.name}
            </span>
          </td>
          <td className="font-normal text-[17.5px] !pl-6 pr-1 min-w-14 text-left">
            <div className="">{item.email}</div>
          </td>
          <td className="font-normal text-[17.5px] px-1  min-w-14 ">
            <div className="">{item.userType}</div>
          </td>
          <td className="font-normal text-[17.5px] px-1  min-w-14 ">
            {item?.lastLogin ? (
              <div className="">
                {/* {new Date(item?.lastLogin).toDateString().split(' ')[1] }. {new Date(item?.lastLogin).getDate() }, {new Date(item?.lastLogin).getFullYear()} */}
                {getFormattedDate(item.lastLogin, dateFormat)}
              </div>
            ) : (
              "None"
            )}
          </td>
          <td className="font-normal text-[17.5px] px-1  min-w-14 ">
            <div className="cursor-pointer">
              <span
                className="font-['Inter']"
                style={{ textDecoration: "underline" }}
              >
                edit
              </span>
            </div>
          </td>
          <td className="font-normal">
            <div className="">
              <button
                className="rounded-[5.33px] bg-[rgba(38,67,95,0.23)] text-[#517CA8] px-[17px]  py-1  text-base-18 font-['Inter']"
                onClick={() => onClick.handleResetPassword(item.email)}
              >
                Reset
              </button>
            </div>
          </td>

          <td className=" px-1 min-w-14 py-4">
            {item.userType !== "admin" &&
            item.userType !== "superAdmin" &&
            item.userType !== "superadmin" ? (
              <div className=" flex items-center justify-start">
                <img
                  src={TrashIcon2}
                  className="cursor-pointer"
                  onClick={() => onClick.handleDelete(item)}
                  alt="TrashIcon"
                />
              </div>
            ) : (
              ""
            )}
          </td>
        </tr>
      )}

      {dataFor === "allUsersManager" && (
        <tr className="odd:bg-white  leading-8">
          <td className="font-medium text-[17.5px] px-1  min-w-14 py-4  text-left">
            <span
              className="inline-block cursor-pointer pl-4"
              onClick={() => onClick.redirect(item)}
            >
              {item.name}
            </span>
          </td>
          <td className="font-medium text-[17.5px] px-1 min-w-14 py-4">
            <div className="my-[6px]">{item.userType}</div>
          </td>
          <td className="font-medium text-[17.5px] px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.email}</div>
          </td>
          <td className="font-medium text-[17.5px] px-1  min-w-14 py-4">
            <div className="my-[6px]">
              {item.lastLogin
                ? getFormattedDate(item.lastLogin, dateFormat)
                : "-"}
            </div>
          </td>
        </tr>
      )}
      {dataFor === "assignedTests" && (
        <tr
          className="text-[17.5px] "
          style={{
            borderRadius: "5px",
            background: "#FFF",
            boxShadow: "0px 0px 2.5px 0px rgba(0, 0, 0, 0.25)",
            paddingTop: "30px",
            paddingBottom: "30px",
          }}
        >
          <td className="px-1 font-medium  min-w-14  text-left flex items-center  pb-[14px] pt-4">
            <span className="inline-block cursor-pointer pl-[30px]">
              <div className="flex ">
                {dataFor === "assignedTests" ? (
                  <SCheckbox
                    checked={isChecked}
                    stopM={true}
                    onChange={() => handleSelect(item, "assignedTestId")}
                  />
                ) : (
                  ""
                )}
              </div>
            </span>
            <span
              className="inline-block cursor-pointer pl-4"
              onClick={() => onClick.handleNavigate("student", item.studentId)}
            >
              {item.studentName}
            </span>
          </td>
          <td
            className={`font-medium px-1 py-3 text-left ${
              persona === "admin" ? "pl-[28px]" : ""
            }`}
          >
            {item.testName}
          </td>
          <td
            className={`text-[17.5px] px-1  min-w-14 py-3  ${
              persona === "admin" ? "pl-[28px] text-left" : "text-center"
            }`}
          >
            <span onClick={() => onClick.redirect(item)} className="">
              {getFormattedDate(item.assignedOn, dateFormat).replace(/-/g, "/")}
            </span>
          </td>
          <td
            className={`text-[17.5px] px-1 min-w-14 py-3 text-center ${
              persona === "admin" ? "text-left" : "text-center"
            } `}
          >
            <span
              onClick={() => onClick.redirect(item)}
              className={`${
                new Date() > new Date(item?.dueDate) ? "text-danger" : ""
              }`}
            >
              {getFormattedDate(item.dueDate, dateFormat).replace(/-/g, "/")}
            </span>
          </td>

          <td
            className={`font-medium px-1  min-w-14 py-3 ${
              persona === "admin" ? "text-left pl-[28px]" : "text-center"
            }`}
          >
            {item.assignedBy}
          </td>
          <td className="font-medium px-1 min-w-14 py-3">
            <div className={`flex items-center no-wrap justify-center`}>
              {returnStatus(item.status)}
            </div>
          </td>
          <td
            className={`font-medium px-1  min-w-14 py-3 ${
              persona === "admin" ? "text-left pl-[28px]" : "text-center"
            } `}
          >
            {item.duration === "-" ? "Unlimited" : item.duration}
          </td>
          <td className="font-medium px-1 min-w-14 py-3">
            <div className="text-center">
              {item.status === "completed" ? (
                <>
                  <span className="text-[#24A3D9] font-bold">
                    {score?.split(",")[0]}
                  </span>{" "}
                  <span>{score?.split(",")[1]}</span>
                </>
              ) : (
                "-"
              )}
            </div>
          </td>

          <td className=" px-1  min-w-14 py-3">
            <button
              className={`text-[15px] flex justify-center text-base-15 px-1 h-[31px]  rounded-5  items-center leading-none w-[100px] text-center text-white ${
                item.status == "completed"
                  ? "bg-[#38C980]  "
                  : `${
                      item.status == "started"
                        ? "bg-[#FFCE84]"
                        : "bg-[rgba(38,67,95,0.20)] pointer-events-none"
                    }`
              }`}
              onClick={() =>
                navigate(
                  `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId}`
                )
              }
            >
              <span classname="inline-block"> View Report</span>
            </button>
          </td>
          {/* <td className="font-medium px-1 min-w-14 py-4">
            <img
              src={DownloadIcon}
              className="w-[30px] cursor-pointer"
              onClick={() => handlePdfNavigate()}
            />
          </td>

          <td className="font-medium px-1 min-w-14 py-4">

            <div
              className="bg-[#FF5555] rounded-full relative w-5 h-5 text-white text-21 cursor-pointer"
              onClick={() => onClick.handleDelete(item)}
            >
              <span className="absolute top-[-7px] left-[3.5px]">×</span>
            </div>
          </td> */}
        </tr>
      )}

      {dataFor === "tests" && (
        <tr className="odd:bg-white text-[17.5px]  leading-7">
          {Object.keys(item).map((key, i) =>
            key === "Accuracy" ? (
              <td key={i} className="font-medium px-1  min-w-14 py-4">
                <div className="flex items-center justify-center">
                  <img
                    src={item[key] > 80 ? SuccessIcon : FailIcon}
                    className="flex"
                    alt=""
                  />
                </div>
              </td>
            ) : (
              <td className="font-medium px-1  min-w-14 py-4">{item[key]}</td>
            )
          )}
          <td className="font-medium px-1 min-w-14 py-4 flex justify-center items-center">
            <button className="flex items-center">
              <span className="inline-block mr-3 text-textBlue">
                Upload Answer
              </span>
              <img src={UploadIcon} alt="" />
            </button>
          </td>
        </tr>
      )}
      {dataFor === "assignedStudents" && (
        <tr className="odd:bg-white text-[17.5px] leading-7">
          {MapDataAssignedStudents(item, "assignedStudents", excludes, onClick)}
        </tr>
      )}
      {dataFor === "studentTestsReport" && (
        <tr
          style={{
            boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)",
            borderRadius: "5px",
            minHeight: "50px",
          }}
          className={`text-[17.5px] leading-7 ${
            !item.isCorrect ? "!bg-[#FF79791A]/[0.05]" : "odd:bg-white  "
          } pb-[11.8px] pt-[13.05px]`}
        >
          {MapData(item, dataFor, ["review"])}
          <td
            className={`${
              !item.isCorrect ? "!bg-[#FF79791A]/[0.05]" : "odd:bg-white  "
            }`}
          >
            <div
              className={`flex justify-center items-center pr-[54px] py-[10px] min-h-[50px]`}
            >
              {item?.review?.length === 0 ? "" : iconForReview}
            </div>
          </td>
        </tr>
      )}
      {dataFor === "studentTestsReportSmall" && (
        <tr
          className={`text-[17.5px]  leading-7 ${
            !item.isCorrect ? "bg-[#e02b1d]/5" : "odd:bg-white  "
          } `}
        >
          {MapData(item)}
        </tr>
      )}
      {dataFor === "studentTestsAnswers" && (
        <tr className="odd:bg-white text-[17.5px]  leading-7">
          {MapData(item)}
          <td className="font-medium px-1 min-w-14 py-4 flex justify-center items-center">
            <button className="flex items-center">
              <span className="inline-block mr-3 text-textBlue">
                Upload Answer
              </span>
              <img src={UploadIcon} />
            </button>
          </td>
        </tr>
      )}
      {dataFor === "assignedTestsStudents" && (
        <tr
          style={{ boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)" }}
          className="rounded-[5px] bg-white text-[17.5px] leading-7"
        >
          {Object.keys(item).map((key, i) =>
            excludes.includes(key) ? (
              <React.Fragment key={i}></React.Fragment>
            ) : key == "testtype" ? null : (
              <td
                key={i}
                className={`font-medium pl-[10px]  min-w-14 ${
                  key === "testName" ? "!pt-[7px] !pb-[8px]" : "!py-[12px]"
                } first:rounded-l-[5px] last:rounded-r-[5px]`}
              >
                {key === "status" ? (
                  <div className="flex justify-center">
                    {returnStatus(item.status)}
                  </div>
                ) : key === "scores" ? (
                  <div
                    className={`cursor-pointer ${
                      persona == "student"
                        ? "w-[100%] flex justify-center items-center"
                        : ""
                    } text-center`}
                    onClick={() =>
                      item.isCompleted === true &&
                      navigate(
                        `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId._id}`
                      )
                    }
                  >
                    {item.isCompleted === true ? score : "-"}
                  </div>
                ) : key === "dueDate" ? (
                  <span
                    className={` ${
                      new Date(item[key]) < new Date()
                        ? "text-[#FF7979] font-semibold"
                        : ""
                    }`}
                  >
                    {" "}
                    {getFormattedDate(item[key], dateFormat)}
                  </span>
                ) : key === "createdAt" ? (
                  getFormattedDate(item[key], dateFormat)
                ) : key === "assignedOn" ? (
                  getFormattedDate(item[key], dateFormat)
                ) : key === "testName" ? (
                  <>
                    <div className="flex flex-row items-center ">
                      <div className="min-w-[20px] ">
                        {!item?.testtype?.includes("DSAT") &&
                        persona == "student" &&
                        dataFor == "assignedTestsStudents" ? (
                          <img
                            className="cursor-pointer w-[35px] h-[35px]"
                            src={DownloadIcon}
                            onClick={() => window.open(`${item.pdfLink}`)}
                            alt="download"
                          />
                        ) : (
                          <div className=" w-[35px] h-[35px]"></div>
                        )}{" "}
                      </div>{" "}
                      {persona == "parent" && (
                        <div>
                          <img
                            src={DownloadIcon}
                            alt="DownloadIcon"
                            className={`w-[30px] cursor-pointer`}
                            onClick={() => handlePdfNavigate()}
                          />
                        </div>
                      )}
                      <span className="pl-[35px]">{item[key]}</span>
                    </div>
                  </>
                ) : key == "duration" ? (
                  item[key]
                ) : null}
              </td>
            )
          )}
          {persona === "admin" ? null : (
            <td className="font-medium px-1  min-w-14 py-4">
              <div className="flex items-center">
                {persona == "student" || (
                  <img
                    src={DownloadIcon}
                    alt="DownloadIcon"
                    className={`${
                      persona == "parent" ? "hidden" : "block"
                    } w-[30px] cursor-pointer`}
                    onClick={() => handlePdfNavigate()}
                  />
                )}
                {persona === "parent" ? (
                  <>
                    {item.isCompleted ? (
                      <button
                        className="px-2.5 py-1.8 bg-[#38C980] rounded-5 flex items-center leading-none  text-white ml-4 w-[120px] h-[31px] justify-center"
                        onClick={() =>
                          navigate(
                            `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId._id}`
                          )
                        }
                      >
                        Report
                      </button>
                    ) : item.status == "started" ? (
                      <button
                        className="px-2.5 py-1.8  rounded-5 flex items-center leading-none bg-[#FFCE84] text-white ml-4 w-[120px] h-[31px] justify-center"
                        onClick={() => {
                          const indexx = testtype.findIndex(
                            (obj) => obj.testId === item.testId
                          );
                          testtype[indexx].testtype == "DSAT"
                            ? navigate(
                                `/testpage/${item.testId}/${item.assignedTestId}`
                              )
                            : navigate(
                                `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId._id}`
                              );
                        }}
                      >
                        StarASAted
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-2.5 py-1.8 rounded-5 bg-[#D4D9DF] flex items-center leading-none  text-white ml-4 w-[120px] h-[31px] justify-center"
                        onClick={() => {
                          const indexx = testtype.findIndex(
                            (obj) => obj.testId === item.testId
                          );
                          testtype[indexx].testtype == "DSAT"
                            ? navigate(
                                `/testpage/${item.testId}/${item.assignedTestId}`
                              )
                            : navigate(
                                `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId._id}`
                              );
                        }}
                      >
                        Not Started
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {item.isCompleted ? (
                      <button
                        className="px-2.5 py-1.8 bg-[#38C980] rounded-5 flex items-center leading-none  text-white ml-4 w-[120px] h-[31px] justify-center"
                        onClick={() =>
                          navigate(
                            `/assigned-tests/${item.testId}/${item.assignedTestId}/report/`
                          )
                        }
                      >
                        Report
                      </button>
                    ) : item.isStarted ? (
                      <button
                        className="px-2.5 py-1.8  rounded-5 flex items-center leading-none bg-[#FFCE84] text-white ml-4 w-[120px] h-[31px] justify-center"
                        onClick={() => {
                          const indexx = testtype.findIndex(
                            (obj) => obj.testId === item.testId
                          );
                          testtype[indexx]?.testtype == "DSAT"
                            ? navigate(
                                `/testpage/${item.testId}/${item.assignedTestId}`
                              )
                            : navigate(
                                `/all-tests/start-section/${item.testId}/${item.assignedTestId}`
                              );
                        }}
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        className="px-2.5 py-1.8 rounded-5 bg-[#FF7979] flex items-center leading-none  text-white ml-4 w-[120px] h-[31px] justify-center"
                        onClick={() => {
                          const indexx = testtype.findIndex(
                            (obj) => obj.testId === item.testId
                          );
                          testtype[indexx].testtype == "DSAT"
                            ? navigate(
                                `/testpage/${item.testId}/${item.assignedTestId}`
                              )
                            : navigate(
                                `/all-tests/start-section/${item.testId}/${item.assignedTestId}`
                              );
                        }}
                      >
                        Start
                      </button>
                    )}
                  </>
                )}
              </div>
            </td>
          )}
        </tr>
      )}
      {dataFor === "invoice" && (
        <tr className="bg-white text-[17.5px]   leading-7 mt-[10px]">
          {MapData(item, dataFor, excludes, onClick)}
        </tr>
      )}
      {dataFor === "testsDetailQuestions" &&
        (testtype === "DSAT" || testtype === "DSAT®") && (
          <tr className="bg-white text-[17.5px]   leading-7 mt-[10px]">
            <td className="w-[174px] pl-[27px] pr-[43px] text-[#517CA8] text-[17.5px] font-normal text-center pt-[15px] pb-[13.5px]">
              <div>{item?.QuestionNumber}</div>
            </td>
            <td className="w-[124px] pl-[0] text-[#517CA8] text-[17.5px] font-normal text-left pt-[15px] pb-[13.5px]">
              <div>{item?.QuestionType}</div>
            </td>
            <td className="w-[90px] pl-[0] text-[#517CA8] text-[17.5px] font-normal text-left pt-[15px] pb-[13.5px]">
              <div>{item?.CorrectAnswer}</div>
            </td>

            <td className="w-[110px] pl-[0] pr-[28px] pt-[15px] pb-[13.5px]">
              {item?.QuestionImage === "no" ? (
                ""
              ) : (
                <div className="w-[20px] h-[20px] bg-[#38C980] rounded-full mx-auto"></div>
              )}
            </td>
            <td className="w-[114px] pl-[0] pr-[34px] pt-[15px] pb-[13.5px]">
              {item?.AnswerImage === "no" ? (
                ""
              ) : (
                <div className="w-[20px] h-[20px] bg-[#FFCE84] rounded-full mx-auto"></div>
              )}
            </td>
            <td
              className={`w-[140px] pr-[58px] ${
                extratableitem[item?.QuestionNumber - 1]?.Passage == "Yes"
                  ? "text-[#38C980]"
                  : "text-[#FF7979]"
              } text-[17.5px] font-semibold `}
            >
              {extratableitem[item?.QuestionNumber - 1]?.Passage}
            </td>
            <td className="w-[385px] pr-[43px] text-[#517CA8] text-[17.5px] font-normal text-left max-w-[385px] text-ellipsis pt-[15px] pb-[13.5px]">
              <div className="max-w-[342px] text-ellipsis overflow-hidden">
                {item?.Concepts}
              </div>
            </td>
            <td className="w-[220px] pr-[70.5px] text-[#517CA8] text-[17.5px] font-normal text-left pt-[15px] pb-[13.5px]">
              <div className="max-w-[150px] text-ellipsis overflow-hidden">
                {item?.Strategies}
              </div>
            </td>
            <td className="w-[108px] pr-[28px] text-[#517CA8] text-[17.5px] font-normal text-left">
              <div>{item?.AnswerChoices}</div>
            </td>
            <td className="w-[111.25px] pr-[45.25px] text-[#517CA8] text-[17.5px] font-normal text-left pt-[15px] pb-[13.5px]">
              <div>{item?.scoring ?? "{Scale}"}</div>
            </td>
            <td className="font-medium flex justify-center px-1 min-w-[45px] py-[12.5px] pr-[20px]">
              {!item.editable ? (
                <></>
              ) : (
                <img
                  src={editIcon3}
                  className="cursor-pointer h-[25px] w-[25px]"
                  onClick={() => onClick.handleEditTestClick(item)}
                  alt=""
                />
              )}
            </td>
            {/* {MapData(item, dataFor, excludes)} */}
            {/* {testtype === "DSAT" || testtype === "DSAT®" ? (
         
            <>
              <td>
                <div
                  className={` ${
                    extratableitem[item?.QuestionNumber - 1]?.QImage ===
                      "Yes" && "bg-[#38C980]"
                  } mx-auto rounded-full w-[20px] h-[20px]`}
                >
                  {extratableitem[item.QuestionNumber - 1]?.QImage === "No"
                    ? ""
                    : null}
                </div>
              </td>
              <td>
                {" "}
                <div
                  className={` ${
                    extratableitem[item?.QuestionNumber - 1]?.AImage == "Yes" &&
                    "bg-[#FFCE84]"
                  } mx-auto  w-[20px] rounded-full h-[20px] `}
                >
                  {extratableitem[item.QuestionNumber - 1]?.AImage == "No"
                    ? ""
                    : null}
                </div>
              </td>
              <td
                className={` ${
                  extratableitem[item?.QuestionNumber - 1]?.Passage == "Yes"
                    ? "text-[#38C980]"
                    : "text-[#FF7979]"
                } text-[17.5px] font-semibold `}
              >
                {extratableitem[item.QuestionNumber - 1]?.Passage}
              </td>
            </>
          ) : null}
          <td className="font-medium flex justify-center px-1 min-w-14 py-4">
            {!item.editable ? (
              <></>
            ) : (
              <img
                src={editIcon3}
                className="cursor-pointer"
                onClick={() => onClick.handleEditTestClick(item)}
              />
            )}
          </td> */}
          </tr>
        )}
      {dataFor === "testsDetailQuestions" &&
        (testtype === "SAT" || testtype === "ACT") && (
          <tr>
            <td className="w-[174px] pl-[27px] pr-[43px] text-[#517CA8] text-[17.5px] font-normal text-center bg-red-100">
              <div>{item?.QuestionNumber}</div>
            </td>
            <td className="w-[124px] pl-[5px] text-[#517CA8] text-[17.5px] font-normal text-left">
              <div>{item?.QuestionType}</div>
            </td>
            <td className="w-[394px] pl-[20px] pr-[42.5px] text-[#517CA8] text-[17.5px] font-normal text-left">
              <div className="max-w-[349px] overflow-hidden text-ellipsis">
                {item?.CorrectAnswer}
              </div>
            </td>
            <td className="w-[445px] pl-[0] pr-[103px] text-[#517CA8] text-[17.5px] font-normal text-left">
              <div className="max-w-[342px] overflow-hidden text-ellipsis">
                {item?.Concepts}
              </div>
            </td>
            <td className="w-[219.5px] pl-[0] pr-[60.75px] text-[#517CA8] text-[17.5px] font-normal text-left">
              <div className="max-w-[158.75px] overflow-hidden text-ellipsis">
                {item?.Strategies}
              </div>
            </td>
            <td className="w-[219.5px] pl-[0] pr-[60.75px] text-[#517CA8] text-[17.5px] font-normal text-left">
              <div className="max-w-[158.75px] overflow-hidden text-ellipsis">
                {item?.Strategies}
              </div>
            </td>
            <td className="w-[108px] pl-[0] pr-[28px] text-[#517CA8] text-[17.5px] font-normal text-left">
              <div className="max-w-[80px] overflow-hidden text-ellipsis">
                {item?.scoring ?? "{Scale}"}
              </div>
            </td>
            <td className="font-medium flex justify-center px-1 min-w-[45px] py-[12.5px] pr-[20px]">
              {!item.editable ? (
                <></>
              ) : (
                <img
                  src={editIcon3}
                  className="cursor-pointer h-[25px] w-[25px]"
                  onClick={() => onClick.handleEditTestClick(item)}
                  alt=""
                />
              )}
            </td>
          </tr>
        )}
      {dataFor === "allTests" && (
        <tr className="odd:bg-white font-medium text-[17.5px]  lead">
          <td
            className="text-left pl-[66.5px] w-[350px] max-w-[350px] overflow-hidden text-ellipsis"
            style={{ paddingLeft: "25px" }}
          >
            {item.testName}
          </td>
          <td className="w-[223px] text-left" style={{ paddingLeft: "55px" }}>
            {item.testType.endsWith("®")
              ? item.testType
              : item.testType.includes("Other")
              ? item.testType
              : item.testType + "®"}
          </td>
          <td
            className="w-[241px] text-left pl-[8.75px]"
            style={{ paddingLeft: "20px" }}
          >
            {" "}
            {getFormattedDate(item.createdAt.split("T")[0], dateFormat)}
          </td>
          <td
            className="w-[235.5px] text-left pl-[16px]"
            style={{ paddingLeft: "30px" }}
          >
            {getFormattedDate(item.updatedAt.split("T")[0], dateFormat)}
          </td>
          <td className="w-[249px] text-center">
            {" "}
            {item.no_of_assign !== null ? item.no_of_assign : "-"}{" "}
          </td>
          <td className="font-medium px-1 py-4 w-[137.5px]">
            <div className="flex justify-start items-center">
              <button
                className="flex leading-none bg-[#FFA28D] text-white py-1.5 px-9 w-[100px] cursor-pointer rounded !text-base-15 !text-center justify-center"
                onClick={() => navigate(`/all-tests/${item._id}`)}
              >
                View
              </button>
            </div>
          </td>
          <td className="font-medium px-1 ">
            {checkTest(persona, item) && (
              <div className="  flex justify-start items-center">
                <button
                  className="flex leading-none bg-[#26435f4d] text-white py-1.5 px-6  w-[100px] !text-center cursor-pointer rounded !text-base-15 justify-center"
                  onClick={() => onClick.openRemoveTestModal(item)}
                >
                  Remove
                </button>
              </div>
            )}
          </td>
        </tr>
      )}
      {dataFor === "allTestsSuperAdmin" && (
        <tr className=" font-medium  lead  text-[18.5px] ">
          <td className="pl-[55px] !text-left ">
            <span className="">{item.testName}</span>
          </td>
          <td className=" pr-7 ">
            {item.testType === "Other"
              ? "ACT®"
              : item.testType.endsWith("®")
              ? item.testType
              : item.testType + "®"}
            {item.testType === "Other"
              ? "ACT®"
              : item.testType.endsWith("®")
              ? item.testType
              : item.testType + "®"}
          </td>
          <td className="  pl-1">
            {getFormattedDate(item.createdAt.split("T")[0], dateFormat)}
          </td>
          <td className="  pr-3">
            {getFormattedDate(item.updatedAt.split("T")[0], dateFormat)}
          </td>
          <td className="  ">
            {" "}
            {item.no_of_assign ? item.no_of_assign : "-"}{" "}
          </td>
          <td className="font-medium pl-2 pr-1 py-3  !text-center">
            <div className="flex justify-center">
              <p
                className="flex leading-none text-[#517CA8] underline py-1.8 px-0 underline-offset-1 cursor-pointer rounded"
                onClick={() => navigate(`/all-tests/${item._id}`)}
              >
                View
              </p>
            </div>
          </td>
          <td className="font-medium px-1 justify-center flex gap-x-2 py-3">
            <img
              src={DeleteIcon}
              className="cursor-pointer p-1"
              alt="delete"
              onClick={() => onClick.openRemoveTestModal(item)}
            />
          </td>
          <td className=" gap-x-2 ">
            <div className="flex items-center gap-x-2 justify-center pr-3">
              <button className="px-1  text-[#517CA8] bg-[rgba(81,124,168,0.1)] w-[66px] h-[26px] rounded-[2.6px]">
                Beta
              </button>
              <img src={AddIcon} alt="add" className="" />
            </div>
          </td>
        </tr>
      )}
      {dataFor === "assignedTutors" && (
        <tr className="bg-white text-[17.5px]   leading-7 mt-[10px]">
          {MapData(item, dataFor, excludes, onClick)}
          <td className="font-medium flex justify-center px-1 min-w-14 py-4">
            <img
              src={DeleteTutorIcon}
              className="cursor-pointer"
              alt=""
              onClick={() => onClick.handleDelete(item)}
            />
          </td>
        </tr>
      )}
      {dataFor === "allOrgs" && (
        <tr className="odd:bg-white  leading-8">
          <td className="font-medium text-[17.5px] !pl-[60px]  min-w-10 py-4  text-left !max-w-[346px]  overflow-hidden">
            <span
              className="inline-block cursor-pointer pl-4"
              onClick={() => navigate(`/orgadmin-profile/${item._id}`)}
            >
              {item.associatedOrg?.company
                ? item.associatedOrg?.company?.toLowerCase()
                : item.company?.toLowerCase()}
            </span>
          </td>
          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left  !max-w-[286px]">
            <div className="my-[6px] !max-w-[286px] text-ellipsis whitespace-nowrap overflow-hidden">
              {item.firstName + " " + item?.lastName}
            </div>
          </td>

          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left !max-w-[323px]">
            <div className="my-[6px] w-[323px] max-w-[323px] flex flex-col">
              {item.email.length > 30 ? (
                <>
                  <p>{item.email.slice(0, 30)}</p>
                  <p>{item.email.slice(30, item.email.length)}</p>
                </>
              ) : (
                <p>{item.email}</p>
              )}
            </div>
          </td>

          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left">
            <div className="my-[6px]">{item.phone}</div>
          </td>
          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left">
            <div className="my-[6px]">{item.associatedOrg?.country}</div>
          </td>

          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left">
            <div className="my-[6px]">{item?.registrationAs}</div>
          </td>
          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left !max-w-[186px]">
            <div className="my-[6px] w-[186px]">{item?.userStatus}</div>
          </td>
          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left !max-w-[168px]">
            <div className="my-[6px] w-[168px]">
              {item.associatedOrg?.numberOfTutors}
            </div>
          </td>
          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left !max-w-[200px]">
            <div className="my-[6px] w-[200px]">
              {item.associatedOrg?.numberOfActiveStudent}
            </div>
          </td>

          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left !max-w-[181px]">
            <div className="my-[6px] w-[181px]">
              {getFormattedDate(item.createdAt, dateFormat)}
              {/* {new Date(item.createdAt).toLocaleDateString()} */}
            </div>
          </td>
          <td
            className={`opacity-70 !cursor-not-allowed pointer-events-none font-medium text-[17.5px] px-1 ${
              persona == "superAdmin"
                ? "min-w-[158px] flex justify-center items-center"
                : "min-w-14"
            }  py-4 cursor-pointer`}
          >
            <div className="my-[6px] opacity-70 ">
              <img
                className="cursor-pointer"
                onClick={() => setDeleteAdminModalActive(true)}
                src={DeleteIconAllOrgs}
                alt="delete"
              />{" "}
            </div>
          </td>
        </tr>
      )}
      {dataFor === "starClients" && <th className=""></th>}

      {deleteAdminModalActive && (
        <Modal
          title={
            <span className="leading-10 text">
              Are you sure you want to Delete{" "}
              {item.associatedOrg?.company
                ? item.associatedOrg?.company
                : item.company}
            </span>
          }
          modalSize="w-[666.67px] h-[194.67px]"
          titleClassName="mb-[22px] leading-10 text-center"
          cancelBtn={true}
          crossBtn={true}
          cancelBtnClassName="!w-[146px] text-[#26435F] font-medium text-base !rounded-[8px] !bg-[rgba(38,67,95,0.10)]  !h-[46px]"
          primaryBtn={{
            text: "Delete",
            className: "!bg-[#FF7979] !w-[146px] pl-4 pr-4 !opacity-100",
            onClick: () => handleDeleteAdmin(),
            bgDanger: true,
            loading: deleteSelectLoading,
          }}
          handleClose={() => setDeleteAdminModalActive(false)}
          classname={"max-w-[600px]  mx-auto"}
        />
      )}
    </>
  );
}

const MapData = (data, dataFor, exclude = [], onClick) => {
  const [remarkText, setRemarkText] = useState("");
  useEffect(() => {
    if (data.remark) {
      setRemarkText(data.remark);
    } else {
      setRemarkText("");
    }
  }, [data.remark]);

  const [disabled, setDisabled] = useState(true);
  return Object.keys(data).map((key, i) =>
    exclude.includes(key) ? (
      <React.Fragment key={i}></React.Fragment>
    ) : key === "isCorrect" ? (
      <td
        key={i}
        className={`font-medium px-1 min-w-14 py-4  ${
          data[key] ? "" : "!bg-[#FF79791A]/[0.05]"
        }`}
      >
        <div className="flex items-center justify-center">
          <img
            src={data[key] === true ? SuccessIcon : FailIcon}
            className="flex"
            alt="resultIcon"
          />
        </div>
      </td>
    ) : key === "QuestionNumber" ? (
      <td
        key={i}
        className={`font-medium px-1 py-4  ${
          dataFor === "studentTestsReport" && !data["isCorrect"]
            ? "!bg-[#FF79791A]/[0.05]"
            : ""
        }`}
      >
        <p className={`font-semibold `}>
          {data[key] < 10 && "0"}
          {data[key]}
        </p>
      </td>
    ) : dataFor === "invoice" && key === "currentBalance" ? (
      <td key={i} className="font-medium px-1 text-[#009262] py-4">
        <p className={`font-semibold`}>{data[key]}</p>
      </td>
    ) : (dataFor === "assignedStudents" && key === "name") ||
      key === "parent" ? (
      <td key={i} className={`font-medium px-1 `}>
        <p
          className={`pl-4 ${
            key === "name" ? "text-center cursor-pointer" : ""
          } font-semibold`}
          onClick={() =>
            key === "name" && onClick.handleNavigate("student", data._id)
          }
        >
          {data[key]}
        </p>
      </td>
    ) : dataFor === "invoice" && key === "invoiceType" ? (
      <td key={i} className="font-medium px-1 text-[#009262] py-4">
        <p className={`font-semibold`}>
          <InputSelect
            placeholderClass="text-base-17-5"
            value={data[key] ? data[key] : "-"}
            optionData={
              data[key] === "paid"
                ? ["paid", "cancelled"]
                : ["paid", "draft", "cancelled", "unpaid"]
            }
            inputContainerClassName="min-w-[100px] pt-0 pb-0 pr-2 pl-0 text-center"
            optionListClassName="text-base-17-5"
            optionClassName="font-semibold opacity-60 text-[17.5px]"
            labelClassname="hidden"
            onChange={(val) =>
              onClick.handleEdit({
                ...data,
                invoiceType: val,
              })
            }
          />
        </p>
      </td>
    ) : dataFor === "invoice" && key === "remark" ? (
      <td key={i} className="font-medium px-1 py-4">
        <InputField
          value={remarkText}
          onChange={(e) => setRemarkText(e.target.value)}
          onClick={() => setDisabled(false)}
          parentClassName="mr-4 w-full"
          onFocus={() => setDisabled(false)}
          onBlur={() => {
            setDisabled(true);
            data.remark !== remarkText &&
              onClick.handleEdit({
                _id: data._id,
                remark: remarkText,
              });
          }}
          inputContainerClassName={`bg-white ${
            disabled ? "border-0" : "border"
          } pt-1.5 pb-1.5 lg:pt-1.5 lg:pb-1.5 disabled:border-0`}
        />
      </td>
    ) : (dataFor === "assignedTutors" && key === "tutorName") ||
      (dataFor === "assignedTutors" && key === "studentName") ? (
      <td key={i} className="font-medium px-1 text-[#2A6CFB] py-4">
        <p
          className={`font-semibold cursor-pointer`}
          onClick={() =>
            key === "tutorName"
              ? onClick.handleNavigate(`/profile/tutor/${data.assiginedTutor}`)
              : onClick.handleNavigate(`/profile/student/${data.student_id}`)
          }
        >
          {data[key]}
        </p>
      </td>
    ) : dataFor === "assignedTutors" && key === "associatedParent" ? (
      <td key={i} className="font-medium px-1 text-[#2A6CFB] py-4">
        <p
          className={`font-semibold cursor-pointer`}
          onClick={() =>
            onClick.handleNavigate(`/profile/parent/${data.associatedParent}`)
          }
        >
          {`${data.parentFirstName ? data.parentFirstName : ""} ${
            data.parentLast ? data.parentLast : ""
          }`}
        </p>
      </td>
    ) : (
      <td
        key={i}
        className={`font-medium px-1 
        ${data[key] === "Unpaid" && "text-[#E02B1D]"} 
        ${data[key] === "Paid" && "text-[#009262]"} 
        ${data[key] === "Cancelled" && "text-[#7C859C]"}
         min-w-14 py-4 
        ${
          dataFor === "studentTestsReport" && !data["isCorrect"]
            ? "!bg-[#FF79791A]/[0.05]"
            : ""
        }
        ${dataFor === "testsDetailQuestions" && "text-left pl-7"} 
        ${dataFor === "assignedStudents" && "text-left ps-[60px] "} 
        ${
          dataFor === "studentTestsReport" && key === "Concept"
            ? "w-[100px] text-start ps-[20px]"
            : null
        }
        
        ${
          dataFor === "studentTestsReport" && key === "Strategy"
            ? "text-start ps-[28px]"
            : null
        }
        `}
      >
        {data[key]}
      </td>
    )
  );
};


//  tutor students 
const MapDataAssignedStudents = (data, dataFor, exclude = [], onClick) => {
  const [remarkText, setRemarkText] = useState("");
  useEffect(() => {
    if (data.remark) {
      setRemarkText(data.remark);
    } else {
      setRemarkText("");
    }
  }, [data.remark]);

  console.log(data);

  const [disabled, setDisabled] = useState(true);
  return Object.keys(data).map((key, i) =>
    exclude.includes(key) ? (
      <React.Fragment key={i}></React.Fragment>
    ) : key === "isCorrect" ? (
      <td className="">{data[key]}</td>
    ) : (
      <td
        className={`pt-[12px] pb-[13px] ${
          key === "name" ? "text-left ps-[76px]" : ""
        }
        ${
          key === "email" ? "text-left pr-[166px]" : ""
        }
        ${
          key === "phone" ? "text-left pr-[50px]" : ""
        }
        ${
          key === "services" ? "text-left  pr-[123px]" : ""
        }
        ${
          key === "topics" ? "text-left" : ""
        }
        ${
          key === "status" ? "text-center" : ""
        }
        `}
      >
        {data[key]}
      </td>
    )
  );
};
