import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import SecondaryButton from '../../../components/Buttons/SecondaryButton';
import image from "./../../../assets/signup/image.svg"

export default function SignupSuccessful({ setFrames, setcurrentStep, addDetails, lastLoginDisabled }) {

   const navigate = useNavigate()

   useEffect(() => {
      addDetails()
   }, [])

   const handleClick = () => {
      // addDetails()
      // setFrames(prev => {
      //    return { ...prev, signupSuccessful: false, signupActive: true }
      // })
      // setcurrentStep(1)
      navigate('/')
   }

   useEffect(() => {
      setcurrentStep(7)
   }, [])

   return (
      <>
         <div className='mb-7 hidden lg:block'>
            <div>
               <p className='font-medium mb-6'>
                  Sign-up successful!
               </p>
               <p>
                  Please visit your email inbox to verify your account & set account password before you can log in.
               </p>
            </div>

            <div className='flex items-center mt-16'>
               <SecondaryButton children='Login'
                  className='text-21 py-3.2 text-white mr-6 w-140'
                  onClick={handleClick}
                  lastLoginDisabled={lastLoginDisabled} />
            </div>
         </div>
         <div className="lg:hidden">
            <img src={image} className="mt-[60px] mb-[40px]" alt="" />

            <h1 className='text-[28px] font-bold text-center'>You are all done !</h1>
            <h5 className='text-center mt-[12px] px-[3px] text-[14px] font-medium mb-[79px]'>
               Our team will soon reach out to you and help you in futher procedure.
            </h5>

            <PrimaryButton className="w-full" children="Back to Login Page" />
         </div>
      </>
   )
}
