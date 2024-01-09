export function getFormattedMonthYear(monthId, yearId) {
  if (!monthId || !yearId) return;
  // Creating a Date object with the given month and year
  const date = new Date(yearId, monthId - 1, 1);

  // Formatting the date to get the month abbreviation and year
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return formattedDate;
}
