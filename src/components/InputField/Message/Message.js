import React from 'react'

export default function Message({ error, type }) {

   return (
      <div className='px-3 text-[13px] rounded-md ml-auto max-w-[310px] relative mt-5 py-2 bg-[#FFCDC9] border border-[#FF2626] '>
         <p>
            {error}
         </p>
         <div style={{
            position: 'absolute',
            top: '-16px',
            right: '19px',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '15px solid #FF2626',
         }}>
         </div>
         <div style={{
            position: 'absolute',
            top: '-15px',
            right: '20px',
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderBottom: '15px solid #FFCDC9',
         }}>

         </div>
      </div>
   )
}
