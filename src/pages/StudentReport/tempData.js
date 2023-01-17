export const tableData = [
   {
      questionNumber: 1,
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 2,
      Accuracy: 100,
      concept: 'Mathematics',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 3,
      Accuracy: 50,
      concept: 'Reading',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 4,
      Accuracy: 40,
      concept: 'Science',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 5,
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 6,
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 7,
      Accuracy: 10,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 8,
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 9,
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 10,
      Accuracy: 60,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 11,
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 12,
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
]
export const answerTableData = [
   {
      questionNumber: 1,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 2,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 100,
      concept: 'Mathematics',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 3,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 50,
      concept: 'Reading',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 4,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 40,
      concept: 'Science',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 5,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 6,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 7,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 10,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 8,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 9,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 10,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 60,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 11,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
   {
      questionNumber: 12,
      correctAnswer: 'A',
      studentResponse: 'B',
      Accuracy: 100,
      concept: 'Trigonometry',
      strategy: 'Backsolving',
      time: '21 sec'
   },
]

export const timeTakenSeries = [
   {
      name: 'Score',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 76, 85, 101, 98, 87, 105, 91, 114, 94, 76, 85, 101, 98, 87, 105, 91, 114, 94]
   },
]
export const ttOptions = {

   chart: {
      type: 'bar',
      events: {
         animationEnd: undefined,
         beforeMount: undefined,
         mounted: undefined,
         updated: undefined,
         mouseMove: undefined,
         mouseLeave: undefined,
         click: undefined,
         legendClick: undefined,
         markerClick: undefined,
         xAxisLabelClick: undefined,
         selection: undefined,
         dataPointSelection: undefined,
         dataPointMouseEnter: undefined,
         dataPointMouseLeave: undefined,
         beforeZoom: undefined,
         beforeResetZoom: undefined,
         zoomed: undefined,
         scrolled: undefined,
         scrolled: undefined,
      },
      toolbar: {
         show: false
      },
      fontFamily: 'Inter',
   },
   plotOptions: {
      bar: {
         // colors: ['#8E76ED', '#8ADCFF'],
         horizontal: false,
         columnWidth: '40px',
         endingShape: 'rounded',
         distributed: true,
         borderRadius: 7,
         borderRadiusApplication: 'end',
         borderRadiusWhenStacked: 'all'
      },
   },
   dataLabels: {
      enabled: false
   },
   stroke: {
      show: true,
      width: 1,
   },
   colors: ['#8E76ED', '#8ADCFF'],

   yaxis: {
      tickAmount: 5,
      labels: {
         style: {
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '16px'
         },
         formatter: function (val) {
            return val.toFixed(0);
         }
      },
   },
   xaxis: {
      categories: [''],
      group: {
         groups: [{
            title: "5",
            cols: 5
         },
         {
            title: "10",
            cols: 5
         },
         {
            title: "15",
            cols: 5
         },
         {
            title: "20",
            cols: 5
         },
         {
            title: "25",
            cols: 5
         },
         ],
         style: {
            fontSize: '16px',
            fontFamily: 'Inter',
            fontWeight: 500,
            color: '#8E76ED',
            fontFamily: undefined,
            cssClass: ''
         }
      },
      labels: {
         // show: false,
         style: {
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '16px'
         }
      },
   },
   fill: {
      opacity: 1
   },
   tooltip: {
      show: false
   },
   legend: {
      show: false
   }
}
export const accuracySeries = [
   {
      name: '',
      data: [4, 6, 8, 3, 7, 10, 9]
   }
]
export const accuracyOptions = {
   height: 200,
   chart: {
      type: 'bar',
      height: 200,
      events: {
         animationEnd: undefined,
         beforeMount: undefined,
         mounted: undefined,
         updated: undefined,
         mouseMove: undefined,
         mouseLeave: undefined,
         click: undefined,
         legendClick: undefined,
         markerClick: undefined,
         xAxisLabelClick: undefined,
         selection: undefined,
         dataPointSelection: undefined,
         dataPointMouseEnter: undefined,
         dataPointMouseLeave: undefined,
         beforeZoom: undefined,
         beforeResetZoom: undefined,
         zoomed: undefined,
         scrolled: undefined,
         scrolled: undefined,
      },
      toolbar: {
         show: false
      },
      fontFamily: 'Inter'
   },
   plotOptions: {
      bar: {
         horizontal: false,
         columnWidth: '45%',
         endingShape: 'rounded',
         borderRadius: 3,
         borderRadiusApplication: 'end',
         borderRadiusWhenStacked: 'all'
      },
   },
   dataLabels: {
      enabled: false
   },
   stroke: {
      show: true,
      width: 2,
   },
   colors: ['#8E76ED', '#8ADCFF'],
   yaxis: {
      tickAmount: 4,
      labels: {
         style: {
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '16px'
         },
         formatter: function (val) {
            return val.toFixed(0);
         },
      },
      title:{
         text: 'No of incorrect'
      }
   },
   xaxis: {
      categories: ['Algebra', 'Adv. Math', 'Geometry', 'Trigonometry', 'Statistics', 'Probability', 'Calculus'],
      labels: {
         // rotate: 0,
         style: {
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '16px'
         }
      },
   },
   fill: {
      opacity: 1
   },
   tooltip: {
      show: false
   },
   legend: {
      show: false
   }
}

   // colors: [function({ value, seriesIndex, w }) {
   //    if (value === 55) {
   //        return '#7E36AF'
   //    } else {
   //        return '#D9534F'
   //    }
   //  }, function({ value, seriesIndex, w }) {
   //    if (value === 44) {
   //        return '#7E36AF'
   //    } else {
   //        return '#D9534F'
   //    }
   //  }],