import React from 'react'
import styles from './style.module.css'
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

export default function SubjectSlider({className, title, totalMarks, outOf, subjects }) {


   return (
      <div className={className ? className : ''} >
         <OwlCarousel className="owl-theme" loop margin={30} items={1}>
            <div className="item px-2 mt-3">
               <div className="flex items-center justify-between">
                  <div className="">
                     <div className={styles.circle} >
                        <div className={styles.circleInner} ></div>
                        <div className={`z-4 ${styles.circleContent}`}>
                           <div className='flex justify-center flex-col items-center'>
                              <p className='font-bold text-4xl text-center text-primary'> {totalMarks} </p>
                              <p className='text-xs font-bold' > Out of {outOf} </p>
                           </div>
                        </div>
                     </div>
                     <p className='font-bold mt-2 '> {title} </p>

                  </div>
                  <div className='flex-1 ml-10'>
                     <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
                        {subjects.map(({ marks, name, bg }, idx) => {
                           return (
                              <div key={idx} className='py-2.5 px-8 rounded-10' style={{backgroundColor: bg}} >
                                 <p className='font-bold text-[32px] text-center mb-1 '> {marks} </p>
                                 <p className='text-sm font-bold text-center mb-1' > {name} </p>
                              </div>
                           )
                        })}
                     </div>
                  </div>
               </div>
            </div>


         </OwlCarousel>

      </div>


   )
}
