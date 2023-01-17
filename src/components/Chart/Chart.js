import React from 'react';
import {
   Chart as ChartJS,
   LinearScale,
   PointElement,
   Tooltip,
   Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { useLazyGetTestResponseQuery } from '../../app/services/test';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export default function Chart() {

   const data1 = [
      { x: 1, y: 1, r: 0 },
      { x: 10, y: 2, r: 0 },
      { x: 15, y: 20, r: 0 },
      { x: 20, y: 10, r: 0 },
   ]
   const [getTestResponse, getTestResponseResp] = useLazyGetTestResponseQuery()

   const subjects = [ 'Algebra', 'Adv. Maths', 'Geometry', 'Trigonometry']
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
