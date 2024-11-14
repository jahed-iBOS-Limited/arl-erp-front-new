export const months = [
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


export function generateMonthlyData(monthId, yearId) {
    // Get the correct number of days in the month by setting day to 0 of the following month
    const daysInMonth = new Date(yearId, monthId, 0).getDate();
    const monthData = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(yearId, monthId - 1, day); // Month index is zero-based, so subtract 1 from monthId
        const formattedDate = date.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).split("/").reverse().join("-");

        monthData.push({
            scheduleDate: formattedDate,
            quantity: 0
        });
    }

    return monthData;
}
