import React from 'react'
import ReactApexChart from 'react-apexcharts'
 
function BarGraph({ series, options, height, width }) {
 
   return (

      <div>
         <ReactApexChart options={options}
            height={height ? height : '700px'}
            series={series}
            type='bar'
            width={width ? width : '100%'}
         />
      </div>
   )
}

export default BarGraph;