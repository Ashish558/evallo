import React from 'react'
import {faBookmark} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Calculator from './Calculator';

 
export default function Que(props) {

   const {ques,op,para,answers,index,Setmark,mark,cal,setCal,seq,cutanswers,cutanswer,showcutcheck,cutcheck,markreview,markre} = props;
   const s ={
    height : "58.2vh"
  }
  // console.log(op)
  let markit=()=>
  {
    const arr = [...mark]
    arr[index] = !arr[index]
    Setmark(arr)
  }
  return (
    <div className={` px-20 overflow-y-scroll flex flex-row ${props.check && 'bg-gray-200'} ${!para? 'justify-center' : 'justify-between'} `} style={s}>
        {
          para?<div className='w-1/2 pt-5'>
           <div dangerouslySetInnerHTML={{__html:para}}/>
           {/* <img src={image} alt="" /> */}
        </div>:null
        }
        <div className={`mt-5 ${props.check && 'hidden'} ${!para? 'flex w-1/2 flex-col':'w-1/2'}` }>
          <div className=' flex bg-slate-200  text-center relative'>
            <span className=' bg-black text-white py-1 px-2'>{index}</span>
            <FontAwesomeIcon onClick={()=>{markre(index)}} icon={faBookmark} className={`cursor-pointer text-transparent border border-black relative top-2 mx-2 ${ markreview.length>0?markreview[index-1].review && 'bg-yellow-400':null}`} />  
            <h3 className=' relative top-1 text-gray-600'>Mark for review</h3>
            
            <div className={`absolute line-through right-2 bottom-[2px] cursor-pointer border border-black px-1 rounded ${cutcheck && 'bg-blue-400'}`} onClick={()=>{showcutcheck()}}>
                    <p>ABC</p>      
            </div>
          
          </div>
         <hr className=' border border-black' />
        { ques?<h1 className='py-3'>{ques}</h1>:null}
          {
           op?.map((e,i)=>
               {
                return  <div className={`flex flex-row w-full cursor-pointer border-[3px] rounded-xl my-2 px-2 py-2  items-center ${answers[index-1].ResponseAnswer==e.label? 'border-blue-400' :null} `}> <span className={` font-semibold text-sm mr-4 border-[3px] rounded-full px-2 py-1 ml-2  ${answers[index-1].ResponseAnswer==e.label? 'bg-blue-400 text-white' :null}`}>{e.label}</span> <li className='relative flex items-center text-gray-600 border border-black list-none rounded-lg' onClick={()=>{props.MarkAnswer(index,i)}}>
                  { cutanswer[index-1].markcut[i]==1 && cutcheck?
                  <div className='flex w-full h-full bg-gray-300 absolute top-[0] left-[0] opacity-40 justify-center items-center'>
                    <div className='h-[3px] bg-gray-900 absolute w-full'></div>
                    </div>
                  :null

               }<div className='flex justify-center w-full items-center border border-gray-400'>
                  <img src={e.content} className='max-w-[14rem] border-none max-h-[10rem] p-1 ' alt="" />
                  </div></li>
                  {cutcheck?
                  <p className={`text-gray-600 font-semibold text-sm border border-gray-800 px-2 py-1 ml-2 rounded-full cursor-pointer line-through ${cutanswer[index-1].markcut==i && 'bg-gray-300'}`} onClick={()=>{cutanswers(index,i)}}>{e.label}</p>
                :null}
                </div> 

              })
           }
        </div>
        {
        cal&&<Calculator/>
        }
     
    </div>
  )
}
