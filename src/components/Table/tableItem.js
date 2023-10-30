import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResendConfirmation from "../../assets/assignedTests/resendConfirmation.svg";
import UploadIcon from "../../assets/assignedTests/upload.svg";
import DownloadIcon from "../../assets/icons/download.png";
import SuccessIcon from "../../assets/assignedTests/success_green.svg";
import FailIcon from "../../assets/assignedTests/fail_red.svg";
import YellowIcon from "../../assets/assignedTests/yellow.svg";
import LightBlueIcon from "../../assets/icons/Test Statusred.svg";
import RedIcon from "../../assets/assignedTests/red.svg";
import GreenIcon from "../../assets/assignedTests/green.svg";
import GrayIcon from "../../assets/assignedTests/gray.svg";
import RemoveIcon from "../../assets/icons/remove.svg";
import EditTestIcon from "../../assets/icons/edit-test.svg";
import TrashIcon from "../../assets/icons/ic_outline-delete.svg";
import TrashIcon2 from "../../assets/icons/trash-blue.svg";
import styles from './styles.module.css'
import AddIcon from "../../assets/icons/plus_colored.svg";
import EditIcon from "../../assets/icons/edit_logo.svg";
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
import { checkTest, getFormattedDate, getScore, getScoreStr } from "../../utils/utils";
import InputField from "../InputField/inputField";
import CCheckbox from "../CCheckbox/CCheckbox";
import SCheckbox from "../CCheckbox/SCheckbox";
import organization from "../../app/slices/organization";
import { useDeleteUserMutation } from "../../app/services/admin";
import Modal from "../Modal/Modal";
import { useDeleteAdminMutation } from "../../app/services/superAdmin";


