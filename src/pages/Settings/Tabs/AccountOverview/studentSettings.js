import React, { useEffect } from "react";
import InputField from "../../../../components/InputField/inputField";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import { CheckboxNew } from "../../../../components/Checkbox/CheckboxNew";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import { studentServedData, instructionFormat } from "../staticData";
import logo from "../../../../assets/icons/Frame 31070.svg";
import caution from "../../../../assets/icons/octicon_stop-16.svg";
import resetSendIcon from "../../../../assets/icons/teenyicons_shield-tick-solid.svg";
import tooltipIcon from "../../../../assets/icons/octicon_stop-16.svg";
import { useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import { useForgotPasswordMutation } from "../../../../app/services/auth";
import {
  useLazyGetPersonalDetailQuery,
  useUpdateUserAccountMutation,
} from "../../../../app/services/users";
import { BASE_URL, getAuthHeader } from "../../../../app/constants/constants";
import InputFieldDropdown from "../../../../components/InputField/inputFieldDropdown";
import { useUpdateEmailMutation } from "../../../../app/services/organization";
import { useStudentFeedbackMutaion, useStudentFeedbackMutation } from "../../../../app/services/settings";
const StudentSettings = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [reset, setReset] = useState(false);
  const [forgotPassword, forgotPasswordResp] = useForgotPasswordMutation();
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subscriptionCode: "",
    company: "",
  });
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    userId: "",
    registrationAs: "Company",

    orgName: "",
    companyType: "",
    website: "",
    address: "",
    country: "",
    state: "",
    zip: "",
    city: "",

    activeStudents: "",
    activeTutors: "",
    services: [],
  });
  const [updateEmail, setUpdateEmail] = useUpdateEmailMutation();
  const [userDetails, userDetailsStatus] = useLazyGetPersonalDetailQuery();
  const [updateAccount, updateAccountStatus] = useUpdateUserAccountMutation();
  const [studentFeedback,setStatus]=useStudentFeedbackMutation()
  const [fetchedData, setFetchedData] = useState({});
  const [saving,setSaving]= useState(false)
  useEffect(() => {
    setSaving(true)
    userDetails()
      .then((res) => {
        setValues({
          ...res?.data.data.user,
        });
        setFetchedData({
          ...res?.data.data.user,
        });
        setSaving(false)
      })
      .catch((err) => {
        setSaving(false)
        console.log(err);
      });
  }, []);

  const handleEmailUpdate = (email) => {
    console.log("Email Updation invoked", email);
    if (email !== "")
      updateEmail({ email }).then((res) => {
        console.log("Email Link sent", res);
      });
  };
  const handleDataUpdate = () => {
    setSaving(true)
    const updateUserAccount = async () => {
      try {
        let reqBody = { ...values };
        delete reqBody["_id"];
        delete reqBody["email"];

        updateAccount(reqBody)
          .then((res) => {
            alert("Account details updated succesfully")
            console.log(res);
            setSaving(false)
          })
          .catch((err) => {
            setSaving(false)
            console.log(err?.message);
          });
      } catch (e) {
        setSaving(false)
        console.error(e?.response?.data?.message);
      }
    };
    updateUserAccount();
    if (fetchedData?.email !== values.email) handleEmailUpdate(values.email);
    console.log({ fetchedData, values });
  };
  const showResetConfirmation = () => {
    setReset(true);
    handlePasswordReset();
    handleClose();
  };

  const handleCheckboxChange = (text, arr, setValue) => {
    console.log(arr);
    const temp = arr.map((topic) => {
      return topic.text === text
        ? { ...topic, checked: !topic.checked }
        : { ...topic };
    });
    setValue(temp);
  };

  const handleClose = () => {
    setModalOpen(!modalOpen);
  };

  const handlePasswordReset = () => {
    forgotPassword({ email: values.email }).then((res) => {
      if (res.error) {
        console.log(res.error);
        alert(res.error.data.message);
        return;
      }
      console.log(res.data);
      alert("Password reset link sent to your email.");
    });
  };
