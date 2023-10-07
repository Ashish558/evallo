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
   let check= /[a-z]/i.test(text) ;
   if(!check){
    alert("Enter valid text! " );
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
    <div className="!border-t-[1.5px] !border-t-[#EBEBEB] mt-[-23px] pt-8">
      <div className="mb-4 px-8  ">
        <div className="flex items-center mb-6 ">
          <InputField
            label="Number Of Active Students"
            labelClassname={"!text-sm"}
            biggerText={true}
            placeholder=""
            parentClassName="w-full max-w-[248px] mr-4"
            inputContainerClassName=" border border-[#D0D5DD]"
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
            label="Number Of Tutors"
            labelClassname={"!text-sm"}
            biggerText={true}
            placeholder=""
            parentClassName="w-full max-w-[248px]"
            inputContainerClassName=" border border-[#D0D5DD]"
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
        <p className="!border-t-[1.4px] !border-t-[#26435F4D] mt-[-10px]   pt-4 pb-3 mb-1 text-sm text-[#26435F] tracking-wider font-semibold">
          What services do you provide?
        </p>

        <div className="flex flex-col mb-6">
          <div className="">
            <p className="text-sm mb-[7px] text-[#24A3D9] !font-semibold">
              Test Preparation
            </p>
            <div className="grid grid-cols-3 font-medium text-[#26435F] grid-flow-row-dense mr-5">
              {testPreparations?.map((item, idx) => {
                return (
                  <div key={idx} className="flex items-center mb-3 mr-6">
                    <SCheckbox
                      checked={item.checked}
                      className="scale-[0.7]"
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
                      className="font-medium  text-[13px] opacity-90 leading-5"
                    >
                      {item.text}
                    </p>
                    {item.text === "Others" && item.checked ? (
                      <input
                        autoFocus
                        className="ml-3 text-[13px] text-[#7E7E7E] outline-[#DCDCDD] border-[1.5px] border-[#DCDCDD] rounded-[4px] !bg-[#F5F8FA]  min-w-32 max-w-full"
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
          <div className="">
            <p className="text-sm mt-[7px] mb-[8px] text-[#24A3D9] !font-semibold">
              Subject Tutoring
            </p>
            <div className="grid grid-cols-3 font-medium text-[#26435F] grid-flow-row-dense mr-5">
              {tutoring?.map((item, idx) => {
                return (
                  <div key={idx} className="flex items-center mb-3 mr-8">
                    <SCheckbox
                      checked={item.checked}
                      className="scale-[0.7]"
                      onChange={() =>
                        handleCheckboxChange(item.text, tutoring, setTutoring)
                      }
                    />
                    <p
                      onClick={() =>
                        handleCheckboxChange(item.text, tutoring, setTutoring)
                      }
                      className="font-medium whitespace-nowrap  text-[13px] opacity-90 leading-5"
                    >
                      {item.text}
                    </p>
                    {item.text === "Others" && item.checked ? (
                      <input
                        autoFocus
                        className="ml-3 text-[13px] text-[#7E7E7E] outline-[#DCDCDD] border-[1.5px] border-[#DCDCDD] rounded-[4px] !bg-[#F5F8FA]  min-w-32 max-w-full"
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
            <p className="text-sm mb-[7px] mt-1 text-[#24A3D9] !font-semibold">
              Coaching
            </p>
            <div className="grid grid-cols-3  grid-gap-x-5 font-medium text-[#26435F] grid-flow-row-dense mr-5">
              {coaching?.map((item, idx) => {
                return (
                  <div key={idx} className="flex items-center  mb-3 mr-6">
                    <SCheckbox
                      checked={item.checked}
                      className="scale-[0.7]"
                      onChange={() =>
                        handleCheckboxChange(item.text, coaching, setCoaching)
                      }
                    />

                    <p
                      onClick={() =>
                        handleCheckboxChange(item.text, coaching, setCoaching)
                      }
                      className="font-medium whitespace-nowrap  text-[13px] opacity-90 leading-5"
                    >
                      {item.text}
                    </p>
                    {item.text === "Others" && item.checked ? (
                      <input
                        autoFocus
                        className="ml-3 text-[13px] text-[#7E7E7E] outline-[#DCDCDD] border-[1.5px] border-[#DCDCDD] rounded-[4px] !bg-[#F5F8FA]  w-32"
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
        <p className="!border-t-[1.4px] !border-t-[#26435F4D] mt-[-10px]   pt-4 pb-2 text-sm text-[#26435F] tracking-wider font-semibold">
          Format of instruction
        </p>

        <div className="grid grid-cols-2 font-medium text-[#26435F] mb-6">
          {instructions?.map((item, idx) => {
            return (
              <div key={idx} className="flex items-center mb-3 mr-1">
                <SCheckbox
                  checked={item.checked}
                  className="scale-[0.7]"
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
                  className="font-medium  text-[13px] opacity-90 leading-5"
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
        <p className="!border-t-[1.4px] !border-t-[#26435F4D] mt-[-10px]    pt-4 pb-2 text-sm text-[#26435F] tracking-wider font-semibold">
          Student Served
        </p>

        <div className="grid grid-cols-2 font-medium text-[#26435F]">
          {studentserved?.map((item, idx) => {
            return (
              <div key={idx} className="flex items-center mb-3 mr-6">
                <SCheckbox
                  checked={item.checked}
                  className="scale-[0.7]"
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
                  className="font-medium whitespace-nowrap text-[13px] opacity-90 leading-5"
                >
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        <p className="!border-t-[1.4px] !border-t-[#26435F4D]   mb-3  pt-4  text-sm text-[#26435F] tracking-wider font-semibold">
          How do you currently process your payments?
        </p>
        <InputSelectNew
          value={values.paymentType}
          parentClassName="w-[200px] "
          optionContainerClassName="text-[13px] "
          optionsEachClassName="py-[6px]"
          optionData={paymentOptions}
          placeholderClass={"!inline-block !overflow-x-auto custom-scroller-2 !w-[150px] !py-1 !ml-[-10px]"}
          placeholder={"Options"}
          label={``}
          
          labelClassname="text-[#26435F] font-bold  mb-1 text-sm "
          inputContainerClassName=" py-1 h-[44.9px] text-sm border  border-[#D0D5DD] my-0 mt-[-2px] rounded-[5px]"
          inputClassName="ml-80  "
          onChange={(e) => handlePaymentTypeChange(e)}
        />
      </div>
<div className="!border-b-[1.4px] !border-b-[#26435F4D] w-[80%] mx-auto"></div>
      <div className="flex  items-center mt-8 justify-between ">
        <SecondaryButton
          children="Go Back"
          className="text-sm mr-6 bg-white text-[#a3aDC7] border-[1.5px] border-[#D0D5DD] "
          onClick={handleBack}
        />
        <PrimaryButton
          children="Next"
          className={` w-full bg-[#FFA28D] disabled:opacity-60 max-w-[110px]   rounded !text-white text-sm font-medium relative 
           
          `}
          onClick={() => handleSubmit()}
          // disabled={disabled}
        />
      </div>
    </div>
  );
}
