import React from 'react'

export default function PrimaryButton({ children, className, onClick, disabled, roundedClass, type }) {

   return (
<<<<<<< HEAD
      <button className={`bg-primaryDark lg:bg-primary ${roundedClass ? roundedClass : 'rounded-md'} text-white py-4 px-12 ${className}`}
=======
      <button className={`bg-primary ${roundedClass ? roundedClass : 'rounded-md'} text-white py-4 px-12 ${className} disabled:opacity-60`}
>>>>>>> c7ad05ff413fe4b77318b6285f3896be7680ca00
         onClick={onClick}
         disabled={disabled}
         type={type ? type : 'button'}
      >
         {children}
      </button>
   )
}
