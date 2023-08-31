import React from 'react'
import referral from "../../../../assets/YIcons/referral.svg";
import time from "../../../../assets/YIcons/time.svg";
import bod from "../../../../assets/YIcons/bod.svg";
import dropbox from "../../../../assets/YIcons/dropbox.svg";
import accomodations from "../../../../assets/YIcons/accomodations.svg";
import clickArrowIcon from "../../../../assets/YIcons/clickArrow.svg";
const SPFrame0 = ({userDetail,settings}) => {
  
  return (
    <div>
              <div className="bg-white mt-7 px-3 py-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex gap-3 justify-between  text-[#24A3D9]">
                <div className="flex gap-3 text-sm items-center">
                  <span>
                    <img
                      className="ml-2 !w-5 !h-5 inline-block"
                      src={bod}
                      alt="arrow down"
                    />
                  </span>
                  <span>
                    <p>BirthYear</p>
                    <p className=" font-semibold ">
                      {userDetail.birthyear ? userDetail.birthyear : " "}
                    </p>
                  </span>
                </div>
                <div className="flex gap-3 text-sm items-center">
                  <span>
                    <img
                      className="ml-2 !w-5 !h-5 inline-block"
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
                      className="ml-2 !w-5 !h-5 inline-block"
                      src={referral}
                      alt="arrow down"
                    />
                  </span>
                  <span>
                    <p>Referral code</p>
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
                      className="ml-2 !w-5 !h-5 inline-block"
                      src={dropbox}
                      alt="arrow down"
                    />
                  </span>
                  <span>
                    <p>
                      DropBox{" "}
                      <img
                        className="ml-2 !w-2 !h-2 inline-block"
                        src={clickArrowIcon}
                        alt="arrow down"
                      />
                    </p>
                    <p className=" font-semibold ">
                      {userDetail.subscriptionCode
                        ? userDetail.subscriptionCode
                        : "Drive"}
                      <img
                        className="ml-2 !w-2 !h-2 inline-block"
                        src={clickArrowIcon}
                        alt="arrow down"
                      />
                    </p>
                  </span>
                </div>
                <div className="flex gap-3 text-sm items-center">
                  <span>
                    <img
                      className="ml-2 !w-5 !h-5 inline-block"
                      src={accomodations}
                      alt="arrow down"
                    />
                  </span>
                  <span>
                    <p>Accomodations</p>
                    <p className=" font-semibold ">
                      {userDetail.accomodations
                        ? userDetail.accomodations
                        : "-"}
                    </p>
                  </span>
                </div>
              </div>
            </div>
  )
}

export default SPFrame0