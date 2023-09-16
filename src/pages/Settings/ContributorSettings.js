import React from 'react'
import AccountOverview from './Tabs/AccountOverview/AccountOverview'
import { useSelector } from 'react-redux';

export default function ContributorSettings() {
   const { organization } = useSelector((state) => state.organization);

   return (
      <div className=" bg-lightWhite min-h-screen px-[120px] pt-[50px] pb-[50px] lg:px-[120px] ">
         <p className="text-[#24A3D9]  mb-9 ">
            {organization?.company + "  >  "}
            <span className="font-semibold">Settings</span>
         </p>
         <AccountOverview />
      </div>
   )
}
