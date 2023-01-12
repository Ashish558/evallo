import React, { useState } from 'react'
import styles from './style.module.css'

import LeftIcon from '../../assets/profile/left.svg'
import RightIcon from '../../assets/profile/right.svg'
import ProfileImg from '../../assets/images/profile.png'

export default function Slider({ images }) {

   const [activeIndex, setActiveIndex] = useState(0)

   // console.log(images);
   return (
      <div className={`${styles.studentsContainer} min-h-[200px] w-full`}>
         <img src={LeftIcon}
            className={`${styles.sliderIcon} ${styles.sliderLeftIcon}`}
            onClick={() => activeIndex !== 0 && setActiveIndex(activeIndex - 1)} />
         <img src={RightIcon}
            className={`${styles.sliderIcon} ${styles.sliderRightIcon}`}
            onClick={() => activeIndex < images.length - 1 &&
               setActiveIndex(activeIndex + 1)} />

         {images.map((student, idx) => {
            return (
               <div className={`${styles.student} ${activeIndex === idx ? styles.activeStudent : idx < activeIndex ? styles.previousStudent : styles.nextStudent} flex flex-col items-center px-10 lg:mb-2`}>
                  <div className={styles.studentImageContainer}>
                     <img src={student.image} />
                  </div>
                  <div className='mt-6 font-inter text-center '
                  // onClick={() => navigate('/profile/student/12')}
                  >
                     <div className='flex justify-center '>
                     <img className='w-[100px] h-[100px] rounded-full' src={student.photo ? student.photo : '/images/default.jpeg'} />
                     </div>
                     <p className='font-bold text-sm opacity-60 mt-3 whitespace-nowrap'>
                        {student.value}
                     </p>

                  </div>
               </div>
            )
         })}
      </div>
   )
}
