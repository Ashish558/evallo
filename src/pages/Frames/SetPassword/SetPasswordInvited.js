import React, { useEffect, useState } from "react";
import InputField from "../../../components/InputField/inputField";
import Passwordicon from "../../../assets/form/password.svg";
import styles from "../../Signup/signup.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useChangePasswordMutation,
  useSetPasswordMutation,
} from "../../../app/services/auth";
import { validatePassword } from "./utils";
import Loader from "../../../components/Loader";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import EvalloLogo from "../../../assets/signup/cuate.svg";


export default function SetPassword({
  signup,
  setLoginFormActive,
  resetPassword,
  setcurrentStep,
  currentStep
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get("userid");
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });

  const [setUserPassword, setUserPasswordResp] = useSetPasswordMutation();
  const [changePassword, changePasswordResp] = useChangePasswordMutation();
  const navigate = useNavigate();

  const resetErrors = () => {
    setError((prev) => {
      return {
        password: "",
        confirmPassword: "",
      };
    });
  };
  useEffect(() => {
    setcurrentStep(currentStep + 1)
  }, [])
  const handleSubmit = () => {
    const promiseState = async (state) =>
      new Promise((resolve) => {
        resolve(resetErrors());
      });
    setLoading(true);
    promiseState().then(() => {
      const reqBody = { password, token };
      const result = validatePassword({ password, confirmPassword });
      // console.log(result);
      if (result.data !== true) {
        setLoading(false);
        setError((prev) => {
          return {
            ...prev,
            [result.data]: result.message,
          };
        });
      } else {
        if (resetPassword) {
          changePassword({ userId, body: reqBody }).then((res) => {
            setLoading(false);
            if (res.error) {
              console.log(res.error);
              alert(res.error.data.message);
              return;
            }
            console.log(res.data);
            // setLoginFormActive(true)
            navigate("/");
          });
        } else {
          setUserPassword({ userId, body: reqBody }).then((res) => {
            setLoading(false);
            if (res.error) {
              console.log(res.error);
              alert(res.error.data.message);
              return;
            }
            console.log(res);
            // setLoginFormActive(true)
            navigate("/");
          });
        }
      }
    });
  };

  return (
    <>
      <div className="pb-[10px] w-full" >
        <div className="h-[1px] bg-[#EBEBEB] mx-[0px]  mt-[-16px] mb-[19px]"></div>

        <div className={`w-[89%] mx-auto bg-white py-4 ${signup ? "" : "px-5"} `}>

          <p className="mb-8 text-center text-lg text-[#26435F]">
            Congratulations! Your email has been verified. Now,<br/>
            please set a strong password for your Evallo account.
          </p>

          <div className="flex justify-between my-2">

            <InputField
              biggerText={true}
              parentClassName="mb-6 relative"
              type="password"
              placeholder="minimum 8 characters"
              inputContainerClassName="border border-[0.98px_solid_#D0D5DD] !w-[266px] h-[53px]"
              inputClassName={"py-[2px]"}
              label="Set New Password"
              labelClassname="  text-[#26435F]  !font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error.password}
            />



            <InputField
              biggerText={true}
              parentClassName="mb-2.5 relative"
              type="password"
              inputClassName={"py-[2px]"}
              placeholder="Confirm New Password"
              inputContainerClassName="border border-[0.98px_solid_#D0D5DD] !w-[266px] h-[53px]"
              label="Confirm New Password"
              labelClassname="  text-[#26435F]  !font-medium"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={error.confirmPassword}
            />
          </div>
          <div className="flex justify-center items-center  text-[#7C98B6] text-base font-light">
            Note: The password should contain a minimum of 8 characters.
          </div>


          <PrimaryButton
            onClick={handleSubmit}
            loading={loading}
            children={"Set New Password"}
            className="!w-[337px] mx-auto mt-[50px] text-[17.5px] h-[50px] text-[#fff] !font-medium mb-5"
          />
          {/* <button
                        className={`w-full relative bg-primaryDark font-medium disabled:bg-pink pt-3 pb-3 mt-12 rounded-10 text-white text-lg  ${loading ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
                        onClick={handleSubmit}
                     >
                        Set New Password
                        {
                           loading &&
                           <Loader />
                        }
                     </button> */}
        </div>

      </div>
    </>
  );
}
