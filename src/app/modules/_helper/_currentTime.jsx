import moment from "moment";
import { _timeFormatter } from "./_timeFormatter";

export const _currentTime = () => {
  const today = new Date();
  const h = today.getHours() < 9 ? `0${today.getHours()}` : today.getHours();
  const m = `${today.getMinutes()}`.padStart(2, "0");
  const s = `${today.getSeconds()}`.padStart(2, "0");
  return h + ":" + m + ":" + s;
};

export const _todaysStartTime = () => {
  const start = _timeFormatter(moment().startOf("day"));
  return start.split(" ")[4];
};

export const _todaysEndTime = () => {
  const end = _timeFormatter(moment().endOf("day"));
  return end.split(" ")[4];
};

// currentTime in 12 hour format with AM/PM
export const _currentTime12hour = () => {
  const today = new Date();
  const h = today.getHours() < 9 ? `0${today.getHours()}` : today.getHours();
  const m = `${today.getMinutes()}`.padStart(2, "0");
  const s = `${today.getSeconds()}`.padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  return h + ":" + m + ":" + s + " " + ampm;
};
