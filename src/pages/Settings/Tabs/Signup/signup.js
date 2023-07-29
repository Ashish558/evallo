import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.css";
import InputField from "../../../../components/InputField/inputField";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import CCheckbox from "../../../../components/CCheckbox/CCheckbox";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import CheckboxIcon from "../../../../assets/icons/square.svg";
import DeletIcon from "../../../../assets/Settings/delete.svg";

export default function SignupTab({
  setAddNewQuestionModalActive,
  fetchS,
  updateAndFetchsettings
}) {
  const { organization } = useSelector((state) => state.organization);

  const [customFields, setCustomFields] = useState(organization.customFields);
  useEffect(() => {
    if (fetchS && fetchS.data && fetchS.data.updatedOrg) {
      setCustomFields(fetchS.data.updatedOrg.customFields);
    }
  }, [fetchS]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(false);
  const [isCheckedThree, setIsCheckedThree] = useState(false);

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
    let updatedCustomFields = customFields.filter(item => item._id !== id)
    const body = {
      customFields: updatedCustomFields
    }
    updateAndFetchsettings(body)
  };
  console.log("customFields", customFields);

  return (
    <div className="">
      <p className="text-sm underline w-500">
        <a
          href={`${process.env.REACT_APP_FE_URL}/signup/user?orgName=${organization.company}`}
          target={"_blank"}
        >
          {" "}
          {`${process.env.REACT_APP_FE_URL}/signup/user?orgName=${organization.company}`}
        </a>
      </p>
      <div className="grid grid-cols-2 gap-x-5">
        <div className={styles.colContainer}>
          <p className={`hidden lg:block mb-[26px] ${styles.textGrayed} `}>
            Please fill your detail to create your account.
          </p>
          <div className={`flex mt-[59px] lg:mt-0 ${styles.inputs}`}>
            <InputField
              placeholder=""
              parentClassName="text-xs"
              label="First Name"
            />
            <InputField
              placeholder=""
              parentClassName="text-xs"
              label="Last Name"
            />
            <InputField
              label="Email"
              placeholder=""
              parentClassName="text-xs mb-4"
            />
            <InputField
              placeholder=""
              parentClassName="text-xs mb-4"
              label="Phone"
            />
          </div>
          <div>
            <p className={`mb-5 ${styles.label}`}>
              Are you signing up as a Parent or a Student?
            </p>
            <div className="flex items-center gap-x-6">
              <p className={styles.textLight}>
                <label className={`${styles["checkbox-label"]} block  `}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <span
                    className={`${styles["custom-checkbox"]} ${
                      isChecked ? "checked" : ""
                    }`}
                  ></span>
                  <span className="ml-3">Parent / Guardian</span>
                </label>
              </p>
              <p className={styles.textLight}>
                <label className={`${styles["checkbox-label"]} block  `}>
                  <input
                    type="checkbox"
                    checked={isCheckedTwo}
                    onChange={handleCheckboxChangeTwo}
                  />
                  <span
                    className={`${styles["custom-checkbox"]} ${
                      isChecked ? "checked" : ""
                    }`}
                  ></span>
                  <span className="ml-3">Student</span>
                </label>
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
                <span className="ml-3">
                  I confirm that I am 13 years or older
                </span>
              </label>
            </p>
          </div>
          <div className="flex gap-x-2 my-5">
            <CCheckbox />
            <p className={`${styles.textLight}`}>
              I have carefully read and agree to the{" "}
              <span className="font-medium text-[#26435F]">
                Terms of Use and Privacy Policy
              </span>
            </p>
          </div>
        </div>
        <div className={styles.colContainer}>
          <p className={`hidden lg:block mb-[26px] ${styles.textGrayed} `}>
            Please fill your detail to create your account.
          </p>
          <div className={`flex mt-[59px] lg:mt-0 ${styles.inputs}`}>
            <InputField
              placeholder=""
              parentClassName="text-xs"
              label="Student / Parent First Name"
            />
            <InputField
              placeholder=""
              parentClassName="text-xs"
              label="Student / Parent Last Name"
            />
            <InputField
              label="Student / Parent Email"
              placeholder=" "
              parentClassName="text-xs mb-3"
            />
            <InputField
              placeholder=""
              parentClassName="text-xs mb-3"
              label="Phone"
            />
            <InputField
              placeholder=""
              parentClassName="text-xs mb-3"
              label="School Name"
            />
            <InputField
              placeholder=""
              parentClassName="text-xs mb-3"
              label="Student's Grade"
            />
          </div>
        </div>
      </div>

      <div className={styles.customContainer}>
        <p className={styles.title}>
          Page 3: Custom Fields (Add a maximum of 5 items)
        </p>
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
                      optionData={["String", "Dropdown"]}
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
          children={"Add new question"}
          onClick={() => setAddNewQuestionModalActive(true)}
        />
      </div>
    </div>
  );
}
