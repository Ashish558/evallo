import React from 'react'
import toggleRectIcon from '../../assets/icons/toggle-rect.svg'
import toggleRectActiveIcon from '../../assets/icons/toggle-rect-active.svg'
import toggleCircleIcon from '../../assets/icons/toggle-circle.svg'
import styles from './style.module.css'

export default function SettingsCard({ title, titleClassName, className, body, toggle, onToggle }) {


   return (
      <div className={`rounded-2xl shadow-white py-9 px-6 lg:px-6 bg-white lg:shadow-light mb-7 pb-[26px] ${className ? className : ''}
      `}>
         <div className={`text-primary-dark font-bold flex justify-between mb-5 ${titleClassName ? titleClassName : ""}`}>
            {title}
            {
               toggle !== undefined &&
               <div className='flex items-center'>
                  <p className='text-[#AAAAAA] text-xs mr-2'>Show icons / images</p>
                  <div className={styles.toggleContainer} onClick={() => onToggle(toggle.key, !toggle.value)} >
                     <img src={toggle.value === false ? toggleRectIcon : toggleRectActiveIcon} alt='toggle' />
                     <img src={toggleCircleIcon} className={`${toggle.value === false ? styles.toggleCircle : styles.toggleCircleActive}`} alt='toggle' />
                  </div>
               </div>
            }
         </div>
         {body && body}
      </div>
   )
}
