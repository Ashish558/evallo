import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import styles from "../EventModal/style.module.css";

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
  setInstructions,
  instructions,
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
            label="No of active students"
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
            label="No of tutors"
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

        <p className="font-medium mb-2 text-xs">
          What services do you provide?
        </p>
        <div className="grid grid-cols-3 mb-6">
          <div className="grid grid cols-1">
            <p className="text-xs mb-[7px]">Test preparation</p>
            {testPreparations?.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="flex items-center mb-3 mr-6"
                  onClick={() =>
                    handleCheckboxChange(item.text, testPreparations, setTestPreparations)
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
          <div className="grid grid cols-1">
            <p className="text-xs mb-[7px]">Subject Tutoring</p>
            {tutoring?.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="flex items-center mb-3 mr-6"
                  onClick={() =>
                    handleCheckboxChange(item.text, tutoring, setTutoring)
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
          <div className="grid grid cols-1">
            <p className="text-xs mb-[7px]">Coaching</p>
            {coaching?.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="flex items-center mb-3 mr-6"
                  onClick={() =>
                    handleCheckboxChange(item.text, coaching, setCoaching)
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
        
        </div>
        <p className="font-medium mb-2 text-xs">Format of instruction</p>
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
      </div>

      <div className="flex items-center mt-7">
        <SecondaryButton
          children="Back"
          className="text-sm mr-6"
          onClick={handleBack}
        />
        <PrimaryButton
          children="Next"
          className="text-sm"
          onClick={() => handleSubmit()}
          // disabled={disabled}
        />
      </div>
    </div>
  );
}
