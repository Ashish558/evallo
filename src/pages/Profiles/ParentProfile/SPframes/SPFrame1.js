import React, { useState } from "react";
import styles from "../style.module.css";
import { useSelector } from "react-redux";
import EditableText from "../../../../components/EditableText/EditableText";
import fileupload from "../../../../assets/icons/basil_file-upload-outline (2).svg";
import BCut from "../../../../assets/YIcons/BCut.svg";
import {
  useAddAssociatedDocStudentMutation,
  useUpdateUserDetailsMutation,
} from "../../../../app/services/users";
import InputSelectNew from "../../../../components/InputSelectNew/InputSelectNew";
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
  //console.log("frame1", { userDetail, xlsFile });
  return (
    <div className="flex w-full justify-between mt-5">
      <div className="flex flex-col gap-3 !w-[calc(813*0.0522vw)]">
        <div className="flex justify-between gap-7">
          <div className=" !w-[calc(545*0.0522vw)]">
            <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1 custom-scroller">
              Internal Notes
            </p>
            <div className="bg-white flex-1 text-base-17-5 p-2 text-[#B5B5B5] h-[200px] rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040]">
              Add notes about the parent. Here are some ideas to get you
              started:
              <ul className="list">
                <li>How did the initial call go?</li>
                <li>What is the parent’s budget?</li>
                <li>What timeline do they have in mind for tutoring?</li>
                <li>Has the student been tutored before?</li>
                <li>Do they prefer online or offline tutoring?</li>
                <li>Does the student have siblings?</li>
              </ul>
            </div>
          </div>
          <div className="flex-1 flex flex-col h-[200px] gap-8">
            <div className="flex-1  ">
              <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
                Lead Status
              </p>
              <div className=" flex-1  rounded-md h-full  h-[50px] ">
                <InputSelectNew
                  placeholder={"Lead Status"}
                  parentClassName="ml-0 w-full  items-center flex text-[#517CA8] text-xs px-2 whitespace-nowrap "
                  inputContainerClassName="bg-white h-[45px] shadow-[0px_0px_2.500001907348633px_0px_#00000040] my-0 py-[5px] px-[35px]"
                  placeHolderClass="text-[#517CA8] "
                  labelClassname="text-sm"
                  inputClassName="bg-transparent"
                  value={""}
                  IconDemography={true}
                  optionData={["Interested"]}
                />
              </div>
            </div>
            <div className="flex-1">
              <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
                Services
              </p>
              <div className="bg-white flex-1  rounded-md h-full shadow-[0px_0px_2.500001907348633px_0px_#00000040]"></div>
            </div>
          </div>
        </div>
        <div className="">
          <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
            Sign up form details
          </p>
          <div className="bg-white flex-1 h-[200px] rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] custom-scroller"></div>
        </div>
      </div>
      <div className="!w-[calc(757*0.0522vw)]">
        <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
          Session Notes
        </p>
        <div className="bg-white flex-1 h-[435px] rounded-md custom-scroller shadow-[0px_0px_2.500001907348633px_0px_#00000040]">
          <div className="mx-6 p-2 ">
            <button
              className={`rounded-[50px] px-2 mr-5 py-1 text-base-15 ${
                true
                  ? "bg-[#FFA28D] text-white"
                  : "bg-white text-[#FFA28D] border border-[#FFA28D]"
              }`}
            >
              Client Notes
            </button>
            <button
              className={`rounded-[50px] px-2 py-1 text-base-15 ${
                false
                  ? "bg-[#FFA28D] text-white"
                  : "bg-white text-[#FFA28D] border border-[#FFA28D]"
              }`}
            >
              Internal Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPFrame1;
