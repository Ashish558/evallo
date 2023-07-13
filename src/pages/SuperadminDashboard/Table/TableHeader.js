import React, { useEffect, useState } from 'react';
import styles from './styles.module.css'

export default function TableHeader({ header, dataFor, onClick, setSorted,Icon }) {

   return (

      <th className={`${styles.customHeader} py-3   text-sm`}>
         {header}
        {Icon && Icon}
      </th>
   )
}
