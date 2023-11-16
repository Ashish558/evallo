import React, { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField/inputField";
import styles from "./orgsignup.module.css";
import axios from "axios";
import OrgDetails from "../Frames/OrgDetails/OrgDetails";
import UserDetails from "../Frames/UserDetails/userDetails";
import SignupLast from "../Frames/SignupLast/SignupLast";
import FurtherDetails from "../Frames/FurtherDetails/FurtherDetails";
import SignupSuccessful from "../Frames/SignupSuccessful/SignupSuccessful";


import cuate from "../../assets/signup/cuate.svg";
import NumericSteppers from "../../components/NumericSteppers/NumericSteppers";
import CCheckbox from "../../components/CCheckbox/CCheckbox";

import DownArrow from "../../assets/icons/down-chevron.svg";

import selectStyles from "../../components/InputSelect/style.module.css";

import {
  useAddUserDetailsMutation,
  useSignupUserMutation,
} from "../../app/services/auth";
import {
  apQuestions,
  extensionsData,
  furtherDetailsData,
  motivesList,
  instructionFormat,
  hearAboutUsData,
  solutionsData,
  testPreparationsData,
  tutoringData,
  coachingData,
  studentServedData,
  rateUsData,
  paymentOptionsData,
  successfulSignUpMessage,
} from "./data";
import { getCheckedString } from "../../utils/utils";
import InputSelect from "../../components/InputSelect/InputSelect";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import { validateOtherDetails, validateSignup } from "./utils/util";
import {
  useLazyGetTutorDetailsQuery,
  useLazyGetUserDetailQuery,
} from "../../app/services/users";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import RadioUnselected from "../../assets/icons/radioUnChecked2.svg";
import RadioSelected from "../../assets/icons/radioChecked2.svg";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import InputFieldDropdown from "../../components/InputField/inputFieldDropdown";
import AdminNavbar from "../AdminDashboard/AdminNavbar";
import SCheckbox from "../../components/CCheckbox/SCheckbox";
import Subscription from "../Frames/Subscription/Subscription";
import Extensions from "../Frames/Extensions/Extensions";
import CheckOut from "../Frames/CheckOut/CheckOut";
import { subScriptionPlanData } from "./DummyData/SubscriptionPlanData";
import { extensionPlansInfo } from "./DummyData/ExtensionPlansInfo";
import { useLazyGetSubscriptionsInfoQuery } from "../../app/services/orgSignup";

import {
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "../Frames/Payment/Payment";

export default function OrgSignup() {
  const [frames, setFrames] = useState({
    signupActive: true,
    subscription: false,
    extensions: false,
    // payment: false,
    checkout: false,
  });

  const [settings, setSettings] = useState({});
  const [getSettings, getSettingsResp] = useLazyGetSettingsQuery();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [lastLoginDisabled, setLastLoginDisabled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddedByAdmin, setIsAddedByAdmin] = useState(false);

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    userId: "",
    registrationAs: "Company",
    phoneCode:"",
    orgName: "",
    companyType: "",
    website: "",
    address: "",
    country: "",
    state: "",
    zip: "",
    city: "",
    paymentType: "",
    activeStudents: "",
    activeTutors: "",
    services: [],
    subscriptionPlan: "Starter",
    extensionsPlans: [],
    extensionsPricePlan: "",
  });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode:"",
    phone: "",
    subscriptionCode: "",
    company: "",
  
  });

  const [otherDetails, setOtherDetails] = useState({
    schoolName: "",
    tellUsMore: "",
    grade: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    company:"",
    aboutScore: "",
  });

  const [detailsError, setDetailsError] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [frames]);
  
  const [signupUser, signupUserResp] = useSignupUserMutation();
  const [addUserDetails, addUserDetailsResp] = useAddUserDetailsMutation();
  const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery();
  const [count, setCount] = useState(0);

  const [isLinkedEmail, setIsLinkedEmail] = useState(false);
  const [linkedUserId, setLinkedUserId] = useState("");

  const [linkedEmailDetails, setLinkedEmailDetails] = useState({});

  const [persona, setPersona] = useState("");
  const [currentStep, setcurrentStep] = useState(frames.signupActive ? 1 : frames.subscription ? 2 : frames.extensions ? 3 : frames.checkout ? 4 : 5);

  const [testPreparations, setTestPreparations] =
    useState(testPreparationsData);
  const [tutoring, setTutoring] = useState(tutoringData);
  const [coaching, setCoaching] = useState(coachingData);
  const [studentserved, setStudentserved] = useState(studentServedData);
  const [hearAboutUs, setHearAboutUs] = useState(hearAboutUsData);
  const [rateUs, setRateUs] = useState(rateUsData);
  const [paymentOptions, setPaymentOptions] = useState(paymentOptionsData);
  const [solutions, setSolutions] = useState(solutionsData);
  const [extensions, setExtensions] = useState(extensionsData);

  const [instructions, setInstructions] = useState(instructionFormat);

  const [getDetails, getDetailsResp] = useLazyGetUserDetailQuery();
  const [getSubscriptionsInfo, getSubscriptionsInfoResp] = useLazyGetSubscriptionsInfoQuery();
  const [subscriptionsInfoFromAPI, SetSubscriptionsInfoFromAPI] = useState([]);
  // let subscriptionsInfoFromAPI = {};
  const [subscriptionPlanInfo, SetSubscriptionPlanInfo] = useState([])
  const [extensionPlansData, SetExtensionPlansData] = useState([]);
  const [isOtplessModalActive, SetIsOtplessModalActive] = useState(false);
  const [isSubscriptionProcessOnGoing, SetIsSubscriptionProcessOnGoing] = useState(false);

  function OnFrameChanged() {
    if(frames.signupActive) {
      setcurrentStep(1);
      return;
    }

    if(frames.subscription) {
      setcurrentStep(2);
      return;
    }

    if(frames.extensions) {
      setcurrentStep(3);
      return;
    }

    // if(frames.payment) {
    //   setcurrentStep(4);
    //   return;
    // }

    if(frames.checkout) {
      setcurrentStep(4);
      return;
    }
  }

  useEffect(() => {
    OnFrameChanged();
  }, [frames]);

  function OnExtensionsChanged() {
    let output = sessionStorage.getItem("chosenExtentionObjectsFromAPI");
    if(output === '' || output === undefined ) {
      output = null;
    }
    let chosenExtentionObjectsFromAPI = JSON.parse(output);
    if(chosenExtentionObjectsFromAPI === undefined || chosenExtentionObjectsFromAPI === null) {
      chosenExtentionObjectsFromAPI = [];
    }

    for(let i = 0; i < extensions.length; i++) {
      if(!extensions[i].checked) continue;
      const ext = extensions[i];

      const chosenExtension = subscriptionsInfoFromAPI.find(item => {
        return item.product.metadata.type === "extension" && 
               item.product.name === ext.text && 
               item.lookup_key === ext.packageName;
      });

      chosenExtentionObjectsFromAPI = chosenExtentionObjectsFromAPI.filter(item => {
        return item.product.metadata.type === "extension" && item.product.name !== ext.text;
      })

      chosenExtentionObjectsFromAPI.push(chosenExtension);

      sessionStorage.setItem("chosenExtentionObjectsFromAPI", JSON.stringify(chosenExtentionObjectsFromAPI));
    }
  }

  useEffect(() => {
    OnExtensionsChanged();
  }, [extensions]);

  const fetchSettings = () => {
    getSettings().then((res) => {
      // console.log(res);
      setSettings(res.data.data.setting);
    });
  };

  useEffect(() => {
    return;
    const script = document.createElement("script");
    script.src = "https://otpless.com/auth.js";
    script.id = "otplessIdScript";
    // script.cid = "TO0UXKO9U0HN2LL17BMI303UJSYZ8YO8";
    script.setAttribute("cid", "TO0UXKO9U0HN2LL17BMI303UJSYZ8YO8");
    document.body.appendChild(script);

    window.otpless = (otplessUser) => {
     console.log('otpless');
     console.log(otplessUser);
    };
  }, []);
 

  const fetchSubscriptionsInfo = () => {
    getSubscriptionsInfo().then((res) => {
      console.warn("Subscriptions info");
      console.warn(res.data)
      // subscriptionsInfoFromAPI = res.data.data;
      const productList = res.data.data;
      // collecting info for subscriptions
      for(let i = 0; i < productList.length; i++) {
        let product = productList[i];
        if(product.product.metadata.type !== "default") continue;

        let productInfo = {};
        productInfo.id = product.id;
        productInfo.planName = product.product.name;
        productInfo.planDisplayName = product.product.name;
        productInfo.freeTrialDays = parseInt(product.product.metadata.free_trial);
        productInfo.activeTutorsAllowed = product.product.metadata.active_tutors === "unlimited" ? Infinity : parseInt(product.product.metadata.active_tutors);
        productInfo.activeStudentsAllowed = product.product.metadata.active_students === "unlimited" ? Infinity : parseInt(product.product.metadata.active_students);
        productInfo.ccRequired = product.product.metadata.cc_required === "yes" ? true : false;
        productInfo.pricePerMonth = product.unit_amount / 100;
        productInfo.currency = product.currency;

        SetSubscriptionPlanInfo(plans => {
          // if product info already exists in the list then don't do anything
          if(plans.findIndex(item => item.planName === productInfo.planName) !== -1) return plans;

          const newPlansList = [];

          let i;
          for(i = 0; i < plans.length; i++) {
            if(plans[i].pricePerMonth < productInfo.pricePerMonth) {
              newPlansList.push(plans[i]);
              continue;
            }
            break;
          }

          newPlansList.push(productInfo);
          for( ; i < plans.length; i++) {
            newPlansList.push(plans[i])
          }

          return newPlansList
        });
        //product.unit_amount
      }

      // collecting info for extensions
      for(let i = 0; i < productList.length; i++) {
        let product = productList[i];
        if(product.product.metadata.type !== "extension") continue;
        console.log(product)

        SetExtensionPlansData(extList => {
          let newExtList = [...extList];
          let productInfo = newExtList.find(item => item.planName === product.product.name);
          const extInfoFromDummyData = extensionPlansInfo.find(item => item.planName === product.product.name);

          if(productInfo === undefined || productInfo === null) {
            let productInfo = {};
            productInfo.id = product.product.id;
            productInfo.planName = product.product.name;
            productInfo.planDisplayName = product.product.name;
            productInfo.description = [...extInfoFromDummyData.description]
            productInfo.extensionPriceOptionHeadingLabel = ""
            productInfo.extensionPriceOptionHeadingStatement = ""
            

            const packInfoFromDummyData = extInfoFromDummyData.extensionPriceOption.find(item => item.planName === product.lookup_key);
            let packInfo = {}
            packInfo.id = product.id;
            packInfo.planName = product.lookup_key;
            packInfo.planDisplayName = product.nickname;
            packInfo.description = [...packInfoFromDummyData.description];
            packInfo.pricePerMonth = product.unit_amount / 100;
            packInfo.currency = product.currency;

            productInfo.extensionPriceOption = [packInfo]
            newExtList.push(productInfo);
            return newExtList;
          }

          const packInfoFromDummyData = extInfoFromDummyData.extensionPriceOption.find(item => item.planName === product.lookup_key);
          let packInfo = {}
          packInfo.planName = product.lookup_key;
          
          const extPriceOption = productInfo.extensionPriceOption;
          // if pack info already exists in the extensions data then don't do anything else
          if(extPriceOption.findIndex(item => item.planName === packInfo.planName) !== -1) return newExtList;

          packInfo.id = product.id;
          packInfo.planDisplayName = product.nickname;
          packInfo.description = [...packInfoFromDummyData.description];
          packInfo.pricePerMonth = product.unit_amount / 100;
          packInfo.currency = product.currency;

          const newPacksList = [];

          let i;
          for(i = 0; i < extPriceOption.length; i++) {
            if(extPriceOption[i].pricePerMonth < packInfo.pricePerMonth) {
              newPacksList.push(extPriceOption[i]);
              continue;
            }
            break;
          }

          newPacksList.push(packInfo);
          for( ; i < extPriceOption.length; i++) {
            newPacksList.push(extPriceOption[i])
          }
          
          productInfo.extensionPriceOption = newPacksList;
          return newExtList;
        })

        /*
        let productInfo = {};
        productInfo.id = product.id;
        productInfo.planName = product.product.name;
        productInfo.planDisplayName = product.product.name;
        productInfo.description = []
        productInfo.extensionPriceOptionHeadingLabel = ""
        productInfo.extensionPriceOptionHeadingStatement = ""
        productInfo.extensionPriceOption = []
        */
      }

      SetSubscriptionsInfoFromAPI(res.data.data);
    }).catch((error) => {
      console.error("Error while fetching subscriptions info")
      console.error(error)
    })
  }

  useEffect(() => {
    fetchSettings();
    fetchSubscriptionsInfo();
  }, []);

  const paramUserId = searchParams.get("userid");
  const paramUserRole = searchParams.get("role");
  useEffect(() => {
    if (!paramUserId) return;
    if (!paramUserRole) return;
    console.log("paramUserId", paramUserId);
    setFrames({
      signupActive: false,
      selectPersona: false,
      services: false,
      userDetails: true,
      questions: false,
      signupLast: false,
      signupSuccessful: false,
    });
    setValues((prev) => {
      return {
        ...prev,
        userId: paramUserId,
      };
    });
    setPersona(paramUserRole);
    setIsAddedByAdmin(true);
  }, [paramUserId, paramUserRole]);

  useEffect(() => {
    const paramsUserId = searchParams.get("userId");
    return () => {};
    getDetails({ id: paramsUserId }).then((res) => {
      if (res.error) {
        return console.log(res.error);
      }
      setIsLinkedEmail(true);
      const { user, userdetails } = res.data.data;
      let user_detail = { ...userdetails };
      // let userDetails = res.data.data
      console.log("user", user);
      console.log("userdetails", userdetails);
      user_detail.Email = user.email;
      user_detail.FirstName = user.firstName;
      user_detail.LastName = user.lastName;
      user_detail.userType = user.role === "student" ? "parent" : "student";
      console.log("updated", user_detail);

      setValues({
        ...values,
        email: userdetails.Email,
        firstName: userdetails.FirstName,
        lastName: userdetails.LastName,
      });
      setLinkedEmailDetails(user_detail);
    });
  }, []);

  //temparory
  const [redirectLink, setRedirectLink] = useState("");
  const [numberPrefix, setNumberPrefix] = useState("+1");
  const [studentNumberPrefix, setStudentNumberPrefix] = useState("+1");

  useEffect(() => {
    if (count === 0) return;
    sessionStorage.setItem("frames", JSON.stringify(frames));
    sessionStorage.setItem("values", JSON.stringify(values));
    sessionStorage.setItem("otherDetails", JSON.stringify(otherDetails));
    sessionStorage.setItem("persona", persona);
    sessionStorage.setItem("redirectLink", redirectLink);
    sessionStorage.setItem("numberPrefix", numberPrefix);
    sessionStorage.setItem("currentStep", currentStep);
    sessionStorage.setItem("numberPrefix", numberPrefix);
    sessionStorage.setItem("studentNumberPrefix", studentNumberPrefix);
  }, [
    frames,
    values,
    otherDetails,
    persona,
    redirectLink,
    numberPrefix,
    currentStep,
    numberPrefix,
    studentNumberPrefix,
  ]);

  useEffect(() => {
    setCount(1);
  }, []);
  const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  useEffect(() => {
    if (sessionStorage.getItem("frames")) {
      // console.log(sessionStorage.getItem('frames'));
      setFrames(JSON.parse(sessionStorage.getItem("frames")));
    }
    if (sessionStorage.getItem("values")) {
      setValues(JSON.parse(sessionStorage.getItem("values")));
    }
    if (sessionStorage.getItem("otherDetails")) {
      setOtherDetails(JSON.parse(sessionStorage.getItem("otherDetails")));
    }
    if (sessionStorage.getItem("persona")) {
      setPersona(sessionStorage.getItem("persona"));
    }
    if (sessionStorage.getItem("redirectLink")) {
      setRedirectLink(sessionStorage.getItem("redirectLink"));
    }
    if (sessionStorage.getItem("numberPrefix")) {
      setNumberPrefix(sessionStorage.getItem("numberPrefix"));
    }
    if (sessionStorage.getItem("currentStep")) {
      setcurrentStep(sessionStorage.getItem("currentStep"));
    }
    if (sessionStorage.getItem("numberPrefix")) {
      setNumberPrefix(sessionStorage.getItem("numberPrefix"));
    }
    if (sessionStorage.getItem("studentNumberPrefix")) {
      setStudentNumberPrefix(sessionStorage.getItem("studentNumberPrefix"));
    }
  }, []);

  const resetErrors = () => {
    setError((prev) => {
      return {
        firstName: "",
        lastName: "",
        email: "",
        phoneCode:"",
        phone: "",
        subscriptionCode: "",
        company: "",
        phoneCode:"",
      };
    });
  };

  const resetDetailsErrors = () => {
    setDetailsError((prev) => {
      return {
        FirstName: "",
        LastName: "",
        Email: "",
        Phone: "",
      };
    });
  };

  const handleSignup = () => {
    const promiseState = async (state) =>
      new Promise((resolve) => {
        resolve(resetErrors());
      });

    promiseState().then(() => {
      let reqBody = {
        firstname: values.firstName,
        lastname: values.lastName,
        workemail: values.email,
        password: values.firstName,
        phone: values.phone,
        company: values.company,
        orgRole: values.role,
        registrationas: values.registrationAs,
        orgOfName: values.orgName,
        companytype: values.companyType,
        address: values.address,
        country: values.country,
        state: values.state,
        city: values.city,
        zip: values.zip,
        activestudents: values.activeStudents,
        numberoftutors: values.activeTutors,
        website: values.website,
        testpreparation: getCheckedString(testPreparations),
        subjecttutoring: getCheckedString(tutoring),
        coaching: getCheckedString(coaching),
        formatofinstruction: getCheckedString(instructions),
        studentserved: getCheckedString(studentserved),
        hearAbout: getCheckedString(hearAboutUs),
        paymentMethod:values.paymentType,
        rating:rateUs,
        term:true,
        solutionyouarelookingfor: getCheckedString(solutions),
      };
      console.log({ reqBody });
      if (values.checked === false) {
        let allCodes = [];
        settings.subscriptionCode.forEach((item) => {
          allCodes.push(item.code);
        });
        // console.log(settings.subscriptionCode);
        if (values.subscriptionCode === "") {
          return alert(
            "Please enter a subscription code or select the checkbox below confirming that you dont have one"
          );
        }
        if (!allCodes.includes(values.subscriptionCode)) {
          return alert("invalid subscription code");
        }
      }
      const result = validateSignup(values);
      console.log("validation",{ result });

      if (result.data !== true) {
        setError((prev) => {
          return {
            ...prev,
            [result.data]: result.message,
          };
        });
        setFrames({
          ...frames,
          signupActive: true,
          subscription: false,
          extensions: false,
          checkout: false,
        });
        SetIsSubscriptionProcessOnGoing(false);
      } else {
        setLoading(true);
        signupUser(reqBody)
          .then((res) => {
            console.log(res);
            setFrames({
              ...frames,
              signupSuccessful: true,
              checkout: false,
            });
            setLoading(false);
            // alert("Signup successful");

            // navigate("/");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          })
          .finally(() => {
            SetIsSubscriptionProcessOnGoing(false);
          });
      }
    });
  };
  const [isValidated,setValidated]=useState({ 
    firstName: "",
    lastName: "",
    email: "",
    phoneCode:"",
    phone: "",
    subscriptionCode: "",
    company: "",
 
})
  const handleNextErrors=(alsoSet)=>{
    resetErrors()
    const result = validateSignup(values);
   
    if (result.data !== true) {
      setValidated((prev) => {
        return {
          [result.data]: result.message,
        };
      })
    }
    else{
      setValidated({
      })
    }
    if(alsoSet){
    let flag=true;
    Object.keys(isValidated).map((it)=>{
     if (isValidated[it] && isValidated[it].length>0){
       flag=false;
     }
    })
    resetErrors()
    let arr={...isValidated}
    setError(arr)
    
    return flag;
   }
  }
const [emailExistLoad,setEmailExistLoad]=useState(false)
  const handleClick = () => {
    const emailAlreadyExists = async () => {
        setEmailExistLoad(true)
        let cc=0;
      let checked = false;
      try {
        
        let data = {
          workemail: values.email,
        };
        //   alert(data.workemail)
        let result = await axios.post(
          `${process.env.REACT_APP_BASE_URL}api/user/CheckEmail`,
          data,
          {
            headers: {
              "content-Type": "application/json",
            },
          }
        );
        if (result) checked = true;
        cc++;
      } catch (e) {
        console.error(e.response?.data?.message);
        cc++;
        setError({
          ...error,
          email: e.response?.data?.message,
        });
      }
      try {
        let data = {
          company: values.company,
        };
        //   alert(data.workemail)
        let result = await axios.post(
          `${process.env.REACT_APP_BASE_URL}api/user/CheckCompany`,
          data,
          {
            headers: {
              "content-Type": "application/json",
            },
          }
        );
        cc++;
      } catch (e) {
        checked = false;
        cc++;
        setError({
          ...error,
          company: e.response.data.message,
        });
      }
      if (checked === true ) {
        
        setFrames({
          ...frames,
          signupActive: false,
          subscription: true,
        });
        // setcurrentStep(currentStep => currentStep + 1)
      }
      if(cc>=2){
        setEmailExistLoad(false)
      }
    };
   
    if(!handleNextErrors(true)){
      return 
    }
 
  else
    emailAlreadyExists();
  };
 


  useEffect(()=>{
   
    handleNextErrors()
  },[values])

  // console.log(isLinkedEmail);
  useEffect(() => {
    addLinkedEmailDetails();
  }, []);

  const addLinkedEmailDetails = (user_id) => {
    if (!user_id) return;
    console.log(user_id);
    console.log(linkedEmailDetails);
    let details = { ...linkedEmailDetails };
    delete details["_id"];
    delete details["__v"];
    delete details["interest"];
    delete details["personality"];
    delete details["subjects"];
    addUserDetails({ userId: user_id, body: details }).then((res) => {
      console.log(res);
      if (res.error) {
        alert("something went wrong");
        return;
      }
      alert("Signup successful! Set password link has been sent to yout email");
      navigate("/");
    });
  };

  const [selected, setSelected] = useState(false);
  const selectRef = useRef();
  useOutsideAlerter(selectRef, () => setSelected(false));

  useEffect(() => setSelected(false), [numberPrefix]);

  const props = { persona, setFrames, setcurrentStep, frames };
  const valueProps = { values, setValues };
  const otherDetailsProps = {
    otherDetails,
    setOtherDetails,
    detailsError,
    setDetailsError,
    resetDetailsErrors,
    studentNumberPrefix,
    setStudentNumberPrefix,
  };

  // console.log("vaues", values);
  const handleBack = () => {
    navigate("/");
  };
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange1 = () => {
    setIsChecked(!isChecked);
  };
  const handleSuccessfullBack = () => {
    const obj = {
      ...frames,
      signupActive: true,
      signupSuccessful: false,
    };

    setFrames((prev) => ({
      ...prev,
      signupActive: true,
      signupSuccessful: false,
    }));
    sessionStorage.clear();
    console.log("shy", frames);
    //setcurrentStep(1);
    navigate("/");
  };

  const [clientSecret, SetClientSecret] = useState();

  const secretKey = "sk_test_51O1tgLSFF3kgujFeaEQ6Uh7PkOtF4SgSk5ATR8xxmCgLGIW4lkkDzeLDKMoMfjAwZVQyTDJjBkTCwJiIMGgVqrlQ00b9M9MyKZ"
  const publishableKey = "pk_test_51O1tgLSFF3kgujFe23VYSyhW5lbx2N3b7cjC1q1Q1alW9lwocUKObR8j4hBdpYx5xzDnFcPsNBbkzDu6hcDmHSP3004Sr0qX5e";
  const stripePromise = loadStripe(publishableKey);
  const stripe = require("stripe")(secretKey);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret: clientSecret,
    appearance,
  };

  return (
    <div className="   pb-6 bg-primary relative" id={styles.signUp}>
      <div className={`absolute bg-[#0000007a] flex items-center justify-center h-full w-full z-10`} 
        style={{
          display: isOtplessModalActive ? "" : "none"
        }}
      >
        <PrimaryButton
          className={` absolute top-[0px] right-[0px] w-[200px] flex justify-center  bg-[#FFA28D]  disabled:opacity-60 max-w-[110px]  rounded text-white text-sm font-medium relative py-[9px]`}
          onClick={() => {
            SetIsOtplessModalActive(false);
          }}
          children={"Close"}
        />
        <div class=" modal-container" id="modalContainer">
          <div class="modal">
            <div id="otpless-login-page"></div>
          </div>
        </div>
      </div>

      {/* <AdminNavbar></AdminNavbar> */}
      <div className="flex justify-center flex-col items-center md:grid-cols-2  mb-[100px]">
        <img src={cuate} alt="rocket" className="h-10vh mt-3 mb-4" />
        <>
          {!frames.signupSuccessful ? (
            <div className="lg:hidden bg-primary text-white pt-[79px] px-[49px]">
              <h1 className="text-[28px] mb-[13px]">
                {frames.signupActive
                  ? "Sign Up"
                  : frames.setPassword
                  ? ""
                  : "Profile Details"}
              </h1>

              <h6 className="mb-[10px]">Sign up with email address</h6>
            </div>
          ) : (
            <></>
          )}
          <div className={` flex lg:items-center relative bg-white rounded-md py-4 px-5 md:px-[48px] 
                          ${frames.extensions ? "lg:w-[1200px]" : "lg:w-[800px]"}`}>
            <div className="w-full py-4 ">
              {currentStep > 0 && (
                <NumericSteppers className={"left-2/4 -translate-x-2/4 self-center px-2 flex-1 lg:w-[600px]"} fieldNames={["Personal info" ,"Subscription","Extensions" ,"Subscribe"]} totalSteps={4} currentStep={currentStep}
                
                />
              )}
              {frames.signupActive ? (
                <div>
                  {/* <p
                    className={`hidden lg:block mb-[26px] ${styles.textGrayed} `}
                  >
                    Please fill your detail to create your account.
                  </p> */}
                  {/* <div>
                    <SecondaryButton
                        children="Signup with OTPLess"
                        className="mb-[40px] text-sm mr-6 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] py-2 "
                        onClick={() => {
                          window.otplessInit();
                          SetIsOtplessModalActive(true);
                        }}
                      />
                  </div> */}
                  <div
                    className={`flex mt-[59px] justify-between lg:mt-1 ${styles.inputs}`}
                  >
                    <InputField
                      placeholder=""
                      parentClassName="text-xs"
                      label="First Name"
                      labelClassname="text-[#26435F] font-semibold"
                      inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[45px] text-md"
                    
                      value={values.firstName}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          firstName: e.target.value,
                        })
                      }
                      totalErrors={error}
                      error={error.firstName}
                    />
                    <InputField
                      placeholder=""
                      parentClassName="text-xs"
                      labelClassname="text-[#26435F] font-semibold"
                      inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[45px] text-md"
                      label="Last Name"
                      value={values.lastName}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          lastName: e.target.value,
                        })
                      }
                      
                      totalErrors={error}
                      error={error.lastName}
                    />
                  </div>
                  <div className={`flex mt-[20px] justify-between  `}>
                    <InputField
                      label="Work Email"
                      placeholder=""
                      parentClassName="text-xs w-full "
                      labelClassname="text-[#26435F] font-semibold"
                      inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[45px] text-md"
                      value={values.email}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          email: e.target.value,
                        })
                      }
                      totalErrors={error}
                      error={error.email}
                    />

                    <InputFieldDropdown
                      placeholder=""
                      parentClassName="text-xs w-4/5 ml-8 "
                      labelClassname="text-[#26435F] font-semibold"
                      inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[45px] text-md"
                      label="Phone"
                      value={values.phone}
                      codeValue={values.phoneCode}
                      
                      handleCodeChange={(e) =>
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
                      error={error.phone}
                    />
                  </div>

                  <InputField
                    placeholder=""
                    parentClassName="text-xs mt-5 mb-6 w-full"
                    label="Name Of Business"
                    labelClassname="text-[#26435F] font-semibold"
                    inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[45px] text-md"
                    value={values.company}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        company: e.target.value,
                      })
                    }
                    totalErrors={error}
                    error={error.company}
                  />
                  <p className="text-[15px]  font-semibold mb-4 text-[#26435F]">
                    {" "}
                    Registering as{" "}
                  </p>
                  <div className="flex items-center text-xs">
                  <div
                      className="flex mr-6  items-center cursor-pointer"
                      onClick={() =>
                        setValues((prev) => ({
                          ...prev,
                          registrationAs: "Individual",
                        }))
                      }
                    >
                      {/* <input type="radio" defaultChecked={values.registrationAs === "Individual"
                            ? true
                            : false} className="w-3 h-3"/> */}
                      <div className="w-[30px]  flex justify-center">
                        <img
                          src={
                            values.registrationAs === "Individual"
                              ? RadioSelected
                              : RadioUnselected
                          }
                          alt="radio"
                          className=" mr-3"
                        />
                      </div>

                      <p
                        className={`${
                          values.registrationAs === "Individual"
                            ? "text-[#FFA28D] font-semibold "
                            : "text-[#26435F] font-semibold"
                        } text-[14px] `}
                      >
                        {" "}
                        Individual{" "}
                      </p>
                    </div>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() =>
                        setValues((prev) => ({
                          ...prev,
                          registrationAs: "Company",
                        }))
                      }
                    >
                      {/* <input type="radio"  defaultChecked={values.registrationAs === "Company"
                            ? true
                            : false}  className="w-3 h-3"/> */}
                      <div className="w-[30px] flex justify-center">
                        <img
                          src={
                            values.registrationAs === "Company"
                              ? RadioSelected
                              : RadioUnselected
                          }
                          alt="radio"
                          className="mr-3 p-0"
                        />
                      </div>
                      <p
                        className={`${
                          values.registrationAs === "Company"
                            ? "text-[#FFA28D] font-semibold "
                            : "text-[#26435F] font-semibold"
                        } text-[14px] `}
                      >
                        {" "}
                        Company{" "}
                      </p>
                    </div>
                    
                  </div>
                  <div className="mt-[25px] flex">
                    
                    <div className="flex items-center">
                   
                    <SCheckbox checked={isChecked}
                      uncheckColor={"bg-[#9CA3AF]"}
                      onChange={handleCheckboxChange1}
                    />
                   
                    <span className="text-[13px] text-[#26435F]  font-semibold">
                      {" "}
                     
                    </span>
                  </div>
                    <p className="text-[15px] text-[#26435F] font-medium  leading-5 ml-1 pl-2">
                      Selecting this would confirm that you have carefully read
                      through and agree to our{" "}
                      <span className="text-[#FFA28D] font-semibold">
                        <a href="http://evallo.org/tou">Terms of Use</a>
                      </span>{" "}
                      and{" "}
                      <span className="text-[#FFA28D] font-semibold">
                        <a href="http://evallo.org/privacy-policy">
                          Privacy Policy
                        </a>
                      </span>
                      .
                    </p>
                  </div>
                  <div className="flex items-center mt-[60px] justify-end">
                    <SecondaryButton
                      children="Go back"
                      className="text-sm mr-6 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] py-2 "
                      onClick={handleBack}
                    />
                    <PrimaryButton
                      className={`w-full flex justify-center  bg-[#FFA28D]  disabled:opacity-60 max-w-[110px]  rounded text-white text-sm font-medium relative py-[9px] ${
                        loading
                          ? "cursor-wait opacity-60 pointer-events-none"
                          : "cursor-pointer"
                      } 
                      
                      `}
                      loading={emailExistLoad}
                      disabled={
                        values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                      }
                      onClick={handleClick}
                      children={`Next`}
                    />
                  </div>
                </div>
              ) : frames.subscription ? (
                <Subscription
                  values={values}
                  setValues={setValues}
                  setFrames={setFrames}
                  setcurrentStep={setcurrentStep}
                  subscriptionPlanInfo={subscriptionPlanInfo}
                  subscriptionsInfoFromAPI={subscriptionsInfoFromAPI}
                />
              ) : frames.extensions ? (
                <Extensions
                  extensions={extensions}
                  extensionPlansInfo={extensionPlansData}
                  setExtensions={setExtensions}
                  setFrames={setFrames}
                  setcurrentStep={setcurrentStep}
                  subscriptionsInfoFromAPI={subscriptionsInfoFromAPI}
                />
              ) 
              //   : frames.payment ? (
              //   <Payment
              //     setFrames={setFrames}
              //     setcurrentStep={setcurrentStep}
              //   />
              // ) 
                : frames.checkout ? (
                // clientSecret ? 
                // <Elements options={{
                //   clientSecret: clientSecret,
                //   appearance,
                // }} stripe={stripePromise}>
                <CheckOut
                  setFrames={setFrames}
                  values={values}
                  extensions={extensions}
                  extensionPlansInfo={extensionPlansData}
                  subscriptionsInfo={subscriptionPlanInfo}
                  subscriptionsInfoFromAPI={subscriptionsInfoFromAPI}
                  handleSignup={handleSignup}
                  setcurrentStep={setcurrentStep}
                  clientSecret={clientSecret}
                  isSubscriptionProcessOnGoing={isSubscriptionProcessOnGoing}
                  SetIsSubscriptionProcessOnGoing={SetIsSubscriptionProcessOnGoing}
                 />
                //  </Elements> : (<></>)
              ) : frames.signupSuccessful ? (
                <SignupSuccessful
                  email={values.email}
                  {...props}
                  {...otherDetailsProps}
                  successfulSignUpMessage={successfulSignUpMessage}
                  handleSignup={handleSignup}
                  handleSuccessfullBack={handleSuccessfullBack}
                  loading={loading}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      </div>

    </div>
  );
}

/*

*/
