import React from "react";
import InputField from "../../../components/InputField/inputField";
import InputSelect from "../../../components/InputSelect/InputSelect";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import AddTag from "../../../components/Buttons/AddTag";
import CheckboxIcon from "../../../assets/icons/square.svg";

export default function AddNewQuestion({ newQuestion, setNewQuestion }) {
  const addValue = (value) => {
    setNewQuestion({
      ...newQuestion,
      values: [...newQuestion.values, value],
    });
  };
  return (
    <div>
      <div className="w-full flex gap-8 mb-10 content-center 	">
        <div className="w-[60%]">
          <InputField
            label="Question"
            labelClassname=" mb-1 text-[#26435F]  text-base-20"
            placeholder="Question"
            parentClassName="w-full mr-4"
            type="text"
            inputContainerClassName={"bg-[#f2f2f2] !py-[15px]"}
            inputClassName={"bg-[#f2f2f2]"}
            value={newQuestion.text}
            isRequired={true}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                text: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-end flex-1 w-[40%]">
          <InputSelect
            value={newQuestion.type}
            inputContainerClassName={"bg-[#f2f2f2] "}
            inputClassName={"bg-[#f2f2f2]"}
            labelClassname="hidden"
            parentClassName="w-full mr-5"
            optionData={["Paragraph", "String", "Dropdown", "Checkboxes"]}
            onChange={(val) =>
              setNewQuestion({
                ...newQuestion,
                type: val,
              })
            }
          />
        </div>
      </div>
      {newQuestion.type === "Checkboxes" && (
        <div className="px-1 flex flex-col gap-y-1">
          {newQuestion.values.map((item, idx) => {
            return (
              <div className="flex items-center gap-x-3">
                <img src={CheckboxIcon} alt="checkbox" />
                <p>{item}</p>
              </div>
            );
          })}
        </div>
      )}
      {newQuestion.type === "Checkboxes" && (
        <>
          {/* <div className="grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-4 mb-5 content-center	">
            <InputField
              label="Option 1"
              labelClassname="ml-4 mb-0.5"
              placeholder="Option 1"
              parentClassName="w-full mr-4"
              type="text"
              inputContainerClassName={"bg-[#f2f2f2]"}
              inputClassName={"bg-[#f2f2f2]"}
              value={newQuestion.values.option1}
              isRequired={true}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  values: { ...newQuestion.values, option1: e.target.value },
                })
              }
            />
          </div> */}
          <AddTag
            className="pl-3 pr-3 pt-1.4 pb-1.5 mt-5 bg-primary text-white"
            text="Add option"
            onAddTag={addValue}
          />
        </>
      )}
    </div>
  );
}
