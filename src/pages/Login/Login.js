import React, { useState } from "react";
import { useDispatch } from "react-redux";

import InputField from "../../components/InputField/inputField";
import ForgotPassword from "../Frames/ForgotPassword";
import ResetPassword from "../Frames/ResetPassword";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import cutEmail from "../../assets/signup/cutEmail.svg";
import { useLoginUserMutation } from "../../app/services/auth";
import { updateIsLoggedIn } from "../../app/slices/user";

// import Passwordicon from "../../assets/form/password.svg";
// import EmailIcon from "../../assets/form/email.svg";
import CarouselImg from "../../assets/form/image-1.png";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
// import PrimaryButton from "../../components/Buttons/PrimaryButton";
import Loader from "../../components/Loader";
import CCheckbox from "../../components/CCheckbox/CCheckbox";
import EvalloLogo from "../../assets/icons/evallo_new.svg";
import cuate from "../../assets/signup/cuate.svg";
import GoogleIcon from "../../assets/icons/google.svg";
import LinkedinIcon from "../../assets/icons/linkedin-round.svg";
import AppleIcon from "../../assets/icons/apple.svg";
import AdminNavbar from "../AdminDashboard/AdminNavbar";
import SCheckbox from "../../components/CCheckbox/SCheckbox";
import { BASE_URL } from "../../app/constants/constants";

// import AdminNavbar from "../AdminDashboard/AdminNavbar";
// import SCheckbox from "../../components/CCheckbox/SCheckbox";

