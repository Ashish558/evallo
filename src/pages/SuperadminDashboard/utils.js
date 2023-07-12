export function groupDatesIntoWeeks(dates) {
  const sortedDates = dates.sort((a, b) => new Date(a.date) - new Date(b.date));
  const weeks = [];
  let currentWeek = [];
  let stDate = new Date(sortedDates[0].date);
  // console.log(sortedDates)
  let tot = 0;
  let pw = 0;
  sortedDates.forEach((date) => {
    const diffInDays = (new Date(date.date) - stDate) / (1000 * 60 * 60 * 24);
    if (parseInt(diffInDays / 7) === pw) {
      currentWeek.push(date);
      tot += Math.abs(date.totalHours);
    } else {
      weeks.push({ data: currentWeek, week: pw + 1, hours: tot });
      tot = 0;
      pw = parseInt(diffInDays / 7);
      currentWeek = [date];
      tot = Math.abs(date.totalHours);
    }
    //  console.log(date,diffInDays)
  });

  if (currentWeek.length > 0) {
    weeks.push({ data: currentWeek, week: pw + 1, hours: tot });
  }
  // console.log('shy',currentWeek,weeks);
  return weeks;
}

export function convertToChart(dates) {
  let labels = [];
  let mxLabel=0;
  
  //for (let i = 0; i < dates.length; i++) labels.push("Week " + i + 1);
  // console.log(dates['admin'])
  let adminData = [];
  let tutorData = [];
  let parentData = [];
  dates["admin"]?.map((it) => {
    mxLabel=Math.max(mxLabel,it.week);
    adminData.push({ x: it.week, y: it.hours, r: it.data.length ,label:("week "+ it.week) });
  });
  dates["tutors"]?.map((it) => {
    mxLabel=Math.max(mxLabel,it.week);
    tutorData.push({ x: it.week, y: it.hours, r: it.data.length, label:("week "+ it.week)});
  });
  dates["parent"]?.map((it) => {
    mxLabel=Math.max(mxLabel,it.week);
    parentData.push({ x: it.week, y: it.hours, r: it.data.length, label:("week "+ it.week) });
  });
 for (let i = 0; i < mxLabel; i++) 
 labels.push("Week " + (i + 1));
  let result = {
    labels: labels,
    datasets: [
      {
        label: "Admin",
        data: adminData,
        backgroundColor: ["#26435F"],
      },
      {
        label: "Tutor",
        data: tutorData,
        backgroundColor: "#FF7714",
      },
      {
        label: "Parent",
        data: parentData,
        backgroundColor: "#24FF00",
      },
    ],
  };
  return result;
}

export const convertDate = (date) => {
  let date1 = new Date(date);
  //date1.get
};
