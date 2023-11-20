import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import styles from "../EventModal/style.module.css";
import style from "./styles.module.css";
import SCheckbox from "../../../components/CCheckbox/SCheckbox";
import InputSelectNew from "../../../components/InputSelectNew/InputSelectNew";

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
  const handlePaymentTypeChange = (e) => {
    setValues({
      ...values,
      paymentType: e,
    });
  };
  const handleOthersField = (e, arr, setValue) => {
    const text = e.target.value;
    if (!text || text === "") return;
    let check = /[a-z]/i.test(text);
    if (!check) {
      alert("Enter valid text! ");
      return
    }
    const temp = arr.filter((topic) => {
      return topic.text !== "Others";
    });
    e.target.value = "";

    temp.push({ text: text, checked: true });
    temp.push({ text: "Others", checked: false });

    setValue(temp);
    console.log(temp);
  };
  useEffect(() => {
    setcurrentStep(3);
  }, []);

  return (
    <div className="!border-t-[1.5px] !border-t-[#EBEBEB] mt-[-23px] pt-[35px]">
      <div className="mb-[20px] px-14">
        <div className="flex items-center mb-6  justify-between">
          <InputField
            label="Number Of Active Students"
            labelClassname="text-[18.6px]"
            biggerText={true}
            placeholder=""
            parentClassName="w-[268px] "
            inputContainerClassName=" border border-[#D0D5DD] !text-[#667085] h-[53px] rounded-5"
            inputClassName="!text-[#667085]  bg-transparent !text-[18.6px]"
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
            label="Number Of Tutors"
            labelClassname="text-[18.6px]"
            biggerText={true}
            placeholder=""
            parentClassName="w-[268px] "
            inputContainerClassName=" border border-[#D0D5DD] !text-[#667085] h-[53px] rounded-5"
            inputClassName="!text-[#667085] bg-transparent !text-[18.6px]"
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
        <p className="!border-t-[1.4px] !border-t-[#26435F4D]    pt-4 pb-[15px] text-[18.6px] text-[#26435F] tracking-wider font-medium">
          <span className="">What services do you provide?</span>
        </p>

        <div className="flex flex-col mb-6">
          <div className="mb-[9px]">
            <p className="text-[18.6px] mb-[7px] text-[#24A3D9] !font-medium">
              Test Preparation
            </p>
            <div className="grid grid-cols-3 font-medium text-[#26435F] grid-flow-row-dense ">
              {testPreparations?.map((item, idx) => {
                return (
                  <div key={idx} className="flex items-center mb-3 mr-6 relative">
                    <SCheckbox
                      checked={item.checked}
                      className="scale-[0.793] mt-[2px]"
                      onChange={() =>
                        handleCheckboxChange(
                          item.text,
                          testPreparations,
                          setTestPreparations
                        )
                      }
                    />

                    <p
                      onClick={() =>
                        handleCheckboxChange(
                          item.text,
                          testPreparations,
                          setTestPreparations
                        )
                      }
                      className="font-normal  text-[14px]  leading-5 mb-[1px]"
                    >
                      {item.text}
                    </p>
                    {item.text === "Other Tests" && item.checked ? (
                      <input
                        autoFocus
                        className="absolute pl-3 -bottom-8 text-[13px] text-[#7E7E7E] outline-[#DCDCDD] border-[1.5px] border-[#DCDCDD] rounded-[4px] !bg-[#F5F8FA] w-[9.3vw]"
                        type="text"
                        placeholder="Other Tests"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleOthersField(
                              e,
                              testPreparations,
                              setTestPreparations
                            );
                          }
                        }}
                      //onBlur={(e) => {
                      //handleOthersField(
                      //  e,
                      //  testPreparations,
                      //   setTestPreparations
                      // );
                      // }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-[10px]">
            <p className="text-[18.6px]  mb-[8px] text-[#24A3D9] !font-medium">
              Subject Tutoring
            </p>
            <div className="grid grid-cols-3 font-medium text-[#26435F] grid-flow-row-dense ">
              {tutoring?.map((item, idx) => {
                return (
                  <div key={idx} className="flex items-center mb-3 mr-8 ">
                    <div className="flex items-center">
                    <SCheckbox
                      checked={item.checked}
                      className="scale-[0.793]"
                      onChange={() =>
                        handleCheckboxChange(item.text, tutoring, setTutoring)
                      }
                    />
                    </div>
                    <p
                      onClick={() =>
                        handleCheckboxChange(item.text, tutoring, setTutoring)
                      }
                      className="font-normal whitespace-nowrap  text-[14px]  leading-5 relative mb-[3px]"
                    >
                      {item.text}
                    </p>
                    {item.text === "Other" && item.checked ? (
                      <input
                        autoFocus
                        className="absolute right-[250px] ml-3 pl-3 text-[13px] text-[#7E7E7E] outline-[#DCDCDD] border-[1.5px] border-[#DCDCDD] rounded-[4px] !bg-[#F5F8FA] w-[23vw]"
                        type="text"
                        placeholder="Other Subjects"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleOthersField(e, tutoring, setTutoring);
                          }
                        }}
                      //onBlur={(e) => {
                      //handleOthersField(e, tutoring, setTutoring);
                      //}}
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
            <p className="text-[18.6px] mb-[7px]  text-[#24A3D9] !font-medium">
              Coaching
            </p>
            <div className="grid grid-cols-3  grid-gap-x-5 font-medium text-[#26435F] grid-flow-row-dense relative">
              {coaching?.map((item, idx) => {
                return (
                  <div key={idx} className="flex items-center  mb-3 mr-6">
                    <SCheckbox
                      checked={item.checked}
                      className="scale-[0.793]"
                      onChange={() =>
                        handleCheckboxChange(item.text, coaching, setCoaching)
                      }
                    />

                    <p
                      onClick={() =>
                        handleCheckboxChange(item.text, coaching, setCoaching)
                      }
                      className="!font-normal whitespace-nowrap  text-[14px]  leading-5 mb-[4px]"
                    >
                      {item.text}
                    </p>
                    {item.text === "Other" && item.checked ? (
                      <input
                        autoFocus
                        className=" text-[13px] text-[#7E7E7E] outline-[#DCDCDD] border-[1.5px] border-[#DCDCDD] rounded-[4px] !bg-[#F5F8FA]  w-32 absolute bottom-3  pl-2"
                        type="text"
                        placeholder="Other"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleOthersField(e, coaching, setCoaching);
                          }
                        }}
                      //onBlur={(e) => {
                      //handleOthersField(e, coaching, setCoaching);
                      //}}
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
        <p className="!border-t-[1.4px] !border-t-[#26435F4D] mt-[-10px]   pt-[20px] pb-2 text-[18.6px] text-[#26435F] tracking-wider font-medium">
          Format of instruction
        </p>

        <div className="grid grid-cols-2 font-medium text-[#26435F] mb-6">
          {instructions?.map((item, idx) => {
            return (
              <div key={idx} className="flex items-center mb-3 mr-1">
                <SCheckbox
                  checked={item.checked}
                  className="scale-[1.064]"
                  onChange={() =>
                    handleCheckboxChange(
                      item.text,
                      instructions,
                      setInstructions
                    )
                  }
                />

                <p
                  onClick={() =>
                    handleCheckboxChange(
                      item.text,
                      instructions,
                      setInstructions
                    )
                  }
                  className="!font-normal  text-base  leading-5 mb-[3px]"
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
        <p className="!border-t-[1.4px] !border-t-[#26435F4D] mt-[-10px]  pt-[20px] pb-2 text-[18.6px] text-[#26435F] tracking-wider font-medium">
          Students Served
        </p>

        <div className="grid grid-cols-2 font-medium text-[#26435F] mb-2">
          {studentserved?.map((item, idx) => {
            return (
              <div key={idx} className="flex items-center mb-3 mr-6">
                <SCheckbox
                  checked={item.checked}
                  className="scale-[1.064]"
                  onChange={() =>
                    handleCheckboxChange(
                      item.text,
                      studentserved,
                      setStudentserved
                    )
                  }
                />
                <p
                  onClick={() =>
                    handleCheckboxChange(
                      item.text,
                      studentserved,
                      setStudentserved
                    )
                  }
                  className="!font-normal whitespace-nowrap text-base  leading-5 mb-[3px]"
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        <p className="!border-t-[1.4px] !border-t-[#26435F4D]   mb-[10px]  pt-[20px]  text-[18.6px] text-[#26435F] tracking-wider font-medium">
          How do you currently process your payments?
        </p>
        <InputSelectNew
          value={values.paymentType}
          parentClassName="w-[208px] "
          optionContainerClassName="text-[18.6px] text-[#667085]"
          optionsEachClassName="py-[6px]"
          optionData={paymentOptions}
          placeholderClass={"!inline-block !overflow-x-auto custom-scroller-2 !w-[150px]  !ml-[-10px] mt-1.5"}
          placeholder={"Options"}
          label={``}

          labelClassname="text-[#26435F] font-bold  mb-1 text-sm "
          inputContainerClassName=" h-[53px] text-[18.6px] border  border-[#D0D5DD] my-0 mt-[-2px] rounded-[5px] text-[#667085]"
          inputClassName="ml-80  "
          onChange={(e) => handlePaymentTypeChange(e)}
        />
      </div>
      <div className="!border-b-[1.4px] !border-b-[#26435F4D] w-[80%] mx-auto"></div>
      <div className="flex  items-center mt-8 justify-between mb-[25px] ">
        <SecondaryButton
          children="Go back"
          className="text-[18.67px]  !py-[12.5px] font-medium !px-[35px] rounded-5 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] "
          onClick={handleBack}
        />
        <PrimaryButton
          children="Next"
          className={`text-[18.67px] bg-[#FFA28D] disabled:opacity-60 !py-[12.5px] font-medium !px-[51.5px] rounded-5 !text-white   relative 
           
          `}
          onClick={() => handleSubmit()}
        // disabled={disabled}
        />
      </div>
    </div>
  );
}
