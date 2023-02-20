import React, { useEffect, useState } from 'react'
import CrossIcon from '../../assets/icons/cross.svg'
import SingleItem from './SingleItem';
import styles from './style.module.css'

export default function FilterItems({ items, setData, onRemoveFilter, className, isString, keyName, onlyItems, sliceText, image, fetchData, api }) {


   return (
      onlyItems ?
         items?.map((item, idx) => {
            item.text?.map((text, idx) => {
               return (
                  <SingleItem idx={idx} image={image} item={text} keyName={keyName} onRemoveFilter={onRemoveFilter} className={className} sliceText={sliceText} isString={isString} fetchData={fetchData} />
               )
            })
         }) : (
            <div className='flex items-center flex-wrap'>
               {items.map((singleItem, idx) => {
                  return Array.isArray(singleItem.text) ?
                     singleItem.text.map((text, idx) => {
                        return (
                           <div key={idx} className={`mr-3 ${className ? className : ''} bg-primaryLight py-1 px-3 rounded-7 group ${styles.filterItem}`}>
                              <p className='text-lightGray text-[16px]'>
                                 {text}
                              </p>
                              <img className={styles.icon} src={CrossIcon} alt='cross-icon'
                                 onClick={() => keyName ? onRemoveFilter(text, keyName, idx) :
                                    onRemoveFilter(singleItem, text, true)} />
                           </div>
                        )
                     }) :
                     <div key={idx} className={`mr-3 ${className ? className : ''} bg-primaryLight py-1 px-3 rounded-7 group ${styles.filterItem}`}>
                        <p className='text-lightGray text-[16px]'>
                           {isString ? singleItem : singleItem.text}
                        </p>
                        <img className={styles.icon} src={CrossIcon} alt='cross-icon'
                           onClick={() => keyName ? onRemoveFilter(singleItem, keyName, idx) : onRemoveFilter(singleItem, null, false)} />
                     </div>

               })}
            </div>)
   )
}
