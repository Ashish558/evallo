import React from "react";

import InputField from "../../../../components/InputField/inputField";
import { useState } from "react";
import searchIcon from "../../../../assets/icons/search.svg";
import uploadIcon from "../../../../assets/icons/uil_export.svg";
import calendar from "../../../../assets/icons/calendar.svg";
import { frameHeaderNames, framesData } from "./staticData";
import FramesScreen from "./FramesScreen";
import arrowDown from "../../../../assets/icons/arrowdown.svg";
import { useEffect } from "react";
import Table from "../../../../components/Table/Table";

import InputSelect from "../../../../components/InputSelect/InputSelect";
import { useLazyGetAllOrgQuery } from "../../../../app/services/superAdmin";
const AllOrgs = () => {
  const [adminData, setAdminData] = useState([]);
  const [fetchAllOrgQuery, fetchAllOrgQueryStatus] = useLazyGetAllOrgQuery();
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
  useEffect(() => {
    fetchAllOrgQuery()
      .then((result) => {
        setAdminData(result.data.admins);
      })
      .catch((e) => {
        console.error(e.response?.data?.message);
      });
  }, []);

  return (
    <>
      <div className="pl-16 pt-7 mb-12">
        <h4 className="text-[#24A3D9]">All Orgs</h4>
        <div className="flex justify-between py-5 ">
          <div className="w-full flex gap-5 items-center">
            <InputField
              placeholder="Search"
              parentClassName="text-xs text-[#667085]"
              inputContainerClassName="bg-white"
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
            <InputSelect
              placeholder="Org type"
              parentClassName="text-xs text-[#667085]"
              value={values.orgType}
              inputContainerClassName="bg-white mb-1"
              optionClassName="min-w-[90px] py-[3px]"
              onChange={(e) =>
                setValues({
                  ...values,
                  orgType: e,
                })
              }
              error={error.orgType}
            />
            <InputField
              IconLeft={calendar}
              placeholder="Join Date"
              parentClassName="text-xs text-[#667085]"
              inputContainerClassName="bg-white"
              value={values.joinDate}
              onChange={(e) =>
                setValues({
                  ...values,
                  joinDate: e.target.value,
                })
              }
              error={error.joinDate}
            />
            <InputSelect
              placeholder="Region"
              parentClassName="text-xs text-[#667085]"
              inputContainerClassName="bg-white mb-1"
              optionData={["a", "b", "c", "d", "e", "f", "g", "h", "i"]}
              optionClassName="min-w-[90px] py-[2.5px]"
              value={values.region}
              onChange={(e) =>
                setValues({
                  ...values,
                  region: e,
                })
              }
              error={error.region}
            />
            <InputSelect
              placeholder="Subscription"
              parentClassName="text-xs text-[#667085]"
              inputContainerClassName="bg-white mb-1 "
              optionClassName="min-w-[90px] py-[2.6px]"
              value={values.subscription}
              onChange={(e) =>
                setValues({
                  ...values,
                  subscription: e,
                })
              }
              error={error.subscription}
            />
            <InputField
              placeholder="# of student"
              parentClassName="text-xs text-[#667085]"
              inputContainerClassName="bg-white"
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
              className="flex rounded-md gap-2 bg-[#517CA8] text-sm p-3 px-8 text-white"
            >
              Export <img className="h-4" src={uploadIcon} alt="export" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-content scroll-mt-3 pr-7 mt-2" >
          <Table
            data={adminData}
            tableHeaders={frameHeaderNames}
            maxPageSize={10}
            dataFor="allOrgs"
            excludes={["_id"]}
          />
        </div>

      </div>
    </>
  );
};

export default AllOrgs;

/*
 

*/
