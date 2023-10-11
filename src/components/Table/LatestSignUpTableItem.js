import { useSelector } from "react-redux";
import { getFormattedDate } from "../../utils/utils";
import { useEffect } from "react";
import { useState } from "react";


const LatestSignUpTableItem = ({ item, onClick }) => {
  const [ dateFormat,setDateFormat ] = useState("dd/mm/yy")
  const { organization: organization2 } = useSelector((state) => state.organization)
  useEffect(()=>{
    if(organization2&&organization2?.settings){
      setDateFormat(organization2?.settings?.dateFormat)
    }
  },[organization2])
  console.log("latest",{dateFormat, organization2})
  const handleClick = () => {
    onClick.redirect(item);
  };
  return (
    <tr className=" leading-8 ">
      <td className="  text-[17.5px] px-[10px]  min-w-14 py-4 text-left">
        <span
          className="inline-block cursor-pointer pl-4 "
          onClick={handleClick}
        >
          {item.firstName + " " + item.lastName}
        </span>
      </td>
      <td className=" text-[17.5px] px-[10px] min-w-14 py-4 ">
        <div >{item.role}</div>
      </td>
      <td className=" text-[17.5px] px-[10px]  min-w-14 py-4">
        <div >{item.email}</div>
      </td>
      <td className=" text-[17.5px] px-[10px]  min-w-14 py-4">
        <div >{item.phone}</div>
      </td>
      <td className=" text-[17.5px] px-[10px]  min-w-14 py-4">
        <div >
          {item.assiginedTutors?.length > 0 ? item.assiginedTutors : "NA"}
        </div>
      </td>
      <td className=" text-[17.5px] px-[10px]  min-w-14 py-4">
        <div >{item.credits}</div>
      </td>
      <td className=" text-[17.5px] px-[10px]  min-w-14 py-4">
        <div >{item.userStatus}</div>
      </td>
      <td className=" text-[17.5px] px-[10px]  min-w-14 py-4">
        <div >
          {item?.specialization?.length > 0 ? item.specialization : "NA"}
        </div>
      </td>
      <td className=" text-[17.5px] px-[10px]  min-w-14 py-4">
        <div >
          {/* {new Date(item.lastSignUp).toDateString()} */}
        {  getFormattedDate(item.lastSignUp, dateFormat)}
        
        </div>
      </td>
    </tr>
  );
};

export default LatestSignUpTableItem