import React from "react";
import InputField from "../../../components/InputField/inputField";
import InputSelect from "../../../components/InputSelect/InputSelect";

export default function AddNewQuestion({ newQuestion, setNewQuestion }) {
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
            value={newQuestion.question}
            isRequired={true}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                question: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-end">
          <InputSelect
            value={newQuestion.type}
            labelClassname="hidden"
            parentClassName="w-[200px] mr-5"
            optionData={["String", "Dropdown"]}
            onChange={(val) =>
              setNewQuestion({
                ...newQuestion,
                type: val,
              })
            }
          />
        </div>
      </div>
      {newQuestion.type === "Dropdown" && (
        <div className="grid grid-cols-1 md:grid-cols-2  gap-x-2 md:gap-x-3 gap-y-2 gap-y-4 mb-5 content-center	">
          <InputField
            label="Option 1"
            labelClassname="ml-4 mb-0.5"
            placeholder="Option 1"
            parentClassName="w-full mr-4"
            type="text"
            value={newQuestion.values.option1}
            isRequired={true}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                values: { ...newQuestion.values, option1: e.target.value },
              })
            }
          />
          <InputField
            label="Option 2"
            labelClassname="ml-4 mb-0.5"
            placeholder="Option 2"
            parentClassName="w-full mr-4"
            type="text"
            value={newQuestion.values.option2}
            isRequired={true}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                values: { ...newQuestion.values, option2: e.target.value },
              })
            }
          />
          <InputField
            label="Option 3"
            labelClassname="ml-4 mb-0.5"
            placeholder="Option 3"
            parentClassName="w-full mr-4"
            type="text"
            value={newQuestion.values.option3}
            isRequired={true}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                values: { ...newQuestion.values, option3: e.target.value },
              })
            }
          />
          <InputField
            label="Option 4"
            labelClassname="ml-4 mb-0.5"
            placeholder="Option 4"
            parentClassName="w-full mr-4"
            type="text"
            value={newQuestion.values.option4}
            isRequired={true}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                values: { ...newQuestion.values, option4: e.target.value },
              })
            }
          />
        </div>
      )}
    </div>
  );
}
