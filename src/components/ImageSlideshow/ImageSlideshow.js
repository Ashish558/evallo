import React, { useEffect, useState } from 'react'
import styles from './style.module.css'

export default function ImageSlideshow({ images }) {

   const [current, setCurrent] = useState(0)

   useEffect(() => {
      const intervalId = setInterval(() => {
         setCurrent(idx => {
            return idx < images.length - 1 ? idx + 1 : 0
         })
      }, 4000);
      return () => clearInterval(intervalId)
   }, [])

   const openLink = (link) => {
      window.open(link)
   }
   
   return (
      <div className={styles.images}>
         {images.map((image, i) => {
            return (
               <div className={`overflow-hidden rounded-[20px] ${styles.img} 
               ${current === i ? styles.active : i < current ? styles.prev : styles.next}`}
                  style={{ backgroundImage: `url(${image.image})`, backgroundPosition: 'center' }}
                  onClick={() => openLink(image.link)} >
               </div>
            )
         })}
      </div>
   )
}
