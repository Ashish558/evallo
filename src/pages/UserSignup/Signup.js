import React, { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField/inputField";
import styles from "./signup.module.css";
import axios from "axios";
import SetPassword from "../Frames/SetPassword/SetPasswordInvited";
import cuate from "../../assets/signup/cuate.svg";
import NumericSteppers from "../../components/NumericSteppers/NumericSteppers";
import {
  useAddUserDetailsMutation,
  useSignupMutation,
} from "../../app/services/auth";

import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import { validateSignup } from "./utils/util";
import {
  useLazyGetUserDetailQuery,
  useLazyGetSingleUserQuery,
  useUpdateUserMutation,
  useLazyGetOrganizationQuery,
} from "../../app/services/users";
import { useNavigate, useSearchParams } from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import OtherDetails from "../Frames/OtherDetails/userDetails";
import CustomFields from "../Frames/CustomFields/CustomFields";
import { useGetUserByOrgNameMutation } from "../../app/services/organization";
import InputFieldDropdown from "../../components/InputField/inputFieldDropdown";
import CCheckbox from "../../components/CCheckbox/CCheckbox";

export default function UserSignup() {
  const [frames, setFrames] = useState({
    signupActive: true,
    userDetails: false,
    customFields: false,
    setPasswordFields: false,
  });

  const [settings, setSettings] = useState({});
  const [getSettings, getSettingsResp] = useLazyGetSettingsQuery();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [stepOneDisabled, setStepOneDisabled] = useState(false)
  const [stepTwoDisabled, setStepTwoDisabled] = useState(false)

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userId: "",
    role: "parent",
    referalCode: "",
    phoneCode: "",
    terms: false,
    ageChecked: false,
  });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneCode: "",
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
    PphoneCode: "",
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

  const [signupUser, signupUserResp] = useSignupMutation();
  const [addUserDetails, addUserDetailsResp] = useAddUserDetailsMutation();
  const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery();
  const [count, setCount] = useState(0);
  const [organisation, setOrganisation] = useState({});
  const [fetchOrganisation, fetchOrganisationstatus] =
    useLazyGetOrganizationQuery();
  const [currentStep, setcurrentStep] = useState(1);

  const [getOrgDetails, getOrgDetailsResp] = useGetUserByOrgNameMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [customFields, setCustomFields] = useState([]);
  const [getDetails, getDetailsResp] = useLazyGetSingleUserQuery();
  const [updateUser, updateUserRes] = useUpdateUserMutation();
  const [isAddedByAdmin, setIsAddedByAdmin] = useState(false);

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
    sessionStorage.setItem("redirectLink", redirectLink);
    sessionStorage.setItem("numberPrefix", numberPrefix);
    sessionStorage.setItem("currentStep", currentStep);
    sessionStorage.setItem("numberPrefix", numberPrefix);
    sessionStorage.setItem("studentNumberPrefix", studentNumberPrefix);
  }, [
    frames,
    values,
    otherDetails,
    redirectLink,
    numberPrefix,
    currentStep,
    numberPrefix,
    studentNumberPrefix,
  ]);

  useEffect(() => {
    const name = searchParams.get("orgName");

    getOrgDetails({ company: name }).then((res) => {
      if (res.error) {
        console.log(res.error);
        return;
      }

      if (!res.data.organisation) return;
      if (res.data.organisation.length === 0) return;
      if (res.data.organisation[0]) {
        setOrganisation(res.data.organisation[0]);
        // setCustomFields(res.data.organisation[0]?.settings?.customFields);
      }
    });
  }, [searchParams.get("orgName")]);

  const paramUserId = searchParams.get("userid");
  const paramUserRole = searchParams.get("role");
  useEffect(() => {
    if (!paramUserId) return;
    if (!paramUserRole) return;
    console.log("paramUserId", paramUserId);

    setIsAddedByAdmin(true);
    // setFrames((prev) => {
    //   return { ...prev, signupActive: false, userDetails: true };
    // });

    getDetails(paramUserId).then((res) => {
      if (res.error) {
        return console.log(res.error);
      }
      console.log("param res", res.data);
      if (res.data?.user) {
        const { firstName, lastName, phone, email, role, associatedOrg, phoneCode } =
          res.data.user;
        setValues((prev) => {
          return {
            ...prev,
            userId: paramUserId,
            firstName,
            lastName,
            phone,
            email,
            role,
            phoneCode
          };
        });
        setStepOneDisabled(true)
        getUserDetail({ id: paramUserId }).then((res) => {
          console.log('res----', res.data.data);
          if (res.data.data.userdetails) {
            let detail = res.data.data.userdetails
            setOtherDetails({
              ...otherDetails,
              FirstName: detail.FirstName,
              LastName: detail.LastName,
              Phone: detail.Phone,
              Email: detail.Email,
              grade: detail.grade,
              schoolName: detail.schoolName,
              PphoneCode: detail.phoneCode
            })
            setStepTwoDisabled(true)
            // setFrames({
            //   signupActive: false,
            //   userDetails: false,
            //   customFields: false,
            //   setPasswordFields: true,
            // })
          }
        })
        fetchOrganisation(associatedOrg).then((org) => {
          //console.log("organisation details",{org})
          if (org.error) {
            console.log(org.error);
            return;
          }

          if (org?.data?.organisation) {
            setOrganisation(org.data.organisation);
            // setCustomFields(org.data.organisation?.settings?.customFields);
          }
        });
      }
      const { user, userdetails } = res.data.user;
      let user_detail = { ...userdetails };
      console.log("user", user);
    });
  }, [paramUserId, paramUserRole]);

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
  const [isValidated, setValidated] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "",
    phone: "",
    subscriptionCode: "",
    company: "",
    phoneCode: "",
  });
  const handleNextErrors = (alsoSet) => {
    resetErrors();
    const result = validateSignup(values);

    if (result.data !== true) {
      setValidated((prev) => {
        return {
          [result.data]: result.message,
        };
      });
    } else {
      setValidated({});
    }
    if (alsoSet) {
      let flag = true;
      Object.keys(isValidated).map((it) => {
        if (isValidated[it] && isValidated[it].length > 0) {
          flag = false;
        }
      });
      resetErrors();
      let arr = { ...isValidated };
      setError(arr);
      console.log({ isValidated });
      return flag;
    }
  };
  useEffect(() => {
    handleNextErrors();
  }, [values]);

  const handleClick = async () => {
    let f = /[a-z]/i.test(values?.firstName)
    f = f && /[a-z]/i.test(values?.lastName)
    if (!f) {
      alert("Enter a valid name!")
      return
    }
    const emailAlreadyExists = async () => {
      let checked = false;
      if (isAddedByAdmin) {
        setFrames({
          ...frames,
          signupActive: false,
          userDetails: true,
        });
        return;
      }
      try {
        let data = {
          workemail: values.email,
        };
        let result = await axios.post(
          `${process.env.REACT_APP_BASE_URL}api/user/CheckEmail`,
          data,
          {
            headers: {
              "content-Type": "application/json",
            },
          }
        );
        console.log(result);
        if (result) checked = true;
      } catch (e) {
        console.error(e.response.data.message);
        setError({
          ...error,
          email: e.response.data.message,
        });
      }
      if (checked === true) {
        setFrames({
          ...frames,
          signupActive: false,
          userDetails: true,
        });
      }
    };
    if (!handleNextErrors(true)) {
      return;
    }
    emailAlreadyExists();
  };

  const handleSignup = () => {
    const promiseState = async (state) =>
      new Promise((resolve) => {
        resolve(resetErrors());
      });
    let updatedCustomfields = customFields?.map((item) => {
      return {
        _id: item._id,
        dataType: "String",
        name: item.name,
        Values: item.value,
      };
    });

    promiseState().then(() => {
      let reqBody = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        phoneCode: values.phoneCode,
        role: values.role.toLowerCase(),
        ...otherDetails,
        PhoneCode: otherDetails.PphoneCode,
        customFields: updatedCustomfields,
        associatedOrg: organisation._id,
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
          userDetails: false,
          customFields: false,
        });
      } else {
        setLoading(true);
        if (isAddedByAdmin) {
          reqBody.userId = values.userId;
          signupUser(reqBody)
            .then((res) => {
              setLoading(false);
              console.log(res);
              if (res?.error?.data?.message === "Referral code not match.") {
                alert("Referal code is not valid! Enter valid referal code.");
                return;
              }
              if (res.error) {
                alert("Something went wrong");
                return;
              }

              alert("Signup successful");
              //navigate("/");
              if (frames.userDetails && customFields?.length > 0) {
                setFrames({
                  ...frames,
                  setPasswordFields: false,
                  userDetails: false,
                  customFields: true,
                });
                return;
              } else {
                setFrames({
                  ...frames,
                  setPasswordFields: true,
                  userDetails: false,
                  customFields: false,
                });
                sessionStorage.clear();
              }
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        } else {
          signupUser(reqBody)
            .then((res) => {
              console.log("sessionClear", res);
              setLoading(false);
              if (res?.data?.status === "success") {
                alert("Signup successful");
                navigate("/");
                sessionStorage.clear();
                return;
              }
              if (res?.error?.data?.message === "Referral code not match.")
                alert("Referal code is not valid! Enter valid referal code.");
              else alert("something went wrong , please try again");
            })
            .catch((err) => {
              setLoading(false);
              console.log("error", err);
            });
        }
      }
    });
  };

  const [selected, setSelected] = useState(false);
  const selectRef = useRef();
  useOutsideAlerter(selectRef, () => setSelected(false));

  useEffect(() => setSelected(false), [numberPrefix]);

  const props = { setFrames, setcurrentStep };
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
  // console.log("customFields", customFields);

  const handleCheckboxChangeTerms = () => {
    setValues({
      ...values,
      terms: !values.terms,
    });
  };
  const handleCheckboxChangeReferral = () => {
    if (values.referalCode.trim().length === 0) return;
    setValues({
      ...values,
      referalCode: values.referalCode.trim(),
    });
  };
  const handleCheckboxChangeAge = () => {
    setValues({
      ...values,
      ageChecked: !values.ageChecked,
    });
  };

  return (
    <div className=" pb-6 bg-primary" id={styles.signUp}>
      <div className="flex justify-center flex-col items-center md:grid-cols-2  ">
        <img src={cuate} alt="rocket" className="h-10vh mt-3 mb-4" />
        <>
          {!frames.signupSuccessful ? (
            <div className="hidden bg-primary text-white pt-[79px] px-[49px]">
              <h1 className="text-[28px] mb-[13px]">
                {frames.signupActive
                  ? "Sign Up"
                  : frames.setPasswordFields && !isAddedByAdmin
                    ? "Set Password"
                    : "Profile Details"}
              </h1>

              <h6 className="mb-[10px]">Sign up with email address</h6>
            </div>
          ) : (
            <></>
          )}
          <div className="flex lg:items-center relative bg-white rounded-md py-6 px-5 md:px-[48px] w-[41.6667vw] mb-[139px]">
            <div className="w-full py-3">
              <h1
                className={`hidden lg:block mb-1.5 text-[30px] ${styles.title} `}
              >
                {frames.signupActive
                  ? ""
                  : frames.setPasswordFields && !isAddedByAdmin
                    ? "Set Password"
                    : ""}
              </h1>

              {currentStep > 0 && !frames.signupSuccessful && (
                <NumericSteppers
                  className="mt-3"
                  fieldNames={
                    customFields?.length > 0 && isAddedByAdmin
                      ? [
                        "Personal info",
                        "Student / Parent",
                        "Further details",
                        "Set password",
                      ]
                      : [
                        "Personal info",
                        "Student / Parent",
                        isAddedByAdmin ? "Set password" : "Further details",
                      ]
                  }
                  totalSteps={
                    customFields?.length === 0
                      ? 2 + isAddedByAdmin
                      : 3 + isAddedByAdmin
                  }
                  currentStep={currentStep}
                  customFieldsPresents={true}
                />
              )}

              {frames.signupActive ? (
                <div>
                  <div className={`flex mt-[59px] justify-between lg:mt-0 ${stepOneDisabled ? 'pointer-events-none cursor-not-allowed' :''}`}>
                    <InputField
                      placeholder=""
                      inputContainerClassName="text-base-17-5  bg-white   border border-[#D0D5DD] h-[53px]"
                      parentClassName="text-base-17-5 w-[16.9271vw]"
                      labelClassname="mb-1 text-[#26435F] !font-medium"
                      label="First Name"
                      value={values.firstName}
                      onChange={(e) => {
                        // const alphabeticOnly = e.target.value.replace(
                        //   /[^a-zA-Z]/g,
                        //   ""
                        // );
                        // e.target.value = alphabeticOnly;
                        // e.target.value=e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);

                        setValues({
                          ...values,
                          firstName: e.target.value,
                        });
                      }}
                      totalErrors={error}
                      error={error.firstName}
                    />
                    <InputField
                      placeholder=""
                      inputContainerClassName="text-base-17-5  bg-white   border border-[#D0D5DD] h-[53px]"
                      parentClassName="text-base-17-5 w-[16.9271vw]"
                      labelClassname="mb-1 text-[#26435F] !font-medium"
                      label="Last Name"
                      value={values.lastName}
                      onChange={(e) => {

                        // const alphabeticOnly = e.target.value.replace(
                        //   /[^a-zA-Z]/g,
                        //   ""
                        // );
                        // e.target.value = alphabeticOnly;
                        // e.target.value=e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
                        setValues({
                          ...values,
                          lastName: e.target.value,
                        });
                      }}
                      totalErrors={error}
                      error={error.lastName}
                    />
                  </div>
                  <div className={`flex  items-center mt-[30px] mb-[29px] justify-between ${stepOneDisabled ? 'pointer-events-none cursor-not-allowed' :''}`}>
                    <InputField
                      labelClassname="mb-1 text-[#26435F] !font-medium"
                      label="Email"
                      placeholder=""
                      inputContainerClassName="text-base-17-5  bg-white   border border-[#D0D5DD] h-[53px]"
                      parentClassName=" text-base-17-5 w-[19.5313vw]"
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
                      inputContainerClassName="text-base-17-5  bg-white h-[53px]  border border-[#D0D5DD]"
                      parentClassName="text-base-17-5 w-[14.3229vw]"
                      inputClassName="  bg-transparent text-400 text-base-17-5"
                      labelClassname="mb-1 text-[#26435F]  !font-medium text-[#26435F]"
                      label="Phone"
                      codeClassName="!min-w-[40px] "
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
                      error={error.phone}
                      codeError={error.phoneCode}
                    />
                  </div>

                  <div className="mt-5">
                    <p
                      className={`mb-[19px] text-[#26435F] text-base-17-5  font-semibold`}
                    >
                      Are you signing up as a Parent or a Student?
                    </p>
                    <div className={`flex items-center  text-[13.5px] gap-x-6 ${stepOneDisabled ? 'pointer-events-none cursor-not-allowed' :''}`}>
                      <div
                        onClick={() => {
                          setValues((prev) => ({
                            ...prev,
                            role: "parent",
                          }));
                        }}
                        className={styles.textLight}
                      >
                        <div className={` flex items-center  `}>
                          <input
                            type="radio"
                            className="form-radio hidden"
                            id="radioOption"
                          />
                          <div
                            className={`relative inline-block ml-[2px] w-4 h-4   rounded-full border ${values.role === "parent"
                              ? "border-[#FFA28D]"
                              : "border-gray-600"
                              } cursor-pointer`}
                          >
                            {values.role === "parent" && (
                              <div className="absolute inset-0 my-auto mx-auto w-[8px] h-[8px] rounded-full bg-[#FFA28D]" />
                            )}{" "}
                          </div>

                          <span className="ml-[10px] text-[#507CA8] text-base-17-5">
                            Parent / Guardian
                          </span>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setValues((prev) => ({
                            ...prev,
                            role: "student",
                          }));
                        }}
                        className={styles.textLight}
                      >
                        <div className={` flex items-center  `}>
                          <input
                            type="radio"
                            className="form-radio hidden"
                            id="radioOption"
                          />
                          <div
                            className={`relative inline-block w-4 h-4 p-1   rounded-full border ${values.role === "student"
                              ? "border-[#FFA28D]"
                              : "border-gray-600"
                              } cursor-pointer`}
                          >
                            {values.role === "student" && (
                              <div className="absolute inset-0 my-auto mx-auto w-[8px] h-[8px] rounded-full bg-[#FFA28D]" />
                            )}{" "}
                          </div>

                          <span className="ml-2 text-[#507CA8] text-base-17-5">Student</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" gap-x-2 my-5">
                    <div className={`flex ${styles.textLight}`}>
                      <CCheckbox
                        checked={values.ageChecked}
                        onChange={handleCheckboxChangeAge}
                      />

                      <span className="ml-2 text-base-17-5 text-[#507CA8]">
                        I confirm that I am 13 years or older
                      </span>
                    </div>
                  </div>

                  <div className=" gap-x-2 mt-5 mb-[50px]">
                    <div className={`flex ${styles.textLight}`}>
                      <CCheckbox
                        checked={values.terms}
                        onChange={handleCheckboxChangeTerms}
                      />
                      <p className={` ml-2 text-base-17-5 text-[#507CA8]`}>
                        I have carefully read and agree to the{" "}
                        <a
                          href="http://evallo.org/tou"
                          className="font-medium text-[#26435F] mr-1"
                        >
                          Terms of Use
                        </a>
                        and
                        <a
                          href="http://evallo.org/privacy-policy"
                          className=" ml-1 font-medium text-[#26435F]"
                        >
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mt-[30px] justify-end">
                    {/* <SecondaryButton
                      children="Go Back"
                      className="!text-[0.9688vw] mr-6 bg-white text-[#B3BDC7] border-[1.3px] border-[#D0D5DD] font-medium h-[53px] rounded-5 w-[7.6042vw]"
                      onClick={() => navigate("/")}
                    /> */}

                    <PrimaryButton
                      className={`bg-[#FFA28D] text-center items-center justify-center disabled:opacity-60 w-[7.6042vw]   text-[#FFF] !text-[0.9688vw] font-medium relative h-[53px] rounded-5 ${loading
                        ? "cursor-wait opacity-60 pointer-events-none"
                        : "cursor-pointer"
                        }`}
                      disabled={
                        values.email.trim().length === 0 ||
                          !values.terms ||
                          !values.ageChecked
                          ? true
                          : false
                      }
                      onClick={handleClick}
                      children={`Next`}
                    />
                  </div>
                </div>
              ) : frames.userDetails ? (
                <OtherDetails
                  {...props}
                  {...valueProps}
                  customFields={customFields}
                  {...otherDetailsProps}
                  newLoader={loading}
                  handleSignup={handleSignup}
                  stepTwoDisabled={stepTwoDisabled}
                />
              ) : frames.customFields ? (
                <CustomFields
                  {...props}
                  {...valueProps}

                  customFields={customFields}
                  setCustomFields={setCustomFields}
                  handleSignup={handleSignup}
                />
              ) : frames.setPasswordFields ? (
                <SetPassword
                  {...props}
                  {...valueProps}
                  currentStep={currentStep}
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
