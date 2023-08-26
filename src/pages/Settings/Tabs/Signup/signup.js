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
import que2 from "../../../../assets/icons/que2.png";
import plus1 from "../../../../assets/icons/plus1.png";
import dropdown from "../../../../assets/icons/dropdown (2).svg";
export default function SignupTab({
  setAddNewQuestionModalActive,
  fetchS,
  updateAndFetchsettings,
}) {
  const { organization } = useSelector((state) => state.organization);

  const [customFields, setCustomFields] = useState();

  useEffect(() => {
    setCustomFields(organization?.settings?.customFields);
  }, [organization]);
  useEffect(() => {
    if (fetchS && fetchS.data && fetchS.data.updatedOrg) {
      setCustomFields(fetchS.data.updatedOrg.customFields);
    }
  }, [fetchS]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(false);
  const [isCheckedThree, setIsCheckedThree] = useState(false);
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
    updateAndFetchsettings(body);
  };

  return (
    <div className="">
      <div className="mb-[40px]">
        <div
          className="text-sm flex items-start w-300 text-[#507CA8] mb-4">
          <p className="mt-[3px]"><img src={que} alt="que"></img></p>
          <p className="pl-2">Please enter the fields for the sign up form that you want to show your clients. You are allowed to create up to 5 additional custom questions beyond the mandatory fields that we require from parents and students.</p>
        </div>
        <div className="text-sm flex items-start w-300 text-[#507CA8]">
          <p className="mt-[3px]"><img width="14px" src={que} alt="que"></img></p>
          <p className="pl-2">Link to the Sign-up form for Org Name: <a rel="noreferrer"
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
            className={`hidden lg:flex mb-[26px] items-center justify-between text-[#26435F] font-semibold`}
          >
            <p>      Page 1: Basic Details (all fields mandatory)</p>

            <p className="mr-2"> <img src={que2} alt="que"></img></p>
          </div>
          <div className={`flex mt-[59px] lg:mt-0 ${styles.inputs}`}>
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
            <InputField
              placeholder=""
              inputContainerClassName="bg-gray-200 border border-gray-200 "
              inputClassName="bg-gray-200"
              parentClassName="text-xs  text-[#26435F] mb-7"
              label="Phone"
            />
          </div>
          <div>
            <p className={`mb-5 ${styles.label}`}>
              Are you signing up as a Parent or a Student?
            </p>
            <div className="flex items-center gap-x-6">
              <p onClick={() => setIsChecked(true)} className={styles.textLight}>
                <div className={`${styles["checkbox-label"]} block  `}>
                  <input
                    type="radio"
                    className="form-radio hidden"
                    id="radioOption"
                  />
                  <label
                    htmlFor="radioOption"
                    className={`relative w-4 h-4 mx-1 rounded-full border ${isChecked ? "border-[#FFA28D]" : "border-gray-600"} cursor-pointer`}

                  >
                    {isChecked && (
                      <div className="absolute inset-0 my-auto mx-auto w-[9px] h-[9px] rounded-full bg-[#FFA28D]" />
                    )}{" "}
                  </label>

                  <span className="ml-2 text-[#507CA8]">Parent / Guardian</span>
                </div>
              </p>
              <p onClick={() => setIsChecked(false)} className={styles.textLight}>
                <div className={`${styles["checkbox-label"]} block  `}>
                  <input
                    type="radio"
                    className="form-radio hidden"
                    id="radioOption"
                  />
                  <label

                    className={`relative w-4 h-4  mx-1 rounded-full border ${!isChecked ? "border-[#FFA28D]" : "border-gray-600"} cursor-pointer`}

                  >
                    {!isChecked && (
                      <div className="absolute inset-0 my-auto mx-auto w-[9px] h-[9px] rounded-full bg-[#FFA28D]" />
                    )}{" "}
                  </label>

                  <span className="ml-2 text-[#507CA8]">Student</span>
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
                  className={`${styles["custom-checkbox"]} ${isChecked ? "checked" : ""
                    }`}
                ></span>
                <span className="ml-2 text-[#507CA8]">
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
                  className={`${styles["custom-checkbox"]} ${isChecked ? "checked" : ""
                    }`}
                ></span>
                <p className={` ml-2 text-[#507CA8]`}>
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
            className={`hidden lg:flex mb-[26px] items-center justify-between text-[#26435F] font-semibold pt-5`}
          >
            <p className=" pl-5 ">Page 2: Associated Student / Parent Details (all fields mandatory)</p>

            <p className="mr-2"> <img src={que2} alt="que"></img></p>
          </div>
          <div className={`flex mt-[59px]  lg:mt-0 ${styles.inputs}  pr-[70px] pl-5 pb-5`}>
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
              inputContainerClassName="bg-gray-200 border border-gray-200 w-[32.5vw]"
              inputClassName="bg-gray-200"
              parentClassName="text-xs  text-[#26435F] mb-2"
            />
            <InputField
              placeholder=""
              parentClassName="text-xs  text-[#26435F] mb-2"
              inputContainerClassName="bg-gray-200 border border-gray-200 "
              inputClassName="bg-gray-200"
              label="Student / Parent Phone"
            />
            <InputField
              placeholder=""
              parentClassName="text-xs  text-[#26435F] mb-2"
              inputContainerClassName="bg-gray-200 border border-gray-200 w-[32.5vw]"
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

      <div className={styles.customContainer}>
        <span
          className={`hidden lg:flex mb-[26px]  items-center`}
          style={{ color: "#26435F", fontWeight: 600 }}
        >
          Page 3: Custom Fields (Add a maximum of 5 items)
          <img className="ml-10" src={que2}></img>
        </span>
        <div className="mb-10">
          {customFields?.map((item, idx) => {
            return (
              <div
                key={item._id}
                className={`${styles.customField} grid grid-cols-12 gap-x-12 `}
              >
                <div className="col-span-8">
                  <div className="py-3 px-4 border-b border-[#26435f]">
                    <p>
                      <span>{idx + 1}. </span> {item.name}{" "}
                    </p>
                  </div>
                  {item.dataType === "Dropdown" && (
                    <div className="flex flex-col gap-y-3 mt-7 mb-7">
                      {item.Values?.map((value) => {
                        return (
                          <div key={value} className="flex items-center">
                            <img src={CheckboxIcon} alt="checkbox" />
                            <p className="ml-2 text-[#507CA8]">
                              {" "}
                              {value ? value : "-"}{" "}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="col-span-4">
                  <div className="max-w-[200px]">
                    <InputSelect
                      value={item.dataType}
                      labelClassname="hidden"
                      parentClassName="w-[200px] mr-5 my-4 text-sm "
                      optionData={["String", "Checkboxes"]}
                      inputContainerClassName={`bg-[#F5F8FA] border-0 text-[#26435F] font-medium ${styles["dropdown-container"]} `}
                    />
                    <div
                      className="flex items-center justify-between cursor-pointer bg-[#F5F8FA] text-[#26435F] font-medium text-sm px-4 py-2"
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
          children={"Add New Question"}
          Icon={plus1}
          onClick={() => setAddNewQuestionModalActive(true)}
        />
      </div>
    </div>
  );
}
