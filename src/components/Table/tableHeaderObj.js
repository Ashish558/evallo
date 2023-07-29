import React, { useEffect, useState } from 'react'
import { useLazyGetSettingsQuery } from '../../app/services/session';
import InputSelect from '../InputSelect/InputSelect';
import sort from './../../assets/icons/sort.webp'

export function TableHeaderNew({ header, dataFor, onClick, setSorted }) {


   return (
      <th className={`px-2 py-3 font-semibold  cursor-pointer ${header.className ? header.className : ''}`}
         onClick={() => header.onCick && header.onCick()}
      >
         {header.text}
      </th>
   )
}
