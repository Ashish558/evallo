import React, { useEffect, useState } from 'react';
import styles from './styles.module.css'

export default function TableHeader({ header, dataFor, onClick, setSorted }) {

   return (

      <th className={`${styles.customHeader} py-3   text-sm`}>
         {header}
      </th>
   )
}
