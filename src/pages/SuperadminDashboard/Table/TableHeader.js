import React, { useEffect, useState } from 'react'

export default function TableHeader({ header, dataFor, onClick, setSorted }) {

   return (

      <th className={`px-2 py-3 font-semibold opacity-60  text-sm`}>
         {header}
      </th>
   )
}
