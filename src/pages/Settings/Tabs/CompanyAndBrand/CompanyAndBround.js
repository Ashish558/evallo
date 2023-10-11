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
import axios from "axios";
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
        .then((res) => {
          if(res?.data){
            alert("Updated successfully!")
          }
          else if(res?.error) {
            alert("Updated successfully!")
          }
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

    
  }, [values]);
  const checkEmpty=()=>{
    const fields=["company","country","state","city","address","zip",]
    let f=true;
    fields.forEach(key=>{
      if(f&&(!values[key]||values[key].trim()==="")){
        f=false;
        setError((prev)=>({
          ...prev,
          [key]: key + " field cannot be empty!",
        }));
      return
      }
    })
    return f;
   
  }
const handleSave=async ()=>{
  setError({})
  console.log("save called")
  if(!checkEmpty())
  return
  if(organization?.company!==values?.company){
    
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
      console.log("save",{result})
      updateUserAccount()
     
      
      
    } catch (e) {
     
      setError({
        ...error,
        company: e.response.data.message,
      });
    }
  }
  else {
  updateUserAccount();
  }
}
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
    formData.append("photos", null);
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
    <div className="flex justify-between">
      <div className="flex flex-col gap-10  w-[68.9vw] design:w-[68vw]">
        <div className="flex justify-between gap-5 flex-1 w-full items-center">
          <InputField
            placeholder="Company/Individual"
            IconLeft={lock}
            parentClassName=" w-[16.25vw] text-[#26435F]"
            inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white h-[50px]"
            inputClassName="text-base-17-5 bg-transparent placeholder:text-[#B3BDC7]"
            labelClassname=" text-base-17-5 !font-medium "
            label="Account Type"
            disabled={true}
            value={"Company"}
            error={error.accountType}
            totalErrors={error}
          />
          <InputField
            placeholder="Your business identity"
            parentClassName=" w-[14.27vw] text-[#26435F] "
            inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white  h-[50px]"
            inputClassName="text-base-17-5 bg-transparent placeholder:text-[#B3BDC7]"
            labelClassname="mb-[2.5px] text-base-17-5 !font-medium"
            label="Company Name"
            value={values.company}
            onChange={(e) =>
              setValues({
                ...values,
                company: e.target.value,
              })
            }
            error={error.company}
            totalErrors={error}
          />
          <InputField
            placeholder="Support email for your clients"
            parentClassName=" w-[14.27vw] text-[#26435F]"
            inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white  h-[50px]"
            inputClassName="text-base-17-5 bg-transparent placeholder:!text-[#B3BDC7]"
            labelClassname="mb-[2.5px] text-base-17-5 !font-medium flex justify-between"
            label="Support Email"
            value={values.supportEmail}
            onChange={(e) =>
              setValues({
                ...values,
                supportEmail: e.target.value,
              })
            }
            totalErrors={error}
            error={error.supportEmail}
          />
          <InputField
            placeholder="What is your title at work?"
            parentClassName=" w-[14.27vw] text-[#26435F]"
            inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white h-[50px]"
            inputClassName="bg-transparent placeholder:text-[#B3BDC7] text-base-17-5"
            labelClassname={" text-base-17-5 !font-medium"}
            label="Role / Position"
            disabled={true}
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

        <div className="flex gap-5 justify-between flex-1">
          <div className="">
            <label className="inline-block text-[15px] font-medium undefined ml-0 text-[#26435F] text-base-17-5">
              {" "}
              Business Logo{" "}
            </label>
            <div id="borderDashed" className="w-[312px] h-[200px]  relative p-2 bg-[#FFFFFF] rounded-[5px]">
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
                  <p className="text-[#FFFFFF] text-[15px] bg-[#517CA8] rounded-[5px] pt-3 mt-[12.5px] pb-2 px-4 cursor-pointer" onClick={() => inpuRef.current.click()}>Choose file</p>
                  <p className="text-[#517CA8] text-[12.5px] mt-[12.5px] text-center font-light">Less then 1 MB</p>
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
            <div className="flex  items-center justify-between ">
              <InputField
                placeholder="https://yourwebsite.com"
                parentClassName=" text-[#26435F] w-[30.57vw] "
                inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white  rounded-[5px] h-[50px]"
                inputClassName="text-base-17-5 bg-transparent placeholder:!text-[#B3BDC7]"
                labelClassname="text-base-17-5 !font-medium "
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
                parentClassName="text-[#26435F] w-[14.27vw]"
                inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white h-[50px]"
                labelClassname="text-base-17-5 !font-medium "
                inputClassName="text-base-17-5 bg-transparent placeholder:!text-[#B3BDC7] "
                placeholderClass="!mr-0 !whitespace-normal "
                label="Company Type"
                value={values?.companyType?.length < 26 ? values.companyType : values.companyType?.slice(0, 25) + "..."}
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
            <div className="flex items-center justify-between mt-6">
              <InputField
                placeholder="Enter your street address"
                parentClassName=" text-[#26435F] w-[30.57vw] "
                inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white  rounded-[5px] h-[50px]"
                inputClassName="text-base-17-5 bg-transparent placeholder:!text-[#B3BDC7]"
                labelClassname="text-base-17-5 !font-medium "
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
                parentClassName="text-[#26435F] w-[14.27vw]"
                inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white h-[50px]"
                labelClassname="text-base-17-5 !font-medium "
                inputClassName="text-base-17-5 bg-transparent placeholder:!text-[#B3BDC7] "
                placeholderClass="!mr-0 !whitespace-normal "
                label="Country"
                value={values.country}
                optionData={country}
                optionType={"object"}
                totalErrors={error}
                onChange={(e) => {

                  handleState(e);
                }}
                error={error.country}
              />

            </div>
            <div className="flex justify-between mt-6 items-center">
              <div className="flex gap-7 items-center">
                <InputSelect
                  placeholder="Select"
                  parentClassName="text-[#26435F] w-[14.27vw]"
                  inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white h-[50px]"
                  labelClassname="text-base-17-5 !font-medium "
                  inputClassName="text-base-17-5 bg-transparent placeholder:!text-[#B3BDC7] "
                  placeholderClass="!mr-0 !whitespace-normal "
                  label="State / Region "
                  value={values?.state?.length < 20 ? values.state : values.state?.slice(0, 20) + "..."}
                  optionData={states}
                  optionType={"object"}
                  totalErrors={error}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      state: e.name,
                    })
                  }
                  error={error.state}
                />
                <InputField
                  placeholder="Text"
                  parentClassName="text-[#26435F] w-[14.27vw]"
                  inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white h-[50px]"
                  labelClassname="text-base-17-5 !font-medium "
                  inputClassName="text-base-17-5 bg-transparent placeholder:!text-[#B3BDC7] "
                  label="City"
                  totalErrors={error}
                  value={values.city}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      city: e.target.value,
                    })
                  }
                  error={error.city}
                />
              </div>
              <div className="col-span-3">
                <InputField
                  placeholder="Numeric"
                  parentClassName="text-[#26435F] w-[14.27vw]"
                  inputContainerClassName=" shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-white h-[50px]"
                  inputClassName="text-base-17-5 bg-transparent placeholder:!text-[#B3BDC7] "
                  labelClassname="text-base-17-5 !font-medium "
                  label="Zip Code"
                  value={values.zip}
                   totalErrors={error}
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
        <div className="flex flex-1  gap-8 my-3 mb-10 ml-[335px] w-[calc(900*0.0522vw)] min-w-[500px] pb-0">
          <div className="flex flex-col rounded-md shadow-[0px_0px_2.500000476837158px_0px_#00000040]  w-[calc(275*0.0522vw)] min-w-[170px] flex-wrap gap-3 bg-white p-3">
            <h1 className="mt-[-35px]  text-[#26435F] font-medium text-base-17-5 ml-[-10px] mb-1 text-base-17-5 ">
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
          <div className="flex flex-col rounded-md shadow-[0px_0px_2.500000476837158px_0px_#00000040] w-[calc(593*0.0522vw)]  min-w-[370px]  h-[200px] flex-wrap gap-3 p-3 bg-white">
            <h1 className="mt-[-35px]  text-[#26435F] font-medium text-base-17-5 ml-[-10px] mb-1 text-base-17-5">
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

      </div>
      <div>
            <PrimaryButton
              onClick={handleSave}
              

              className={`bg-[#FFA28D]   mt-[25px] ml-10 rounded-md px-[50px] py-[15px] text-sm text-base-20 text-white  `}

            >
              Save
            </PrimaryButton>
          </div>
    </div>
  );
};

export default CompanyAndBround;
