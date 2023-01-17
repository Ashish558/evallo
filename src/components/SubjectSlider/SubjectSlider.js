import React from 'react'
import styles from './style.module.css'
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

export default function SubjectSlider({ score, className, title, header, totalMarks, outOf, subjects, isSat, isAct }) {


   return (
      <div className={className ? className : ''} >
         <div className="item px-2 mt-3">
            <div className="flex items-center justify-between">
               <div className="">
                  <div className={`text-[#4715D7] font-bold text-[21px] mb-[20px]`}>
                     {header}
                  </div>
                  <div className={styles.circle} >
                     <div className={styles.circleInner} ></div>
                     <div className={`z-4 ${styles.circleContent}`}>
                        <div className='flex justify-center flex-col items-center'>
                           <p className='font-bold text-[42.84px] text-center text-primary'> {totalMarks} </p>
                           <p className='text-[10.28px] font-bold' > Out of {outOf} </p>
                        </div>
                     </div>
                  </div>
                  <p className='font-bold mt-2 '> {title} </p>

               </div>
               <div className='flex-1 ml-10'>
                  <div className='grid grid-cols-2 gap-x-4 gap-y-4'>

                     {/* {subjects.map(({ marks, name, bg }, idx) => {
                        return (
                           <div key={idx} className='py-2.5 px-8 rounded-10' style={{ backgroundColor: bg }} >
                              <p className='font-bold text-[32px] text-center mb-1 '> {marks} </p>
                              <p className='text-sm font-bold text-center mb-1' > {name} </p>
                           </div>
                        )
                     })} */}
                     {
                        isSat && <>
                           <div className='py-2.5 px-8 rounded-10'
                              style={{ backgroundColor: '#FEDCC3' }} >
                              <p className='font-bold text-[32px] text-center mb-1 '> {score.verbal ? score.verbal : '-'} </p>
                              <p className='text-sm font-bold text-center mb-1' > Verbal </p>
                           </div>
                           <div className='py-2.5 px-8 rounded-10' style={{ backgroundColor: '#DACDFF' }} >
                              <p className='font-bold text-[32px] text-center mb-1 '> {score.maths ? score.maths : '-'} </p>
                              <p className='text-sm font-bold text-center mb-1' > Maths  </p>
                           </div>
                        </>
                     }
                     {
                        isAct && <>
                           <div className='py-2.5 px-8 rounded-10'
                              style={{ backgroundColor: '#FEDCC3' }} >
                              <p className='font-bold text-[32px] text-center mb-1 '> {score.maths ? score.maths : '-'} </p>
                              <p className='text-sm font-bold text-center mb-1' > Maths </p>
                           </div>
                           <div className='py-2.5 px-8 rounded-10' style={{ backgroundColor: '#DACDFF' }} >
                              <p className='font-bold text-[32px] text-center mb-1 '> {score.english ? score.english : '-'} </p>
                              <p className='text-sm font-bold text-center mb-1' > English  </p>
                           </div>
                           <div className='py-2.5 px-8 rounded-10'
                              style={{ backgroundColor: '#DACDFF' }} >
                              <p className='font-bold text-[32px] text-center mb-1 '> {score.reading ? score.reading : '-'} </p>
                              <p className='text-sm font-bold text-center mb-1' > Reading  </p>
                           </div>
                           <div className='py-2.5 px-8 rounded-10' style={{ backgroundColor: '#DACDFF' }} >
                              <p className='font-bold text-[32px] text-center mb-1 '> {score.science ? score.science : '-'} </p>
                              <p className='text-sm font-bold text-center mb-1' > Science  </p>
                           </div>
                        </>
                     }

                  </div>
               </div>
            </div>
         </div>

      </div>


   )
}
