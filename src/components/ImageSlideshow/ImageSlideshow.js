import React, { useEffect, useState } from 'react'
import styles from './style.module.css'
import { useSelector } from 'react-redux'

export default function ImageSlideshow({ images }) {

   const [current, setCurrent] = useState(0)
   const { awsLink } = useSelector(state => state.user)

   useEffect(() => {
      const intervalId = setInterval(() => {
         setCurrent(idx => {
            return idx < images.length - 1 ? idx + 1 : 0
         })
      }, 6000);
      return () => clearInterval(intervalId)
   }, [])

   const openLink = (link) => {
      window.open(link)
   }
   return (
      <div className={styles.images}>
         {images.map((image, i) => {
            return (
               <div className={`overflow-hidden rounded-[20px] bg-cover	bg-center	 ${styles.img} 
               ${current === i ? styles.active : i < current ? styles.prev : styles.next}`}
                  style={{ backgroundImage: `url(${awsLink}${image.image})` }}
                  onClick={() => openLink(image.link)} >
               </div>
            )
         })}
      </div>
   )
}
