import React from 'react'

export default function ProgressBar({ num }) {


   return (
      <div className='w-full h-[9px] bg-[#D9D9D9] rounded-10'>
         <div className={`h-[9px] bg-[#62DD43] rounded-10`}
            style={{ width: `${num}%` }}></div>
      </div>
   )
}
