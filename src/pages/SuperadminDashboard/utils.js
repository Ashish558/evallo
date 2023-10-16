export function groupDatesIntoWeeks(dates) {
  const sortedDates = dates.sort((a, b) => new Date(a.date) - new Date(b.date));
  const weeks = [];
  let currentWeek = [];
  let stDate = new Date(sortedDates[0].date);

  let tot = 0;
  let pw = 0;
  let limit = 1;
  sortedDates.forEach((date) => {
    const diffInDays = (new Date(date.date) - stDate) / (1000 * 60 * 60 * 24);
    if (parseInt(diffInDays / limit) === pw) {
      currentWeek.push(date);
      tot += Math.abs(date.totalHours);
    } else {
      weeks.push({ data: currentWeek, week: pw + 1, hours: tot });
      tot = 0;
      pw = parseInt(diffInDays / limit);
      currentWeek = [date];
      tot = Math.abs(date.totalHours);
    }

  });

  if (currentWeek.length > 0) {
    weeks.push({ data: currentWeek, week: pw + 1, hours: tot });
  }

  return weeks;
}

export function convertToChart(dates, userData) {
  if (!dates || !userData || dates?.length === 0 || userData?.length === 0) return []
  let labels = [];
  let mxLabel = 0;


  let adminData = [];
  let tutorData = [];
  let parentData = [];
  let studentData = [];

  let labelData = JSON.parse(JSON.stringify(userData))
  if (labelData?.length > 0)
    labelData = []
  console.log("dailyactivity label",{ labelData },dates["admin"])
  dates["admin"]?.map((it) => {
    mxLabel = Math.max(mxLabel, it.week);
    adminData.push({ x:it?.data[0]?.date, y: it.hours, r: it.data.length * 2 <= 20 ? it.data.length * 2 : 20, label: ("Date: "+ new Date( it?.data[0]?.date).toDateString() ) });
    labelData.push({admin:new Date(it?.data[0]?.date)})
    
  });
  dates["tutor"]?.map((it) => {
    mxLabel = Math.max(mxLabel, it.week);
    tutorData.push({ x:it?.data[0]?.date, y: it.hours, r: it.data.length * 2 <= 20 ? it.data.length * 2 : 20, label: ("Date: "+ new Date( it?.data[0]?.date).toDateString() ) });
    labelData.push({tutor:new Date(it?.data[0]?.date)})
  });
  dates["parent"]?.map((it) => {
    mxLabel = Math.max(mxLabel, it.week);
    parentData.push({ x:it?.data[0]?.date, y: it.hours, r: it.data.length * 2 <= 20 ? it.data.length * 2 : 20, label: ("Date: "+ new Date( it?.data[0]?.date).toDateString() ) });
    labelData.push({parent:new Date(it?.data[0]?.date)})
  });
  dates["student"]?.map((it) => {
    mxLabel = Math.max(mxLabel, it.week);
    studentData.push({ x:it?.data[0]?.date, y: it.hours, r: it.data.length * 2 <= 20 ? it.data.length * 2 : 20, label: ("Date: "+ new Date( it?.data[0]?.date).toDateString() ) });
    labelData.push({student:new Date(it?.data[0]?.date)})
  });
  mxLabel = userData.length
  labelData?.sort((a,b) =>{
    return new Date(a)-new Date(b);})
  for (let i = 0; i < labelData.length; i++)
  labels.push(labelData[i]);
    //labels.push(new Date(labelData[i]?.data[0]?.datetime).toDateString());
   
  let result = {
  
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
        label: "Parents",
        data: parentData,
        backgroundColor: "#24FF00",
      },
      {
        label: "Students",
        data: studentData,
        backgroundColor: "#26435F",
      },
    ],
  };
  return result;
}

export const convertDate = (date) => {
  let date1 = new Date(date);

};

export const convertDateToRange = (startDate) => {
  let startD = startDate.split("-")[0];

  startD = new Date(startD);
  startD = startD.setDate(startD.getDate() + 1);
  startD = new Date(startD).toISOString().split("T")[0];

  let endD = startDate.split("-")[1];
  endD = new Date(endD);
  endD = endD.setDate(endD.getDate() + 1);
  endD = new Date(endD).toISOString().split("T")[0];
  const body = { startDate: startD, endDate: endD };

  return body;
};
export function groupDatesIntoWeeks2(dates) {
  const sortedDates = dates.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  const weeks = [];
  let currentWeek = [];
  let stDate = new Date(sortedDates[0].datetime);

  let tot = 0;
  let pw = 0;
  let limit = 1;
  sortedDates.forEach((date) => {
    const diffInDays = (new Date(date.datetime) - stDate) / (1000 * 60 * 60 * 24);
    if (parseInt(diffInDays / limit) === pw) {
      currentWeek.push(date);
      tot += Math.abs(date.totalHours);
    } else {
      weeks.push({ data: currentWeek, week: pw + 1, hours: tot });
      tot = 0;
      pw = parseInt(diffInDays / limit);
      currentWeek = [date];
      tot = Math.abs(date.totalHours);
    }

  });

  if (currentWeek.length > 0) {
    weeks.push({ data: currentWeek, week: pw + 1, hours: tot });
  }

  return weeks;
}
