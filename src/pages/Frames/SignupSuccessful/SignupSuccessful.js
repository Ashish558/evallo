import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SecondaryButton from '../../../components/Buttons/SecondaryButton'

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
      <div className='mb-7'>
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
   )
}
