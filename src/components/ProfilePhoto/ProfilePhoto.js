import React from 'react'
import styles from './style.module.css'
import ProfileImg from '../../assets/images/profile.png'
import CameraIcon from '../../assets/profile/camera.svg'
import { useRef } from 'react'

export default function ProfilePhoto({ src, handleChange, editable }) {

   const inputref = useRef()

   return (
      <div className={styles.imgContainer}>
         <img src={src} />
         {
            editable &&
            <>
               <input ref={inputref} type="file" name="myImage" className='hidden' accept="image/*"
                  onChange={e => handleChange(e.target.files[0])} />
               <div className={styles.cameraIcon} onClick={() => inputref.current.click()}>
                  <img src={CameraIcon} />
               </div>
            </>
         }
      </div>
   )
}
