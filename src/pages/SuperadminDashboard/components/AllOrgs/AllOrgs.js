import React, { useRef } from "react";

import InputField from "../../../../components/InputField/inputField";
import { useState } from "react";
import searchIcon from "../../../../assets/icons/Search.png";
import uploadIcon from "../../../../assets/icons/upload.png";
import { frameHeaderNames, framesData } from "./staticData";
import FramesScreen from "./FramesScreen";
import arrowDown from "../../../../assets/icons/arrowdown.svg";
import { useEffect } from "react";
import Table from "../../../../components/Table/Table";

import InputSelect from "../../../../components/InputSelect/InputSelect";
import { useLazyGetAllOrgQuery } from "../../../../app/services/superAdmin";
import LoaderNew from "../../../../components/Loader/LoaderNew";
import { CSVLink } from "react-csv";
import { csvHeaderNames, csvHeaders } from "../../../Users/csvUtlis";
const AllOrgs = () => {
  const [adminData, setAdminData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const inputRef = useRef(null);
  const [country, setCountry] = useState([]);
  const [fetchAllOrgQuery, fetchAllOrgQueryStatus] = useLazyGetAllOrgQuery();
  const [csvData, setCsvData] = useState([]);
  const [csvLoad, setCsvLoad] = useState(false);
  const [successFetched, setsuccessFetched] = useState(false);
  const handleBulkExport = async () => {
   
    if(adminData?.length>0){
      setCsvLoad(true);
        let result =adminData;

        if (result) {
          let arr = [];
          result?.forEach((item) => {
            let obj = {};

            obj.name = item.associatedOrg?.company
                ? item.associatedOrg?.company
                : item.company
            obj.type = item.associatedOrg?.companyType
            obj.address =item.associatedOrg?.address;
            obj.city =item.associatedOrg?.city
            obj.state = item.associatedOrg?.state
            obj.country = item.associatedOrg?.country
            obj.firstName = item.firstName
            obj.email =item.email
            obj.phone = item.phone
            obj.userStatus =item?.userStatus
            obj.tutors= item.associatedOrg?.numberOfTutors
            obj.student=item.associatedOrg?.numberOfActiveStudent
            obj.contributor="contributors"
            arr.push(obj);
          });
          setCsvData(arr);
        }
        setsuccessFetched(true);
        setCsvLoad(false);
      }
     
  };
  const [values, setValues] = useState({
    search: "",
    joinDate: "",
    orgType: "",
    region: "",
    subscription: "",
    numberOfStudent: "",
  });
  const orgType = [
    "None",
    "Sole proprietorship",
    "Partnership",
    " Limited liability company (LLC)",
    " C Corporation",
    "S Corporation",
    "B Corporation",
    " Close corporation",
    " Nonprofit corporation",
    "Cooperative",
    "Private Limited Company",
    "Public",
  ];
  const [error, setError] = useState({
    search: "",
    joinDate: "",
    orgType: "",
    region: "",
    subscription: "",
    numberOfStudent: "",
  });
  useEffect(() => {
    if (country.length === 0) {
      fetch("countryData.json")
        .then((res) => res.json())
        .then((data) => setCountry([{name:'None'},...data]));
    }
    fetchAllOrgQuery()
      .then((result) => {
        setFetchedData(result.data.admins);
      })
      .catch((e) => {
        console.error(e.response?.data?.message);
      });
  }, []);
  useEffect(() => {
    let arr = JSON.parse(JSON.stringify(fetchedData));
    arr = arr.filter((it) => {
      let v = [];
      v.push(it?.company?.toLowerCase()?.includes(values.search?.toLowerCase()));

      v.push(it?.createdAt?.toLowerCase()?.includes(values.joinDate?.toLowerCase()));

      v.push(
        it?.associatedOrg?.companyType?.toLowerCase()?.includes(values.orgType?.toLowerCase())
      );

      v.push(
        it?.associatedOrg?.country?.toLowerCase()?.includes((values.region?.toLowerCase()))
      );
      v.push(it?.subscriptionCode?.contains(values.subscription?.toLowerCase()));
      v.push(
        it?.associatedOrg?.numberOfActiveStudent
          ?.toLowerCase()
          ?.includes(values.numberOfStudent?.toLowerCase())
      );
      let fl = true;
      for (let i of v) {
        if (i === true || i === false) fl = fl && i;
      }

      return fl;
    });
    console.log({ arr });
    setAdminData(arr);
  }, [values, fetchedData]);
  
  return (
    <>
      <div className="pl-16 pt-7 mb-12">
        <h4 className="text-[#24A3D9]">All Orgs</h4>
        <div className="flex justify-between py-5 ">
          <div className="w-full flex gap-5 items-center ">
            <InputField
              placeholder="search"
              parentClassName="text-xs "
              inputContainerClassName="bg-white  shadow-[0px_0px_2.6666667461395264px_0px_#00000040] "
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
              parentClassName="text-xs "
              value={values.orgType}
              optionData={orgType}
              inputContainerClassName="bg-white  shadow-[0px_0px_2.6666667461395264px_0px_#00000040] "
              optionClassName="min-w-[90px] py-[2.5px]"
              onChange={(e) =>
                setValues({
                  ...values,
                  orgType: e!=="None"?e:'',
                })
              }
              error={error.orgType}
            />
            <InputField
              placeholder="Join Date"
              refS={inputRef}
              onBlur={(e) => (inputRef.current.type = "text")}
              onFocus={(e) => (inputRef.current.type = "date")}
              parentClassName="text-xs "
              inputContainerClassName="bg-white shadow-[0px_0px_2.6666667461395264px_0px_#00000040]"
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
              inputContainerClassName="bg-white shadow-[0px_0px_2.6666667461395264px_0px_#00000040]"
              optionData={country}
              optionType={"object"}
              optionClassName="min-w-[90px] py-[2.5px]"
              value={values.region}
              onChange={(e) =>
                setValues({
                  ...values,
                  region:  e.name!=="None"?e.name:'',
                })
              }
              error={error.region}
            />
            <InputSelect
              placeholder="Subscription"
              parentClassName="text-xs "
              inputContainerClassName="bg-white shadow-[0px_0px_2.6666667461395264px_0px_#00000040]"
              optionClassName="min-w-[90px] py-[2.5px]"
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
              inputContainerClassName="bg-white shadow-[0px_0px_2.6666667461395264px_0px_#00000040]"
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
            
            <button className="flex rounded-md gap-2 bg-[#517CA8] text-sm p-3 px-5 text-white">
              {csvLoad ? <LoaderNew /> : ""}
              {!csvLoad && !successFetched ? (
                <p onClick={handleBulkExport}>Export Data</p>
              ) : (
                ""
              )}

              {csvData.length > 0 && successFetched && (
                <CSVLink
                  filename={"Evallo_AllOrg_Data.csv"}
                  data={csvData}
                  headers={csvHeaderNames}
                  onClick={(event, done) => {
                    setCsvData([]);
                    setsuccessFetched(false);
                  }}
                >
                  {" "}
                  Download File{" "}
                </CSVLink>
              )}

              {!csvLoad && (
               <img className="h-4" src={uploadIcon} alt="upload"/>
              )}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-content scroll-mt-3 pr-7">
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
