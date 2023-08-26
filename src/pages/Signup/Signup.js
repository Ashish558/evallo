import React, { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField/inputField";
import styles from "./signup.module.css";
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

export default function Signup() {
  const [frames, setFrames] = useState({
    signupActive: true,
    orgDetails: false,
    furtherDetails: false,
    requirements: false,
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
  const [currentStep, setcurrentStep] = useState(1);

  const [testPreparations, setTestPreparations] =
    useState(testPreparationsData);
  const [tutoring, setTutoring] = useState(tutoringData);
  const [coaching, setCoaching] = useState(coachingData);
  const [studentserved, setStudentserved] = useState(studentServedData);
  const [hearAboutUs, setHearAboutUs] = useState(hearAboutUsData);
  const [rateUs, setRateUs] = useState(rateUsData);
  const [paymentOptions, setPaymentOptions] = useState(paymentOptionsData);
  const [solutions, setSolutions] = useState(solutionsData);

  const [instructions, setInstructions] = useState(instructionFormat);

  const [getDetails, getDetailsResp] = useLazyGetUserDetailQuery();

  const fetchSettings = () => {
    getSettings().then((res) => {
      // console.log(res);
      setSettings(res.data.data.setting);
    });
  };
  useEffect(() => {
    fetchSettings();
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
    // setFrames((prev) => {
    //    return { ...prev, signupActive: false, userDetails: true };
    // })

    // getDetails({ id: paramUserId })
    //    .then(res => {
    //       if (res.error) {
    //          return console.log(res.error)
    //       }
    //       console.log('param res', res.data);
    //       const { user, userdetails } = res.data.data
    //       let user_detail = { ...userdetails }
    //       console.log('user', user);
    //       console.log('userdetails', userdetails);

    //    })
  }, [paramUserId, paramUserRole]);

  useEffect(() => {
    const paramsUserId = searchParams.get("userId");
    return;
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
          orgDetails: false,
          furtherDetails: false,
          requirements: false,
        });
      } else {
        setLoading(true);
        signupUser(reqBody)
          .then((res) => {
            console.log(res);
            setFrames({
              ...frames,
              signupSuccessful: true,
              requirements: false,
            });
            setLoading(false);

            // alert("Signup successful");

            // navigate("/");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
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
          orgDetails: true,
        });
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
  return (
    <div className="   pb-6 bg-primary relative" id={styles.signUp}>
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
          <div className="flex lg:items-center relative bg-white rounded-md py-4 px-5 md:px-[48px] lg:w-[650px]">
            <div className="w-full py-4 ">
              {currentStep > 0 && (
                <NumericSteppers className={"px-2 flex-1"} fieldNames={["Personal info" ,"Org details","Further details","Requirements"]} totalSteps={4} currentStep={currentStep}
                
                />
              )}
              {frames.signupActive ? (
                <div>
                  {/* <p
                    className={`hidden lg:block mb-[26px] ${styles.textGrayed} `}
                  >
                    Please fill your detail to create your account.
                  </p> */}
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
                  <div className="flex items-center mt-[60px] justify-between">
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
              ) : frames.orgDetails ? (
                <OrgDetails
                  {...props}
                  setPersona={setPersona}
                  values={values}
                  setValues={setValues}
                />
              ) : frames.furtherDetails ? (
                <FurtherDetails
                  {...props}
                  testPreparations={testPreparations}
                  setTestPreparations={setTestPreparations}
                  coaching={coaching}
                  setCoaching={setCoaching}
                  studentserved={studentserved}
                  setStudentserved={setStudentserved}
                  paymentOptions={paymentOptions}
                  setPaymentOptions={setPaymentOptions}
                  tutoring={tutoring}
                  setTutoring={setTutoring}
                  instructions={instructions}
                  setInstructions={setInstructions}
                  {...otherDetailsProps}
                  {...valueProps}
                />
              ) : frames.requirements ? (
                <SignupLast
                  {...props}
                  {...otherDetailsProps}
                  hearAboutUs={hearAboutUs}
                  rateUs={rateUs}
                  setRateUs={setRateUs}
                  setHearAboutUs={setHearAboutUs}
                  solutions={solutions}
                  setSolutions={setSolutions}
                  handleSignup={handleSignup}
                  loading={loading}
                />
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