export default function TableItem({
  item,
  dataFor,
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
  testtype
}) {
  const [dateFormat, setDateFormat] = useState("dd/mm/yy")

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
  const { organization: organization2 } = useSelector((state) => state.organization)
  const [userDetail, setUserDetail] = useState({});
  const [leadStatus, setLeadStatus] = useState("");
  const [tutorStatus, setTutorStatus] = useState("");

  const [settings, setSettings] = useState({
    leadStatus: [],
  });

  useEffect(() => {
    if (organization2 && organization2?.settings) {
      setDateFormat(organization2?.settings?.dateFormat)
    }
  }, [organization2])

  useEffect(() => {
    if (item.userType === "tutor")

      setTutorStatus(item?.tutorStatus)
  }, [item])
  useEffect(() => {

    if (dataFor === "assignedTestsStudents") {
      let params = {};
      let url = `/api/test/getresponse/${item.assignedTestId}`;
      if (persona !== "student") {
        url = `/api/test/admin/getresponse/${item.assignedTestId}`;

      }
      if (item.isCompleted === true) {
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

          setScore(`${score.cumulative} ${score.right}`);
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
      return
    }
    updateFields({ id: item._id, fields: field }).then((res) => {
      if (res.error) {
        return //console.log("error updating");
      }
      fetch && fetch(field, item._id);
      console.log("update res", item?._id, field, res.data);
    });
  };

  const [deleteAdmin, setDeleteAdmin] = useDeleteAdminMutation()
  const [deleteAdminModalActive, setDeleteAdminModalActive] = useState(false)
  const [deleteSelectLoading, setDeleteSelectLoading] = useState(false)
  const handleDeleteAdmin = () => {
    setDeleteSelectLoading(true)
    deleteAdmin({ id: item?.associatedOrg?._id }).then((res) => {
      setDeleteSelectLoading(false)
      if (res?.data) {
        setDeleteAdminModalActive(false)
        alert("Successfully deleted Admin!")
        handleAllOrgRefetch()

      }
      else if (res?.error) {
        alert("Error deleting Admin!")
      }
      console.log(res)
    })
  }
  const handleChange = (field) => {

    if (item.userType === "parent" || item.userType === "student") {
      updateUserDetail({ fields: field, id: item._id }).then((res) => {
        console.log("lead", { res })
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
            setTutorStatus(resp.data.data.details?.tutorStatus)
          }
        });
      } else {
        getUserDetail({ id: item._id }).then((resp) => {

          let status = "-";
          if (resp?.data?.data?.userdetails) {
            status = resp.data.data.userdetails.leadStatus;
            if (item.userType === "parent" || item.userType === "student")
              setLeadStatus(status);
            setTutorStatus(resp.data.data.details?.tutorStatus)
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

  const timestamp = item.createdAt;
  const date = new Date(timestamp);

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  //console.log(dataFor)
  const getFormatDate = (inputDate) => {
    const dateObj = new Date(inputDate);


    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    let dd = formattedDate
    let ed = dd.split(" ")
    let fd = ed[0] + ". " + ed[1] + " " + ed[2]
    //console.log(formattedDate);
    return fd
  }
  const getPhone = (val) => {
    //console.log(item)
    //console.log(val)
  }

  const handleSelect = (item2, key) => {
    console.log({ item2, selectedId2 })
    if (selectedId2 && setSelectedId2) {
      let temp = selectedId2
      let bool = temp?.find((itt) => itt[key] === item2[key])
      if (bool) {
        temp = temp?.filter((idd) => {
          return idd[key] !== item2[key]

        })
      }
      else {
        temp?.push(item2)
      }
      setSelectedId2([...temp])
    }
    setIsChecked(!isChecked)
  }

  useEffect(() => {
    if (selectedId2) {
      let temp = selectedId2
      let key = "assignedTestId";
      if (dataFor === "allUsers")
        key = "_id"
      let bool = temp?.find((itt) => itt[key] === item[key])
      setIsChecked(bool ? true : false)
    }
  }, [selectedId2])

  return (
    <>
      {
        dataFor === "tutorFeedback" && (
          <>

            <tr className=" text-[17.5px] font-medium">
              <td className="pb-[15px] pt-[15px] px-[10px]">
                {item.studentName}
              </td>
              <td className="pb-[15px] pt-[15px] px-[10px]">
                {item.service}
              </td>
              <td className="pb-[15px] pt-[15px] px-[10px]">
                {item.rating}
              </td>


              <td className="pb-[15px] pt-[15px] px-[10px]">
                {getFormattedDate(formattedDate, dateFormat)}
              </td>
            </tr>

          </>
        )

      }
      {
        dataFor === "popularServices" && (
          <>
            <tr className=" text-[17.5px] font-medium">
              <td className="py-4 px-[10px]">
                {item.service}
              </td>
              <td className="py-4 px-[10px]">
                {item.actively_using}
              </td>
              <td className="py-4 px-[10px]">
                {item.total_used}
              </td>
              <td className="py-4 px-[10px]">
                {item.scheduled_hours}
              </td>
              <td className="py-4 px-[10px]">
                {item.completed_hours}
              </td>
              <td className="py-4 px-[10px]">
                {item.percent_of_business}
              </td>
            </tr>
          </>
        )
      }
      {
        dataFor === "serviceRates" && (
          <>

            <tr className=" text-[17.5px] font-medium">
              <td className="py-4 px-[10px]">
                {item.service}
              </td>

              <td className="py-4 px-[10px]">
                <div className="text-[#517CA8] font-semibold text-base-20 mr-[2px] inline-block">$</div>
                {item.price}
              </td>
            </tr>

          </>
        )

      }

      {dataFor === "allUsers" && (
        <tr className="odd:bg-white   leading-8">

          <td className=" text-[17.5px] px-1  min-w-14   text-left">
            <span
              className="inline-block cursor-pointer pl-4 pt-[6px]"

            >
              <div className="flex items-center">
                {dataFor === "allUsers" ? (


                 <div className="pt-[3px]"> <SCheckbox checked={isChecked}
                 stopM={true}
                 onChange={() => handleSelect(item, "_id")} /></div>
                  // <label
                  //   className={`${styles["checkbox-label"]} block text-[#26435F] `}
                  // >
                  //   <input
                  //     type="checkbox"
                  //     checked={isChecked}
                  //     onChange={handleCheckboxChange}
                  //   />
                  //   <span
                  //     className={`${styles["custom-checkbox"]} ${isChecked ? "checked" : ""
                  //       }`}
                  //   ></span>
                  // </label>

                ) : (
                  ""
                )}
                <span onClick={() => onClick.redirect(item)} className="capitalize whitespace-nowrap overflow-hidden text-ellipsis w-[100px]">
                  {item.name}
                </span>
              </div>
            </span>
          </td>
          <td className=" text-[17.5px] px-1 min-w-14  capitalize" >
            <div className="my-[6px]">{item.userType}</div>
          </td>
          <td className=" text-[17.5px] px-1  min-w-14  ">
            <div className="my-[6px]">{item.email}</div>
          </td>

          <td className=" text-[17.5px] px-1  min-w-14  capitalize">
            <div className="my-[6px]">{item.phoneCode}{item.phone}</div>
          </td>
          <td className=" text-[17.5px] px-1  min-w-14  capitalize flex justify-center">
            <div className="my-[6px] whitespace-nowrap overflow-hidden text-ellipsis w-[100px] ">
              {item.assignedTutor?.length > 0
                ? item.assignedTutor?.map((id, idx) => {
                  const name = extraData.find((item) => item._id === id);
                  if (name === undefined) return "l";
                  return `${name.value} ${idx + 1 < item.assignedTutor.length ? "," : ""
                    } `;
                })
                : "-"}
            </div>
          </td>
          <td className=" text-[17.5px] px-1  min-w-14 ">
            <div className="my-[6px]">
              {item.specialization?.map((specialization, idx) => {
                return `${specialization}${idx + 1 === item.specialization.length ? "" : ","
                  }`;
              })}
            </div>
          </td>
          <td className=" text-[17.5px] px-1  min-w-14 ">
            <div className="my-[6px]">
              <InputSelect
                disabled={(item?.userType === "parent" || item?.userType === "student") ? false : true}

                tableDropdown={true}
                value={leadStatus ? leadStatus : "-"}
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
              disabled={(item?.userType === "tutor") ? false : true}
              tableDropdown={true}
              value={tutorStatus ? tutorStatus : "-"}
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
          <td className=" text-[17.5px] px-1  min-w-14  text-[#507CA8]">
            <div className="my-[6px] capitalize">{getFormattedDate(item.createdAt, dateFormat)}</div>
          </td>

          {false && <td className=" px-1 min-w-14 ">
            {item.userType !== "admin" ? (
              <div className=" flex items-center justify-center">

                <img
                  src={TrashIcon}
                  className="cursor-pointer"
                  onClick={() => onClick.handleDelete(item)}
                />


              </div>
            ) : (
              ""
            )}
          </td>
          }
        </tr>
      )}
      {dataFor === "allUsersSuperAdmin" && (
        <tr className="odd:bg-white even:!shadow-[0px_0px_3.00000476837158px_0px_#00000040]  leading-8">
          <td className="font-medium text-[17.5px] px-1  min-w-14   text-center">
            <span
              className="inline-block cursor-pointer"
              onClick={() => onClick.redirect(item)}
            >
              {item.name}
            </span>
          </td>
          <td className="font-medium text-[17.5px] px-1 min-w-14 ">
            <div className="">{item.email}</div>
          </td>
          <td className="font-medium text-[17.5px] px-1  min-w-14 ">
            <div className="">{item.userType}</div>
          </td>
          <td className="font-medium text-[17.5px] px-1  min-w-14 ">
            {item?.lastLogin ? <div className="">
              {/* {new Date(item?.lastLogin).toDateString().split(' ')[1] }. {new Date(item?.lastLogin).getDate() }, {new Date(item?.lastLogin).getFullYear()} */}
              {getFormattedDate(item.lastLogin, dateFormat)}
            </div> : "None"}
          </td>
          <td className="font-medium text-[17.5px] px-1  min-w-14 ">
            <div className="cursor-pointer">
              <span style={{ textDecoration: 'underline' }}>edit</span>
            </div>
          </td>
          <td className="font-medium ">
            <div className="">
              <button
                className="rounded-[5.33px] bg-[rgba(38,67,95,0.23)] text-[#517CA8] px-[17px]  py-1  text-base-18"
                onClick={() => onClick.handleResetPassword(item.email)}
              >
                Reset
              </button>
            </div>
          </td>


          <td className=" px-1 min-w-14 py-4">
            {(item.userType !== "admin"&&item.userType !== "superAdmin"&&item.userType !== "superadmin") ? (
              <div className=" flex items-center justify-center">
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
              {item.lastLogin ? getFormattedDate(item.lastLogin, dateFormat) : "-"}
            </div>
          </td>
        </tr>
      )}
      {dataFor === "assignedTests" && (
        <tr className=" text-[17.5px] ">
          <td className="px-1 font-medium  min-w-14  text-left flex items-center  pb-[14px] pt-4">
            <span
              className="inline-block cursor-pointer pl-4"

            >
              <div className="flex ">
                {dataFor === "assignedTests" ? (


                  <SCheckbox checked={isChecked}
                    stopM={true}
                    onChange={() => handleSelect(item, "assignedTestId")} />


                ) : (
                  ""
                )}

              </div>
            </span>
            <span className="inline-block cursor-pointer pl-4" onClick={() =>
              onClick.handleNavigate("student", item.studentId)
            }>
              {item.studentName}
            </span>

          </td>
          <td className="font-medium px-1  min-w-14 py-3">{item.testName}</td>
          <td className=" text-[17.5px] px-1  min-w-14 py-3  text-center">

            <span onClick={() => onClick.redirect(item)} className="">
              {getFormattedDate(item.assignedOn, dateFormat).replace(/-/g, '/')}
            </span>
          </td>
          <td className=" text-[17.5px] px-1  min-w-14 py-3  text-center">

            <span onClick={() => onClick.redirect(item)} className={`${new Date() > new Date(item?.dueDate) ? "text-danger" : ""}`}>
              {getFormattedDate(item.dueDate, dateFormat).replace(/-/g, '/')}
            </span>
          </td>

          <td className="font-medium px-1  min-w-14 py-3">{item.assignedBy
          }</td>
          <td className="font-medium px-1  min-w-14 py-3">


            <div className={`flex items-center no-wrap justify-center`}>
              {returnStatus(item.status)}

            </div>


          </td>
          <td className="font-medium px-1  min-w-14 py-3">
            {item.duration === "-" ? "Unlimited" : item.duration}
          </td>
          <td className="font-medium px-1  min-w-14 py-3">
            <div className="text-center">
              {item.status === "completed" ? score : "-"}
            </div>
          </td>

          <td className=" px-1  min-w-14 py-3">
            <button
              className={`text-[15px] flex justify-center text-base-15 px-1 h-[31px]  rounded-5  items-center leading-none w-[100px] text-center text-white ${item.status == "completed"
                ? "bg-[#38C980]  "
                : `${item.status == "started" ? "bg-[#FFCE84]" : "bg-[rgba(38,67,95,0.20)] pointer-events-none"}`
                }`}

              onClick={() =>
                navigate(
                  `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId}`
                )
              }
            >
              <span classname="inline-block">  View Report</span>
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
              <img src={UploadIcon} />
            </button>
          </td>
        </tr>
      )}
      {dataFor === "assignedStudents" && (
        <tr className="odd:bg-white text-[17.5px]  leading-7">
          {MapData(item, "assignedStudents", excludes, onClick)}

        </tr>
      )}
      {dataFor === "studentTestsReport" && (
        <tr
          className={`text-[17.5px]   leading-7 ${!item.isCorrect
            ? "bg-[#e02b1d]/5"
            : "odd:bg-white  "
            } `}
        >
          {MapData(item)}
        </tr>
      )}
      {dataFor === "studentTestsReportSmall" && (
        <tr
          className={`text-[17.5px]  leading-7 ${!item.isCorrect
            ? "bg-[#e02b1d]/5"
            : "odd:bg-white  "
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
        <tr className="  text-[17.5px] leading-7">
          {Object.keys(item).map((key, i) =>
            excludes.includes(key) ? (
              <React.Fragment key={i}>
              </React.Fragment>
            ) : (
              <td key={i} className="font-medium px-1  min-w-14 py-4">
                {key === "status" ? (
                  <div className="flex justify-center">
                    {returnStatus(item.status)}
                  </div>
                ) : key === "scores" ? (
                  <div
                    className="cursor-pointer"
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
                  <span className={` ${new Date(item[key]) < new Date() ? "text-[#FF7979] font-semibold" : ""}`}> {getFormattedDate(item[key], dateFormat)}</span>
                ) :
                  key === "createdAt" ? getFormattedDate(item[key], dateFormat) : key === "assignedOn" ? getFormattedDate(item[key], dateFormat) : item[key]

                }

              </td>
            )
          )}
          <td className="font-medium px-1  min-w-14 py-4">
            <div className="flex items-center">
              {persona == "student" || <img
                src={DownloadIcon} alt="DownloadIcon"
                className="w-[30px] cursor-pointer"
                onClick={() => handlePdfNavigate()}
              />}
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
                        const indexx = testtype.findIndex(obj => obj.testId === item.testId);
                        testtype[indexx].testtype == 'DSAT' ?
                          navigate(`/testpage/${item.testId}/${item.assignedTestId}`)
                          :
                          navigate(
                            `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId._id}`
                          )
                      }
                      }
                    >
                      Started
                    </button>
                  ) : (
                    <button disabled
                      className="px-2.5 py-1.8 rounded-5 bg-[#D4D9DF] flex items-center leading-none  text-white ml-4 w-[120px] h-[31px] justify-center"
                      onClick={() => {
                        const indexx = testtype.findIndex(obj => obj.testId === item.testId);
                        testtype[indexx].testtype == 'DSAT' ?
                          navigate(`/testpage/${item.testId}/${item.assignedTestId}`)
                          :
                          navigate(
                            `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId._id}`
                          )
                      }
                      }
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
                        const indexx = testtype.findIndex(obj => obj.testId === item.testId);
                        testtype[indexx].testtype == 'DSAT' ?
                          navigate(`/testpage/${item.testId}/${item.assignedTestId}`)
                          :
                          navigate(
                            `/all-tests/start-section/${item.testId}/${item.assignedTestId}`
                          )
                      }
                      }
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      className="px-2.5 py-1.8 rounded-5 bg-[#FF7979] flex items-center leading-none  text-white ml-4 w-[120px] h-[31px] justify-center"
                      onClick={() => {
                        const indexx = testtype.findIndex(obj => obj.testId === item.testId);
                        testtype[indexx].testtype == 'DSAT' ?
                          navigate(`/testpage/${item.testId}/${item.assignedTestId}`)
                          :
                          navigate(
                            `/all-tests/start-section/${item.testId}/${item.assignedTestId}`
                          )
                      }
                      }
                    >
                      Start
                    </button>
                  )}
                </>
              )}
            </div>
          </td>
        </tr>
      )}
      {dataFor === "invoice" && (
        <tr className="bg-white text-[17.5px]   leading-7 mt-[10px]">
          {MapData(item, dataFor, excludes, onClick)}
        </tr>
      )}
      {dataFor === "testsDetailQuestions" && (
        <tr className="bg-white text-[17.5px]   leading-7 mt-[10px]">
          {MapData(item, dataFor, excludes)}
          {testtype === 'DSAT' ? <>
            <td><div className={` ${extratableitem[item?.QuestionNumber - 1]?.QImage === 'Yes' && 'bg-[#38C980]'} mx-auto rounded-full w-[20px] h-[20px]`}>{extratableitem[item.QuestionNumber - 1]?.QImage === 'No' ? '' : null}</div></td>
            <td> <div className={` ${extratableitem[item?.QuestionNumber - 1]?.AImage == 'Yes' && 'bg-[#FFCE84]'} mx-auto  w-[20px] rounded-full h-[20px] `}>{extratableitem[item.QuestionNumber - 1]?.AImage == 'No' ? '' : null}</div></td>
            <td className={` ${extratableitem[item?.QuestionNumber - 1]?.Passage == 'Yes' ? 'text-[#38C980]' : 'text-[#FF7979]'} text-[17.5px] font-semibold `}>{extratableitem[item.QuestionNumber - 1]?.Passage}</td>
          </> : null} 
          <td className="font-medium flex justify-center px-1 min-w-14 py-4">
            {
              !item.editable ? <></> :
                <img
                  src={EditTestIcon}
                  className="cursor-pointer"
                  onClick={() => onClick.handleEditTestClick(item)}
                />
            }
          </td>
        </tr>
      )}
      {dataFor === "allTests" && (
        <tr className="odd:bg-white font-medium text-[17.5px]  lead">
          <td>{item.testName}</td>
          {console.log('itt---', item)}
          <td>{item.testType} &#174;</td>
          <td> {getFormattedDate(item.createdAt.split("T")[0], dateFormat)}</td>
          <td>{getFormattedDate(item.updatedAt.split("T")[0], dateFormat)}</td>
          <td> {item.no_of_assign!==null ? item.no_of_assign : "-"} </td>
          <td className="font-medium px-1 py-4 text-right">
            <div className="flex justify-end">
              <button
                className="flex leading-none bg-[#FFA28D] text-white py-1.5 px-5 cursor-pointer rounded !text-base-15"
                onClick={() => navigate(`/all-tests/${item._id}`)}
              >
                View
              </button>
            </div>
          </td>
          <td className="font-medium px-1 ">
            {
              (checkTest(persona, item)) &&
              <div className="flex justify-end  flex justify-center items-center">
                <button
                  className="flex leading-none bg-[#26435f4d] text-white py-1.5 px-5 cursor-pointer rounded !text-base-15"
                  onClick={() => onClick.openRemoveTestModal(item)}
                >
                  Remove
                </button>
              </div>
            }
          </td>
        </tr>
      )}
      {dataFor === "allTestsSuperAdmin" && (
        <tr className=" font-medium  lead  text-[17.5px] ">
          <td>{item.testName}</td>
          <td>{item.testType==="Other"?"ACT":item.testType}</td>
          <td>{getFormattedDate(item.createdAt.split("T")[0], dateFormat)}</td>
          <td>{getFormattedDate(item.updatedAt.split("T")[0], dateFormat)}</td>
          <td> {item.no_of_assign ? item.no_of_assign : "-"} </td>
          <td className="font-medium px-1 py-3 text-right">
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
              src={EditIcon}
              className="cursor-pointer p-1"
              onClick={() => navigate(`/all-tests/${item._id}`, { state: { testype: item.testType } })}
              alt="edit"
            />
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
              onClick={() => onClick.handleDelete(item)}
            />
          </td>
        </tr>
      )}
      {dataFor === "allOrgs" && (
        <tr className="odd:bg-white  leading-8">
          <td className="font-medium text-[17.5px] pl-8  min-w-14 py-4  text-left">
            <span
              className="inline-block cursor-pointer pl-4"
              onClick={() => navigate(`/orgadmin-profile/${item._id}`)}
            >
              {item.associatedOrg?.company
                ? item.associatedOrg?.company
                : item.company}
            </span>
          </td>
          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left">
            <div className="my-[6px]">{item.firstName + " " + item?.lastName}</div>
          </td>

          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left">
            <div className="my-[6px]">{item.email}</div>
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
          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left">
            <div className="my-[6px]">{item?.userStatus}</div>
          </td>
          <td className="font-medium text-[17.5px] px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.associatedOrg?.numberOfTutors}</div>
          </td>
          <td className="font-medium text-[17.5px] px-1  min-w-14 py-4">
            <div className="my-[6px]">
              {item.associatedOrg?.numberOfActiveStudent}
            </div>
          </td>

          <td className="font-medium text-[17.5px] pl-12  min-w-14 py-4  text-left">
            <div className="my-[6px]">{getFormattedDate(item.createdAt, dateFormat)}
              {/* {new Date(item.createdAt).toLocaleDateString()} */}
            </div>
          </td>
          <td className="font-medium text-[17.5px] px-1  min-w-14 py-4 cursor-pointer">
            <div className="my-[6px]"><img onClick={() => setDeleteAdminModalActive(true)} src={DeleteIconAllOrgs} alt="delete" /> </div>
          </td>
        </tr>
      )}
      {deleteAdminModalActive && (
        <Modal
          title={
            <span className="leading-10 text">
              Are you sure you want to Delete   {item.associatedOrg?.company
                ? item.associatedOrg?.company
                : item.company}

            </span>
          }
          titleClassName="mb-5 leading-10 text-center"
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
      <React.Fragment key={i}>
      </React.Fragment>
    ) : key === "isCorrect" ? (
      <td key={i} className="font-medium px-1  min-w-14 py-4">
        <div className="flex items-center justify-center">
          <img
            src={data[key] === true ? SuccessIcon : FailIcon}
            className="flex"
            alt="resultIcon"
          />
        </div>
      </td>
    ) : dataFor === "invoice" && key === "currentBalance" ? (
      <td key={i} className="font-medium px-1 text-[#009262] py-4">
        <p className={`font-semibold`}>{data[key]}</p>
      </td>
    ) : (dataFor === "assignedStudents" && key === "name") ||
      key === "parent" ? (
      <td key={i} className={`font-medium px-1 `}>
        <p
          className={`pl-4 ${key === "name" ? "text-center cursor-pointer" : ""
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
            placeholderClass="text-base-17-5" value={data[key] ? data[key] : "-"}
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
          inputContainerClassName={`bg-white ${disabled ? "border-0" : "border"
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
          {`${data.parentFirstName ? data.parentFirstName : ""} ${data.parentLast ? data.parentLast : ""
            }`}
        </p>
      </td>
    ) : (
      <td
        key={i}
        className={`font-medium px-1 ${data[key] === "Unpaid" && "text-[#E02B1D]"
          } ${data[key] === "Paid" && "text-[#009262]"} ${data[key] === "Cancelled" && "text-[#7C859C]"
          } min-w-14 py-4`}
      >
        {data[key]}
      </td>
    )
  );
};
