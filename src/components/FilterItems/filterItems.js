import React from 'react'
import CrossIcon from '../../assets/icons/cross.svg'
import styles from './style.module.css'

export default function FilterItems({ items, setData, onRemoveFilter, className, isString, keyName, onlyItems, sliceText, image }) {


   return (
      onlyItems ?
         items.map((item, idx) => {
            return (
               <div key={idx} className={`mr-3 ${className ? className : ''} bg-primaryLight py-1 px-3 rounded-7 group ${styles.filterItem}`}>
                  {image && <div className='w-[85px] h-[85px] mx-auto flex justify-center'>
                     <img src={item.image} className='w-full h-full object-contain	' />
                  </div>}
                  <p className='text-lightGray text-center text-[14px]'>
                     {sliceText ? item.image.slice(-23) : isString ? item : item.text}
                  </p>
                  <img alt='cross-icon' className={styles.icon} src={CrossIcon}
                     onClick={() => keyName ? onRemoveFilter(item, keyName, idx) : onRemoveFilter(item)} />
               </div>
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
