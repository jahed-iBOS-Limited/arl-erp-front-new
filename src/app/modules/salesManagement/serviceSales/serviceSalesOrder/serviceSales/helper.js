export function addMonthsToDate(inputDate, monthsToAdd) {
  const date = new Date(inputDate);
  date.setMonth(date.getMonth() + monthsToAdd);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function calculateMonthDifference(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 0;
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const monthsApart =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  return Math.abs(monthsApart); // Use Math.abs to get the absolute difference
}
