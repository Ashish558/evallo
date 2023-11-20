import { useState } from "react";
import SubFrame0 from "../AboutCard/SubFrame0";
import SubFrame1 from "../AboutCard/SubFrame1";

import SubFrame2 from "../../OrgSettings/SubFrame2";
import SPFrame3 from "../../OrgSettings/SFrame3";

const ProfileRight = ({ userData,orgs }) => {
  const [subFrame, setSubFrame] = useState(0);
  function getLast12Days() {
    const today = new Date();
    const dates = [];
  
    for (let i = 11; i < 12; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
  
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
  
      let dateString = `${day} ${month}`;
      if (i === 0) {
        dateString += ` - ${month} ${day}, ${year}`;
      }
  
      dates.push(dateString);
    }
    let dt=new Date().toDateString();
    return dates+dt;
  }
  function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
   let date2=new Date();

    date2.setDate(date.getDate() - 12);
   const day2 = date2.getDate();
      const month2 = date2.toLocaleString('default', { month: 'long' });
    return `${day2} ${month2} - ${month} ${day}, ${year}`;
  }
  
  const targetDate = new Date(); // Replace with your desired date
  const formattedDate = formatDate(targetDate);
  
  console.log(formattedDate);
  const last12Days = formattedDate;
  
  return (
    <>
      <div className="flex flex-col gap-3 py-3  w-[58.2291667vw] bg-white shadow-[0px_0px_2.66667px_0px_rgba(0,0,0,0.25)] rounded-5 border border-white h-[686px]">
        <div className="flex rounded-sm justify-between border-b-[1.5px] border-b-gray-300 w-[55%]">
          <span className="flex cursor-pointer gap-5 items-end py-0 relative z-20 translate-y-[2.4px] text-base-18 font-medium">
            <button
              onClick={() => setSubFrame(0)}
              className={`px-4 py-2 rounded-sm ${
                subFrame === 0
                  ? "border-b-[4px]  border-b-[#FFA28D]  text-[#FFA28D] "
                  : "text-[#26435F]"
              }`}
            >
              About{" "}
            </button>

            <button
              onClick={() => setSubFrame(1)}
              className={`px-4 py-2 rounded-sm ${
                subFrame === 1
                  ? "border-b-[4px]  border-b-[#FFA28D]  text-[#FFA28D] "
                  : "text-[#26435F]"
              }`}
            >
              Org Settings{" "}
            </button>
            <button
              onClick={() => setSubFrame(2)}
              className={`px-4 py-2 rounded-sm ${
                subFrame === 2
                  ? "border-b-[4px]  border-b-[#FFA28D]  text-[#FFA28D] "
                  : "text-[#26435F]"
              }`}
            >
              Action Log{" "}
            </button>
            <button
              onClick={() => setSubFrame(3)}
              className={`pl-4 py-2 rounded-sm ${
                subFrame === 3
                  ? "border-b-[4px]  border-b-[#FFA28D]  text-[#FFA28D] "
                  : "text-[#26435F]"
              }`}
            >
              {" "}
              Signup Details
            </button>
          </span>
          
        </div>
        {subFrame === 0 ? (
          <SubFrame0 userData={userData} />
        ) : subFrame === 1 ? (
          <><SubFrame2 orgData={userData?.settings} orgs={orgs}/></>
        ) : subFrame === 2 ? (
          <SubFrame1 id={userData._id}  />
        ) : subFrame === 3 ? (
          <>
          <SPFrame3 userDetail={userData}/>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ProfileRight;
