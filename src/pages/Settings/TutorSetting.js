import React, { useEffect } from 'react'
import InputField from '../../components/InputField/inputField'
import { useSelector } from 'react-redux';
import InputFieldDropdown from '../../components/InputField/inputFieldDropdown';
import { useState } from 'react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import Modal from '../../components/Modal/Modal';
import axios from 'axios';
import { useUpdateEmailMutation } from "../../app/services/organization";
import {
    useLazyGetPersonalDetailQuery,
    useUpdateUserAccountMutation,
} from "../../app/services/users"
export default function TutorSetting() {
    const { organization } = useSelector((state) => state.organization);
    const details = useSelector((state) => state.user)
    const [otherDetails, setOtherDetails] = useState(details);
    const [prevDetails, setPrevDetails] = useState(details);
    const [showmodal, setShowModal] = useState(false);
    const [link, setLink] = useState(false)
    const [email, updateEmail] = useUpdateEmailMutation();
    const [userDetails, userDetailsStatus] = useLazyGetPersonalDetailQuery();
    const [updateAccount, updateAccountStatus] = useUpdateUserAccountMutation();

    useEffect(() => {
        console.log("tutor", details);
    }, [])
    const resetPassword = async () => {
        try {
            if (otherDetails.email !== "" && otherDetails.email !== prevDetails.email) {
                email(`${otherDetails.email}`).then((res) => { console.log("email link sent") })
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    const handleEmpty = (val) => {
        if (!val || val.length === 0 || val?.trim()?.length === 0) {
          return true;
        }
        return false;
      };
    const updateBasics = async () => {
        console.log(prevDetails)
        let arr=["firstName", "lastName", "email"]
            let  emptyCheck=false;
            for (let i=0; i<arr.length; i++) {
              if(handleEmpty(otherDetails[arr[i]])) {
                alert(`${arr[i]} cannot be empty.`)
               emptyCheck=true;
                return false;
              }
            }
            if(emptyCheck) return false;
        try {

            
            let reqBody = { ...otherDetails };
            delete reqBody["_id"];
            delete reqBody["email"];
            console.log("req-body", reqBody)
            updateAccount(reqBody)
                .then((res) => {
                    alert("Account details updated succesfully")
                    console.log(res);
                }).catch((e) => console.log(e))
        }
        catch (e) {
            console.log(e);
        }
    }
    return (
        <>
            <div className=" bg-lightWhite min-h-screen px-[120px] pt-[50px] pb-[50px] lg:px-[120px] ">
                <p className="text-[#24A3D9]  mb-9 ">
                    {organization?.company + "  >  "}
                    <span className="font-semibold">Settings</span>
                </p>
                <div className='flex gap-4 items-center'>
                    <InputField
                        label="First Name"
                        inputClassName="bg-white border border-white text-[#667085] "
                        inputContainerClassName="bg-white"
                        placeholder="First Name"
                        value={otherDetails.firstName}
                        onChange={(e) => {
                            const updatedDetails = { ...otherDetails, firstName: e.target.value };
                            setOtherDetails(updatedDetails);
                        }
                        }
                    />
                    <InputField
                        label="Last Name"
                        inputClassName="bg-white border border-white text-[#667085]"
                        inputContainerClassName="bg-white"
                        placeholder="Last Name"
                        value={otherDetails.lastName}
                        onChange={(e) => {
                            const updateDetails = { ...otherDetails, lastName: e.target.value };
                            setOtherDetails(updateDetails)

                        }}
                    />
                    <InputField
                        label="Email"
                        inputClassName="bg-white border border-white text-[#667085]"
                        inputContainerClassName="bg-white"
                        placeholder="Email"
                        value={otherDetails.email}
                        onChange={(e) => {
                            const updateDetails = { ...otherDetails, email: e.target.value };
                            setOtherDetails(updateDetails)

                        }}
                    />
                    <InputField
                        label="Phone"
                        inputClassName="bg-white border border-white text-[#667085]"
                        inputContainerClassName="bg-white"
                        placeholder="Phone"
                        value={otherDetails.phone}
                        onChange={(e) => {
                            const updateDetails = { ...otherDetails, phone: e.target.value };
                            setOtherDetails(updateDetails)

                        }}

                    />
                    <button className='bg-primary rounded w-[175px] h-[50px] mt-4 text-[#EEEEEE]' onClick={updateBasics}>
                        Save
                    </button>
                </div>
                <div className='mt-5'>
                    <p className=' text-sm font-semibold '>Send Link</p>
                    <button className='rounded bg-[#517CA8] text-[#EEEEEE] h-[50px] w-[175px]' onClick={(e) => { setShowModal(true); setLink(true); resetPassword() }} >
                        Reset Password
                    </button>
                    {link && <div className='mt-3 bg-[#77DD7733] text-[#77DD77] rounded w-[500.5px] items-center flex h-[32px]'>Password Reset Link Sent To {otherDetails.email}</div>}
                    {
                        showmodal && <>
                            <Modal

                                classname="w-[500px] flex    md:pb-5 mx-auto overflow-visible pb-5"
                                handleClose={() => setShowModal(false)}
                                cancelBtnStyle={{ top: '8px' }}
                                underline={true}
                                body={
                                    <><div>
                                        <div>
                                            <div className='text-[#26435F] font-semibold text-center'>A Password Reset Link will be sent to you. Please click on it to change your password.</div>
                                        </div>
                                        <div className='flex items-center justify-center'>
                                            <button className='w-[146px] h-[46.67px] bg-primary text-white mt-3 rounded' onClick={() => setShowModal(false)}>Okay</button>
                                        </div>
                                    </div>
                                    </>
                                }
                            >

                            </Modal>
                        </>
                    }
                </div>


                <div className='mt-40 flex gap-10'>
                    <div>
                        <p className='text-smm font-semibold'>Submit Feedback</p>
                        <textarea cols={58} className='rounded text-[#667085] pl-3 pr-3' rows={12} placeholder='If you have any feedback for this online platform, please submit 
it here. Our team takes every suggestion seriously.'></textarea>
                        <div className='flex justify-end'>
                            <button className='bg-[#517CA8] rounded text-[#FFFFFF] w-[98.7px] h-[48px]' >Submit</button>
                        </div>
                    </div>
                    <div>
                        <p className='text-smm font-semibold'>Request Technical Support</p>
                        <textarea cols={58} className='rounded text-[#667085] pl-3 pr-3' rows={12} placeholder='If you require technical support, please submit your request hereand our team will help you out accordingly.'></textarea>
                        <div className='flex justify-end'>
                            <button className='bg-[#517CA8] rounded text-[#FFFFFF] w-[98.7px] h-[48px]' >Submit</button>
                        </div>
                    </div>


                </div>
            </div>

        </>
    )
}
