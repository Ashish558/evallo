import React from 'react'

export default function PrimaryButton({ children, className, onClick, disabled, roundedClass, type }) {

   return (
      <button className={`bg-primaryDark lg:bg-primary ${roundedClass ? roundedClass : 'rounded-md'} text-white py-4 px-12 ${className}`}
         onClick={onClick}
         disabled={disabled}
         type={type ? type : 'button'}
      >
         {children}
      </button>
   )
}
