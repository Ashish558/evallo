import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResendConfirmation from "../../assets/assignedTests/resendConfirmation.svg";
import UploadIcon from "../../assets/assignedTests/upload.svg";
import DownloadIcon from "../../assets/icons/download.png";
import SuccessIcon from "../../assets/assignedTests/success.svg";
import FailIcon from "../../assets/assignedTests/fail.svg";
import YellowIcon from "../../assets/assignedTests/yellow.svg";
import LightBlueIcon from "../../assets/icons/Test Statusred.svg";
import RedIcon from "../../assets/assignedTests/red.svg";
import GreenIcon from "../../assets/assignedTests/green.svg";
import GrayIcon from "../../assets/assignedTests/gray.svg";
import RemoveIcon from "../../assets/icons/remove.svg";
import EditTestIcon from "../../assets/icons/edit-test.svg";
import TrashIcon from "../../assets/icons/delete.svg";
import styles from './styles.module.css'
import AddIcon from "../../assets/icons/plus.svg";
import EditIcon from "../../assets/icons/test-edit.svg";
import DeleteIcon from "../../assets/icons/trash-icon.svg";
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
import { getFormattedDate, getScore, getScoreStr } from "../../utils/utils";
import InputField from "../InputField/inputField";

//can b made dynamic
export default function TableItem({
  item,
  dataFor,
  onClick,
  excludes,
  fetch,
  checkedHeader,
  extraData,
  numberChecked,
  setnumberChecked
}) {
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

  const [userDetail, setUserDetail] = useState({});
  const [leadStatus, setLeadStatus] = useState("");

  // console.log(dataFor);
  const [settings, setSettings] = useState({
    leadStatus: [],
  });

  useEffect(() => {
    if (dataFor === "assignedTestsStudents") {
      let params = {};
      let url = `/api/test/getresponse/${item.assignedTestId}`;
      if (persona !== "student") {
        url = `/api/test/admin/getresponse/${item.assignedTestId}`;
        // params = { userId: item.studentId._id }
      }
      if (item.isCompleted === true) {
        getTestResponse({ url, params: params }).then((res) => {
          if (res.error) {
            console.log("resp err", res.error);
            return;
          }
          // console.log('Resp score', res.data.data.response);
          let responseData = res.data.data.response;
          let score = getScoreStr(
            responseData.testType,
            responseData.score,
            responseData.subjects,
            responseData.subjects.length
          );
          // let scr = getScore(res.data.data.response.testType, res.data.data.response.subjects)
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
        // console.log(item);
        getTestResponse({ url, params: params }).then((res) => {
          if (res.error) {
            console.log("resp err", res.error);
            return;
          }
          // console.log('Resp score', res.data.data.response);
          let responseData = res.data.data.response;
          let score = getScoreStr(
            responseData.testType,
            responseData.score,
            responseData.subjects,
            responseData.subjects.length
          );
          // console.log('SCORE', score);
          // let scr = getScore(res.data.data.response.testType, res.data.data.response.subjects)
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
    // console.log(field)
    // console.log(item)
    // return
    updateFields({ id: item._id, fields: field }).then((res) => {
      if (res.error) {
        return console.log("error updating");
      }
      fetch && fetch(field, item._id);
      console.log("update res", res.data);
    });
  };
  const handleChange = (field) => {
    // console.log(field)
    // console.log(item._id)
    // console.log(userDetail)
    if (item.userType === "parent" || item.userType === "student") {
      updateUserDetail({ fields: field, id: item._id }).then((res) => {
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
      <img className="first:mr-2" src={GreenIcon} />
    ) : status === "started" ? (
      <img className="first:mr-2" src={YellowIcon} />
    ) : status === "notStarted" ? (
      <img className="first:mr-2" src={LightBlueIcon} />
    ) : status === 3 ? (
      <img className="first:mr-2" src={LightBlueIcon} />
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
        // console.log('tutor', user._id);
        getTutorDetail({ id: item._id }).then((resp) => {
          // console.log('TUTOR RESp', resp);
          // console.log('tutor-details', resp.data.data);
          let status = "-";
          if (resp.data.data.details) {
            status = resp.data.data.details.leadStatus;
            setLeadStatus(status);
          }
        });
      } else {
        getUserDetail({ id: item._id }).then((resp) => {
          // console.log('user-details', resp.data.data);
          let status = "-";
          if (resp.data.data.userdetails) {
            status = resp.data.data.userdetails.leadStatus;
            setLeadStatus(status);
          }
        });
      }
    }
  }, [item]);
  const [isChecked, setIsChecked] = useState(checkedHeader);
  const handleCheckboxChange = () => {
    console.log("handleCheckboxChange")
   setIsChecked(!isChecked);  
   let fl=isChecked?1:-1
   setnumberChecked(numberChecked-fl)
 };
 

 useEffect(()=>{
   setIsChecked(checkedHeader);
 },[checkedHeader])

  // console.log('extraData', extraData );
  // console.log('onClick', onClick );

  return (
    <>
      {dataFor === "allUsers" && (
        <tr className="odd:bg-white  shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-8">
          
          <td className="font-medium text-sm px-1  min-w-14 py-4  text-left">
            <span
              className="inline-block cursor-pointer pl-4"
            
            >
                <div className="flex ">
        {dataFor==="allUsers"? (
         
            <label
              className={`${styles["checkbox-label"]} block text-[#26435F] font-medium`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span
                className={`${styles["custom-checkbox"]} ${
                  isChecked ? "checked" : ""
                }`}
              ></span>
            </label>
          
        ) : (
          ""
        )}
        <span   onClick={() => onClick.redirect(item)} className="">
          {item.name}
        </span>
      </div>
            </span>
          </td>
          <td className="font-medium text-sm px-1 min-w-14 py-4">
            <div className="my-[6px]">{item.userType}</div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.email}</div>
          </td>

          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.phone}</div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">
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
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">
              <InputSelect
                value={leadStatus ? leadStatus : "-"}
                optionData={settings.leadStatus}
                inputContainerClassName="min-w-[100px] pt-0 pb-0 pr-2 pl-0 text-center"
                optionClassName="font-semibold opacity-60 text-sm"
                labelClassname="hidden"
                onChange={(val) => handleChange({ leadStatus: val })}
              />
            </div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <InputSelect
              value={item.userStatus ? item.userStatus : "-"}
              optionData={["active", "blocked", "dormant"]}
              inputContainerClassName="min-w-[100px] pt-0 pb-0 pr-2 pl-0 text-center"
              optionClassName="font-semibold opacity-60 text-sm"
              labelClassname="hidden"
              onChange={(val) => handlestatusChange({ userStatus: val })}
            />
          </td>

          {/* <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                  
                     <span className="cursor-pointer inline-block px-1" onClick={() => onClick.handleTutorStatus(item,)}>
                        {item.block === false ? 'Active' : item.userType === 'parent' || item.userType === 'student' ? 'Blocked' : 'Dormant'}
                     </span>

                  </div>
               </td>  */}
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">
              {item.specialization?.map((specialization, idx) => {
                return `${specialization}${
                  idx + 1 === item.specialization.length ? "" : ","
                }`;
              })}
            </div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{getFormattedDate(item.createdAt)}</div>
          </td>

          <td className="font-medium px-1 min-w-14 py-4">
          {item.userType !== "admin" ? (
            <div className="w-4 h-4 rounded-full bg-[#E3E3E3] flex items-center justify-center">
              
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
        </tr>
      )}
      {dataFor === "allUsersSuperAdmin" && (
        <tr className="odd:bg-white shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-8">
          <td className="font-medium text-sm px-1  min-w-14 py-4  text-left">
            <span
              className="inline-block cursor-pointer pl-4"
              onClick={() => onClick.redirect(item)}
            >
              {item.name}
            </span>
          </td>
          <td className="font-medium text-sm px-1 min-w-14 py-4">
            <div className="my-[6px]">{item.userType}</div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.email}</div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">
              {item.lastLogin ? item.lastLogin : "-"}
            </div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">

            </div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="">
              <button
                className="rounded-md bg-[#26435F3B] text-[#517CA8] px-2 py-[2px]"
                onClick={() => onClick.handleResetPassword(item.email)}
              >
                Reset
              </button>
            </div>
          </td>
          {/*  <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     {item.phone}
                  </div>
               </td>
              <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     {item.assignedTutor?.length > 0 ?
                        item.assignedTutor?.map((id, idx) => {
                           const name = extraData.find(item => item._id === id)
                           if (name === undefined) return 'l'
                           return `${name.value} ${idx + 1 < item.assignedTutor.length ? ',' : ''} `
                        }) : '-'
                     }
                  </div>
               </td>
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     <InputSelect value={leadStatus ? leadStatus : '-'}
                        optionData={settings.leadStatus}
                        inputContainerClassName='min-w-[100px] pt-0 pb-0 pr-2 pl-0 text-center'
                        optionClassName='font-semibold opacity-60 text-sm'
                        labelClassname='hidden'
                        onChange={val => handleChange({ leadStatus: val })} />
                  </div>
               </td>
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <InputSelect value={item.userStatus ? item.userStatus : '-'}
                     optionData={['active', 'blocked', 'dormant']}
                     inputContainerClassName='min-w-[100px] pt-0 pb-0 pr-2 pl-0 text-center'
                     optionClassName='font-semibold opacity-60 text-sm'
                     labelClassname='hidden'
                     onChange={val => handlestatusChange({ userStatus: val })} />
               </td>
               
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                  
                     <span className="cursor-pointer inline-block px-1" onClick={() => onClick.handleTutorStatus(item,)}>
                        {item.block === false ? 'Active' : item.userType === 'parent' || item.userType === 'student' ? 'Blocked' : 'Dormant'}
                     </span>

                  </div>
               </td> 
               <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     {item.specialization?.map((specialization, idx) => {
                        return `${specialization}${idx + 1 === item.specialization.length ? '' : ','}`
                     })}
                  </div>
               </td> */}
          {/* <td className="font-medium text-sm px-1  min-w-14 py-4">
                  <div className="my-[6px]">
                     {getFormattedDate(item.createdAt)}
                  </div>
               </td> */}
          <td className="font-medium px-1 min-w-14 py-4">
            <div className="w-4 h-4 rounded-full bg-[#E3E3E3] flex items-center justify-center">
              <img
                src={TrashIcon}
                className="cursor-pointer"
                onClick={() => onClick.handleDelete(item)}
              />
            </div>
          </td>
        </tr>
      )}
      {dataFor === "assignedTests" && (
        <tr className="odd:bg-white text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-8">
          <td className="px-1 font-medium  min-w-14 py-4 text-left">
            <span className="inline-block cursor-pointer pl-4">
              {item.studentName}
            </span>
          </td>
          <td
            className={`font-medium px-1 flex justify-center items-center min-w-14 py-4 relative ${
              item.late && "text-[#EE3434]"
            }`}
          >
            {item.late && (
              <span className="inline-block w-[20px] h-[20px] rounded-full bg-[#EE3434]"></span>
            )}
            {item.assignedOn}
          </td>
          <td className="font-medium px-1  min-w-14 py-4">{item.assignedBy}</td>
          <td className="font-medium px-1  min-w-14 py-4">{item.dueDate}</td>
          <td className="font-medium px-1  min-w-14 py-4">{item.testName}</td>
          <td className="font-medium px-1  min-w-14 py-4">
            {item.duration === "-" ? "Unlimited" : item.duration}
          </td>
          <td className="font-medium px-1  min-w-14 py-4">
            <div className={`flex items-center no-wrap justify-center`}>
              {returnStatus(item.status)}
              {/* {returnStatus(item.status)} */}
            </div>
          </td>
          <td
            className="font-medium px-1 test-center text-left min-w-14 py-4"
            // style={{ padding: 0,}}
          >
            <div className="text-center">
              {item.status === "completed" ? score : "-"}
            </div>
          </td>
          <td className="font-medium px-1  min-w-14 py-4">
            <button
              className={`px-2.5 py-1.8 rounded-md flex items-center leading-none bg-primary text-white ${
                item.status !== "completed" && item.status !== "started"
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              
              onClick={() =>
                navigate(
                  `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId}`
                )
              }
            >
              Test details
            </button>
          </td>
          <td className="font-medium px-1 min-w-14 py-4">
            <img
              src={DownloadIcon}
              className="w-[30px] cursor-pointer"
              onClick={() => handlePdfNavigate()}
            />
          </td>
          {/* <td className="font-medium px-1 min-w-14 py-4">
                  <img
                     src={ResendConfirmation}
                     className="cursor-pointer"
                     onClick={() => onClick.handleResend(item)}
                  />
               </td> */}
          <td className="font-medium px-1 min-w-14 py-4">
            {/* <img
                     src={RedIcon}
                     className="cursor-pointer w-5 relative"
                     onClick={() => onClick.handleDelete(item)}
                  /> */}
            <div
              className="bg-[#FF5555] rounded-full relative w-5 h-5 text-white text-21 cursor-pointer"
              onClick={() => onClick.handleDelete(item)}
            >
              <span className="absolute top-[-7px] left-[3.5px]">×</span>
            </div>
          </td>
        </tr>
      )}

      {dataFor === "tests" && (
        <tr className="odd:bg-white text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-7">
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
        <tr className="odd:bg-white text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-7">
          {MapData(item, "assignedStudents", excludes, onClick)}
          {/* <td>
                  <img src={RemoveIcon} />
               </td> */}
        </tr>
      )}
      {dataFor === "studentTestsReport" && (
        <tr
          className={`text-sm shadow-sm shadow-slate-200 rounded-2xl leading-7 ${
            !item.isCorrect
              ? "bg-[#e02b1d]/5"
              : "odd:bg-white  even:bg-primaryWhite-300"
          } `}
        >
          {MapData(item)}
        </tr>
      )}
      {dataFor === "studentTestsReportSmall" && (
        <tr
          className={`text-sm shadow-sm shadow-slate-200  rounded-2xl leading-7 ${
            !item.isCorrect
              ? "bg-[#e02b1d]/5"
              : "odd:bg-white  even:bg-primaryWhite-300"
          } `}
        >
          {MapData(item)}
        </tr>
      )}
      {dataFor === "studentTestsAnswers" && (
        <tr className="odd:bg-white text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-7">
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
        <tr className="odd:bg-white shadow-sm text-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-7">
          {Object.keys(item).map((key, i) =>
            excludes.includes(key) ? (
              <></>
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
                ) : (
                  item[key]
                )}
              </td>
            )
          )}
          <td className="font-medium px-1  min-w-14 py-4">
            <div className="flex items-center">
              <img
                src={DownloadIcon}
                className="w-[30px] cursor-pointer"
                onClick={() => handlePdfNavigate()}
              />
              {persona === "parent" ? (
                <>
                  <button
                    className={`px-2.5 py-1.8 rounded-md flex items-center leading-none bg-primary text-white ml-4 ${
                      item.isCompleted === false
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                    onClick={() =>
                      navigate(
                        `/assigned-tests/${item.testId}/${item.assignedTestId}/report/${item.studentId._id}`
                      )
                    }
                  >
                    View Report
                  </button>
                </>
              ) : (
                <>
                  {item.isCompleted ? (
                    <button
                      className="px-2.5 py-1.8 rounded-md flex items-center leading-none bg-primary text-white ml-4"
                      onClick={() =>
                        navigate(
                          `/assigned-tests/${item.testId}/${item.assignedTestId}/report/`
                        )
                      }
                    >
                      View Report
                    </button>
                  ) : item.isStarted ? (
                    <button
                      className="px-2.5 py-1.8 rounded-md flex items-center leading-none bg-primary text-white ml-4"
                      onClick={() =>
                        navigate(
                          `/all-tests/start-section/${item.testId}/${item.assignedTestId}`
                        )
                      }
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      className="px-2.5 py-1.8 rounded-md flex items-center leading-none bg-primary text-white ml-4"
                      onClick={() =>
                        navigate(
                          `/all-tests/start-section/${item.testId}/${item.assignedTestId}`
                        )
                      }
                    >
                      Start Test
                    </button>
                  )}
                </>
              )}
            </div>
          </td>
        </tr>
      )}
      {dataFor === "invoice" && (
        <tr className="bg-white text-sm shadow-sm shadow-slate-200 rounded-2xl leading-7 mt-[10px]">
          {MapData(item, dataFor, excludes, onClick)}
        </tr>
      )}
      {dataFor === "testsDetailQuestions" && (
        <tr className="bg-white text-sm shadow-sm shadow-slate-200 rounded-2xl leading-7 mt-[10px]">
          {MapData(item, dataFor, excludes)}
          <td className="font-medium px-1 min-w-14 py-4">
            <img
              src={EditTestIcon}
              className="cursor-pointer"
              onClick={() => onClick.handleEditTestClick(item)}
            />
          </td>
        </tr>
      )}
      {dataFor === "allTests" && (
        <tr className="odd:bg-white font-medium text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl lead">
          <td>{item.testName}</td>
          <td>{item.testType}</td>
          <td>{item.createdAt.split("T")[0]}</td>
          <td>{item.updatedAt.split("T")[0]}</td>
          <td> {item.no_of_assign ? item.no_of_assign : "-"} </td>
          <td className="font-medium px-1 py-4 text-right">
            <div className="flex justify-end">
              <button
                className="flex leading-none bg-[#FFA28D] text-white py-1.5 px-5 cursor-pointer rounded"
                onClick={() => navigate(`/all-tests/${item._id}`)}
              >
                View
              </button>
            </div>
          </td>
          <td className="font-medium px-1 justify-center flex gap-x-2">
            <button
              className="flex leading-none bg-[#26435f4d] text-white py-1.5 px-5 cursor-pointer rounded"
              onClick={() => onClick.openRemoveTestModal(item)}
            >
              Remove
            </button>
          </td>
        </tr>
      )}
      {dataFor === "allTestsSuperAdmin" && (
        <tr className="odd:bg-white font-medium text-sm shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl lead">
          <td>{item.testName}</td>
          <td>{item.testType}</td>
          <td>{item.createdAt.split("T")[0]}</td>
          <td>{item.updatedAt.split("T")[0]}</td>
          <td> {item.no_of_assign ? item.no_of_assign : "-"} </td>
          <td className="font-medium px-1 py-4 text-right">
            <div className="flex justify-center">
              <p
                className="flex leading-none text-[#517CA8] underline py-1.8 px-0 underline-offset-1 cursor-pointer rounded"
                onClick={() => navigate(`/all-tests/${item._id}`)}
              >
                View
              </p>
            </div>
          </td>
          <td className="font-medium px-1 justify-center flex gap-x-2">
            <img
              src={EditIcon}
              className="cursor-pointer p-1"
              onClick={() => navigate(`/all-tests/${item._id}`)}
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
              <button className="px-4 py-1 text-[#517CA8] bg-[#517CA81A] ">
                Beta
              </button>
              <img src={AddIcon} alt="add" className="" />
            </div>
          </td>
        </tr>
      )}
      {dataFor === "assignedTutors" && (
        <tr className="bg-white text-sm shadow-sm shadow-slate-200 rounded-2xl leading-7 mt-[10px]">
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
        <tr className="odd:bg-white shadow-sm shadow-slate-200 even:bg-primaryWhite-300 rounded-2xl leading-8">
          <td className="font-medium text-sm px-1  min-w-14 py-4  text-left">
            <span
              className="inline-block cursor-pointer pl-4"
              onClick={() => navigate(`/orgadmin-profile/${item._id}`)}
            >
              {item.associatedOrg?.company
                ? item.associatedOrg?.company
                : item.company}
            </span>
          </td>
          <td className="font-medium text-sm px-1 min-w-14 py-4">
            <div className="my-[6px]">{item.associatedOrg?.companyType}</div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.associatedOrg?.address}</div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.associatedOrg?.city}</div>
          </td>

          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.associatedOrg?.state}</div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.associatedOrg?.country}</div>
          </td>

          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.firstName}</div>
          </td>

          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.email}</div>
          </td>

          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.phone}</div>
          </td>

          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">active</div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">{item.associatedOrg?.numberOfTutors}</div>
          </td>
          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">
              {item.associatedOrg?.numberOfActiveStudent}
            </div>
          </td>

          <td className="font-medium text-sm px-1  min-w-14 py-4">
            <div className="my-[6px]">contributors</div>
          </td>
        </tr>
      )}
    </>
  );
}

const MapData = (data, dataFor, exclude = [], onClick) => {
  // console.log(data.remark);
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
      <></>
    ) : key === "isCorrect" ? (
      <td key={i} className="font-medium px-1  min-w-14 py-4">
        <div className="flex items-center justify-center">
          <img
            src={data[key] === true ? SuccessIcon : FailIcon}
            className="flex"
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
          className={`pl-4 ${
            key === "name" ? "text-left cursor-pointer" : ""
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
            value={data[key] ? data[key] : "-"}
            optionData={
              data[key] === "paid"
                ? ["paid", "cancelled"]
                : ["paid", "draft", "cancelled", "unpaid"]
            }
            inputContainerClassName="min-w-[100px] pt-0 pb-0 pr-2 pl-0 text-center"
            optionClassName="font-semibold opacity-60 text-sm"
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
        className={`font-medium px-1 ${
          data[key] === "Unpaid" && "text-[#E02B1D]"
        } ${data[key] === "Paid" && "text-[#009262]"} ${
          data[key] === "Cancelled" && "text-[#7C859C]"
        } min-w-14 py-4`}
      >
        {data[key]}
      </td>
    )
  );
};
