import React from "react";
import referral from "../../../../assets/YIcons/referral.svg";
import time from "../../../../assets/YIcons/time.svg";
import bod from "../../../../assets/YIcons/bod.svg";
import dropbox from "../../../../assets/YIcons/dropbox.svg";
import accomodations from "../../../../assets/YIcons/accomodations.svg";
import clickArrowIcon from "../../../../assets/YIcons/clickArrow.svg";
import { useGetLinkStudentMutation } from "../../../../app/services/users";
import { useEffect } from "react";
import { useState } from "react";
const SPFrame0 = ({ userDetail, settings, toEdit, setToEdit }) => {
  const [getLink, getLinkStatus] = useGetLinkStudentMutation();
  const [dropLink, setDropLink] = useState("");
  const [driveLink, setDriveLink] = useState("");
  useEffect(() => {
    if (userDetail?._id) {
      getLink({ type: "dropBoxLink", studentId: userDetail?._id }).then(
        (res) => {
          if (res?.data) {
            setDropLink(res?.data?.dropBoxLink);
            setToEdit({
              ...toEdit,
              frame1: {
                ...toEdit.frame1,
                dropBoxLink: res?.data?.dropBoxLink,
              },
            });
          }
        }
      );
      getLink({ type: "driveLink", studentId: userDetail?._id }).then((res) => {
        if (res?.data) {
          setDriveLink(res?.data?.driveLink);
          setToEdit({
            ...toEdit,
            frame1: {
              ...toEdit.frame1,
              driveLink: res?.data?.driveLink,
            },
          });
        }
      });
    }
  }, [userDetail]);
//  //console.log({ driveLink, dropLink });
  return (
    <div>
      <div className="bg-white mt-7 px-3 py-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex gap-3 justify-between  text-[#24A3D9]">
        <div className="flex gap-3 text-sm items-center">
          <span>
            <img
              className="ml-2 !w-6 !h-6 inline-block"
              src={bod}
              alt="arrow down"
            />
          </span>
          <span>
            <p>Birth Year</p>
            <p className=" font-semibold ">
              {userDetail.birthyear ? userDetail.birthyear : " "}
            </p>
          </span>
        </div>
        <div className="flex gap-3 text-sm items-center">
          <span>
            <img
              className="ml-2 !w-6 !h-6 inline-block"
              src={time}
              alt="arrow down"
            />
          </span>
          <span>
            <p>Time Zone</p>
            <p className=" font-semibold ">
              {userDetail?.timeZone ? userDetail.timeZone : "-"}
            </p>
          </span>
        </div>
        <div className="flex gap-3 text-sm items-center">
          <span>
            <img
              className="ml-2 !w-6 !h-6 inline-block"
              src={referral}
              alt="arrow down"
            />
          </span>
          <span>
            <p>Referral</p>
            <p className=" font-semibold ">
              {userDetail.subscriptionCode
                ? userDetail.subscriptionCode
                : "None"}
            </p>
          </span>
        </div>
        <div className="flex gap-3 text-sm items-center">
          <span>
            <img
              className="ml-2 !w-6 !h-6 inline-block"
              src={dropbox}
              alt="arrow down"
            />
          </span>
          <span className="flex flex-col">
            <a href={dropLink} target="_blank" rel="noreferrer">
              Dropbox{" "}
              <img
                className="ml-2 !w-3 !h-2 inline-block"
                src={clickArrowIcon}
                alt="arrow down"
              />
            </a>
            <a
              href={driveLink}
              target="_blank"
              rel="noreferrer"
              className=" font-semibold "
            >
              Drive
              <img
                className="ml-2 !w-3 !h-2 inline-block"
                src={clickArrowIcon}
                alt="arrow down"
              />
            </a>
          </span>
        </div>
        <div className="flex gap-3 text-sm items-center">
          <span>
            <img
              className="ml-2 !w-6 !h-6 inline-block"
              src={accomodations}
              alt="arrow down"
            />
          </span>
          <span>
            <p>Accomodations</p>
            <p className=" font-semibold ">
              {userDetail.accomodations ? userDetail.accomodations : "-"}
            </p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SPFrame0;
