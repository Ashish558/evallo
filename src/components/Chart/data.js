
export const iniOptions = {
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
            text: 'Subjects',
            font: {
               weight: 500,
               size: 14,
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
         max: 100,
         title: {
            display: true,
            text: 'Accuracy(%)',
            color: "#24A3D9",
            font: {
               weight: 500,
               size: 14,
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

export const backgroundColors = [
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