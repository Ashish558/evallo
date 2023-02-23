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
import { getDate, getDuration, getFormattedDate, getScoreStr, millisToMinutesAndSeconds } from '../../utils/utils'
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
   const [timeSeriesOptions, setTimeSeriesOptions] = useState(ttOptions)

   const [accuracySeries, setAccuracySeries] = useState({
      name: 'Correct Answers',
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

   const { id, studentId, assignedTestId } = useParams()

   const [testDetails, setTestDetails] = useState({
      testName: '-',
      assignedOn: '-',
      name: '-',
      startedOn: '-',
      completedOn: '-',
      duration: '-',
      instruction: '-',
   })
   const [subjects, setSubjects] = useState([])
   const [selectedSubject, setSelectedSubject] = useState({})
   const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery()
   const [getUserDetail, userDetailResp] = useLazyGetTutorDetailsQuery()
   const [getTestDetails, getTestDetailsResp] = useLazyGetTestDetailsQuery()
   const [getAssignedTest, getAssignedTestResp] = useLazyGetSingleAssignedTestQuery()
   const [isSet, setIsSet] = useState(false)
   const [getAnswers, getAnswersResp] = useLazyGetAnswersQuery()
   const [answerKeySubjects, setAnswerKeySubjects] = useState([])
   const [sectionDuration, setSectionDuration] = useState('')
   const [totalTimeTaken, setTotalTimeTaken] = useState(0)

   const [scoreStr, setScoreStr] = useState('')

   // console.log('params studnt', studentId);
   //get answer key
   useEffect(() => {
      if (Object.keys(responseData).length === 0) return
      if (isSet === true) return
      console.log('response data', responseData);
      // let sortedSubjects = responseData.subjects.map(sub => sub.name)
      if (responseData.subjects.length === 0) {
         alert('No sections are submitted')
         navigate(-1)
         return
      }

      getAnswers(id)
         .then(res => {
            if (res.error) return console.log(res.error);
            console.log('ANSWER KEY', res.data.data);

            let answerKeyData = { ...res.data.data }
            let score = getScoreStr(responseData.testType, responseData.score, responseData.subjects, answerKeyData.answer.subjects.length)
            // console.log('score', score);
            setDisplayScore(score)

            // console.log('answer key subjects', answerKeyData.answer.subjects);
            let conceptsPresent = true
            answerKeyData.answer.subjects.map(item => {
               if (item.concepts === undefined) {
                  conceptsPresent = false
               }
            })
            if (conceptsPresent === false) {
               alert('Concepts not present')
               navigate(-1)
            }
            let subResponse = answerKeyData.answer.subjects.map(sub => {
               let currSub = responseData.subjects.find(item => item.name === sub.name)
               if (currSub === undefined) return
               // console.log('currSub', currSub);
               let conceptsToInclude = {}
               if (currSub.concepts === undefined) {
                  Object.keys(sub.concepts).map(key => {
                     // console.log('sub.concepts[key]', sub.concepts[key]);
                     conceptsToInclude[key] = 0
                  })
                  return {
                     ...currSub,
                     concepts: conceptsToInclude
                  }
               } else {
                  Object.keys(sub.concepts).map(key => {
                     conceptsToInclude[key] = 0
                  })
                  return {
                     ...currSub,
                     concepts: {
                        ...conceptsToInclude,
                        ...currSub.concepts
                     }
                  }
               }
               // console.log('conceptsToInclude', conceptsToInclude);
            }).filter(item => item !== undefined)
            // console.log('subResponse', subResponse);
            // console.log('subjects', subjects);
            let updated = subjects.map(subj => {
               let updatedSubjWithConcepts = subResponse.find(item => item.name === subj.name)
               return {
                  ...subj,
                  concepts: {
                     ...updatedSubjWithConcepts.concepts
                  }
               }
               // console.log('updatedSubjWithConcepts', updatedSubjWithConcepts);
            })
            let updated2 = subResponse.map(subj => {
               let updatedSubj = subjects.find(item => item.name === subj.name)
               return {
                  ...subj,
                  timeTaken: updatedSubj.timeTaken,
                  selected: updatedSubj.selected
               }
               // console.log('updatedSubjWithConcepts', updatedSubjWithConcepts);
            })
            // console.log('subjects', subjects);
            console.log('updated', updated);
            // console.log('responseData', responseData);
            // console.log('subResponse', subResponse);
            let upSubArr = []
            updated2.forEach(responseSub => {
               updated.forEach(sub => {
                  if (responseSub.name === sub.name) {
                     upSubArr.push(sub)
                  }
               })
            })
            console.log('upSubArr', upSubArr);

            setResponseData(prev => {
               return {
                  ...prev,
                  subjects: upSubArr
               }
            })
            setSubjects(upSubArr)
            let selected = upSubArr.find(item => item.selected === true)
            setSelectedSubject(selected)

            let subjects1 = answerKeyData.answer.subjects
            setAnswerKey(res.data.data.answer.answer)
            setAnswerKeySubjects(answerKeyData.answer.subjects)
            setIsSet(true)
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
      let url = `/api/test/myassigntest/${assignedTestId}`
      if (studentId) {
         params = {
            userId: studentId
         }
         url = `/api/test/myassigntest/${assignedTestId}`
      }
      getAssignedTest({ url })
         .then(res => {
            if (res.error) return console.log('TEST ERROR', res.error);
            console.log('TEST RESP', res.data.data.test);
            let { testId, createdAt, timeLimit, multiple, instruction } = res.data.data.test
            if (testId === null) {
               testId = {}
            }
            setTestDetails(prev => {
               return {
                  ...prev,
                  assignedOn: getFormattedDate(createdAt),
                  testName: testId.testName,
                  instruction: instruction,
                  duration: multiple ? getDuration(multiple) : '-',
               }
            })
         })

   }, [])

   useEffect(() => {
      let params = {}
      let url = `/api/test/getresponse/${assignedTestId}`
      if (studentId) {
         url = `/api/test/admin/getresponse/${assignedTestId}`
      }
      getTestResponse({ url, params: params })
         .then(res => {
            if (res.error) {
               console.log('RESPONSE ERR', res.error)
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

               // setDisplayScore({
               //    cumulative: `C${set1Score + set2Score}`,
               //    right: `V${set1Score}|M${set2Score}`,
               //    isSat: true
               // })
            } else if (res.data.data.response.testType === 'SAT') {
               let scoreArr = []
               let total = 0
               subjects.map((sub, idx) => {
                  total += sub.no_of_correct
                  scoreArr.push(sub.no_of_correct)
               })
               // setDisplayScore({
               //    cumulative: `C${total / subjects.length}`,
               //    right: `E${scoreArr[0]} M${scoreArr[1]} R${scoreArr[2]} C${scoreArr[3]}`,
               //    isSat: false
               // })
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
      const oddcolors = ['#8ADCFF', '#FF4D00']
      const evencolors = ['#8E76ED', '#E02B1D']
      if (Object.keys(selectedSubject).length === 0) return
      const selected = responseData.response[selectedSubject.idx]
      // console.log('timetaken', selected)
      let data = []
      let colors = []
      selected.map((subj, idx) => {
         if (subj.responseTime) {
            if (subj.isCorrect) {
               (idx % 2 === 0) ? colors.push(evencolors[0]) : colors.push(oddcolors[0])
            } else {
               (idx % 2 === 0) ? colors.push(evencolors[1]) : colors.push(oddcolors[1])
            }
            data.push(subj.responseTime)
         } else {
            if (subj.isCorrect) {
               (idx % 2 === 0) ? colors.push(evencolors[0]) : colors.push(oddcolors[0])
            } else {
               (idx % 2 === 0) ? colors.push(evencolors[1]) : colors.push(oddcolors[1])
            }
            data.push(0)
         }
      })
      // console.log('data', data);
      // console.log('colors', colors);
      // console.log('length', Math.ceil(data.length / 5));
      const len = Math.round(data.length / 1)
      let groups = []
      {
         [...Array(len)].map((x, i) => {
            groups.push({ title: (i + 1) * 1, cols: 1 })
         })
      }
      // groups = groups.map(item => {
      //    return item.title % 5 === 0 ? item.title : '-'
      // })
      console.log('groups', groups);
      // console.log('timeSeriesOptions', timeSeriesOptions);
      setTimeSeriesOptions(prev => ({
         ...prev,
         colors,
         xaxis: {
            ...prev.xaxis,
            // tickAmount: 'dataPoints',
            range: 5,
            group: {
               ...prev.xaxis.group,
               groups
            }
         },
         // tooltip: {
         //    custom: function({series, seriesIndex, dataPointIndex, w}) {
         //      return '<div class="arrow_box">' +
         //        '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
         //        '</div>'
         //    }
         //  }
      }))
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
      // console.log(selectedSubject.concepts);
      // const conceptsAnswer = Object.keys(selectedSubject.concepts).map(key => {
      //    const incorrectScore = getConceptScore(selectedSubject.concepts[key], key, true)
      //    totalIncorrectList.push(incorrectScore)
      // })
      Object.keys(selectedSubject.concepts).forEach(key => {
         const incorrectScore = selectedSubject.concepts[key]
         totalIncorrectList.push(incorrectScore)
      })
      // console.log('CorrectList', totalIncorrectList);
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

      let selected = answerKey[currentAnswerKeyIndex]
      selected = selected.map(item => {
         if (!item.Concepts) {
            return { ...item, Concepts: 'UNAVAILABLE' }
         } else {
            return { ...item }
         }
      })
      // console.log('selected', selected);
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
      let currSubject = answerKeySubjects.find(sub => sub.name === selectedSubject.name)
      let currentAnswerKeyIndex = 0
      answerKeySubjects.map((subj, idx) => {
         if (subj.name === selectedSubject.name) {
            currentAnswerKeyIndex = idx
         }
      })
      console.log('currSubject', currSubject);
      console.log('answer key arr', answerKey[currentAnswerKeyIndex]);
      const selected = responseData.response[selectedSubject.idx]
      console.log('response answer', selected);

      let arr = []
      Object.keys(currSubject).map(key => {
         let IncorrectCount = 0
         answerKey[currentAnswerKeyIndex].map((ans, idx) => {
            let { QuestionNumber, CorrectAnswer, Concepts } = ans
            if (key === Concepts) {
               const selected = responseData.response[selectedSubject.idx]
               if (selected[idx].isCorrect === false) {
                  IncorrectCount += 1
               }
            }
         })
      })

      if (currSubject) {
      }
      return <>p</>
   }

   useEffect(() => {
      if (!answerKeySubjects) return
      if (!selectedSubject) return

      if (answerKeySubjects.length === 0) return
      if (Object.keys(selectedSubject).length === 0) return
      // console.log('selectedSubject', selectedSubject)
      // console.log('answerKeySubjects', answerKeySubjects)
      const ansKeySubject = answerKeySubjects.find(item => item.name === selectedSubject.name)
      // console.log('ansKeySubject', ansKeySubject);
      if (!ansKeySubject) return
      setSectionDuration(`${ansKeySubject.timer}:00`)
   }, [answerKeySubjects, selectedSubject])

   useEffect(() => {
      if (!tableData) return
      if (!selectedSubject) return

      if (tableData.length === 0) return
      // console.log('selectedSubject', selectedSubject)
      // console.log('tableData', tableData)

      let total = 0
      tableData.forEach(item => {
         if (item.responseTime !== undefined || item.responseTime !== "-") {
            let num = item.responseTime.split(" ")[0]
            if (num === '-') return
            total += parseInt(num)
         }
      })
      setTotalTimeTaken(`${total} sec`)
      setTotalTimeTaken(millisToMinutesAndSeconds(total * 1000))
   }, [tableData, selectedSubject])

   // console.log('tableData', tableData)
   // console.log('responseData', responseData)
   // console.log('subjects', subjects)
   // console.log('selectedSubject', selectedSubject)
   // console.log('timeSeries', timeSeries)
   // console.log('answerKey', answerKey)
   // console.log('answerKeySubjects', answerKeySubjects)
   // console.log('testDetails', testDetails)

   if (Object.keys(responseData).length === 0) return <></>
   if (answerKey.length === 0) return <></>
   if (selectedSubject.concepts === undefined) return <></>
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
                  <div className='col-span-2'>
                     <p className='inline-block w-138 font-semibold opacity-60'> Duration </p>
                     <span className='inline-block mr-4'>:</span>
                     <p className='inline-block w-138 font-semibold'> {testDetails.duration} </p>
                  </div>
                  <div className='col-span-2'>
                     <p className='inline-block w-138 font-semibold opacity-60'> Instruction from tutor </p>
                     <span className='inline-block mr-4'>:</span>
                     <p className='inline-block w-138 font-semibold'> {testDetails.instruction} </p>
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
                  <button className={`py-4 px-6 bg-primaryOrange text-white rounded-20 flex items-center shadow-md pr-7`}>
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
                                 return idx < 5 ? <p key={idx} className='font-semibold mb-2'>
                                    {/* {selectedSubject.concepts[key]} */}
                                    {key}
                                 </p> : <></>
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
                                 return idx < 5 ? <p key={idx} className='font-semibold mb-2'>
                                    {/* correct {selectedSubject.concepts[key]} */}
                                    {getConceptScore(selectedSubject.concepts[key], key)}
                                 </p> : <></>
                              })
                              : <></>
                        }
                     </div>
                     <div className='flex flex-col items-cener ml-auto mr-[145px]'>
                        <p className='font-semibold text-primary mb-2.2'> Section Started</p>
                        <p className='font-semibold mb-2'> {getDate(responseData.createdAt)} </p>
                        {/* <p className='font-semibold mb-2 opacity-0'>04:25 PM EST</p> */}
                        <p className='font-semibold text-primary mb-2.2 mt-6'> Section Time Limit</p>
                        <p className='font-semibold mb-2'>
                           {/* {selectedSubject.timeTaken/1000} */}
                           {selectedSubject.timeTaken ?
                              // moment.duration(selectedSubject.timeTaken).format('HH:mm')
                              sectionDuration ? sectionDuration : ''
                              // millisToMinutesAndSeconds(selectedSubject.timeTaken)
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
                        <p className='font-semibold text-primary mb-2.2 mt-6'> Total Time Taken </p>
                        <p className='font-semibold mb-2'>
                           {/* {selectedSubject.timeTaken/1000} */}
                           {selectedSubject.timeTaken ?
                              // moment.duration(selectedSubject.timeTaken).format('HH:mm')
                              totalTimeTaken
                              // millisToMinutesAndSeconds(selectedSubject.timeTaken)
                              : <></>
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
                  <BarGraph series={[timeSeries]} options={timeSeriesOptions} height='600px' />
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
