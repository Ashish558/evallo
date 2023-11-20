import React from "react";
import icon from "../../../../assets/icons/VectorchevronRight.svg";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUserDetailQuery,
  useLazyGetOrganizationQuery,
} from "../../../../app/services/users";
import { useEffect } from "react";
import ProfileLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";
const About = () => {
  const params = useParams();
  const navigate=useNavigate()
  const { data: userData } = useGetUserDetailQuery({ id: params.id });
  const [fetchOrgData, fetchOrgDataStatus] = useLazyGetOrganizationQuery();
  const [orgData, setOrgData] = useState({});
  useEffect(() => {
    if (userData?.data?.user?.associatedOrg) {
      fetchOrgData(userData?.data?.user?.associatedOrg).then((res) => {
        if (res.status === "fulfilled") setOrgData(res?.data?.organisation);
      });
    }
  }, [userData]);
   console.log("allorgadmin",userData, orgData);

  return (
    <>
      <div className="w-[88.9583333vw] pt-[36px] mb-12 mx-auto">
        <div className="flex gap-2 text-sm mb-7">
          <span onClick={()=>navigate('/all-orgs')} className="text-[#667085] text-base-18 cursor-pointer">All Orgs</span>
          <img src={icon} alt="right-arrow" />
          <span className="text-[#24A3D9] text-base-20">{userData?.data?.user?.company}</span>
        </div>
        <div className="flex gap-7">
          <ProfileLeft userData={{ ...userData?.data?.user, ...orgData }}   userOnly={userData?.data?.user} />
          <ProfileRight userData={{ ...userData?.data?.user, ...orgData }} orgs={orgData} />
        </div>
      </div>
    </>
  );
};

export default About;
