import React from 'react'
import styles from './style2.module.css'
import ProfileImg from '../../../../assets/images/profile.png'
import CameraIcon from '../../../../assets/profile/camera.svg'
import { useRef } from 'react'

export default function ProfilePhoto({ src, handleChange, editable, isTutor,customWidth ,imgSizeClass}) {

   const inputref = useRef()

   return (
      <div className={`${styles.imgContainer} ${isTutor ? styles.imgContainerTutor : ''}  ${customWidth ? styles.imgContainerModalTutor :''}`}>
         <img src={src} className={`${imgSizeClass}`}/>
         {
            editable &&
            <>
               <input ref={inputref} type="file" name="myImage" className='hidden' accept="image/*"
                  onChange={e => handleChange(e.target.files[0])} />
               <div className={`${styles.cameraIcon} ${isTutor ? styles.tutorCamera : ''}`} 
               onClick={() => inputref.current.click()}>
                  <img className='cursor-pointer' src={CameraIcon} alt="CameraIcon"/>
               </div>
            </>
         }
      </div>
   )
}
