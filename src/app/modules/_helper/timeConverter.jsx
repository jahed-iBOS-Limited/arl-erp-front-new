export const ConvertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

export const ConvertTime24to12 = (time24h) => {
  let [hours, minutes] = time24h.split(":");
  let modifier = "AM";

  if (+hours >= 12) {
    modifier = "PM";
  }

  hours = +hours % 12;

  if (+hours === 0) {
    hours = 12;
  }

  return `${hours}:${minutes} ${modifier}`;
};
