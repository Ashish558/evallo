import React, { useState } from "react";
import styles from "../style.module.css";
import { useSelector } from "react-redux";
import EditableText from "../../../../components/EditableText/EditableText";
import fileupload from "../../../../assets/icons/basil_file-upload-outline (2).svg";
import Drop from "../../../../assets/YIcons/Drop.svg";
import {
  useAddAssociatedDocStudentMutation,
  useUpdateUserDetailsMutation,
} from "../../../../app/services/users";

import InputSelectNew from "../../../../components/InputSelectNew/InputSelectNew";

let signupData = [
  {
    label: "First Name",
    key: "FirstName",
  },
  {
    label: "Last Name",
    key: "LastName",
  },
  {
    label: "Email",
    key: "Email",
  },
  {
    label: "Phone",
    key: "Phone",
  },
  {
    label: "Are You A Student Or A Parent?",
    default: "Parent",
  },
  {
    label: "What Service(S) Are You Seeking?",
    key: "serviceSeeking",
  },
  {
    label: "School",
    key: "schoolName",
  },
  {
    label: "Grade",
    key: "grade",
  },
  {
    label: "Do You Have Any Accomodations?",
    key: "",
  },
];
const SPFrame1 = ({
  userId,
  settings,
  userDetail,
  editable,
  setToEdit,
  toEdit,
  fetchDetails,
}) => {
  const [xlsFile, setXlsFile] = useState({});

  const {organization}= useSelector((state)=>state.organization)
  const [internal, setInternal] = useState(false);
  const { awsLink } = useSelector((state) => state.user);
  const [addDoc, addDocStatus] = useAddAssociatedDocStudentMutation();
  const [updateDetails, updateDetailsResp] = useUpdateUserDetailsMutation();
  const reduceArr = (id, update) => {
    //  console.log({toEdit})
    let temp = [...toEdit?.whiteBoardLinks?.whiteBoardLinks];
    temp = temp?.filter((item, idd) => idd !== id);

    if (update) {
      handleSubmit(temp);
    }
  };
  const addDocHandler = () => {
    if (!xlsFile || !xlsFile.name) {
      return;
    }
    const formData = new FormData();
    formData.append("file", xlsFile);
    formData.append("studentId", userDetail?._id);
    addDoc(formData).then((res) => {
      console.log("docc", res);
      if (res?.data) {
        alert(res?.data?.message);
        setXlsFile({});
      }
    });
  };
  //console.log({ settings, userDetail });
  const handleSubmit = (e) => {
    //e.preventDefault();
    // setLoading(true);
    let reqBody = { whiteBoardLinks: e };
    // delete reqBody["active"];
    console.log({ reqBody, id: userId });
    const userDetailSave = (reqBody) => {
      console.log({ reqBody, userDetail });
      // return
      updateDetails({ id: userId, fields: reqBody }).then((res) => {
        console.log(res);
        //setLoading(false);
        fetchDetails(true, true);
        // handleClose()
      });
    };

    userDetailSave(reqBody);
  };
const handleLeadStatus=(e)=>{
  const reqBody={
    leadStatus:e
  }
  updateDetails({ id: userId, fields: reqBody }).then((res)=>{
    console.log("leadStatus",e,{res})
    fetchDetails(true, true);
  })
}
  //console.log("frame1", { userDetail, xlsFile });
  return (
    <div className="flex w-full justify-between ">
      <div className="flex flex-col gap-3 !w-[calc(813*0.0522vw)]">
        <div className="flex justify-between gap-7">
          <div className=" !w-[calc(545*0.0522vw)]">
            <div className="flex justify-between">
              <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1 custom-scroller">
                Internal Notes
              </p>
              <EditableText
                editable={editable}
                onClick={() =>
                  setToEdit({
                    ...toEdit,
                    notes: { ...toEdit.notes, active: true },
                  })
                }
                text="Edit"
                textClassName=" ml-2 text-sm  mx-auto text-center text-[#26435F] text-underline text-base-15 "
                className="text-sm my-0 flex items-center justify-center text-center   "
              />
            </div>

            <div className="bg-white flex-1 text-base-17-5 p-3 text-[#B5B5B5] h-fit rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040]">
              Add notes about the parent. Here are some ideas to get you
              started:
              <ul className="list-disc px-4 design:px-5">
                <li>How did the initial call go?</li>
                <li>What is the parent’s budget?</li>
                <li>What timeline do they have in mind for tutoring?</li>
                <li>Has the student been tutored before?</li>
                <li>Do they prefer online or offline tutoring?</li>
                <li>Does the student have siblings?</li>
              </ul>
            </div>
          </div>
          <div className="flex-1 flex flex-col h-fit gap-4">
            <div className="flex-1  ">
            <div className="flex justify-between">
              <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
                Lead Status
              </p>
             
              </div>
              <div className=" flex-1  rounded-md h-full  h-[50px] ">
                <InputSelectNew
                  placeholder={"Lead Status"}
                  parentClassName="ml-0 w-full  items-center flex text-[#517CA8] text-xs  whitespace-nowrap "
                  inputContainerClassName="bg-white h-[45px] shadow-[0px_0px_2.500001907348633px_0px_#00000040] my-0 py-[5px] px-[35px]"
                  placeHolderClass="text-[#517CA8] "
                  labelClassname="text-sm"
                  inputClassName="bg-transparent"
                  Icon={Drop}
                  value={userDetail?.leadStatus}
                  optionData={organization?.settings?.leadStatus}
                  onChange={(e) => {
                    handleLeadStatus(e)
                   
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
            <div className="flex justify-between">
              <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
                Services
              </p>
              <EditableText
                editable={editable}
                onClick={() =>
                  setToEdit({
                    ...toEdit,
                    service: { ...toEdit.service, active: true },
                  })
                }
                text="Edit"
                textClassName=" ml-2 text-sm  mx-auto text-center text-[#26435F] text-underline text-base-15 "
                className="text-sm my-0 flex items-center justify-center text-center   "
              />
              </div>
              <div className="bg-white flex-1 custom-scroller text-[#517CA8] p-2 text-base-17-5 h-[80px] design:h-[120px] overflow-y-auto rounded-md  shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex flex-col gap-1 justify-start">
                {userDetail?.service?.map((it, id) => {
                  return <p key={id}>{it}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
            Sign up form details
          </p>
          <div className="bg-white flex-1 h-[200px] p-3 custom-scroller  overflow-y-auto  flex flex-col rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller">
            {signupData?.map((it, id) => {
              return (
                <p key={id} className="flex gap-3 my-2 text-base-17-5">
                  <span className="text-[#517CA8] font-semibold">
                    {" "}
                    {it.label}{" "}
                  </span>
                  <span>:</span>

                  <span className="text-[#517CA8] font-medium">
                    {it?.key ? userDetail[it.key] : it?.default}
                  </span>
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <div className="!w-[calc(757*0.0522vw)]">
        <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
          Session Notes
        </p>
        <div className="bg-white flex-1 h-[410px] rounded-md custom-scroller shadow-[0px_0px_2.500001907348633px_0px_#00000040]">
          <div className="mx-6 p-2 ">
            <button
              onClick={() => {
                setInternal(false);
              }}
              className={`rounded-[50px] px-2 mr-5 py-1 text-base-15 ${
                !internal
                  ? "bg-[#FFA28D] text-white"
                  : "bg-white text-[#FFA28D] border border-[#FFA28D]"
              }`}
            >
              Client Notes
            </button>
            <button
              onClick={() => {
                setInternal(true);
              }}
              className={`rounded-[50px] px-2 py-1 text-base-15 ${
                internal
                  ? "bg-[#FFA28D] text-white"
                  : "bg-white text-[#FFA28D] border border-[#FFA28D]"
              }`}
            >
              Internal Notes
            </button>
          </div>
          <div className="flex flex-col h-[400px]   bg-[#FFFFFF] ">
            <ul className="list-disc rounded-b-md overflow-y-scroll custom-scroller h-full ">
              {[{ message: "Hii", createdAt: new Date() }]?.map(
                (item, index) => (
                  <>
                    <div key={index} className="flex h-[57px] pl-5 relative ">
                      <p className="text-[#517CA8] pt-6 !font-medium text-[14px] mr-2 w-[calc(143*0.050vw)] text-center !text-[calc(17.5*0.050vw)] whitespace-nowrap">
                        {item?.message &&
                          new Date(item.createdAt)
                            .toDateString()
                            .split(" ")[1] +
                            " " +
                            new Date(item.createdAt)
                              .toDateString()
                              .split(" ")[2] +
                            ", " +
                            new Date(item.createdAt)
                              .toDateString()
                              .split(" ")[3]}
                      </p>
                      <div className={`pt-5 ${styles.actionBorder}`}>
                        <div className={styles.circle}>
                          <div className={styles.circle2}></div>
                        </div>
                        <p className="pl-4  font-medium text-[#517CA8] text-[15.5px] !text-[calc(17.5*0.050vw)]">
                          {item?.message}
                        </p>
                      </div>
                    </div>
                  </>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPFrame1;
