import React from 'react'
import EditIcon from '../../assets/icons/edit.svg'

export default function EditableText({ className, text, editable, imgClass, textClassName, onClick }) {


   return (
      <div className={`text-primaryDark ${text !== "Contact" && "text-center"} font-bold flex ${className}`}>
         <div className={`${textClassName ? textClassName : ''}`}>
            {text}
         </div>
         {editable &&
            <img src={EditIcon} className={`ml-4 ${imgClass ? imgClass : ''} cursor-pointer`}
               onClick={onClick} />
         }
      </div>
   )
}
