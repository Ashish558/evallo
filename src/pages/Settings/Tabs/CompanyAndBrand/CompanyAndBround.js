import React from "react";
import InputField from "../../../../components/InputField/inputField";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import { CheckboxNew } from "../../../../components/Checkbox/CheckboxNew";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import {
  studentServedData,
  instructionFormat,
  companyType,
} from "../staticData";
import logo from "../../../../assets/icons/Frame 31070.svg";
import orgDefaultLogo from "../../../../assets/images/org-default.png";
import lock from "../../../../assets/icons/lock.svg";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Country } from "country-state-city";
import UploadIcon from "../../../../assets/icons/basil_file-upload-outline.svg";
import styles from "./styles.module.css";

import { useRef } from "react";

import { useUpdateUserMutation } from "../../../../app/services/users";
import {
  useUpdateOrgLogoMutation,
  useUpdateUserOrganizationMutation,
} from "../../../../app/services/organization";
import { object } from "prop-types";
const CompanyAndBround = () => {
  const { organization } = useSelector((state) => state.organization);
  const userData = useSelector((state) => state.user);
  const [updateRole, updateRoleStatus] = useUpdateUserMutation();
  const [updateUserOrg, updateUserOrgStatus] =
    useUpdateUserOrganizationMutation();
  const [updateOrgLogo, updateOrgLogoStatus] = useUpdateOrgLogoMutation();

  const [studentServed, setStudentServed] = useState(studentServedData);
  const [instructions, setInstructions] = useState(instructionFormat);
  const inpuRef = useRef();
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [values, setValues] = useState({ role: userData.role });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subscriptionCode: "",
    company: "",
  });

  const handleState = (c) => {
    if (!c) return;
    console.log("country", c);
    if (typeof c === "object")
      c = c.name
    const state = country.filter((x) => x.name === c);
    const currentState = state.map((s) => s.states);

    setStates([...currentState[0]]);

    setValues({
      ...values,
      country: c,
      state: "",
    });
  };
  const countryData = Country.getAllCountries().map((city) => ({
    value: city.name,
    displayValue: city.name,
  }));
  const handleCheckboxChange = (text, arr, setBoxValue, name) => {
    const temp = arr.map((topic) => {
      return topic.text === text
        ? { ...topic, checked: !topic.checked }
        : { ...topic };
    });
    let nameData = [];
    temp.map((topic) => {
      if (topic.checked) nameData.push(topic.text);
    });
    setValues({
      ...values,
      [name]: nameData,
    });
    setBoxValue(temp);
  };

  const updateUserAccount = async () => {
    try {
      updateUserOrg(values)
        .then(() => {
          console.log("org updated", values);
        })
        .catch((err) => {
          console.log(err);
        });
      updateRole({ userId: userData.id, ...userData, role: values.role }).then(
        () => {
          console.log("role changed");
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (country.length === 0) {
      fetch("countryData.json")
        .then((res) => res.json())
        .then((data) => setCountry(data));
    }
    const c = values.country;
    if (c) {
      const state = country.filter((x) => x.name === c);
      const currentState = state.map((s) => s.states);
      if (currentState.length > 0) setStates([...currentState[0]]);
    }
    updateUserAccount();
  }, [values]);

  useEffect(() => {
    setValues({ ...organization, ...values });

    let arr = instructions;
    organization?.formatOfInstruction?.forEach((element) => {
      arr = arr.map((topic) => {
        return topic.text === element
          ? { ...topic, checked: true }
          : { ...topic };
      });
    });

    setInstructions(arr);
    arr = studentServed;
    organization?.studentServed?.forEach((element) => {
      arr = arr.map((topic) => {
        return topic.text === element
          ? { ...topic, checked: true }
          : { ...topic };
      });
    });

    setStudentServed(arr);
  }, [organization]);

  const handleLogoChange = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("photos", file);
    formData.append("updatefieldName", "orgBussinessLogo");

    updateOrgLogo({ formData: formData, id: organization._id }).then((res) => {
      if (res.error) {
        console.log("logo err", res.error);
        return;
      }
      console.log("logo res", res.data);
      window.location.reload();
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-10  w-[68vw]">
        <div className="flex justify-between">
          <InputField
            placeholder=""
            IconLeft={lock}
            parentClassName="text-xs w-[14.3229vw] text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
            label="Account Type"
            disabled={true}
            value={"Company"}
            error={error.accountType}
          />
          <InputField
            placeholder=""
            parentClassName="text-xs w-[14.3229vw] text-[#26435F] "
            inputContainerClassName=" bg-white mt-[-2px]"
            inputClassName="text-base-17-5 bg-transparent"
            labelClassname="text-base-17-5 text-sm font-bold mb-1"
            label="Company Name"
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
            placeholder="Text"
            parentClassName="text-xs w-[14.3229vw] text-[#26435F]"
            inputContainerClassName=" bg-white mt-[-2px]"
            inputClassName="text-base-17-5 bg-transparent"
            labelClassname="text-base-17-5 text-sm font-bold mb-1"
            label="Support Email"
            value={values.supportEmail}
            onChange={(e) =>
              setValues({
                ...values,
                supportEmail: e.target.value,
              })
            }
            error={error.supportEmail}
          />
          <InputField
            placeholder=""
            parentClassName="text-xs w-[14.3229vw] text-[#26435F] "
            inputContainerClassName=" bg-white mt-[2px]"
            inputClassName="bg-transparent"
            label="Role / Position"
            value={values.role}
            onChange={(e) =>
              setValues({
                ...values,
                role: e.target.value,
              })
            }
            error={error.role}
          />
        </div>

        <div className="flex gap-5 flex-1">
          <div className="">
            <label className="inline-block text-[15px] font-semibold undefined ml-0 text-[#26435F] text-base-17-5">
              {" "}
              Business Logo{" "}
            </label>
            <div className="w-[312px] h-[200px]  relative p-2 bg-[#FFFFFF] rounded-[5px]">
              {
                organization.orgBussinessLogo &&
                <img
                  src={organization.orgBussinessLogo}
                  className="w-full h-full object-contain"
                  alt="orgDefaultLogo"
                />
              }
              <div
                className={`${styles["upload-container"]} ${!organization.orgBussinessLogo ? styles['upload-container-centered'] : ''} `}

              >

                <div className="flex flex-col ">
                  <p className="block mx-auto mt-[-25px]">
                    <img src={UploadIcon} alt="logo" /></p>
                  <p className="text-[#FFFFFF] text-sm bg-[#517CA8] rounded-[5px] pt-3 mt-5 pb-2 px-4 cursor-pointer" onClick={() => inpuRef.current.click()}>Choose file</p>
                  <p className="text-[#517CA8] text-xs mt-5 text-center">Less then 1 MB</p>
                </div>
                <input
                  className="hidden"
                  type="file"
                  ref={inpuRef}
                  onChange={handleLogoChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col  gap-4 flex-1 py-auto">
            <div className="flex  items-center justify-between">
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-[30.5729vw] "
                inputContainerClassName=" bg-white  rounded-md"
                inputClassName="text-base-17-5 bg-transparent "
                labelClassname="text-base-17-5 text-sm font-bold "
                label="Website"
                value={values.website}
                onChange={(e) =>
                  setValues({
                    ...values,
                    website: e.target.value,
                  })
                }
                error={error.website}
              />
              <InputSelect
                placeholder="Select"
                parentClassName="text-xs text-[#26435F] min-w-[14.3229vw] "
                inputContainerClassName=" bg-white h-[42px] "
                labelClassname="text-sm font-bold"
                inputClassName="bg-transparent"
                label="Company Type"
                value={values.companyType}
                optionData={companyType}
                onChange={(e) =>
                  setValues({
                    ...values,
                    companyType: e,
                  })
                }
                error={error.companyType}
              />
            </div>
            <div className="flex justify-between">
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-[30.5729vw]"
                inputContainerClassName=" bg-white "
                inputClassName="bg-transparent"
                label="Street Address"
                value={values.address}
                onChange={(e) =>
                  setValues({
                    ...values,
                    address: e.target.value,
                  })
                }
                error={error.address}
              />

              <InputSelect
                placeholder="Select"
                parentClassName="text-xs text-[#26435F] min-w-[14.3229vw] "
                inputContainerClassName=" bg-white h-[38px]  h-[42px]"
                labelClassname="text-sm font-bold"
                inputClassName="bg-transparent"
                label="Country"
                value={values.country}
                optionData={country}
                optionType={"object"}
                onChange={(e) => {

                  handleState(e);
                }}
                error={error.country}
              />

            </div>
            <div className="flex justify-between">
              <InputSelect
                placeholder="Select"
                parentClassName="text-xs text-[#26435F] min-w-[14.3229vw]  pt-1"
                labelClassname="text-sm font-bold "
                inputContainerClassName=" bg-white h-[42px] "
                inputClassName="bg-transparent"
                label="State / Region "
                value={values.state}
                optionData={states}
                optionType={"object"}
                onChange={(e) =>
                  setValues({
                    ...values,
                    state: e.name,
                  })
                }
                error={error.state}
              />
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-[14.3229vw] pt-1"
                inputContainerClassName=" bg-white"
                inputClassName="text-base-17-5 bg-transparent "
                label="City"
                value={values.city}
                onChange={(e) =>
                  setValues({
                    ...values,
                    city: e.target.value,
                  })
                }
                error={error.city}
              />
              <div className="col-span-3">
                <InputField
                  placeholder=""
                  parentClassName="text-xs text-[#26435F] w-[14.3229vw] pt-1"
                  inputContainerClassName=" bg-white "
                  inputClassName="text-base-17-5 bg-transparent"

                  label="Zip Code"
                  value={values.zip}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      zip: e.target.value,
                    })
                  }
                  error={error.zip}
                />
              </div>
            </div>

          </div>
        </div>
        <div className="flex gap-11 mt-3 border-b-[2px] border-b-[#CBD6E2] pb-9">
          <div className="flex flex-col rounded-sm w-[200px] flex-wrap gap-3 bg-white p-3">
            <h1 className="mt-[-35px]  text-[#26435F] font-semibold text-sm ml-[-10px] mb-1">
              Format Of Instructions
            </h1>
            {instructions.map((item, id) => (
              <CheckboxNew
                item={item}
                key={id}
                boxData={instructions}
                setBoxData={setInstructions}
                Dname={"formatOfInstruction"}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
          </div>
          <div className="flex flex-col rounded-sm w-2/3 min-w-[500px] design:min-w-[600px] h-[200px] flex-wrap gap-3 p-3 bg-white">
            <h1 className="mt-[-35px]  text-[#26435F] font-semibold text-sm ml-[-10px] mb-1 text-base-17-5">
              Students Served
            </h1>
            {studentServed.map((item, id) => (
              <CheckboxNew
                item={item}
                key={id}
                boxData={studentServed}
                Dname={"studentServed"}
                setBoxData={setStudentServed}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
          </div>
        </div>
        {/* <div className="w-full h-[2px] bg-[#CBD6E2]"></div> */}
        <div className="my-4 mb-10 ">
          <h1 className="mt-[-30px] text-[#26435F] font-semibold text-xl my-1 text-base-17-5">
            Signup Form Detail
          </h1>
          <div className="w-full h-[200px] bg-white"></div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAndBround;
