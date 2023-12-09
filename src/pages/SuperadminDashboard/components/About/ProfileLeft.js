import whatsapp from "../../../../assets/icons/ri_whatsapp-fill.svg";
import linkedin from "../../../../assets/icons/mdi_linkedin.svg";
import Profile from "../../../../assets/icons/Ellipse 445staticpfp.svg";
import { useLazyGetAdminPortalTokenQuery } from "../../../../app/services/superAdmin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import profile from "../../../../assets/images/user.png";

const ProfileLeft = ({ userData }) => {
  const navigate = useNavigate();
  const [fetchToken, setToken] = useLazyGetAdminPortalTokenQuery();
  const [loading, setLoading] = useState(false);
  console.log("profile left", { userData });
  const handlePortalButtonClick = () => {
    setLoading(true);
    fetchToken({ id: userData?._id }).then((token) => {
      setLoading(false);
      console.log("token received", token);
      if (token?.data?.token) {
        const url = `/admin-portal?userId=${userData?._id}&token=${token.data?.token}`;
        window.open(url, "_blank", "noopener noreferrer");
      } else {
        console.log("Error fetching token");
        alert("Something went wrong, please try again!");
        return;
      }
    });
  };
  return (
    <>
      <div className="flex flex-col w-[550px] bg-white shadow-[0px_0px_2.66667px_0px_rgba(0,0,0,0.25)] rounded-[15px] border border-[#FFF] min-h-[686px] h-full relative px-[35px] pt-[30px] items-center mb-[27px]">
        <div className="relative">
          <img
            src={profile}
            alt="profile"
            className="w-[97.5px] h-[97.5px] rounded-full"
          />
          <div className="absolute h-[29.5px] w-[29.5px] bg-[#26435F] rounded-full bottom-[-5px] right-[-3px] flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.3148 8.74609C10.4845 8.74609 10.6473 8.81351 10.7673 8.9335C10.8873 9.05349 10.9547 9.21624 10.9547 9.38594V10.4523H12.0211C12.1908 10.4523 12.3535 10.5198 12.4735 10.6397C12.5935 10.7597 12.6609 10.9225 12.6609 11.0922C12.6609 11.2619 12.5935 11.4246 12.4735 11.5446C12.3535 11.6646 12.1908 11.732 12.0211 11.732H10.9547V12.7984C10.9547 12.9681 10.8873 13.1309 10.7673 13.2509C10.6473 13.3709 10.4845 13.4383 10.3148 13.4383C10.1451 13.4383 9.9824 13.3709 9.86241 13.2509C9.74241 13.1309 9.675 12.9681 9.675 12.7984V11.732H8.60859C8.4389 11.732 8.27615 11.6646 8.15616 11.5446C8.03616 11.4246 7.96875 11.2619 7.96875 11.0922C7.96875 10.9225 8.03616 10.7597 8.15616 10.6397C8.27615 10.5198 8.4389 10.4523 8.60859 10.4523H9.675V9.38594C9.675 9.21624 9.74241 9.05349 9.86241 8.9335C9.9824 8.81351 10.1451 8.74609 10.3148 8.74609Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.41881 17.9168H12.2101C14.8727 17.9168 16.2044 17.9168 17.1608 17.2898C17.5734 17.0193 17.9288 16.6703 18.2067 16.2626C18.8457 15.3242 18.8457 14.0164 18.8457 11.4024C18.8457 8.78755 18.8457 7.48056 18.2067 6.54212C17.9288 6.13442 17.5734 5.7854 17.1608 5.51496C16.5465 5.11143 15.777 4.96725 14.5988 4.91606C14.0366 4.91606 13.5529 4.49803 13.4429 3.9563C13.3588 3.55948 13.1402 3.20387 12.8242 2.94957C12.5082 2.69527 12.1141 2.55786 11.7085 2.56059H8.92045C8.07756 2.56059 7.35155 3.14498 7.18605 3.9563C7.07599 4.49803 6.59227 4.91606 6.03006 4.91606C4.85275 4.96725 4.08323 5.11228 3.46813 5.51496C3.05574 5.78545 2.70063 6.13448 2.42305 6.54212C1.7832 7.48056 1.7832 8.78755 1.7832 11.4024C1.7832 14.0164 1.7832 15.3233 2.42219 16.2626C2.69861 16.6687 3.05351 17.0176 3.46813 17.2898C4.42448 17.9168 5.75621 17.9168 8.41881 17.9168ZM13.727 11.0918C13.727 11.9969 13.3674 12.8649 12.7275 13.5048C12.0875 14.1448 11.2195 14.5043 10.3145 14.5043C9.4094 14.5043 8.54142 14.1448 7.90145 13.5048C7.26148 12.8649 6.90195 11.9969 6.90195 11.0918C6.90195 10.1868 7.26148 9.3188 7.90145 8.67884C8.54142 8.03887 9.4094 7.67934 10.3145 7.67934C11.2195 7.67934 12.0875 8.03887 12.7275 8.67884C13.3674 9.3188 13.727 10.1868 13.727 11.0918ZM15.4332 7.89262C15.2635 7.89262 15.1008 7.96003 14.9808 8.08002C14.8608 8.20002 14.7934 8.36277 14.7934 8.53246C14.7934 8.70216 14.8608 8.86491 14.9808 8.9849C15.1008 9.10489 15.2635 9.17231 15.4332 9.17231H16.2863C16.456 9.17231 16.6188 9.10489 16.7388 8.9849C16.8588 8.86491 16.9262 8.70216 16.9262 8.53246C16.9262 8.36277 16.8588 8.20002 16.7388 8.08002C16.6188 7.96003 16.456 7.89262 16.2863 7.89262H15.4332Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <div className="flex gap-5 justify-start items-center mt-[34.87px]">
          <div className="flex flex-col justify-start items-start gap-[10px] w-[230px]">
            <p className="text-[15px] leading-[19.559px] font-medium">
              First Name
            </p>
            <div
              className="flex w-full px-[15px] items-center justify-start rounded-[5px] bg-white min-h-[40px]"
              style={{ boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)" }}
            >
              <p className="text-[#517CA8] text-[17.5px] font-normal leading-[21px]">
                {userData?.firstName}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-[10px] w-[230px]">
            <p className="text-[15px] leading-[19.559px] font-medium">
              Last Name
            </p>
            <div
              className="flex w-full px-[15px] items-center justify-start rounded-[5px] bg-white min-h-[40px]"
              style={{ boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)" }}
            >
              <p className="text-[#517CA8] text-[17.5px] font-normal leading-[21px]">
                {userData?.lastName}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-start items-center mt-[25px]">
          <div className="flex flex-col justify-start items-start gap-[10px] w-[480px]">
            <p className="text-[15px] leading-[19.559px] font-medium">
              Role / Job Title
            </p>
            <div
              className="flex w-full px-[15px] items-center justify-start rounded-[5px] bg-white min-h-[40px]"
              style={{ boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)" }}
            >
              <p className="text-[#517CA8] text-[17.5px] font-normal leading-[21px]">
                {userData?.role}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-start items-center mt-[25px]">
          <div className="flex flex-col justify-start items-start gap-[10px] w-[480px]">
            <p className="text-[15px] leading-[19.559px] font-medium">Email</p>
            <div
              className="flex w-full px-[15px] items-center justify-start rounded-[5px] bg-white min-h-[40px]"
              style={{ boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)" }}
            >
              <p className="text-[#517CA8] text-[17.5px] font-normal leading-[21px]">
                {userData?.email}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-start items-center mt-[25px]">
          <div className="flex flex-col justify-start items-start gap-[10px] w-[480px]">
            <p className="text-[15px] leading-[19.559px] font-medium">Phone</p>
            <div
              className="flex w-full px-[5px] items-center justify-start rounded-[5px] bg-white min-h-[40px] gap-[10px]"
              style={{ boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="78"
                height="28"
                viewBox="0 0 78 28"
                fill="none"
              >
                <rect width="78" height="28" rx="4" fill="#EAF5FA" />
                <path
                  d="M34 11.1836L39 16.1836L44 11.1836"
                  stroke="#D0D5DD"
                  stroke-width="2.57394"
                  stroke-linecap="square"
                />
              </svg>
              <p className="text-[#517CA8] text-[17.5px] font-normal leading-[21px]">
                {userData?.phone}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-start items-center mt-[25px]">
          <div className="flex flex-col justify-start items-start gap-[10px] w-[480px]">
            <p className="text-[15px] leading-[19.559px] font-medium">
              Short Bio / Intro
            </p>
            <div
              className="flex w-full px-[15px] pt-[15px] pb-[33px] items-center justify-start rounded-[5px] bg-white min-h-[40px]"
              style={{ boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)" }}
            >
              <p className="text-[#517CA8] text-[17.5px] font-normal leading-[21px]">
                {userData?.about}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center pt-[35.75px] pb-[37.25px]">
          <button disabled={loading} onClick={handlePortalButtonClick} className="bg-[#FFA28D] w-[175px] pt-[17.75px] pb-[18.25px] px-[21.5px] font-semibold rounded-lg text-base-20 text-white ">
           {loading?"Opening Portal...":"Admin Portal"} 
          </button>
        </div>
        {/* <div className="flex gap-5 items-center ">
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
        </div> */}
      </div>
    </>
  );
};

export default ProfileLeft;
