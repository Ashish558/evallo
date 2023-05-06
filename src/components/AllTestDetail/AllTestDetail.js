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
      <div className="grid max-w-840 gap-y-2 mt-2">
         <div>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Created on
            </p>
            <span className="inline-block mr-4">:</span>
            <p className="inline-block w-138 font-semibold ml-7">
               {testData.createdAt?.split("T")[0]}
            </p>
         </div>

         <div>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Created by
            </p>
            <span className="inline-block mr-4">:</span>
            <p className="inline-block w-138 font-semibold ml-7">
               {detail.createdBy}
            </p>
         </div>

         <div>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Updated on{" "}
            </p>
            <span className="inline-block mr-4">:</span>
            <p className="inline-block w-138 font-semibold ml-7">
               {" "}
               {testData.updatedAt?.split("T")[0]}
            </p>
         </div>

         <div>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Updated By{" "}
            </p>
            <span className="inline-block mr-4">:</span>
            <p className="inline-block w-138 font-semibold ml-7">
               {" "}
               {/* {testData.updatedAt?.split("T")[0]} */}
            </p>
         </div>

         <div>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Name{" "}
            </p>
            <span className="inline-block mr-4">:</span>
            <p className="inline-block w-138 font-semibold ml-7">
               {" "}
               {testData.testName}
            </p>
         </div>
         <div>
            <p className="inline-block w-138 font-semibold opacity-60">
               {" "}
               Type{" "}
            </p>
            <span className="inline-block mr-4">:</span>
            <p className="inline-block w-138 font-semibold ml-7">
               {" "}
               {testData.testType}
            </p>
         </div>
      </div>

   )
}
