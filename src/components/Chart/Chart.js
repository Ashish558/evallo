import React, { useEffect, useRef, useState } from 'react';
import {
   Chart as ChartJS,
   LinearScale,
   PointElement,
   Tooltip,
   Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { useLazyGetTestResponseQuery } from '../../app/services/test';
import { useLazyGetPersonalDetailQuery, useLazyGetUserDetailQuery } from '../../app/services/users';
import { backgroundColors, iniOptions } from './data';
import { useSelector } from 'react-redux';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const tempdata = [
   { x: 5, y: 100, r: 0 },
]
const dummy = {
   label: '',
   data: [{ x: 0, y: 0, r: 0 },],
   backgroundColor: 'rgba(255, 99, 132, 0)',
}

const data1 = {
   datasets: [
      { ...dummy },
      {
         label: '',
         data: tempdata,
         backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
   ],
};
export default function Chart({ setSubjects, subjects, selectedSubject, selectedStudent, currentSubData, setCurrentSubData, selectedConceptIdx }) {

   const [fetchPersonalDetails, personalDetailsResp] = useLazyGetPersonalDetailQuery()
   const [options, setOptions] = useState(iniOptions)
   const [chartData, setChartData] = useState([])
   const [currentConcepts, setCurrentConcepts] = useState([])
   const [canvasWidth, setCanvasWidth] = useState(500)
   const [data, setData] = useState(data1)
   const [show, setShow] = useState(true)
   const chartRef = useRef(null)
   const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery()
   const { role: persona, id } = useSelector(state => state.user)

   // const checkIfKeyExists = (concepts) => {
   //    concepts
   // }

   useEffect(() => {
      if (persona == 'student') return
      if (selectedStudent?._id === undefined || selectedStudent?._id === null) return
      getUserDetail({ id: selectedStudent._id })
         .then(res => {
            if (res.error) {
               return
            }
            console.log('Resp', res.data.data.user)
            let data = res.data.data.user.chart
            if (!data) return
            let fData = data.filter(item => Object.keys(item.concepts).includes('correct'))
            // console.log('fdata', fData)
            fData = data.filter(item => item.concepts.correct !== null)
            let filtered = fData.filter(item => !Object.keys(item.concepts.correct).includes('undefined'))
            // console.log('filter undefined', filtered)
            setChartData(filtered)
            const subjectsNames = []

            filtered.forEach(item => {
               if (!subjectsNames.includes(item.subject)) {
                  subjectsNames.push(item.subject)
               }
            })
            const subjects = subjectsNames.map((item, idx) => {
               return {
                  name: item,
                  selected: idx === 0 ? true : false
               }
            })
            // console.log('subjects', subjects)
            setSubjects(subjects)

            subjects.forEach(sub => {
               filtered.forEach(item => {
                  if (item.subject === sub.name) {

                  }
               })
            })
            //temp

         })
   }, [selectedStudent])

   useEffect(() => {
      if (persona === 'parent') return
      fetchPersonalDetails()
         .then(res => {
            if (res.error) return
            let data = res.data.data.user.chart
            console.log('chart', data)
            if (!data) return
            let fData = data.filter(item => item.concepts.length > 0)
            // console.log('fdata', fData)
            // fData = data.filter(item => item.concepts[selectedConceptIdx].correct !== null )
            // let filtered = fData.filter(item => !Object.keys(item.concepts[selectedConceptIdx].correct).includes('undefined'))
            let filtered = fData
            console.log('filtered', filtered)
            setChartData(filtered)
            const subjectsNames = []

            filtered.forEach(item => {
               if (!subjectsNames.includes(item.subject)) {
                  subjectsNames.push(item.subject)
               }
            })
            const subjects = subjectsNames.map((item, idx) => {
               return {
                  name: item,
                  selected: idx === 0 ? true : false
               }
            })
            // console.log('subjects', subjects)
            setSubjects(subjects)

            subjects.forEach(sub => {
               filtered.forEach(item => {
                  if (item.subject === sub.name) {

                  }
               })
            })

         })
   }, [])

   const getColor = (idx, len) => {
      let index = idx
      if (idx > len - 1) {
         index = index % len
      }
      // console.log(index);
      return backgroundColors[index] !== undefined ? backgroundColors[index] : backgroundColors[0]
   }
   useEffect(() => {
      if (chartData.length === 0) {
         setData({ datasets: [] })
         return
      }
      const curr = chartData.find(item => item.subject === selectedSubject)
      if (curr === undefined) return
      // console.log('curr', curr)
      setCurrentSubData(curr)
      const concepts = Object.keys(curr.concepts[selectedConceptIdx].total).map(key => {
         return key
      })
      // console.log('concepts', concepts)
      setCurrentConcepts(concepts)
      setOptions(prev => ({
         ...prev,
         plugins: {
            tooltip: {
               callbacks: {
                  label: function (context, c, d) {
                     return `  ${concepts[context.datasetIndex - 1]} : ${context.parsed.y}%`
                  }
               },
               backgroundColor: 'rgba(0, 0, 0, 0.7)',
               padding: 10,
               titleAlign: 'right'
            },
            legend: {
               display: false
            }
         },
         scales: {
            ...prev.scales,
            x: {
               ...prev.scales.x,
               ticks: {
                  ...prev.scales.x.ticks,
                  callback: function (value, index, ticks) {
                     return index === 0 ? '' : concepts[index - 1]
                  }
               }
            }
         },
      }))
      const datasets = [{ ...dummy },]
      if (!curr.concepts[selectedConceptIdx].total) return
      Object.keys(curr.concepts[selectedConceptIdx].total).forEach((totalConcept, idx) => {
         if (Object.keys(curr.concepts[selectedConceptIdx].correct).includes(totalConcept)) {
            let x = (idx + 1) * 5
            let totalVal = curr.concepts[selectedConceptIdx].total[totalConcept]
            let getValue = curr.concepts[selectedConceptIdx].correct[totalConcept]
            const percent = Math.round(getValue * 100 / totalVal)
            let radius = totalVal * 2
            // console.log(totalConcept, percent);
            if (radius < 15) {
               radius = 15
            } else if (radius > 40) {
               radius = 40
            }
            datasets.push({
               label: '',
               // data: [{ x, y: percent, r: 20 }],
               data: [{ x, y: percent, r: radius }],
               backgroundColor: getColor(idx, concepts.length),
            })
         } else {
            let x = (idx + 1) * 5
            let totalVal = curr.concepts[selectedConceptIdx].total[totalConcept]
            let getValue = 0
            let radius = totalVal * 2
            const percent = Math.round(getValue * 100 / totalVal)
            if (radius < 15) {
               radius = 15
            } else if (radius > 40) {
               radius = 40
            }
            datasets.push({
               label: '',
               data: [{ x, y: percent, r: radius }],
               backgroundColor: getColor(idx, concepts.length),
            })
         }

      })
      setData({
         datasets: datasets
      })
   }, [selectedSubject, chartData, selectedConceptIdx])


   useEffect(() => {

   }, [currentSubData])
   // console.log('data', data)
   // console.log('currentSubData', currentSubData)
   console.log('selectedConceptIdx', selectedConceptIdx)

   useEffect(() => {
      // if (currentConcepts.length < 10) {
      //    setCanvasWidth(500)
      //    setShow(false)
      //    setInterval(() => {
      //       setShow(true)
      //    }, 10);
      // } else if (currentConcepts.length < 20) {
      //    setCanvasWidth(800)
      //    setShow(false)
      //    setInterval(() => {
      //       setShow(true)
      //    }, 10);
      //    // chartRef.current.update()
      // }
   }, [currentConcepts.length])

   return (
      data !== undefined &&
      <div className='wrapper' style={{ width: '1000px', overflowX: 'auto' }} >

         <Bubble ref={chartRef}
            options={options} data={data}
            height={180}
            width={canvasWidth}
         /> :

      </div>
   )
}
