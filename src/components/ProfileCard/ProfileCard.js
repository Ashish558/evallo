import React from 'react'

export default function ProfileCard({ title, titleClassName, className, body, hideShadow, bgClassName }) {


   return (
      <div className={`rounded-5  pr-7  ${bgClassName ? bgClassName : 'bg-white  lg:bg-textGray-30'} ${!hideShadow && 'shadow-[0px_0px_2.50039px_0px_rgba(18,17,39,0.25)]'} relative bg-white ${className ? className : ''}
      `}>
         <div className={`text-[#4715D7] font-bold text-[21px] ${titleClassName ? titleClassName : "text-center"}`}>
            {title}
         </div>
         {body && body}
      </div>
   )
}
