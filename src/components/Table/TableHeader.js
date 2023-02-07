import React, { useEffect, useState } from 'react'
import { useLazyGetSettingsQuery } from '../../app/services/session';
import InputSelect from '../InputSelect/InputSelect';
import sort from './../../assets/icons/sort.webp'

export function TableHeader({ header, dataFor, onClick, setSorted }) {



   return (
      dataFor === 'assignedTestsStudents' || dataFor === 'invoice' ?
         <th className={`px-2 relative py-[16px] text-[16px] font-[500] bg-[#7152EB] text-white ${header === 'Full Name' || header === 'Name' ? 'text-left pl-7' : ''}
      `}
         >
            {header === "Due Date" && <label htmlFor='check'>
               <img className='absolute right-5 top-0 bottom-0 m-auto cursor-pointer' onClick={onClick} src={sort} alt="sort" width={10} height={10} />
            </label>} {header}

            <input type="checkbox" id='check' className='absolute invisible' onChange={e => setSorted(e.target.checked)} />
         </th>
         :
         <th className={`px-2 py-3 font-semibold opacity-60 ${header === 'Full Name' || header === 'Name' || header === 'Student Name' ? 'text-left pl-7' : ''} ${dataFor === 'allUsers' ? 'text-sm' : 'text-sm'}
       `}>
            {header}
         </th>
   )
}
