import React from 'react'
import EditIcon from '../../assets/icons/edit.svg'

export default function EditableText({ className, text, editable, imgClass, textClassName, onClick, editOnly }) {


   return (
      <div className={`text-primaryDark cursor-pointer  ${text !== "Contact" && "text-center"} font-bold flex ${className}`}>
         <div onClick={onClick} className={`${textClassName ? textClassName : ''} underline mr-1`}>
            {text}
         </div>
         {editable && false &&
            <img src={EditIcon}  alt='edit-icon' className={`${editOnly ? "ml-4" : "ml-1"} ${imgClass ? imgClass : ''} cursor-pointer`}
                />
         }
      </div>
   )
}
