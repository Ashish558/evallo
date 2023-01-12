import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SecondaryButton from '../../components/Buttons/SecondaryButton'

import BackIcon from '../../assets/assignedTests/back.svg'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import { TestDetail } from '../../components/TestDetail/TestDetail'
import { testData } from './tempData'
import TestOption from '../../components/TestOption/TestOption'
import { useAttendTestMutation, useLazyContinueTestQuery, useLazyGetAssignedTestQuery, useLazyGetSectionsQuery, useLazyGetTestResponseQuery, useLazyGetTimeQuery, useStartTestMutation, useSubmitTestMutation, useUpdateTimeMutation } from '../../app/services/test'
import BackBtn from '../../components/Buttons/Back'
import Timer from '../../components/Timer/Timer'
import CurrentSection from './CurrentSection/CurrentSection'
import { useSelector } from 'react-redux'
import { getFormattedDate } from '../../utils/utils'
const tempsubjects = [
   { text: 'Trigonometry', selected: true },
   { text: 'Mathematics', selected: false },
   { text: 'Reading', selected: false },
   { text: 'Science', selected: false },
]


export default function StartTest() {

   const navigate = useNavigate()
   const [tempSubjects, setTempSubjects] = useState(tempsubjects)
   const [testStarted, setTestStarted] = useState(false)

   const [initialSeconds, setInitialSeconds] = useState(0)
   const [countDown, setCountDown] = useState(0)

   const { firstName, lastName } = useSelector(state => state.user)

   const [testHeaderDetails, setTestHeaderDetails] = useState({
      name: `${firstName} ${lastName}`,
      duration: 0,
      dateAssigned: '',
      startedOn: '',
      completedOn: ''
   })
   const [sectionDetails, setSectionDetails] = useState({})
   const [subjects, setSubjects] = useState([])
   const [activeSection, setActiveSection] = useState({})
   const [timer, setTimer] = useState(10)
   const [answers, setAnswers] = useState([])
   const [submitId, setSubmitId] = useState('')
   const { id } = useParams()

   const [getSections, getSectionsResp] = useLazyGetSectionsQuery()
   const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery()

   const [attendTest, attendTestResp] = useAttendTestMutation()
   const [updateTime, updateTimeResp] = useUpdateTimeMutation()
   const [startTest, startTestResp] = useStartTestMutation()
   const [submitSection, submitSectionResp] = useSubmitTestMutation()
   const [getTime, getTimeResp] = useLazyGetTimeQuery()
   const [continueTest, continueTestResp] = useLazyContinueTestQuery()
   const [completedSectionIds, setCompletedSectionIds] = useState([])

   const handleStartTest = () => {
      if (!activeSection) return
      startTest({ id: id, reqbody: { sectionName: activeSection.name } })
         .then(res => {
            if (res.error) {
               console.log(res.error)
            }
            console.log('start test', res.data)
            const { startTime, endTime, sectionName, answer, submitId } = res.data.data
            let timer = (new Date(endTime) - new Date()) / 1000
            setTimer(Math.trunc(timer))
            setInitialSeconds(Math.trunc(timer))
            setTestStarted(true)
            setActiveSection({ name: sectionName })
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
            setAnswers(answer.map(item => ({ ...item, isMarked: false, ResponseAnswer: 'C', responseTime: 0 })))
         })
   }
   // console.log(id)

   const fetchSections = () => {
      getSections({ id: id })
         .then(res => {
            if (res.error) {
               return console.log(res.error);
            }
            console.log('sections response', res.data.data);
            let duration = 0


            res.data.data.subjects.subjects.map(item => {
               duration += item.timer
            })
            console.log('date', new Date(res.data.data.subjects.createdAt));
            setTestHeaderDetails(prev => ({
               ...prev, duration,
               startedOn: getFormattedDate(new Date(res.data.data.subjects.createdAt))
            }))
            setSectionDetails(res.data.data)
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
                  fetchContinueTest()
               })
         })
   }
   useEffect(() => {
      if (!id) return
      fetchSections()
   }, [])

   useEffect(() => {
      // getTestResponse({ id })
      //    .then(res => {
      //       if (res.error) {
      //          console.log(res.error)
      //          return
      //       }
      //       console.log('TEST RESPONSE', res.data.data)
      //    })
   }, [])

   const fetchContinueTest = () => {
      continueTest({ id })
         .then(res => {
            if (res.error) {
               console.log(res.error)
               return
            }
            console.log('continue', res.data.data)

            const { startTime, endTime, sectionName, completed, answer, submitId } = res.data.data
            if (endTime !== null && endTime) {
               let timer = (new Date(endTime) - new Date()) / 1000
               setTimer(Math.trunc(timer))
               setInitialSeconds(Math.trunc(timer))
               // setTestStarted(true)
               setTestStarted(true)
               setActiveSection({ name: sectionName })
               setSubmitId(submitId)
               setAnswers(answer.map(item => ({
                  ...item, isMarked: false, ResponseAnswer: 'C',
                  responseTime: 0
               })))
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
   // useEffect(() => {
   //    fetchContinueTest()
   // }, [])

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
   // setTestStarted(false)
   useEffect(() => {
      if (subjects.length === 0) return
      const active = subjects.find(item => item.selected === true)
      if (active) {
         setActiveSection(active)
      }
   }, [subjects])

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
            sectionName: activeSection.name,
            response: response
         }
      }
      console.log(body);
      submitSection(body)
         .then(res => {
            if (res.error) {
               return console.log(res.error)
            }
            console.log(res.data)
            setTestStarted(false)
            fetchContinueTest()
            setActiveSection({})
         })
   }

   const handleMark = (id, bool) => {
      setAnswers(prev => {
         return prev.map(item => {
            if (item._id === id) return { ...item, isMarked: bool }
            else return { ...item }
         })
      })
   }
   // const { subjects, testQnId, testType } = sectionDetails.subjects
   // console.log('sectionDetails', sectionDetails)
   // console.log('answers', answers)
   // console.log('subjects', subjects)
   // console.log('activeSection', activeSection)
   // console.log('completedsections', completedSectionIds);
   // console.log('timer', timer);
   // console.log('initialSeconds', initialSeconds);
   // console.log('countDown', countDown);

   const handleTimeTaken = (id, sec) => {

   }

   if (subjects.length === 0) return
   return (
      <div className='ml-pageLeft bg-lightWhite min-h-screen'>
         <div className='py-8 px-5'>

            <div className='flex'>

               <div className='flex-1' >
                  <BackBtn to='/all-tests' />
                  <p className='text-primary-dark font-bold text-3xl mb-8' >Test Name</p>
                  {!testStarted &&
                     <div className='grid grid-cols-2 grid-rows-3 max-w-840 text-sm gap-y-4 mt-2'>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Student’s Name</p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails.name}
                           </p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Started on </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails.startedOn ? testHeaderDetails.startedOn : '-'}
                           </p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'>  Date Assigned </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails.dateAssigned}
                           </p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Completed on </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              -
                           </p>
                        </div>
                        <div>
                           <p className='inline-block w-138 font-semibold opacity-60'> Duration </p>
                           <span className='inline-block mr-4'>:</span>
                           <p className='inline-block w-138 font-semibold'>
                              {testHeaderDetails.duration} </p>
                        </div>
                     </div>
                  }

                  <div>

                     <div className='mt-9'>
                        {subjects.map((item, idx) => {
                           return <PrimaryButton
                              roundedClass='rounded-0'
                              children={item.name}
                              onClick={() => handleSubjectChange(item)}
                              className={`pt-2 pb-2 px-0 mr-0 rounded-0 font-semibold w-160
                            ${item.selected ? 'bg-primaryYellow' : ''} disabled:opacity-60`}
                              disabled={testStarted && item.selected === false ? true : completedSectionIds.includes(item._id) ? true : false}
                           />
                        })}
                     </div>
                     {!testStarted && Object.keys(activeSection).length > 1 &&
                        <div className='bg-white pt-[60px] pr-8 pl-12 pb-[50px] mt-4'>
                           <TestDetail name={activeSection.name} desc={activeSection.description} />

                           <div className='flex items-center flex-col mt-12'>
                              <p className='text-[#E02B1D] bg-[#FFBE9D] py-2 px-5 rounded-20 mb-[15px]' >
                                 Warning: Once Started, you wont be able to pause the timer.
                              </p>
                              <PrimaryButton children='Start Section' className='w-[300px] h-[60px] text-[21px]' onClick={handleStartTest} />
                           </div>
                        </div>
                     }

                     {testStarted &&
                        <div className='mt-[15px] overflow-auto' style={{ maxHeight: 'calc(100vh - 240px)' }}>
                           {answers.map((item, idx) => {
                              return (
                                 <div key={idx} className='flex justify-between items-center py-5 px-10 bg-white rounded-xl mb-[15px]'>
                                    <p className='font-bold text-[22px] leading-none'> {item.QuestionNumber} </p>
                                    <TestOption {...item}
                                       handleResponseChange={handleResponseChange}
                                       handleTimeTaken={handleTimeTaken} />
                                    {item.isMarked ?
                                       <button className='w-[180px] font-semibold py-3 rounded-lg pt-[8px] pb-[8px]	 border-2 border-[#D2D2D2] text-[#D2D2D2] ml-4'
                                          onClick={() => handleMark(item._id, false)} >
                                          Mark for Review
                                       </button> :
                                       <button className='w-[180px] font-semibold pt-2.5 pb-2.5 rounded-lg bg-primaryOrange text-white ml-4'
                                          onClick={() => handleMark(item._id, true)} >
                                          Unmark
                                       </button>
                                    }
                                 </div>
                              )
                           })}
                        </div>
                     }

                  </div>
               </div>

               {/* RIGHT */}
               <div className='flex-2 ml-8 flex flex-col' >

                  {
                     testStarted && <Timer handleSubmitSection={handleSubmitSection} timer={timer}
                        active={testStarted ? true : false}
                        setCountDown={setCountDown} />
                  }
                  {
                     testStarted && <CurrentSection answers={answers} submitSection={handleSubmitSection} />
                  }
               </div>
            </div>

         </div>
      </div>
   )
}
