import React, { useState } from "react";
import InputField from "../../components/InputField/inputField";
import EmailIcon from "../../assets/form/email.svg";
import Passwordicon from "../../assets/form/password.svg";
import { useForgotPasswordMutation } from "../../app/services/auth";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";

export default function ForgotPassword({
   setActiveFrame,
   setLoginActive,
}) {
   const emailValidate = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
   const [email, setEmail] = useState("");
   const [forgotPassword, forgotPasswordResp] = useForgotPasswordMutation()
   const [loading, setLoading] = useState(false)
   const navigate = useNavigate();


   const handleSubmit = (e) => {
      e.preventDefault()
      setLoading(true)
      forgotPassword({ email: email })
         .then(res => {
            setLoading(false)
            if (res.error) {
               console.log(res.error)
               alert(res.error.data.message)
               return
            }
            console.log(res.data);
            alert('Link sent successfully, You will be now redirected to login.')
            setLoginActive(true)
            // window.open(res.data.link)
         })
   }

   return (
      <div className={`w-full ${loading && 'cursor-wait'} pb-12 mt-3`}>
         <p className="font-bold text-[28px] py-[20px] pb-[34px] lg:text-5xl leading-snug mb-7 px-[49px] lg:px-148  lg:bg-transparent   text-[#26435F]">
            Password Reset
         </p>

         <form onSubmit={handleSubmit} className="px-[49px] lg:px-148 text-[#26435F] font-medium">
            <p
               className="text-normal font-bold mb-[50px]"
               style={{ fontSize: "18px" }}
            >
               Enter your email address that you used for your account. <br />
               You will receive a password reset link
            </p>

            <InputField
               Icon={EmailIcon}
               placeholder="Email address"
               parentClassName="mb-6"
               biggerText={true}
               labelClassname="text-[#26435F] font-medium !text-lg mb-1"
               label="Email Address"
             
               iconSize="medium"
            
             

               removeResponsive={true}
               
               inputClassName="bg-transparent  !text-lg"
               inputContainerClassName="hover:border-[#FFA28D] border-[0.936px] !text-lg border-[#D0D5DD]  h-[49px]  rounded-[6px] w-full"
             
             
               onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
               <input
                  disabled={loading === true ? true : !emailValidate.test(email)}
                  className={`w-full relative bg-primary disabled:bg-primary py-2 lg:py-4 rounded-10 text-white text-21 ${loading ? 'opacity-60 pointer-events-none' : ''} mt-10`}
                  // onClick={() => setActiveFrame(setResetPasswordActive)}
                  // onClick={() => handleSubmit()}
                  type="submit"
                  value="Send Link"
               />
               {
                  loading &&
                  <Loader />
               }
            </div>

            {/* <p
               className="text-secondary text-xs relative font-semibold ml-2 mt-2 cursor-pointer lg:inline-block hidden"
               onClick={() => setLoginActive(true)}
            >
               Send Link
               {
                  true &&
                  <Loader />
               }
            </p> */}
            <p
               className={`text-[#24A3D9] cursor-pointer relative text-xs font-semibold ml-2 mt-2   lg:inline-block hidden`}
               onClick={() => setActiveFrame && setActiveFrame(setLoginActive)}
            >
               Go back to login
            </p>
         </form>
      </div>
   );
}
