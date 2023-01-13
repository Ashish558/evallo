import React, { useEffect, useState } from 'react'
import SecondaryButton from '../../components/Buttons/SecondaryButton'
import BackIcon from '../../assets/assignedTests/back.svg'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import styles from './style.module.css'
import { tableData, answerTableData, timeTakenSeries, ttOptions, accuracySeries, accuracyOptions } from './tempData'
import Table from '../../components/Table/Table'
import { useNavigate, useParams } from 'react-router-dom'
import BarGraph from '../../components/BarGraph/BarGraph'
import { useLazyGetAnswersQuery, useLazyGetSingleAssignedTestQuery, useLazyGetTestDetailsQuery, useLazyGetTestResponseQuery } from '../../app/services/test'
import { getDate, getDuration, getFormattedDate, millisToMinutesAndSeconds } from '../../utils/utils'
import { useLazyGetTutorDetailsQuery } from '../../app/services/users'
import { useSelector } from 'react-redux'

import RedIcon from "../../assets/assignedTests/red.svg";
import GreenIcon from "../../assets/assignedTests/green.svg";
import moment from 'moment'

const tempsubjects = [
   { text: 'Trigonometry', selected: true },
   { text: 'Mathematics', selected: false },
   { text: 'Reading', selected: false },
   { text: 'Science', selected: false },
]

const tableHeadersParent = [
   'Q No.', 'Accuracy', 'Concept', 'Strategy', 'Time Taken',
]
const adminTableHeaders = [
   'Q No.', 'Correct Answer', 'Student Response', 'Accuracy', 'Concept', 'Strategy', 'Time Taken',
]


