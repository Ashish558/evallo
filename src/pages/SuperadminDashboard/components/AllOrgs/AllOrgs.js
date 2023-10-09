import React, { useRef } from "react";

import InputField from "../../../../components/InputField/inputField";
import { useState } from "react";
import searchIcon from "../../../../assets/icons/search.svg";
import uploadIcon from "../../../../assets/icons/uil_export.svg";
import calendar from "../../../../assets/icons/calendar.svg";
import { frameHeaderNames, framesData } from "./staticData";
import FramesScreen from "./FramesScreen";
import arrowDown from "../../../../assets/icons/arrowdown.svg";
import { useEffect } from "react";
import DateIcon from "../../../../assets/icons/solar_calendar-date-outline.svg"
import Table from "../../../../components/Table/Table";

import InputSelect  from "../../../../components/InputSelect/InputSelect";
import { useLazyGetAllOrgQuery } from "../../../../app/services/superAdmin";
import LoaderNew from "../../../../components/Loader/LoaderNew";
import { CSVLink } from "react-csv";
import { csvHeaderNames, csvHeaders } from "../../../Users/csvUtlis";
import { useSelector } from "react-redux";
const AllOrgs = () => {
  const [adminData, setAdminData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const inputRef = useRef(null);
  const [forceChange, setForceChange] = useState(false)
  const [country, setCountry] = useState([]);
  const [fetchAllOrgQuery, fetchAllOrgQueryStatus] = useLazyGetAllOrgQuery();
  const [csvData, setCsvData] = useState([]);
  const [csvLoad, setCsvLoad] = useState(false);
  const {organization}= useSelector((state)=>state.organization)
  const [successFetched, setsuccessFetched] = useState(false);
  const handleBulkExport = async () => {

    if (adminData?.length > 0) {
      setCsvLoad(true);
      let result = adminData;
      
      if (result) {
        console.log({result})
        let arr = [];
        result?.forEach((item) => {
          let obj = {};

          obj.name = item.associatedOrg?.company
            ? item.associatedOrg?.company
            : item.company
          obj.type = item.associatedOrg?.companyType
          obj.address = item.associatedOrg?.address;
          obj.city = item.associatedOrg?.city
          obj.state = item.associatedOrg?.state
          obj.country = item.associatedOrg?.country
          obj.firstName = item.firstName
          obj.lastName = item.lastName
          obj.email = item.email
          obj.phone = item.phone
          obj.userStatus = item?.userStatus
          obj.tutors = item.associatedOrg?.numberOfTutors
          obj.student = item.associatedOrg?.numberOfActiveStudent
            obj.parent = item.associatedOrg?.numberOfActiveStudent
          obj.contributor = "contributors"
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
        .then((data) => setCountry([{ name: 'None' }, ...data]));
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
  const handleButtonIcon = (e) => {
    inputRef.current.type = "date";
    setForceChange(!forceChange)

  }
  console.log({organization})
  return (
    <>
      <div className=" pt-7 mb-12">
        <h4 className="pl-[5.46875vw] text-[#24A3D9]">All Orgs</h4>
        <div className=" px-[5.46875vw] flex items-center justify-between py-5 ">
          <div className="w-[72vw] flex min-w-[860px]  gap-x-[1.4583333333vw]  items-center">
            <InputField
            inputClassName="!text-[#667085] placeholder:!text-[#667085]"
              placeholder="Search"
              parentClassName="!text-[#667085]"
              inputContainerClassName="w-[11vw] bg-white  border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] h-[48px]"
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
            downArrow22={true}

              placeholder="Org type"
              parentClassName="  text-[#667085]"
              value={values.orgType}
              optionData={orgType}
              placeholderClass="!break-words  !text-wrap !whitespace-pre-line "
              inputContainerClassName="w-[11.5vw]  break-words bg-white  !text-wrap  border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] text-xs h-[49px]"
              
              optionClassName=" py-[3px]  text-[#667085] font-normal"
              onChange={(e) =>
                setValues({
                  ...values,
                  orgType: e !== "None" ? e : '',
                })
              }
              error={error.orgType}
            />
            <InputField
              placeholder="Join Date"
              IconRight2={inputRef?.current?.type === 'text' ? DateIcon : ''}
              DateIconClick={handleButtonIcon}
              parentClassName=" "
              refS={inputRef}
              onBlur={(e) => { (inputRef.current.type = "text"); setForceChange(!forceChange) }}
              onFocus={(e) => { (inputRef.current.type = "date"); setForceChange(!forceChange) }}
              inputClassName="text-[0.8333333333vw] !text-[#667085] placeholder:!text-[#667085]"
              inputContainerClassName="bg-white border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] w-[11vw] h-[49px]"
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
            downArrow22={true}
              placeholder="Region"
              parentClassName="text-xs text-[#667085]"
              inputContainerClassName="w-[11vw] bg-white border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] h-[49px]"
              optionData={country}
              optionType={"object"}
              optionClassName="w-[11vw] py-[3px] w-[110px]"
              value={values.region}
              onChange={(e) =>
                setValues({
                  ...values,
                  region: e.name !== "None" ? e.name : '',
                })
              }
              error={error.region}
            />
            <InputSelect 
            downArrow22={true}
              placeholder="Subscription"
              optionData={organization?.settings?.subscriptionCode?.map(it=>
                it?.code)}
              parentClassName="text-xs text-[#667085]"
              inputContainerClassName="w-[11vw] bg-white border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] h-[49px]"
              optionClassName="w-[11vw] py-[3px] "
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
              parentClassName="w-full w-[11vw] py-1 text-[#667085]"
              inputContainerClassName="bg-white border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] h-[51px] text-[#667085]"
              optionClassName="w-[11vw] py-1"
              inputClassName={"placeholder:!text-[#667085]"}
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
          <div className="w-[200px] flex justify-end  items-center ">

            <button className="flex rounded-md justify-center gap-2 bg-[#517CA8] h-[49px] w-[8.984375vw] items-center  text-white text-base-17-5">
              {csvLoad ? <LoaderNew /> : ""}
              {!csvLoad && !successFetched ? (
                <p onClick={handleBulkExport}>Export</p>
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
                <img  src={uploadIcon} className="w-5 h-5" alt="upload" />
              )}
            </button>
          </div>
        </div>
        <div className="pl-[5.46875vw] overflow-x-auto scrollbar-content scroll-mt-3 pr-7 mt-2" >
          <Table
            noArrow={false}
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
