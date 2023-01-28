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
import { useLazyGetPersonalDetailQuery } from '../../app/services/users';
import { backgroundColors, iniOptions } from './data';

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
export default function Chart({ setSubjects, subjects, selectedSubject }) {

   const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery()
   const [fetchPersonalDetails, personalDetailsResp] = useLazyGetPersonalDetailQuery()
   const [options, setOptions] = useState(iniOptions)
   const [chartData, setChartData] = useState([])
   const [currentConcepts, setCurrentConcepts] = useState([])
   const [canvasWidth, setCanvasWidth] = useState(500)
   const [data, setData] = useState(data1)
   const [show, setShow] = useState(true)
   const chartRef = useRef(null)

   // const checkIfKeyExists = (concepts) => {
   //    concepts
   // }

   useEffect(() => {
      fetchPersonalDetails()
         .then(res => {
            if (res.error) {
               return
            }
            console.log('Resp', res.data.data.user.chart)
            let data = res.data.data.user.chart
            if(!data) return
            let fData = data.filter(item => Object.keys(item.concepts).includes('correct'))
            console.log('fdata', fData)
            let filtered = fData.filter(item =>  !Object.keys(item.concepts.correct).includes('undefined'))
            console.log('filter undefined', filtered)
            setChartData(filtered)
            const subjectsNames = []
            let chartData = [

            ]
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
      if (chartData.length === 0) return
      const curr = chartData.find(item => item.subject === selectedSubject)
      if (curr === undefined) return
      console.log('curr', curr)
      const concepts = Object.keys(curr.concepts.total).map(key => {
         return key
      })
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
      if (!curr.concepts.total) return
      Object.keys(curr.concepts.total).forEach((totalConcept, idx) => {
         if (Object.keys(curr.concepts.correct).includes(totalConcept)) {
            let x = (idx + 1) * 5
            let totalVal = curr.concepts.total[totalConcept]
            let getValue = curr.concepts.correct[totalConcept]
            const percent = Math.round(getValue * 100 / totalVal)
            let radius = totalVal*2
            // console.log(totalConcept, percent);
            if(radius < 15){
               radius = 15
            }else if(radius > 40){
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
            let totalVal = curr.concepts.total[totalConcept]
            let getValue = 0
            let radius = totalVal*2
            const percent = Math.round(getValue * 100 / totalVal)
            if(radius < 15){
               radius = 15
            }else if(radius > 40){
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
   }, [selectedSubject, chartData])


   // console.log('chartData', chartData)
   // console.log('currentConcepts', currentConcepts)

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
