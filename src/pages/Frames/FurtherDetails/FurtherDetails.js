import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import styles from "../EventModal/style.module.css";
import style from "./styles.module.css";

export default function FurtherDetails({
  setFrames,
  setcurrentStep,
  testPreparations,
  setTestPreparations,

  coaching,
  setCoaching,
  tutoring,
  setTutoring,
  setValues,
  values,
  studentserved,
  setStudentserved,
  setInstructions,
  instructions,
  paymentOptions,
  setPaymentOptions,
}) {
  const [disabled, setDisabled] = useState(false);

  const handleCheckboxChange = (text, arr, setValue) => {
    const temp = arr.map((topic) => {
      return topic.text === text
        ? { ...topic, checked: !topic.checked }
        : { ...topic };
    });
    setValue(temp);
  };

  const handleSubmit = () => {
    setFrames((prev) => {
      return { ...prev, furtherDetails: false, requirements: true };
    });
  };

  const handleBack = () => {
    setFrames((prev) => {
      return { ...prev, furtherDetails: false, orgDetails: true };
    });
  };

  // useEffect(() => {
  //   let checkCount = 0;
  //   services.map((item) => {
  //     if (item.checked === true) {
  //       checkCount += 1;
  //     }
  //   });
  // }, [services]);

  useEffect(() => {
    setcurrentStep(3);
  }, []);

  return (
    <div className="">
      <div className="mb-5">
        <div className="flex items-center mb-6 ">
          <InputField
            label="No. Of Active Students"
            required={true}
            placeholder=""
            parentClassName="w-full max-w-[248px] mr-4"
            inputClassName="bg-transparent text-xs"
            type="text"
            value={values.activeStudents}
            onChange={(e) =>
              setValues({
                ...values,
                activeStudents: e.target.value,
              })
            }
          />
          <InputField
            label="No. Of Tutors"
            required={true}
            placeholder=""
            parentClassName="w-full max-w-[248px]"
            inputClassName="bg-transparent text-xs"
            type="text"
            value={values.activeTutors}
            onChange={(e) =>
              setValues({
                ...values,
                activeTutors: e.target.value,
              })
            }
          />
        </div>

        <p className="font-medium mb-2 text-xs font-bold">
          What services do you provide?
        </p>
        <div className="flex flex-col mb-6">
          <div className="">
            <p className="text-xs mb-[7px] text-[#24A3D9] font-bold">
              Test preparation
            </p>
            <div className="grid grid-cols-3">
              {testPreparations?.map((item, idx) => {
                return (
                  <div key={idx} className="flex items-center mb-3 mr-6">
                    <div
                      onClick={() =>
                        handleCheckboxChange(
                          item.text,
                          testPreparations,
                          setTestPreparations
                        )
                      }
                      className={`${styles.container} `}
                    >
                      <input
                        checked={item.checked}
                        type="checkbox"
                        name="hearAboutUs"
                        value=""
                      />
                      <span class={styles.checkmark}></span>
                    </div>
                    <p
                      onClick={() =>
                        handleCheckboxChange(
                          item.text,
                          testPreparations,
                          setTestPreparations
                        )
                      }
                      className="font-medium text-xs text-sm opacity-90 leading-5"
                    >
                      {item.text}
                    </p>
                    {item.text === "Others" && item.checked ? (
                      <input
                        autoFocus
                        className="ml-3 text-sm text-[#7E7E7E] outline-[#DCDCDD] border-2 border-[#DCDCDD] rounded-md bg-[#DCDCDD]  w-48"
                        type="text"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="">
            <p className="text-xs mb-[7px] text-[#24A3D9] font-bold">
              Subject Tutoring
            </p>
            <div className="grid grid-cols-3">
              {tutoring?.map((item, idx) => {
                return (
                  <div key={idx} className="flex items-center mb-3 mr-6">
                    <div
                      onClick={() =>
                        handleCheckboxChange(item.text, tutoring, setTutoring)
                      }
                      className={`${styles.container} `}
                    >
                      <input
                        checked={item.checked}
                        type="checkbox"
                        name="hearAboutUs"
                        value=""
                      />
                      <span class={styles.checkmark}></span>
                    </div>
                    <p
                      onClick={() =>
                        handleCheckboxChange(item.text, tutoring, setTutoring)
                      }
                      className="font-medium text-xs text-sm opacity-90 leading-5"
                    >
                      {item.text}
                    </p>
                    {item.text === "Others" && item.checked ? (
                      <input
                        autoFocus
                        className="ml-3 text-sm text-[#7E7E7E] outline-[#DCDCDD] border-2 border-[#DCDCDD] rounded-md bg-[#DCDCDD]  w-48"
                        type="text"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="">
            <p className="text-xs mb-[7px] text-[#24A3D9] font-bold">
              Coaching
            </p>
            <div className="grid grid-cols-3">
              {coaching?.map((item, idx) => {
                return (
                  <div key={idx} className="flex items-center mb-3 mr-6">
                    <div
                      className={`${styles.container} `}
                      onClick={() =>
                        handleCheckboxChange(item.text, coaching, setCoaching)
                      }
                    >
                      <input
                        checked={item.checked}
                        type="checkbox"
                        name="hearAboutUs"
                        value=""
                      />
                      <span class={styles.checkmark}></span>
                    </div>
                    <p
                      onClick={() =>
                        handleCheckboxChange(item.text, coaching, setCoaching)
                      }
                      className="font-medium text-xs text-sm opacity-90 leading-5"
                    >
                      {item.text}
                    </p>
                    {item.text === "Others" && item.checked ? (
                      <input
                        autoFocus
                        className="ml-3 text-sm text-[#7E7E7E] outline-[#DCDCDD] border-2 border-[#DCDCDD] rounded-md bg-[#DCDCDD]  w-48"
                        type="text"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <p className="border-t-[1.2px] mt-[-10px] border-gray-300 pt-2 mb-2 text-xs font-bold">
          Format of instruction
        </p>
        <div className="grid grid-cols-3 mb-6">
          {instructions?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center mb-3 mr-6"
                onClick={() =>
                  handleCheckboxChange(item.text, instructions, setInstructions)
                }
              >
                <div className={`${styles.container} `}>
                  <input
                    checked={item.checked}
                    type="checkbox"
                    name="hearAboutUs"
                    value=""
                  />
                  <span class={styles.checkmark}></span>
                </div>
                <p className="font-medium text-xs text-sm opacity-90 leading-5">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        <p className="border-t-[1.2px] mt-[-10px] border-gray-300 pt-2 text-xs mb-[7px] font-bold">
          Student Served
        </p>
        <div className="grid grid-cols-3">
          {studentserved?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center mb-3 mr-6"
                onClick={() =>
                  handleCheckboxChange(
                    item.text,
                    studentserved,
                    setStudentserved
                  )
                }
              >
                <div className={`${styles.container} `}>
                  <input
                    checked={item.checked}
                    type="checkbox"
                    name="studentserved"
                    value=""
                  />
                  <span class={styles.checkmark}></span>
                </div>
                <p className="font-medium text-xs text-sm opacity-90 leading-5">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
        <p className="border-t-[1.2px] mt-[-10px] border-gray-300 pt-2 text-xs mb-[7px] font-bold">
          How do you currently process your payments?
        </p>
        <div className="flex flex-col h-min ">
          <div className={style.changeOption}>
            <select className="form-control  text-xs">
              <option value="0">Options</option>
              {paymentOptions.map((c, id) => {
                return (
                  <>
                    <option key={id} value={c}>
                      {c}
                    </option>
                  </>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center mt-7 justify-between">
        <SecondaryButton
          children="Go Back"
          className="text-xs mr-6 bg-white text-[#a3aDC7] border-[1.5px] border-[#D0D5DD] "
          onClick={handleBack}
        />
        <PrimaryButton
          children="Next"
          className={` w-full bg-[#FFA28D] disabled:opacity-60 max-w-[110px]   rounded text-white text-xs font-medium relative 
           
          `}
          onClick={() => handleSubmit()}
          // disabled={disabled}
        />
      </div>
    </div>
  );
}
