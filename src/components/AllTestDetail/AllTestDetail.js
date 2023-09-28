import React, { useEffect, useState } from 'react'
import { useLazyGetUserDetailQuery } from '../../app/services/users';

export default function AllTestDetail({ testData }) {
   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()

   const [detail, setDetail] = useState({
      createdBy: '-',
      updatedBy: '-',
   })

   useEffect(() => {
      if (testData.createdBy) {
         getUserDetail({ id: testData.createdBy })
            .then(res => {
               if (res.error) return console.log(res.error);
               // console.log(res.data);
               if (res.data.data.user) {
                  const { firstName, lastName } = res.data.data.user
                  setDetail(prev => ({ ...prev, createdBy: `${firstName} ${lastName}` }))
               }
            })
      }
      if (testData.updatedBy) {
         getUserDetail({ id: testData.updatedBy })
            .then(res => {
               if (res.error) return console.log(res.error);
               // console.log(res.data);
               if (res.data.data.user) {
                  const { firstName, lastName } = res.data.data.user
                  setDetail(prev => ({ ...prev, updatedBy: `${firstName} ${lastName}` }))
               }
            })
      }
   }, [testData])

   // console.log(testData);

   return (
      <div className="max-w-840 flex flex-col w-full px-2 gap-y-2 mt-2">
         <div className='flex justify-between items-center'>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Created on
            </p>
            <p className="inline-block ">:</p>
            <p className="inline-block text-[#24A3D9] w-138 font-semibold">
               {testData.createdAt?.split("T")[0]}
            </p>
         </div>

         <div className='flex justify-between items-center'>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Created by
            </p>
            <p className="inline-block ">:</p>
            <p className="inline-block text-[#24A3D9]  w-138 font-semibold ">
               {detail.createdBy}
            </p>
         </div>

         <div className='flex justify-between items-center'>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Updated on{" "}
            </p>
            <p className="inline-block ">:</p>
            <p className="inline-block text-[#24A3D9] w-138 font-semibold ">
               {" "}
               {testData.updatedAt?.split("T")[0]}
            </p>
         </div>

         <div className='flex justify-between items-center'>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Updated By{" "}
            </p>
            <p className="inline-block ">:</p>
            <p className="inline-block text-[#24A3D9] w-138 font-semibold ">
               {" "}
               {testData.updatedAt?.split("T")[0]}
            </p>
         </div>

         <div className='flex justify-between items-center'>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Name{" "}
            </p>
            <p className="inline-block ">:</p>
            <p className="inline-block w-138 text-[#24A3D9] font-semibold ">
               {" "}
               {testData.testName}
            </p>
         </div>
         <div className='flex justify-between items-center'>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Type{" "}
            </p>
            <p className="inline-block ">:</p>
            <p className="inline-block w-138 text-[#24A3D9] font-semibold ">
               {" "}
               {testData.testType}
            </p>
         </div>
      </div>

   )
}
