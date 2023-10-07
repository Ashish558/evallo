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
      <div className="min-h-screen flex justify-center overflow-auto pb-[20px]  " id={styles.signUp}>
      
          {/* <div className="bg-primary"></div> */}
          <div className="flex flex-col w-[730px] pb-10 justify-center items-center md:grid-cols-2">
            <img src={EvalloLogo} alt="logo" className="mb-4 scale-[.93] " />

            <div
              className={`w-full flex rounded-md flex-col justify-center items-center bg-white py-6 pb-10 ${
                signup ? "" : "px-[130px]"
              } `}
            >

              {
                !resetPassword ?
                <>
                <div className="bg-[#FFA28D] rounded-full w-10 h-10 p-2 text-center mx-auto text-white">
                5
              </div>
              <p className="font-medium text-[15px] text-center mx-auto py-1 text-[#FFA28D] leading-snug mb-7">
                Set Password
              </p>

              
              
              <div className="h-[1px] bg-[#EBEBEB] mx-[0px]  mt-[-16px] w-[110%] mb-[19px]"></div>
              <p className="mb-8 text-[#26435F] text-center">
                Congratulations! Your email has been verified. Now,
                <br /> please set a strong password for your Evallo account.
              </p> </>:
              <>
             
               <p className="font-medium text-4xl text-center mx-auto py-2 text-[#FFA28D] leading-snug mb-7">
               Reset Password
             </p>
             <div className="h-[1px] bg-[#EBEBEB] mx-[0px]  mt-[-16px] w-[110%] mb-[25px]"></div>
             <p className="mb-8 text-[#26435F] text-center">
              
              Please set a new strong password for your Evallo account.
            </p>
             </>
}


              <div className="flex justify-between gap-10">
                <InputField
                  parentClassName="mb-6 relative"
                  type="password"
                  placeholder="minimum 8 characters"
                  inputContainerClassName="border border-[0.98px_solid_#D0D5DD]"
                  inputClassName={"py-[2px]"}
                  label="Set New Password"
                  labelClassname="ml-2 mb-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error.password}
                />

                <InputField
                  parentClassName="mb-2.5 relative"
                  type="password"
                  inputClassName={"py-[2px]"}
                  placeholder="Confirm Password"
                  inputContainerClassName="border border-[0.98px_solid_#D0D5DD]"
                  label="Confirm Password"
                  labelClassname="ml-2 mb-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={error.confirmPassword}
                />
              </div>
              <div className="flex justify-center items-center my-3 text-[#7C98B6] text-xs">
                Note: The password should contain a minimum of 8 characters.
              </div>

              <PrimaryButton
                onClick={handleSubmit}
                loading={loading}
                children={"Set New Password"}
                className="w-[300px] !text-white mt-6 py-3"
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
       
      </div>
    </>
  );
}
