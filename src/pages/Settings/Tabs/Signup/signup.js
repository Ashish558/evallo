import React from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.css";
import InputField from "../../../../components/InputField/inputField";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import CCheckbox from "../../../../components/CCheckbox/CCheckbox";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import CheckboxIcon from "../../../../assets/icons/square.svg";

export default function SignupTab({ setAddNewQuestionModalActive }) {
  const { organization } = useSelector((state) => state.organization);

  console.log("organization", organization);

  const { customFields } = organization;

  return (
    <div className="">
      <p className="text-sm underline w-500">
        {`${process.env.REACT_APP_FE_URL}/signup/user?orgName=${organization.company}`}
      </p>
      <div className="grid grid-cols-2 gap-x-5">
        <div className={styles.colContainer}>
          <p className={`hidden lg:block mb-[26px] ${styles.textGrayed} `}>
            Please fill your detail to create your account.
          </p>
          <div className={`flex mt-[59px] lg:mt-0 ${styles.inputs}`}>
            <InputField
              placeholder="Vishesh"
              parentClassName="text-xs"
              label="First Name"
            />
            <InputField
              placeholder="Patel"
              parentClassName="text-xs"
              label="Last Name"
            />
            <InputField
              label="Work Email"
              placeholder=" Lorem123@gmail.com"
              parentClassName="text-xs"
            />
            <InputField
              placeholder="99999994532"
              parentClassName="text-xs"
              label="Phone"
            />

            <InputField
              placeholder="Lorem"
              parentClassName="text-xs mb-6"
              label="Company"
            />
            <InputField
              placeholder="Lorem"
              parentClassName="text-xs mb-6"
              label="Role"
            />
          </div>
          <div>
            <p className={`mb-5 ${styles.label}`}>
              Are you signing up as a Parent or a Student?
            </p>
            <div className="flex items-center gap-x-6">
              <p className={styles.textLight}>Parent / Guardian</p>
              <p className={styles.textLight}>Student</p>
            </div>
          </div>
          <div className="flex gap-x-2 my-5">
            <CCheckbox />
            <p className={`${styles.textLight}`}>
              I have carefully read and agree to the Terms of Use and Privacy
              Policy
            </p>
          </div>
        </div>
        <div className={styles.colContainer}>
          <p className={`hidden lg:block mb-[26px] ${styles.textGrayed} `}>
            Please fill your detail to create your account.
          </p>
          <div className={`flex mt-[59px] lg:mt-0 ${styles.inputs}`}>
            <InputField
              placeholder="Vishesh"
              parentClassName="text-xs"
              label="Student / Parent First Name"
            />
            <InputField
              placeholder="Patel"
              parentClassName="text-xs"
              label="Student / Parent Last Name"
            />
            <InputField
              label="Student / Parent Email"
              placeholder=" Lorem123@gmail.com"
              parentClassName="text-xs"
            />
            <InputField
              placeholder="99999994532"
              parentClassName="text-xs"
              label="Phone"
            />

            <InputField
              placeholder="Lorem"
              parentClassName="text-xs mb-6"
              label="Company"
            />
            <InputField
              placeholder="Lorem"
              parentClassName="text-xs mb-6"
              label="Role"
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
              <div key={item._id} className={styles.customField}>
                <p>
                  {" "}
                  <span>{idx + 1}. </span> {item.name}{" "}
                </p>
                <InputSelect
                  value={item.dataType}
                  labelClassname="hidden"
                  parentClassName="w-[200px] mr-5 my-4 text-sm pointer-events-none"
                  optionData={["String", "Dropdown"]}
                />
                {item.dataType === "Dropdown" && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-4 mb-7">
                    {item.Values?.map((value) => {
                      return (
                        <div key={value} className="flex items-center">
                          <img src={CheckboxIcon} alt="checkbox" />
                          <p className="ml-2 text-[#507CA8]"> {value} </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <PrimaryButton
          children={"Add new question"}
          onClick={() => setAddNewQuestionModalActive(true)}
        />
      </div>
    </div>
  );
}
