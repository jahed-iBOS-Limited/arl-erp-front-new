
export function addMonthsToDate(inputDate, monthsToAdd) {
  const date = new Date(inputDate);
  date.setMonth(date.getMonth() + monthsToAdd);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
