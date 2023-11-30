import {
    useState,
    useEffect,
} from "react";
import InputField from "../../../../components/InputField/inputField";
import InputFieldDropdown from "../../../../components/InputField/inputFieldDropdown";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import octIcon from "../../../../assets/icons/octicon_stop-16.svg";
import maleProfileImage from "../../../../assets/profile/male.svg";
import camIcon from "../../../../assets/profile/camera.svg";
import mastercardIcon from "../../../../assets/BankCard/mastercard.svg";
import styles from "./styles.module.css";
import BankCardInfoWidget from "../../../../components/BankCard/BankCardInfoWidget";
import ActiveSubscriptionWidget from "../../../../components/ActiveSubscriptionWidget/ActiveSubscriptionWidget";
import ActiveExtensionWidget from "../../../../components/ActiveExtensionWidget/ActiveExtensionWidget";
import SubscriptionAndExtensionModal from "../../../Frames/SubscriptionAndExtensionModal/SubscriptionAndExtensionModal";
import { useLazyGetSubscriptionsInfoQuery } from "../../../../app/services/orgSignup";

import {
    useLazyGetPersonalDetailQuery,
    useUpdateUserAccountMutation,
  } from "../../../../app/services/users";

function BankCardWidgetContainer({
    className,
    style,
    bankCardClassName,
    bankCardStyle,
    cardLogo,
    deleteButtonClassName,
    deleteButtonStyle,
    onDeleteClicked,
    isDefault,
    cardNumber,
    cardNumberLastFourDigits,
}) {
    return (
        <div className={`flex flex-col items-end ${className}`} style={{...style}} >
            <BankCardInfoWidget
                className={`aspect-[270/106] w-[270px] ${bankCardClassName}`}
                style={{...bankCardStyle}}
                isDefault={isDefault}
                cardLogo={cardLogo}
                cardNumber={cardNumber}
                cardNumberLastFourDigits={cardNumberLastFourDigits}
            />

            <PrimaryButton
                style={{width: "80px", ...deleteButtonStyle}}
                className={` flex justify-center mt-[10px] bg-[#FFA28D]  disabled:opacity-60  rounded-[10px] text-white text-sm font-medium relative px-[10px] py-[7px] ${deleteButtonClassName}`}
                /* loading={emailExistLoad}
                disabled={
                    values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                } */
                onClick={onDeleteClicked}
                children={`Delete`}
            />
        </div>
    )
}

