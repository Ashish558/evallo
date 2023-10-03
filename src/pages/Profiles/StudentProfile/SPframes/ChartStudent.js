import React, { useEffect, useRef, useState } from 'react';
import {
   Chart as ChartJS,
   LinearScale,
   PointElement,
   Tooltip,
   Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import Arrow from '../../../../assets/icons/Score Arrow.svg'
import { useSelector } from 'react-redux';

const iniOptions = {
    scales: {
       y: {
          beginAtZero: true,
       },
       x: {
          grid: {
             display: false
          },
          title: {
             color: "#24A3D9",
             display: true,
             text: 'Concepts',
             fontFamily: 'Lexend',
             font: {
                weight: 600,
                size: 20,
              },
          },
          ticks: {
          
             stepSize: 5,
             // callback: function (value, index, ticks) {
             //    // return tempsubjects[index]
             //    return index
             // }
          }
       },
       y: {
          // grid: {
          //   display: false
          // }
          // min: 100,
        
          title: {
             display: true,
             text: 'Time Taken (second)',
             color: "#24A3D9",
             fontFamily: 'Lexend',
             font: {
                weight: 600,
                size: 20,
              },
          },
          ticks: {
             stepSize: 5,
             maxTicksLimit: 6
             // callback: function (value, index, ticks) {
             //    return '' + value;
             // }
          }
       }
    },
    layout: {
       padding: {
          top: 50
       }
   },
 
 };
 
 const backgroundColors = [
    'rgba(77, 51, 233, 0.6)',
    'rgba(218, 51, 233, 0.6)',
    'rgba(51, 233, 146, 0.6)',
    'rgba(51, 189, 233, 0.6)',
    '#F1848A',
    'rgba(255, 215, 51, 0.6)',
    'rgba(216, 52, 6, 0.6)',
    'rgba(28, 74, 53, 0.6)',
    'rgba(96, 26, 222, 0.6)',
 ]
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

export default function Chart({ score,accuracy,setSubjects, subjects, selectedSubject, selectedStudent, currentSubData, setCurrentSubData, selectedConceptIdx }) {
console.log(currentSubData,"selectedSubject")
  
   const [options, setOptions] = useState(iniOptions)
   const [chartData, setChartData] = useState([])
   const [currentConcepts, setCurrentConcepts] = useState([])
   const [canvasWidth, setCanvasWidth] = useState(500)
   const [data, setData] = useState(data1)
   const [show, setShow] = useState(true)
   const chartRef = useRef(null)
 
   const { role: persona, id } = useSelector(state => state.user)

   // const checkIfKeyExists = (concepts) => {
   //    concepts
   // }
   useEffect(()=>{
    
     setChartData(subjects)
   },[subjects])
////console.log("first",{setSubjects,chartData, subjects, selectedSubject, selectedStudent, currentSubData, setCurrentSubData, selectedConceptIdx  })

   const getColor = (idx, len) => {
      let index = idx
      if (idx > len - 1) {
         index = index % len
      }
      // //console.log(index);
      return backgroundColors[index] !== undefined ? backgroundColors[index] : backgroundColors[0]
   }
   useEffect(() => {
      if (chartData.length === 0) {
         setData({ datasets: [] })
         setCurrentSubData({})
         return
      }
      const curr = chartData.find(item => item.name === selectedSubject)
      if (curr === undefined || !curr?.name ) {
        setData({ datasets: [] })
        return
      }
     //  //console.log('Shycurr', curr)
     let concepts =curr?.concepts?[...Object.keys(curr?.concepts).map(key => {
        return key
     })]:[curr?.name]
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
     //  //console.log('concepts', concepts)
      setCurrentConcepts(concepts)
      setOptions(prev => ({
         ...prev,
         plugins: {
            tooltip: {
               callbacks: {
                  label: function (context, c, d) {
                     if(score){
                        return `  ${"Score "} : ${context.parsed.y} `
                     }
                     if(accuracy){
                        return `  ${"Accuracy "} : ${context.parsed.y} %`
                     }
                     return `  ${"Time "} : ${context.parsed.y/60} minutes`
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
               title:{
                  ...prev.scales.y.title,
                  text:accuracy?"Accuracy (%)":score?"Score":"Time Taken (seconds)"
               },
               min: 0,
               max: 100,
               ticks: {
                 // forces step size to be 50 units
                 stepSize: 20
               } 
            }
            
         },
      }))
      const datasets = []
   
    
       
         let x = (0 + 1) * 5
            let totalVal = 10
            let getValue = curr?.no_of_correct
            const percent = curr?.timeTaken?curr?.timeTaken:0
           // //console.log("chart Current",curr,getValue,totalVal)
            let radius = Math.round(getValue )        
            // //console.log(totalConcept, percent);
            if (radius < 5) {
               radius = 5
            } else if (radius > 40) {
               radius = 40
            }
          
            datasets.push({
               label: concepts[0],
               // data: [{ x, y: percent, r: 20 }],
               data: [{ x, y: percent, r: radius ,label: concepts[0]}],
               backgroundColor: getColor(0, 1),
            })
         
//console.log("first",datasets)
     
      setData({
         datasets: datasets
      })
   }, [selectedSubject, chartData, selectedConceptIdx])


   useEffect(() => {

   }, [currentSubData])
   console.log('data', data)
   // //console.log('currentSubData', currentSubData)
   // //console.log('selectedConceptIdx', selectedConceptIdx)

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
      <div className='wrapper w-full min-w-2/3 overflow-x-auto relative'  >

         <Bubble ref={chartRef}
            options={options} data={data}
            height={200}
            width={canvasWidth}
         /> 
<div className='absolute top-[36%] left-[2.5%]'><img src={Arrow} alt="" /></div>
      </div>
   )
}
