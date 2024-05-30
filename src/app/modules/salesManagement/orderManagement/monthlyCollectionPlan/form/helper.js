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

export const getMonthList = () => {
  return [
    {
      collectionPlanId: 0,
      monthId: 1,
      monthName: "January",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 2,
      monthName: "February",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 3,
      monthName: "March",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 4,
      monthName: "April",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 5,
      monthName: "May",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 6,
      monthName: "June",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 7,
      monthName: "July",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 8,
      monthName: "August",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 9,
      monthName: "September",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 10,
      monthName: "October",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 11,
      monthName: "November",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
    {
      collectionPlanId: 0,
      monthId: 12,
      monthName: "December",
      budgetedSalesQnt: 0,
      budgetedSalesAmount: 0,
    },
  ];
};
