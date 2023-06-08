export const yearDDLList = (countYear) => {
  const yearArr = [];
  for (let i = 0; i < countYear; i++) {
    yearArr.push({
      value: new Date().getFullYear() + i,
      label: "" + (new Date().getFullYear() + i),
    });
  }

  return yearArr;
};
