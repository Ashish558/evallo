import React from 'react'
import Loader from '../Loader'

export default function PrimaryButton({ children, className, onClick, disabled, roundedClass, type, loading,Icon }) {

   return (
      <button className={`bg-primary relative flex items-center ${roundedClass ? roundedClass : 'rounded-md'} text-white py-[7px] px-6 ${className} disabled:opacity-60`}
      
      onClick={onClick}
         disabled={loading === true ? true : disabled}
         type={type ? type : 'button'}
      >
         <img src={Icon} className='mr-1'></img>
         {children}
         {
            loading &&
            <Loader />
         }
      </button>
   )
}
