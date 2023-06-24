import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.css";
import InputField from "../../../../components/InputField/inputField";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import CCheckbox from "../../../../components/CCheckbox/CCheckbox";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import CheckboxIcon from "../../../../assets/icons/square.svg";

export default function SignupTab({ setAddNewQuestionModalActive, fetchS }) {
  const { organization } = useSelector((state) => state.organization);

  // console.log("organization", organization);
  const [customFields, setCustomFields] = useState(organization.customFields);

  useEffect(() => {
    if (fetchS && fetchS.data && fetchS.data.updatedOrg) {
      setCustomFields(fetchS.data.updatedOrg.customFields);
    }
  }, [fetchS]);
  return (
    <div className="">
      <p className="text-sm underline w-500">
       <a href={`${process.env.REACT_APP_FE_URL}/signup/user?orgName=${organization.company}`} target={"_blank"}> {`${process.env.REACT_APP_FE_URL}/signup/user?orgName=${organization.company}`}
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
                  parentClassName="w-[200px] mr-5 my-4 text-sm "
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
          disabled={customFields.length < 5 ? false : true}
          children={"Add new question"}
          onClick={() => setAddNewQuestionModalActive(true)}
        />
      </div>
    </div>
  );
}
