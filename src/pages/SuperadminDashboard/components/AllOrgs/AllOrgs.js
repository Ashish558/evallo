import React from "react";

import InputField from "../../../../components/InputField/inputField";
import { useState } from "react";
import searchIcon from "../../../../assets/icons/Search.png";
import uploadIcon from "../../../../assets/icons/upload.png";
import { frameHeaderNames, framesData } from "./staticData";
import FramesScreen from "./FramesScreen";
import arrowDown from "../../../../assets/icons/arrowdown.svg"
import { useEffect } from "react";
import axios from 'axios'
import Table from "../../../../components/Table/Table";

import InputSelect from "../../../../components/InputSelect/InputSelect";
const AllOrgs = () => {
  const [adminData,setAdminData]=useState([])
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
  useEffect(()=>{
    const fetchAllOrgs = async () => {
     
      try {
        
        //   alert(data.workemail)
        let result = await axios.get(
          `${process.env.REACT_APP_BASE_URL}api/user/superadmin/getAllOrg`,
          {
            headers: {
              "content-Type": "application/json",
            },
          }
        );
        console.log(result.data.admins);
        setAdminData(result.data.admins)
      } catch (e) {
        console.error(e.response?.data?.message);
        
      }
     
    };
    fetchAllOrgs()
  },[])

  return (
    <>
      <div className="pl-16 pt-7 mb-12">
        <h4 className="text-[#24A3D9]">All Orgs</h4>
        <div className="flex justify-between py-5 ">
          <div className="w-full flex gap-5 ">
            <InputField
              placeholder="search"
              parentClassName="text-xs "
              inputContainerClassName='bg-white'
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
              parentClassName="text-xs"
              value={values.orgType}
              inputContainerClassName="bg-white "
              optionClassName="min-w-[90px] py-[1.5px]"
              onChange={(e) =>
                setValues({
                  ...values,
                  orgType: e,
                })
              }
              error={error.orgType}
            />
            <InputField
              placeholder="Join Date"
              parentClassName="text-xs "
              inputContainerClassName='bg-white'
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
              parentClassName="text-xs "
              inputContainerClassName='bg-white'
              optionData={['a','b','c','d','e','f','g','h','i']}
              optionClassName="min-w-[90px] py-[1.5px]"
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
              parentClassName="text-xs "
              inputContainerClassName='bg-white'
              optionClassName="min-w-[90px] py-[1.5px]"
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
              parentClassName="text-xs "
              inputContainerClassName='bg-white'
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
        <Table data={adminData} tableHeaders={frameHeaderNames} maxPageSize={10} dataFor='allOrgs' excludes={['_id']} />
      </div>
    </>
  );
};

export default AllOrgs;

/*
 

*/
