import React from 'react'

export default function DashboardCard({ className, data, header, subHeader }) {


   return (
      <div className={`w-[16.41vw] flex py-[17px] px-[22px]  text-white  ${className} rounded-[5px] items-center`}
      >
         <div className='w-[80px] h-[80px] text-center bg-white/20 rounded-[5px] flex flex-col justify-center'>
            <p className={`font-bold leading-none ${data.titleClassName ? data.titleClassName : 'text-[1.41vw]'}`}>
               {data.title}
            </p>
            <p className='text-[0.9375vw] font-medium'>
               {data.subtitle}
            </p>
         </div>

         <div className='pl-4'>
            <p className=' font-semibold text-[1.41vw]'>
               {header}
            </p>
            <p className='text-[0.9375vw] font-medium'>
               {subHeader}
            </p>
         </div>

      </div>
   )
}
