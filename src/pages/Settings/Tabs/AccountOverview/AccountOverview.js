import React, { useEffect } from "react";
import InputField from "../../../../components/InputField/inputField";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import { CheckboxNew } from "../../../../components/Checkbox/CheckboxNew";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import { studentServedData, instructionFormat } from "../staticData";
import logo from "../../../../assets/icons/Frame 31070.svg";
import resetSendIcon from "../../../../assets/icons/teenyicons_shield-tick-solid.svg";
import tooltipIcon from "../../../../assets/icons/octicon_stop-16.svg";
import { useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import { useSelector } from "react-redux";
import axios from 'axios'
const AccountOverview = () => {
  
  const [modalOpen, setModalOpen] = useState(false);
  const [reset, setReset] = useState(false);
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
 useEffect(() => {
  getUserDetails()
 }, []);
 useEffect(() => {
  // setValues(organization);
  const updateUserAccount = async () => {
    try {
      //   alert(data.workemail)
      let result = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}api/user`,
        values,
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: sessionStorage.getItem("token"),
          },
        }
      );
      
     
      console.log("updated", values);
    } catch (e) {
      console.error(e?.response?.data?.message);
    }
  };
  updateUserAccount();
}, [values]);
  const showResetConfirmation = () => {
    setReset(true);
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
  const getUserDetails = async () => {
    try {
      //   alert(data.workemail)
      let result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/user`,
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: sessionStorage.getItem("token"),
          },
        }
      );

      setValues({
        
        ...result.data.data.user[0],
      });

      console.log("account overview", values);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-10 w-[900px] ">
        <div className="flex gap-5">
          <InputField
            placeholder=""
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
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
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
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
          <div className="group relative">
            <div className="">
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F]"
                inputContainerClassName=" bg-white"
                inputClassName="bg-transparent"
                label="Email"
                IconRight={tooltipIcon}
                value={values.email}
                onChange={(e) =>
                  setValues({
                    ...values,
                    email: e.target.value,
                  })
                }
                error={error.email}
              />
            </div>
            <span class="absolute top-20  scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
              <h3 className="text-[#24A3D9] font-semibold mb-1">Email Confirmation Sent</h3>
              You need to verify your email if
              <ul className="list-disc pl-3 mb-2">
                <li>you created a new account.</li>
                <li>you recently changed your email.</li>
              </ul>
              We have sent you an email verification link to your current email
              address to make sure that it really is you who requested a change.
            </span>
          </div>

          <InputField
            placeholder=""
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
            label="Phone"
            value={values.phone}
            onChange={(e) =>
              setValues({
                ...values,
                phone: e.target.value,
              })
            }
            error={error.phone}
          />
        </div>
        <div className="flex gap-7 flex-1">
          <div>
            <h1 className="my-1 text-[#26435F] font-semibold text-sm">Send Link</h1>
            <button
              onClick={handleClose}
              className="bg-[#517CA8] text-white rounded-md px-3 py-2 text-sm"
            >
              Reset Password
            </button>
          </div>
          <div>
            <h1 className="my-1 text-[#26435F] font-semibold text-sm">2FA Codes / key</h1>
            <button className="bg-[#517CA8] text-white rounded-md px-5 py-2 text-sm">
              Download
            </button>
          </div>
        </div>
        <div>
          {reset && (
            <div className="flex gap-2">
              <p className="bg-[rgba(119,221,119,0.2)] rounded-xl text-sm text-[#77DD77] px-3 py-1">
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