export default function StudentReport() {

   const [tableHeaders, setTableHeaders] = useState([])
   const [tableData, setTableData] = useState([])
   const [testData, setTestData] = useState(tableData)
   const [answersData, setAnswersData] = useState(answerTableData)
   const [responseData, setResponseData] = useState({})
   const [displayScore, setDisplayScore] = useState({
      cumulative: '',
      right: '',
      isSat: false,
   })
   const { role: persona, id: currentUserId } = useSelector(state => state.user)
   const [sectionScore, setSectionScore] = useState({
      correct: 0,
      outOf: 0
   })
   const [timeSeries, setTimeSeries] = useState({
      name: 'Time Taken',
      data: []
   })

   const [accuracySeries, setAccuracySeries] = useState({
      name: 'Incorrect Answers',
      data: []
   })
   const [accuracyGraphOptions, setAccuracyGraphOptions] = useState(accuracyOptions)
   const [answerKey, setAnswerKey] = useState([])

   const navigate = useNavigate()

   useEffect(() => {
      if (persona === 'parent' || persona === 'student') {
         setTableHeaders(tableHeadersParent)
      } else {
         setTableHeaders(adminTableHeaders)
      }
   }, [persona])

   const { id, studentId } = useParams()

   const [testDetails, setTestDetails] = useState({
      testName: '-',
      assignedOn: '-',
      name: '-',
      startedOn: '-',
      completedOn: '-',
      duration: '-',
   })

   const [subjects, setSubjects] = useState([])
   const [selectedSubject, setSelectedSubject] = useState({})
   const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery()
   const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery()
   const [getTestDetails, getTestDetailsResp] = useLazyGetTestDetailsQuery()
   const [getAssignedTest, getAssignedTestResp] = useLazyGetSingleAssignedTestQuery()

   const [getAnswers, getAnswersResp] = useLazyGetAnswersQuery()
   const [answerKeySubjects, setAnswerKeySubjects] = useState([])


   // console.log('params studnt', studentId);
   //get answer key
   useEffect(() => {
      if (Object.keys(responseData).length === 0) return
      // console.log('response data', responseData);
      // let sortedSubjects = responseData.subjects.map(sub => sub.name)

      getAnswers(id)
         .then(res => {
            if (res.error) return console.log(res.error);
            // console.log('answer key', res.data.data);
            let answerKeyData = { ...res.data.data }
            // let subjects = answerKeyData.answer.subjects
            setAnswerKey(res.data.data.answer.answer)
            setAnswerKeySubjects(answerKeyData.answer.subjects)
         })
   }, [responseData])

   const getSelectedString = (arr) => {
      let strArr = []
      arr.map(item => {
         if (item.selected) strArr.push(item.text)
      })
      return strArr
   }

   useEffect(() => {
      let params = {}
      let url = `/api/test/myassigntest/${id}`
      if (studentId) {
         params = {
            userId: studentId
         }
         url = `/api/test/myassigntest/${id}`
      }
      getAssignedTest({ url, params: params })
         .then(res => {
            if (res.error) return console.log('testerror', res.error);
            // console.log('test', res.data.data.test);
            const { testId, createdAt, timeLimit, multiple } = res.data.data.test
            setTestDetails(prev => {
               return {
                  ...prev,
                  assignedOn: getFormattedDate(createdAt),
                  testName: testId.testName,
                  duration: multiple ? getDuration(multiple) : '-',
               }
            })
         })

   }, [])

   useEffect(() => {
      let params = {}
      let url = `/api/test/getresponse/${id}`
      if (studentId) {
         params = {
            userId: studentId
         }
         url = `/api/test/admin/getresponse/${id}`
      }

      getTestResponse({ url, params: params })
         .then(res => {
            if (res.error) {
               console.log('test resp err', res.error)
               return
            }
            // console.log('RESPONSE', res.data.data.response);
            const { subjects, studentId, response, createdAt, updatedAt } = res.data.data.response
            if (res.data.data.response.testType === 'SAT') {
               let set1Score = 0
               let set2Score = 0
               subjects.map((sub, idx) => {
                  if (idx === 0 || idx === 1) {
                     set1Score += sub.no_of_correct
                  } else {
                     set2Score += sub.no_of_correct
                  }
               })

               setDisplayScore({
                  cumulative: `C${set1Score + set2Score}`,
                  right: `V${set1Score}|M${set2Score}`,
                  isSat: true
               })
            } else if (res.data.data.response.testType === 'SAT') {
               let scoreArr = []
               let total = 0
               subjects.map((sub, idx) => {
                  total += sub.no_of_correct
                  scoreArr.push(sub.no_of_correct)
               })
               setDisplayScore({
                  cumulative: `C${total / subjects.length}`,
                  right: `E${scoreArr[0]} M${scoreArr[1]} R${scoreArr[2]} C${scoreArr[3]}`,
                  isSat: false
               })
            }
            setTestDetails(prev => {
               return {
                  ...prev,
                  startedOn: getFormattedDate(createdAt),
                  completedOn: getFormattedDate(updatedAt),
               }
            })
            setSubjects(subjects.map((sub, idx) => ({ ...sub, idx, selected: idx === 0 ? true : false })))

            setResponseData(res.data.data.response)
            getUserDetail({ id: studentId })
               .then(res => {
                  if (res.error) return console.log(res.error)
                  const { firstName, lastName } = res.data.data.user
                  setTestDetails(prev => {
                     return {
                        ...prev,
                        // assignedOn: getFormattedDate(createdAt),
                        name: `${firstName} ${lastName}`,
                     }
                  })
               })
         })

   }, [])

   const handleChange = (item) => {
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
      if (!subjects) return
      if (subjects.length === 0) return
      setSelectedSubject(subjects.filter(sub => sub.selected === true)[0])
   }, [subjects])

   useEffect(() => {
      let strArr = getSelectedString(subjects)
      let tempData = tableData.filter(item => strArr.includes(item.concept))
      setTestData(tempData)
   }, [subjects])

   //change table data
   useEffect(() => {
      if (Object.keys(selectedSubject).length === 0) return
      if (answerKey.length === 0) return

      let currentAnswerKeyIndex = 0

      answerKeySubjects.map((subj, idx) => {
         if (subj.name === selectedSubject.name) {
            currentAnswerKeyIndex = idx
         }
      })

      if (persona === 'student' || persona === 'parent') {
         let temp = responseData.response[selectedSubject.idx].map((item, index) => {
            // console.log(item);
            const { QuestionNumber, QuestionType, ResponseAnswer, isCorrect, responseTime, _id } = item
            let concept = '-'
            let strategy = '-'
            if (answerKey[currentAnswerKeyIndex][index]) {
               concept = answerKey[currentAnswerKeyIndex][index].Concepts ? answerKey[currentAnswerKeyIndex][index].Concepts : '-'
            }
            if (answerKey[currentAnswerKeyIndex][index]) {
               strategy = answerKey[currentAnswerKeyIndex][index].Strategy ? answerKey[currentAnswerKeyIndex][index].Strategy : '-'
            }
            if (answerKey[currentAnswerKeyIndex][index])
               return {
                  QuestionNumber,
                  isCorrect,
                  Concept: concept,
                  Strategy: strategy,
                  responseTime: responseTime >= 0 ? `${responseTime} sec` : '-'
               }
         })
         setTableData(temp)
      } else {
         // console.log('answerKey', answerKey[selectedSubject.idx]);
         let temp = responseData.response[selectedSubject.idx].map((item, index) => {
            const { QuestionNumber, QuestionType, ResponseAnswer, isCorrect, responseTime, _id } = item
            return {
               QuestionNumber,
               CorrectAnswer: answerKey[currentAnswerKeyIndex][index].CorrectAnswer,
               ResponseAnswer,
               isCorrect,
               Concept: answerKey[currentAnswerKeyIndex][index].Concepts ? answerKey[currentAnswerKeyIndex][index].Concepts : '-',
               Strategy: answerKey[currentAnswerKeyIndex][index].Strategy ? answerKey[currentAnswerKeyIndex][index].Strategy : '-',
               responseTime: responseTime >= 0 ? `${responseTime} sec` : '-'
            }
         })
         setTableData(temp)
      }


   }, [selectedSubject, answerKey])

   //change time taken series data
   useEffect(() => {
      if (Object.keys(selectedSubject).length === 0) return
      const selected = responseData.response[selectedSubject.idx]
      // console.log('timetaken', selected)
      let data = []
      selected.map(subj => {
         if (subj.responseTime) {
            data.push(subj.responseTime)
         } else {
            data.push(0)
         }
      })
      // console.log('data', data);
      setTimeSeries(prev => {
         return {
            ...prev,
            data
         }
      })

   }, [selectedSubject])

   //change accuracy series and x axis
   useEffect(() => {
      if (Object.keys(selectedSubject).length === 0) return
      if (answerKey.length === 0) return
      const selected = responseData.response[selectedSubject.idx]

      if (!selectedSubject.concepts) return
      const concepts = Object.keys(selectedSubject.concepts).map(key => key)
      // console.log('concepts', concepts);
      setAccuracyGraphOptions(prev => {
         return {
            ...prev,
            xaxis: {
               ...prev.xaxis,
               categories: concepts
            }
         }
      })
      let totalIncorrectList = []
      const conceptsAnswer = Object.keys(selectedSubject.concepts).map(key => {
         const incorrectScore = getConceptScore(selectedSubject.concepts[key], key, true)
         totalIncorrectList.push(incorrectScore)
      })
      // console.log('totalIncorrectList', totalIncorrectList);
      // console.log('conceptsAnswer', conceptsAnswer)
      setAccuracySeries(prev => {
         return {
            ...prev,
            data: totalIncorrectList
         }
      })
   }, [selectedSubject, answerKey])

   //set total score of a section
   useEffect(() => {
      if (Object.keys(selectedSubject).length === 0) return
      const selected = responseData.response[selectedSubject.idx]
      setSectionScore({
         correct: selectedSubject.no_of_correct,
         outOf: selected.length,
      })

   }, [selectedSubject])


   const getConceptScore = (correctTotal, key, returnIncorrectOnly) => {
      let currentAnswerKeyIndex = 0

      answerKeySubjects.map((subj, idx) => {
         if (subj.name === selectedSubject.name) {
            currentAnswerKeyIndex = idx
         }
      })

      const selected = answerKey[currentAnswerKeyIndex]
      let total = 0
      selected.forEach(concept => {
         if (concept.Concepts === key) {
            total += 1
         }
      })
      if (returnIncorrectOnly) {
         return total - correctTotal
      } else {
         return `${total - correctTotal} / ${total}`
      }
   }

   const getSubjectSections = (c) => {

      let currSubject = answerKeySubjects.find(sub => sub.name === selectedSubject.name)
      // console.log('answerKeySubjects', answerKeySubjects)
      // console.log('currSubject', currSubject)
      let currentAnswerKeyIndex = 0

      answerKeySubjects.map((subj, idx) => {
         if (subj.name === selectedSubject.name) {
            currentAnswerKeyIndex = idx
         }
      })
      // console.log('currSubject', currSubject);
      // console.log('answer key arr', answerKey[currentAnswerKeyIndex]);
      const selected = responseData.response[selectedSubject.idx]
      // console.log('response answer', selected);
      if (currSubject) {
         return <div>
            {Object.keys(currSubject.concepts).map((key, idx) => {
               return <p key={idx} className='font-semibold mb-2'>
                  {/* {selectedSubject.concepts[key]} */}
                  {key}
               </p>
            })}
         </div>
      }
      return <>p</>
   }
   
   const getSubjectSectionsScore = (c) => {
      // let currSubject = answerKeySubjects.find(sub => sub.name === selectedSubject.name)
      // let currentAnswerKeyIndex = 0
      // answerKeySubjects.map((subj, idx) => {
      //    if (subj.name === selectedSubject.name) {
      //       currentAnswerKeyIndex = idx
      //    }
      // })
      // // console.log('currSubject', currSubject);
      // // console.log('answer key arr', answerKey[currentAnswerKeyIndex]);
      // let arr = []
      // Object.keys(currSubject).map(key => {
      //    let IncorrectCount = 0
      //    answerKey[currentAnswerKeyIndex].map((ans, idx) => {
      //       let { QuestionNumber, CorrectAnswer, Concepts } = ans
      //       if (key === Concepts){
      //          const selected = responseData.response[selectedSubject.idx]
      //          selected[idx]
      //       }
      //    })
      // })
      // const selected = responseData.response[selectedSubject.idx]
      // // console.log('response answer', selected);
      // if (currSubject) {
      // }
      return <>p</>
   }

   // console.log('tableData', tableData)
   // console.log('responseData', responseData)
   // console.log('selectedSubject', selectedSubject)
   // console.log('timeSeries', timeSeries)
   // console.log('answerKey', answerKey)

   if (Object.keys(responseData).length === 0) return <></>
   if (answerKey.length === 0) return <></>
   return (
      <div className='ml-pageLeft bg-lightWhite min-h-screen'>
         <div className='py-14 px-5'>
            <div className='px-0'>
               <SecondaryButton
                  className='flex items-center pl-2 pr-5 py-2.5'
                  onClick={() => navigate(-1)}
                  children={
                     <>
                        <img src={BackIcon} className='mr-2' />
                        <span>
                           Back
                        </span>
                     </>
                  } />
               <p className='mt-6 text-textPrimaryDark text-4xl font-bold'>
                  {testDetails.testName}
               </p>

               <div className='grid grid-cols-2 grid-rows-3 max-w-840 gap-y-4 mt-2'>
                  <div>
                     <p className='inline-block w-138 font-semibold opacity-60'> Student’s Name</p>
                     <span className='inline-block mr-4'>:</span>
                     <p className='inline-block w-138 font-semibold'> {testDetails.name} </p>
                  </div>
                  <div>
                     <p className='inline-block w-138 font-semibold opacity-60'> Started on </p>
                     <span className='inline-block mr-4'>:</span>
                     <p className='inline-block w-138 font-semibold'> {testDetails.startedOn} </p>
                  </div>
                  <div>
                     <p className='inline-block w-138 font-semibold opacity-60'>  Date Assigned </p>
                     <span className='inline-block mr-4'>:</span>
                     <p className='inline-block w-138 font-semibold'> {testDetails.assignedOn} </p>
                  </div>
                  <div>
                     <p className='inline-block w-138 font-semibold opacity-60'> Completed on </p>
                     <span className='inline-block mr-4'>:</span>
                     <p className='inline-block w-138 font-semibold'> {testDetails.completedOn} </p>
                  </div>
                  <div>
                     <p className='inline-block w-138 font-semibold opacity-60'> Duration </p>
                     <span className='inline-block mr-4'>:</span>
                     <p className='inline-block w-138 font-semibold'> {testDetails.duration} </p>
                  </div>
               </div>

               <div className='mt-6 flex justify-between items-end'>
                  <div>
                     {subjects.map((item, idx) => {
                        return <PrimaryButton
                           children={item.name}
                           onClick={() => handleChange(item)}
                           className={`py-2 px-0 mr-7 font-semibold w-160 ${item.selected ? '' : 'bg-secondaryLight text-textGray'}`} />
                     })}
                  </div>
                  <button className={`py-4 ${displayScore.isSat ? 'px-6' : 'px-4'}  bg-primaryOrange text-white rounded-20 flex items-center shadow-md pr-7`}>
                     <span className='inline-block font-bold text-42'>
                        {displayScore.cumulative}
                     </span>
                     <div className={styles.line}></div>
                     <span className='inline-block font-bold text-xl' >
                        {displayScore.right}
                     </span>
                  </button>
               </div>

               <div className='mt-7'>
                  {/* <p className='text-lg font-bold mb-2'>
                     Score: {`${sectionScore.correct} / ${sectionScore.outOf}`}
                  </p> */}
                  <div className='flex bg-[#EBEDEE] py-4 px-4 rounded-10' >
                     <div className='flex flex-col mr-[64px]'>
                        <p className='font-semibold text-primary mb-2.2'>Concepts</p>
                        {
                        // selectedSubject.no_of_correct === 0 ?
                        //    <>
                        //       {getSubjectSections()}
                        //    </> :
                           selectedSubject.concepts ?
                              Object.keys(selectedSubject.concepts).map((key, idx) => {
                                 return <p key={idx} className='font-semibold mb-2'>
                                    {/* {selectedSubject.concepts[key]} */}
                                    {key}
                                 </p>
                              })
                              : <></>
                        }

                     </div>
                     <div className='flex flex-col items-center'>
                        <p className='font-semibold text-primary mb-2.2'> Incorrect Answers</p>
                        {
                        // selectedSubject.no_of_correct === 0 ?
                        //    <>
                        //       {getSubjectSectionsScore()}
                        //    </> :
                           selectedSubject.concepts ?
                              Object.keys(selectedSubject.concepts).map((key, idx) => {
                                 return <p key={idx} className='font-semibold mb-2'>
                                    {/* correct {selectedSubject.concepts[key]} */}
                                    {getConceptScore(selectedSubject.concepts[key], key)}
                                 </p>
                              })
                              : <></>
                        }
                     </div>
                     <div className='flex flex-col items-cener ml-auto mr-[145px]'>
                        <p className='font-semibold text-primary mb-2.2'> Section Started</p>
                        <p className='font-semibold mb-2'> {getDate(responseData.createdAt)} </p>
                        {/* <p className='font-semibold mb-2 opacity-0'>04:25 PM EST</p> */}
                        <p className='font-semibold text-primary mb-2.2 mt-6'> Section Duration</p>
                        <p className='font-semibold mb-2'>
                           {/* {selectedSubject.timeTaken/1000} */}
                           {selectedSubject.timeTaken ?
                              // moment.duration(selectedSubject.timeTaken).format('HH:mm')
                              millisToMinutesAndSeconds(selectedSubject.timeTaken)
                              : <></>
                           }
                        </p>
                     </div>
                     <div className='flex flex-col items-cener mr-12'>
                        <p className='font-semibold text-primary mb-2.2'> Section Accuracy</p>
                        <p className='font-semibold mb-2'>
                           {
                              Object.keys(responseData).length >= 1 &&
                              Object.keys(selectedSubject).length >= 1
                              &&
                              <>
                                 {selectedSubject.no_of_correct} / {' '}
                                 {responseData.response[selectedSubject.idx].length}
                              </>
                           }

                        </p>

                     </div>

                  </div>
               </div>

               <div className='mt-4 max-w-[900px]'>
                  <Table
                     dataFor={persona === 'parent' || persona === 'student' ? 'studentTestsReportSmall' : 'studentTestsReport'}
                     hidePagination={true}
                     data={tableData}
                     tableHeaders={tableHeaders}
                     maxPageSize={10} />
               </div>
               <div className='mt-10'>
                  {/* <Table dataFor='studentTestsAnswers'
                     hidePagination={true}
                     data={answersData}
                     tableHeaders={adminTableHeaders}
                     maxPageSize={10} /> */}
               </div>

               <div className='bg-white mt-6 rounded-20 py-5 px-5 '>
                  <p className='text-primary-dark font-bold text-3xl text-center mb-6 mt-2'>Time Taken</p>
                  <BarGraph series={[timeSeries]} options={ttOptions} height='600px' />
               </div>
               <div className='bg-white mt-6 rounded-20 py-5 px-5 max-w-[1100px]'>
                  <p className='text-primary-dark font-bold text-3xl text-center mb-6 mt-2'>
                     Conceptual Accuracy
                  </p>
                  <BarGraph series={[accuracySeries]} options={accuracyGraphOptions} height='600px' />
               </div>
            </div>
         </div>
      </div>
   )
}
