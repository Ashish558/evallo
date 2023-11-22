import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.css";
import InputField from "../../../../components/InputField/inputField";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import CCheckbox from "../../../../components/CCheckbox/CCheckbox";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import CheckboxIcon from "../../../../assets/icons/square.svg";
import DeletIcon from "../../../../assets/Settings/delete.svg";
import que from "../../../../assets/icons/que.png";
import que2 from "../../../../assets/icons/que2.svg";
import plus1 from "../../../../assets/icons/plus1.svg";
import dropdown from "../../../../assets/icons/dropdown (2).svg";
import InputFieldDropdown from "../../../../components/InputField/inputFieldDropdown";
import ToggleBar from "../../../../components/SettingsCard/ToogleBar";
import AddTag from "../../../../components/Buttons/AddTag";
import Loader from "../../../../components/Loader";
import LoaderNew from "../../../../components/Loader/LoaderNew";
export default function SignupTab({
  setAddNewQuestionModalActive,
  fetchS,
  updateAndFetchsettings,
}) {
  const { organization } = useSelector((state) => state.organization);

  const [customFields, setCustomFields] = useState();
  const [fetchedPermissions, setThePermission] = useState([]);
  useEffect(() => {
    setCustomFields(organization?.settings?.customFields);
    setThePermission(customFields);
  }, [organization]);
  useEffect(() => {
    if (fetchS && fetchS.data && fetchS?.data?.updatedOrg?.settings) {
      console.log({ fetchS });
      setCustomFields(fetchS.data.updatedOrg.settings.customFields);
    }
  }, [fetchS]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(false);
  const [isCheckedThree, setIsCheckedThree] = useState(false);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [checkTerms, setCheckTerms] = useState();
  const handleCheckboxChangeTerms = () => {
    setCheckTerms(!checkTerms);
  };
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleCheckboxChangeTwo = () => {
    setIsCheckedTwo(!isCheckedTwo);
  };
  const handleCheckboxChangeThree = () => {
    setIsCheckedThree(!isCheckedThree);
  };

  const handleDelete = (id) => {
    let updatedCustomFields = customFields.filter((item) => item._id !== id);
    updatedCustomFields = updatedCustomFields.map((item) => ({
      name: item.name,
      Values: item.Values,
      dataType: item.dataType,
    }));
    const body = {
      customFields: updatedCustomFields,
    };
    updateAndFetchsettings(body, setLoadingCustom);
  };

  const handleCustomFieldType = (id, val) => {
    console.log({ id, val });

    let updatedCustomFields = customFields?.map((it) => {
      if (it._id === id) {
        return {
          ...it,
          dataType: val,
          Values: [],
        };
      }
      return it;
    });

    updatedCustomFields = updatedCustomFields.map((item) => ({
      name: item.name,
      Values: item.Values,
      dataType: item.dataType,
    }));
    const body = {
      customFields: updatedCustomFields,
    };
    updateAndFetchsettings(body, setLoadingCustom);
  };
  const handleRequired = (id) => {
    console.log({ id });

    let updatedCustomFields = customFields?.map((it) => {
      if (it._id === id) {
        return {
          ...it,
          required: !it?.required,
        };
      }
      return it;
    });

    // updatedCustomFields = updatedCustomFields.map((item) => ({
    //   item,
    // }));
    const body = {
      customFields: updatedCustomFields,
    };
    updateAndFetchsettings(body, setLoadingCustom);
  };
  const togglePermissions = (key, value) => {
    // let updatedCustomFields = customFields.filter((item) => item._id == key);
    // let notUpdatedCustomFields = customFields.filter((item) => item._id !== key);
    // console.log(updatedCustomFields)
    // updatedCustomFields = updatedCustomFields.map((item) => ({
    //   name: item.name,
    //   Values: item.Values,
    //   dataType: item.dataType,
    //   required: !(item.required)
    // }));
    // console.log(updatedCustomFields)
    // console.log(notUpdatedCustomFields)
    // const body = {
    //   customFields: [...updatedCustomFields, ...notUpdatedCustomFields]
    // };
    const targetIndex = customFields.findIndex((obj) => obj._id === key);
    console.log(customFields[targetIndex].required, "dfdfh");
    if (targetIndex !== -1) {
      const updatedObject = {
        ...customFields[targetIndex],
        required: !customFields[targetIndex].required,
      };
      console.log(updatedObject, "updatedObject");
      const newArray = [...customFields];
      newArray[targetIndex] = updatedObject;
      console.log(newArray, "new array");
      const body = {
        customFields: newArray,
      };
      updateAndFetchsettings(body);
    } else {
      console.log("Object not found with ID:", key);
    }

    // const arr = fetchedPermissions?.map((per) => {
    //   if (per._id === key) {
    //     return { ...per, required: !per.required
    //     };
    //   }
    //   return { ...per };
    // });
    // setThePermission(arr)

    // let updatedSetting = {
    //   permissions: arr,
    // };
    // updateAndFetchsettings(updatedSetting);
  };
  const [inputValue, setInputValue] = useState("");
  const [addOption, SetAddOption] = useState(false);
  const [questionSelected, setQuestionSelected] = useState(null);
  const handleAddOption = (e) => {
    console.log(e.target.value);
    setInputValue(e.target.value);
  };
  const handleKeyPress = (event, item) => {
    if (event.key === "Enter") {
      let updatedCustomFields = customFields?.map((it) => {
        if (it._id === item._id) {
          return {
            name: item.name,
            Values: [...item.Values, inputValue],
            dataType: item.dataType,
          };
        }
        return it;
      });

      updatedCustomFields = updatedCustomFields.map((item) => ({
        name: item.name,
        Values: item.Values,
        dataType: item.dataType,
      }));

      const body = {
        customFields: updatedCustomFields,
      };
      updateAndFetchsettings(body, setLoadingCustom);
      // console.log(event)
      SetAddOption(false);
      // console.log('Input value:', inputValue);
      setInputValue("");
    }
  };
  const handleNameAddKeyDown = (event) => {
    if (event.key === "Enter") {
      let updatedCustomFields = customFields;
      updatedCustomFields = updatedCustomFields.map((item) => ({
        name: item.name,
        Values: item.Values,
        dataType: item.dataType,
      }));

      const body = {
        customFields: updatedCustomFields,
      };
      updateAndFetchsettings(body, setLoadingCustom);
      // console.log(event)
      SetAddOption(false);
      // console.log('Input value:', inputValue);
      setInputValue("");
      setQuestionSelected(null);
    }
  };
  console.log({ customFields });
  return (
    <div className="">
      <div className="mb-[40px]">
        <div className="text-base-17-5 flex items-start w-300 text-[#507CA8] mb-4">
          <p className="mt-[3px]">
            <img src={que} alt="que"></img>
          </p>
          <p className="pl-2">
            Please enter the fields for the sign up form that you want to show
            your clients. You are allowed to create up to 5 additional custom
            questions beyond the mandatory fields that we require from parents
            and students.
          </p>
        </div>
        <div className="text-base-17-5 flex items-start w-300 text-[#507CA8]">
          <p className="mt-[3px]">
            <img width="14px" src={que} alt="que"></img>
          </p>
          <p className="pl-2">
            Link to the Sign-up form for Org Name:{" "}
            <a
              rel="noreferrer"
              className="underline text-[#26435F]"
              href={`${process.env.REACT_APP_FE_URL}/signup/user?orgName=${organization.company}`}
              target={"_blank"}
            >
              {" "}
              {`${process.env.REACT_APP_FE_URL}/signup/user?orgName=${organization.company}`}
            </a>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-5">
        <div className={styles.colContainer}>
          <div
            className={`hidden lg:flex mb-[24px] items-center justify-between text-[#26435F] font-semibold text-base-20 text-base-20`}
          >
            <p className="whitespace-nowrap ">
              {" "}
              Page 1: Basic Details (all fields mandatory)
            </p>

            <p className="ml-6">
              {" "}
              <img src={que2} alt="que"></img>
            </p>
          </div>
          <div className={`flex mt-[55px] lg:mt-0 ${styles.inputs}`}>
            <InputField
              placeholder=""
              inputContainerClassName="bg-gray-200 border border-gray-200"
              inputClassName="bg-gray-200"
              parentClassName="text-xs text-[#26435F] mb-2"
              label="First Name"
            />
            <InputField
              placeholder=""
              inputContainerClassName="bg-gray-200 border border-gray-200"
              inputClassName="bg-gray-200"
              parentClassName="text-xs text-[#26435F] mb-2"
              label="Last Name"
            />
            <InputField
              label="Email"
              inputContainerClassName="bg-gray-200 border border-gray-200 w-[32.6vw]"
              inputClassName="bg-gray-200"
              placeholder=""
              parentClassName="text-xs  text-[#26435F] mb-2"
            />
            <div className="flex gap-1 items-center">
              <div className="bg-gray-200 border translate-y-[6px] p-2 rounded-[3.5px] border-gray-200 h-[50px] text-[#667085] text-xs px-3 flex items-center">
                +91
              </div>
              <InputField
                placeholder=""
                parentClassName="text-xs  text-[#26435F] mb-2 "
                inputContainerClassName="bg-gray-200 border border-gray-200 w-[275px] h-[50px]"
                inputClassName="bg-gray-200 "
                label=" Phone"
                labelClassname={"translate-x-[-50px]"}
              />
            </div>
          </div>
          <div>
            <p className={`mb-5 ${styles.label} text-base-17-5 mt-[42px]`}>
              Are you signing up as a Parent or a Student?
            </p>
            <div className="flex items-center gap-x-6">
              <p
                onClick={() => setIsChecked(true)}
                className={styles.textLight}
              >
                <div className={`${styles["checkbox-label"]} block  `}>
                  <input
                    type="radio"
                    className="form-radio hidden"
                    id="radioOption"
                  />
                  <label
                    htmlFor="radioOption"
                    className={`relative w-4 h-4 mx-1 rounded-full border ${
                      isChecked ? "border-[#FFA28D]" : "border-gray-600"
                    } cursor-pointer`}
                  >
                    {isChecked && (
                      <div className="absolute inset-0 my-auto mx-auto w-[9px] h-[9px] rounded-full bg-[#FFA28D]" />
                    )}{" "}
                  </label>

                  <span className="ml-2 text-[#507CA8] text-base-17-5">
                    Parent / Guardian
                  </span>
                </div>
              </p>
              <p
                onClick={() => setIsChecked(false)}
                className={styles.textLight}
              >
                <div className={`${styles["checkbox-label"]} block  `}>
                  <input
                    type="radio"
                    className="form-radio hidden"
                    id="radioOption"
                  />
                  <label
                    className={`relative w-4 h-4  mx-1 rounded-full border ${
                      !isChecked ? "border-[#FFA28D]" : "border-gray-600"
                    } cursor-pointer`}
                  >
                    {!isChecked && (
                      <div className="absolute inset-0 my-auto mx-auto w-[9px] h-[9px] rounded-full bg-[#FFA28D]" />
                    )}{" "}
                  </label>

                  <span className="ml-2 text-[#507CA8] text-base-17-5">
                    Student
                  </span>
                </div>
              </p>
            </div>
          </div>
          <div className=" gap-x-2 my-5">
            <p className={styles.textLight}>
              <label className={`${styles["checkbox-label"]} block  `}>
                <input
                  type="checkbox"
                  checked={isCheckedThree}
                  onChange={handleCheckboxChangeThree}
                />
                <span
                  className={`${styles["custom-checkbox"]} ${
                    isChecked ? "checked" : ""
                  }`}
                ></span>
                <span className="ml-2 text-[#507CA8] text-base-17-5">
                  I confirm that I am 13 years or older
                </span>
              </label>
            </p>
          </div>
          <div className=" gap-x-2 my-5">
            <p className={styles.textLight}>
              <label className={`${styles["checkbox-label"]} block  `}>
                <input
                  type="checkbox"
                  checked={checkTerms}
                  onChange={handleCheckboxChangeTerms}
                />
                <span
                  className={`${styles["custom-checkbox"]} ${
                    isChecked ? "checked" : ""
                  }`}
                ></span>
                <p className={` ml-2 text-[#507CA8] text-base-17-5`}>
                  I have carefully read and agree to the{" "}
                  <span className="font-semibold text-[#26435F]">
                    Terms of Use and Privacy Policy
                  </span>
                </p>
              </label>
            </p>
          </div>
        </div>
        <div className="border border-[#dcdcdc] rounded-lg">
          <div
            className={`hidden lg:flex mb-[26px] items-center justify-between text-[#26435F] font-semibold text-base-20 pt-5`}
          >
            <p className=" pl-5 ">
              Page 2: Associated Student / Parent Details (all fields mandatory)
            </p>

            <p className="mr-2">
              {" "}
              <img src={que2} alt="que"></img>
            </p>
          </div>
          <div
            className={`flex mt-[59px]  lg:mt-0 ${styles.inputs}  pr-[70px] pl-5 pb-5`}
          >
            <InputField
              placeholder=""
              parentClassName="text-xs  text-[#26435F] mb-2"
              inputContainerClassName="bg-gray-200 border border-gray-200 "
              inputClassName="bg-gray-200"
              label="Student / Parent First Name"
            />
            <InputField
              placeholder=""
              parentClassName="text-xs  text-[#26435F] mb-2"
              inputContainerClassName="bg-gray-200 border border-gray-200 "
              inputClassName="bg-gray-200"
              label="Student / Parent Last Name"
            />
            <InputField
              label="Student / Parent Email"
              placeholder=" "
              inputContainerClassName="bg-gray-200 border border-gray-200 w-[34.2vw]"
              inputClassName="bg-gray-200"
              parentClassName="text-xs  text-[#26435F] mb-2"
            />
            <div className="flex gap-1 items-center">
              <div className="bg-gray-200 border translate-y-[6px] p-2 rounded-[3.5px] border-gray-200 h-[50px] text-[#667085] text-xs px-3 flex items-center">
                +91
              </div>
              <InputField
                placeholder=""
                parentClassName="text-xs  text-[#26435F] mb-1.5 "
                inputContainerClassName="bg-gray-200 border border-gray-200 h-[50px] w-[275px]"
                inputClassName="bg-gray-200 "
                label=" Student / Parent Phone"
                labelClassname={"translate-x-[-50px]"}
              />
            </div>
            <InputField
              placeholder=""
              parentClassName="text-xs  text-[#26435F] mb-2"
              inputContainerClassName="bg-gray-200 border border-gray-200 w-[34.2vw]"
              inputClassName="bg-gray-200"
              label="School Name"
            />
            <InputField
              placeholder=""
              IconRight={dropdown}
              parentClassName="text-xs  text-[#26435F] mb-2"
              inputContainerClassName="bg-gray-200 border border-gray-200 w-[150px]"
              inputClassName="bg-gray-200"
              label="Student's Grade"
            />
          </div>
        </div>
      </div>

      <div
        className={`${styles.customContainer} relative ${
          loadingCustom && "pointer-events-none cursor-not-allowed"
        }`}
      >
        <span
          className={`hidden lg:flex mb-[26px]  items-center text-base-20`}
          style={{ color: "#26435F", fontWeight: 600 }}
        >
          Page 3: Custom Fields (Add a maximum of 5 items)
          <img className="ml-[100px]" src={que2}></img>
        </span>
        <div className="mb-10">
          {customFields?.map((item, idx) => {
            return (
              <div
                key={item._id}
                className={`${styles.customField} grid grid-cols-12 gap-x-12 `}
              >
                <div className="col-span-8">
                  <div className="py-3 px-4 border-b border-[#26435f] bg-[#F5F8FA] text-base-17-5 ">
                    <p>
                      <span className="text-base-17-5 ">{idx + 1}. </span>
                      <input
                        value={item.name}
                        className="bg-transparent w-[90%] py-1 outline-none border-none text-base-17-5 "
                        onChange={(e) => {
                          let updatedCustomFields = customFields?.map((it) => {
                            if (it._id === item._id) {
                              return {
                                ...it,
                                name: e.target.value,
                              };
                            }
                            return it;
                          });
                          setCustomFields(updatedCustomFields);
                        }}
                        onKeyDown={handleNameAddKeyDown}
                      />
                    </p>
                  </div>
                  {item.dataType === "String" && (
                    <div className="flex flex-col gap-y-3 mt-7 bg-[#F5F8FA]">
                      <input
                        className="bg-[#F5F8FA] p-2 outline-none text-[#507CA8]"
                        name=""
                        id=""
                        cols="30"
                        rows="6"
                        disabled={true}
                      />
                    </div>
                  )}
                  {item.dataType === "Paragraph" && (
                    <div className="flex flex-col gap-y-3 mt-7 bg-[#F5F8FA]">
                      <textarea
                        className="bg-[#F5F8FA] p-2 outline-none text-[#507CA8]"
                        name=""
                        id=""
                        cols="30"
                        rows="6"
                        disabled={true}
                      ></textarea>
                    </div>
                  )}
                  {(item.dataType === "Checkboxes" ||
                    item.dataType === "Dropdown") && (
                    <div className="flex flex-col gap-y-3 mt-7 ">
                      {item.Values?.map((value) => {
                        return (
                          <div key={value} className="flex items-center">
                            <img src={CheckboxIcon} alt="checkbox" />
                            <p className="ml-2 text-[#507CA8] !font-normal text-base-17-5 ">
                              {" "}
                              {value ? value : "-"}{" "}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {(item.dataType === "Checkboxes" ||
                    item.dataType === "Dropdown") && (
                    <div className="flex flex-col gap-y-3 mt-3  mb-7">
                      <div className="flex items-center">
                        <img
                          className="inline-block"
                          src={CheckboxIcon}
                          alt="checkbox"
                        />

                        {addOption === true && questionSelected === item._id ? (
                          <input
                            autoFocus
                            className="ml-3 text-[14px] text-[#7E7E7E] outline-[#DCDCDD] border-[1.5px] border-[#DCDCDD] rounded-[4px] bg-[#F5F8FA]  w-32 text-base-17-5 "
                            value={inputValue}
                            type="text"
                            onChange={handleAddOption}
                            onKeyPress={(e) => handleKeyPress(e, item)}
                          />
                        ) : (
                          <p
                            className="!text-[#FFA28D] !font-normal ml-2 underline cursor-pointer text-base-17-5 "
                            onClick={() => {
                              SetAddOption(true);
                              setQuestionSelected(item._id);
                            }}
                          >
                            Add option
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-4">
                  <div className="max-w-[200px]">
                    <InputSelect
                      value={item.dataType}
                      labelClassname="hidden"
                      parentClassName="w-[200px] mr-5 my-4 text-base-17-5 "
                      optionData={[
                        "Paragraph",
                        "String",
                        "Dropdown",
                        "Checkboxes",
                      ]}
                      onChange={(e) => handleCustomFieldType(item._id, e)}
                      inputContainerClassName={`bg-[#F5F8FA] border-0 text-[#26435F] font-medium ${styles["dropdown-container"]} `}
                    />
                    <div className="flex items-center justify-between cursor-pointer bg-[#F5F8FA] text-[#26435F]  text-sm px-4 py-[13px] my-4">
                      <p className="!font-medium text-base-17-5 ">Required?</p>
                      <ToggleBar
                        toggle={{ value: item.required, key: item._id }}
                        onToggle={() => {
                          handleRequired(item._id);
                        }}
                      ></ToggleBar>
                    </div>

                    <div
                      className="flex items-center justify-between cursor-pointer bg-[#F5F8FA] text-[#26435F] font-medium text-sm px-4 py-[13px] text-base-17-5 "
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                      <img src={DeletIcon} alt="delete" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <PrimaryButton
          disabled={customFields?.length >= 5 ? true : false}
          children={"Add New Question "}
          Icon={plus1}
          className="text-base-17-5 text-white"
          onClick={() => setAddNewQuestionModalActive(true)}
        />
        {loadingCustom && (
          <div className="bg-transparent w-full h-full z-[999999] pointer-events-none cursor-not-allowed absolute top-0 grid items-center place-items-center">
            {" "}
            <LoaderNew className="" />{" "}
          </div>
        )}
      </div>
    </div>
  );
}
