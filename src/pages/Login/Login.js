import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import InputField from "../../components/InputField/inputField";
import ForgotPassword from "../Frames/ForgotPassword";
import ResetPassword from "../Frames/ResetPassword";
import ImageSlider from "../../components/ImageSlider/ImageSlider";

import { useLoginUserMutation } from "../../app/services/auth";
import { updateIsLoggedIn } from "../../app/slices/user";

import Passwordicon from "../../assets/form/password.svg";
import EmailIcon from "../../assets/form/email.svg";
import CarouselImg from "../../assets/form/image-1.png";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import Loader from "../../components/Loader";
import CCheckbox from "../../components/CCheckbox/CCheckbox";
import EvalloLogo from "../../assets/icons/evallo_new.svg";
import cuate from "../../assets/signup/cuate.png";
import AdminNavbar from "../AdminDashboard/AdminNavbar";


export default function Login({ setLoginFormActive }) {
  const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const [isPasswordForgot, setIsPasswordForgot] = useState(false);
  const [resetPasswordActive, setResetPasswordActive] = useState(false);
  const [loginActive, setLoginActive] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [wait, setWait] = useState(false);
  const [remember, setRemember] = useState(false);
  // const [error, setError] = useState({
  //    password: '',
  //    email: ''
  // })
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginUser, loginUserResp] = useLoginUserMutation();
  const [loginLoading, setLoginLoading] = useState(false);

  const setActiveFrame = (func) => {
    setIsPasswordForgot(false);
    setResetPasswordActive(false);
    setLoginActive(false);
    func(true);
  };

  const resetErrors = () => {
    setError((prev) => {
      return {
        password: "",
        email: "",
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const promiseState = async (state) =>
      new Promise((resolve) => {
        resolve(resetErrors());
      });
    promiseState().then(() => {
      loginUser({ email, password }).then((res) => {
        setLoginLoading(false);
        if (res.error) {
          console.log("login err", res.error);
          if (res.error.status == 500) {
            alert("Login failed");
            return;
          }
          if (res.error.data.message == "user not verified") {
            alert("Please finish the signup flow to login!");
            return;
          }
          if (res.error.data.message === "user is blocked") {
            alert("User is blocked!");
            setError((prev) => {
              return { ...prev, email: "User is blocked" };
            });
          }
          if (res.error.data.message === "email not found") {
            setError((prev) => {
              return { ...prev, email: "Email not found" };
            });
          }
          if (res.error.data.message === "wrong password") {
            setError((prev) => {
              return { ...prev, password: "Wrong password" };
            });
          }
          if (res.error.data.message === "user not verified") {
            // setError(prev => {
            //    return { ...prev, password: 'Wrong password' }
            // })
          }
          return;
        }
        sessionStorage.setItem("token", res.data.data.token);
        sessionStorage.setItem("role", res.data.data.role);
        sessionStorage.setItem("userId", res.data.data.userId);
        dispatch(updateIsLoggedIn(true));
      });
    });
  };

  const props = { setActiveFrame, setResetPasswordActive };

  return (
    <div className={styles.bg}>
      <div className="flex justify-center flex-col items-center md:grid-cols-2 min-h-screen ">
        <img src={cuate} alt="rocket" className="h-10vh mb-10" />
        <div className="bg-primary hidden lg:block">
          <ImageSlider
            className={styles.loginCarousel}
            images={[CarouselImg, CarouselImg]}
            pagination={true}
          />
        </div>
        <div className="lg:flex lg:items-center bg-white rounded-md py-6 px-5 md:px-[66px] lg:min-w-[550px] ">
          {loginActive ? (
            <div className="w-full">
              <div className="flex justify-center" >
              <img src={EvalloLogo} alt="logo" className="mb-4 scale-[.93] " />
              </div>
              <p
                className={`font-bold text-[16px] lg:text-md mb-1.5 bg-transparen text-[#26435F] pt-[90px] pb-[34px] lg:pt-0 lg:pb-0 `}
              >
                Login
              </p>
              <p className={`text-lg font-bold mb-9 ${styles.textGrayed} `}>
                Please fill your detail to access your account.
              </p>
              <form
                onSubmit={handleSubmit}
                className={` mt-[105px] lg:mt-0 ${
                  wait ? "cursor-wait" : "cursor-default"
                }`}
              >
                <InputField
                  // Icon={EmailIcon}
                  iconSize="medium"
                  placeholder="Email address"
                  parentClassName="mb-[20px] lg:mb-6"
                  label="Email Address"
                  labelClassname=" mb-[4px] text-[#26435F] lg:mb-2 text-[12px] lg:text-[14px]"
                  inputClassName="bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error.email}
                />

                <InputField
                  // Icon={Passwordicon}
                  iconSize="medium"
                  parentClassName="mb-[9px] lg:mb-6"
                  placeholder="Password"
                  label="Password"
                  type="password"
                  labelClassname="text-[#26435F] mb-[4px] lg:mb-2 text-[12px] lg:text-[14px]"
                  inputClassName="bg-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error.password}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CCheckbox
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                    />{" "}
                    <span className="text-[13px] text-[#26435F] -mt-1 font-semibold">
                      {" "}
                      Remember me{" "}
                    </span>
                  </div>
                  <p
                    className=" text-[10px] lg:text-xs inline-block cursor-pointer text-[#24A3D9] font-semibold ml-auto"
                    onClick={() => setActiveFrame(setIsPasswordForgot)}
                  >
                    Forgot Password ?
                  </p>
                </div>

                <button
                  disabled={
                    loginLoading === true
                      ? true
                      : !(emailValidation.test(email) && password.length > 0)
                  }
                  className={`w-full relative  bg-[#FFA28D] disabled:opacity-70 pt-3.5 pb-3.5 lg:pt-[9px] lg:pb-[9px] mt-[148px] lg:mt-5 rounded-7 text-white text-lg ${
                    loginLoading ? "cursor-wait" : "cursor-pointer"
                  }`}
                  onClick={handleSubmit}
                >
                  Sign In
                  {loginLoading && <Loader />}
                </button>
                <div className="flex justify-center">
                <p
                  className={`cursor-pointer relative text-sm text-[#26435F] font-semibold ml-2 mt-2 inline-block `}
                  onClick={() => navigate("/signup")}
                >
                  Don’t have an account?
                </p>
                <span
                  className={`text-[#24A3D9] cursor-pointer relative text-sm font-semibold ml-2 mt-2   inline-block `}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </span>
                </div>
              </form>
            </div>
          ) : isPasswordForgot ? (
            <ForgotPassword
              {...props}
              setActiveFrame={setActiveFrame}
              setLoginActive={setLoginActive}
            />
          ) : resetPasswordActive ? (
            <ResetPassword
              setActiveFrame={setActiveFrame}
              setLoginActive={setLoginActive}
            />
          ) : (
            ""
          )}
        </div>
      
      </div>
    </div>
  );
}
