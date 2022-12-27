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


   return (
      <div className={styles.images}>
         {images.map((src, i) => {
            return <img key={i} src={src} className={`${styles.img} 
            ${current === i ? styles.active : i < current ? styles.prev : styles.next}`} />
         })}
      </div>
   )
}
