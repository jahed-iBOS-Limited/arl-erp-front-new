export const dateFormatterForInput = (param) => {
  const date = new Date(param);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return [year, month, day].join("-") || "";
};

export const convertTimeIntoDecimal = (time) => {
  let timeArray = time.split(":");
  let hour = timeArray[0];
  let minute = timeArray[1];
  let second = timeArray[2];

  let totalSecond = parseInt(hour) * 60 * 60 + parseInt(minute) * 60 + parseInt(second);
  let totalMinute = totalSecond / 60;
  let totalHour = totalMinute / 60;

  return totalHour.toFixed(2);
};

export const convertDecimalToTime = (decimalHours) => {
  var hours = Math.floor(decimalHours);
  var minutes = Math.floor((decimalHours - hours) * 60);
  var seconds = Math.floor(((decimalHours - hours) * 60 - minutes) * 60);
  return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
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
