import moment from "moment";

// 24 Hour DateTime Formatter
export const ServerDateTimeFormatter = (date, time) => {
  if (!date || !time) return "";
  return moment(`${date} ${time}`).format("YYYY-MM-DD HH:mm:ss");
};

// Current Date Time in 24 Hour Format
export const CurrentDateTime24HourFormat = () => {
  const currentDate = new Date();
  return moment(`${currentDate}`).format("YYYY-MM-DD HH:mm:ss");
};

// Time Formatter 24 Hour
export const TimeFormatter24Hour = (time) => {
  const currentDate = new Date();
  return moment(`${moment(currentDate).format("YYYY-MM-DD")} ${time}`).format(
    "HH:mm:ss"
  );
};
