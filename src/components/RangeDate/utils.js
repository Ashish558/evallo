export function calculateDateRange(startD) {
  var startDate = startD || new Date(2022, 0, 1); 
  var endDate = new Date(); 
  var currentDate = new Date(startDate); 
  var dateRanges = [];

  while (currentDate <= endDate) {
    var rangeStart = new Date(currentDate); 
    var rangeEnd = new Date(currentDate); 

    rangeEnd.setDate(rangeStart.getDate() + 11); 
    var formattedStartDate = rangeStart.toDateString().split(" ");
    formattedStartDate =
      formattedStartDate[0] +
      " " +
      formattedStartDate[1] +
      " " +
      formattedStartDate[2];
    formattedStartDate = rangeStart.toDateString();
    if (endDate < rangeEnd) {
      rangeEnd = endDate; 
      dateRanges.unshift(formattedStartDate + " - " + rangeEnd.toDateString());
      break;
    }

    dateRanges.unshift(formattedStartDate + " - " + rangeEnd.toDateString());

    currentDate.setDate(rangeEnd.getDate() + 1); 
  }
  return dateRanges.slice(0,100);
 
}

export const getModifiedDate = (date) => {
  let startDate = new Date(date.sDate).toDateString()
  let endDate = new Date(date.eDate).toDateString()
  return startDate + " - " + endDate;

}