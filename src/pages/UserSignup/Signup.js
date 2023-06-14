import React, { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField/inputField";
import styles from "./signup.module.css";

import OrgDetails from "../Frames/OrgDetails/OrgDetails";
import SignupLast from "../Frames/SignupLast/SignupLast";
import FurtherDetails from "../Frames/FurtherDetails/FurtherDetails";

import cuate from "../../assets/signup/cuate.png";
import NumericSteppers from "../../components/NumericSteppers/NumericSteppers";

import {
  useAddUserDetailsMutation,
  useSignupUserMutation,
} from "../../app/services/auth";
import {
  instructionFormat,
  hearAboutUsData,
  solutionsData,
  testPreparationsData,
  tutoringData,
  coachingData,
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
import RadioUnselected from "../../assets/icons/radio-unselected.svg";
import RadioSelected from "../../assets/icons/radio-selected.svg";
import OtherDetails from "../Frames/OtherDetails/userDetails";
import CustomFields from "../Frames/CustomFields/CustomFields";
import { useGetUserByOrgNameMutation } from "../../app/services/organization";

export default function UserSignup() {
  const [frames, setFrames] = useState({
    signupActive: true,
    userDetails: false,
    customFields: false,
  });

  const [settings, setSettings] = useState({});
  const [getSettings, getSettingsResp] = useLazyGetSettingsQuery();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    firstName: "w",
    lastName: "w",
    email: "wewew@gmail.com",
    phone: "1232132132",
    userId: "",
    registrationAs: "Parent",
    role: "Parent",
    orgName: "",
    companyType: "",
    website: "",
    address: "",
    country: "",
    state: "",
    zip: "",
    city: "",

    activeStudents: 0,
    activeTutors: 0,
    services: [],
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
  const [organisation, setOrganisation] = useState({});
  const [isLinkedEmail, setIsLinkedEmail] = useState(false);
  const [linkedUserId, setLinkedUserId] = useState("");

  const [linkedEmailDetails, setLinkedEmailDetails] = useState({});

  const [persona, setPersona] = useState("");
  const [currentStep, setcurrentStep] = useState(1);

  const [testPreparations, setTestPreparations] =
    useState(testPreparationsData);
  const [tutoring, setTutoring] = useState(tutoringData);
  const [coaching, setCoaching] = useState(coachingData);

  const [hearAboutUs, setHearAboutUs] = useState(hearAboutUsData);
  const [solutions, setSolutions] = useState(solutionsData);

  const [instructions, setInstructions] = useState(instructionFormat);

  const [getDetails, getDetailsResp] = useLazyGetUserDetailQuery();
  const [getOrgDetails, getOrgDetailsResp] = useGetUserByOrgNameMutation();
  const [searchParams, setSearchParams] = useSearchParams();
const [customFields, setCustomFields] = useState([])

  const fetchSettings = () => {
    getSettings().then((res) => {
      // console.log(res);
      setSettings(res.data.data.setting);
    });
  };
  useEffect(() => {
    fetchSettings();
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
    const name = searchParams.get("orgName");
    getOrgDetails({ orgOfName: name }).then((res) => {
      if (res.error) {
        console.log(res.error);
        return;
      }
      // console.log(res.data);
      if (!res.data.organisation) return;
      if (res.data.organisation.length === 0) return;
      if (res.data.organisation[0]) {
        setOrganisation(res.data.organisation[0])
        setCustomFields(res.data.organisation[0].customFields)
      }
    });
  }, [searchParams.get("orgName")]);

  useEffect(() => {
    setCount(1);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("frames")) {
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

  const handleSignup = () => {
    const promiseState = async (state) =>
      new Promise((resolve) => {
        resolve(resetErrors());
      });

    promiseState().then(() => {
      let reqBody = {
        firstname: values.firstName,
        lastname: values.firstName,
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

        testpreparation: getCheckedString(testPreparations),
        subjecttutoring: getCheckedString(tutoring),
        coaching: getCheckedString(coaching),
        formatofinstruction: getCheckedString(instructions),
        studentserved: getCheckedString(hearAboutUs),
        solutionyouarelookingfor: getCheckedString(solutions),
      };
      console.log({ reqBody });
      if (values.checked === false) {
        let allCodes = [];
        settings.subscriptionCode.forEach((item) => {
          allCodes.push(item.code);
        });
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
      console.log({ result });
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
              signupActive: true,
              requirements: false,
            });
            setLoading(false);
            alert("Signup successful");
            navigate("/");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      }
    });
  };

  const handleClick = () => {
    setFrames({
      ...frames,
      signupActive: false,
      userDetails: true,
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

  console.log("customFields", customFields);

  return (
    <div
      className="min-h-screen overflow-y-auto pb-6 bg-primary"
      id={styles.signUp}
    >
      <div className="flex justify-center flex-col items-center md:grid-cols-2 min-h-screen ">
        <img src={cuate} alt="rocket" class="h-10vh mb-10" />
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
                <NumericSteppers totalSteps={3} currentStep={currentStep} />
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
                      placeholder="Vishesh"
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
                      placeholder="Patel"
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
                  </div>
                  <div className="mt-3 mb-4">
                    <InputField
                      label="Email"
                      placeholder=" Lorem123@gmail.com"
                      parentClassName="text-xs mb-3"
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
                      placeholder="99999994532"
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
                  </div>
                  <p className="text-xs mb-4"> Registration as </p>
                  <div className="flex items-center text-xs">
                    <div
                      className="flex items-center mr-6 cursor-pointer"
                      onClick={() =>
                        setValues((prev) => ({
                          ...prev,
                          registrationAs: "Parent",
                        }))
                      }
                    >
                      <img
                        src={
                          values.registrationAs === "Parent"
                            ? RadioSelected
                            : RadioUnselected
                        }
                        alt="radio"
                        className="mr-1.5"
                      />
                      <p> Parent / Guardian </p>
                    </div>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() =>
                        setValues((prev) => ({
                          ...prev,
                          registrationAs: "Student",
                        }))
                      }
                    >
                      <img
                        src={
                          values.registrationAs === "Student"
                            ? RadioSelected
                            : RadioUnselected
                        }
                        alt="radio"
                        className="mr-1.5"
                      />
                      <p> Student </p>
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
              ) : frames.userDetails ? (
                <OtherDetails
                  {...props}
                  setPersona={setPersona}
                  {...valueProps}
                  {...otherDetailsProps}
                />
              ) : frames.customFields ? (
                <CustomFields {...props} {...valueProps} customFields={customFields} setCustomFields={setCustomFields} />
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
