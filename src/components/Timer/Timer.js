import React, { useEffect, useState } from 'react'

export default function Timer({ timer, active }) {

   var initMinutes = Math.floor(timer / 60);
   var initSec = timer - initMinutes * 60;

   const [minutes, setMinutes] = useState(initMinutes);
   const [seconds, setSeconds] = useState(initSec);

   useEffect(() => { 
      let myInterval = setInterval(() => {
         if (seconds > 0) {
            setSeconds(seconds - 1);
         }
         if (seconds === 0) {
            if (minutes === 0) {
               clearInterval(myInterval)
            } else {
               setMinutes(minutes - 1);
               setSeconds(59);
            }
         }
      }, 1000)
      return () => {
         clearInterval(myInterval);
      };
   })

   return (

         <div className='min-w-[300px] bg-primary rounded-20 text-white flex flex-col items-center px-9 py-6 font-bold mt-[100px]'>
            <p className='text-[28px]'> Timer </p>
            <p className='text-[70px] leading-none'>
               {/* 45:00 */}
               {minutes === 0 && seconds === 0
                  ? null
                  : <> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</>
               }
            </p>
         </div>

   )
}
