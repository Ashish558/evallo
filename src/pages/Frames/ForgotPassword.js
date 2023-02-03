import React, { useState } from "react";
import InputField from "../../components/InputField/inputField";
import EmailIcon from "../../assets/form/email.svg";
import Passwordicon from "../../assets/form/password.svg";
import { useForgotPasswordMutation } from "../../app/services/auth";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword({
   setActiveFrame,
   setLoginActive,
}) {

   const emailValidate = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
   const [email, setEmail] = useState("");
   const [forgotPassword, forgotPasswordResp] = useForgotPasswordMutation()
   const [loading, setLoading] = useState(false)
   const navigate = useNavigate();


   const handleSubmit = () => {
      setLoading(true)
      forgotPassword({ email: email })
         .then(res => {
            setLoading(false)
            if (res.error) {
               console.log(res.error)
               alert(res.error.data.message)
            }
            console.log(res.data);
            // window.open(res.data.link)
         })
   }

   return (
      <div className="w-full">
         <p className="font-bold text-[28px] py-[90px] pb-[34px] lg:text-5xl leading-snug mb-7 px-[49px] lg:px-148 bg-[#7152EB] lg:bg-transparent text-white lg:text-black">
            Password Reset
         </p>

         <div className="px-[49px] lg:px-148">
            <p
               className="text-normal font-bold mb-90"
               style={{ fontSize: "18px" }}
            >
               Enter your email address that you used for you raccount. <br />
               You will receive a password reset link
            </p>

            <InputField
               Icon={EmailIcon}
               placeholder="Email address"
               parentClassName="mb-6"
               label="Email Address"
               labelClassname="ml-2 mb-2"
               inputClassName="bg-transparent"
               inputContainerClassName='border'
               onChange={(e) => setEmail(e.target.value)}
            />

            <button
               disabled={loading === true ? true : !emailValidate.test(email)}
               className="w-full relative bg-primaryDark disabled:bg-pink py-2 lg:py-4 rounded-10 text-white text-21"
               // onClick={() => setActiveFrame(setResetPasswordActive)}
               onClick={() => handleSubmit()}
            >
               Send Link
               {
                  loading &&
                  <Loader />
               }
            </button>
            <p
               className={`text-secondary cursor-pointer relative text-xs font-semibold ml-2 mt-2   lg:inline-block hidden`}
               onClick={() => setActiveFrame && setActiveFrame(setLoginActive) }
            >
              Go back to login
            </p>
         </div>
      </div>
   );
}
