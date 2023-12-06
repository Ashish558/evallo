import InputField from "../../../components/InputField/inputField";
import InputSelectNew from "../../../components/InputSelectNew/InputSelectNew";
import RadioUnselected from "../../../assets/icons/radioUnChecked2.svg";
import RadioSelected from "../../../assets/icons/radioChecked2.svg";
import { Country, State } from "country-state-city";
import { useEffect } from "react";

const stateNames = State.getAllStates().map((state) => state.name);

const countryData = Country.getAllCountries().map((city) => ({
  value: city.name,
  displayValue: city.name,
}));

const countryNames = countryData.map(item => item.displayValue);

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

    useEffect(() => {
      console.log("companyInfo");
      console.log(companyInfo);
    },[]);

    const handleCompanyTypeChange = (e) => {
        setValues({
          ...values,
          companyType: e,
        });
      };

    return (
        <div
            className={`pt-[44px] pb-[43.67px] h-full w-full ${className}`}
        >
            <InputField
                placeholder="Business Name"
                parentClassName="text-xs"
                label="Name of Business"
                labelClassname="text-[#26435F] font-semibold text-[18.67px]"
                inputContainerClassName=" border border-[#D0D5DD] mt-[6px] rounded-md py-[9px] h-[54px] text-md w-[999.99px]"
            
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

            <p className="text-[18.67px]  font-semibold mb-[0px] mt-[30px] text-[#26435F]">
                {" "}
                Account Type:{" "}
            </p>
            <div className="flex items-center mt-[15px] text-xs">
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
                            ? "text-[#FFA28D] font-[500] "
                            : "text-[#7C98B6] font-[400]"
                        } text-[18.67px] `}
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
                            ? "text-[#FFA28D] font-[500] "
                            : "text-[#7C98B6] font-[400]"
                        } text-[18.67px] `}
                      >
                        {" "}
                        Company{" "}
                      </p>
                    </button>
                    
            </div>

            <InputSelectNew
                value={companyInfo.businessEntity}
                parentClassName="mt-[30px] w-full"
                optionContainerClassName="text-[13px] "
                optionsEachClassName="py-[7px]"
                optionData={companyType}
                placeholder={"Select"}
                label={`Business Entity`}
                labelClassname="text-[#26435F] font-bold  mb-1 text-[18.67] "
                inputContainerClassName="py-1 text-sm h-[52.98px] w-[1000px] border  border-[#D0D5DD] my-0 mt-[7.37px] rounded-[2px]"
                inputClassName="ml-80"
                // required={persona === "student" ? true : false}
                onChange={(e) => handleCompanyTypeChange(e)}
            />

            <InputField
                placeholder=""
                parentClassName="mt-[31.33px] text-xs"
                label="Website"
                labelClassname="text-[#26435F] text-[18.67px] font-semibold"
                inputContainerClassName=" border border-[#D0D5DD] mt-[8px] rounded-md py-[9px] h-[54px] w-[1000px] text-md"
            
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
                parentClassName="mt-[30px] text-xs"
                label="Street Address"
                labelClassname="text-[#26435F] text-[18.67px] font-semibold"
                inputContainerClassName=" border border-[#D0D5DD] mt-[8px] rounded-md py-[9px] h-[54px] w-[1000px] text-md"
            
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

            <div className="flex items-center justify-between mt-[29.67px] w-full" >
                <InputSelectNew
                    value={companyInfo.country}
                    parentClassName="w-[300px]"
                    optionContainerClassName="text-[13px] "
                    optionsEachClassName="py-[7px]"
                    optionData={countryNames}
                    placeholder={"Select"}
                    label={`Country`}
                    labelClassname="text-[#26435F]  font-bold text-[18.67px] "
                    inputContainerClassName="text-sm h-[54px] w-[300px] mt-[8px] border  border-[#D0D5DD] rounded-[2px]"
                    inputClassName="ml-80"
                    // required={persona === "student" ? true : false}
                    onChange={(e) => {
                      SetCompanyInfo((prev) => {
                        return {
                          ...prev,
                          country: e
                        }
                      })
                    }}
                />

                <InputSelectNew
                    value={companyInfo.state}
                    parentClassName="w-[250px]"
                    optionContainerClassName="text-[13px] w-1/4"
                    optionsEachClassName="py-[7px]"
                    optionData={stateNames}
                    placeholder={"Select"}
                    label={`State`}
                    labelClassname="text-[#26435F] font-bold text-[18.67px] "
                    inputContainerClassName="text-sm h-[54px] w-[250px] mt-[8.33px] border  border-[#D0D5DD] rounded-[2px]"
                    inputClassName="ml-80"
                    // required={persona === "student" ? true : false}
                    onChange={(e) => {
                      SetCompanyInfo((prev) => {
                        return {
                          ...prev,
                          state: e
                        }
                      })
                    }}
                />

                <InputField
                    placeholder=""
                    parentClassName="text-xs w-[200px]"
                    label="City"
                    labelClassname="text-[#26435F] text-[18.67px] font-semibold"
                    inputContainerClassName=" border border-[#D0D5DD] mt-[8px] rounded-md py-[9px] h-[54px] w-[200px] text-md"
                
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
                    parentClassName="text-xs w-[150px]"
                    label="Zip Code"
                    labelClassname="text-[#26435F] text-[18.67px] font-semibold"
                    inputContainerClassName=" border border-[#D0D5DD] mt-[8px] rounded-md py-[9px] h-[54px] w-[150px] text-md"
                    type="number"
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