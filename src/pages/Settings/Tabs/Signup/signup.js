import React, { useEffect, useRef, useState } from "react";
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
import DeleteIcon from "../../../../assets/YIcons/Vector (1).svg";
import plus1 from "../../../../assets/icons/plus1.svg";
import dropdown from "../../../../assets/icons/dropdown (2).svg";
import InputFieldDropdown from "../../../../components/InputField/inputFieldDropdown";
import ToggleBar from "../../../../components/SettingsCard/ToogleBar";
import AddTag from "../../../../components/Buttons/AddTag";
import Loader from "../../../../components/Loader";
import LoaderNew from "../../../../components/Loader/LoaderNew";
import { useAddNewQuestionMutation } from "../../../../app/services/admin";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/Modal/Modal";
import EditIcon from "../../../../assets/YIcons/Editing.svg";
export default function SignupTab({
  setAddNewQuestionModalActive,
  fetchS,
  updateAndFetchsettings,
  orgData,
  fetchSettings,
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

  const submitNewQuestion = (e) => {
    e.preventDefault();
    if (organization?.settings?.customFields?.length === 5)
      return alert("Only 5 fields are allowed");

    let updatedCustomFields = customFields;
    updatedCustomFields = updatedCustomFields.map((item) => ({
      name: item.name,
      Values: item.Values,
      dataType: item.dataType,
    }));
    updatedCustomFields.push({
      dataType: "Paragraph",
      text: "",
      values: [],
    });
    const body2 = {
      customFields: updatedCustomFields,
    };
    updateAndFetchsettings(body2, setLoadingCustom);
  };
  const [questionModalActive, setQuestionModalActive] = useState(false);
  const [selectedQuestionData, setSelectedQuestionData] = useState({
    name: "",
    Values: [],
    dataType: "",
  });
  const [saveLoading, setsaveLoading] = useState(false);
  const navigate = useNavigate();
  const handleQuestionModalUpload = () => {
    let editQuestionData = { ...selectedQuestionData };
    if (
      selectedQuestionData?.dataType !== "Dropdown Options" &&
      selectedQuestionData?.dataType !== "Multi-select Checkboxes"
    ) {
      editQuestionData.Values = [];
    }
    let updatedCustomFields = [...customFields] ?? [];
    if (editQuestionData?._id) {
      updatedCustomFields = customFields?.map((it) => {
        if (it._id === editQuestionData?._id) {
          return { ...editQuestionData };
        }
        return it;
      });
    } else updatedCustomFields.push(editQuestionData);

    updatedCustomFields = updatedCustomFields.map((item) => ({
      name: item.name,
      Values: item.Values,
      dataType: item.dataType,
      required: item.required
    }));

    const body = {
      customFields: updatedCustomFields,
    };
    console.log("handleUpload", { body });

    updateAndFetchsettings(body, setLoadingCustom);
    setQuestionModalActive(false);
    setSelectedQuestionData({ name: "", Values: [], dataType: "" });
  };
  const handleEmpty = (val) => {
    if (!val || val.length === 0 || val?.trim()?.length === 0) {
      return true;
    }
    return false;
  };
  const handleEditQuestion = (item) => {
    setSelectedQuestionData(item);
    setQuestionModalActive(true);
  };
  const handleQuestionValue = (type, val) => {
    if (type !== "Dropdown Options" && type !== "Multi-select Checkboxes") {
      return val;
    }

    let arr = [...val];
    while (Array.isArray(arr) && arr?.length < 2) {
      arr.push("");
    }
    return arr;
  };
  const handleQuestionDisabled = () => {
    if (!selectedQuestionData || handleEmpty(selectedQuestionData?.name))
      return true;
    if (handleEmpty(selectedQuestionData?.dataType)) return true;
    if (
      selectedQuestionData?.dataType === "Dropdown Options" ||
      selectedQuestionData?.dataType === "Multi-select Checkboxes"
    ) {
      if (
        selectedQuestionData?.Values?.length < 2 ||
        handleEmpty(selectedQuestionData?.Values[0]) ||
        handleEmpty(selectedQuestionData?.Values[1])
      )
        return true;
    }
    return false;
  };
  const bottomEl = useRef(null);

  const scrollToBottom = () => {
    bottomEl?.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(()=>{
    scrollToBottom()
  },[selectedQuestionData?.Values?.length])
  return (
    <div className="">
      <div className="mb-[40px]">
        <div className="text-medium flex items-start w-300 text-[#507CA8] mb-4">
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
        <div className="text-medium flex items-start w-300 text-[#507CA8]">
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
            <p className="whitespace-nowrap text-20">
              Page 1: Basic Details (all fields mandatory)
            </p>

            <p className="ml-6">
              <img src={que2} alt="que"></img>
            </p>
          </div>
          <div className={`flex mt-[55px] lg:mt-0 ${styles.inputs}`}>
            <InputField
              placeholder=""
              inputContainerClassName="bg-[#e5e7eb] border border-gray-200"
              inputClassName="bg-[#e5e7eb]"
              parentClassName="text-xs text-[#26435F] mb-2 w-[275px] flex-shrink-0"
              label="First Name"
              labelClassname='mb-1 text-medium'
            />
            <InputField
              placeholder=""
              inputContainerClassName="bg-[#e5e7eb] border border-gray-200"
              inputClassName="bg-[#e5e7eb]"
              parentClassName="text-xs text-[#26435F] mb-2 w-[275px]"
              label="Last Name"
              labelClassname='mb-1 text-medium'
            />
            <InputField
              label="Email"
              inputContainerClassName="bg-[#e5e7eb] border border-gray-200"
              inputClassName="bg-[#e5e7eb]"
              placeholder=""
              parentClassName="text-xs  text-[#26435F] mb-2 w-[583.75px]"
              labelClassname='mb-1 text-medium'
            />
            <div className="flex gap-1 items-center">
              <div className="bg-[#e5e7eb] border translate-y-[6px] p-2 rounded-[3.5px] border-gray-200 h-[50px] text-[#667085] text-xs px-3 flex items-center">
                +91
              </div>
              <InputField
                placeholder=""
                parentClassName="text-xs  text-[#26435F] mb-2 w-[333.75px]"
                inputContainerClassName="bg-[#e5e7eb] border border-gray-200 w-[275px] h-[50px]"
                inputClassName="bg-[#e5e7eb] "
                label=" Phone"
                labelClassname={"mb-1 translate-x-[-50px] text-medium"}
              />
            </div>
          </div>
          <div>
            <p className={`mb-5 ${styles.label} text-medium mt-[42px]`}>
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

                  <span className="ml-2 text-[#507CA8] text-medium">
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

                  <span className="ml-2 text-[#507CA8] text-medium">
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
                <span className="ml-2 text-[#507CA8] text-medium">
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
                <p className={` ml-2 text-[#507CA8] text-medium`}>
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
            <p className=" pl-5 text-20">
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
              parentClassName="text-xs  text-[#26435F] mb-2 w-[275px]"
              inputContainerClassName="bg-[#e5e7eb] border border-gray-200 "
              inputClassName="bg-[#e5e7eb]"
              label="Student / Parent First Name"
              labelClassname='mb-1 text-medium'
            />
            <InputField
              placeholder=""
              parentClassName="text-xs  text-[#26435F] mb-2 w-[275px]"
              inputContainerClassName="bg-[#e5e7eb] border border-gray-200 "
              inputClassName="bg-[#e5e7eb]"
              label="Student / Parent Last Name"
              labelClassname='mb-1 text-medium'
            />
            <InputField
              label="Student / Parent Email"
              placeholder=" "
              inputContainerClassName="bg-[#e5e7eb] border border-gray-200"
              inputClassName="bg-[#e5e7eb]"
              parentClassName="text-xs  text-[#26435F] mb-2 w-[583.75px]"
              labelClassname='mb-1 text-medium'
            />
            <div className="flex gap-1 items-center w-[560px]">
              <div className="bg-[#e5e7eb] border translate-y-[6px] p-2 rounded-[3.5px] border-gray-200 h-[50px] text-[#667085] text-medium px-3 flex items-center">
                +91
              </div>
              <InputField
                placeholder=""
                parentClassName="text-xs  text-[#26435F] mb-1.5 "
                inputContainerClassName="bg-[#e5e7eb] border border-gray-200 h-[50px] w-[275px]"
                inputClassName="bg-[#e5e7eb] "
                label=" Student / Parent Phone"
                labelClassname={"translate-x-[-50px] text-medium"}
              />
            </div>
            <InputField
              placeholder=""
              parentClassName="text-xs  text-[#26435F] mb-2 w-[583.75px]"
              inputContainerClassName="bg-[#e5e7eb] border border-gray-200"
              inputClassName="bg-[#e5e7eb]"
              label="School Name"
              labelClassname='mb-1 text-medium'
            />
            <InputField
              placeholder=""
              IconRight={dropdown}
              parentClassName="text-xs  text-[#26435F] mb-2 w-[178.75px]"
              inputContainerClassName="bg-[#e5e7eb] border border-gray-200 w-[150px]"
              inputClassName="bg-[#e5e7eb]"
              label="Student's Grade"
              labelClassname='mb-1 text-medium'
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
          className={`hidden lg:flex mb-[26px]  items-center text-20`}
          style={{ color: "#26435F", fontWeight: 600 }}
        >
          Page 3: Custom Fields (Add a maximum of 5 items)
          <img className="ml-[30px]" src={que2}></img>
        </span>
        <div className="mb-10">
          {customFields?.map((item, idx) => {
            return (
              <div
                key={item._id}
                className={`${styles.customField} w-full grid grid-cols-12 gap-x-12 mb-8 py-4 pb-8 border-b-[1.25px] border-b-[#CBD6E2]`}
              >
                <div className="col-span-8">
                  <div className="py-3 px-4 border-b border-[#26435f] bg-[#F5F8FA] text-medium ">
                    <p>
                      <span className="text-medium ">{idx + 1}. </span>
                      <input
                        value={item.name}
                        placeholder="Type your question here."
                        className="bg-transparent w-[90%] py-1 outline-none border-none text-medium "
                        disabled={true}
                      />
                    </p>
                  </div>
                  {item.dataType === "Single-line Text Box" && (
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
                  {item.dataType === "Paragraph Text Box" && (
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
                  {(item.dataType === "Multi-select Checkboxes") && (
                    <div className="flex flex-col gap-y-3 mt-7 ">
                      {item.Values?.map((value) => {
                        return (
                          <div key={value} className="flex items-center">
                            <img src={CheckboxIcon} alt="checkbox" />
                            <p className="ml-2 !text-[#507CA8] !font-normal text-medium ">
                              {" "}
                              {value ? value : "-"}{" "}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                    {(item.dataType === "Dropdown Options") && (
                    <div className="flex flex-col gap-y-3 mt-7 ">
                      {item.Values?.map((value) => {
                        return (
                          <div key={value} className="flex items-center">
                          
                        
                                  <InputField
                                    label=""
                                    labelClassname="text-base-20 text-[#26435F] !mb-0 none hidden"
                                    placeholder={`Dropdown Option ${idx + 1} ${
                                      idx < 2 ? "(required)" : ""
                                    }`}
                                    inputContainerClassName="!text-[#507CA8] text-medium !px-3 bg-primary-50 border-0 shadow-small rounded-[6px]"
                                    inputClassName="bg-transparent"
                                    placeholderClass="text-medium"
                                    parentClassName="flex-1 text-medium py-0 w-full  mr-4 !mb-0"
                                    type="text"
                                    value={value}
                                    disabled={true}
                                    
                                  />

                                 
                               
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="col-span-4">
                  <div className="max-w-[230px]">
                    <div className="flex rounded-[6px] mb-4 items-center justify-between cursor-pointer bg-[#EBEEF2] text-[#26435F] font-medium text-sm px-4 py-[8px] text-medium ">
                      {item.dataType}
                    </div>
                    <div
                      className="flex rounded-[6px]  items-center justify-between cursor-pointer bg-[#F5F8FA] text-[#26435F] font-medium text-sm px-4 py-[12px] text-medium "
                      onClick={() => handleEditQuestion(item)}
                    >
                      Edit
                      <img src={EditIcon} alt="edit" />
                    </div>
                    <div className="flex rounded-[6px] items-center justify-between cursor-pointer bg-[#F5F8FA] text-[#26435F]  text-sm px-4 py-[12px] my-4">
                      <p className="!font-medium text-medium ">Required?</p>
                      <ToggleBar
                        toggle={{ value: item.required, key: item._id }}
                        onToggle={() => {
                          handleRequired(item._id);
                        }}
                      ></ToggleBar>
                    </div>

                    <div
                      className="flex rounded-[6px] items-center justify-between cursor-pointer bg-[#F5F8FA] text-[#26435F] font-medium text-sm px-4 py-[12px] text-medium "
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
          className="text-medium text-white"
          onClick={(e) => setQuestionModalActive(true)}
        />
        {loadingCustom && (
          <div className="bg-transparent w-full h-full z-[999999] pointer-events-none cursor-not-allowed absolute top-0 grid items-center place-items-center">
            {" "}
            <LoaderNew className="" />{" "}
          </div>
        )}
        {questionModalActive && (
          <Modal
            classname={"max-w-[900px] design:max-w-[1000px] mx-auto"}
            titleClassName="text-base-20 mb-[18px]"
            title="Add / Edit Form Question"
            cancelBtn={false}
            cancelBtnClassName="w-140 "
            handleClose={() => {
              setQuestionModalActive(false);
              setSelectedQuestionData({
                name: "",
                Values: [],
                dataType: "",
              });
            }}
            body={
              <form
                id="settings-form"
                onSubmit={(e) => {
                  e.preventDefault();

                  handleQuestionModalUpload();
                }}
              >
                <p className="text-base-16 mt-[-10px] text-[#667085]">
                  <span className="font-semibold mr-1">⚠️ Note:</span>
                  These questions will show up in the third step of the sign-up
                  form that you can use for letting your clients sign up on
                  Evallo. If no custom questions are added, then the third step
                  will be hidden and only the mandatory steps will be shown
                  during sign-up. Read detailed documentation in Evallo’s
                  <span
                    className="text-[#24A3D9] cursor-pointer"
                    onClick={() => navigate("/support")}
                  >
                    {" "}
                    knowledge base.
                  </span>
                </p>

                <div className="  grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5 mt-3">
                  <div className="flex-1 flex gap-5 ">
                    <div className="flex-1 pr-1">
                      <div className="flex flex-col gap-y-1 mt-3">
                        <p className="text-base-18 text-[#26435F] !text-[#26435F] mb- font-semibold">
                          Question Text
                        </p>
                        <textarea
                          className="bg-primary-50 rounded-[6px] p-2 outline-none  text-medium !h-[80px] shadow-small"
                          name=""
                          id=""
                          cols="30"
                          placeholder="Add a custom question that you would like to ask the parents / students signing up on your platform."
                          value={selectedQuestionData?.name}
                          isRequired={true}
                          onChange={(e) => {
                            setSelectedQuestionData({
                              ...selectedQuestionData,
                              name: e.target.value,
                            });
                          }}
                        ></textarea>
                      </div>
                      <div className="flex mt-6 items-end justify-between gap-10">
                        {" "}
                        <InputSelect
                          labelClassname="text-base-18 mb-1"
                          inputContainerClassName="flex-1 text-medium shadow-[0px_0px_2.500000476837158px_0px_#00000040] bg-primary-50 shadow-small"
                          optionListClassName="text-medium"
                          optionClassName="text-medium"
                          optionData={[
                            "Paragraph Text Box",
                            "Single-line Text Box",
                            "Dropdown Options",
                            "Multi-select Checkboxes",
                          ]}
                          placeholderClass="text-medium"
                          parentClassName="flex-1 text-medium py-0 w-[calc(387*0.0522vw)] "
                          label="Select Question Type"
                          value={selectedQuestionData.dataType}
                          required={true}
                          noAsteric={true}
                          onChange={(val) =>
                            setSelectedQuestionData({
                              ...selectedQuestionData,
                              dataType: val,
                              Values: handleQuestionValue(
                                val,
                                selectedQuestionData?.Values
                              ),
                            })
                          }
                        />
                        <div className="flex rounded-[6px] translate-y-[-14px]  items-center justify-between gap-6 cursor-pointer bg-[#F5F8FA] text-[#26435F]  text-sm px-4 py-[10px] ">
                        <p className="!font-medium text-medium mr-7">
                            Required?
                          </p>
                          <ToggleBar
                            toggle={{
                              value: selectedQuestionData.required,
                              key: selectedQuestionData._id,
                            }}
                            onToggle={() => {
                              setSelectedQuestionData({
                                ...selectedQuestionData,
                                required: !selectedQuestionData.required,
                              });
                            }}
                          ></ToggleBar>
                        </div>
                      </div>
                      {(selectedQuestionData?.dataType === "Dropdown Options" ||
                        selectedQuestionData?.dataType ===
                          "Multi-select Checkboxes") && (
                        <>
                          <p className="text-base-18 text-[#26435F] mb-0.5 !font-medium mt-5">
                            Enter Dropdown Options
                          </p>
                          <div className="flex p-1 flex-col mt-1 items-start justify-start h-[120px] overflow-y-auto custom-scroller">
                            {" "}
                            {selectedQuestionData?.Values?.map((opt, idx) => {
                              return (
                                
                                <div  className="flex justify-between gap-12 w-full flex-1">
                                  <InputField
                                    label="Service Name"
                                    labelClassname="text-base-20 text-[#26435F] mb-0.5 none hidden"
                                    placeholder={`Dropdown Option ${idx + 1} ${
                                      idx < 2 ? "(required)" : ""
                                    }`}
                                    inputContainerClassName=" text-medium !px-3 bg-primary-50 border-0 shadow-small rounded-[6px]"
                                    inputClassName="bg-transparent"
                                    placeholderClass="text-medium"
                                    parentClassName="flex-1 text-medium py-0 w-[95%]  mr-4 mb-2"
                                    type="text"
                                    value={selectedQuestionData.Values[idx]}
                                    isRequired={idx < 2}
                                    onChange={(e) => {
                                      let arr = selectedQuestionData.Values;
                                      arr[idx] = e.target.value;
                                      setSelectedQuestionData((prev) => ({
                                        ...prev,
                                        Values: arr,
                                      }));
                                    }}
                                  />

                                  <img
                                    onClick={() => {
                                      let arr = selectedQuestionData.Values;
                                      arr = arr?.filter((it, idx2) => {
                                        return idx2 !== idx;
                                      });

                                      setSelectedQuestionData((prev) => ({
                                        ...prev,
                                        Values: arr,
                                      }));
                                    }}
                                    className={`${
                                      idx <= 1
                                        ? " opacity-0 pointer-events-none cursor-default"
                                        : "cursor-pointer"
                                    } mr-3`}
                                    src={DeleteIcon}
                                    alt="del"
                                  />
                                </div>
                              );
                            })}
                            <div className="" ref={bottomEl}></div>
                          </div>
                          <p
                            onClick={() => {
                              setSelectedQuestionData((prev) => ({
                                ...prev,
                                Values: [...prev.Values, ""],
                              }));
                             
                            }}
                            className="cursor-pointer text-base-18 text-[#FFA28D] underline underline-offset-2 mb-0.5 !font-medium mt-5"
                          >
                            {selectedQuestionData?.dataType ===
                              "Dropdown Options" && "+ Add Dropdown Option"}

                            {selectedQuestionData?.dataType ===
                              "Multi-select Checkboxes" &&
                              " + Add Multi-select Options"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap [&>*]:mb-[10px] mt-5"></div>
                  <div className="w-full border-[1.33px_solid_#00000033] bg-[#00000033] my-5 h-[1.3px]"></div>
                  <div className="flex gap-4 items-center justify-center mt-3">
                    <button
                      disabled={loadingCustom || handleQuestionDisabled()}
                      className={`${

                        loadingCustom ? "cursor-wait" : ""
                      } rounded-lg bg-[#FFA28D] border-2 border-[#FFA28D] py-[6px] text-[#FFFFFF] w-[146px]`}
                    >
                      Save{" "}
                    </button>
                    <button
                      className="rounded-lg bg-transparent border-2 border-[#FFA28D] py-[6px] text-[#FFA28D]  w-[146px]"
                      onClick={() => {
                        setQuestionModalActive(false);
                        setSelectedQuestionData({
                          name: "",
                          Values: [],
                          dataType: "",
                        });
                      }}
                    >
                      Cancel{" "}
                    </button>
                  </div>
                </div>
              </form>
            }
          />
        )}
      </div>
    </div>
  );
}
