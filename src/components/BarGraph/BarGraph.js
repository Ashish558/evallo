import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'

export default function BarGraph({ series, options, height }) {

   
console.log("value", series)
   return (
      
      <div>
         <ReactApexChart options={options}
            height={height ? height : '700px'}
            series={series}
            type='bar'
            width='100%'
           />
      </div>
   )
}
