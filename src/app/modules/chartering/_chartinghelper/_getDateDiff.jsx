import { _dateFormatter } from "./_dateFormatter";

export const getDifference = (date1, date2, decimalCount) => {
  if (!date1 || !date2) return 0;

  const diff = Math.abs(new Date(date2) - new Date(date1));
  return Number(
    (diff / (1000 * 60 * 60 * 24)).toFixed(
      decimalCount === 0 || decimalCount ? decimalCount : 4
    )
  );
};

export const getTimeDifference = (date, startTime, endTime, decimalCount) => {
  if (!date || !startTime || !endTime) return 0;

  var date1 = new Date(`${date} ${startTime}`);
  var date2 = new Date(`${date} ${endTime}`);

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return _dateFormatter(result);
  }

  var diff = date2.getTime() - date1.getTime();

  if (date2.getTime() < date1.getTime()) {
    let nextDate = addDays(date, 1);
    let nextDateTime = new Date(`${nextDate} ${endTime}`);
    diff = nextDateTime.getTime() - date1.getTime();
  }
  
  return Number(
    (diff / (1000 * 60 * 60)).toFixed(
      decimalCount === 0 || decimalCount ? decimalCount : 4
    )
  );
};
