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
      <div className="mb-7 hidden lg:block ">
        <div className='h-[1px] bg-[#EBEBEB] mt-[-20px] mx-[6px] w-full mb-[50px]'>

        </div>
        <div>

          <div className="text-justify text-[#26435F] flex flex-col gap-3  text-[14px] w-fit design:text-base">
            <p className="!font-light !text-center">{successfulSignUpMessage.head}</p>
            <p  className={styles.textAlignLast}>{successfulSignUpMessage.mid}</p>
            <h4  className={styles.textAlignLast}>{successfulSignUpMessage.last} <span onClick={() => handleSubmit()} className={`text-[#24A3D9] underline cursor-pointer ${loading ? 'opacity-70 !font-medium' : '!font-medium'}`}>{successfulSignUpMessage.verify}</span></h4>
            <h2 className="!font-medium tracking-wider !text-center text-[#26435F]">{successfulSignUpMessage.bottom}</h2>
          </div>
        </div>

        <div className="flex items-center mt-16">
          <SecondaryButton
            children="Back to Sign in"
            className="text-19 py-3  px-6 !bg-[#FFA28D] !text-white mx-auto w-[270px]"
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
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
}
