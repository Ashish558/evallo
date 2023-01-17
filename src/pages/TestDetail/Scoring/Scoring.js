import React from 'react'

export default function Scoring({ sectionsData }) {

   // console.log('sectionsData', sectionsData);
   const { test, answer, scale } = sectionsData

   const { subjects } = answer

   // const getScore1 = (score, key, idx) => {
   //    console.log('score', score);
   //    console.log('key', key);
   //    // console.log('idx', idx);

   //    let index = idx
   //    if (idx > subjects.length - 1) {
   //       index = index % subjects.length
   //    }
   //    // console.log('subIndex', index);
   //    // let currentSub = ''
   //    if (key === 'CorrectQ') {
   //       return idx + 1
   //    }
   //    let scr = 0
   //    let sub = subjects.forEach(subj => {
   //       if (key === subj.scoreScale) {
   //          scr = score
   //       }
   //    })

   //    return 1
   // }

   const getScore1 = (subject, score, idx) => {
      // console.log('subject', subject);
      // console.log('score', score);
      // console.log('key', key);
      // console.log('idx', idx);

      let index = idx
      if (idx > subjects.length - 1) {
         index = index % subjects.length
      }
      // console.log('subIndex', index);
      // let currentSub = ''
      // if (key === 'CorrectQ') {
      //    return idx + 1
      // }
      // let scr = 0

      return score[subject.scoreScale]
   }

   const getScore = (score, idx) => {
      // console.log(idx);
      // console.log(subjects.length);
      let index = idx
      if (idx > subjects.length - 1) {
         index = index % subjects.length
      }
      let scale = subjects[index].scoreScale
      return score[scale]
   }

   const getMaxQuestions = () => {
      let ans = answer.answer
      let max = 0
      // console.log(answer.answer);
      ans.forEach(arr => {
         if (arr.length >= max) {
            max = arr.length
         }
      })
      // console.log(max);
      return max
   }

   console.log(sectionsData);
   const width = `${100 / (subjects.length)}%`

   return (
      <div className='flex flex-cl text-center'>
         <div className='flex flex-col'>
            <div className={`px-2 opacity-60 h-[60px] w-full pb-5`}>
               Q.no
            </div>
            {
               [...Array(scale.score.length)].map((x, i) =>
                  <div className={`px-2 h-[40px] opacity-60 w-full pb-5 bg-[#7152EB4D]`}>
                     {i + 1}
                  </div>
               )
            }
         </div>

         <div className='flex flex- items-start gap-0 flex-wrap'>
            {/* <div className={`px-2 opacity-60 w-[${width}] pb-5`}>
               Q.no
            </div> */}
            {subjects.map(sub => {
               return (
                  <div className={`px-2 opacity-60 h-[60px] w-[${width}] pb-5`}>
                     {sub.name}
                  </div>
               )
            })}
            {scale.score.map((score, idx) => {
               return (
                  subjects.map((subj, idx) => {
                     return <div className={`px-2 h-[40px] opacity-60 w-[${width}] pb-3`}>
                        {getScore1(subj, score, idx)}
                     </div>
                  })
                  // Object.keys(score).map((key, i) => {
                  //    return <div className={`px-2 h-[40px] opacity-60 w-[${width}] pb-3`}>
                  //       {getScore1(score, key, i)}
                  //       {/* {getScore(score, idx)} */}
                  //    </div>
                  // })
               )
            })}
         </div>

         {/* <table className='w-full'>

            <thead>
               <tr className='w-f'>
                  {subjects.map(sub => {
                     return (
                        <td className='px-2 w-fll opacity-60  pb-5'>
                           {sub.name}
                        </td>
                     )
                  })}
               </tr>
            </thead>
            <tbody>
               <tr>
                  {scale.score.map((score, idx) => {
                     return (
                        <td className='px-2 opacity-60 w-[25%] pb-3'>
                           {getScore(score, idx)}
                        </td>
                     )
                  })}
               </tr>
            </tbody>

         </table> */}

      </div>
   )
}
