import React from "react";
import Header from "./Header";
import InputField from "../../../../components/InputField/inputField";
import { useState } from "react";
import searchIcon from "../../../../assets/icons/Search.png";
import uploadIcon from "../../../../assets/icons/upload.png";
import { frameHeaderNames, framesData } from "./staticData";
import FramesScreen from "./FramesScreen";
import arrowDown from "../../../../assets/icons/arrowdown.svg"
const AllOrgs = () => {
  const [values, setValues] = useState({
    search: "",
    joinDate: "",
    orgType: "",
    region: "",
    subscription: "",
    numberOfStudent: "",
  });
  const [error, setError] = useState({
    search: "",
    joinDate: "",
    orgType: "",
    region: "",
    subscription: "",
    numberOfStudent: "",
  });
  return (
    <>
      <Header />

      <div className="pl-16 pt-7">
        <h4 className="text-[#24A3D9]">All Orgs</h4>
        <div className="flex justify-between py-5">
          <div className="w-full flex gap-5 ">
            <InputField
              placeholder="search"
              parentClassName="text-xs bg-white"
              Icon={searchIcon}
              value={values.search}
              onChange={(e) =>
                setValues({
                  ...values,
                  search: e.target.value,
                })
              }
              error={error.search}
            />
            <InputField
              placeholder="Org type"
              parentClassName="text-xs bg-white"
              value={values.orgType}
              onChange={(e) =>
                setValues({
                  ...values,
                  orgType: e.target.value,
                })
              }
              error={error.orgType}
            />
            <InputField
              placeholder="Join Date"
              parentClassName="text-xs bg-white"
              value={values.joinDate}
              onChange={(e) =>
                setValues({
                  ...values,
                  joinDate: e.target.value,
                })
              }
              error={error.joinDate}
            />
            <InputField
              placeholder="Region"
              parentClassName="text-xs bg-white"
              value={values.region}
              onChange={(e) =>
                setValues({
                  ...values,
                  region: e.target.value,
                })
              }
              error={error.region}
            />
            <InputField
              placeholder="Subscription"
              parentClassName="text-xs bg-white"
              value={values.subscription}
              onChange={(e) =>
                setValues({
                  ...values,
                  subscription: e.target.value,
                })
              }
              error={error.subscription}
            />
            <InputField
              placeholder="# of student"
              parentClassName="text-xs bg-white"
              value={values.numberOfStudent}
              onChange={(e) =>
                setValues({
                  ...values,
                  numberOfStudent: e.target.value,
                })
              }
              error={error.numberOfStudent}
            />
          </div>
          <div className="w-[400px] flex justify-center  items-center">
            <button
              type="button"
              className="flex rounded-md gap-2 bg-[#517CA8] text-sm p-2 px-5 text-white"
            >
              Export <img className="h-4" src={uploadIcon} />
            </button>
          </div>
        </div>
        <div className="flex flex-col overflow-x-auto">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500 ">
                    <tr className="px-3">
                      {frameHeaderNames.map((name, id) => {
                        return (
                          <th scope="col" className="px-3 min-w-[140px] py-4 text-center" key={id}>
                            {name}
                            <img src={arrowDown} alt={'down'} className="ml-1 inline" />
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <FramesScreen data={framesData} />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllOrgs;

/*
 

*/
