import InputField from "../../../../components/InputField/inputField";
import InputFieldDropdown from "../../../../components/InputField/inputFieldDropdown";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import octIcon from "../../../../assets/icons/octicon_stop-16.svg";
import maleProfileImage from "../../../../assets/profile/male.svg";
import camIcon from "../../../../assets/profile/camera.svg";

import styles from "./styles.module.css";

function AccountOverviewWithSubscriptionInfo() {
    return (
        <div className="flex w-full" >
            <div className="flex justify-between h-[700px] mb-[50px] w-full" >
                <div 
                    className="bg-[#fff] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)]" 
                    style={{width: "34.375%", height: "100%"}} 
                >

                    <div className="relative mt-[20px] left-2/4 -translate-x-2/4"
                        style={{width: "17.72%" , aspectRatio: 1}}
                    >
                        <img
                            className="h-full w-full"
                            src={maleProfileImage}
                        />

                        <img
                            className="absolute bottom-[0px] right-[0px] aspect-square w-[30px]"
                            src={camIcon}
                        />
                    </div>

                    <div 
                        className="relative flex justify-between mt-[20px] left-2/4 -translate-x-2/4"
                        style={{width: "87.27%"}}
                    >
                        <InputField
                            placeholder=""
                            parentStyle={{width: "47.9%"}}
                            parentClassName="text-xs"
                            label="First Name"
                            labelClassname="text-[#26435F] font-semibold"
                            inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
                        
                            // value={values.firstName}
                            /* onChange={(e) =>
                                setValues({
                                    ...values,
                                    firstName: e.target.value,
                                })
                            } */
                            // totalErrors={error}
                            // error={error.firstName}
                        />

                        <InputField
                            placeholder=""
                            parentStyle={{width: "47.9%"}}
                            parentClassName="text-xs"
                            label="Last Name"
                            labelClassname="text-[#26435F] font-semibold"
                            inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
                        
                            // value={values.firstName}
                            /* onChange={(e) =>
                                setValues({
                                    ...values,
                                    firstName: e.target.value,
                                })
                            } */
                            // totalErrors={error}
                            // error={error.firstName}
                        />
                    </div>

                    <InputField
                        placeholder=""
                        parentStyle={{width: "87.27%"}}
                        parentClassName="relative mt-[20px] left-2/4 -translate-x-2/4 text-xs"
                        label="Role / Job Title"
                        labelClassname="text-[#26435F] font-semibold"
                        inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
                    
                        // value={values.firstName}
                        /* onChange={(e) =>
                            setValues({
                                ...values,
                                firstName: e.target.value,
                            })
                        } */
                        // totalErrors={error}
                        // error={error.firstName}
                    />

                    <InputField
                        placeholder=""
                        parentStyle={{width: "87.27%"}}
                        parentClassName="relative mt-[20px] left-2/4 -translate-x-2/4 text-xs"
                        label="Email"
                        IconLeft={octIcon}
                        labelClassname="text-[#26435F] font-semibold"
                        inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
                    
                        // value={values.firstName}
                        /* onChange={(e) =>
                            setValues({
                                ...values,
                                firstName: e.target.value,
                            })
                        } */
                        // totalErrors={error}
                        // error={error.firstName}
                    />

                    <InputFieldDropdown
                      placeholder=""
                      parentStyle={{width: "87.27%"}}
                      parentClassName="relative mt-[20px] left-2/4 -translate-x-2/4 text-xs"
                      labelClassname="text-[#26435F] font-semibold"
                      inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[45px] text-md"
                      label="Phone"
                      /* value={values.phone}
                      codeValue={values.phoneCode} */
                      
                      /* handleCodeChange={(e) =>
                        setValues({
                          ...values,
                          phoneCode: e.target.value,
                        })
                      }
                      onChange={(e) =>
                        setValues({
                          ...values,
                          phone: e.target.value,
                        })
                      }
                      totalErrors={error}
                      codeError={error.phoneCode}
                      error={error.phone} */
                    />

                    <div
                        className="relative mt-[20px] left-2/4 -translate-x-2/4"
                        style={{width: "87.27%"}}
                    >
                        <div className="font-[300] text-[#26435F]" >Short Bio / Intro</div>
                        <textarea
                            className={`rounded-[5px] resize-none shadow-[0px_0px_2px_rgba(0,0,0,0.25)] h-[150px] w-full ${styles.bioTextarea}`}
                            placeholder="Here, you can talk about your experience, your day-to-day tasks, your personality, your hobbies, or your methodology as a tutor. 
                            Anything you feel is relevant!"
                        ></textarea>
                    </div>

                    <div 
                        className="relative flex justify-between mt-[20px] left-2/4 -translate-x-2/4"
                        style={{width: "69.09%"}}
                    >
                        <PrimaryButton
                            style={{width: "46.05%"}}
                            className={` flex justify-center  bg-[#FFA28D]  disabled:opacity-60  rounded-[10px] text-white text-sm font-medium relative py-[9px]`}
                            /* loading={emailExistLoad}
                            disabled={
                                values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                            } */
                            // onClick={handleClick}
                            children={`Save`}
                        />

                        <SecondaryButton
                            style={{width: "46.05%"}}
                            children={<span className="font-[500] text-[14px] text-[#26435F]" >Reset Password</span>}
                            className="bg-[#fff] px-[0px] rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]"
                        />
                    </div>
                </div>

                <div 
                    className="flex flex-col justify-between" 
                    style={{width: "62.5%", height: "100%"}}
                >
                    <div
                        className="bg-[#fff] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)]"
                        style={{width: "100%", height: "54.75%"}}
                    >

                    </div>

                    <div
                        className="bg-[#fff] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)]"
                        style={{width: "100%", height: "42.75%"}}
                    >

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountOverviewWithSubscriptionInfo;