import React from "react";
import Navbar from "./Navbar";
import Foot from "./Foot";
import { useEffect, useState } from "react";
import Que from "./Questions";
import axios from "axios";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";
import { useLocation, useNavigate, useParams } from "react-router-dom/dist";
import LoaderPage from "../../components/TestItem/LoaderPage";
import TestInstructionPage from "../../components/TestItem/TesInstructionPage";
import SectionLoader from "../StartTest/SectionLoader";
import SecondaryButton from '../../components/Buttons/SecondaryButton'
import BackIcon from '../../assets/assignedTests/back.svg'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import { TestDetail } from '../../components/TestDetail/TestDetail'
import TestOption from '../../components/TestOption/TestOption'
import { useAddBackupResponseMutation, useAttendTestMutation, useLazyContinueTestQuery, useLazyGetAssignedTestQuery, useLazyGetQuestionQuery, useLazyGetSectionsQuery, useLazyGetSingleAssignedTestQuery, useLazyGetTestResponseQuery, useLazyGetTimeQuery, useStartTestMutation, useSubmitTestMutation, useUpdateTimeMutation } from '../../app/services/test'
import BackBtn from '../../components/Buttons/Back'
import Timer from '../../components/Timer/Timer'
import { useSelector } from 'react-redux'
import { getCheckedString, getDuration, getFormattedDate } from '../../utils/utils'
import Modal from '../../components/Modal/Modal'
import Testinstruction_2 from "../../components/TestItem/testinstruction_2";
export default function TestPage() {
  const [showannotate, setshowannotate] = useState(false);

  const [getQue, GetQueRes] = useLazyGetQuestionQuery();
  const [info, setInfo] = useState([]);
  const [background, setbackground] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [sectionindex, setsectionindex] = useState(0);
  const [showtextbox,setshowtextbox]=useState(false)
  const [index, setIndex] = useState(0);
  const [data, setdata] = useState([]);
  const [toggle2,setToggle2] =useState(false)
  const [seconds, setSeconds] = useState(0);
  const [cutanswer, setcutanswer] = useState([]);
  const [markreview, setmarkreview] = useState([]);
  const [instructionpage, setisntructionpage] = useState(true);
  const [cutcheck,setcutcheck] = useState(false);
  const[loader,setloader] = useState(true)  
  const location = useLocation();
  const [cal,setCal]=useState(false)
  const [allquestion_Data,setAllQuestions_data]=useState()
  
  function MarkAnswer(QuestionNumber, correctAnswer) {
   console.log(QuestionNumber,correctAnswer);
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
    console.log(updateddata);
        }

  function markshadow() {
    setbackground(!background);
  }

  let tog2 =()=>
   {
    setToggle2(!toggle2)
    markshadow();
   }

  let handle = () => {
    setIndex(index + 1);
  };

  let prev = () => {
    setIndex(index - 1);
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
//new code

const tempsubjects = [
   { text: 'Trigonometry', selected: true },
   { text: 'Mathematics', selected: false },
   { text: 'Reading', selected: false },
   { text: 'Science', selected: false },
]

   const navigate = useNavigate()
   const [tempSubjects, setTempSubjects] = useState(tempsubjects)
   const [testStarted, setTestStarted] = useState(false)

   const [initialSeconds, setInitialSeconds] = useState(0)
   const [countDown, setCountDown] = useState(0)
   const { firstName, lastName } = useSelector(state => state.user)
   const { dateFormat } = useSelector(state => state.user)

   const [testHeaderDetails, setTestHeaderDetails] = useState({
      name: `${firstName} ${lastName}`,
      duration: 0,
      dateAssigned: '',
      startedOn: '',
      completedOn: '',
      testName: '',
      dueDate: '',
      instruction: '',
   })
   // console.log(testHeaderDetails);
   const [isUnlimited, setIsUnlimited] = useState(false)
   const [sectionDetails, setSectionDetails] = useState({})
   const [subjects, setSubjects] = useState([])
   const [activeSection, setActiveSection] = useState({})
   const [timer, setTimer] = useState(10)
   const [submitId, setSubmitId] = useState('')
   const [completedSubjects, setCompletedSubjects] = useState([])
   const [startBtnLoading, setStartBtnLoading] = useState(false)
   const [submitBtnLoading, setSubmitBtnLoading] = useState(false)

   const { id, assignedTestId } = useParams()

   const [getSections, getSectionsResp] = useLazyGetSectionsQuery()
   const [getAssignedTest, getAssignedTestResp] = useLazyGetSingleAssignedTestQuery()

   const [addBackupResponse, addBackupResponseResp] = useAddBackupResponseMutation()
   const [startTest, startTestResp] = useStartTestMutation()
   const [submitSection, submitSectionResp] = useSubmitTestMutation()
   const [continueTest, continueTestResp] = useLazyContinueTestQuery()
   const [completedSectionIds, setCompletedSectionIds] = useState([])
   const [popUp, setPopUp] = useState(false)
   const[answer_check,setanswer_check]=useState();
   useEffect(() => {
      let params = {}
      let url = `/api/test/myassigntest/${assignedTestId}`
      setloader(true);
      getAssignedTest({ url, params })
         .then(res => {
            if (res.error) return console.log('testerror', res.error);
            console.log('getassigntest', res.data.data);
            const { testId, createdAt, timeLimit, multiple, dueDate, instruction } = res.data.data.test
            if (multiple === 0) {
               setIsUnlimited(true)
            } else {
               setIsUnlimited(false)
            }
            if (res.data.data.test.testId) {
               console.log(res.data.data.test.testId);
               setTestHeaderDetails(prev => ({
                  ...prev,
                  testName: testId.testName,
                  instruction: instruction,
                  dateAssigned: getFormattedDate(createdAt, dateFormat),
                  dueDate: getFormattedDate(dueDate, dateFormat),
               }))
            }
            setTestHeaderDetails(prev => ({
               ...prev,
               duration: multiple ? getDuration(multiple) : 'Unlimited',
            }))

         })
   }, [])

   const handleStartTest = () => {
      if (!activeSection) return
      setStartBtnLoading(true)
      console.log(sectionDetails[answer_check?.completed.length]?.name)
      startTest({ id: assignedTestId, reqbody: { sectionName: activeSection.name!=null?activeSection.name:sectionDetails[answer_check?.completed.length]?.name } })
         .then(res => {
            setStartBtnLoading(false)
            if (res.error) {
               console.log(res.error)
               return
            }
            console.log('start test', res.data.data)
            setdata(res.data.data.answer)
            setInfo(res.data.data.answer)
            const { startTime, endTime, sectionName, answer, submitId } = res.data.data
            setPopUp(false)

            if (endTime === null) {
               let date = new Date()

               var nextDay = new Date(date);
               nextDay.setDate(date.getDate() + 1);
               // console.log(nextDay); //

               let timer = (new Date(nextDay) - new Date()) / 1000
               setTimer(Math.trunc(timer))
               setInitialSeconds(Math.trunc(timer))
            } else {
               let timer = (new Date(endTime) - new Date()) / 1000
               setTimer(Math.trunc(timer))
               setInitialSeconds(Math.trunc(timer))
            }

            // setInitialSeconds(Math.trunc(timer))
            setTestStarted(true)
            setSubmitId(submitId)

            setSubjects(prev => {
               return prev.map(item => {
                  if (item.name === sectionName) {
                     return { ...item, selected: true }
                  } else {
                     return { ...item, selected: false }
                  }
               })
            })
            setAnswers(answer.map(item => ({ ...item, isMarked: false, ResponseAnswer: '', responseTime: 0 })))
         })
   }

   const fetchSections = () => {
      getSections({ id: id })
         .then(res => {
            if (res.error) {
               return console.log(res.error);
            }
            console.log('sectionshvhjvjhhjbb  hhb hbkkjjkbj  kjbj  response', res.data.data);
            let duration = 0


            res.data.data.subjects.subjects.map(item => {
               duration += item.timer
            })
            
            setTestHeaderDetails(prev => ({
               ...prev,
               // duration,
               startedOn: getFormattedDate(new Date(res.data.data.subjects.createdAt), dateFormat)
            }))
            setSectionDetails(res.data.data.subjects.subjects)
            let tempsubs = res.data.data.subjects.subjects.map(item => {
               return {
                  ...item,
                  selected: false
               }
            })
            const promiseState = async state => new Promise(resolve => {
               resolve(setSubjects(tempsubs))
            })
            promiseState()
               .then(() => {
                  fetchContinueTest(true, tempsubs)
               })
         })
   }
   useEffect(() => {
      if (!id) return
      fetchSections()
   }, [id])


   const fetchContinueTest = (setResponsesFromStorage, subjectsRec) => {
      continueTest({ id: assignedTestId })
         .then(res => {
            if (res.error) {
               console.log(res.error)
               return
            }
            console.log('CONTINUE ', res.data.data)
           setanswer_check(res.data.data);
           setInfo(res.data.data.answer)
           if(res.data.data.backupResponse.length>0){
            setisntructionpage(false)
           }
            const { startTime, endTime, sectionName, completed, answer, submitId, backupResponse } = res.data.data
            if (completed !== undefined) {
               setCompletedSubjects(completed)
            }
            if (endTime !== null && endTime || sectionName?.length > 1) {
               let timer = (new Date(endTime) - new Date()) / 1000
               setTimer(Math.trunc(timer))
               setInitialSeconds(Math.trunc(timer))

               // setTestStarted(true)
               setTestStarted(true)
               setSubmitId(submitId)

               if (setResponsesFromStorage === true) {
               }
            } else {
               setTestStarted(false)
            }
            if (completed) {
               const compIds = completed.map(test => test._id)
               setCompletedSectionIds(compIds)
            }

            setSubjects(prev => {
               return prev.map(item => {
                  if (item.name === sectionName) {
                     return { ...item, selected: true }
                  } else {
                     return { ...item, selected: false }
                  }
               })
            })
         })
   }

   useEffect(()=>{
    console.log('info',info);
   if(info!=null&&info.length>0){
    let dataofque, newData,cutdata,question_d;
    dataofque = info
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
    question_d=dataofque.map((item) => ({
      text:item.Passage,
    }));
    console.log(question_d,markr,cutdata);
    setAllQuestions_data(question_d)
    setmarkreview(markr)
    setAnswers(newData);
    setcutanswer(cutdata)
    setloader(false);
   }
   else {
setActiveSection(sectionDetails[answer_check?.completed.length==0?0:answer_check?.completed.length]) 

}
   },[info])
  
useEffect(()=>{
  console.log('active section',activeSection);
  handleStartTest()
},[activeSection])
   const handleSubjectChange = (item) => {
      // console.log(item);
      let tempdata = subjects.map(sub => {
         if (sub._id === item._id) {
            return { ...sub, selected: true }
         } else {
            return { ...sub, selected: false }
         }
      })
      setSubjects(tempdata)
   }
   useEffect(() => {
      if (subjects.length === 0) return
      const active = subjects.filter(item => item.selected === true)
      let completedSubIds = completedSubjects.map(item => item._id)
      // console.log('completedSubIds', completedSubIds);
      // console.log('subjects', subjects);
      if (active.length === 0) {
         let issetActive = false
         let temp = subjects.map(sub => {
            if (issetActive === false) {
               if (completedSubIds.includes(sub._id)) {
                  return { ...sub, selected: false }
               } else {
                  issetActive = true
                  return { ...sub, selected: true }
               }
            } else {
               return { ...sub, selected: false }
            }
         })
         setSubjects(temp)
         // console.log('tempsubjects', temp);
      }
      // console.log('active subject', active);
      // console.log('all subjects', subjects);
   }, [subjects, completedSubjects])

   useEffect(() => {
      if (completedSectionIds.length === subjects.length) {
         if (completedSectionIds.length === 0) return
         if (subjects.length === 0) return
         alert('All section test completed')
         navigate('/all-tests')
      }
   }, [completedSectionIds, subjects])

   const handleResponseChange = (id, option) => {
      // console.log('initialSeconds', initialSeconds);
      // console.log('countDown', countDown);

      const timeTaken = initialSeconds - countDown
      setInitialSeconds(countDown)
      setAnswers(prev => {
         return prev.map(item => {
            let time = 0
            if (item._id === id) {
               if (item.responseTime) {
                  time = item.responseTime + timeTaken
               } else {
                  time = timeTaken
               }
            }
            if (item._id === id) return { ...item, ResponseAnswer: option, responseTime: time }
            else return { ...item }
         })
      })
   }

   const handleSubmitSection = () => {
      // console.log(activeSection);
      // console.log(answers);
      setisntructionpage(true)
      setToggle2(false)
      setbackground(false)
      setIndex(0)
      setshowtextbox(true)
      setshowannotate(false)
      setCal(false)
      setshowannotate(false)
      setloader(true)
      setsectionindex(answer_check?.completed.length==0?1:answer_check?.completed.length)
      const response = answers.map(item => {
         const { QuestionType, QuestionNumber, ResponseAnswer, responseTime } = item
         return {
            QuestionType,
            QuestionNumber,
            ResponseAnswer: ResponseAnswer ? ResponseAnswer : '',
            responseTime: responseTime ? responseTime : 0,
         }
      })
      let body = {
         submitId,
         reqbody: {
            sectionName: sectionDetails[answer_check?.completed.length]?.name,
            response: response
         }
      }
      console.log('submit test',body);
      // return
      setSubmitBtnLoading(true)
      submitSection(body)
         .then(res => {
            setSubmitBtnLoading(false)
            if (res.error) {
               return console.log(res.error)
            }
            console.log(res.data)
            setTestStarted(false)
            // localStorage.setItem('answers', null)
            fetchContinueTest()
         })
   }


   useEffect(() => {
      if (!answers) return
      if (answers === null || answers === undefined) return
      if (answers.length === 0) return
      // console.log('setans', answers);
      addBackupResponse({ id: assignedTestId, reqbody: { backupResponse: answers } })
         .then(res => {
            if (res.error) {
               console.log(res.error);
            } else {
               // console.log(res.data);
            }
         })
      // localStorage.setItem('assignedTestId', assignedTestId)
      // localStorage.setItem('answers', JSON.stringify(answers))
   }, [answers])


   
   
//end code
const size = Object.keys(answers).length;
const arr = new Array(size)
arr.fill(false)
const [pages,setPage]=useState(arr)

  return (
    <div className=" relative ">
      
     {loader&&sectionindex==0? <LoaderPage/>
     :loader&&sectionindex>0?
<SectionLoader/>
     :
     instructionpage?
     <Testinstruction_2 desc={sectionDetails[answer_check?.completed.length]?.description} timer={sectionDetails[answer_check?.completed.length]?.timer} setisntructionpage={setisntructionpage} loader={loader} testHeaderDetails={testHeaderDetails} activeSection={activeSection} TestDetail={TestDetail} completedSectionIds={completedSectionIds} testStarted={testStarted} subjects={subjects}
   /> 
     :
     <>
      <Navbar  cal={cal}
      showannotate={showannotate}
      setshowannotate={setshowannotate}
      details={sectionDetails[answer_check?.completed.length]?.description}
      annotation_check={sectionDetails[answer_check?.completed.length]?.annotation=='yes'?true:false}
      calculator_check={sectionDetails[answer_check?.completed.length]?.calculator=='yes'?true:false}
      setCal={setCal} secnd={timer} handleSubmitSection={handleSubmitSection} sectionDetails={sectionDetails[answer_check?.completed.length]}  />
      <Que
      setshowtextbox={setshowtextbox}
      showtextbox={showtextbox}
      showannotate={showannotate}
      setshowannotate={setshowannotate}
      quesT={allquestion_Data}
      annotation_check={sectionDetails[answer_check?.completed.length]?.annotation=='yes'?true:false}
      calculator_check={sectionDetails[answer_check?.completed.length]?.calculator=='yes'?true:false}
      cross_O_check={sectionDetails[answer_check?.completed.length]?.crossOption=='yes'?true:false}
      cal={cal}
      setAnswers={setAnswers}
      setCal={setCal}
      answers={answers}
        markreview={markreview}
        markre={markre}
        cutcheck={cutcheck}
        showcutcheck={showcutcheck}
        cutanswer={cutanswer}
        cutanswers={cutanswers}
        check={background}
        MarkAnswer={MarkAnswer}
        quesImg={info[index] ? info[index].QuestionImage : ""}
        ques={info[index] ? info[index].QuestionText : ""}
        index={index + 1}
        op={info[index] ? info[index].Answers : null}
        para={info[index] ? info[index].Passage : ""}
        Setmark={setPage} 
        mark={pages}
        siz={size}
      />
      {showtextbox?null:
      <Foot
      sectionindex={answer_check?.completed.length+1}
      sectionDetails={sectionDetails[answer_check?.completed.length]}
      answers={answers}
      cal={cal}
      setCal={setCal}
      name={testHeaderDetails?.name}
      markreview={markreview}
      index={index}
      cutcheck={cutcheck}
      tog2={tog2}
      toggle2={toggle2}
        markshadow={markshadow}
        handleSubmitSection={handleSubmitSection}
        next={handle}
        prev={prev}
        set={setIndex ? setIndex : ""}
        data={answers ? answers : null}
        s={size}
        i={index + 1}
        mark={pages}
      />
}
      </>
  }
    </div>
  );
}
