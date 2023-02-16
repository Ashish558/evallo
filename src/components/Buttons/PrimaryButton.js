import React from 'react'
import Loader from '../Loader'

export default function PrimaryButton({ children, className, onClick, disabled, roundedClass, type, loading }) {

   return (
      <button className={`bg-primary relative ${roundedClass ? roundedClass : 'rounded-md'} text-white py-4 px-12 ${className} disabled:opacity-60`}
         onClick={onClick}
         disabled={loading === true ? true : disabled}
         type={type ? type : 'button'}
      >
         {children}
         {
            loading &&
            <Loader />
         }
      </button>
   )
}
