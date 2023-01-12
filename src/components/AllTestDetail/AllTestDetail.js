import React from 'react'

export default function AllTestDetail({ testData }) {


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
