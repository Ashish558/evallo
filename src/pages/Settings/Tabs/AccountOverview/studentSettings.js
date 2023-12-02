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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const StudentSettings = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [reset, setReset] = useState(false);
  const [forgotPassword, forgotPasswordResp] = useForgotPasswordMutation();
  const { firstName, lastName } = useSelector((state) => state.user);

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
  const { role: persona } = useSelector(state => state.user)
  const { organization } = useSelector(state => state.organization)
  const [updateAccount, updateAccountStatus] = useUpdateUserAccountMutation();
  const [studentFeedback, setStatus] = useStudentFeedbackMutation()
  const [fetchedData, setFetchedData] = useState({});
  const [saving, setSaving] = useState(false)
  const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
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
  const handleEmpty = (val) => {
    if (!val || val.length === 0 || val?.trim()?.length === 0) {
      return true;
    }
    return false;
  };
  const handleDataUpdate = () => {
  
    let arr=["firstName", "lastName", "email"]
    let  emptyCheck=false;
    for (let i=0; i<arr.length; i++) {
      if(handleEmpty(values[arr[i]])) {
        alert(`${arr[i]} cannot be empty.`)
       emptyCheck=true;
        return false;
      }
    }
    if(emptyCheck) return false;
   
    const updateUserAccount = async () => {
      try {
        let reqBody = { ...values };
        delete reqBody["_id"];
        delete reqBody["email"];
        setSaving(true)
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
  const handleFirstName = (e) => {
    const regex = /^[a-zA-Z ]*$/;
    const isValid = regex.test(e.target.value);
    if(isValid)
    setValues({
      ...values,
      firstName: e.target.value,
    })
  }
  const [feedBack, setFeedback] = useState({
    tech: "",
    support: "",
  })
  const navigate = useNavigate()
  const handleFeedback = (message, type) => {
    console.log({ message, feedBack })
    const body = {
      message, type
    }
    studentFeedback(body).then((res) => {
      if (res?.error) {
        alert("Coudn't send feedback , try again")
      }
      if (res?.data) {
        alert("Feedback successfully sent")
      }
      console.log({ res })
    })
  }

  return (
    <div className="w-[83.23vw] mx-auto">
      <div className="flex flex-col gap-10   my-12">
        <div className="text-[#24A3D9] font-lexend-deca text-md design:text-xl  font-semibold leading-normal">
          <span onClick={() => navigate('/')}
            className=" font-medium text-base-22-5 cursor-pointer">{organization?.company + ' > '}   {firstName + ' ' + lastName}</span>

          <span className="font-semibold text-base-22-5">{"  > Settings"}</span>
        </div>
        <div className="flex gap-6 design:gap-8 items-center">
          <InputField
            placeholder=""
            labelClassname="mb-1 text-md text-base-20 text-[#26435F] font-semibold"
            parentClassName="text-[#26435F]"
            inputContainerClassName="h-[50px] bg-white  border border-white text-[#667085]"
            inputClassName=" text-400 bg-transparent"
            label="First name"
            value={values.firstName}
            onChange={(e) =>
              handleFirstName(e)
            }
            error={error.firstName}
          />

          <InputField
            placeholder=""
            labelClassname="mb-1 text-md text-base-20 text-[#26435F] font-semibold"
            parentClassName="text-[#26435F]"
            inputContainerClassName="h-[50px] bg-white border border-white text-[#667085]"
            inputClassName=" text-400 bg-transparent"
            label="Last name"
            value={values.lastName}
            onChange={(e) =>
              {
                const regex = /^[a-zA-Z ]*$/;
                const isValid = regex.test(e.target.value);
                if(isValid)
                setValues({
                  ...values,
                  lastName: e.target.value,
                })
              }
           
            }
            error={error.lastName}
          />

          <InputField
            IconLeft={caution}
            placeholder=""
            labelClassname="mb-1 text-md text-base-20 text-[#26435F] font-semibold"
            parentClassName="text-[#26435F]"
            inputContainerClassName=" h-[50px] bg-white border  w-[calc(376*0.05050vw)] min-w-[230px] border-white text-[#667085]"
            inputClassName=" text-400 bg-transparent"
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

          <div id="number" >
            <InputFieldDropdown
              placeholder=""
              labelClassname=" text-md text-base-20 text-[#26435F] !mb-2 design:!mb-3 font-semibold"
              parentClassName="text-[#26435F]"
              inputContainerClassName="h-[50px] !py-[14px] px-[14px]   flex items-center rounded   bg-white border  min-w-[230px] border-white text-[#667085]  "
              inputClassName=" outline-0 w-full text-[17.5px]  pl-1 placeholder:text-base-17-5  text-400 bg-transparent  text-base-17-5"
              label="Phone"
              value={values.phone}
              codeColor="bg-white"

              codeValue={values.phoneCode}
              handleCodeChange={(e) =>

                setValues({
                  ...values,
                  phoneCode: e.target.value,
                })
              }
              onChange={(e) =>{
                const regex = /^[0-9 ]*$/;
                const isValid = regex.test(e.target.value);
                if (isValid && e.target.value?.length < 11)
                setValues({
                  ...values,
                  phone: e.target.value,
                })
              }
               
              }
              error={error.phone}
            />
          </div>
          <div>
            <PrimaryButton
              onClick={handleDataUpdate}
              disabled={saving||!emailValidation.test(values?.email)}
              loading={saving}

              className={`bg-[#FFA28D]   mt-7 ml-10 rounded-md px-[50px] py-[14.3px] text-sm text-base-20 text-white  `}

            >
              Save
            </PrimaryButton>
          </div>
        </div>

        <div className="flex gap-7 flex-1">
          <div>
            <h1 className="my-0 mb-1 text-[#26435F] font-semibold text-base-20">
              Send Link
            </h1>
            <button
              onClick={handleClose}
              className="bg-[#517CA8] text-white rounded-md text-base-17-5  px-5 py-3 text-sm"
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

        <div className="flex  gap-x-[100px] mt-16 mb-[163px]">
          <div className="relative w-[33.54vw]">

            <p className=" text-sm text-[#26435F] font-semibold text-base-20">
              Submit Feedback
            </p>
            <textarea
              rows="3"
              value={feedBack?.support}
              onChange={(e) => {
                setFeedback({
                  ...feedBack,
                  support: e.target.value
                })
              }}
              className="mt-1 block  resize-none focus:!ring-blue-500 p-5 focus:!border-blue-500 placeholder-[#CBD6E2] text-base-18  placeholder:text-base-18  w-[33.54vw] h-[352px] "
              placeholder=" If you have any feedback for this online platform, please submit it here. Our team takes every suggestion seriously."
            ></textarea>


            <button
              onClick={() => {
                handleFeedback(feedBack.support, "feedback")
              }}
              className="bg-[#517CA8] text-white rounded-lg mt-2 float-right px-4 py-2  absolute bottom-[-14%] right-0"
            >
              Submit
            </button>
          </div>
          <div className=" relative w-[33.54vw]">
            <p className=" text-sm text-[#26435F] font-semibold text-base-20">
              Request Technical Support
            </p>

            <textarea
              rows="3"
              value={feedBack?.tech}
              onChange={(e) => {
                setFeedback({
                  ...feedBack,
                  tech: e.target.value
                })
              }}
              className="mt-1 block w-[33.54vw] h-[352px] resize-none focus:!ring-blue-500 p-5 focus:!border-blue-500 placeholder-[#CBD6E2] text-base-18   placeholder:text-base-18  "
              placeholder=" If you require technical support, please submit your request here and our team will help you out accordingly."
            ></textarea>
            <button
              onClick={() => {
                handleFeedback(feedBack.tech, "")
              }}
              className="bg-[#517CA8] text-white rounded-lg mt-2 float-right px-4 py-2 absolute bottom-[-14%] right-0"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      {modalOpen && (
        <Modal
          handleClose={handleClose}
          crossBtn={true}
          underline={true}
          classname="!w-[666px] mx-auto"
          body={
            <div className="text-center -mt-4 ">
              <h1 className="font-normal text-[21px] text-[#26435F]">
                A Password Reset Link will be sent to you. Please click on it to
                change your password.
              </h1>
              <button
                onClick={showResetConfirmation}
                className="bg-[#FF7979] mt-[30px] text-white w-[146px] h-[46px] py-2 px-4 rounded-lg font-medium"
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
