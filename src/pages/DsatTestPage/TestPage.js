import React from "react";
import Navbar from "./Navbar";
import Foot from "./Foot";
import { useEffect, useState } from "react";
import Que from "./Questions";
import axios from "axios";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import { useLocation, useNavigate, useParams } from "react-router-dom/dist";
import {
  useLazyGetQuestionQuery,
  useSubmitTestMutation,
} from "../../app/services/test";
import LoaderPage from "../../components/TestItem/LoaderPage";
import TestInstructionPage from "../../components/TestItem/TesInstructionPage";
import SectionLoader from "../StartTest/SectionLoader";

export default function TestPage() {
  const [getQue, GetQueRes] = useLazyGetQuestionQuery();
  const [info, setInfo] = useState([]);
  const [opt, setOpt] = useState([]);
  const [background, setbackground] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [sectionindex, setsectionindex] = useState(0);
  const [index, setIndex] = useState(0);
  const [data, setdata] = useState([]);
  const [submitSection, submitSectionResp] = useSubmitTestMutation();
  const [toggle2,setToggle2] =useState(false)
  const [seconds, setSeconds] = useState(0);
  const [cutanswer, setcutanswer] = useState([]);
  const [markreview, setmarkreview] = useState([]);
  const [sectionDetails, setSectionDetails] = useState();
  const [instructionpage, setisntructionpage] = useState(true);
  const [cutcheck,setcutcheck] = useState(false);
  const[loader,setloader] = useState(false)  
  const { testid,userid } = useParams();
  const location = useLocation();
    const navigate = useNavigate();

  const name = new URLSearchParams(location.search).get("name");
  function MarkAnswer(QuestionNumber, correctAnswer) {
    const updatedanswer = answers.map((q) =>
      q.QuestionNumber === QuestionNumber
        ? {
            ...q,
            ResponseAnswer:
              correctAnswer === 0
                ? "A"
                : correctAnswer === 1
                ? "B"
                : correctAnswer === 2
                ? "C"
                : correctAnswer === 3
                ? "D"
                : null,
          }
        : q
    );
    setAnswers(updatedanswer);
  }

    function showcutcheck(){
      setcutcheck(!cutcheck)
      console.log(cutcheck);
    }

    function cutanswers(QuestionNumber, correctAnswer,optionno) {
         const updateddata = cutanswer.map((q) =>
      q.QuestionNumber === QuestionNumber
        ? {
            ...q,
           markcut: q.markcut.map((val, index) => 
           index === correctAnswer ? (val === 1 ? 0 : 1) : val
         )
       }
        : q
    );
    setcutanswer(updateddata);
        }

  function markshadow() {
    setbackground(!background);
  }

  let tog2 =()=>
   {
    setToggle2(!toggle2)
    markshadow();
   }

  const fetchApi = () => {
    setloader(true)
    getQue({ testid,userid }).then((res) => {
      if (res.error) return console.log("testerror", res.error);
      console.log(res);
      setdata(res.data.data.answer.subjects)
      setSeconds(res.data.data.answer.subjects[sectionindex].timer*60)
      setSectionDetails(res.data.data.answer.subjects[sectionindex])
      setInfo(res.data.data.answer.answer[sectionindex]);
      let dataofque, newData,cutdata;
      dataofque = res.data.data.answer.answer[sectionindex];
      newData = dataofque.map((item) => ({
        QuestionType: item.QuestionType,
        QuestionNumber: item.QuestionNumber,
        ResponseAnswer: "",
        responseTime: "10",
      }));
      cutdata = dataofque.map((item) => ({
        QuestionNumber:item.QuestionNumber,
        markcut:new Array(4).fill(0)
      }));
      let markr=dataofque.map((item) => ({
        QuestionNumber:item.QuestionNumber,
        review:false
      }));
      setmarkreview(markr)
      setAnswers(newData);
      setcutanswer(cutdata)
      setloader(false)
    });
  };


  const size = Object.keys(info).length;

  let handle = () => {
    setIndex(index + 1);
  };


  let prev = () => {
    setIndex(index - 1);
  };

  useEffect(()=>{
    
    setSeconds(data.length>0?data[sectionindex].timer*60:100)
    
  },[instructionpage])

  function next_section() {
    setsectionindex(sectionindex + 1);
  }

  
  useEffect(() => {
    if (seconds <= 0) {
      return handleSubmitSection();
    }

    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const handleSubmitSection = () => {
    if(sectionindex<data.length){
    //id of test
    var submitId = "64fb1f5c68528c79b20b45dd";
    const response = answers;
    let body = {
      submitId,
      reqbody: {
        sectionName: data[sectionindex]?.name,
        response: response,
      },
    };
    submitSection(body).then((res) => {
      if (res.error) {
        return console.log(res.error);
      }
      console.log(res.data);
    });
    console.log(data.length);
    setsectionindex(sectionindex + 1);
    setIndex(0)
    if(toggle2)
    tog2()
    }
  };


  function  markre(QuestionNumber) {
    const updatedanswer = markreview.map((q) =>
      q.QuestionNumber === QuestionNumber
        ? {
           ...q,
           review:!q.review
          }
        : q
    );
    setmarkreview(updatedanswer);
  }


  useEffect(() => {
    fetchApi();
    console.log(sectionindex);
  }, [sectionindex]);

  useEffect(() => {
console.log(sectionDetails,'asdasdasd');  }, [sectionDetails]);
const arr = new Array(size)
arr.fill(false)
const [pages,setPage]=useState(arr)
  return (
    <div className=" relative ">
      
     {loader&&sectionindex==0? <LoaderPage/>
     :
     instructionpage?
     <TestInstructionPage setisntructionpage={setisntructionpage}/> 
     :loader&&sectionindex>0?
     <SectionLoader 
     size={data.length}
      sectionindex={sectionindex}

     />:
     <>
      <Navbar seconds={seconds} sectionDetails={data[sectionindex]}  />
      <Que
      answers={answers}
        markreview={markreview}
        markre={markre}
        cutcheck={cutcheck}
        showcutcheck={showcutcheck}
        cutanswer={cutanswer}
        cutanswers={cutanswers}
        check={background}
        MarkAnswer={MarkAnswer}
        ques={info[index] ? info[index].QuestionText : ""}
        index={index + 1}
        op={info[index] ? info[index].Answers : null}
        para={info[index] ? info[index].Passage : ""}
        Setmark={setPage} 
        cal={cal}
        mark={pages}
      />
      <Foot
      name={name}
      markreview={markreview}
      index={index}
      cutcheck={cutcheck}
      tog2={tog2}
      toggle2={toggle2}
        next_section={next_section}
        markshadow={markshadow}
        handleSubmitSection={handleSubmitSection}
        next={handle}
        prev={prev}
        set={setIndex ? setIndex : ""}
        data={info ? info : null}
        s={size}
        i={index + 1}
        mark={pages}
      />
      </>
  }
    </div>
  );
}
