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
      <div className="grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5 content-center	">
        <div>
          <InputField
            label="Question"
            labelClassname="ml-4 mb-0.5"
            placeholder="Question"
            parentClassName="w-full mr-4"
            type="text"
            inputContainerClassName={'bg-[#f2f2f2]'}
            inputClassName={'bg-[#f2f2f2]'}
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

        <div className="flex items-end">
          <InputSelect
            value={newQuestion.type}
            inputContainerClassName={'bg-[#f2f2f2] '}
            inputClassName={'bg-[#f2f2f2]'}
            labelClassname="hidden"
            parentClassName="w-[200px] mr-5"
            optionData={["Paragraph", "Checkboxes"]}
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
        <div className="px-1 flex flex-col gap-y-1" >
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
