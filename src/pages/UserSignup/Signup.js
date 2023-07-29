import React, { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField/inputField";
import styles from "./signup.module.css";

import OrgDetails from "../Frames/OrgDetails/OrgDetails";
import SignupLast from "../Frames/SignupLast/SignupLast";
import FurtherDetails from "../Frames/FurtherDetails/FurtherDetails";
import axios from "axios";
import SetPassword from "../Frames/SetPassword/SetPasswordInvited";
import cuate from "../../assets/signup/cuate.png";
import NumericSteppers from "../../components/NumericSteppers/NumericSteppers";

import {
  useAddUserDetailsMutation,
  useSignupMutation,
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
  useLazyGetSingleUserQuery,
  useUpdateUserMutation,
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
    setPasswordFields: false,
  });

  const [settings, setSettings] = useState({});
  const [getSettings, getSettingsResp] = useLazyGetSettingsQuery();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userId: "",
    role: "parent",
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

  const [signupUser, signupUserResp] = useSignupMutation();
  const [addUserDetails, addUserDetailsResp] = useAddUserDetailsMutation();
  const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery();
  const [count, setCount] = useState(0);
  const [organisation, setOrganisation] = useState({});

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
      // console.log(res.data);
      if (!res.data.organisation) return;
      if (res.data.organisation.length === 0) return;
      if (res.data.organisation[0]) {
        setOrganisation(res.data.organisation[0]);
        setCustomFields(res.data.organisation[0].customFields);
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
    setFrames((prev) => {
      return { ...prev, signupActive: false, userDetails: true };
    });

    getDetails(paramUserId).then((res) => {
      if (res.error) {
        return console.log(res.error);
      }
      console.log("param res", res.data);
      if (res.data?.user) {
        const { firstName, lastName, phone, email, role } = res.data.user;
        setValues((prev) => {
          return {
            ...prev,
            userId: paramUserId,
            firstName,
            lastName,
            phone,
            email,
            role,
          };
        });
      }
      const { user, userdetails } = res.data.data;
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

  const handleClick = async () => {
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

  const handleSignup = () => {
    const promiseState = async (state) =>
      new Promise((resolve) => {
        resolve(resetErrors());
      });
    let updatedCustomfields = customFields.map((item) => {
      return {
        _id: item._id,
        dataType: item.dataType,
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
        role: values.role.toLowerCase(),
        ...otherDetails,
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
          updateUser(reqBody)
            .then((res) => {
              console.log(res);
              if (res.error) {
                alert("Something went wrong");
                return;
              }
              setLoading(false);
              alert("Signup successful");
              //navigate("/");

              setFrames({
                ...frames,
                setPasswordFields: true,
                userDetails: false,
                customFields: false,
              });

              sessionStorage.clear();
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        } else {
          signupUser(reqBody)
            .then((res) => {
              console.log(res);
              setLoading(false);
              if (res?.data?.status === "success") {
                alert("Signup successful");
                navigate("/");
                sessionStorage.clear();
                return;
              }
              alert("something went wrong , please try again");
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
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
                  : frames.setPasswordFields
                  ? "Set Password"
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
                  : frames.setPasswordFields
                  ? "Set Password"
                  : "Profile Details"}
              </h1>

              {currentStep > 1 && !frames.signupSuccessful && (
                <NumericSteppers
                  totalSteps={
                    customFields.length === 0
                      ? 2 + isAddedByAdmin
                      : 3 + isAddedByAdmin
                  }
                  currentStep={currentStep}
                  customFieldsPresents={true}
                />
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
                      placeholder=""
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
                      placeholder=""
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
                      placeholder=""
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
                      placeholder=""
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
                      onClick={() => {
                        setValues((prev) => ({
                          ...prev,
                          role: "parent",
                        }));
                      }}
                    >
                      <img
                        src={
                          values.role === "parent"
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
                      onClick={() => {
                        setValues((prev) => ({
                          ...prev,
                          role: "student",
                        }));
                      }}
                    >
                      <img
                        src={
                          values.role === "student"
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
                  {...valueProps}
                  customFields={customFields}
                  {...otherDetailsProps}
                  handleSignup={handleSignup}
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
