export function formatMonthYear(dateStr) {
  // Check if the date string is null or undefined
  if (!dateStr) {
    return "";
  }

  // Parse the input date string
  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  // Define an array of month names
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the month and year from the date object
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Return the formatted date string
  return `${month}-${year}`;
}
