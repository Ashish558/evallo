import React, { useEffect, useState } from 'react'
import {faBookmark} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Calculator from './Calculator';
import { TextAnnotator } from 'react-text-annotate';
import Tippy from '@tippyjs/react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // Import the CSS
import AnnotationPopup from './Annotationpopup';
 
export default function Que(props) {

   const {ques,op,para,initialSeconds,setInitialSeconds,countDown,showtextbox,answerimagecheck,setshowtextbox,showannotate,setshowannotate,setAnswers,quesImg,quesT,answers,siz,index,Setmark,mark,cal,setCal,seq,cutanswers,cutanswer,showcutcheck,cutcheck,markreview,markre,annotation_check,calculator_check,cross_O_check} = props;
   const s ={
    height : "58.2vh"
  }
  let markit=()=>
  {
    const arr = [...mark]
    arr[index] = !arr[index]
    Setmark(arr)
  }
  const [underline, setunderline] = useState('underline');
  const [show_ann, setshow_ann] = useState(false);
  const [check, setcheck] = useState(false);
  const [color, setcolor] = useState('yellow');
    const [annotations, setAnnotations] =  useState(Array(siz).fill(null).map(() => []));
    const [hovert, sethovert] = useState(Array(siz).fill());
    const handleAnnotationChange = (newAnnotationsForIndex) => {
      if(showannotate){
    setAnnotations(prevAnnotations => {
      const updatedAnnotations = [...prevAnnotations];
      updatedAnnotations[index-1] = newAnnotationsForIndex;
      return updatedAnnotations;
    });
  }
  };

  useEffect(()=>{
    console.log(hovert);
    console.log(annotations);
    tippy('mark', {
      content: hovert[index-1],
    });
    setshowtextbox(false)
    setshowannotate(false)
  },[hovert])

  useEffect(() => {
    if(check){
    setshow_ann(true)
    tippy('mark', {
      content: hovert[index-1],
    });
  }
  else {
    setcheck(true)
  }
  }, [annotations]);

  useEffect(() => {
    tippy('mark', {
      content: hovert[index-1],
    });
  }, [index]);

  useEffect(() => {
    tippy('mark', {
      content: hovert[index-1],
    });
    }, [color]);

  return (
    <div className={` px-20 h-[25rem] relative flex flex-row ${props.check && 'bg-gray-200'} ${!para? 'justify-center' : 'justify-between'} `} style={s}>
       {showannotate?
        <AnnotationPopup show_ann={show_ann} index={index} annotations={annotations} setAnnotations={setAnnotations} setshow_ann={setshow_ann} setIsEditing={setshowannotate} isEditing={showannotate} color={color} i={index} underline={underline} sethovert={sethovert} setunderline={setunderline} setcolor={setcolor} />
       :null}
        {
          para?<div className='overflow-y-auto w-1/2 mr-4 pt-5'>
           {/* <TextAnnotator
            key={color}
        content={quesT[index-1].text}
        value={annotations[index-1]}
        onChange={handleAnnotationChange}
        getSpan={(span) => ({
          ...span,
          color,
          underline
        })}
        span={({ children, ...spanProps }) => {
          console.log(spanProps) 
          return(
          <Tippy content={hovert[index-1]}>
            <mark
            style={{ textDecoration:spanProps.underline,backgroundColor: spanProps.color }}
              {...spanProps}
>              {children}
            </mark> 
          </Tippy>
          )
        }}
      />  */}
      <div className='dangerouslySetClass' dangerouslySetInnerHTML={{__html:quesT[index-1].text}} />
         {/* <img src={image} alt="" /> */}
        </div>:null
        }
        <div className={`mt-5 overflow-y-auto ${props.check && 'hidden'} ${!para? 'flex w-1/2 flex-col':'w-1/2'}` }>
          <div className=' flex bg-slate-200  text-center relative'>
            <span className=' bg-black text-white py-1 px-2'>{index}</span>
            <FontAwesomeIcon onClick={()=>{markre(index)}} icon={faBookmark} color={ markreview.length>0?markreview[index-1]?.review && 'yellow':'white'} className={`cursor-pointer relative top-2 mx-2 `} />  
            <h3 className=' relative top-1 text-gray-600'>Mark for review</h3>
            {cross_O_check?
            <div className={`absolute line-through right-2 bottom-[2px] cursor-pointer border border-black px-1 rounded ${cutcheck && 'bg-blue-400'}`} onClick={()=>{showcutcheck()}}>
                    <p>ABC</p>      
            </div>
          :null}
          </div>
         <hr className=' border border-black' />
         <div className='flex flex-col items-start justify-center'>
        { ques?<h1 className='py-3'>{ques}</h1>:null}
        {quesImg!='' && quesImg!=='no'?<img  className='max-w-8 max-h-8' src={quesImg}/>:null}
        </div>
          {answers[index-1].QuestionType=="Grid-in"?
<div>
  <input placeholder='Enter The Answer' type='text' className='bg-transparent mt-4 border-gray-600 border rounded px-2 py-4' value={answers[index-1].ResponseAnswer} onChange={(e)=>{
    let ans= e.target.value;
    const timeTaken = initialSeconds - countDown
   setInitialSeconds(countDown)
   console.log(timeTaken);
    const updatedanswer = answers.map((q) =>
      q.QuestionNumber === index
        ? {
            ...q,
            ResponseAnswer:ans,
            responseTime:q.responseTime>0?q.responseTime+timeTaken:timeTaken,
          }
        : q
    );
    setAnswers(updatedanswer);
  }}/>
  <p className='text-xl font-medium mt-4'>Answer Preview :{answers[index-1].ResponseAnswer}</p>
  </div>

          :

           op?.map((e,i)=>
               {
                return  <div className={`flex flex-row w-full cursor-pointer border-[3px] rounded-xl my-2 px-2 items-center ${answers[index-1].ResponseAnswer==e.label? 'border-blue-400' :null} `}> <span className={` font-semibold text-sm mr-4 border-[3px] rounded-full px-2 py-1 ml-2  ${answers[index-1].ResponseAnswer==e.label? 'bg-blue-400 text-white' :null}`}>{e.label}</span> <li className='relative flex w-full items-center text-gray-600 list-none rounded-lg'>
                  <div className='flex justify-between w-full items-center'>
                <div className='flex flex-wrap justify-start w-[90%] py-2 relative items-center'  onClick={()=>{props.MarkAnswer(index,i)}}>
                  <p>{e?.text}</p>
                  {answerimagecheck? <img className='ml-6 max-w-[100px] max-h-[100px]' src={e.image}/>:null}
                  { cutanswer[index-1].markcut[i]==1 && cutcheck?
                  <div className='flex w-full h-full bg-gray-300 absolute top-[0] left-[0] opacity-40 justify-center items-center'>
                    <div className='h-[3px] bg-gray-900 absolute w-full'></div>
                    </div>
                  :null

               }
                  </div>
                  {cutcheck?
                  <p className={`text-gray-600 font-semibold text-sm border border-gray-800 px-2 py-1 ml-2 rounded-full cursor-pointer line-through ${cutanswer[index-1].markcut==i && 'bg-gray-300'}`} onClick={()=>{cutanswers(index,i)}}>{e.label}</p>
                :null}
                </div>
                  </li>
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
