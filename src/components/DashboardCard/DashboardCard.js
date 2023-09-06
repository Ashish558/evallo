import React from 'react'

export default function DashboardCard({ className, data, header, subHeader }) {


   return (
      <div className={`w-[18.6875003125vw] py-[20px] px-[26px] flex flex-1 text-white   first:mr-[30px] ${className} rounded-[5px] `}
      // style={{
      //    filter: 'drop-shadow(0px 6px 24px rgba(75, 189, 148, 0.5))'
      // }} 
      >

         <div className='self-stretch min-w-[80px] h-[80px] text-center bg-white/20 rounded-[5px] flex flex-col justify-center'>
            <p className={`font-bold leading-none ${data.titleClassName ? data.titleClassName : 'text-[32px]'}`}>
               {data.title}
            </p>
            <p className='text-xl font-medium'>
               {data.subtitle}
            </p>
         </div>

         <div className='px-5'>
            <p className=' font-semibold text-[1.6666666667vw]'>
               {header}
            </p>
            <p className='text-xl font-medium'>
               {subHeader}
            </p>
         </div>

      </div>
   )
}
