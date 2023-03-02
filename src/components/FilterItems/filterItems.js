import React, { useEffect, useState } from 'react'
import CrossIcon from '../../assets/icons/cross.svg'
import SingleItem from './SingleItem';
import styles from './style.module.css'

export default function FilterItems({ items, setData, onRemoveFilter, className, isString, keyName, onlyItems, sliceText, image, fetchData, api, baseLink }) {



   return (
      onlyItems ?
         items?.map((item, idx) => {
            return (
             <SingleItem idx={idx} image={image} item={item} keyName={keyName} onRemoveFilter={onRemoveFilter} className={className} sliceText={sliceText} isString={isString} fetchData={fetchData} baseLink={baseLink} />
            )
         }) : (
            <div className='flex items-center flex-wrap'>
               {items.map((item, idx) => {
                  return (
                     <div key={idx} className={`mr-3 ${className ? className : ''} bg-primaryLight py-1 px-3 rounded-7 group ${styles.filterItem}`}>
                        <p className='text-lightGray text-[16px]'>
                           {isString ? item : item.text}
                        </p>
                        <img className={styles.icon} src={CrossIcon} alt='cross-icon'
                           onClick={() => keyName ? onRemoveFilter(item, keyName, idx) : onRemoveFilter(item)} />
                     </div>
                  )
               })}
            </div>)
   )
}
