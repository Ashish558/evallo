import React from 'react'
import styles from "../style.module.css"
const SPFrame1 = () => {
  return (
    <div> <div className="flex mt-7 justify-between gap-5">
    <div className="flex-1 h-[230px] gap-7 flex flex-col">
      <div className="flex-1 ">
        <p className=" text-sm text-[#26435F] font-semibold">
          Whiteboard Links
        </p>

        <div
          className="w-full relative !border-[1.25px_dashed_#517CA8] h-full flex rounded-md items-center overflow-hidden shadow-[0px_0px_2.500001907348633px_0px_#00000040]"
          id={styles.borderDashed}
        ></div>
      </div>
      <div className="flex-1 ">
        <p className=" text-sm text-[#26435F] font-semibold">
          Associated docs
        </p>

        <div
          className="w-full relative !border-[1.25px_dashed_#517CA8] h-full flex rounded-md items-center overflow-hidden shadow-[0px_0px_2.500001907348633px_0px_#00000040]"
          id={styles.borderDashed}
        ></div>
      </div>
    </div>
    <div className="flex-1 h-[230px]">
      <p className=" text-sm text-[#26435F] font-semibold">
        Interests
      </p>

      <div
        className="w-full relative h-full p-1 flex flex-col gap-1  rounded-md items-center overflow-y-auto custom-scroller"
        
      >
        {[
          1, 2, 3, 4, 5, 7, 8, 8, 9, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ].map((it) => {
          return (
            <div className="bg-white h-[100px] p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full">
              {it}
            </div>
          );
        })}
      </div>
    </div>

    <div className="flex-1 h-[230px]">
      <p className=" text-sm text-[#26435F] font-semibold">
        Subjects
      </p>

      <div
        className="w-full relative h-full p-1 flex flex-col gap-1  rounded-md items-center overflow-y-auto custom-scroller"
        
      >
        {[
          1, 2, 3, 4, 5, 7, 8, 8, 9, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ].map((it) => {
          return (
            <div className="bg-white h-[100px] p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full">
              {it}
            </div>
          );
        })}
      </div>
    </div>
    <div className="flex-1 h-[230px]">
      <p className=" text-sm text-[#26435F] font-semibold">
        Personality
      </p>

      <div
        className="w-full relative h-full p-1 flex flex-col gap-1  rounded-md items-center overflow-y-auto custom-scroller"
        
      >
        {[
          1, 2, 3, 4, 5, 7, 8, 8, 9, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ].map((it) => {
          return (
            <div className="bg-white h-[100px] p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full">
              {it}
            </div>
          );
        })}
      </div>
    </div>
  </div></div>
  )
}

export default SPFrame1