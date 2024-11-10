export const currentMonthInitData = (date) => {
  let month = new Date(date).getMonth();
  let option = "";
  switch (month) {
    case 0:
      option = { value: "01", label: "January" };
      break;
    case 1:
      option = { value: "02", label: "February" };
      break;
    case 2:
      option = { value: "03", label: "March" };
      break;
    case 3:
      option = { value: "04", label: "April" };
      break;
    case 4:
      option = { value: "05", label: "May" };
      break;
    case 5:
      option = { value: "06", label: "June" };
      break;
    case 6:
      option = { value: "07", label: "July" };
      break;
    case 7:
      option = { value: "08", label: "August" };
      break;
    case 8:
      option = { value: "09", label: "September" };
      break;
    case 9:
      option = { value: "10", label: "October" };
      break;
    case 10:
      option = { value: "11", label: "November" };
      break;
    case 11:
      option = { value: "12", label: "December" };
      break;
    default:
      option = "";
  }
  return option;
};