export default function Login({ setLoginFormActive }) {
  const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const [isPasswordForgot, setIsPasswordForgot] = useState(false);
  const [resetPasswordActive, setResetPasswordActive] = useState(false);
  const [loginActive, setLoginActive] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [wait, setWait] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState({
    password: "",
    email: "",
  });
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
    if (loginLoading || !(emailValidation.test(email.trim()) && password.length > 0))
      return;
    setLoginLoading(true);
    const promiseState = async (state) =>
      new Promise((resolve) => {
        resolve(resetErrors());
      });
    promiseState().then(() => {
      loginUser({ email:email?.trim(), password }).then((res) => {
        setLoginLoading(false);
        if (res.error) {
          console.log("login err", res.error);

          if (res?.error?.data?.message === "Email not found") {
            setError({
              email: res?.error?.data?.message,
            });
            return;
          }
          if (res?.error?.data?.message === "Wrong password") {
            setError({
              password: res?.error?.data?.message,
            });
            return;
          }
          if (res?.error?.data?.message === "User not verified") {
            setError({
              email:
                "Email not verified! Please Verify your email and set your password",
            });
            return;
          }
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
          if (res.error.data.message) {
            alert(res.error.data.message);
            // setError(prev => {
            //    return { ...prev, password: 'Wrong password' }
            // })
          }
          return;
        }
        sessionStorage.setItem("token", res.data.data.token);
        sessionStorage.setItem("role", res.data.data.role);
        sessionStorage.setItem("userId", res.data.data.userId);
        if (remember) {
          localStorage.setItem("evalloToken", res.data.data.token);
          localStorage.setItem("role", res.data.data.role);

          localStorage.setItem("userId", res.data.data.userId);
        }
        dispatch(updateIsLoggedIn(true));
      });
    });
  };

  const google = () => {
    window.open(`${BASE_URL}api/v1/auth/google`, "_self");
  };

  const props = { setActiveFrame, setResetPasswordActive };

  return (
    <div className={"w-[1920px] flex justify-center items-center"}>
      <div className="flex flex-col items-center">
        <img
          src={cuate}
          alt="rocket"
          className="h-[113.64px] w-[181px] mt-[44px]"
        />
        <div className="bg-primary block mt-[13px]">
          <ImageSlider
            className={styles.loginCarousel}
            images={[CarouselImg, CarouselImg]}
            pagination={true}
          />
        </div>
        <div className="flex items-center mb-[80.33px] bg-white rounded-[10px] pt-[40px] pb-[40px] px-[66px] w-[561px] h-[650px] shadow-[5px_5px_87.5px_0px_rgba(166,166,166,0.25)]">
          {loginActive ? (
            <div className="w-full">
              <div className="flex justify-center">
                <img
                  src={EvalloLogo}
                  alt="logo"
                  className=" h-[29.796px]"
                />
              </div>
              <p
                className={`font-semibold text-lg mt-[40px] bg-transparent text-[#26435F] mb-[8px]`}
              >
                Login
              </p>
              <p className={`text-base mb-[50px]  text-[#667085] font-normal`}>
                Please fill your detail to access your account.
              </p>
              <form
                onSubmit={handleSubmit}
                className={`tracking-[0.03em] mt-0  ${
                  wait ? "cursor-wait" : "cursor-default"
                }`}
              >
                <InputField
                  right={
                    email?.length > 0 ? (
                      <img
                        onClick={() => setEmail("")}
                        className="ml-3 cursor-pointer  w-[22.249px] h-[22.249px]"
                        src={cutEmail}
                        alt="right icon"
                      />
                    ) : null
                  }
                  biggerText={true}
                  iconSize="medium"
                  placeholder=""
                  parentClassName="mb-[18px]"
                  label="Email "
                  removeResponsive={true}
                  labelClassname="text-[#26435F] font-medium mb-[2px]"
                  inputClassName="bg-transparent !text-lg"
                  inputContainerClassName="hover:border-[#FFA28D] border-[0.936px] !text-lg border-[#D0D5DD]  h-[49.69px]  rounded-[6px] w-[430px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error.email}
                  totalErrors={error}
                />

                <InputField
                  // Icon={Passwordicon}
                  iconSize="medium"
                  parentClassName="mb-[11px]"
                  placeholder=""
                  biggerText={true}
                  removeResponsive={true}
                  label="Password"
                  type="password"
                  labelClassname="text-[#26435F] font-medium"
                  inputClassName="bg-transparent "
                  inputContainerClassName="hover:border-[#FFA28D] border-[0.936px] border-[#D0D5DD] !text-lg h-[49.69px] rounded-[6px] w-[430px]"
                  customEyeIconSize={"w-[17.5px] h-[14.761px]"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error.password}
                  totalErrors={error}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-center ">
                    <CCheckbox
                      customSize={`w-[16px] h-[16px]`}
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                    />{" "}
                    <span className="text-[16px] text-[#26435F]  font-medium">
                      {" "}
                      Remember me{" "}
                    </span>
                  </div>
                  <p
                    className="inline-block cursor-pointer text-[#24A3D9] text-[16px] font-medium ml-auto"
                    onClick={() => setActiveFrame(setIsPasswordForgot)}
                  >
                    Forgot Password?
                  </p>
                </div>

              {/* <div className="flex justify-center">
                <button
                  disabled={
                    loginLoading === true
                      ? true
                      : !(emailValidation.test(email) && password.length > 0)
                  }
                  className={`w-[80%] relative mx-auto  bg-[#FFA28D] disabled:opacity-70 pt-3.5 pb-3.5 lg:pt-[9px] lg:pb-[9px] mt-[30px]   rounded-7 text-white text-lg ${
                    loginLoading ? "cursor-wait" : "cursor-pointer"
                  }`}
                  onClick={handleSubmit}
                >
                  Sign in
                  {loginLoading && <Loader />}
                </button>
                </div> */}
                <div className="flex justify-center my-[30px]">
                  <button
                    className={`w-[337px] h-[50px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] relative mx-auto  bg-[#FFA28D] disabled:opacity-60  rounded-5 text-white text-lg font-medium ${
                      loginLoading ? "cursor-wait opacity-60" : "cursor-pointer"
                    }`}
                    onClick={handleSubmit}
                  >
                    Sign in
                    {loginLoading && <Loader />}
                  </button>
                </div>

                <div className="w-full flex justify-center items-center gap-[30px] mt-[11px]" >
                    <div
                      className="aspect-square bg-[#fff] flex items-center justify-center h-[50px] w-[50px] relative rounded-[7px] hover:cursor-pointer shadow-md"
                      
                      onClick={google}
                    >
                      <img 
                        className="block"
                        src={GoogleIcon} alt="google_icon" />
                    </div>

                  
                    <div
                      className="aspect-square bg-[#fff] flex items-center justify-center h-[50px] w-[50px] relative rounded-[7px] hover:cursor-pointer shadow-md"
                      
                    >
                      <img 
                        className="block"
                        src={AppleIcon} alt="appleIcon" />
                    </div>
                  </div>
                <div className="flex justify-center mt-[19.71px]">
                  <p
                    className={`relative text-base  text-[#26435F]  ml-2  inline-block  `}
                  >
                    <span className="cursor-text">Don’t have an account?{" "}</span>
                    <span
                      className={`text-[#24A3D9] cursor-pointer relative  font-bold     inline-block `}
                      onClick={() => navigate("/signup?step=1")}
                    >
                      Sign up
                    </span>
                  </p>
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
