import React from 'react'

export function TestDetail({ name, desc, timer }) {


   return (
      <>
         <p>{name}</p>

         <p className='pb-10'>
         </p>

         <p>
            {desc ? desc : '-'}
         </p>
         <p className='font-medium mt-2'>
          Duration:  {timer ? `${timer} minutes` : '-'}
         </p>
      </>
   )
}
