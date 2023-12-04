import InputField from "../../../components/InputField/inputField";
import InputSelectNew from "../../../components/InputSelectNew/InputSelectNew";
import RadioUnselected from "../../../assets/icons/radioUnChecked2.svg";
import RadioSelected from "../../../assets/icons/radioChecked2.svg";

const companyType = [
    "Sole proprietorship",
    "Partnership",
    "Limited liability company (LLC)",
    "C Corporation",
    "S Corporation",
    "B Corporation",
    "Close corporation",
    "Nonprofit corporation",
    "Cooperative",
    "Private Limited Company",
    "Public",
    "Other",
  ];

function OrgDetailsForm({
    className,
    values,
    setValues,
    companyInfo,
    SetCompanyInfo,
}) {

    const handleCompanyTypeChange = (e) => {
        setValues({
          ...values,
          companyType: e,
        });
      };

    return (
        <div
            className={`pt-[30px] h-full w-full ${className}`}
        >
            <InputField
                placeholder="Business Name"
                parentClassName="text-xs"
                label="Name of Business"
                labelClassname="text-[#26435F] font-semibold"
                inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
            
                value={companyInfo.nameOfBusiness}
                onChange={(e) =>
                    /* setValues({
                        ...values,
                        firstName: e.target.value,
                    })
 */
                    SetCompanyInfo(values => {
                      return {
                        ...values,
                        nameOfBusiness: e.target.value
                      }
                    })
                }
                // totalErrors={error}
                // error={error.firstName}
            />

            <p className="text-[15px]  font-semibold mb-[0px] mt-[10px] text-[#26435F]">
                {" "}
                Account Type:{" "}
            </p>
            <div className="flex items-center text-xs">
                  <button
                      className="flex mr-6  items-center cursor-pointer"
                      onClick={() =>
                        /* setValues((prev) => ({
                          ...prev,
                          registrationAs: "Individual",
                        })) */

                        SetCompanyInfo((prev) => ({
                          ...prev,
                          accountType: "Individual"
                        }))
                      }
                    >
                      {/* <input type="radio" defaultChecked={values.registrationAs === "Individual"
                            ? true
                            : false} className="w-3 h-3"/> */}
                      <div className="w-[30px]  flex justify-center">
                        <img
                          src={
                            companyInfo.accountType === "Individual"
                              ? RadioSelected
                              : RadioUnselected
                          }
                          alt="radio"
                          className=" mr-3"
                        />
                      </div>

                      <p
                        className={`${
                          companyInfo.accountType === "Individual"
                            ? "text-[#FFA28D] font-semibold "
                            : "text-[#7C98B6] font-[400]"
                        } text-[14px] `}
                      >
                        {" "}
                        Individual{" "}
                      </p>
                    </button>
                    <button
                      className="flex items-center cursor-pointer"
                      onClick={() =>
                        /* setValues((prev) => ({
                          ...prev,
                          registrationAs: "Company",
                        })) */

                        SetCompanyInfo((prev) => ({
                          ...prev,
                          accountType: "Company"
                        }))
                      }
                    >
                      {/* <input type="radio"  defaultChecked={values.registrationAs === "Company"
                            ? true
                            : false}  className="w-3 h-3"/> */}
                      <div className="w-[30px] flex justify-center">
                        <img
                          src={
                            companyInfo.accountType === "Company"
                              ? RadioSelected
                              : RadioUnselected
                          }
                          alt="radio"
                          className="mr-3 p-0"
                        />
                      </div>
                      <p
                        className={`${
                          companyInfo.accountType === "Company"
                            ? "text-[#FFA28D] font-semibold "
                            : "text-[#7C98B6] font-[400]"
                        } text-[14px] `}
                      >
                        {" "}
                        Company{" "}
                      </p>
                    </button>
                    
            </div>

            <InputSelectNew
                value={companyInfo.businessEntity}
                parentClassName="mt-[10px] w-full"
                optionContainerClassName="text-[13px] "
                optionsEachClassName="py-[7px]"
                optionData={companyType}
                placeholder={"Select"}
                label={`Business Entity`}
                labelClassname="text-[#26435F] font-bold  mb-1 text-sm "
                inputContainerClassName="py-1 text-sm h-[44.9px] border  border-[#D0D5DD] my-0 mt-[-2px] rounded-[2px]"
                inputClassName="ml-80"
                // required={persona === "student" ? true : false}
                onChange={(e) => handleCompanyTypeChange(e)}
            />

            <InputField
                placeholder=""
                parentClassName="mt-[10px] text-xs"
                label="Website"
                labelClassname="text-[#26435F] font-semibold"
                inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
            
                value={companyInfo.website}
                onChange={(e) =>
                    /* setValues({
                        ...values,
                        firstName: e.target.value,
                    }) */

                    SetCompanyInfo((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                }
                // totalErrors={error}
                // error={error.firstName}
            />

            <InputField
                placeholder=""
                parentClassName="mt-[10px] text-xs"
                label="Street Address"
                labelClassname="text-[#26435F] font-semibold"
                inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
            
                value={companyInfo.streetAddress}
                onChange={(e) =>
                    /* setValues({
                        ...values,
                        firstName: e.target.value,
                    }) */

                    SetCompanyInfo((prev) => ({
                      ...prev,
                      streetAddress: e.target.value,
                    }))
                }
                // totalErrors={error}
                // error={error.firstName}
            />

            <div className="flex items-center justify-between mt-[10px] w-full" >
                <InputSelectNew
                    value={companyInfo.country}
                    parentClassName="w-3/12"
                    optionContainerClassName="text-[13px] "
                    optionsEachClassName="py-[7px]"
                    optionData={companyType}
                    placeholder={"Select"}
                    label={`Country`}
                    labelClassname="text-[#26435F] font-bold text-sm "
                    inputContainerClassName="text-sm h-[40px] border  border-[#D0D5DD] rounded-[2px]"
                    inputClassName="ml-80"
                    // required={persona === "student" ? true : false}
                    // onChange={(e) => handleCompanyTypeChange(e)}
                />

                <InputSelectNew
                    value={companyInfo.state}
                    parentClassName="w-1/4"
                    optionContainerClassName="text-[13px] w-1/4"
                    optionsEachClassName="py-[7px]"
                    optionData={companyType}
                    placeholder={"Select"}
                    label={`State`}
                    labelClassname="text-[#26435F] font-bold text-sm "
                    inputContainerClassName="text-sm h-[40px] border  border-[#D0D5DD] rounded-[2px]"
                    inputClassName="ml-80"
                    // required={persona === "student" ? true : false}
                    // onChange={(e) => handleCompanyTypeChange(e)}
                />

                <InputField
                    placeholder=""
                    parentClassName="text-xs w-1/5"
                    label="City"
                    labelClassname="text-[#26435F] font-semibold"
                    inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
                
                    value={companyInfo.city}
                    onChange={(e) =>
                        /* setValues({
                            ...values,
                            firstName: e.target.value,
                        }) */

                        SetCompanyInfo((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                    }
                    // totalErrors={error}
                    // error={error.firstName}
                />

                <InputField
                    placeholder=""
                    parentClassName="text-xs w-2/12"
                    label="Zip Code"
                    labelClassname="text-[#26435F] font-semibold"
                    inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
                
                    value={companyInfo.zipcode}
                    onChange={(e) =>
                        /* setValues({
                            ...values,
                            firstName: e.target.value,
                        }) */

                        SetCompanyInfo((prev) => ({
                          ...prev,
                          zipcode: e.target.value,
                        }))
                    }
                    // totalErrors={error}
                    // error={error.firstName}
                />
            </div>
        </div>
    )
}

export default OrgDetailsForm;