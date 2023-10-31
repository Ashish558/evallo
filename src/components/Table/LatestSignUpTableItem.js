import { useSelector } from "react-redux";
import { getFormattedDate } from "../../utils/utils";
import { useEffect } from "react";
import { useState } from "react";
import { useLazyGetTutorDetailsQuery } from "../../app/services/users";


const LatestSignUpTableItem = ({ item, onClick }) => {
  const [ dateFormat,setDateFormat ] = useState("dd/mm/yy")
  const { organization: organization2 } = useSelector((state) => state.organization)
  const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery();
  const [tutor,setTutor]=useState([])
  useEffect(()=>{
    if(organization2&&organization2?.settings){
      setDateFormat(organization2?.settings?.dateFormat)
    }
  },[organization2])
  console.log("latest",{dateFormat, organization2})
  const handleClick = () => {
    onClick.redirect(item);
  };
  useEffect(()=>{
    if(!item?.assiginedTutors||item?.assiginedTutors?.length===0)
    return
    item?.assiginedTutors?.map((it,idd)=>{
      let userId=it
      getUserDetail({ id: userId }).then((res) => {
        console.log("response",userId, res?.data);
        if(!res?.data)return 
        const {firstName,lastName}=res.data.data.user
         let fullName=firstName+" "+lastName+", "
        
        setTutor((prev)=>{
  
          if(tutor?.includes(fullName))
          return [...prev]
         return   [...prev,fullName]});
      
      })
    })
    
  },[item])
  return (
    <tr className=" leading-8 ">
      <td className="  text-[17.5px] px-[16px]  min-w-14 py-4 text-left">
        <span
          className="inline-block cursor-pointer pl-4 "
          onClick={handleClick}
        >
          {item.firstName + " " + item.lastName}
        </span>
      </td>
      <td className=" text-[17.5px] px-[16px] min-w-14 py-4 ">
        <div >{item.role}</div>
      </td>
      <td className=" text-[17.5px] pr-[16px] pl-6  min-w-14 py-4 text-left">
        <div >{item.email}</div>
      </td>
      <td className=" text-[17.5px] px-[16px]  min-w-14 py-4">
        <div >{item.phone}</div>
      </td>
      <td className=" text-[17.5px] px-[16px]  py-4">
        <div className="max-w-[300px] overflow-x-auto custom-scroller-2  min-w-[100px]">
          {tutor && tutor?.length>0 ?tutor : "NA"}
        </div>
      </td>
      <td className=" text-[17.5px] px-[16px]  min-w-14 py-4">
        <div >{item.credits}</div>
      </td>
      <td className=" text-[17.5px] px-[16px]  min-w-14 py-4">
        <div >{item.userStatus}</div>
      </td>
      <td className=" text-[17.5px] px-[16px]  min-w-14 py-4">
        <div >
          {item?.specialization?.length > 0 ? item.specialization : "NA"}
        </div>
      </td>
      <td className=" text-[17.5px] px-[16px]  min-w-14 py-4">
        <div >
          {/* {new Date(item.lastSignUp).toDateString()} */}
        {  getFormattedDate(item.lastSignUp, dateFormat)}
        
        </div>
      </td>
    </tr>
  );
};

export default LatestSignUpTableItem