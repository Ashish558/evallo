import {
    useState,
    useEffect,
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
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
import { useUpdateEmailMutation } from "../../../../app/services/organization";
import { useForgotPasswordMutation } from "../../../../app/services/auth";
import { 
    closeModal as closeSubscriptionAndExtensionModal, 
    openModal as openSubscriptionAndExtensionModal ,
    openModalInUpdateMode as openSubscriptionAndExtensionModalInUpdateMode,
    openSubscriptionPanelInUpdateMode,
    openExtensionsPanelInUpdateMode,
    openSubscriptionPanelInRenewProductMode,
} from "../../../../app/slices/subscriptionUI";

import {
    useLazyGetPersonalDetailQuery,
    useLazyGetOrganizationQuery,
    useDeletePaymentMethodMutation,
    useUpdateUserAccountMutation,
  } from "../../../../app/services/users";
import Modal from "../../../../components/Modal/Modal";
import Modal2 from "../../../../components/Modal2/Modal2";
import ViewTransactionsModal from "../../../../components/ViewTransactionsModal/ViewTransactionsModal";
import AddNewBankCardModal from "../../../../components/AddNewBankCardModal/AddNewBankCardModal";
import visaIcon from "../../../../assets/BankCard/visa.svg";
import { useCancelSubscriptionMutation, useEnableAutoRenewalMutation } from "../../../../app/services/subscription";
import DeletePaymentMethodModal from "../../../../components/DeletePaymentMethodModal/DeletePaymentMethodModal";
import { CurrencyNameToSymbole, getFormattedDate } from "../../../../utils/utils";
import EnableAutoRenewal from "../../../../components/EnableAutoRenewal/EnableAutoRenewal";
import ResetPasswordModal from "../../../../components/ResetPasswordModal/ResetPasswordModal";
import ChangeEmailModal from "../../../../components/ChangeEmailModal/ChangeEmailModal";

function getDateAsString(date) {
    if(!(date && date.constructor && date.constructor.name === "Date")) return "05/12/23";
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear() % 2000;
    return "" + d + "/" + m + "/" + y;
}

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

    const [error, setError] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subscriptionCode: "",
        company: "",
    });

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
    const [deletePaymentMethod] = useDeletePaymentMethodMutation();
    const [cancelSubscription] = useCancelSubscriptionMutation();
    const [updateAccount, updateAccountStatus] = useUpdateUserAccountMutation();
    const [updateEmail, setUpdateEmail] = useUpdateEmailMutation();
    const [forgotPassword, forgotPasswordResp] = useForgotPasswordMutation();
    const [enableAutoRenewal] = useEnableAutoRenewalMutation();
    const [subscriptionsInfoFromAPI, SetSubscriptionsInfoFromAPI] = useState([]);
    const [activeSubscriptionName, SetActiveSubscriptionName] = useState("");
    const [activeSubscriptionId, SetActiveSubscriptionId] = useState("");
    const [activeExtensionName, SetActiveExtensionName] = useState("");
    const [activeExtensionPrice, SetActiveExtensionPrice] = useState(100);
    const [activeExtensionProductQuantity, SetActiveExtensionProductQuantity] = useState(500);
    /* const [activeExtensionInfo, SetActiveExtensionInfo] = useState({
        planName: "",
        planDisplayName: "",
        activeTutorsAllowed: 0,
        productQuantity: 0,
        currency: "",
        subscriptionPricePerMonth: 0,
        freeTrialExpiryDate: null,
        subscriptionStartDate: null,
        monthlyCostAfterDiscount: 0,
        autoRenewalDate: null,
        startDate: null,
        expiryDate: null,
        hasExpired: false,
        isCancelled: false,
    }); */

    /* const [activeSubscriptionInfo, SetActiveSubscriptionInfo] = useState({
        planName: "",
        planDisplayName: "",
        activeTutorsAllowed: 0,
        currency: "",
        subscriptionPricePerMonth: 0,
        freeTrialExpiryDate: null,
        subscriptionStartDate: null,
        monthlyCostAfterDiscount: 0,
        autoRenewalDate: null,
        startDate: null,
        expiryDate: null,
        hasExpired: false,
        isCancelled: false,
    }); */
    const [isSubscriptionAndExtensionModalActive, SetIsSubscriptionAndExtensionModalActive] = useState(false);
    const [isResetPasswordModalActive, SetIsResetPasswordModalActive] = useState(false);
    const [isPasswordResetLinkSentModalActive, SetIsPasswordResetLinkSentModalActive] = useState(false);
    const [isCancelSubscriptionModalActive, SetIsCancelSubscriptionModalActive] = useState(false);
    const [isViewTransactionsModalActive, SetIsViewTransactionsModalActive] = useState(false);
    const [isAddNewBankCardModalActive, SetIsAddNewBankCardModalActive] = useState(false);
    const [isDeletePaymentMethodModalActive, SetIsDeletePaymentMethodModalActive] = useState(false);
    const [isEnableAutoRenewalModalActive, SetIsEnableAutoRenewalModalActive] = useState(false);
    const [isChangeEmailModalActive, SetIsChangeEmailModalActive] = useState(false);
    const [openSubscriptionModal, SetOpenSubscriptionModal] = useState(false);
    const [openExtensionsModal, SetOpenExtensionsModal] = useState(false);
    const [stripeCustomerId, SetStripeCustomerId] = useState("");
    // const [paymentMethods, SetPaymentMethods] = useState([]);
    const [cancelProductSubscriptionId, SetCancelProductSubscriptionId] = useState("");
    const [enableAutoRenewalSubscriptionId, SetEnableAutoRenewalSubscriptionId] = useState("");
    const [deletePaymenMethodInfo, SetDeletePaymenMethodInfo] = useState(null);
    const [activeTutorsCount, setActiveTutorsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState({});
    const { dateFormat } = useSelector((state) => state.user);
    const {
        activeSubscriptionInfo,
        activeExtensionInfo,
        paymentMethods,
    } = useSelector((state) => state.subscription);
    const dispatch = useDispatch();

    const isEmail = (val) => {
        let regEmail =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regEmail.test(val)) {
          return false;
        } else {
          return true;
        }
    };

    const handleEmailUpdate = (email) => {
        console.log("Email Updation invoked", email);
        if (email?.trim() === "") {
          alert("Email address can't be empty");
          return;
        }
        if (!isEmail(email)) {
          alert("Enter valid email!");
          return;
        }
        if (email?.trim() !== "") {
          updateEmail({ email }).then((res) => {
            if (res?.data) {
              alert("Email reset link sent, please verify");
            } else {
              alert("Error occured while senting email reset link!");
            }
            console.log("Email Link sent", res);
          });
        }
    };

    const checkName = (inputString) => {
        const letterRegex = /^[a-zA-Z]+$/;
        return letterRegex.test(inputString);
    }

    const checkPhoneNumber = (inputString) => {
        const numberRegex = /^[0-9]+$/;
        return numberRegex.test(inputString);
    }

    const handleDataUpdate = () => {
        const arr = ["email", "firstName", "lastName", "phone", "phoneCode"];
        let boo = true;
        let ff = null;
        arr.forEach((it) => {
          if (boo && (!values[it] || values[it]?.trim() === "")) {
            boo = false;
            alert(it + " can't be empty.");
            return;
          }
        });
        if (!boo) {
          return;
        }
        if (!isEmail(values?.email)) {
          alert("Enter valid email!");
          return;
        }
        if (!checkName(values?.firstName)) {
          alert("Enter valid First Name!");
          return;
        }
        if (!checkName(values?.lastName)) {
          alert("Enter valid Last Name!");
          return;
        }
        if (!checkPhoneNumber(values?.phone)) {
          alert("Enter valid Phone Number!");
          return;
        }
        if (
          values?.email?.trim() === "" ||
          values?.firstName?.trim() === "" ||
          values?.lastName?.trim() === "" ||
          values?.phone?.trim() === "" ||
          values?.phoneCode?.trim() === ""
        ) {
          alert("Please fill all the fields to update your account!");
          return;
        }
        setLoading(true);
        const updateUserAccount = async () => {
          try {
            let reqBody = { ...values };
            delete reqBody["_id"];
            delete reqBody["email"];
            updateAccount(reqBody)
              .then((res) => {
                setLoading(false);
                if (res?.error) {
                  alert("Error occured while updating!", res?.error?.message);
                }
                if (res?.data) {
                  alert("changes saved!");
                }
                console.log(res);
              })
              .catch((err) => {
                setLoading(false);
                console.log(err?.message);
              });
          } catch (e) {
            console.error(e?.response?.data?.message);
          }
        };
        updateUserAccount();
        if (fetchedData?.email !== values.email) handleEmailUpdate(values.email);
        console.log({ fetchedData, values });
    };

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
            setFetchedData({
                ...res?.data.data.user,
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    function loadOrgDetails() {
        getPersonalDetail()
            .then(data => {
                // console.log("getPersonalDetail");
                // console.log(data);
                const user = data.data.data.user;
            
                getOrgDetails(user.associatedOrg)
                .then(data => {
                    console.log("getOrgDetails");
                    console.log(data);
                    console.log("subscriptionsInfoFromAPI");
                    console.log(subscriptionsInfoFromAPI);
                    if(data.data && data.data.stripeCustomerDetails && data.data.stripeCustomerDetails.id) {
                        SetStripeCustomerId(data.data.stripeCustomerDetails.id);
                    }
                    if(data && data.data && data.data.stripCustomerPaymentDetails) {
                        // SetPaymentMethods(data.data.stripCustomerPaymentDetails.data);
                    }
                    
                    if(data.data && 
                       data.data.customerSubscriptions && 
                       data.data.customerSubscriptions.data && 
                       data.data.customerSubscriptions.data.length > 0 &&
                       subscriptionsInfoFromAPI.length > 0) {
                        const products = data.data.customerSubscriptions.data;
                        let activeSub;
                        const todayDate = new Date();
                        for(let i = 0; i < products.length; i++) {
                            let planId = products[i].plan.id;
                            activeSub = subscriptionsInfoFromAPI.find(item => item.id === planId);
                            if(products[i].metadata.type === "extension") {
                                SetActiveExtensionName("Assignement");
                                SetActiveExtensionPrice(products[i].plan.amount / 100);
                                let productQuantity = 0;
                                if(activeSub.lookup_key === "p1") {
                                    SetActiveExtensionProductQuantity(100);
                                    productQuantity = 100;
                                }
                                if(activeSub.lookup_key === "p2") {
                                    SetActiveExtensionProductQuantity(400);
                                    productQuantity = 400;
                                }
                                if(activeSub.lookup_key === "p3") {
                                    SetActiveExtensionProductQuantity(1500);
                                    productQuantity = 1500;
                                }
                                if(activeSub.lookup_key === "p4") {
                                    SetActiveExtensionProductQuantity(Infinity);
                                    productQuantity = Infinity;
                                }

                                const expiryDate = new Date(products[i].current_period_end * 1000);
                                const isCancelled = products[i].canceled_at === null || products[i].canceled_at === undefined ? false : true;

                                /* SetActiveExtensionInfo({
                                    planName: "Assignment",
                                    planDisplayName: "Assignement",
                                    productQuantity: productQuantity,
                                    currency: products[i].currency,
                                    startDate: new Date(products[i].start_date * 1000),
                                    autoRenewalDate: new Date(products[i].current_period_end * 1000),
                                    expiryDate: expiryDate,
                                    subscriptionPricePerMonth: products[i].plan.amount / 100,
                                    monthlyCostAfterDiscount: products[i].plan.amount / 100,
                                    freeTrialExpiryDate: new Date(products[i].trial_end * 1000),
                                    hasExpired: expiryDate < todayDate,
                                    isCancelled: isCancelled,
                                }) */

                                continue;
                            }
                            /* let planId = products[i].plan.id;
                            activeSub = subscriptionsInfoFromAPI.find(item => item.id === planId); */
                            console.log("activeSub")
                            console.log(activeSub);
                            if(activeSub && activeSub.product && products[i].metadata) {
                                const expiryDate = new Date(products[i].current_period_end * 1000);
                                const isCancelled = products[i].canceled_at === null || products[i].canceled_at === undefined ? false : true;

                                SetActiveSubscriptionName(activeSub.product.name);
                                /* SetActiveSubscriptionInfo({
                                    planName: activeSub.product.name,
                                    planDisplayName: activeSub.product.name,
                                    activeTutorsAllowed: products[i].metadata.active_tutors,
                                    currency: activeSub.currency,
                                    subscriptionPricePerMonth: activeSub.unit_amount / 100,
                                    monthlyCostAfterDiscount: activeSub.unit_amount / 100,
                                    startDate: new Date(products[i].start_date * 1000),
                                    autoRenewalDate: new Date(products[i].current_period_end * 1000),
                                    expiryDate: expiryDate,
                                    freeTrialExpiryDate: new Date(products[i].trial_end * 1000),
                                    hasExpired: false,//expiryDate < todayDate,
                                    isCancelled: true,//isCancelled,
                                }); */
                            }
                            SetActiveSubscriptionId(products[i].id);
                            
                        }
                    }
                    // sessionStorage.setItem("orgDetails", JSON.stringify(data.data));
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
    }

    useEffect(() => {

        loadOrgDetails();
        return;

    
    }, [subscriptionsInfoFromAPI]);

    /* useEffect(() => {
        return;
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
                // subscriptionStartDate: new Date(),
            });

            return;
        }
    }, [subscriptionsInfoFromAPI]); */

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

    function handlePasswordReset(){
        forgotPassword({ email: values.email }).then((res) => {
          if (res.error) {
            console.log(res.error);
            alert(res.error.data.message);
            return;
          }
          console.log(res.data);
        //   alert("Password reset link sent to your email.");
        });
      };

    function OnActiveSubscriptionChangePlanClicked() {
        /* SetIsSubscriptionAndExtensionModalActive(true);
        SetOpenSubscriptionModal(true); */
        dispatch(openSubscriptionPanelInUpdateMode());
    }

    function OnActiveExtensionChangePlanClicked() {
        /* SetIsSubscriptionAndExtensionModalActive(true);
        SetOpenExtensionsModal(true); */
        dispatch(openExtensionsPanelInUpdateMode());
    }

    function OnResetPasswordClicked() {
        SetIsResetPasswordModalActive(true);
    }

    function OnResetPasswordModalCancelClicked() {
        SetIsResetPasswordModalActive(false);
    }

    async function OnResetPasswordModalSendClicked() {
        const res = await forgotPassword({ email: values.email });
        SetIsResetPasswordModalActive(false);
        if (res.error) {
            console.log(res.error);
            alert(res.error.data.message);
            return;
        }

        SetIsPasswordResetLinkSentModalActive(true);

        const makePasswordResetLinkSentModalDisappearAfterFewSeconds = () => {
            setTimeout(() => {
                SetIsPasswordResetLinkSentModalActive(false);
            }, 1500);
        }

        makePasswordResetLinkSentModalDisappearAfterFewSeconds();
    }

    function OnCancelSubscriptionClicked(cancelSubId) {
        SetIsCancelSubscriptionModalActive(true);
        SetCancelProductSubscriptionId(cancelSubId);
    }

    function OnCancelSubscriptionModalCancelSubscriptionButtonClicked() {
        
        cancelSubscription(cancelProductSubscriptionId)
        .then(data => {
            console.log("cancelSubscription");
            console.log(data);
        })
        .catch(error => {
            console.log("error in cancelSubscription");
            console.log(error);
        })
        .finally(() => {
            SetIsCancelSubscriptionModalActive(false);
        })
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

    function OnDeletePaymentMethodModalCrossIconClicked() {
        SetIsDeletePaymentMethodModalActive(false);
    }

    function OnDeletePaymentMethodModalCancelClicked() {
        SetIsDeletePaymentMethodModalActive(false);
    }

    function OnDeletePaymentMethodModalDeleteConfirmClicked() {
        if(deletePaymenMethodInfo === null || deletePaymenMethodInfo === undefined) {
            return;
        }

        deletePaymentMethod({
            customerId: deletePaymenMethodInfo.customerId,
            paymentMethodId: deletePaymenMethodInfo.paymentMethodId
        }).then(data => {
            console.log("delete payment method api response");
            console.log(data);
            loadOrgDetails();
        }).catch(error => {
            console.log("Error in delete payment method api");
            console.log(error);
        })
        .finally(() => {
            SetIsDeletePaymentMethodModalActive(false);
        })
    }

    function OnAddNewPaymentModalAddButtonClicked() {
        SetIsAddNewBankCardModalActive(false);
        loadOrgDetails();
    }

    function OnEnableAutoRenewalClicked(subId) {
        SetIsEnableAutoRenewalModalActive(true);
        SetEnableAutoRenewalSubscriptionId(subId);
    }

    function OnEnableAutoRenewalModalCrossIconClicked() {
        SetIsEnableAutoRenewalModalActive(false);
    }

    function OnEnableAutoRenewalModalRenewClicked() {
        enableAutoRenewal({
            subscriptionId: enableAutoRenewalSubscriptionId
        })
        .then(data => {
            console.log("Enable auto renewal response");
            console.log(data);
        })
        .catch(error => {
            console.error("Error in enable auto renewal api");
            console.error(error);
        })
        .finally(() => {
            SetIsEnableAutoRenewalModalActive(false);
        })
    }

    function OnRenewSubscriptionClicked() {
        dispatch(openSubscriptionPanelInRenewProductMode());
    }

    return (
        <div className="flex w-full" >

            {
                isSubscriptionAndExtensionModalActive && false ? (
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
                        <ResetPasswordModal
                            OnCancelClicked={OnResetPasswordModalCancelClicked}
                            OnOkayClicked={OnResetPasswordModalSendClicked}
                        />
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
                            className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[8px] h-[266px] w-[497px]"
                            title="Cancel Subscription"
                            titleClassName="font-[600] text-[21.33px]"
                            headerClassName={`pl-[30px] pr-[30px] pb-[21.67px] pt-[30px]`}
                            OnCrossIconClicked={OnCancelSubscriptionModalCrossIconClicked}
                        >
                            <div 
                                className="flex flex-col items-center w-full"
                            >
                                <div className="mt-[20px] font-[400] text-[#517CA8] text-[17.5px] w-[437px]" >
                                ⚠️ <span className="font-[700]" >Note:</span> If you cancel the plan, you will lose ALL access to your Evallo account after the subscription reaches expiry date.
                                </div>
                                <div className="flex items-center justify-between mt-[20px] w-[373px]" >
                                    <SecondaryButton
                                        style={{backgroundColor: "#fff"}}
                                        children={<span className="font-[500] text-[16px] text-[#FF7979]" >Cancel Subscription</span>}
                                        className="bg-[#fff] px-[0px] rounded-[10px] flex"
                                        onClick={OnCancelSubscriptionModalCancelSubscriptionButtonClicked}
                                    />

                                    <PrimaryButton
                                        // style={{width: "46.05%"}}
                                        className={` flex justify-center h-[41px] w-[186px] px-[15px] bg-[#FFA28D]  disabled:opacity-60  rounded-[10px] text-white text-sm font-medium relative`}
                                        /* loading={emailExistLoad}
                                        disabled={
                                            values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                                        } */
                                        onClick={OnCancelSubscriptionModalChangePlanClicked}
                                        children={<span className="font-[500] text-[15px]" >Change Plan Instead</span>}
                                    />   
                                </div>
                            </div>
                        </Modal2>
                    </div>
                ) : (<></>)
            }

            {
                isEnableAutoRenewalModalActive ? (
                    <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
                        <EnableAutoRenewal
                            OnCrossIconClicked={OnEnableAutoRenewalModalCrossIconClicked}
                            OnEnableAutoRenewClicked={OnEnableAutoRenewalModalRenewClicked}
                        />
                    </div>
                ) : (<></>)
            }

            {
                isDeletePaymentMethodModalActive ? (
                    <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
                        <DeletePaymentMethodModal
                            className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[497/266] w-[25.88vw]"
                            OnCrossIconClicked={OnDeletePaymentMethodModalCrossIconClicked}
                            OnCancelClicked={OnDeletePaymentMethodModalCancelClicked}
                            OnDeletePaymentMethodClicked={OnDeletePaymentMethodModalDeleteConfirmClicked}
                        />
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
                        OnAddClicked={OnAddNewPaymentModalAddButtonClicked}
                        stripeCustomerId={stripeCustomerId}
                    />
                    </div>
                ) : (<></>)
            }

            {
                isChangeEmailModalActive ? (
                    <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
                        <ChangeEmailModal
                            email={values.email}
                        />
                    </div>
                ) : (<></>)
            }


            <div className="flex justify-between h-[800px] w-full" >
                <div 
                    className="bg-[#fff] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)] h-[800px] w-[550px]" 
                    // style={{width: "34.375%", height: "100%"}} 
                >

                    <div className="relative mt-[30px] left-2/4 -translate-x-2/4 h-[97.5] w-[97.5px]"
                        // style={{width: "17.72%" , aspectRatio: 1}}
                    >
                        <img
                            className="h-full w-full"
                            src={maleProfileImage}
                        />

                        <img
                            className="absolute bottom-[0px] right-[0px] h-[29.25px] w-[29.25px]"
                            src={camIcon}
                        />
                    </div>

                    <div 
                        className="relative flex justify-between mt-[30px] left-2/4 -translate-x-2/4"
                        style={{width: "87.27%"}}
                    >
                        <InputField
                            placeholder=""
                            // parentStyle={{width: "47.9%"}}
                            parentClassName="text-xs w-[230px]"
                            label="First Name"
                            labelClassname="text-[#26435F] text-[15px] font-semibold"
                            inputContainerClassName=" border border-[#D0D5DD] mt-[10px] rounded-md py-[9px] h-[40px] w-full text-md"
                        
                            value={values.firstName}
                            onChange={(e) => {
                                setValues((values) => ({
                                    ...values,
                                    firstName: e.target.value,
                                }));
                            }}
                            totalErrors={error}
                            error={error.firstName}
                        />

                        <InputField
                            placeholder=""
                            // parentStyle={{width: "47.9%"}}
                            parentClassName="text-xs w-[230px]"
                            label="Last Name"
                            labelClassname="text-[#26435F] text-[15px] font-semibold"
                            inputContainerClassName=" border border-[#D0D5DD] mt-[10px] rounded-md py-[9px] h-[40px] w-full text-md"
                        
                            value={values.lastName}
                            onChange={(e) => {
                                setValues((values) => ({
                                    ...values,
                                    lastName: e.target.value,
                                }));
                            }}
                            totalErrors={error}
                            error={error.lastName}
                        />
                    </div>

                    <InputField
                        placeholder=""
                        // parentStyle={{width: "87.27%"}}
                        parentClassName="relative mt-[25px] left-2/4 -translate-x-2/4 text-xs w-[480px]"
                        label="Role / Job Title"
                        labelClassname="text-[#26435F] text-[15px] font-semibold"
                        inputContainerClassName=" border border-[#D0D5DD] mt-[10px] rounded-md py-[9px] h-[40px] w-full text-md"
                    
                        value={values.role}
                        onChange={(e) => {
                            setValues((values) => ({
                                ...values,
                                role: e.target.value,
                            }));
                        }}
                        totalErrors={error}
                        error={error.role}
                    />

                    <InputField
                        placeholder=""
                        // parentStyle={{width: "87.27%"}}
                        parentClassName="relative mt-[25px] left-2/4 -translate-x-2/4 text-xs w-[480px]"
                        label="Email"
                        // IconLeft={octIcon}
                        IconLeft={fetchedData?.isVerified ? null : octIcon}
                        labelClassname="text-[#26435F] text-[15px] font-semibold"
                        inputContainerClassName=" border border-[#D0D5DD] mt-[10px] rounded-md py-[9px] h-[40px] w-full text-md"
                        type="text"
                        value={values.email}
                        onChange={(e) => {
                            setValues((values) => ({
                                ...values,
                                email: e.target.value,
                            }));
                        }}
                        // totalErrors={error}
                        error={error.email}
                        Tooltip={
                            <span className="absolute top-10 w-[333px] h-[200px] scale-0 rounded bg-gray-800 p-2 text-xs text-white z-[2] group-hover:scale-100">
                              <h3 className="text-[#24A3D9] font-semibold mb-1">
                                Email Confirmation Sent
                              </h3>
                              You need to verify your email if
                              <ul className="list-disc pl-3 mb-2">
                                <li>you created a new account.</li>
                                <li>you recently changed your email.</li>
                              </ul>
                              We have sent you an email verification link to your current
                              email address to make sure that it really is you who requested
                              a change.
                            </span>
                          }
                    />

                    <InputFieldDropdown
                      placeholder=""
                    //   parentStyle={{width: "87.27%"}}
                      parentClassName="relative mt-[25px] left-2/4 -translate-x-2/4 text-xs w-[480px]"
                      labelClassname="text-[#26435F] text-[15px] font-semibold"
                      inputContainerClassName=" border border-[#D0D5DD] mt-[10px] rounded-md py-[9px] h-[40px] w-[full] text-md"
                      inputClassName="text-[17.5px]"
                      label="Phone"
                      value={values.phone}
                      codeValue={values.phoneCode}
                      handleCodeChange={(e) => {
                        setValues((values) => ({
                          ...values,
                          phoneCode: e.target.value,
                        }));
                      }}
                      onChange={(e) => {
                        setValues((values) => ({
                          ...values,
                          phone: e.target.value,
                        }));
                      }}
                      error={error.phone}
                    />

                    <div
                        className="relative mt-[25px] left-2/4 -translate-x-2/4 w-[480px]"
                        // style={{width: "87.27%"}}
                    >
                        <div className="font-[500] text-[#26435F] text-[15px]" >Short Bio / Intro</div>
                        <textarea
                            className={`mt-[9.65px] rounded-[5px] resize-none shadow-[0px_0px_2px_rgba(0,0,0,0.25)] text-[15px] h-[150px] w-full ${styles.bioTextarea}`}
                            placeholder="Here, you can talk about your experience, your day-to-day tasks, your personality, your hobbies, or your methodology as a tutor. 
                            Anything you feel is relevant!"
                            value={values.about}
                            onChange={(e) => {
                                setValues((values) => ({
                                    ...values,
                                    about: e.target.value,
                                }));
                            }}
                        ></textarea>
                    </div>

                    <div 
                        className="relative flex justify-between mt-[15px] left-2/4 -translate-x-2/4"
                        style={{width: "69.09%"}}
                    >
                        <PrimaryButton
                            // style={{width: "46.05%"}}
                            className={` flex justify-center h-[50px] w-[175px] bg-[#FFA28D]  disabled:opacity-60  rounded-[10px] text-white text-sm font-medium relative py-[9px]`}
                            /* loading={emailExistLoad}
                            disabled={
                                values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                            } */
                            onClick={handleDataUpdate}
                            children={<span className="font-[600] text-[#fff] text-[20px]" >Save</span>}
                        />

                        <SecondaryButton
                            style={{backgroundColor: "#fff"}}
                            children={<span className="font-[500] text-[17.5px] text-[#26435F]" >Reset Password</span>}
                            className="bg-[#fff] px-[0px] rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] h-[50px] w-[175px]"
                            onClick={OnResetPasswordClicked}
                        />
                    </div>
                </div>

                <div 
                    className="flex flex-col justify-between" 
                    style={{width: "62.5%", height: "100%"}}
                >
                    <div
                        className="bg-[#fff] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)] h-[438px] w-[1000px]"
                        // style={{width: "100%", height: "54.75%"}}
                    >
                        <div className="font-[600] ml-[30px] mt-[30px] text-[#26435F] text-[18.67px]" >Manage Your Subscription Plan</div>
                        <div className="ml-[30px]" >
                            <span className="font-[200] text-[#26435F] text-[15px]">For detailed breakdown of features, please visit our </span>
                            <button className="font-[200] inline text-[#24A3D9] text-[15px]" >pricing page.</button>
                        </div>

                        {/* <div className="font-[600] ml-[30px] mt-[20px] text-[#FFA28D] text-[14px]" >Active Subscription</div> */}

                        {
                            !(activeSubscriptionInfo === undefined || activeSubscriptionInfo === null || activeSubscriptionInfo.planName === "") ?
                            (
                                <>
                                <div className="font-[600] ml-[30px] mt-[30px] text-[#FFA28D] text-[17.5px]" >Active Subscription</div>
                                <div 
                                    className="flex justify-between ml-[30px] mt-[5px]" 
                                    style={{width: "92%"}}
                                >
                                    <ActiveSubscriptionWidget
                                        // style={{width: "65%"}}
                                        className="h-[106px] max-w-[600px]"
                                        canChangePlan={true}
                                        planDisplayName={activeSubscriptionInfo.planDisplayName}
                                        subscriptionPricePerMonth={activeSubscriptionInfo.subscriptionPricePerMonth}
                                        activeTutorsAllowed={activeSubscriptionInfo.activeTutorsAllowed}
                                        handleChangePlan={OnActiveSubscriptionChangePlanClicked}
                                        freeTrialExpiryDate={activeSubscriptionInfo.freeTrialExpiryDate}
                                    />

                                    <div className="flex flex-col items-end" >
                                        <div className="flex" >
                                            <span className="font-[100] text-[#517CA8] text-[15px]" >{"Subscription Start Date -  "}</span>
                                            <span className="font-[400] text-[#517CA8] text-[15px]" >{
                                                getFormattedDate(activeSubscriptionInfo.startDate, dateFormat)
                                            }</span>
                                        </div>

                                        <div className="flex mt-[3px]" >
                                            {
                                                activeSubscriptionInfo.hasExpired ? (
                                                    <>
                                                    <span className="font-[500] text-[#FF725E] text-[15px]" >{"Plan Expired on -  "}</span>
                                                    <span className="font-[500] text-[#FF725E] text-[15px]" >{
                                                        getFormattedDate(activeSubscriptionInfo.expiryDate, dateFormat)
                                                    }</span>
                                                    </>
                                                ) : activeSubscriptionInfo.isCancelled ? (
                                                    <>
                                                    <span className="font-[500] text-[#FF725E] text-[15px]" >{"Plan Expires on -  "}</span>
                                                    <span className="font-[500] text-[#FF725E] text-[15px]" >{
                                                        getFormattedDate(activeSubscriptionInfo.expiryDate, dateFormat)
                                                    }</span>
                                                    </>
                                                ) : (
                                                    <>
                                                    <span className="font-[300] text-[#517CA8] text-[15px]" >{"Auto-Renewal Date -  "}</span>
                                                    <span className="font-[500] text-[#517CA8] text-[15px]" >{
                                                        getFormattedDate(activeSubscriptionInfo.autoRenewalDate, dateFormat)
                                                    }</span>
                                                    </>
                                                )
                                            }
                                        </div>

                                        <div className="flex mt-[3px]" >
                                            <span className="font-[100] text-[#517CA8] text-[15px]" >Monthly Cost (after discount){" - "}</span>
                                            <span className="font-[400] text-[#517CA8] text-[15px]" >{CurrencyNameToSymbole(activeSubscriptionInfo.currency) + activeSubscriptionInfo.subscriptionPricePerMonth}</span>
                                        </div>

                                        <div className="grow" ></div>

                                        {
                                            activeSubscriptionInfo.hasExpired ? (
                                                <button 
                                                    className="font-[500] underline text-[#38C980] text-[15px]" 
                                                    onClick={
                                                        () => {
                                                            OnRenewSubscriptionClicked();
                                                        }
                                                    } 
                                                >Renew Subscription</button>
                                            ) : activeSubscriptionInfo.isCancelled ? (
                                                <button 
                                                    className="font-[500] underline text-[#26435F] text-[15px]" 
                                                    onClick={
                                                        () => {
                                                            OnEnableAutoRenewalClicked(activeSubscriptionInfo.subscriptionId);
                                                        }
                                                    } 
                                                >Enable Auto-Renew</button>
                                            ) : (
                                                <button 
                                                    className="font-[500] underline text-[#24A3D9] text-[15px]" 
                                                    onClick={
                                                        () => {
                                                            OnCancelSubscriptionClicked(activeSubscriptionInfo.subscriptionId);
                                                        }
                                                    } 
                                                >Cancel Subscription</button>
                                            )
                                        }
                                    </div>
                                </div>
                                </>
                            ) : (<></>)
                        }

                        {
                            !(activeExtensionInfo === undefined || activeExtensionInfo === null) ? (
                                <>
                                    <div className="font-[600] ml-[30px] mt-[20px] text-[#FFA28D] text-[17.5px]" >Extensions</div>

                                    <div 
                                        className="flex justify-between ml-[30px] mt-[5px]" 
                                        style={{width: "92%"}}
                                    >
                                        <ActiveExtensionWidget
                                            // style={{width: "65%"}}
                                            className="h-[106px] w-[600px]"
                                            canChangePlan={true}
                                            planDisplayName={activeExtensionInfo.planDisplayName}
                                            subscriptionPricePerMonth={activeExtensionInfo.subscriptionPricePerMonth}
                                            productQuantity={activeExtensionInfo.productQuantity}
                                            handleChangePlan={OnActiveExtensionChangePlanClicked}
                                            freeTrialExpiryDate={activeExtensionInfo.autoRenewalDate}
                                        />

                                        <div className="flex flex-col items-end" >
                                            <div className="flex" >
                                                <span className="font-[100] text-[#517CA8] text-[15px]" >Subscription Start Date{" - "}</span>
                                                <span className="font-[400] text-[#517CA8] text-[15px]" >{
                                                    getFormattedDate(activeExtensionInfo.startDate, dateFormat)
                                                }</span>
                                            </div>

                                            <div className="flex mt-[3px]" >
                                                {
                                                    activeExtensionInfo.hasExpired ? (
                                                        <>
                                                        <span className="font-[500] text-[#FF725E] text-[15px]" >{"Plan Expired on -  "}</span>
                                                        <span className="font-[500] text-[#FF725E] text-[15px]" >{
                                                            getFormattedDate(activeExtensionInfo.expiryDate, dateFormat)
                                                        }</span>
                                                        </>
                                                    ) : activeExtensionInfo.isCancelled ? (
                                                        <>
                                                        <span className="font-[500] text-[#FF725E] text-[15px]" >{"Plan Expires on -  "}</span>
                                                        <span className="font-[500] text-[#FF725E] text-[15px]" >{
                                                            getFormattedDate(activeExtensionInfo.expiryDate, dateFormat)
                                                        }</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                        <span className="font-[300] text-[#517CA8] text-[15px]" >{"Auto-Renewal Date -  "}</span>
                                                    <span className="font-[500] text-[#517CA8] text-[15px]" >{
                                                        getFormattedDate(activeExtensionInfo.autoRenewalDate, dateFormat)
                                                    }</span>
                                                        </>
                                                    )
                                                }
                                            </div>

                                            {/* <div className="flex mt-[3px]" >
                                                <span className="font-[100] text-[#517CA8] text-[15px]" >Auto-Renewal Date{" - "}</span>
                                                <span className="font-[400] text-[#517CA8] text-[15px]" >{
                                                    getFormattedDate(activeExtensionInfo.autoRenewalDate, dateFormat)
                                                }</span>
                                            </div> */}

                                            <div className="flex mt-[3px]" >
                                                <span className="font-[100] text-[#517CA8] text-[15px]" >Monthly Cost (after discount){" - "}</span>
                                                <span className="font-[400] text-[#517CA8] text-[15px]" >{
                                                    CurrencyNameToSymbole(activeExtensionInfo.currency) + activeExtensionInfo.subscriptionPricePerMonth
                                                }</span>
                                            </div>

                                            <div className="grow" ></div>

                                            {
                                                activeExtensionInfo.hasExpired ? (
                                                    <button 
                                                        className="font-[500] underline text-[#38C980] text-[15px]" 
                                                        onClick={
                                                            () => {
                                                                // OnCancelSubscriptionClicked(activeSubscriptionId);
                                                            }
                                                        } 
                                                    >Renew Subscription</button>
                                                ) : activeExtensionInfo.isCancelled ? (
                                                    <button 
                                                        className="font-[500] underline text-[#26435F] text-[15px]" 
                                                        onClick={
                                                            () => {
                                                                OnEnableAutoRenewalClicked(activeExtensionInfo.subscriptionId);
                                                            }
                                                        } 
                                                    >Enable Auto-Renew</button>
                                                ) : (
                                                    <button 
                                                        className="font-[500] underline text-[#24A3D9] text-[15px]" 
                                                        onClick={
                                                            () => {
                                                                OnCancelSubscriptionClicked(activeExtensionInfo.subscriptionId);
                                                            }
                                                        } 
                                                    >Cancel Subscription</button>
                                                )
                                            }

                                            {/* <button className="font-[400] underline text-[#24A3D9] text-[15px]" >Enable Auto-Renew</button> */}
                                        </div>
                                    </div>
                                </>
                            ) : (<></>)
                        }
                    </div>

                    <div
                        className="bg-[#fff] pb-[30px] rounded-[15px] shadow-[0px_0px_30px_rgba(213,230,250,0.5)] h-[342px] w-[1000px]"
                        // style={{width: "100%"}}
                    >
                        <div 
                            className="flex items-center justify-between ml-[30px] mt-[20px]" 
                            style={{width: "92%"}}    
                        >
                            <div className="font-[500] text-[#26435F] text-[18.67px]" >Manage Payments</div>
                            <button 
                                className="font-[500] text-[#24A3D9] text-[15px] underline" 
                                // onClick={OnViewPastTransactionsClicked}
                            >View Past Transactions</button>
                        </div>
                        
                        <div className="font-[300] ml-[30px] text-[15px]" >
                            <span className="text-[#26435F]" >Read more documentation about payment methods on Evallo’s </span>
                            <button className="inline text-[#24A3D9]" >knowledge base.</button>
                        </div>

                        <div className="font-[600] ml-[30px] mt-[30px] text-[#FFA28D] text-[17.5px]" >Saved Cards</div>

                        <div className={`flex items-start gap-x-[45px] gap-y-[30px] flex-wrap ml-[30px] mt-[5px] pl-[0px] pb-[0px] pt-[0px] w-11/12`} >

                            {
                                paymentMethods.map((item, index) => {
                                    let cardNumber = "XXXX";
                                    console.log("payment Method");
                                    console.log(item);
                                    console.log(item.customer);
                                    console.log(item.id);
                                    if(item.card) {
                                        cardNumber = item.card.last4;
                                    }
                                    let cardLogo = visaIcon;
                                    if(item.card && item.card.brand === "visa") {
                                        cardLogo = visaIcon
                                    }
                                    console.log("payment Method");
                                    console.log(item);
                                    return (
                                        <BankCardWidgetContainer
                                            className="w-[33.15%]"
                                            bankCardClassName="aspect-square-[305/106] ml-[20px] w-full"
                                            cardNumber={cardNumber}
                                            cardLogo={cardLogo}

                                            onDeleteClicked={() => {
                                                SetIsDeletePaymentMethodModalActive(true);
                                                SetDeletePaymenMethodInfo({
                                                    customerId: item.customer,
                                                    paymentMethodId: item.id
                                                })
                                                return;
                                                deletePaymentMethod({
                                                    customerId: item.customer,
                                                    paymentMethodId: item.id
                                                }).then(data => {
                                                    console.log("delete payment method api response");
                                                    console.log(data);
                                                    loadOrgDetails();
                                                }).catch(error => {
                                                    console.log("Error in delete payment method api");
                                                    console.log(error);
                                                })
                                            }}
                                        />
                                    )
                                })
                            }

                            {/* <BankCardWidgetContainer
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
                            /> */}
                            

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