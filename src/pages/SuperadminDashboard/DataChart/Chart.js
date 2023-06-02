import React from "react";
import { Bubble } from "react-chartjs-2";

const BubbleChart = () => {
  // Sample data
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 1"],
    datasets: [
      {
        label: "Bubble Chart",
        data: [
          { x: 10, y: 80, r: 10 }, // Ad
          { x: 15, y: 10, r: 15 }, // Tutor
          { x: 8, y: 80, r: 8 }, // Parents
          { x: 20, y: 30, r: 25 }, // Students (Updated values)
          { x: 80, y: 18, r: 5 },
          { x: 40, y: 20, r: 10 }, // Ad
          { x: 80, y: 80, r: 15 }, // Tutor
          { x: 90, y: 25, r: 8 }, // Parents
          { x: 18, y: 30, r: 7 }, // Students (Updated values)
          { x: 52, y: 4, r: 5 },
          { x: 56, y: 80, r: 10 }, // Ad
          { x: 50, y: 1, r: 15 }, // Tutor
          { x: 8, y: 80, r: 8 }, // Parents
          { x: 40, y: 30, r: 2 }, // Students (Updated values)
          { x: 80, y: 15, r: 5 },
          { x: 10, y: 20, r: 1 }, // Ad
          { x: 5, y: 80, r: 15 }, // Tutor
          { x: 9, y: 26, r: 8 }, // Parents
          { x: 8, y: 30, r: 7 }, // Students (Updated values)
          { x: 5, y: 78, r: 5 }, // Ad (Week 1 again)
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Blue for Ad
          "rgba(255, 159, 64, 0.6)", // Orange for Tutor
          "rgba(75, 192, 192, 0.6)", // Green for Parents
          "rgba(54, 162, 235, 0.6)", // Blue for Students
          "rgba(54, 162, 235, 0.6)", // Blue for Ad (Week 1 again)
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)", // Border color for Ad
          "rgba(255, 159, 64, 1)", // Border color for Tutor
          "rgba(75, 192, 192, 1)", // Border color for Parents
          "rgba(54, 162, 235, 1)", // Border color for Students
          "rgba(54, 162, 235, 1)", // Border color for Ad (Week 1 again)
        ],
      },
      {
        label: "Bubble",
        data: [
          { x: 70, y: 80, r: 10 }, // Ad
          { x: 15, y: 10, r: 15 }, // Tutor
          { x: 8, y: 80, r: 8 }, // Parents
          { x: 100, y: 30, r: 25 }, // Students (Updated values)
          { x: 80, y: 18, r: 5 },
          { x: 40, y: 20, r: 10 }, // Ad
          { x: 80, y: 80, r: 15 }, // Tutor
          { x: 50, y: 25, r: 8 }, // Parents
          { x: 18, y: 30, r: 7 }, // Students (Updated values)
          { x: 52, y: 4, r: 5 },
          { x: 56, y: 50, r: 10 }, // Ad
          { x: 50, y: 1, r: 15 }, // Tutor
          { x: 8, y: 50, r: 8 }, // Parents
          { x: 50, y: 30, r: 2 }, // Students (Updated values)
          { x: 80, y: 15, r: 5 },
          { x: 10, y: 20, r: 1 }, // Ad
          { x: 5, y: 50, r: 15 }, // Tutor
          { x: 9, y: 50, r: 8 }, // Parents
          { x: 8, y: 30, r: 7 }, // Students (Updated values)
          { x: 5, y: 78, r: 5 }, // Ad (Week 1 again)
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Blue for Ad
          "rgba(255, 159, 64, 0.6)", // Orange for Tutor
          "rgba(75, 192, 192, 0.6)", // Green for Parents
          "rgba(54, 162, 235, 0.6)", // Blue for Students
          "rgba(54, 162, 235, 0.6)", // Blue for Ad (Week 1 again)
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)", // Border color for Ad
          "rgba(255, 159, 64, 1)", // Border color for Tutor
          "rgba(75, 192, 192, 1)", // Border color for Parents
          "rgba(54, 162, 235, 1)", // Border color for Students
          "rgba(54, 162, 235, 1)", // Border color for Ad (Week 1 again)
        ],
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        max: 100, // Set the maximum value for the y-axis
        beginAtZero: true,
        ticks: {
          stepSize: 20, // Set the interval between ticks
        },
      },
      x: {
        max: 90, // Set the maximum value for the x-axis
        beginAtZero: true,
        ticks: {
          stepSize: 20, // Set the interval between ticks
          callback: function (value, index, values) {
            const numWeeks = 4; // Total number of weeks in the cycle
            const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
            const weekIndex = index % numWeeks; // Calculate the current week index

            return weekLabels[weekIndex];
          },
        },
      },
    },
  };

  return (
    <div className="h-100vh bg-white flex justify-center items-center mt-10">
      <div className="w-full max-w-screen-lg">
        <Bubble data={data} options={options} height={300} />
      </div>
    </div>
  );
};

export default BubbleChart;
