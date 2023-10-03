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
import  './style.css'
import { useForgotPasswordMutation } from "../../../../app/services/auth";

import {
  useLazyGetPersonalDetailQuery,
  useUpdateUserAccountMutation,
} from "../../../../app/services/users";
import { BASE_URL, getAuthHeader } from "../../../../app/constants/constants";
import InputFieldDropdown from "../../../../components/InputField/inputFieldDropdown";
import { useUpdateEmailMutation } from "../../../../app/services/organization";
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
  const [fetchedData, setFetchedData] = useState({})
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

  const handleEmailUpdate = (email) => {
    console.log("Email Updation invoked", email);
    if (email !== "")
      updateEmail({ email }).then((res) => {
        console.log("Email Link sent", res);
      });
  };
  const handleDataUpdate = () => {
    const updateUserAccount = async () => {
      try {
        let reqBody = { ...values };
        delete reqBody["_id"];
        delete reqBody["email"];
        updateAccount(reqBody)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err?.message);
          });
      } catch (e) {
        console.error(e?.response?.data?.message);
      }
    };
    updateUserAccount();
    if (fetchedData?.email !== values.email)
      handleEmailUpdate(values.email)
    console.log({ fetchedData, values })
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
        <div className="flex gap-8">
          <InputField
            placeholder=""
            labelClassname="font-medium text-base"
            parentClassName="text-[#26435F]"
            inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040]  bg-white  border border-white text-[#667085]"
            inputClassName=" text-400 py-0 bg-transparent"
            label="First Name"
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
            inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040]  bg-white border border-white text-[#667085]"
            inputClassName=" text-400 py-0 bg-transparent"
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
            labelClassname="font-medium text-base"
            parentClassName="text-[#26435F]"
            inputContainerClassName=" !shadow-[0px_0px_2.500000476837158px_0px_#00000040]  bg-white  text-[#667085]"
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
          <div id="number">
            <InputFieldDropdown
              placeholder=""
              labelClassname="font-medium text-base"
              parentClassName="text-[#26435F] "
              inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] py-3 bg-white border border-white text-[#667085]"
              inputClassName="  text-400 py-1"
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
          <div className="flex flex-1 justify-end">
            <button

              onClick={handleDataUpdate}
              className="bg-[#FFA28D]  py-3 mt-6 rounded-md px-10  text-sm text-[#EEE] text-base-17-5"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex gap-7 flex-1">
          <div>
            <h1 className="my-1 text-[#26435F] font-semibold text-sm text-base-17-5">
              Send Link
            </h1>
            <button
              onClick={handleClose}
              className="bg-[#517CA8] text-white rounded-md px-3 py-3 text-sm text-base-17-5 "
            >
              Reset Password
            </button>
          </div>
          <div>
            <h1 className="my-1 text-[#26435F] font-semibold text-sm text-base-17-5">
              2FA Codes / key
            </h1>
            <button className="bg-[#517CA8] text-white rounded-md px-5 py-3 text-sm text-base-17-5" >
              Download
            </button>
          </div>

        </div>
        <div>
          {reset && (
            <div className="flex gap-2">
              <p className="bg-[rgba(119,221,119,0.2)] rounded-xl text-sm text-[#77DD77] px-3 py-1 text-base-15">
                <img className="inline-block mr-3" src={resetSendIcon} alt="" />
                {"Password Reset Link Sent To {email address}"}
              </p>
            </div>
          )}
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

export default AccountOverview;
