import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import image from "./../../../assets/signup/image.svg";
import { useResentEmailMutation } from '../../../app/services/users';

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

  const handleSubmit = () => {



    resentEmailApi({ email }).then((res) => {
      console.log("Successfully resent email", res);
    });

  }



  const navigate = useNavigate();

  useEffect(() => {

  }, []);



  useEffect(() => {
    setcurrentStep(5);
  }, []);

  return (
    <>
      <div className="mb-7 hidden lg:block ">
        <div>
          <p className="font-medium mb-6">Sign-up successful!</p>
          <div className="text-center flex flex-col gap-3 text-md w-fit">
            <h3 className="font-[500]">{successfulSignUpMessage.head}</h3>
            <h4>{successfulSignUpMessage.mid}</h4>
            <h4>{successfulSignUpMessage.last} <span onClick={() => handleSubmit()} className="text-[#24A3D9] cursor-pointer">{successfulSignUpMessage.verify}</span></h4>
            <h2 className="font-bold">{successfulSignUpMessage.bottom}</h2>
          </div>
        </div>

        <div className="flex items-center mt-16">
          <SecondaryButton
            children="Back To Sign In"
            className="text-19 py-3 font-[600] px-6 bg-[#FFA28D] text-gray-50 mx-auto w-[250px]"
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
    </>
  );
}
