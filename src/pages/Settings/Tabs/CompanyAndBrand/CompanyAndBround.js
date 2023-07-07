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
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Country, State } from "country-state-city";
import UploadIcon from "../../../../assets/icons/upload-colored.svg";
import styles from "./styles.module.css";
import axios from "axios";
import { useRef } from "react";
import { BASE_URL, getAuthHeader } from "../../../../app/constants/constants";
const CompanyAndBround = () => {
  const { organization } = useSelector((state) => state.organization);

  const [studentServed, setStudentServed] = useState(studentServedData);
  const [instructions, setInstructions] = useState(instructionFormat);
  const inpuRef = useRef();
  const [values, setValues] = useState({ api: "hii" });
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subscriptionCode: "",
    company: "",
  });

  const handleCheckboxChange = (text, arr, setBoxValue) => {
    console.log(arr);
    const temp = arr.map((topic) => {
      return topic.text === text
        ? { ...topic, checked: !topic.checked }
        : { ...topic };
    });
    setBoxValue(temp);
  };

  const updateUserAccount = async () => {
    try {
      //   alert(data.workemail)
      let result = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}api/user/update/org`,
        values,
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: sessionStorage.getItem("token"),
          },
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // setValues(organization);
    console.log("updated", values);
    updateUserAccount();
  }, [values]);

  useEffect(() => {
    setValues(organization);
    let arr = instructions;
    organization?.formatOfInstruction?.forEach((element) => {
      arr = arr.map((topic) => {
        return topic.text === element
          ? { ...topic, checked: true }
          : { ...topic };
      });

      // handleCheckboxChange(element,instructions,setInstructions)
    });

    setInstructions(arr);
    arr = studentServed;
    organization?.studentServed?.forEach((element) => {
      arr = arr.map((topic) => {
        return topic.text === element
          ? { ...topic, checked: true }
          : { ...topic };
      });

      // handleCheckboxChange(element,instructions,setInstructions)
    });

    setStudentServed(arr);
  }, [organization]);

  const [countryCode, setCountryCode] = useState("ac");

  useEffect(() => {
    Country.getAllCountries().forEach((country) => {
      if (country.name == values.country) {
        setCountryCode(country.isoCode);
        return;
      }
    });
  }, [values.country]);
 console.log('organization', organization);

  const handleLogoChange = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append('photos', file)
    console.log(file);
    await axios
      .patch(`${BASE_URL}api/user/org/addOrgLogos/${organization._id}`, formData, {
        headers: getAuthHeader(),
      })
      .then((res) => {
        if (res.error) {
          console.log("logo err", res.error);
        }
        console.log("logo res", res.data);
        window.location.reload()
        alert("PDF UPLOADED");
      })
  };
  return (
    <div>
      <div className="flex flex-col gap-10 w-[900px] ">
        <div className="flex gap-5">
          <InputField
            placeholder=""
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
            label="Account Type"
            value={values.accountType}
            onChange={(e) =>
              setValues({
                ...values,
                accountType: e.target.value,
              })
            }
            error={error.accountType}
          />

          <InputField
            placeholder=""
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
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
            placeholder=""
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
            label="Support Email"
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
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
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
            <label className="inline-block text-sm font-semibold undefined ml-0"> Business Logo </label>
            <div className="w-[312px] h-[250px] relative p-10">
              <img src={organization.orgBussinessLogo ? organization.orgBussinessLogo : orgDefaultLogo} className="w-full h-full object-contain" />
              <div className={styles["upload-container"]} onClick={()=>inpuRef.current.click()} >
                <p className="text-[#24A3D9] text-xs"> Upload </p>
                <img src={UploadIcon} />
                <input className="hidden" type="file" ref={inpuRef} onChange={handleLogoChange} />
              </div>
            </div>
          </div>
          <div className="flex flex-col  gap-2 flex-1 py-auto">
            <div className="flex gap-5 items-center justify-between">
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-full"
                inputContainerClassName=" bg-white "
                inputClassName="bg-transparent"
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
                parentClassName="text-xs text-[#26435F] w-[60%]"
                inputContainerClassName=" bg-white"
                labelClassname="text-sm"
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
            <div className="flex gap-5 items-center justify-between">
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-full"
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
                parentClassName="text-xs text-[#26435F] w-[60%]"
                inputContainerClassName=" bg-white"
                labelClassname="text-sm"
                inputClassName="bg-transparent"
                label="Country"
                value={values.country}
                optionData={Country.getAllCountries()}
                optionType={"object"}
                onChange={(e) =>
                  setValues({
                    ...values,
                    country: e,
                  })
                }
                error={error.country}
              />
            </div>
            <div className="flex gap-5 items-center justify-between">
              <InputSelect
                placeholder="Select"
                parentClassName="text-xs text-[#26435F] w-full"
                labelClassname="text-sm"
                inputContainerClassName=" bg-white"
                inputClassName="bg-transparent"
                label="State / Region "
                value={values.state}
                optionData={State.getAllStates()}
                optionType={"object"}
                onChange={(e) =>
                  setValues({
                    ...values,
                    state: e,
                  })
                }
                error={error.state}
              />
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-full"
                inputContainerClassName=" bg-white "
                inputClassName="bg-transparent"
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
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-full"
                inputContainerClassName=" bg-white "
                inputClassName="bg-transparent"
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
        <div className="flex gap-5 mt-3 border-b-[2px] border-b-[#CBD6E2] pb-5">
          <div className="flex flex-col rounded-sm w-[200px] flex-wrap gap-3 bg-white p-3">
            <h1 className="mt-[-35px]  text-[#26435F] font-semibold text-sm">
              Format Of Instructions
            </h1>
            {instructions.map((item, id) => (
              <CheckboxNew
                item={item}
                key={id}
                boxData={instructions}
                setBoxData={setInstructions}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
          </div>
          <div className="flex flex-col rounded-sm w-[500px] h-[200px] flex-wrap gap-3 p-3 bg-white">
            <h1 className="mt-[-35px]  text-[#26435F] font-semibold text-sm">
              Students Served
            </h1>
            {studentServed.map((item, id) => (
              <CheckboxNew
                item={item}
                key={id}
                boxData={studentServed}
                setBoxData={setStudentServed}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
          </div>
        </div>
        <div className="">
          <h1 className="mt-[-30px] text-[#26435F] font-semibold text-sm my-3">
            Signup Form Details
          </h1>
          <div className="w-full h-[200px] bg-white"></div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAndBround;
