export const _todayDate = () => {
  var today = new Date();
  const todayDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  return todayDate;
};

export const _firstDateOfMonth = () => {
  var today = new Date();
  const firstDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-01";
  return firstDate;
};

export const _lastDateOfMonth = (dateString) => {
  if (!dateString) return "";

  // Parse the input date
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  // Create a new date object for the first day of the next month
  const nextMonth = new Date(year, month, 1);

  // Subtract 1 day to get the last day of the given month
  const lastDay = new Date(nextMonth - 1);

  // Format the last day to 'YYYY-MM-DD'
  const lastDate =
    lastDay.getFullYear() +
    "-" +
    ("0" + (lastDay.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + lastDay.getDate()).slice(-2);

  return lastDate;
};

export const _previousDate = (prevDays = 30) => {
  var today = new Date();
  today.setDate(today.getDate() - prevDays); // Subtract the number of days passed as prevDays
  const previousDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  return previousDate;
};

export const _lastDateOfMonthPreviousYear = (dateString) => {
  if(!dateString) return "";
  const date = new Date(dateString);
  const previousYear = date.getFullYear() - 1;
  const month = date.getMonth() + 1;

  // Create a new date object for the first day of the next month in the previous year
  const nextMonthPreviousYear = new Date(previousYear, month, 1);

  // Subtract 1 day to get the last day of the same month in the previous year
  const lastDayPreviousYear = new Date(nextMonthPreviousYear - 1);

  const lastDatePreviousYear =
    lastDayPreviousYear.getFullYear() +
    "-" +
    ("0" + (lastDayPreviousYear.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + lastDayPreviousYear.getDate()).slice(-2);

  return lastDatePreviousYear;
};



// date 3 month ago
export const _threeMonthAgoDate = () => {
  var today = new Date();
  const todayDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() - 2)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  return todayDate;
};

// date 1 month later. note: if fromDate is given, then it will return 3 month later date from fromDate else it will return 3 month later date from today
export const _oneMonthLater = (fromDate) => {
  var today = new Date();
  if (fromDate) {
    today = new Date(fromDate);
  }
  const todayDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 2)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  return todayDate;
}

export const _todayDateTime12HFormet = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const _getCurrentMonthYearForInput = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

export const _getPreviousDate=()=> {
  const today = new Date();
  const previousDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const day = ('0' + previousDate.getDate()).slice(-2);
  const month = ('0' + (previousDate.getMonth() + 1)).slice(-2); 
  const year = previousDate.getFullYear();
  return `${year}-${month}-${day}`
}
