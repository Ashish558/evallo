import React from 'react'
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical,faPen,faAngleDown,faCalculator} from '@fortawesome/free-solid-svg-icons';

export default function Navbar({secnd,setCountDown,showannotate,setshowannotate,details,handleSubmitSection,calculator_check,annotation_check,sectionDetails,cal,setCal}) {
  const [seconds, setSeconds] = useState(secnd)
  const [hide, sethide] = useState(false)
  useEffect(() => {
    if (seconds <= 0) {
      return handleSubmitSection();
    }
    setCountDown(seconds);
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);
    const minutes = Math.floor(seconds / 60);
  const second = seconds % 60;
    const [tog,setTog] =useState(false)
    // const {cal,setCal} = props
    let handleDesc= ()=>
    {
          setTog(!tog)
    }
    let w = {
        width :"50%",
        height :"80%"
    }
    let handleCal =()=>
    {
      setCal(!cal)
    }
  return (
    <div className='relative'>
      <nav className=' border w-[1920px] border-black text-xl flex justify-between py-4 px-12 left-0 right-0 navb'>
        <div className='flex w-1/3 flex-col items-start'>
        <div>
            <h3>{sectionDetails?.name?sectionDetails.name:'loading...'}</h3>
        </div>
        <div className=' align-middle text-sm pt-2 ' onClick={handleDesc}>
            <button  >Directions</button>
            <FontAwesomeIcon icon={faAngleDown} className=' absolute top-14 left-32' />  
        </div>
        {
        tog?<div style={w}  className=' z-10 text-base absolute bg-white shadow-lg shadow-gray-400  top-20 left-10 p-8'>
            <p>{details}</p>
        </div>:null
        }
        </div>
        <div className='flex w-1/3 flex-col justify-center items-center'>
          {hide?null:  <div className='' >
                <h4>{minutes<10?'0'+minutes:minutes} :{second<10?'0'+second:second}</h4>
            </div>}
            <div className=' text-sm pt-2  ' >
                <button className='border rounded-xl border-black hover:border-1 px-3' onClick={()=>sethide(!hide)} >{hide?'Show':'Hide'}</button>
            </div>
        </div>
        <div  className=' flex cursor-pointer w-1/3 justify-end text-sm '>
        {calculator_check?<div className='flex flex-col h-full items-center justify-center cursor-pointer' onClick={handleCal} >       
            <FontAwesomeIcon icon={faCalculator} className='' />
                <h4>Calculator</h4>
            </div>
            :null}
            {annotation_check?
            <div className='flex cursor-pointer flex-col items-center h-full justify-center px-3 ' onClick={()=>setshowannotate(!showannotate)}>
            <FontAwesomeIcon icon={faPen} className='' />  
            <h4>Annotate</h4>
            </div>
            :null}
            {/* <div className='flex flex-col items-center h-full justify-center '>
            <FontAwesomeIcon className='' icon={faEllipsisVertical} />
            <button>More</button>
            </div> */}
        </div>
            <FontAwesomeIcon icon="fa-sharp fa-regular fa-circle-ellipsis-vertical" style={{color: "#202122",}} />
      </nav>
     <hr />
    </div>
  )
}
