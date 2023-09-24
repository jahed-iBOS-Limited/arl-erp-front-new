export const _firstDateOfCurrentFiscalYear = () => {
  const today = new Date();
  const fiscalYearStartMonth = 7; // Assuming the fiscal year starts in July (adjust as needed)
  const currentYear =
    today.getMonth() + 1 < fiscalYearStartMonth
      ? today.getFullYear() - 1 // Fiscal year starts in the previous year
      : today.getFullYear(); // Fiscal year starts in the current year

  // Create a new Date object for the first day of the fiscal year
  const fiscalYearStartDate = new Date(
    currentYear,
    fiscalYearStartMonth - 1,
    1
  );

  // Format the date as "yyyy-mm-dd"
  const formattedStartDate = `${fiscalYearStartDate.getFullYear()}-${(
    fiscalYearStartDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${fiscalYearStartDate
    .getDate()
    .toString()
    .padStart(2, "0")}`;

  return formattedStartDate;
};
