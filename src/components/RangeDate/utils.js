export function calculateDateRange(startD) {
  var currentDate = new Date(); // Current date
  var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the current month
  var dateRanges = [];

  var rangeStart = new Date(startDate); // Start of the range
  var rangeEnd = new Date(currentDate); // End of the range

  dateRanges.push(formatDate(rangeStart) + " - " + formatDate(rangeEnd));
  return dateRanges.slice(0,100);
 
}

export const getModifiedDate = (date) => {
  let startDate = new Date(date.sDate).toDateString()
  let endDate = new Date(date.eDate).toDateString()
  return startDate + " - " + endDate;

}



function formatDate(date) {
  var options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}
