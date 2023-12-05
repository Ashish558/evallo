import React, { useEffect, useState } from "react";
import { useLazyGetUserDetailQuery } from "../../app/services/users";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../utils/utils";

export default function AllTestDetail({ testData }) {
  const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery();
  const { dateFormat } = useSelector((state) => state.user);
  const [detail, setDetail] = useState({
    createdBy: "-",
    updatedBy: "-",
  });
  console.log(testData);
  useEffect(() => {
    if (testData.createdBy) {
      getUserDetail({ id: testData.createdBy }).then((res) => {
        if (res.error) return console.log(res.error);
        // console.log(res.data);
        if (res.data.data.user) {
          const { firstName, lastName } = res.data.data.user;
          setDetail((prev) => ({
            ...prev,
            createdBy: `${firstName} ${lastName}`,
          }));
        }
      });
    }
    if (testData.updatedBy) {
      getUserDetail({ id: testData.updatedBy }).then((res) => {
        if (res.error) return console.log(res.error);
        // console.log(res.data);
        if (res.data.data.user) {
          const { firstName, lastName } = res.data.data.user;
          setDetail((prev) => ({
            ...prev,
            updatedBy: `${firstName} ${lastName}`,
          }));
        }
      });
    }
  }, [testData]);

  const { role: persona } = useSelector((state) => state.user);

  // console.log(testData);

  return (
    <>
      {persona === "admin" ? (
        <div className="w-full flex flex-col">
          <div className="flex justify-between items-center mb-[6px]">
            <p className="inline-block w-138 font-medium  text-[#26435F] ">
              {" "}
              Created on
            </p>
            <p className="inline-block mr-7">:</p>
            <p className="inline-block text-[#24A3D9] w-138 font-semibold">
              {/* {testData.createdAt?.split("T")[0]} */}
              {getFormattedDate(testData.createdAt?.split("T")[0], dateFormat)}
            </p>
          </div>

        
          <div className="flex justify-between items-center mb-[6px]">
            <p className="inline-block w-138 font-medium  text-[#26435F] ">
              {" "}
              Updated on{" "}
            </p>
            <p className="inline-block mr-7">:</p>
            <p className="inline-block text-[#24A3D9] w-138 font-semibold  ">
              {" "}
              {/* {testData.updatedAt?.split("T")[0]} */}
              {getFormattedDate(testData.updatedAt?.split("T")[0], dateFormat)}
            </p>
          </div>
          <div className="flex justify-between items-center mb-[6px]">
            <p className="inline-block w-138 font-medium text-[#26435F]">
              {" "}
              Name{" "}
            </p>
            <p className="inline-block mr-7">:</p>
            <p className="inline-block w-138 text-[#24A3D9] font-semibold ">
              {" "}
              {testData.testName}
            </p>
          </div>

          
          <div className="flex justify-between items-center mb-[6px]">
            <p className="inline-block w-138 font-medium text-[#26435F]">
              {" "}
              Type{" "}
            </p>
            <p className="inline-block mr-7">:</p>
            {console.log(testData.testType)}
            <p className="inline-block w-138 text-[#24A3D9] font-semibold ">
              {" "}
              {testData.testType?.includes("®")
                ? testData.testType
                : testData.testType?.includes("Other")
                ? "Other"
                : testData.testType + "®"}
            </p>
          </div>  

          <div className="flex justify-between items-center mb-[6px]">
            <p className="inline-block w-138 font-medium  text-[#26435F] ">
              {" "}
              Created by
            </p>
            <p className="inline-block mr-7">:</p>
            <p className="inline-block text-[#24A3D9]  w-138 font-semibold ">
              {detail.createdBy}
            </p>
          </div>

          
          <div className="flex justify-between items-center mb-[6px]">
            <p className="inline-block w-138 font-medium text-[#26435F] ">
              {" "}
              Updated By{" "}
            </p>
            <p className="inline-block mr-7">:</p>
            <p className="inline-block text-[#24A3D9] w-138 font-semibold ">
              {" "}
              {detail.updatedBy}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-y-2">
          <div className="flex justify-between items-center">
            <p className="inline-block w-138 font-medium  text-[#26435F] ">
              {" "}
              Created on
            </p>
            <p className="inline-block mr-7">:</p>
            <p className="inline-block text-[#24A3D9] w-138 font-semibold">
              {/* {testData.createdAt?.split("T")[0]} */}
              {getFormattedDate(testData.createdAt?.split("T")[0], dateFormat)}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="inline-block w-138 font-medium  text-[#26435F] ">
              {" "}
              Created by
            </p>
            <p className="inline-block mr-7">:</p>
            <p className="inline-block text-[#24A3D9]  w-138 font-semibold ">
              {detail.createdBy}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="inline-block w-138 font-medium  text-[#26435F] ">
              {" "}
              Updated on{" "}
            </p>
            <p className="inline-block mr-7">:</p>
            <p className="inline-block text-[#24A3D9] w-138 font-semibold  ">
              {" "}
              {/* {testData.updatedAt?.split("T")[0]} */}
              {getFormattedDate(testData.updatedAt?.split("T")[0], dateFormat)}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="inline-block w-138 font-medium text-[#26435F] ">
              {" "}
              Updated By{" "}
            </p>
            <p className="inline-block mr-7">:</p>
            <p className="inline-block text-[#24A3D9] w-138 font-semibold ">
              {" "}
              {detail.updatedBy}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="inline-block w-138 font-medium text-[#26435F]">
              {" "}
              Name{" "}
            </p>
            <p className="inline-block mr-7">:</p>
            <p className="inline-block w-138 text-[#24A3D9] font-semibold ">
              {" "}
              {testData.testName}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="inline-block w-138 font-medium text-[#26435F]">
              {" "}
              Type{" "}
            </p>
            <p className="inline-block mr-7">:</p>
            {console.log(testData.testType)}
            <p className="inline-block w-138 text-[#24A3D9] font-semibold ">
              {" "}
              {testData.testType?.includes("®")
                ? testData.testType
                : testData.testType?.includes("Other")
                ? "Other"
                : testData.testType + "®"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
