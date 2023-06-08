export const getPrevThreeMonth = (prev = 0) => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let monthIndex = new Date().getMonth();

  if (prev === 1) {
    if (monthIndex === 0) {
      return month[11];
    } else {
      return month[monthIndex - prev];
    }
  }

  if (prev === 2) {
    if (monthIndex === 0) {
      return month[10];
    } else if (monthIndex === 1) {
      return month[11];
    } else {
      return month[monthIndex - prev];
    }
  }

  if (prev === 3) {
    if (monthIndex === 0) {
      return month[9];
    } else if (monthIndex === 1) {
      return month[10];
    } else if (monthIndex === 2) {
      return month[11];
    } else {
      return month[monthIndex - prev];
    }
  }

  if (prev === 0) {
    let name = month[monthIndex];
    return name;
  }
};
