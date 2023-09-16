import { useState } from "react";
import SubFrame0 from "../AboutCard/SubFrame0";
import SubFrame2 from "../AboutCard/SubFrame1";

const ProfileRight = ({ userData }) => {
  const [subFrame, setSubFrame] = useState(0);

  return (
    <>
      <div className="flex flex-col gap-3 p-3 min-w-[740px] w-[62%] bg-white shadow-xs rounded-md border border-gray-300">
        <div className="flex rounded-sm justify-between border-b-[1.5px] border-b-gray-300">
          <span className="flex cursor-pointer gap-5 items-end py-0 relative z-20 translate-y-[2.4px] text-[15px] font-semibold">
            <button
              onClick={() => setSubFrame(0)}
              className={`px-2 py-1 rounded-sm ${
                subFrame === 0
                  ? "border-b-[3px]  border-b-[#FFA28D]  text-[#FFA28D] "
                  : ""
              }`}
            >
              About{" "}
            </button>

            <button
              onClick={() => setSubFrame(1)}
              className={`px-2 py-1 rounded-sm ${
                subFrame === 1
                  ? "border-b-[3px]  border-b-[#FFA28D]  text-[#FFA28D] "
                  : ""
              }`}
            >
              Org Settings{" "}
            </button>
            <button
              onClick={() => setSubFrame(2)}
              className={`px-2 py-1 rounded-sm ${
                subFrame === 2
                  ? "border-b-[3px]  border-b-[#FFA28D]  text-[#FFA28D] "
                  : ""
              }`}
            >
              Action Log{" "}
            </button>
            <button
              onClick={() => setSubFrame(3)}
              className={`px-2 py-1 rounded-sm ${
                subFrame === 3
                  ? "border-b-[3px]  border-b-[#FFA28D]  text-[#FFA28D] "
                  : ""
              }`}
            >
              {" "}
              Signup Details
            </button>
          </span>
          <span className="flex flex-col justify-end items-end gap-1">
            <button className="bg-[#FFA28D] p-1 px-3   rounded-md text-xs text-white">
              {"12 Days"}
            </button>
            <p className="text-[#FFA28D] text-xs">1 May - May 12, 2023</p>
          </span>
        </div>
        {subFrame === 0 ? (
          <SubFrame0 userData={userData} />
        ) : subFrame === 1 ? (
          <></>
        ) : subFrame === 2 ? (
          <SubFrame2 id={userData._id
          } />
        ) : subFrame === 3 ? (
          <></>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ProfileRight;
