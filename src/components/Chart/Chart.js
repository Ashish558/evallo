import React from 'react';
import {
   Chart as ChartJS,
   LinearScale,
   PointElement,
   Tooltip,
   Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export default function Chart() {

   const data1 = [
      { x: 1, y: 1, r: 11 },
      { x: 10, y: 2, r: 11 },
      { x: 15, y: 20, r: 11 },
      { x: 20, y: 10, r: 11 },
   ]
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
               text: 'Your Title'
             }
          },
          y: {
            // grid: {
            //   display: false
            // }
            ticks: {
               stepSize: 5,
               callback: function(value, index, ticks) {
                  return '$' + value;
              }
            }
          }
      }
   };

   const data = {
      datasets: [
         {
            label: 'Red dataset',
            data: data1,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
         },
         // {
         //    label: 'Blue dataset',
         //    data: Array.from({ length: 50 }, () => ({
         //       x: 10,
         //       y: 25,
         //       r: 5,
         //    })),
         //    backgroundColor: 'rgba(53, 162, 235, 0.5)',
         // },
      ],
   };

   return <Bubble options={options} data={data} />;
}
