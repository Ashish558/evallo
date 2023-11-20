import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale,
  Tooltip,
  Legend
  // {
  //   id: 'uniqueid5', //typescript crashes without id
  //   afterDraw: function (chart, easing) {
  //     if (chart.tooltip._active && chart.tooltip._active.length) {
  //       const activePoint = chart.tooltip._active[0];
  //       const ctx = chart.ctx;
  //       const x = activePoint.element.x;
  //       const topY = chart.scales.y.top;
  //       const bottomY = chart.scales.y.bottom;
  //       ctx.save();
  //       ctx.beginPath();
  //       ctx.moveTo(x, topY);
  //       ctx.lineTo(x, bottomY);
  //       ctx.lineWidth = 1;
  //       ctx.strokeStyle = '#e23fa9';
  //       ctx.stroke();
  //       ctx.restore();
  //     }
  //   }
  // }
);

const iniOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      grid: {
        display: false,
      },
      title: {
        color: "#24A3D9",
        display: true,
        text: "Assignments",
        fontFamily: "Lexend",
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
      },
    },
    y: {
      // grid: {
      //   display: false
      // }
      // min: 100,

      title: {
        display: true,
        text: "Scores",
        color: "#24A3D9",
        fontFamily: "Lexend",
        font: {
          weight: 600,
          size: 20,
        },
      },
      ticks: {
        stepSize: 5,
        maxTicksLimit: 6,
        // callback: function (value, index, ticks) {
        //    return '' + value;
        // }
      },
    },
  },
  elements: {
    line: {
      tension: 0.8, // smooth lines
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "center",

      labels: {
        usePointStyle: true,
        font: {
          size: 12,
          family: "Arial",
        },
        marginBottom: 10,
        labelSpacing: 100,
        boxWidth: 80,

        pointStyle: "circle",

        radius: 7,
      },
    },
  },
  layout: {
    padding: {
      top: 50,
    },
  },
};

const backgroundColors = [
  "rgba(77, 51, 233, 0.6)",
  "rgba(218, 51, 233, 0.6)",
  "rgba(51, 233, 146, 0.6)",
  "rgba(51, 189, 233, 0.6)",
  "#F1848A",
  "rgba(192, 36, 89, 0.6)",
  "rgba(12, 163, 46, 0.6)",
  "rgba(31, 123, 240, 0.6)",
  "rgba(55, 97, 234, 0.6)",
  "rgba(234, 98, 15, 0.6)",
  "rgba(17, 185, 79, 0.6)",
  "rgba(84, 202, 27, 0.6)",
  "rgba(85, 172, 14, 0.6)",
  "rgba(43, 175, 52, 0.6)",
  "rgba(19, 82, 221, 0.6)",
  "rgba(255, 215, 51, 0.6)",
  "rgba(216, 52, 6, 0.6)",
  "rgba(28, 74, 53, 0.6)",
  "rgba(96, 26, 222, 0.6)",
  "rgba(96, 26, 222, 0.6)",
  "rgba(96, 26, 222, 0.6)",
];
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const tempdata = [{ x: 5, y: 100, r: 0 }];
const dummy = {
  label: "",
  data: [{ x: 0, y: 0, r: 0 }],
  backgroundColor: "rgba(255, 99, 132, 0)",
};

const data1 = {
  datasets: [
    { ...dummy },
    {
      label: "",
      data: tempdata,
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export default function Chart({ scoreProgression }) {
  const [options, setOptions] = useState(iniOptions);
  const [chartData, setChartData] = useState([]);
  const [currentConcepts, setCurrentConcepts] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [data, setData] = useState(data1);
  const [show, setShow] = useState(true);
  const chartRef = useRef(null);

  const { role: persona, id } = useSelector((state) => state.user);

  // const checkIfKeyExists = (concepts) => {
  //    concepts
  // }
  console.log("line chart", scoreProgression);
  useEffect(() => {
    if (scoreProgression) {
      setChartData(scoreProgression);
    }
  }, [scoreProgression]);

  const getColor = (idx, len) => {
    let index = idx;
    if (idx > backgroundColors?.length) {
      index = index % len;
    }
    // //console.log(index);
    return backgroundColors[index] !== undefined
      ? backgroundColors[index]
      : backgroundColors[0];
  };
  useEffect(() => {
    if (chartData.length === 0) {
      setData({ datasets: [] });

      return;
    }
    const datasets = [];
    let dates = [];

    const labels = [""];
    console.log({ chartData });
    let checkIfKeyExists = {};
    for (let cid = 0; cid < chartData?.length; cid++) {
      const score = [
        ...Object.keys(chartData[cid]?.score).map((key) => {
          return key;
        }),
      ];
      const subjects = chartData[cid]?.subjects;
      const concepts = [];
      for (let sid = 0; sid < subjects?.length; sid++) {
        concepts.push(subjects[sid].name);
      }
      const testName = chartData[cid]?.testName;
      const date = new Date(chartData[cid]?.date).toDateString();

      //  //console.log('concepts', concepts)

      labels.push(`${testName}`);

      dates.push(date);

      for (let sid = 0; sid < subjects?.length; sid++) {
        const x = testName;
        const scale = subjects[sid]?.scoreScale;
        const y = chartData[cid].score[scale];
        if (!checkIfKeyExists.hasOwnProperty(subjects[sid]?.name)) {
          datasets.push({
            label: concepts[sid],
            fill: false,
            borderColor: getColor(sid, subjects?.length),
            data: [
              { x: 0, y: 0, r: 0, label: concepts[sid] },
              { x, y, r: subjects[sid]?.no_of_correct, label: concepts[sid] },
            ],
            backgroundColor: getColor(sid, subjects?.length),
          });
          checkIfKeyExists[subjects[sid]?.name] = datasets?.length - 1;
        } else {
          let iddd = checkIfKeyExists[subjects[sid]?.name];
          datasets[iddd] = {
            ...datasets[iddd],
            data: [
              ...datasets[iddd]?.data,
              { x, y, r: subjects[sid]?.no_of_correct, label: concepts[sid] },
            ],
          };
        }
      }
    }

    setData({
      labels,
      datasets: datasets,
    });
    setOptions((prev) => {
      return {
        ...prev,
        plugins: {
          ...prev.plugins,
          tooltip: {
            ...prev.plugins.tooltip,
            callbacks: {
              label: function (context, c, d) {
                return `  ${"Time "} : ${context.parsed.y / 60} minutes`;
              },
            },
          },
        },
        scales: {
          ...prev.scales,
          x: {
            ...prev.scales.x,
            ticks: {
              ...prev.scales.x.ticks,

              callback: function (value, index, ticks) {
                const value2 = `${labels[index]}|${dates[index]}`;
                const lines = value2?.split("|");
                return index === 0 ? "" : lines.join("\n");
                return index === 0 ? "" : `${labels[index]} \n ${dates[index]}`;
              },
            },
            font: {
              size: 12, // Adjust the font size as needed
            },
          },
        },
      };
    });
  }, [chartData]);
  console.log("linnnnnnnn", data);
  return (
    data !== undefined && (
      <div className="wrapper w-full min-w-2/3 overflow-x-auto">
        <Line
          ref={chartRef}
          options={options}
          data={data}
          height={200}
          width={canvasWidth}
        />{" "}
      </div>
    )
  );
}
