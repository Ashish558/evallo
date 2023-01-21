import React, { useEffect } from 'react';
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

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export default function Chart({ setSubjects }) {

   const [fetchPersonalDetails, personalDetailsResp] = useLazyGetPersonalDetailQuery()
   useEffect(() => {
      fetchPersonalDetails()
         .then(res => {
            if (res.error) {
               return
            }
            // console.log('chart', res.data.data.user.chart)
            let data = res.data.data.user.chart
            let filtered = data.filter(item => !Object.keys(item.concepts.correct).includes('undefined'))
            console.log('filtered', filtered)

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
            console.log('subjects', subjects)
            setSubjects(subjects)

            subjects.forEach(sub => {
               filtered.forEach(item => {
                 if(item.subject === sub.name){
                  
                 }
               })
            })

         })
   }, [])

   const data1 = [
      { x: 1, y: 1, r: 0 },
      { x: 10, y: 2, r: 0 },
      { x: 15, y: 20, r: 0 },
      { x: 20, y: 10, r: 0 },
   ]
   const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery()

   const subjects = ['Algebra', 'Adv. Maths', 'Geometry', 'Trigonometry']
   const options = {
      scales: {
         y: {
            beginAtZero: true,
         },
         x: {
            grid: {
               display: false
            },
            title: {
               display: true,
               text: 'Subjects'
            },
            ticks: {
               stepSize: 5,
               callback: function (value, index, ticks) {
                  return subjects[index]
               }
            }
         },
         y: {
            // grid: {
            //   display: false
            // }
            title: {
               display: true,
               text: 'Accuracy'
            },
            ticks: {
               stepSize: 5,
               callback: function (value, index, ticks) {
                  return '' + value;
               }
            }
         }
      }
   };

   const data = {
      datasets: [
         {
            label: '',
            data: data1,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
         },
      ],
   };

   return <Bubble options={options} data={data} />;
}
