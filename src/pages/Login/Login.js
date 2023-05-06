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
import styles from './Login.module.css'
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import Loader from "../../components/Loader";

export default function Login({ setLoginFormActive }) {
   const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
   const [isPasswordForgot, setIsPasswordForgot] = useState(false);
   const [resetPasswordActive, setResetPasswordActive] = useState(false);
   const [loginActive, setLoginActive] = useState(true);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState({});
   const [wait, setWait] = useState(false);

   // const [error, setError] = useState({
   //    password: '',
   //    email: ''
   // })
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [loginUser, loginUserResp] = useLoginUserMutation();
   const [loginLoading, setLoginLoading] = useState(false)

   const setActiveFrame = (func) => {
      setIsPasswordForgot(false);
      setResetPasswordActive(false);
      setLoginActive(false);
      func(true);
   }

   const resetErrors = () => {
      setError(prev => {
         return {
            password: '',
            email: "",
         }
      })
   }

   const handleSubmit = (e) => {
      e.preventDefault();
      setLoginLoading(true)
      const promiseState = async state => new Promise(resolve => {
         resolve(resetErrors())
      })
      promiseState()
         .then(() => {
            loginUser({ email, password }).then((res) => {
               setLoginLoading(false)
               if (res.error) {
                  console.log('login err', res.error)
                  if (res.error.status == 500) {
                     alert('Login failed')
                     return
                  }
                  if (res.error.data.message == 'user not verified') {
                     alert('Please finish the signup flow to login!')
                     return
                  }
                  if (res.error.data.message === "user is blocked") {
                     alert('User is blocked!')
                     setError(prev => {
                        return { ...prev, email: 'User is blocked' }
                     })
                  }
                  if (res.error.data.message === "email not found") {
                     setError(prev => {
                        return { ...prev, email: 'Email not found' }
                     })
                  }
                  if (res.error.data.message === "wrong password") {
                     setError(prev => {
                        return { ...prev, password: 'Wrong password' }
                     })
                  }
                  if (res.error.data.message === "user not verified") {
                     // setError(prev => {
                     //    return { ...prev, password: 'Wrong password' }
                     // })
                  }
                  return
               }
               sessionStorage.setItem("token", res.data.data.token);
               sessionStorage.setItem("role", res.data.data.role);
               sessionStorage.setItem("userId", res.data.data.userId);
               dispatch(updateIsLoggedIn(true));
            });
         })
   };

   const props = { setActiveFrame, setResetPasswordActive };

   return (
      <div className="min-h-screen">
         <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
            <div className="bg-primary hidden lg:block">
               <ImageSlider className={styles.loginCarousel} images={[CarouselImg, CarouselImg]} pagination={true} />
            </div>
            <div className="lg:flex lg:items-center">
               {loginActive ? (
                  <div className="w-full">
                     <p className="font-bold text-[28px] lg:text-5xl leading-snug mb-7 bg-[#7152EB] lg:bg-transparent  px-[49px] lg:px-[120px] text-white lg:text-black pt-[90px] pb-[34px] lg:pt-0 lg:pb-0">
                        Login
                     </p>

                     <p className="text-lg font-bold mb-12 hidden lg:block px-[120px]">
                        Login with email address
                     </p>
                     <form onSubmit={handleSubmit} className={`px-[49px] lg:px-[120px] mt-[105px] lg:mt-0 ${wait ? 'cursor-wait' : 'cursor-default'}`}>
                        <InputField
                           Icon={EmailIcon}
                           iconSize='medium'
                           placeholder="Email address"
                           parentClassName="mb-[20px] lg:mb-6"
                           label="Email Address"
                           labelClassname="ml-2 mb-[4px] lg:mb-2 text-[12px] lg:text-[16px]"
                           inputClassName="bg-transparent"
                           inputContainerClassName='border'
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           error={error.email}
                        />

                        <InputField
                           Icon={Passwordicon}
                           iconSize='medium'
                           parentClassName="mb-[9px] lg:mb-6"
                           placeholder="Password"
                           label="Password"
                           type='password'
                           labelClassname="ml-2 mb-[4px] lg:mb-2 text-[12px] lg:text-[16px]"
                           inputClassName="bg-transparent"
                           inputContainerClassName='border'
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           error={error.password}
                           onKeyDown={e => {
                              if (e.key === 'Enter') {
                                 handleSubmit();
                              }
                           }}
                        />
                        <p
                           className="text-secondary text-[10px] lg:text-xs inline-block cursor-pointer font-semibold ml-2"
                           onClick={() =>
                              setActiveFrame(setIsPasswordForgot)
                           }
                        >
                           Forgot Password ?
                        </p>

                        <button
                           disabled={loginLoading === true ? true : !(emailValidation.test(email) && password.length > 0)}
                           className={`w-full relative bg-primaryDark disabled:bg-pink pt-3.5 pb-3.5 mt-[148px] lg:mt-12 rounded-10 text-white text-lg ${loginLoading ? 'cursor-wait' : 'cursor-pointer'}`}
                           onClick={handleSubmit}
                        >
                           Login
                           {
                              loginLoading &&
                              <Loader />
                           }
                        </button>
                        <p
                           className={`text-secondary cursor-pointer relative text-xs font-semibold ml-2 mt-2   lg:inline-block hidden`}
                           onClick={() => navigate('/signup')}
                        >
                           Sign-up Instead?
                        </p>
                     </form>

                  </div>
               ) : isPasswordForgot ? (
                  <ForgotPassword {...props} setActiveFrame={setActiveFrame}
                     setLoginActive={setLoginActive} />
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
