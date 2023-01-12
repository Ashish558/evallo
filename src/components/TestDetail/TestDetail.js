import React from 'react'

export function TestDetail({ name, desc }) {


   return (
      <>
         <p>{name}</p>
         <p className='pb-10'>
         </p>

         <p>
            {desc ? desc : '-'}
         </p>
      </>
   )
}
