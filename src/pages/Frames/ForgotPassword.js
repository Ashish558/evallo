import React, { useState } from "react";
import InputField from "../../components/InputField/inputField";
import EmailIcon from "../../assets/form/email.svg";
import Passwordicon from "../../assets/form/password.svg";
import { useForgotPasswordMutation } from "../../app/services/auth";

export default function ForgotPassword({
   setActiveFrame,
   setResetPasswordActive,
   setLoginActive
}) {
   const emailValidate = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
   const [email, setEmail] = useState("");
   const [forgotPassword, forgotPasswordResp] = useForgotPasswordMutation()
   const [wait, setWait] = useState(false);

   const handleSubmit = (e) => {
      e.preventDefault();
      setWait(true)
      forgotPassword({ email: email })
         .then(res => {
            setWait(false);
            if (res.error) {
               console.log(res.error)
               alert(res.error.data.message)
            }
            console.log(res.data);
            window.open(res.data.link)
         })
   }

   return (
      <div className={`w-full ${wait && 'cursor-wait'}`}>
         <p className="font-bold text-[28px] py-[90px] pb-[34px] lg:text-5xl leading-snug mb-7 px-[49px] lg:px-148 bg-[#7152EB] lg:bg-transparent text-white lg:text-black">
            Password Reset
         </p>

         <form onSubmit={handleSubmit} className="px-[49px] lg:px-148">
            <p
               className="text-normal font-bold mb-90"
               style={{ fontSize: "18px" }}
            >
               Enter the email that you used for your account. <br />
               You wil receive a password reset link.
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

            <input
               disabled={!emailValidate.test(email)}
               className={`w-full bg-primaryDark disabled:bg-pink py-2 lg:py-4 rounded-10 text-white text-21 ${wait ? "cursor-wait" : 'cursor-pointer'}`}
               // onClick={() => setActiveFrame(setResetPasswordActive)}
               // onClick={() => handleSubmit()}
               type="submit"
               value="Send Link"
            />

            <p
               className="text-secondary text-xs font-semibold ml-2 mt-2 cursor-pointer lg:inline-block hidden"
               onClick={() => setLoginActive(true)}
            >
               Go Back to Login
            </p>
         </form>
      </div>
   );
}
