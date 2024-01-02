export function modifyDataset(originalDataset) {
  // Map through the array of objects and apply the modification for each object
  const modifiedDataset = originalDataset.map((originalObject) => {
    // Extract relevant information from each original object
    const { ...allFields } = originalObject;

    // Separate date values from other fields
    const { dates, nonDateFields } = Object.entries(allFields).reduce(
      (acc, [key, value]) => {
        // Check if the key is a date string
        const isDateKey = !isNaN(Date.parse(key));

        if (isDateKey) {
          acc.dates[key] = value;
        } else {
          acc.nonDateFields[key] = value;
        }
        return acc;
      },
      { dates: {}, nonDateFields: {} }
    );

    // Transform date values into the desired format
    const modifiedDates = Object.entries(dates).map(([date, value]) => ({
      key: date,
      value,
    }));

    // Create the modified object
    const modifiedObject = {
      ...nonDateFields,
      dates: modifiedDates,
    };

    return modifiedObject;
  });

  return modifiedDataset;
}

export function getLastDateOfMonth(inputDate) {
  if (!inputDate) return;
  const [year, month] = inputDate.split("-").map(Number);

  // Create a new Date object for the first day of the next month
  const nextMonthFirstDay = new Date(year, month, 1);

  // Subtract one day to get the last day of the current month
  const lastDateOfMonth = new Date(nextMonthFirstDay - 1);

  // Format the date as "YYYY-MM-DD"
  const formattedDate = lastDateOfMonth?.toISOString()?.split("T")[0];

  return formattedDate;
}
