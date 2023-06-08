import { getDifference } from "../../../../chartering/_chartinghelper/_getDateDiff";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export function timestrToSec(timestr) {
  var parts = timestr.split(":");
  return parts[0] * 3600 + parts[1] * 60 + +parts[2];
}

export function pad(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return "" + num;
  }
}

export function formatTime(seconds) {
  return [
    pad(Math.floor(seconds / 3600)),
    pad(Math.floor(seconds / 60) % 60),
    pad(seconds % 60),
  ].join(":");
}

export const getDifferenceBetweenTime = (date, startTime, endTime) => {
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

const getAmount = (fromTime, toTime) => {
  if (fromTime < "06:00") {
    if (toTime <= "06:00") {
      return 25;
    } else if (toTime <= "10:00") {
      return 25 + 35;
    } else if (toTime <= "13:00") {
      return 25 + 35 + 25;
    } else if (toTime <= "15:00") {
      return 25 + 35 + 25 + 75;
    } else if (toTime <= "20:00") {
      return 25 + 35 + 25 + 75 + 25;
    } else if (toTime <= "23:59") {
      return 25 + 35 + 25 + 75 + 25 + 75;
    }
  } else if (fromTime > "06:00" && fromTime <= "10:00") {
    if (toTime <= "10:00") {
      return 35;
    } else if (toTime <= "13:00") {
      return 35 + 25;
    } else if (toTime <= "15:00") {
      return 35 + 25 + 75;
    } else if (toTime <= "20:00") {
      return 35 + 25 + 75 + 25;
    } else if (toTime <= "23:59") {
      return 35 + 25 + 75 + 25 + 75;
    }
  } else if (fromTime > "10:00" && fromTime <= "13:00") {
    if (toTime <= "13:00") {
      return 25;
    } else if (toTime <= "15:00") {
      return 25 + 75;
    } else if (toTime <= "20:00") {
      return 25 + 75 + 25;
    } else if (toTime <= "23:59") {
      return 25 + 75 + 25 + 75;
    }
  } else if (fromTime > "13:00" && fromTime <= "15:00") {
    if (toTime <= "15:00") {
      return 75;
    } else if (toTime <= "20:00") {
      return 75 + 25;
    } else if (toTime <= "23:59") {
      return 75 + 25 + 75;
    }
  } else if (fromTime > "15:00" && fromTime <= "20:00") {
    if (toTime <= "20:00") {
      return 25;
    } else if (toTime <= "23:59") {
      return 25 + 75;
    }
  } else if (fromTime > "20:00" && fromTime <= "23:59") {
    if (toTime <= "23:59") {
      return 75;
    }
  }
};

export function getBillAmount(values) {
  const fromDate = values?.fromDate;
  const toDate = values?.toDate;
  const fromTime = values?.fromTime;
  const toTime = values?.toTime;
  const diff = getDifference(fromDate, toDate);

  const iterationTime = diff === 0 ? 1 : 2;

  let finalAmount = 0;
  for (let i = 0; i < iterationTime; i++) {
    const startTime = diff > 0 && i > 0 ? "00:00" : fromTime;
    const endTime = diff > 0 && i < 1 ? "23:59" : toTime;
    finalAmount += getAmount(startTime, endTime);
  }

  if (diff > 1) {
    const daysAmount = 260 * (diff - 1);
    finalAmount += daysAmount;
  }
  return finalAmount;
}
