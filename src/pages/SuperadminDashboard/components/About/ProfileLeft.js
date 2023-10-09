import whatsapp from "../../../../assets/icons/ri_whatsapp-fill.svg";
import linkedin from "../../../../assets/icons/mdi_linkedin.svg";
import Profile from "../../../../assets/icons/Ellipse 445staticpfp.svg";
import { useLazyGetAdminPortalTokenQuery } from "../../../../app/services/superAdmin";
import { useNavigate } from "react-router-dom";

const ProfileLeft = ({ userData }) => {
const navigate= useNavigate()
  const [fetchToken,setToken]= useLazyGetAdminPortalTokenQuery()
console.log("profile left", {userData})
  const handlePortalButtonClick=()=>{
       fetchToken({id:userData?._id}).then((token)=>{
        console.log("token received",token);
        if(token?.data?.token){
          const url = `/admin-portal?userId=${userData?._id}&token=${token.data?.token}`;
          window.open(url, '_blank');
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
      <div className="flex flex-col gap-3 p-3 min-w-[400px] w-[38%] bg-white shadow-xs rounded-md border border-gray-300">
        <div className="flex gap-3 items-center">
          <img src={Profile} alt="profile" />
          <span className="flex flex-col text-sm text-[#517CA8]">
            <span className="flex  ">
              <p className="mr-6 w-[90px]">First name : </p>
              <p className="font-semibold"> {userData?.firstName}</p>
            </span>
            <span className="flex ">
              <p className="mr-6 w-[90px]">last name : </p>{" "}
              <p className="font-semibold"> {userData?.lastName} </p>
            </span>
            <span className="flex ">
              <p className="mr-6 w-[90px]">Role : </p>
              <p className="font-semibold"> {userData?.role}</p>
            </span>
          </span>
          <span className="flex gap-3 items-start">
            <img src={whatsapp} alt="whatsapp" />
            <img src={linkedin} alt="linkedin" />
          </span>
        </div>
        <div className="flex bg-[#FBF9FF] rounded-md p-2 px-3 text-sm  text-[#517CA8]">
          <span className="w-[100px]">Email:</span>
          <span className="font-semibold">{userData?.email}</span>
        </div>
        <div className="flex  bg-[#FBF9FF] rounded-md p-2 px-3 text-sm text-[#517CA8]">
          <span className="w-[100px]">Phone:</span>
          <span className="font-semibold">{userData?.phone}</span>
        </div>
        <div className="flex  bg-[#FBF9FF] rounded-md p-2 px-3 text-sm text-[#517CA8]">
          <span className="w-[100px]">Location:</span>
          <span className="font-semibold">
            {userData?.state}, {userData?.country}
          </span>
        </div>
        <div className="flex  bg-[#FBF9FF] rounded-md p-2 px-3 text-sm  text-[#517CA8]">
          <span className="w-[130px]">Bio:</span>
          <span className="w-fit break-words font-semibold">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris ni
          </span>
        </div>
        <div className="text-center">
          <button onClick={handlePortalButtonClick} className="bg-[#FFA28D] p-2 px-3 rounded-md text-xs text-white">
            Admin portal
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileLeft;
