import React from "react";
import icon from "../../../../assets/icons/VectorchevronRight.svg";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetUserDetailQuery,
  useLazyGetOrganizationQuery,
} from "../../../../app/services/users";
import { useEffect } from "react";
import ProfileLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";
const About = () => {
  const params = useParams();

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
  // console.log(userData, orgData);
  return (
    <>
      <div className="px-16 pt-4 mb-12">
        <div className="flex gap-2 text-sm mb-7">
          <span>All Orgs</span>
          <img src={icon} alt="" />
          <span className="text-[#24A3D9]">About</span>
        </div>
        <div className="flex gap-7">
          <ProfileLeft userData={{ ...userData?.data?.user, ...orgData }} />
          <ProfileRight userData={{ ...userData?.data?.user, ...orgData }} />
        </div>
      </div>
    </>
  );
};

export default About;
