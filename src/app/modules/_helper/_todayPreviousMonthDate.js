export const _todayPreviousMonthDate = () => {
  var today = new Date();
  const todayDate =
    today.getFullYear() +
    "-" +
    ("0" + today.getMonth()).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  return todayDate;
};
