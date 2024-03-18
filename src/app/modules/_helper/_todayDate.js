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
