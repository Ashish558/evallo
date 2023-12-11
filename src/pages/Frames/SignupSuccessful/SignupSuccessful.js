import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import image from "./../../../assets/signup/image.svg";
import { useResentEmailMutation } from '../../../app/services/users';
import styles from './SignupSuccessful.module.css'

export default function SignupSuccessful({
  frames,
  setFrames,
  successfulSignUpMessage,
  setcurrentStep,
  addDetails,
  lastLoginDisabled,
  handleSuccessfullBack,
  handleSignup,
  email
}) {
  const [resentEmailApi, setResentEmailApi] = useResentEmailMutation();
  const [loading, setLoading] = useState(false)
  const handleSubmit = () => {
    if (loading)
      return

    setLoading(true)
    resentEmailApi({ email }).then((res) => {
      if (res?.data?.status === 'success') {
        alert("New email verification link sent.")
      }
      else {
        alert("Error occured while sending new verification email!")
      }
      console.log(" resent email status", res);

      setLoading(false)
    }).catch((err) => {
      alert("Error occured while sending new verification email!")
      if (err?.data?.message)
        alert(err?.data?.message)
      setLoading(false)
    });

  }



  const navigate = useNavigate();

  useEffect(() => {

  }, []);



  useEffect(() => {
    setcurrentStep(5);
  }, []);

  return (
    <div className="">
      <div className=" hidden lg:block ">
        <div className='w-[563px]   mx-auto mb-[54px] text-center text-[18px] font-medium text-[#26435F]'>
        A verification link has been sent to your email.<br/>
Please click on it to verify your email and set a new password.
        </div>
        <div>

          <div className="text-justify text-[#26435F] flex flex-col gap-3  text-base w-fit design:text-base">
            <p className="!font-light !text-center">{successfulSignUpMessage.head}</p>
            <p  className={styles.textAlignLast}>{successfulSignUpMessage.mid}</p>
            <h4  className={styles.textAlignLast}>{successfulSignUpMessage.last} <span onClick={() => handleSubmit()} className={`text-[#24A3D9] underline cursor-pointer ${loading ? 'opacity-70 !font-medium' : '!font-medium'}`}>{successfulSignUpMessage.verify}</span></h4>
            <h2 className="!font-medium tracking-wider !text-center text-[#26435F]">{successfulSignUpMessage.bottom}</h2>
          </div>
        </div>

        <div className="flex items-center mt-[50px] ">
          <SecondaryButton
            children="Back to Sign in"
            className="text-[18.6px] py-1  px-2 !bg-[#FFA28D] !text-white mx-auto w-[337.5px] h-[50px] font-medium"
            onClick={handleSuccessfullBack}
            lastLoginDisabled={lastLoginDisabled}
          />
        </div>
      </div>
      <div className="lg:hidden">
        <img src={image} className="mt-[60px] mb-[40px]" alt="" />

        <h1 className="text-[28px] font-bold text-center">
          You are all done !
        </h1>
        <h5 className="text-center mt-[12px] px-[3px] text-[14px] font-medium mb-[79px]">
          Our team will soon reach out to you and help you in futher procedure.
        </h5>

        <PrimaryButton
          className="w-full"
          children="Back to Login Page"
          onClick={() => {
            sessionStorage.clear();
            navigate("/")
          }}
        />
      </div>
    </div>
  );
}
