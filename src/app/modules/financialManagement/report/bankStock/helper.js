export const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export function getLastDateOfMonth(month) {
  // Ensure the month is between 1 and 12
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }

  // Create a new Date object for the first day of the next month
  let nextMonth = new Date(new Date().getFullYear(), month, 1);
  // Subtract one day to get the last day of the desired month
  let lastDate = new Date(nextMonth - 1);

  // Extract year, month, and day
  let year = lastDate.getFullYear();
  let lastMonth = lastDate.getMonth() + 1; // Months are zero-based
  let day = lastDate.getDate();

  // Return the formatted date as a string
  return `${year}-${String(lastMonth).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}
