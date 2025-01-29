// get current pyscal year from yearDDL which format is [{value : 2020-2021, label: 2020-2021}]

export const currentPyscalYear = (yearDDL) => {
  let date = new Date();
  let cYear = date.getFullYear();
  let cMonth = date.getMonth();
  let pyscalYear = null;

  // if month greater than july , current year will be beginning and next year will be end , as like, if current year year is 2021 , then pyscal year is 2021-2022, else pyscal year is 2020-2021
  if (cMonth > 6) {
    pyscalYear = yearDDL.filter(
      (item) => item.label.split("-")[0] === `${cYear}`
    )?.[0];
  } else {
    pyscalYear = yearDDL.filter(
      (item) => item.label.split("-")[1] === `${cYear}`
    )?.[0];
  }

  return pyscalYear;
};
