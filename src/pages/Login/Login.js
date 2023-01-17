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

export default function Login({ setLoginFormActive }) {
   const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
   const [isPasswordForgot, setIsPasswordForgot] = useState(false);
   const [resetPasswordActive, setResetPasswordActive] = useState(false);
   const [loginActive, setLoginActive] = useState(true);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState({})

   // const [error, setError] = useState({
   //    password: '',
   //    email: ''
   // })
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [loginUser, loginUserResp] = useLoginUserMutation();

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

   const handleSubmit = () => {
      const promiseState = async state => new Promise(resolve => {
         resolve(resetErrors())
      })
      promiseState()
         .then(() => {
            loginUser({ email, password }).then((res) => {
               if (res.error) {
                  console.log('login err', res.error)
                  if (res.error.status == 500) {
                     alert('Login failed')
                     return
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
                     <div className="px-[49px] lg:px-[120px]">
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
                           disabled={!(emailValidation.test(email) && password.length > 0)}
                           className="w-full bg-primaryDark disabled:bg-pink pt-3.5 pb-3.5 mt-[148px] lg:mt-12 rounded-10 text-white text-lg"
                           onClick={handleSubmit}
                        >
                           Login
                        </button>
                        <p
                           className="text-secondary text-xs font-semibold ml-2 mt-2 cursor-pointer lg:inline-block hidden"
                           onClick={() => navigate('/signup')}
                        >
                           Sign-up Instead?
                        </p>
                     </div>

                  </div>
               ) : isPasswordForgot ? (
                  <ForgotPassword {...props} />
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
