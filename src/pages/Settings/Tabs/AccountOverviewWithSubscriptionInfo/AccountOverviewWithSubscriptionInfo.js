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
import ShieldIcon from "../../../../assets/icons/shield-tick-solid.svg";
import styles from "./styles.module.css";
import BankCardInfoWidget from "../../../../components/BankCard/BankCardInfoWidget";
import ActiveSubscriptionWidget from "../../../../components/ActiveSubscriptionWidget/ActiveSubscriptionWidget";
import ActiveExtensionWidget from "../../../../components/ActiveExtensionWidget/ActiveExtensionWidget";
import SubscriptionAndExtensionModal from "../../../Frames/SubscriptionAndExtensionModal/SubscriptionAndExtensionModal";
import { useLazyGetSubscriptionsInfoQuery } from "../../../../app/services/orgSignup";

import {
    useLazyGetPersonalDetailQuery,
    useLazyGetOrganizationQuery,
  } from "../../../../app/services/users";
import Modal from "../../../../components/Modal/Modal";
import Modal2 from "../../../../components/Modal2/Modal2";
import ViewTransactionsModal from "../../../../components/ViewTransactionsModal/ViewTransactionsModal";
import AddNewBankCardModal from "../../../../components/AddNewBankCardModal/AddNewBankCardModal";

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
                className={`${bankCardClassName}`}
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
    const [getPersonalDetail, getPersonalDetailResp] = useLazyGetPersonalDetailQuery();
    const [getOrgDetails, getOrgDetailsResp] = useLazyGetOrganizationQuery();
    const [subscriptionsInfoFromAPI, SetSubscriptionsInfoFromAPI] = useState([]);
    const [activeSubscriptionName, SetActiveSubscriptionName] = useState("Professional");
    const [activeSubscriptionInfo, SetActiveSubscriptionInfo] = useState({
        planDisplayName: "",
        activeTutorsAllowed: 0,
        currency: "",
        subscriptionPricePerMonth: 0,
        freeTrialExpiryDate: null,
        subscriptionStartDate: null,
        monthlyCostAfterDiscount: 0,
        autoRenewalDate: null,
    });
    const [isSubscriptionAndExtensionModalActive, SetIsSubscriptionAndExtensionModalActive] = useState(false);
    const [isResetPasswordModalActive, SetIsResetPasswordModalActive] = useState(false);
    const [isPasswordResetLinkSentModalActive, SetIsPasswordResetLinkSentModalActive] = useState(false);
    const [isCancelSubscriptionModalActive, SetIsCancelSubscriptionModalActive] = useState(false);
    const [isViewTransactionsModalActive, SetIsViewTransactionsModalActive] = useState(false);
    const [isAddNewBankCardModalActive, SetIsAddNewBankCardModalActive] = useState(true);
    const [openSubscriptionModal, SetOpenSubscriptionModal] = useState(false);
    const [openExtensionsModal, SetOpenExtensionsModal] = useState(false);
    const [stripeCustomerId, SetStripeCustomerId] = useState("");
    const [activeTutorsCount, setActiveTutorsCount] = useState(0)

    // console.log("activeTutorsCount - " + activeTutorsCount);
    useEffect(() => {
        // console.log("activeSubscriptionName - " + activeSubscriptionName);
    },[activeSubscriptionName])

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

    useEffect(() => {
        let orgDetails = sessionStorage.getItem("orgDetails");
        // console.log(orgDetails);
        // if(orgDetails === '' || orgDetails === undefined || orgDetails === null) {
            getPersonalDetail()
            .then(data => {
                // console.log("getPersonalDetail");
                // console.log(data);
                const user = data.data.data.user;
            
                getOrgDetails(user.associatedOrg)
                .then(data => {
                    console.log('getOrgDetails', data.data);
                    try {      
                        if(data.data.customerSubscriptions?.data){
                            if(data.data.customerSubscriptions?.data[0]){
                                const metadata = data.data.customerSubscriptions?.data[0].metadata
                                if(metadata.type === 'default'){
                                    setActiveTutorsCount(parseInt(metadata.active_tutors))
                                }
                            }
                        }
                    } 
                    catch (error) {
                        
                    }
                    sessionStorage.setItem("orgDetails", JSON.stringify(data.data));
                    // SetStripeCustomerId(data.data.stripeCustomerDetails.id);
                    /* SetCompanyInfo({
                        nameOfBusiness: data.data.organisation.company,
                        accountType: data.data.user.registrationAs,
                        businessEntity: data.data.organisation.companyType,
                    }) */
                })
                .catch(error => {
                    console.log("Error in getOrgDetails");
                    console.log(error);
                });
        
            })
            .catch(error => {
            console.log("Error in getPersonalDetail");
            console.log(error);
            });

            return;
        

        /* if(orgDetails.stripeCustomerDetails) {
            SetStripeCustomerId(orgDetails.stripeCustomerDetails.id);
        } */

        /* if(orgDetails.organisation && orgDetails.user) {
            SetCompanyInfo({
                nameOfBusiness: orgDetails.organisation.company,
                accountType: orgDetails.user.registrationAs,
                businessEntity: orgDetails.organisation.companyType,
            });
        } */
        
        

    }, []);

    useEffect(() => {
        if(!(subscriptionsInfoFromAPI && subscriptionsInfoFromAPI.length > 0)) return;

        for(let i = 0; i < subscriptionsInfoFromAPI.length; i++) {
            let product = subscriptionsInfoFromAPI[i];
            if(product.product.metadata.type !== "default") continue;
            if(product.product.name !== activeSubscriptionName) continue;

            SetActiveSubscriptionInfo({
                planDisplayName: product.product.name,
                activeTutorsAllowed: parseInt(product.product.metadata.active_tutors),
                currency: product.currency,
                subscriptionPricePerMonth: product.unit_amount / 100,
                monthlyCostAfterDiscount: product.unit_amount / 100,
                subscriptionStartDate: new Date(),
            });

            return;
        }
    }, [subscriptionsInfoFromAPI]);

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

    function OnResetPasswordClicked() {
        SetIsResetPasswordModalActive(true);
    }

    function OnResetPasswordModalCancelClicked() {
        SetIsResetPasswordModalActive(false);
    }

    function OnResetPasswordModalSendClicked() {
        SetIsResetPasswordModalActive(false);
        SetIsPasswordResetLinkSentModalActive(true);

        const makePasswordResetLinkSentModalDisappearAfterFewSeconds = () => {
            setTimeout(() => {
                SetIsPasswordResetLinkSentModalActive(false);
            }, 1500);
        }

        makePasswordResetLinkSentModalDisappearAfterFewSeconds();
    }

    function OnCancelSubscriptionClicked() {
        SetIsCancelSubscriptionModalActive(true);
    }

    function OnCancelSubscriptionModalCancelSubscriptionButtonClicked() {
        SetIsCancelSubscriptionModalActive(false);
    }

    function OnCancelSubscriptionModalCrossIconClicked() {
        SetIsCancelSubscriptionModalActive(false);
    }

    function OnCancelSubscriptionModalChangePlanClicked() {
        SetIsCancelSubscriptionModalActive(false);
        SetOpenSubscriptionModal(true);
        SetIsSubscriptionAndExtensionModalActive(true);
    }

    function OnViewPastTransactionsClicked() {
        SetIsViewTransactionsModalActive(true);
    }

    function OnViewTransactionsModalCrossIconClicked() {
        SetIsViewTransactionsModalActive(false);
    }

    function OnAddNewBankCardModalCrossIconClicked() {
        SetIsAddNewBankCardModalActive(false);
    }

    function OnAddNewPaymentMethodClicked() {
        SetIsAddNewBankCardModalActive(true);
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
                            activeSubscriptionName={activeSubscriptionName}
                        />
                    </div>
                ) : (<></>)
            }

            {
                isResetPasswordModalActive ? (
                    <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
                        <div className="relative flex flex-col items-center bg-[#fff] rounded-[8px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[666/190] w-[600px]" >
                            <div className="font-[100] mt-[20px] text-center text-[#26435F] text-[21px] w-11/12" >
                            A Password Reset Link will be sent to you. Please click on it to change your password.
                            </div>

                            <div className="flex justify-between mt-[20px] w-6/12" >
                                <SecondaryButton
                                    style={{width: "46.05%", backgroundColor: "#fff"}}
                                    children={<span className="font-[500] text-[14px] text-[#FF7979]" >Cancel</span>}
                                    className="bg-[#fff] border-[#FF7979] border-[1px] px-[0px] rounded-[10px]"
                                    onClick={OnResetPasswordModalCancelClicked}
                                />

                                <PrimaryButton
                                    style={{width: "46.05%"}}
                                    className={` flex justify-center  bg-[#FFA28D]  disabled:opacity-60  rounded-[10px] text-white text-sm font-medium relative py-[9px]`}
                                    /* loading={emailExistLoad}
                                    disabled={
                                        values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                                    } */
                                    onClick={OnResetPasswordModalSendClicked}
                                    children={`Okay`}
                                />    
                            </div>
                        </div>
                    </div>
                ) : (<></>)
            }

            {
                isPasswordResetLinkSentModalActive ? (
                    <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
                        <div className="relative bg-[#38C980] flex items-center px-[25px] py-[5px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-fit" >
                            <img src={ShieldIcon} />
                            <div className="ml-[10px] text-[#fff]" >Password Reset Link Sent To {values.email}</div>
                        </div>
                    </div>
                ) : (<></>)
            }

            {
                isCancelSubscriptionModalActive ? (
                    <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
                        <Modal2
                            className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[497/266] w-[25.88vw]"
                            title="Cancel Subscription"
                            titleClassName="font-[600] text-[20px]"
                            headerClassName={`pl-[20px] pr-[20px] pb-[10px] pt-[30px]`}
                            OnCrossIconClicked={OnCancelSubscriptionModalCrossIconClicked}
                        >
                            <div 
                                className="flex flex-col items-center w-full"
                            >
                                <div className="mt-[20px] text-[#517CA8] text-[13px] w-11/12" >
                                ⚠️ <span className="font-[600]" >Note:</span> If you cancel the plan, you will lose ALL access to your Evallo account after the subscription reaches expiry date.
                                </div>
                                <div className="flex items-center justify-between 2xl:mt-[0px] design:mt-[40px] w-9/12" >
                                    <SecondaryButton
                                        style={{width: "46.05%", backgroundColor: "#fff"}}
                                        children={<span className="font-[500] text-[12px] text-[#FF7979]" >Cancel Subscription</span>}
                                        className="bg-[#fff] px-[0px] rounded-[10px]"
                                        onClick={OnCancelSubscriptionModalCancelSubscriptionButtonClicked}
                                    />

                                    <PrimaryButton
                                        style={{width: "46.05%"}}
                                        className={` flex justify-center px-[0px] 2xl:px-[5px] bg-[#FFA28D]  disabled:opacity-60  rounded-[10px] text-white text-sm font-medium relative py-[9px]`}
                                        /* loading={emailExistLoad}
                                        disabled={
                                            values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                                        } */
                                        onClick={OnCancelSubscriptionModalChangePlanClicked}
                                        children={<span className="text-[12px]" >Change Plan Instead</span>}
                                    />   
                                </div>
                            </div>
                        </Modal2>
                    </div>
                ) : (<></>)
            }

            {
                isViewTransactionsModalActive ? (
                    <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
                        <ViewTransactionsModal
                            className={`relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[1110/382] w-[57.8125%]`}
                            OnCrossIconClicked={OnViewTransactionsModalCrossIconClicked}
                        />
                    </div>
                ) : (<></>)
            }

            {
                isAddNewBankCardModalActive ? (
                    <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
                    <AddNewBankCardModal
                        className={`relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[1110/382] w-[57.8125%]`}
                        OnCrossIconClicked={OnAddNewBankCardModalCrossIconClicked}
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
                            onClick={OnResetPasswordClicked}
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
                                planDisplayName={activeSubscriptionInfo.planDisplayName}
                                subscriptionPricePerMonth={activeSubscriptionInfo.subscriptionPricePerMonth}
                                activeTutorsAllowed={activeSubscriptionInfo.activeTutorsAllowed}
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

                                <button className="font-[400] underline text-[#24A3D9] text-[12px]" onClick={OnCancelSubscriptionClicked} >Cancel Subscription</button>
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
                            <div className="font-[600] text-[#26435F] text-[0.972vw]" >Manage Payments</div>
                            <button 
                                className="font-[300] text-[#24A3D9] text-[12px] design:text-[15px] underline" 
                                onClick={OnViewPastTransactionsClicked}
                            >View Past Transactions</button>
                        </div>
                        
                        <div className="font-[100] ml-[30px] text-[12px]" >
                            <span className="text-[#26435F]" >Read more documentation about payment methods on Evallo’s </span>
                            <button className="inline text-[#24A3D9]" >knowledge base.</button>
                        </div>

                        <div className="font-[600] ml-[30px] mt-[20px] text-[#FFA28D] text-[14px]" >Saved Cards</div>

                        <div className={`flex items-start justify-between ml-[30px] pl-[0px] pb-[0px] pt-[0px] w-11/12`} >

                            <BankCardWidgetContainer
                                className="w-[33.15%]"
                                bankCardClassName="aspect-square-[305/106] w-full"
                                isDefault={true}
                                
                            />

                            <BankCardWidgetContainer
                                className="w-[33.15%]"
                                bankCardClassName="aspect-square-[305/106] w-full"
                                isDefault={false}
                                cardLogo={mastercardIcon}
                                // cardNumber={"245234234125"}
                            />
                            

                            <button 
                                className="box-border border-[#FFA28D] border-[3px] border-dashed rounded-[5px] aspect-[270/106] w-[29.34%]"
                                onClick={OnAddNewPaymentMethodClicked}
                            >
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