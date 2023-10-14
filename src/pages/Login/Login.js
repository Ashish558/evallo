import React, {  useState } from "react";
import { useDispatch } from "react-redux";

import InputField from "../../components/InputField/inputField";
import ForgotPassword from "../Frames/ForgotPassword";
import ResetPassword from "../Frames/ResetPassword";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import cutEmail from "../../assets/signup/cutEmail.svg"
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
     password: '',
     email: ''
  })
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
   if(
      loginLoading|| !(emailValidation.test(email) && password.length > 0)
    ) return 
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
          
          if(res?.error?.data?.message==="Email not found"){
            setError({
email:res?.error?.data?.message
            })
            return 
          }
          if(res?.error?.data?.message==="Wrong password"){
            setError({
password:res?.error?.data?.message
            })
            return 
          }
          if(res?.error?.data?.message==="User not verified"){
            setError({
email: "Email not verified! Please Verify your email and set your password"
            })
            return 
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
          return;
        }
        sessionStorage.setItem("token", res.data.data.token);
        sessionStorage.setItem("role", res.data.data.role);
        sessionStorage.setItem("userId", res.data.data.userId);
        if(remember){
          localStorage.setItem("evalloToken", res.data.data.token);
          localStorage.setItem("role", res.data.data.role);
          
          localStorage.setItem("userId", res.data.data.userId);
        }
        dispatch(updateIsLoggedIn(true));
      });
    });
  };

  const props = { setActiveFrame, setResetPasswordActive };

  return (
    <div className={styles.bg}>
      <div className="flex  flex-col items-center md:grid-cols-2  ">
        <img src={cuate} alt="rocket" className="h-10vh mt-3 mb-7 scale-[0.86] mt-[-5px] design:mt-[0px] design:scale-100" />
        <div className="bg-primary hidden lg:block ">
          <ImageSlider
            className={styles.loginCarousel}
            images={[CarouselImg, CarouselImg]}
            pagination={true}
          />
        </div>
        <div className="lg:flex scale-[0.75] design:scale-100 mt-[-100px] design:mt-[0px]   lg:items-center bg-white rounded-[10px] pt-[40px] pb-6 px-5 md:px-[66px] lg:min-w-[561px] shadow-[5px_5px_87.5px_0px_rgba(166,166,166,0.25)]">
          {loginActive ? (
            <div className="w-full">
              <div className="flex justify-center" >
              <img src={EvalloLogo} alt="logo" className=" h-[29.796px] scale-[.97] " />
              </div>
              <p
                className={`font-semibold text-lg mt-[40px] mb-1 bg-transparent text-[#26435F]  pb-[34px] lg:pt-0 lg:pb-0 `}
              >
                Login
              </p>
               <p className={`text-base mb-[50px]  text-[#667085] font-normal`}>
                Please fill your detail to access your account.
              </p>
              <form
                onSubmit={handleSubmit}
                className={` mt-[105px] tracking-[0.03em] lg:mt-0 ${
                  wait ? "cursor-wait" : "cursor-default"
                }`}
              >
                <InputField
                  right={email?.length>0?<img onClick={()=>setEmail("")} className="ml-3 cursor-pointer scale-[0.80]" src={cutEmail} alt="right icon"/>:null}
                  biggerText={true}
                  iconSize="medium"
                  placeholder=""
                  parentClassName="mb-[18px]"
                  label="Email "

                  removeResponsive={true}
                  labelClassname="text-[#26435F] font-medium"
                  inputClassName="bg-transparent  !text-lg"
                  inputContainerClassName="hover:border-[#FFA28D] border-[0.936px] !text-lg border-[#D0D5DD]  h-[49px]  rounded-[6px] w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error.email}
                  totalErrors={error}
                />

                <InputField
                  // Icon={Passwordicon}
                  iconSize="medium"
                  parentClassName="mb-[10px]"
                  placeholder=""
                  biggerText={true}
                  removeResponsive={true}
                  label="Password"
                  type="password"
                  labelClassname="text-[#26435F] font-medium"
                  inputClassName="bg-transparent "
                  inputContainerClassName="hover:border-[#FFA28D] border-[0.936px] border-[#D0D5DD] !text-lg h-[49px]  rounded-[6px] w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error.password}
                  totalErrors={error}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-center">
                    <CCheckbox
                    className="scale-[0.8]"
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                    />{" "}
                    <span className="text-base text-[#26435F]  font-semibold">
                      {" "}
                      Remember me{" "}
                    </span>
                  </div>
                  <p
                    className=" lg:text-base inline-block cursor-pointer text-[#24A3D9]  leading-[18.715px]  font-semibold ml-auto"
                    onClick={() => setActiveFrame(setIsPasswordForgot)}
                  >
                    Forgot Password?
                  </p>
                </div>
<div className="flex justify-center">


                <button
                
                  className={`w-[337px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] relative mx-auto  bg-[#FFA28D] disabled:opacity-70 pt-3.5 pb-3.5 lg:py-[11px]  mt-[56px]   rounded-5 text-white text-lg font-medium ${
                    loginLoading ? "cursor-wait" : "cursor-pointer"
                  }`}
                  onClick={handleSubmit}
                >
                  Sign in
                  {loginLoading && <Loader />}
                </button>
                </div>
                <div className="flex justify-center mt-[19px] pb-4">
                <p
                  className={`cursor-pointer relative text-base  text-[#26435F]  ml-2  inline-block `}
                  onClick={() => navigate("/signup")}
                >
                  Don’t have an account?
                </p>
                <span
                  className={`text-[#24A3D9] cursor-pointer relative  font-bold ml-2    inline-block `}
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