const handleFirstName=(e)=>{
  setValues({
    ...values,
    firstName: e.target.value,
  })
}
const [feedBack,setFeedback]=useState({
  tech:"",
  support:"",
})
const handleFeedback=(message,type)=>{
  console.log({message,feedBack})
  const body={
message,type
  }
  studentFeedback(body).then((res)=>{
    console.log({res})
  })
}
  return (
    <div>
      <div className="flex flex-col gap-10  mx-[100px] my-12 design:mx-[160px] design:my-[60px]">
        <div className="text-[#24A3D9] font-lexend-deca text-md design:text-xl  font-semibold leading-normal">
          <span className=" font-medium ">Student</span>
          <span className="font-semibold">{"  > Settings"}</span>
        </div>
        <div className="flex gap-5">
          <InputField
            placeholder=""
            labelClassname=" text-md text-[#26435F] font-semibold"
            parentClassName="text-[#26435F]"
            inputContainerClassName=" bg-white  border border-white text-[#667085]"
            inputClassName=" text-400 bg-transparent"
            label="First Name"
            value={values.firstName}
            onChange={(e) =>
              handleFirstName(e)
            }
            error={error.firstName}
          />

          <InputField
            placeholder=""
            labelClassname=" text-md text-[#26435F] font-semibold"
            parentClassName="text-[#26435F]"
            inputContainerClassName=" bg-white border border-white text-[#667085]"
            inputClassName=" text-400 bg-transparent"
            label="Last Name"
            value={values.lastName}
            onChange={(e) =>
              setValues({
                ...values,
                lastName: e.target.value,
              })
            }
            error={error.lastName}
          />

          <InputField
            IconLeft={caution}
            placeholder=""
            labelClassname=" text-md text-[#26435F] font-semibold"
            parentClassName="text-[#26435F] w-[calc(376*0.05050vw)] min-w-[230px] text-[calc(17.5*0.05050vw)]"
            inputContainerClassName=" bg-white border border-white text-[#667085]"
            inputClassName=" text-400 bg-transparent "
            label="Email"
            
            value={values.email}
            onChange={(e) => {
              setValues({
                ...values,
                email: e.target.value,
              });
            }}
            error={error.email}
            Tooltip={
              <span className="absolute top-10 w-[200px] scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                <h3 className="text-[#24A3D9] font-semibold mb-1">
                  Email Confirmation Sent
                </h3>
                You need to verify your email if
                <ul className="list-disc pl-3 mb-2">
                  <li>you created a new account.</li>
                  <li>you recently changed your email.</li>
                </ul>
                We have sent you an email verification link to your current
                email address to make sure that it really is you who requested a
                change.
              </span>
            }
          />
         
            <InputFieldDropdown
              placeholder=""
              labelClassname=" text-md text-[#26435F] font-semibold mb-[1px]"
              parentClassName="text-[#26435F] w-[calc(376*0.05050vw)] min-w-[230px] "
              inputContainerClassName=" bg-white border  border-white text-[#667085]"
              inputClassName=" text-400 !py-1 !text-[17px] bg-transparent "
              label="Phone"
              value={values.phone}
              codeValue={values.phoneCode}
              handleCodeChange={(e) =>
                setValues({
                  ...values,
                  phoneCode: e.target.value,
                })
              }
              onChange={(e) =>
                setValues({
                  ...values,
                  phone: e.target.value,
                })
              }
              error={error.phone}
            />
         
          <div>
            <PrimaryButton
              onClick={handleDataUpdate}
              disabled={saving}
              loading={saving}
              className={`bg-[#FFA28D]  mt-5 ml-10 rounded-md px-10 py-2 text-sm text-white  `}
            >
              Save
            </PrimaryButton>
          </div>
        </div>

        <div className="flex gap-7 flex-1">
          <div>
            <h1 className="my-0 mb-1 text-[#26435F] font-semibold text-sm">
              Send Link
            </h1>
            <button
              onClick={handleClose}
              className="bg-[#517CA8] text-white rounded-md  px-3 py-2 text-sm"
            >
              Reset Password
            </button>
          </div>
        </div>
        <div>
          {reset && (
            <div className="flex -mt-3 gap-2 text-xs">
              <p className="bg-[rgba(119,221,119,0.2)] rounded-xl text-[11px] text-[#77DD77] px-3 py-1">
                <img className="inline-block mr-3" src={resetSendIcon} alt="" />
                Password Reset Link Sent To {values?.email}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-between gap-20 mt-16">
          <div className="flex-1">
            <p className=" text-sm text-[#26435F] font-semibold">
              Submit Feedback
            </p>
            <textarea
                rows="3"
                value={feedBack?.support}
                onChange={(e)=>{
                  setFeedback({
                    ...feedBack,
                    support: e.target.value 
                  })
                }}
                className="mt-1 block w-full h-[180px] resize-none focus:!ring-blue-500 p-2 focus:!border-blue-500 placeholder-[#CBD6E2] text-sm  placeholder:text-xs "
                placeholder=" If you have any feedback for this online platform, please submit
                it here. Our team takes every suggestion seriously."
              ></textarea>
          
           
            <button
              onClick={()=>{
                handleFeedback(feedBack.support,"feedback")
              }}
              className="bg-[#517CA8] text-white rounded-md mt-2 float-right px-4 py-2 text-xs"
            >
              Submit
            </button>
          </div>
          <div className="flex-1">
            <p className=" text-sm text-[#26435F] font-semibold ">
              Request Technical Support
            </p>
           
              <textarea
                rows="3"
                value={feedBack?.tech}
                onChange={(e)=>{
                  setFeedback({
                    ...feedBack,
                    tech: e.target.value 
                  })
                }}

                className="mt-1 block w-full h-[180px] resize-none focus:!ring-blue-500 p-2 focus:!border-blue-500 placeholder-[#CBD6E2] text-sm  placeholder:text-xs "
                placeholder=" If you require technical support, please submit your request here
                
              and our team will help you out accordingly."
              ></textarea>
          
            <button
               onClick={()=>{
                handleFeedback(feedBack.tech,"")
              }}
              className="bg-[#517CA8] text-white rounded-md mt-2 float-right px-4 py-2 text-xs"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      {modalOpen && (
        <Modal
          handleClose={handleClose}
          classname="w-[500px] mx-auto"
          body={
            <div className="text-center mt-2">
              <h1 className="font-semibold ">
                A Password Reset Link will be sent to you. Please click on it to
                change your password.
              </h1>
              <button
                onClick={showResetConfirmation}
                className="bg-[#FF7979] mt-3 text-white text-sm p-2 px-4 rounded-md"
              >
                Okay
              </button>
            </div>
          }
        />
      )}
    </div>
  );
};

export default StudentSettings;