function AccountOverviewWithSubscriptionInfo() {
    const [userDetails, userDetailsStatus] = useLazyGetPersonalDetailQuery();

    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        phoneCode: "",
        company: "",
        role: "",
        userId: "",
        registrationAs: "Company",

        orgName: "",
        companyType: "",
        website: "",
        address: "",
        country: "",
        state: "",
        zip: "",
        city: "",

        activeStudents: "",
        activeTutors: "",
        services: [],
    });
    const [getSubscriptionsInfo, getSubscriptionsInfoResp] = useLazyGetSubscriptionsInfoQuery();
    const [subscriptionsInfoFromAPI, SetSubscriptionsInfoFromAPI] = useState([]);
    const [isSubscriptionAndExtensionModalActive, SetIsSubscriptionAndExtensionModalActive] = useState(false);
    const [openSubscriptionModal, SetOpenSubscriptionModal] = useState(false);
    const [openExtensionsModal, SetOpenExtensionsModal] = useState(false);

    useEffect(() => {
        userDetails()
        .then((res) => {
            console.log("userDetails");
            console.log(res);
            setValues({
                ...res?.data.data.user,
            });
            /* setFetchedData({
                ...res?.data.data.user,
            }); */
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    const fetchSubscriptionsInfo = () => {
        getSubscriptionsInfo().then((res) => {
          console.warn("Subscriptions info");
          console.warn(res.data)
          SetSubscriptionsInfoFromAPI(res.data.data);
        }).catch((error) => {
          console.error("Error while fetching subscriptions info")
          console.error(error)
        })
      }
    
    useEffect(() => {
        if(subscriptionsInfoFromAPI && subscriptionsInfoFromAPI.length > 0) return;
        fetchSubscriptionsInfo();
    }, []);

    function OnActiveSubscriptionChangePlanClicked() {
        SetIsSubscriptionAndExtensionModalActive(true);
        SetOpenSubscriptionModal(true);
    }

    function OnActiveExtensionChangePlanClicked() {
        SetIsSubscriptionAndExtensionModalActive(true);
        SetOpenExtensionsModal(true);
    }

    function OnSubscriptionAndExtensionModalCancelClicked() {
        SetIsSubscriptionAndExtensionModalActive(false);
        SetOpenSubscriptionModal(false);
        SetOpenExtensionsModal(false);
    }

    return (
        <div className="flex w-full" >

            {
                isSubscriptionAndExtensionModalActive ? (
                    <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
                        <SubscriptionAndExtensionModal
                            className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5/6 w-9/12"
                            openedFromAccountOverview={true}
                            openSubscriptionModal={openSubscriptionModal}
                            openExtensionsModal={openExtensionsModal}
                            OnCancelClicked={OnSubscriptionAndExtensionModalCancelClicked}
                            subscriptionsInfoFromAPI_Param={subscriptionsInfoFromAPI}
                        />
                    </div>
                ) : (<></>)
            }
            

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
                        
                            value={values.firstName}
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
                        
                            value={values.lastName}
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
                    
                        value={values.role}
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
                    
                        value={values.email}
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
                      value={values.phone}
                      codeValue={values.phoneCode}
                      
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
                            style={{width: "46.05%", backgroundColor: "#fff"}}
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
                        <div className="font-[600] ml-[30px] mt-[30px] text-[#26435F] text-[14px]" >Manage Your Subscription Plan</div>
                        <div className="ml-[30px]" >
                            <span className="font-[200] text-[#26435F] text-[12px]">For detailed breakdown of features, please visit our </span>
                            <button className="font-[200] inline text-[#24A3D9] text-[12px]" >pricing page.</button>
                        </div>

                        <div className="font-[600] ml-[30px] mt-[20px] text-[#FFA28D] text-[14px]" >Active Subscription</div>

                        <div 
                            className="flex justify-between ml-[30px] mt-[5px]" 
                            style={{width: "92%"}}
                        >
                            <ActiveSubscriptionWidget
                                style={{width: "65%"}}
                                canChangePlan={true}
                                planDisplayName={"Professional"}
                                subscriptionPricePerMonth={29}
                                activeTutorsAllowed={10}
                                handleChangePlan={OnActiveSubscriptionChangePlanClicked}
                            />

                            <div className="flex flex-col items-end" >
                                <div className="flex" >
                                    <span className="font-[100] text-[#517CA8] text-[12px]" >Subscription Start Date{" - "}</span>
                                    <span className="font-[400] text-[#517CA8] text-[12px]" >{"{Date}"}</span>
                                </div>

                                <div className="flex mt-[3px]" >
                                    <span className="font-[100] text-[#517CA8] text-[12px]" >Auto-Renewal Date{" - "}</span>
                                    <span className="font-[400] text-[#517CA8] text-[12px]" >{"{Date}"}</span>
                                </div>

                                <div className="flex mt-[3px]" >
                                    <span className="font-[100] text-[#517CA8] text-[12px]" >Monthly Cost (after discount){" - "}</span>
                                    <span className="font-[400] text-[#517CA8] text-[12px]" >{"{Cost}"}</span>
                                </div>

                                <div className="grow" ></div>

                                <button className="font-[400] underline text-[#24A3D9] text-[12px]" >Enable Auto-Renew</button>
                            </div>
                        </div>

                        <div className="font-[600] ml-[30px] mt-[20px] text-[#FFA28D] text-[14px]" >Active Extensions</div>

                        <div 
                            className="flex justify-between ml-[30px] mt-[5px]" 
                            style={{width: "92%"}}
                        >
                            <ActiveExtensionWidget
                                style={{width: "65%"}}
                                canChangePlan={true}
                                planDisplayName={"Assignments"}
                                subscriptionPricePerMonth={109}
                                productQuantity={1500}
                                handleChangePlan={OnActiveExtensionChangePlanClicked}
                            />

                            <div className="flex flex-col items-end" >
                                <div className="flex" >
                                    <span className="font-[100] text-[#517CA8] text-[12px]" >Subscription Start Date{" - "}</span>
                                    <span className="font-[400] text-[#517CA8] text-[12px]" >{"{Date}"}</span>
                                </div>

                                <div className="flex mt-[3px]" >
                                    <span className="font-[100] text-[#517CA8] text-[12px]" >Auto-Renewal Date{" - "}</span>
                                    <span className="font-[400] text-[#517CA8] text-[12px]" >{"{Date}"}</span>
                                </div>

                                <div className="flex mt-[3px]" >
                                    <span className="font-[100] text-[#517CA8] text-[12px]" >Monthly Cost (after discount){" - "}</span>
                                    <span className="font-[400] text-[#517CA8] text-[12px]" >{"{Cost}"}</span>
                                </div>

                                <div className="grow" ></div>

                                <button className="font-[400] underline text-[#24A3D9] text-[12px]" >Enable Auto-Renew</button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-[#fff] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)]"
                        style={{width: "100%", height: "42.75%"}}
                    >
                        <div 
                            className="flex items-center justify-between ml-[30px] mt-[20px]" 
                            style={{width: "92%"}}    
                        >
                            <div className="font-[500] text-[#26435F] text-[14px]" >Manage Payments</div>
                            <button className="font-[300] text-[#24A3D9] text-[12px] underline" >View Past Transactions</button>
                        </div>
                        
                        <div className="font-[100] ml-[30px] text-[12px]" >
                            <span className="text-[#26435F]" >Read more documentation about payment methods on Evallo’s </span>
                            <button className="inline text-[#24A3D9]" >knowledge base.</button>
                        </div>

                        <div className="font-[500] ml-[30px] mt-[20px] text-[#FFA28D] text-[14px]" >Saved Cards</div>

                        <div className={`flex ml-[30px] pl-[1px] pb-[20px] pt-[10px] overflow-x-scroll ${styles.cardsContainer}`} style={{width: "92%"}}  >

                            <BankCardWidgetContainer
                                className="mr-[20px]"
                                isDefault={true}
                            />

                            <BankCardWidgetContainer
                                className="mr-[20px]"
                                isDefault={false}
                                cardLogo={mastercardIcon}
                                cardNumber={"245234234125"}
                            />
                            

                            <button className="border-[#FFA28D] border-[3px] border-dashed rounded-[5px] aspect-[270/106] h-[106px] w-[270px]" >
                                <span className="text-[#FFA28D] text-[12px]" >Add New Payment Method</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountOverviewWithSubscriptionInfo;