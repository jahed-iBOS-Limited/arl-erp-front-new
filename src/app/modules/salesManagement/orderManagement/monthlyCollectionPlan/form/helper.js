export function generateDataset(monthId, yearId, holidays = []) {
  // Calculate the number of days in the given month
  const daysInMonth = new Date(yearId, monthId, 0).getDate();
  const dataset = [];

  for (let day = 2; day <= daysInMonth + 1; day++) {
    const date = new Date(yearId, monthId - 1, day);
    const formatDate = date.toISOString().split("T")[0];
    const dayName = getDayName(formatDate);

    dataset.push({
      sl: day,
      date: formatDate, // Format the date as 'YYYY-MM-DD'
      dayName: dayName,
      isHoliday: holidays.includes(dayName),
      targetAmount: 0,
    });
  }

  return dataset;
}

function getDayName(dateStr) {
  // Create a Date object from the provided date string
  const date = new Date(dateStr);

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = date.getDay();

  // Use an array to map dayOfWeek values to day names
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Return the day name using the mapped index
  return dayNames[dayOfWeek];
}
