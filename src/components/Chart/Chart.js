import React, { useEffect, useRef, useState } from 'react';
import {
   Chart as ChartJS,
   LinearScale,
   PointElement,
   Tooltip,
   Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { useLazyGetPersonalDetailQuery, useLazyGetUserDetailQuery } from '../../app/services/users';
import { backgroundColors, iniOptions } from './data';
import { useSelector } from 'react-redux';
import upArrow from '../../assets/icons/small-chart-arrow -2.svg'
import downArrow from '../../assets/icons/small-chart-arrow.svg'
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

export default function Chart({ setSubjects,YHeader, subjects, selectedSubject, selectedStudent, currentSubData, setCurrentSubData, selectedConceptIdx }) {

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
//console.log("first",{ setSubjects, subjects, selectedSubject, selectedStudent, currentSubData, setCurrentSubData, selectedConceptIdx })
   useEffect(() => {
      
      if (persona == 'student') return
      if (selectedStudent?._id === undefined || selectedStudent?._id === null) return
    
      getUserDetail({ id: selectedStudent._id })
         .then(res => {
            console.log("chart User response",res)
            if (res.error) {
               return
            }
            console.log('Resp', res.data.data.user)
            let data = res.data.data.user.chart
            if (!data) return
            let fData = data.filter(item => item.concepts.length > 0)
         
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
            setSubjects(subjects)

            subjects.forEach(sub => {
               filtered.forEach(item => {
                  if (item.subject === sub.name) {

                  }
               })
            })

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
     //  console.log('Shycurr', curr)
     let concepts =[]
      setCurrentSubData(curr)
      let currentConceptTotal = {}
      let currentConceptCorrect = {}
      for ( let cid=0;cid<curr?.concepts?.length;cid++){
     
      if(curr.concepts[cid]?.total){
         currentConceptTotal = curr.concepts[cid]?.total
      }else{
         currentConceptTotal = {}
      }
      if(curr.concepts[cid]?.correct){
         currentConceptCorrect = curr.concepts[cid]?.correct
      }else{
         currentConceptCorrect = {}
      }
     concepts=[...concepts, ...Object.keys(currentConceptTotal).map(key => {
         return key
      })]
   }
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
            },
            y:{
               ...prev.scales.y,
               title: {
                  ...prev.scales.y.title,
                
                  text:YHeader?YHeader:prev.scales.y.title.text,
            }
         },
           
      }
   }))
      const datasets = []
   
      for(let cid=0;cid<curr.concepts?.length;cid++) {
         let currentConceptTotal = {}
         let currentConceptCorrect = {}
      if (!curr.concepts[cid]?.total) return
      if(curr.concepts[cid]?.total){
         currentConceptTotal = curr.concepts[cid]?.total
      }else{
         currentConceptTotal = {}
      }
      if(curr.concepts[cid]?.correct){
         currentConceptCorrect = curr.concepts[cid]?.correct
      }else{
         currentConceptCorrect = {}
      }
      Object.keys(currentConceptTotal).forEach((totalConcept, idx) => {
         if (Object.keys(currentConceptCorrect).includes(totalConcept)) {
           // console.log("currentConceptTotal",currentConceptTotal,currentConceptCorrect,totalConcept)
            let x = (cid + 1) * 5
            let totalVal = currentConceptTotal[totalConcept]
            let getValue = currentConceptCorrect[totalConcept]
            const percent = Math.round(getValue * 100 / totalVal)
          //  console.log("vv",getValue,totalVal)
            let radius = totalVal * 2
            // console.log(totalConcept, percent);
            if (radius < 15) {
               radius = 15
            } else if (radius > 40) {
               radius = 40
            }
            radius = Math.min(radius,percent);
            datasets.push({
               label: '',
               // data: [{ x, y: percent, r: 20 }],
               data: [{ x, y: percent, r: radius }],
               backgroundColor: getColor(cid, concepts.length),
            })
         } else {
            let x = (cid + 1) * 5
            let totalVal = curr.concepts[cid].total[totalConcept]
            let getValue = 0
            let radius = totalVal * 2
            const percent = Math.round(getValue * 100 / totalVal)
            if (radius < 15) {
               radius = 15
            } else if (radius > 40) {
               radius = 40
            }
            radius = Math.min(radius,Math.floor(percent));
            datasets.push({
               label: '',
               data: [{ x, y: percent, r: radius }],
               backgroundColor: getColor(cid, concepts.length),
            })
         }

      })
   }
      setData({
         datasets: datasets
      })
   }, [selectedSubject, chartData, selectedConceptIdx])


   useEffect(() => {

   }, [currentSubData])
   // console.log('data', data)
   // console.log('currentSubData', currentSubData)
   // console.log('selectedConceptIdx', selectedConceptIdx)

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
      <div className='wrapper w-full min-w-2/3 overflow-x-auto h-[460px] pt-[80px] pl-[30px] relative'  >

         <Bubble ref={chartRef}
            options={options} data={data}
            height={200}
            width={canvasWidth}
         /> 
      <p className='absolute bottom-[18%] right-[43%]'><img src={upArrow} alt="" /></p>
      <p className='absolute bottom-[39%] right-[93%]'><img src={downArrow} alt="" /></p>
      </div>
   )
}
