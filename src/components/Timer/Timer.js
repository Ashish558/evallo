import React, { useEffect, useState, memo } from 'react'

function Timer({ timer, active, handleSubmitSection, setCountDown, isUnlimited }) {

   var initMinutes = Math.floor(timer / 60);
   var initSec = timer - initMinutes * 60;

   const [initTimer, setInitTimer] = useState(timer)
  
   const minutes = Math.floor(initTimer / 60);
   const seconds = Math.floor(initTimer % 60);

   useEffect(() => {
      if (isUnlimited === true) return
      if (timer <= 0) {
         handleSubmitSection()
      }
   }, [timer])

   useEffect(() => {
      let timer = 0
      timer = timer + seconds
      if (minutes > 0) {
         timer = timer + minutes * 60
      }
      setCountDown(timer)
   }, [seconds, minutes])

   useEffect(() => {
      if (seconds === 0 && minutes === 0) {
         handleSubmitSection()
      }
   }, [seconds, minutes])

   useEffect(() => {
      const intId = setInterval(() => {
         setInitTimer(prev => prev - 1);
      }, 1000);

      if (initTimer === 0) {
         clearInterval(intId);
      }

      return () => {
         clearInterval(intId);
      };
   }, [])

   // useEffect(() => {
   //    // if (isUnlimited === true) return
   //    console.log('ue ran');
   //    let myInterval = setInterval(() => {
   //       if (seconds > 0) {
   //          setSeconds(seconds - 1);
   //       }
   //       if (seconds === 0) {
   //          if (minutes === 0) {
   //             clearInterval(myInterval)
   //          } else {
   //             setMinutes(minutes - 1);
   //             setSeconds(59);
   //          }
   //       }
   //    }, 1000)
   //    return () => {
   //       clearInterval(myInterval);
   //    };
   // }, [minutes, seconds])

   return (

      <div className='min-w-[300px] bg-primary rounded-20 text-white flex flex-col items-center px-9 py-6 font-bold mt-[100px]'>
         <p className='text-[28px]'> Timer </p>
         <p className='text-[70px] leading-none'>
            {/* 45:00 */}
            {isUnlimited === true ?
               '-'
               :
               minutes === 0 && seconds === 0
                  ? null
                  : <> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</>
            }
         </p>
      </div>

   )
}

export default memo(Timer)