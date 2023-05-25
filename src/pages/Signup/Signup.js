import React, { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField/inputField";
import styles from "./signup.module.css";

import SelectPersona from "../Frames/SelectPersona/selectPersona";
import SelectServices from "../Frames/SelectServices/SelectServices";
import UserDetails from "../Frames/UserDetails/userDetails";
import Questions from "../Frames/Questions/Questions";
import SignupLast from "../Frames/SignupLast/SignupLast";
import SignupSuccessful from "../Frames/SignupSuccessful/SignupSuccessful";

import NumericSteppers from "../../components/NumericSteppers/NumericSteppers";
import CCheckbox from "../../components/CCheckbox/CCheckbox";

import DownArrow from "../../assets/icons/down-chevron.svg";

import selectStyles from "../../components/InputSelect/style.module.css";

import {
  useAddUserDetailsMutation,
  useSignupUserMutation,
} from "../../app/services/auth";
import { servicesSeeking } from "../Frames/SelectServices/data";
import { apQuestions, hearAboutUslist, motivesList } from "./data";
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
import RadioUnselected from "../../assets/icons/radio-unselected.svg";
import RadioSelected from "../../assets/icons/radio-selected.svg";

export default function Signup() {
  const [frames, setFrames] = useState({
    signupActive: true,
    selectPersona: false,
    services: false,
    userDetails: false,
    questions: false,
    signupLast: false,
    signupSuccessful: false,
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
    role: false,
    userId: "",
    registrationAs: "Individual",
  });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subscriptionCode: "",
  });

  const [otherDetails, setOtherDetails] = useState({
    schoolName: "",
    tellUsMore: "",
    grade: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
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

  const [services, setServices] = useState(servicesSeeking);
  const [apCourses, setApCourses] = useState(apQuestions);
  const [motive, setMotive] = useState(motivesList);
  const [hearAboutUs, setHearAboutUs] = useState(hearAboutUslist);
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
        phone: "",
        subscriptionCode: "",
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

  const handleClick = () => {
    const promiseState = async (state) =>
      new Promise((resolve) => {
        resolve(resetErrors());
      });

    promiseState().then(() => {
      let reqBody = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        subscriptionCode: values.subscriptionCode,
        phone: `${values.phone}`,
        phoneCode: `${numberPrefix}`,
      };
      if (values.checked === false) {
        // console.log(settings.subscriptionCode.includes(values.subscriptionCode));
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
      const result = validateSignup(reqBody);
      if (result.data !== true) {
        setError((prev) => {
          return {
            ...prev,
            [result.data]: result.message,
          };
        });
      } else {
        setLoading(true);
        signupUser(reqBody).then((res) => {
          setLoading(false);
          if (res.error) {
            if (res.error.data.message) {
              alert(res.error.data.message);
            }
          }
          console.log(res);
          if (isLinkedEmail) {
            addLinkedEmailDetails();
            setLinkedUserId(res.data.userId);
            addLinkedEmailDetails(res.data.userId);
          } else {
            setRedirectLink(res.data.link);
            setValues({ ...values, userId: res.data.userId });
            setFrames({
              ...frames,
              signupActive: false,
              selectPersona: true,
            });
          }
        });
      }
    });
  };

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

  const addDetails = () => {
    setLastLoginDisabled(true);
    const reqBody = {
      ...otherDetails,
      Phone: `${otherDetails.Phone}`,
      PhoneCode: `${studentNumberPrefix}`,
      serviceSeeking: getCheckedString(services),
      apCourses: getCheckedString(apCourses),
      motive: getCheckedString(motive),
      hearAboutUs: getCheckedString(hearAboutUs),
      subscriptionCode: values.subscriptionCode,
      userType: persona,
    };
    // console.log(reqBody);
    // return
    // console.log('session cleared');
    addUserDetails({ userId: values.userId, body: reqBody }).then((res) => {
      sessionStorage.clear();
      setLastLoginDisabled(false);
      console.log(res);
      if (res.error) {
        if (res.error.data.message) {
          alert(res.error.data.message);
          setFrames((prev) => {
            return {
              ...prev,
              signupSuccessful: false,
              signupLast: false,
              userDetails: true,
            };
          });
        } else {
          alert("Something went wrong");
          setFrames((prev) => {
            return {
              ...prev,
              signupSuccessful: false,
              signupLast: false,
              userDetails: true,
            };
          });
        }
        return;
      }
      // window.open(redirectLink);
    });
  };

  const [selected, setSelected] = useState(false);
  const selectRef = useRef();
  useOutsideAlerter(selectRef, () => setSelected(false));

  useEffect(() => setSelected(false), [numberPrefix]);

  const props = { persona, setFrames, setcurrentStep };
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

  return (
    <div className="min-h-screen bg-primary" id={styles.signUp}>
      <div className="flex items-center flex-col justify-center lg:min-h-screen">
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
          <div className="flex lg:items-center relative bg-white rounded-md py-6 px-5 md:px-[48px] lg:w-[520px]">
            <div className="w-full py-6">
              <h1
                className={`hidden lg:block mb-1.5 text-[30px] ${styles.title} `}
              >
                {frames.signupActive
                  ? "Sign Up"
                  : frames.setPassword
                  ? ""
                  : "Profile Details"}
              </h1>

              {currentStep > 1 && !frames.signupSuccessful && (
                <NumericSteppers totalSteps={6} currentStep={currentStep} />
              )}

              {frames.signupActive ? (
                <div>
                  <p
                    className={`hidden lg:block mb-[26px] ${styles.textGrayed} `}
                  >
                    Please fill your detail to create your account.
                  </p>
                  <div className={`flex mt-[59px] lg:mt-0 ${styles.inputs}`}>
                    <InputField
                      placeholder="First Name"
                      parentClassName="text-xs"
                      label="First Name"
                      value={values.firstName}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          firstName: e.target.value,
                        })
                      }
                      error={error.firstName}
                    />
                    <InputField
                      placeholder="Last Name "
                      parentClassName="text-xs"
                      label="Last Name"
                      value={values.lastName}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          lastName: e.target.value,
                        })
                      }
                      error={error.lastName}
                    />
                    <InputField
                      label="Work Email"
                      placeholder="Work Email"
                      parentClassName="text-xs"
                      value={values.email}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          email: e.target.value,
                        })
                      }
                      error={error.email}
                    />
                    <InputField
                      placeholder="Phone"
                      parentClassName="text-xs"
                      label="Phone"
                      value={values.phone}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          phone: e.target.value,
                        })
                      }
                      error={error.phone}
                    />

                    <InputField
                      placeholder="email@example.com"
                      parentClassName="text-xs mb-6"
                      label="Company"
                      value={values.company}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          company: e.target.value,
                        })
                      }
                      error={error.company}
                    />
                    <InputField
                      placeholder=""
                      parentClassName="text-xs mb-6"
                      label="Role"
                      value={values.role}
                      onChange={(e) =>
                        setValues({ ...values, role: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-xs mb-4"> Registration as </p>
                  <div className="flex items-center text-xs">
                    <div className="flex items-center mr-6">
                      <img src={RadioUnselected} alt="radio" className="mr-1.5" />
                      <p> Company </p>
                    </div>
                    <div className="flex items-center">
                      <img src={RadioSelected} alt="radio" className="mr-1.5" />
                      <p> Individual </p>
                    </div>
                  </div>
                  <PrimaryButton
                    className={`w-full bg-primary disabled:opacity-60 max-w-[110px] mt-[99px] lg:mt-12 rounded text-white text-xs font-medium relative ${
                      loading
                        ? "cursor-wait opacity-60 pointer-events-none"
                        : "cursor-pointer"
                    }`}
                    disabled={values.email === "" ? true : false}
                    onClick={handleClick}
                    children={`Next`}
                  />
                  <p
                    className="text-secondary text-xs font-semibold ml-2 mt-2 cursor-pointer inline-block"
                    onClick={() => navigate("/")}
                  >
                    Login Instead?
                  </p>
                </div>
              ) : frames.selectPersona ? (
                <SelectPersona {...props} setPersona={setPersona} />
              ) : frames.services ? (
                // persona !== 'parent'
                //    ?
                <SelectServices
                  {...props}
                  services={services}
                  setServices={setServices}
                  {...otherDetailsProps}
                  {...valueProps}
                />
              ) : // : <UserDetails {...props} {...otherDetailsProps} />
              frames.userDetails ? (
                // persona === 'parent'
                // ?
                <UserDetails
                  {...props}
                  {...otherDetailsProps}
                  isAddedByAdmin={isAddedByAdmin}
                />
              ) : // : <SelectServices
              //    {...props}
              //    services={services}
              //    setServices={setServices}
              //    {...otherDetailsProps}
              //    {...valueProps}
              // />
              frames.questions ? (
                <Questions
                  {...props}
                  {...otherDetailsProps}
                  apCourses={apCourses}
                  motive={motive}
                  setApCourses={setApCourses}
                  setMotive={setMotive}
                />
              ) : frames.signupLast ? (
                <SignupLast
                  {...props}
                  {...otherDetailsProps}
                  hearAboutUs={hearAboutUs}
                  setHearAboutUs={setHearAboutUs}
                />
              ) : frames.signupSuccessful ? (
                <SignupSuccessful
                  {...props}
                  addDetails={addDetails}
                  lastLoginDisabled={lastLoginDisabled}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
