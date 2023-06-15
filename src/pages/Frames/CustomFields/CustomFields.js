import React, { useEffect } from "react";
import InputField from "../../../components/InputField/inputField";
import InputSelect from "../../../components/InputSelect/InputSelect";

export default function CustomFields({
  setcurrentStep,
  customFields,
  setCustomFields,
}) {
  useEffect(() => {
    setcurrentStep(3);
  }, []);

  const handleChange = (_id, value) => {
    const temp = customFields.map((item) => {
      if (item._id === _id) {
        return {
          ...item,
          value,
        };
      } else {
        return item;
      }
    });
    setCustomFields(temp);
  };
  return (
    <div className="w-full flex flex-col gap-y-4 max-w-[300px]">
      {customFields.map((item) => {
        return (
          <div key={item._id}>
            {item.dataType === "String" ? (
              <InputField
                label={item.name}
                required={true}
                placeholder={item.name}
                parentClassName="w-full"
                inputClassName="bg-transparent text-xs"
                type="text"
                value={item.value}
                onChange={(e) => handleChange(item._id, e.target.value)}
              />
            ) : (
              <InputSelect
                required={true}
                value={item.value}
                label={item.name}
                labelClassname="ml-3"
                onChange={(val) => handleChange(item._id, val)}
                optionData={item.Values}
                inputContainerClassName="border text-xs"
                placeholder="Select"
                parentClassName="w-full"
                type="select"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
