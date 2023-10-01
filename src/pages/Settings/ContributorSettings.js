import React from 'react'
import AccountOverview from './Tabs/AccountOverview/AccountOverview'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ContributorSettings() {
   const { organization } = useSelector((state) => state.organization);
const navigate=useNavigate('/')
   return (
      <div className=" bg-lightWhite min-h-screen px-[120px] pt-[50px] pb-[50px] lg:px-[120px] ">
         <p className="text-[#24A3D9]  mb-9 ">
          <span onClick={()=>navigate('/')} className='cursor-pointer'>  {organization?.company + "  >  "}</span>
            <span className="font-semibold">Settings</span>
         </p>
         <AccountOverview />
      </div>
   )
}
