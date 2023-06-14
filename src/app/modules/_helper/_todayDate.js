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
