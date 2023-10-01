export function calculateDateRange(startD) {
  var currentDate = new Date(); // Current date
  var startDate = new Date(2023, 0, 1); // Start of the current month
  var dateRanges = [];

  var rangeStart = new Date(startDate); // Start of the range
  var rangeEnd = new Date(currentDate); // End of the range
   let ndate={
    sDate:rangeStart,
    eDate:rangeEnd
   }
  dateRanges.push(getModifiedDate(ndate));
  return dateRanges.slice(0,100);
 
}

export const getModifiedDate = (date) => {
 
  let startDate = new Date(date.sDate).toDateString().split(' ')
  startDate = startDate[2]+' '+startDate[1]+ ' '+startDate[3]
  let endDate = new Date(date.eDate).toDateString().split(' ')
  endDate = endDate[1]+' '+endDate[2]+ ' '+endDate[3]
  return startDate + " - " + endDate;

}



function formatDate(date) {
  var options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}
