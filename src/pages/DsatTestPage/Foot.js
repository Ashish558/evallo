import React from 'react'
import {faXmark, faLocationDot,faBookmark,faSquare} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useState} from 'react'
export default function Foot(props) {
    // const {next,prev  ,ind,s,data ,set} =props  
    const {next,prev ,mark,name ,i,s,data ,set,answers,handleSubmitSection,tog2,toggle2,markreview} =props  
    const [toggle,setToggle] =useState(false)
    let click =(e)=>
    {
      if(e.target.innerText==1)
      {
        set(1)
      }
       set(e.target.innerText-1)
       console.log(e.target.innerText)
    }
    let tog =()=>
    {
     setToggle(!toggle)
    }
    return (
    <>
    {toggle2?
    <section className=' bg-white absolute  shadow-md shadow-gray-400 top-[16%]  right-[10%] px-12 pt-2 h-[25rem] w-[80%]'>
    <h3 className=' text-center text-lg py-3 font-semibold'>Section 1 : Reading and Writing Questions    </h3>
     <hr className=' border border-gray-400 border-t-0' />
    <div className=' py-3 flex text-center align-middle justify-evenly'>
            <div>
            <FontAwesomeIcon icon={faSquare} color='white' className='border-black border rounded mr-2 ' />
            <span>Unanswered</span>
            </div>
            <div>
            <FontAwesomeIcon icon={faBookmark} color='yellow' className='mr-2' />
            <span>For review</span>  
            </div>
    </div>
<hr className=' border border-gray-400 border-t-0' />
     <div className=' pt-8 flex justify-center'>
        {
            data.map((e,ind)=>
            {
                return <span onClick={click}  className= {`text-black font-semibold border border-dotted border-black py-2 px-3 mx-2 ${ answers[ind].ResponseAnswer!=''?'text-white bg-blue-600':null} ${markreview[ind]?.review && 'bg-yellow-400'}`}>{ind+1}</span>
            })
        }
        </div>
    </section>
    :null}
    <div className=' '>
        {
         toggle?   
         <section className=' bg-white  absolute  shadow-md shadow-gray-400 bottom-20  right-[30rem] px-12 pt-2 h-64'>
        <h3 className=' text-center text-lg py-3 font-semibold'>Section 1 : Reading and Writing Questions    </h3>
        <FontAwesomeIcon onClick={tog} icon={faXmark} className=' absolute right-7 top-6' />
         <hr className=' border border-gray-400 border-t-0' />
        <div className=' py-3 flex text-center align-middle justify-evenly'>
            <div>
            <FontAwesomeIcon icon={faSquare} color='green' className='border-black rounded mr-2 ' />
            <span>Current</span>
            </div>
            <div>
            <FontAwesomeIcon icon={faSquare} color='white' className='border-black border rounded mr-2 ' />
            <span>Unanswered</span>
            </div>
            <div>
            <FontAwesomeIcon icon={faBookmark} color='yellow' className='mr-2' />
            <span>For review</span>  
            </div>
        </div>
    <hr className=' border border-gray-400 border-t-0' />
         <div className=' pt-8'>
            {
                data?.map((e,ind)=>
                {
                    return <span onClick={click}  className={` relative text-black font-semibold border border-dotted border-black py-2 px-3 mx-2 ${i==ind+1? 'text-white bg-green-600':answers[ind].ResponseAnswer!=''?'text-white bg-blue-600':null} ${markreview[ind].review && 'bg-yellow-400'}`}>
            {mark[i+1]?<FontAwesomeIcon icon={faBookmark} className={` absolute top-0 text-red-700 `} />:null}
                      {ind+1}</span>
                })
            }
            </div> 
          <div className=' left-40 text-blue-700 font-semibold flex justify-center items-center mx-16 px-6 border border-blue-700 mt-8 py-1  rounded-2xl' onClick={()=>{
            tog()
            tog2();

          }}>
            <button> Go to review page </button>
            </div>  
        </section>:null
            }
      <footer className='   left-0 right-0 bottom-0 flex justify-between px-12 pt-4 pb-8 border border-black '>
       <div className='flex justify-start items-center w-1/3'>
       <h2 className=' text-xl font-semibold ' >{name}</h2>
       </div>

       {toggle2?null:
       <div className='flex justify-center items-center w-1/3'>
              <button className={` bg-black text-white rounded-lg w-48 relative `} onClick={tog} >Question {i}  of {s} </button>
        </div>
        }
       <div className=' flex flex-row justify-end items-center w-1/3 '>
     { i>1? <button  className=' bg-blue-700 rounded-full py-3 px-6 text-white font-semibold mx-2  ' onClick={toggle2?tog2:prev} >Back</button>:null}

       <button className=' bg-blue-700 rounded-full py-2 px-6 text-white font-semibold ' onClick={ i<s?next:!toggle2?tog2:handleSubmitSection} >Next</button>
       </div>
     </footer>
    </div>
    </>
  )
}
