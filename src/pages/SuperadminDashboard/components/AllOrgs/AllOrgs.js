import React, { useRef } from "react";

import InputField from "../../../../components/InputField/inputField";
import { useState } from "react";
import searchIcon from "../../../../assets/icons/Search_orgs.svg";
import uploadIcon from "../../../../assets/icons/uil_export.svg";
import calendar from "../../../../assets/icons/calendar.svg";
import { frameHeaderNames, framesData } from "./staticData";
import FramesScreen from "./FramesScreen";
import arrowDown from "../../../../assets/icons/arrowdown.svg";
import { useEffect } from "react";
import DateIcon from "../../../../assets/icons/allOrgs_calender_icon.svg"
import Table from "../../../../components/Table/Table";

import InputSelect  from "../../../../components/InputSelect/InputSelect";
import { useLazyGetAllOrgQuery } from "../../../../app/services/superAdmin";
import LoaderNew from "../../../../components/Loader/LoaderNew";
import { CSVLink } from "react-csv";
import { csvHeaderNames, csvHeaders } from "../../../Users/csvUtlis";
import { useSelector } from "react-redux";
import RangeDate from "../../../../components/RangeDate/RangeDate";
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
  const orgType=[
    "Individual",
    "Company",
    "None"
  ]
  const orgType2 = [
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
  const [refetch,setRefetch]=useState(false)
  const handleRefetch=()=>{
    setRefetch(!refetch);
  }
  const convertDateToRange = (startDate) => {
    let startD = startDate.split("-")[0];

    startD = new Date(startD);
    startD = startD.setDate(startD.getDate() + 1);
    startD = new Date(startD).toISOString().split("T")[0];

    let endD = startDate.split("-")[1];
    endD = new Date(endD);
    endD = endD.setDate(endD.getDate() + 1);
    endD = new Date(endD).toISOString().split("T")[0];
    const body = { startDate: startD, endDate: endD };

    return body;
  };
  const handleDataRange=(startDate)=>{
    const body = convertDateToRange(startDate);
    let arr = JSON.parse(JSON.stringify(fetchedData));
    console.log(values,arr)
    arr = arr.filter((it) => {
      
    
     if(it?.createdAt && new Date(it?.createdAt) <= new Date(body.endDate) && new Date(it?.createdAt) >= new Date(body.startDate)){
       return true
     }
     else return false

    });
    console.log({ arr });
    setAdminData(arr);
    console.log("range", body)
  }
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
    setFetchedData([])
    fetchAllOrgQuery()
      .then((result) => {
        let data=result?.data?.admins?result?.data?.admins?.map(it=>it):[]
        console.log({result,data})
       
         data=[...data].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFetchedData(data);
      })
      .catch((e) => {
        console.error(e.response?.data?.message);
      });
  }, [refetch]);
  useEffect(() => {
    let arr = JSON.parse(JSON.stringify(fetchedData));
    console.log(values,arr)
    arr = arr.filter((it) => {
      let v = [];
      v.push(it?.company?.toLowerCase()?.includes(values.search?.toLowerCase()));

      // v.push(it?.createdAt?.toLowerCase()?.includes(values.joinDate?.toLowerCase()));

      v.push(
        it?.registrationAs?.toLowerCase()?.includes(values.orgType?.toLowerCase())
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
  console.log('idhar',{organization,adminData})
  return (
    <>
      <div className=" pt-7 mb-12 max-xl:mt-[20px] max-sm:mt-[40px]">
        <h4 className="pl-[105px] text-[#24A3D9] text-[21.333px] font-normal">All Orgs</h4>
        <div className=" px-[105px] flex items-center justify-between pb-[20px] pt-[33px] ">
          <div className="min-w-[1382.4px] flex w-full  gap-x-[28px]  items-center">
            <InputField
            inputClassName="!text-[#667085] placeholder:!text-[#667085]"
              placeholder="Search"
              parentClassName="!text-[#667085]"
              inputContainerClassName="w-[212.928px] bg-white  border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] !h-[53.3px] !py-1"
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
              inputContainerClassName="w-[186px]  break-words bg-white  !text-wrap  border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] text-xs !h-[53.3px]"
              
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
              placeholder="Join date"
           
              parentClassName=" "
              refS={inputRef}
             
              inputClassName="text-[16px] !text-[#667085] placeholder:!text-[#667085] hidden !w-[100%]"
              inputContainerClassName="bg-white  border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] min-w-[249.6px] !h-[53.3px]"
              value={values.joinDate}
              onChange={(e) =>
                setValues({

                  ...values,
                  joinDate: e.target.value,
                })
              }
              dateBody={
              <div className="ml-[-30px]">
              <RangeDate iconRightClass={"w-[50px] h-[20px] mr-[-20px]"} allorg={true} removeUnderline={true} handleRangeData={handleDataRange}/>
            </div>
            }
              error={error.joinDate}
            />
            
            <InputSelect 
            downArrow22={true}
              placeholder="Region"
              parentClassName="text-xs text-[#667085]"
              inputContainerClassName="w-[186px] bg-white border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] !h-[53.3px] "
              optionData={country}
              optionType={"object"}
              optionClassName="w-[186px] py-[3px] w-[110px] "
              placeholderClass="!whitespace-normal"
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
              inputContainerClassName="w-[186px] bg-white border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] !h-[53.3px]"
              optionClassName="w-[186px] py-[3px] "
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
              placeholder="# of Students"
              parentClassName="w-full !max-w-[186px] py-1 text-[#667085]"
              inputContainerClassName="bg-white border !text-[#667085] !rounded-lg border-[1.33px_solid_#EBEBEB] !h-[53.3px] text-[#667085]"
              optionClassName="w-[186px] py-1"
              inputClassName={"placeholder:!text-[#667085] !w-[186px]"}
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

            <button className="flex rounded-md justify-center gap-2 bg-[#517CA8] !h-[53.3px] w-[172.5px] items-center  text-white text-base-17-5">
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
                <img  src={uploadIcon} className="w" alt="upload" />
              )}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-content scroll-mt-3 ml-[105px] mt-[18px] max-w-[1707px]" >
          <Table
            noArrow={false}
            headerWidth="pl-[2.85px]"
            data={adminData}
            tableHeaders={frameHeaderNames}
            maxPageSize={100}
            handleAllOrgRefetch={handleRefetch}
            dataFor="allOrgs"
            excludes={["_id"]}
            tableClass="table-with-gaps !bg-transparent"
            theadWidth="w-[1708px] rounded-[5.333px]"
            // theadWidth="pl-[73px]"
          />
        </div>
      </div>
    </>
  );
};

export default AllOrgs;

/*
 

*/
