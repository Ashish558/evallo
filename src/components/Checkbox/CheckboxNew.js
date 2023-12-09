import React from 'react'
import styles from "./style.module.css";

export const CheckboxNew = ({ item, handleCheckboxChange, boxData, setBoxData, Dname, className, textClassName }) => {
  return (

    <div className={`flex items-center mb-3 mr-6 ${className ?? className}`}>
      <div
        onClick={() =>

          handleCheckboxChange(item.text, boxData, setBoxData, Dname)
        }
        className={`${styles.container} `}
      >
        <input
          checked={item.checked}
          type="checkbox"
          name="hearAboutUs"
          value=""
        />
        <span class={styles.checkmark}></span>
      </div>
      <p
        onClick={() =>

          handleCheckboxChange(item.text, boxData, setBoxData, Dname)
        }
        className={`font-medium text-[#507CA8] ml-2  text-[15px] opacity-90 leading-5 ${textClassName ?? textClassName} `}
      >
        {item.text}
      </p>

    </div>


  )
}



//   export  const CheckBoxContainer = ({boxData, handleCheckboxChange, setBoxData}) => {
//   return (
//     <div> <div className="grid grid-cols-3">
//     {boxData?.map((item, idx) => {
//       return (
//         <div key={idx} className="flex items-center mb-3 mr-6">
//           <div
//             onClick={() =>
//               handleCheckboxChange(item.text, boxData, setBoxData)
//             }
//             className={`${styles.container} `}
//           >
//             <input
//               checked={item.checked}
//               type="checkbox"
//               name="hearAboutUs"
//               value=""
//             />
//             <span class={styles.checkmark}></span>
//           </div>
//           <p
//             onClick={() =>
//               handleCheckboxChange(item.text, boxData, setBoxData)
//             }
//             className="font-medium  text-[13px] opacity-90 leading-5"
//           >
//             {item.text}
//           </p>
//           {item.text === "Others" && item.checked ? (
//             <input
//               autoFocus
//               className="ml-3 text-[13px] text-[#7E7E7E] outline-[#DCDCDD] border-2 border-[#DCDCDD] rounded-md bg-[#DCDCDD]  w-48"
//               type="text"
//             />
//           ) : (
//             ""
//           )}
//         </div>
//       );
//     })}
//   </div></div>
//   )
// }

