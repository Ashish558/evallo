import React from "react";
import InputField from "../../../../components/InputField/inputField";
import styles from "./style.module.css";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import CCheckbox from "../../../../components/CCheckbox/CCheckbox";

export default function SignupTab({ setAddNewQuestionModalActive }) {
  return (
    <div>
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

      <PrimaryButton
        children={"Add new question"}
        onClick={() => setAddNewQuestionModalActive(true)}
      />
    </div>
  );
}
