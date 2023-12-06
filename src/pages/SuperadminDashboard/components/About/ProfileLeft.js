import whatsapp from "../../../../assets/icons/ri_whatsapp-fill.svg";
import linkedin from "../../../../assets/icons/mdi_linkedin.svg";
import Profile from "../../../../assets/icons/Ellipse 445staticpfp.svg";
import { useLazyGetAdminPortalTokenQuery } from "../../../../app/services/superAdmin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ProfileLeft = ({ userData }) => {
const navigate= useNavigate()
  const [fetchToken,setToken]= useLazyGetAdminPortalTokenQuery()
  const [loading,setLoading] = useState(false)
console.log("profile left", {userData})
  const handlePortalButtonClick=()=>{
    setLoading(true)
       fetchToken({id:userData?._id}).then((token)=>{
        setLoading(false)
        console.log("token received",token);
        if(token?.data?.token){
          const url = `/admin-portal?userId=${userData?._id}&token=${token.data?.token}`;
          window.open(url, '_blank',"noopener noreferrer");
        }
        else {
          console.log("Error fetching token")
          alert("Something went wrong, please try again!")
          return
        }
       })
  }
  return (
    <>
      <div className="flex flex-col gap-3   w-[548px] bg-white shadow-[0px_0px_2.66667px_0px_rgba(0,0,0,0.25)] rounded-5 border border-[#FFF] h-[686px] relative px-[2.5%] pt-6">
        <div className="flex gap-5 items-center ">
          <img src={Profile} alt="profile" />
          <span className="flex flex-col text-[18.66px] text-[#517CA8] w-[45%]">
            <span className="flex  ">
              <p className="max-w-[65%] font-light flex mr-[28px]">First name : </p>
              <p className="font-medium flex-grow-1"> {userData?.firstName}</p>
            </span>
            <span className="flex ">
              <p className="max-w-[65%] font-light flex mr-[28px]">Last name : </p>{" "}
              <p className="font-medium flex-grow-1"> {userData?.lastName} </p>
            </span>
            <span className="flex">
              <p className="w-[60%] font-light flex">Role : </p>
              <p className="font-medium flex-grow-1 text-left flex justify-start items-center ps-[6px]"> {userData?.role}</p>
            </span>
          </span>
          <span className="flex gap-3 items-start absolute top-5 right-7">
            <img src={whatsapp} alt="whatsapp" />
            <img src={linkedin} alt="linkedin" />
          </span>
        </div>
        {console.log(userData)}
        <div className="flex bg-[#FBF9FF] mt-[37px] rounded-[12px] py-[20px] px-[22px] text-[18.66px]  text-[#517CA8] items-center mb-[13px]">
          <p className="w-[25%] font-light">Email:</p>
          <p className="font-normal">{userData?.email}</p>
        </div>
        <div className="flex bg-[#FBF9FF]  rounded-[12px] py-[20px] px-[22px] text-[18.66px]  text-[#517CA8] items-center mb-[13px]">
          <p className="w-[25%] font-light">Phone:</p>
          <p className="font-normal">{userData?.phone}</p>
        </div>
        <div className="flex bg-[#FBF9FF]  rounded-[12px] py-[20px] px-[22px] text-[18.66px]  text-[#517CA8] items-center mb-[13px]">
          <p className="w-[25%] font-light">Location:</p>
          <p className="font-normal">{userData?.state}, {userData?.country}</p>
        </div>
        <div className="flex bg-[#FBF9FF]  rounded-[12px] py-[20px] px-[22px] text-[18.66px]  text-[#517CA8] items-center mb-[13px]">
          <p className="w-[25%] font-light">Bio:</p>
          <p className="font-normal w-fit break-words">{userData?.about}</p>
        </div>
        <div className="text-center absolute bottom-5 left-1/2 transform -translate-x-1/2">
          <button disabled={loading} onClick={handlePortalButtonClick} className="bg-[#FFA28D] w-[172.992px] p-2 px-1 rounded-lg text-base-20 text-white ">
           {loading?"Opening Portal...":"Admin Portal"} 
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileLeft;
