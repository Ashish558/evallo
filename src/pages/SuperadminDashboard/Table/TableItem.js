import React from "react";
import LatestSignUpTableItem from "./LatestSignUpTableItem";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../../utils/utils";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getMonthName } from "../../../utils/utils";

export default function TableItem({ item, onClick, AdminLatestSignUp,className }) {
  const [ dateFormat,setDateFormat ] = useState("dd/mm/yy")
  const navigate=useNavigate()
      const { organization: organization2 } = useSelector((state) => state.organization)
      useEffect(()=>{
        if(organization2&&organization2?.settings&&organization2?.settings?.dateFormat){
          setDateFormat(organization2?.settings?.dateFormat)
        }
      },[organization2])
      console.log("latest dateF",{dateFormat, organization2,item})
  const handleClick = () => {
   // onClick.redirect(item);
navigate(`orgadmin-profile/${item?._id}`)
  };

  //  format monthName date, year
  const formatDate= (value)=>{
    return value
    let [ year, month, day] = value.split("-");
     if(dateFormat==="dd/mm/yy"){
      [ day, month,  year] = value.split("-");
     }
    else  if(dateFormat==="mm/dd/yy"){
      [ month, day, year] = value.split("-");
     }
else [ year, month, day] = value.split("-");
    const monthName = getMonthName(month-1);
    console.log(
     { 
       value : value,
       day : day,
       month : month,
       year : year,
       monthName :monthName
      }
   );
    
    let formattedDate = `${monthName}` + " " + `${year}` + `,` + `${day}`;
   
    return formattedDate
   }

  return AdminLatestSignUp ? (
    <LatestSignUpTableItem item={item} onClick={onClick} />
  ) : (
    <tr className={`my-5 box-content  shadow-[0px_0px_1.33333px_0px_rgba(0,0,0,0.25)]`}>
     
      <td className={`${className}  text-sm px-1  min-w-14 py-[15px] text-left`}>
        <span
          className="inline-block cursor-pointer pl-4 "
          onClick={handleClick}
        >
          {item.name}
        </span>
      </td>
      <td className={`${className}  text-sm px-[10px]  min-w-14 py-[15px] text-left`}>
        <div>{item.admin}</div>
      </td>
      <td className={`${className} text-sm pr-2  min-w-14 py-[15px] pl-[10px] text-left`}>
        <div>{item.status}</div>
      </td>
      <td className={`${className} text-sm   min-w-14 py-[15px] pr-3 pl-1`}>
        <div>{item.type}</div>
      </td>
      <td className={`${className} text-sm   min-w-14 py-[15px] pr-3 pl-1 text-left`}>
        <div>
          {/* {new Date(item.date).toDateString().split(' ')[1] }. {new Date(item.date).getDate() }, {new Date(item.date).getFullYear()} */}
          {formatDate(getFormattedDate(item.date, dateFormat))}
        </div>
      </td>
    </tr>
  );
}
