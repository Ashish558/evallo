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
  
    let arr=["firstName", "lastName", "email", "phone"]
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
    console.log({ message, type })
    const body = {
      message, type
    }
    studentFeedback(body).then((res) => {
      if (res?.error) {
        alert("Coudn't send feedback, try again")
      }
      if (res?.data) {
        alert("Feedback successfully sent")
        if(type=='feedback'){
        setFeedback({
          ...feedBack,
          support: ''
        })
      }
      else if(type=='tech'){
        setFeedback({
          ...feedBack,
          tech: ''
        })
      }
      }
      console.log({ res })
    })
  }

  return (
    <div className="w-[1600px] mx-auto">
      <div className="flex flex-col    my-12">
        <div className="text-[#24A3D9] font-lexend-deca text-xl  font-semibold leading-normal mb-[60px]">
          <span onClick={() => navigate('/')}
            className="font-normal text-[20px] cursor-pointer">{organization?.company + ' > '}   {firstName + ' ' + lastName+' >'}</span>

          <span className="font-bold text-[20px]">{"  Settings"}</span>
        </div>
        {console.log(error)}
        <div className="flex gap-[37px] items-center mb-[40.5px]">
          <InputField
            placeholder="First Name"
            labelClassname="mb-1 !text-[17.5px] text-base-20 text-[#26435F] font-medium"
            parentClassName="text-[#26435F]"
            inputContainerClassName="h-[50px] bg-white  !w-[275px] border border-white text-[#667085] !px-[15px]"
            inputClassName=" text-400 bg-transparent  !pl-0"
            label="First name"
            value={values.firstName}
            onChange={(e) =>
              
             {const regex = /^[a-zA-Z0-9 ]*$/;
             const isValid = regex.test(e.target.value);
             if(isValid)
             handleFirstName(e)}
            }
            error={error.firstName}
          />

          <InputField
            placeholder="Last Name"
            labelClassname="mb-1 !text-[17.5px] text-base-20 text-[#26435F] font-medium"
            parentClassName="text-[#26435F]"
            inputContainerClassName="h-[50px] bg-white !w-[275px] border border-white text-[#667085] !px-[15px]"
            inputClassName=" text-400 bg-transparent  pl-0"
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
            placeholder="sampleemail@gmail.com"
            labelClassname="mb-1 !text-[17.5px] text-base-20 text-[#26435F] font-medium"
            parentClassName="text-[#26435F]"
            inputContainerClassName=" h-[50px] bg-white border  !w-[376px] min-w-[230px] border-white text-[#667085] !px-[15px]"
            inputClassName=" text-400 bg-transparent  pl-0"
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
              <span className="absolute top-10 w-[333px] scale-0 rounded-[13.33px] bg-gray-800 p-[20px] font-light text-[13.3px] text-white group-hover:scale-100">
                <h3 className="text-[#24A3D9] font-medium mb-1 text-[16px]">
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
              placeholder="+91 999303601X"
              labelClassname=" !text-[17.5px] text-base-20 text-[#26435F] !mb-3 font-medium"
              parentClassName="text-[#26435F]"
              inputContainerClassName="h-[50px] !py-[14px] px-[14px]   flex items-center rounded   bg-white border  min-w-[230px] border-white text-[#667085] !w-[275px] !px-[15px]"
              inputClassName=" outline-0 w-full text-[17.5px]  pl-1 placeholder:text-base-17-5  text-400 bg-transparent  text-base-17-5 "
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
                if (isValid && e.target.value?.length < 15)
                setValues({
                  ...values,
                  phone: e.target.value,
                })}
              }
              error={error.phone}
            />
          </div>
          <div>
            <PrimaryButton
              onClick={handleDataUpdate}
              disabled={saving||!emailValidation.test(values?.email)}
              loading={saving}

              className={`bg-[#FFA28D]  font-semibold mt-7  rounded-md  text-sm text-[20px] text-white  w-[175px] h-[50px]`}

            >
              Save
            </PrimaryButton>
          </div>
        </div>

        <div className="flex gap-7 flex-1 mb-[133.18px] flex-col">
          <div>
            <h1 className="my-0 mb-1 text-[#26435F] font-semibold text-[17.5px]">
              Send Link
            </h1>
            <button
              onClick={handleClose}
              className="bg-[#517CA8] text-white rounded-md  text-[17.5px] h-[50px] w-[175px]"
            >
              Reset Password
            </button>
          </div>
        <div>
          {reset && (
            <div className="flex pt-3 gap-[8px] text-xs">
              <p className="bg-[rgba(119,221,119,0.2)] flex gap-[8.75px] font-light rounded-xl text-[15px] text-[#77DD77] px-[20px] py-[15px]">
                <img className="h-[18px] w-[18px]" src={resetSendIcon} alt="secureIcon" />
                Password Reset Link Sent To {values?.email}
              </p>
            </div>
          )}
        </div>
        </div>

        <div className="flex  gap-x-[100px]  mb-[163px]">
          <div className="relative w-[643.968px]">

            <p className=" text-sm text-[#26435F] font-medium text-[18.667px]">
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
              className="mt-1 block  resize-none focus:!ring-blue-500 p-5 focus:!border-blue-500 placeholder-[#CBD6E2] text-[18.6px] placeholder:font-normal placeholder:text-[18.6px] font-normal w-[643.968px] h-[352px] text-[#667085]"
              placeholder=" If you have any feedback for this online platform, please submit it here. Our team takes every suggestion seriously."
            ></textarea>


            <button
              onClick={() => {
                if(feedBack.support?.length>1)
                handleFeedback(feedBack.support, "feedback")
              }}
              className="bg-[#517CA8] text-white rounded-lg mt-2 float-right  absolute bottom-[-16%] right-0 text-[16px] w-[98px] h-[48px]"
            >
              Submit
            </button>
          </div>
          <div className=" relative w-[644px]">
            <p className=" text-sm text-[#26435F] font-medium text-base-20 text-[18.667px]">
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
              className="mt-1 block w-[644px] h-[352px] resize-none focus:!ring-blue-500 p-5 focus:!border-blue-500 placeholder-[#CBD6E2] text-[18.6px]   placeholder:text-[18.6px] text-[#667085] "
              placeholder=" If you require technical support, please submit your request here and our team will help you out accordingly."
            ></textarea>
            <button
              onClick={() => {
                if(feedBack.tech?.length>1)
                handleFeedback(feedBack.tech, "tech")
              }}
              className="bg-[#517CA8] text-white rounded-lg mt-2 float-right  absolute bottom-[-16%] right-0 text-[16px] w-[98px] h-[48px]"
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
          classname="!w-[666px] mx-auto px-[36px] "
          body={
            <div className="text-center ">
              <h1 className="font-normal text-[21.333px] text-[#26435F]  capitalize">
                A Password Reset Link will be sent to you. Please click on it to
                change your password.
              </h1>
              <div className="flex justify-center items-center gap-[20px]">
              <button
                onClick={handleClose}
                className="border border-solid border-[#FF7979] mt-[30px] text-[#FF7979] w-[146px] h-[46px] py-2 px-4 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={showResetConfirmation}
                className="bg-[#FF7979] mt-[30px] text-white w-[146px] h-[46px] py-2 px-4 rounded-lg font-medium"
              >
                Okay
              </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default StudentSettings;
