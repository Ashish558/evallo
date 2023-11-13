import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../../utils/utils";



const LatestSignUpTableItem = ({ item, onClick }) => {
    const handleClick = () => {
        onClick.redirect(item);
      };
      const [ dateFormat,setDateFormat ] = useState("dd/mm/yy")
      const { organization: organization2 } = useSelector((state) => state.organization)
      useEffect(()=>{
        if(organization2&&organization2?.settings){
          setDateFormat(organization2?.settings?.dateFormat)
        }
      },[organization2])
      console.log("latest",{dateFormat, organization2})
    return (
      <tr className="shadow-sm shadow-slate-200 rounded-2xl leading-8 my-2">
        <td className="  text-sm px-1  min-w-14 py-3 text-left">
          <span
            className="inline-block cursor-pointer pl-4 "
            onClick={handleClick}
          >
            {item.firstName + " " + item.lastName}
          </span>
        </td>
        <td className=" text-sm px-1 min-w-14 py-3 ">
          <div >{item.role}</div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >{item.email}</div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >{item.phone}</div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >
            {item.assiginedTutors?.length>0  ? item.assiginedTutors : "NA"}
          </div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >{item.credits}</div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >{item.userStatus}</div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >
            {item?.specialization?.length>0 ? item.specialization : "NA"}
          </div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >{getFormattedDate( new Date(item.createdAt),dateFormat)}</div>
        </td>
      </tr>
    );
  };

  export default LatestSignUpTableItem