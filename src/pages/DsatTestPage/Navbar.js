import React from 'react'
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical,faPen,faAngleDown} from '@fortawesome/free-solid-svg-icons';

export default function Navbar({seconds,sectionDetails,cal,setCal}) {
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
    <div className=''>
      <nav className=' border border-black text-xl flex justify-between py-4 px-12 left-0 right-0 navb'>
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
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis consectetur, recusandae fuga nulla enim blanditiis officia unde perferendis quam accusantium deleniti odit exercitationem fugiat est, id, eveniet reiciendis repellendus accusamus.</p>
        </div>:null
        }
        </div>
        <div className='flex w-1/3 flex-col justify-center items-center'>
            <div className='' >
                <h4>{minutes<10?'0'+minutes:minutes} :{second<10?'0'+second:second}</h4>
            </div>
            <div className=' text-sm pt-2  ' >
                <button className='border rounded-xl border-black hover:border-1 px-3' >Hide</button>
            </div>
        </div>
        <div  className=' flex pt-8 w-1/3 justify-end text-sm '>
            <div className=' cursor-pointer' onClick={handleCal} >
                <h4>Calculator</h4>
            </div>
            <div className=' px-3 '>
            <FontAwesomeIcon icon={faPen} className=' absolute top-8  right-28' />  
            <h4>Annotate</h4>
            </div>
            <div className=' '>
            <FontAwesomeIcon className=' right-16 top-8 absolute' icon={faEllipsisVertical} />
            <button>More</button>
            </div>
        </div>
            <FontAwesomeIcon icon="fa-sharp fa-regular fa-circle-ellipsis-vertical" style={{color: "#202122",}} />
      </nav>
     <hr />
    </div>
  )
}
