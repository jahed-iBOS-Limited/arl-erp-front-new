export const dateFormatterForInput = (param) => {
  const date = new Date(param);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return [year, month, day].join("-") || "";
};

export const getDifferenceBetweenTime = (date, startTime, endTime) => {
  var date1 = new Date(`${date} ${startTime}`);
  var date2 = new Date(`${date} ${endTime}`);

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return dateFormatterForInput(result);
  }

  // console.log(addDays(date, 1));

  var diff = date2.getTime() - date1.getTime();

  if (date2.getTime() < date1.getTime()) {
    let nextDate = addDays(date, 1);
    let nextDateTime = new Date(`${nextDate} ${endTime}`);
    diff = nextDateTime.getTime() - date1.getTime();
  }

  var msec = diff;
  var hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  var mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  var ss = Math.floor(msec / 1000);
  msec -= ss * 1000;

  if (hh < 10) {
    hh = `0${hh}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  if (ss < 10) {
    ss = `0${ss}`;
  }

  let difference = `${hh}:${mm}:${ss}`;

  return difference;
};
