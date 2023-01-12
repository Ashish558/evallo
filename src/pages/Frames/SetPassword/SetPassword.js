import React, { useState } from 'react'
import InputField from '../../../components/InputField/inputField'
import Passwordicon from '../../../assets/form/password.svg'
import styles from '../../Signup/signup.module.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useChangePasswordMutation, useSetPasswordMutation } from '../../../app/services/auth';
import { validatePassword } from './utils';

export default function SetPassword({ signup, setLoginFormActive, resetPassword }) {

   const [searchParams, setSearchParams] = useSearchParams();
   const userId = searchParams.get("userid")
   const token = searchParams.get("token")

   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')

   const [error, setError] = useState({
      password: "",
      confirmPassword: "",
   })

   const [setUserPassword, setUserPasswordResp] = useSetPasswordMutation()
   const [changePassword, changePasswordResp] = useChangePasswordMutation()
   const navigate = useNavigate()

   const resetErrors = () => {
      setError(prev => {
         return {
            password: "",
            confirmPassword: "",
         }
      })
   }

   const handleSubmit = () => {
      const promiseState = async state => new Promise(resolve => {
         resolve(resetErrors())
      })

      promiseState()
         .then(() => {
            const reqBody = { password, token }
            const result = validatePassword({ password, confirmPassword })
            // console.log(result);
            if (result.data !== true) {
               setError(prev => {
                  return {
                     ...prev,
                     [result.data]: result.message
                  }
               })
            } else {
               if (resetPassword) {
                  changePassword({ userId, body: reqBody })
                     .then(res => {
                        if (res.error) {
                           console.log(res.error)
                           alert(res.error.data.message)
                        }
                        console.log(res.data);
                        // setLoginFormActive(true)
                        navigate('/')
                     })
               } else {
                  setUserPassword({ userId, body: reqBody })
                     .then(res => {
                        console.log(res)
                        // setLoginFormActive(true)
                        navigate('/')
                     })
               }
            }

         })

   }

   return (
      <>
         <div className="min-h-screen" id={styles.signUp}>
            <div className="grid grid-cols-2 min-h-screen">
               <div className="bg-primary"></div>
               <div className="flex items-center">

                  <div className={`w-full ${signup ? '' : 'px-148'} `}>
                     <p className='font-bold text-4xl leading-snug mb-7'>
                        Set New Password
                     </p>

                     <p className='mb-12 text-black-900'>
                        The password must contain 8 characters
                     </p>

                     <InputField Icon={Passwordicon}
                        parentClassName='mb-6 relative' 
                        type='password'
                        placeholder='minimum 8 characters'
                        inputContainerClassName='border pt-3 pb-3'
                        label='Set New Password'
                        labelClassname='ml-2 mb-2'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        error={error.password}
                     />

                     <InputField Icon={Passwordicon}
                        parentClassName='mb-2.5 relative'
                        type='password'
                        placeholder='Confirm Password'
                        inputContainerClassName='border pt-3 pb-3'
                        label='Confirm Password'
                        labelClassname='ml-2 mb-2'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        error={error.confirmPassword}
                     />

                     <button 
                        className='w-full bg-primaryDark font-medium disabled:bg-pink pt-3 pb-3 mt-12 rounded-10 text-white text-lg'
                        onClick={handleSubmit}
                     >
                        Set New Password
                     </button>

                  </div>

               </div>
            </div>
         </div>


      </>
   )
}
