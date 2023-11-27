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
import "./style.css";
import { useForgotPasswordMutation } from "../../../../app/services/auth";
import userPic from "../../../../assets/icons/user_logo.png";
import camera from "../../../../assets/icons/camera_logo.svg";

import {
  useLazyGetPersonalDetailQuery,
  useUpdateUserAccountMutation,
} from "../../../../app/services/users";
import { BASE_URL, getAuthHeader } from "../../../../app/constants/constants";
import InputFieldDropdown from "../../../../components/InputField/inputFieldDropdown";
import { useUpdateEmailMutation } from "../../../../app/services/organization";
import TextArea from "antd/es/input/TextArea";
const AccountOverview = () => {
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
  const [fetchedData, setFetchedData] = useState({});
  useEffect(() => {
    userDetails()
      .then((res) => {
        setValues({
          ...res?.data.data.user,
        });
        setFetchedData({
          ...res?.data.data.user,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const isEmail = (val) => {
    let regEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(val)) {
      return false;
    } else {
      return true;
    }
  };
  const handleEmailUpdate = (email) => {
    console.log("Email Updation invoked", email);
    if (email?.trim() === "") {
      alert("Email address can't be empty");
      return;
    }
    if (!isEmail(email)) {
      alert("Enter valid email!");
      return;
    }
    if (email?.trim() !== "") {
      updateEmail({ email }).then((res) => {
        if (res?.data) {
          alert("Email reset link sent, please verify");
        } else {
          alert("Error occured while senting email reset link!");
        }
        console.log("Email Link sent", res);
      });
    }
  };
  const [loading, setLoading] = useState(false);
  const handleDataUpdate = () => {
    const arr = ["email", "firstName", "lastName", "phone", "phoneCode"];
    let boo = true;
    let ff = null;
    arr.forEach((it) => {
      if (boo && (!values[it] || values[it]?.trim() === "")) {
        boo = false;
        alert(it + " can't be empty.");
        return;
      }
    });
    if (!boo) {
      return;
    }
    if (!isEmail(values?.email)) {
      alert("Enter valid email!");
      return;
    }
    if (
      values?.email?.trim() === "" ||
      values?.firstName?.trim() === "" ||
      values?.lastName?.trim() === "" ||
      values?.phone?.trim() === "" ||
      values?.phoneCode?.trim() === ""
    ) {
      alert("Please fill all the fields to update your account!");
      return;
    }
    setLoading(true);
    const updateUserAccount = async () => {
      try {
        let reqBody = { ...values };
        delete reqBody["_id"];
        delete reqBody["email"];
        updateAccount(reqBody)
          .then((res) => {
            setLoading(false);
            if (res?.error) {
              alert("Error occured while updating!");
            }
            if (res?.data) {
              alert("changes saved!");
            }
            console.log(res);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err?.message);
          });
      } catch (e) {
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

  return (
    <div>
      <div className="flex flex-col gap-10  ">
        <div className="gap-8  flex justify-between items-center">
          <div className="w-4/5 flex justify-start items-center ">
            <InputField
              placeholder=""
              labelClassname="font-medium text-base"
              parentClassName="text-[#26435F]"
              inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040]  bg-white  border border-white text-[#667085] mr-[38px]"
              inputClassName=" text-400 py-0 bg-transparent "
              label="First name"
              value={values.firstName}
              onChange={(e) =>
                setValues({
                  ...values,
                  firstName: e.target.value,
                })
              }
              error={error.firstName}
            />

            <InputField
              placeholder=""
              labelClassname="font-medium text-base"
              parentClassName="text-[#26435F]"
              inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040]  bg-white border border-white text-[#667085] mr-[38px]"
              inputClassName=" text-400 py-0 bg-transparent"
              label="Last name"
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
              labelClassname="font-medium text-base"
              parentClassName="text-[#26435F]"
              inputContainerClassName=" !shadow-[0px_0px_2.500000476837158px_0px_#00000040]  bg-white  text-[#667085] mr-[38px]"
              inputClassName=" text-400 py-0 bg-transparent w-[calc(377*0.0522vw)]"
              label="Email"
              // IconRight={tooltipIcon}
              value={values.email}
              onChange={(e) => {
                setValues({
                  ...values,
                  email: e.target.value,
                });
              }}
              error={error.email}
            />
            <div id="number">
              <InputFieldDropdown
                placeholder=""
                labelClassname="font-medium text-base"
                parentClassName="text-[#26435F] "
                inputContainerClassName="!shadow-[0px_0px_2.500000476837158px_0px_#00000040]  bg-white  text-[#667085]"
                inputClassName="text-400 py-0 bg-transparent w-[calc(377*0.0522vw)]"
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
            </div>
          </div>
          <div className="flex justify-start items-center">
            <button
              disabled={loading}
              onClick={handleDataUpdate}
              className={` bg-[#FFA28D] h-[50px] w-[175px]  py-[13.5px] mt-[20px] rounded-md px-10  text-sm text-[#fff] text-base-17-5 ${
                loading ? "cursor-wait" : "cursor-pointer"
              }`}
            >
              Save
            </button>
          </div>
        </div>
        <div className="flex gap-x-[30px]">
          <div>
            <div className="flex items-center relative">
              <p className="text-base-17-5 font-semibold text-[#26435F] mr-5">
                Profile Picture
              </p>
              <p>
                <img className=" inline-block" src={userPic} alt="" />
              </p>
              <p className="absolute right-0 bottom-0">
                <img src={camera} alt="" />
              </p>
            </div>
            <InputField
              placeholder="What is your role?"
              labelClassname="font-semibold text-base"
              parentClassName="text-[#26435F]"
              inputContainerClassName="shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)]  bg-white  border border-white text-[#667085] w-[14.32vw]"
              inputClassName=" text-400 py-0 bg-transparent text-base"
              label="Your Role"
              value={values.role}
              onChange={(e) =>
                setValues({
                  ...values,
                  role: e.target.value,
                })
              }
              error={error.role}
            />
          </div>
          <div className="flex items-end">
            <div className="flex flex-col w-[35.78vw]">
              <label
                className="text-[#26435F] font-semibold text-base-17-5"
                htmlFor=""
              >
                Short Bio
              </label>
              <textarea
                placeholder="Write a short bio about yourself, your interests, how your got started with this choice of career, your strengths and weaknesses, your hobbies, your tutoring style, your educational background, etc. Suggested word length: 200 words."
                rows={7}
                cols={55}
                className="!text-[0.83333vw] p-3 rounded-5 focus:border-[#D0D5DD] w-full h-40 placeholder:!text-[#B3BDC7] placeholder:!text-[0.83333vw] placeholder:!font-normal shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] outline-none"
                style={{
                  border: "1px solid #D0D5DD",
                  color: "#667085",
                }}
                value={values.about}
                onChange={(e) => {
                  setValues({
                    ...values,
                    about: e.target.value,
                  });
                }}
              ></textarea>
            </div>
            <div className="ml-[38px]">
              <button
                onClick={handleClose}
                className="bg-[#517CA8] text-white rounded-md px-3 py-3 w-[175px]text-base-17-5 font-medium"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-7 flex-1">
          {/* 
          <div>
            <h1 className="my-1 text-[#26435F] font-semibold text-sm text-base-17-5">
              2FA Codes / key
            </h1>
            <button className="bg-[#517CA8] text-white rounded-md px-5 py-3 text-sm text-base-17-5" >
              Download
            </button>
          </div> */}
        </div>
        <div>
          {reset && (
            <div className="flex gap-2">
              <p className="bg-[#38C980] rounded-xl text-sm text-white px-3 py-1 text-base-15 flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                >
                  <g clip-path="url(#clip0_9876_45449)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.565 0.332298C9.65942 0.278367 9.76627 0.25 9.875 0.25C9.98374 0.25 10.0906 0.278367 10.185 0.332298L18.935 5.33228C19.0307 5.38692 19.1102 5.46587 19.1655 5.56114C19.2208 5.65641 19.25 5.76461 19.25 5.87477V6.77477C19.25 9.53222 18.3517 12.2146 16.691 14.4159C15.0304 16.6172 12.6977 18.2176 10.0463 18.9747C9.93431 19.0066 9.81569 19.0066 9.70375 18.9747C7.05248 18.2172 4.72008 16.6168 3.05946 14.4155C1.39885 12.2143 0.500375 9.53212 0.5 6.77477L0.5 5.87477C0.500036 5.76461 0.529189 5.65641 0.584507 5.56114C0.639825 5.46587 0.719341 5.38692 0.815 5.33228L9.565 0.332298ZM9.34 13.6385L14.7375 6.88977L13.7625 6.10977L9.16 11.861L5.9 9.14476L5.1 10.1048L9.34 13.6385Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_9876_45449">
                      <rect
                        width="18.75"
                        height="18.7499"
                        fill="white"
                        transform="translate(0.5 0.25)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <div className="ms-3">{"Password Reset Link Sent To {email address}"}</div>
              </p>
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <Modal
          crossBtn={true}
          classname="!w-[666px] mx-auto"
          underline={true}
          titleClassName="m-0"
          buttonParentClassName="justify-center"
          primaryBtn={{
            text: "Okay",
            className:
              "pl-4 px-4 !bg-[#FF7979] text-white w-[146px] h-[46px] !ml-0",
            onClick: () => showResetConfirmation(),
            // disabled: submitBtnDisabled,
            // loading: loading
          }}
          handleClose={handleClose}
          body={
            <div className="text-center mb-[30px]">
              <h1 className="text-[21px] text-[#26435F]">
                A Password Reset Link Will Be Sent To You. Please Click On It To
                Change Your Password.
              </h1>
              {/* <button
                onClick={showResetConfirmation}
                className="bg-[#FF7979] mt-3 text-white text-sm p-2 px-4 rounded-md"
              >
                Okay
              </button> */}
            </div>
          }
        />
      )}
    </div>
  );
};

export default AccountOverview;
