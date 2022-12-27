import React from 'react'

export default function ProfileCard({ title, titleClassName, className, body, hideShadow, bgClassName }) {


   return (
      <div className={`rounded-2xl ${!hideShadow && 'shadow-white'} py-6 px-4 lg:px-5 ${bgClassName ? bgClassName : 'bg-white  lg:bg-textGray-30'} ${!hideShadow && 'lg:shadow-light'} relative bg-white ${className ? className : ''}
      `}>
         <div className={`text-[#4715D7] font-bold text-[21px] ${titleClassName ? titleClassName : "text-center"}`}>
            {title}
         </div>
         {body && body}
      </div>
   )
}
