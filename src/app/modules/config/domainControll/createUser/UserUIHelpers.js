export const UserStatusCssClasses = ["success", "info", ""];
export const UserStatusTitles = ["Selling", "Sold"];
export const UserConditionCssClasses = ["success", "danger", ""];
export const UserConditionTitles = ["New", "Used"];
export const defaultSorted = [{ dataField: "userId", order: "desc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "5", value: 5 },
  { text: "10", value: 10 }
];
export const initialFilter = {
  filter: {
    userId: "",
    manufacture: "",
    VINCode: ""
  },
  sortOrder: "asc", // asc||desc
  sortField: "userId",
  pageNumber: 1,
  pageSize: 10
};
export const AVAILABLE_COLORS = [
  "Red",
  "CadetBlue",
  "Eagle",
  "Gold",
  "LightSlateGrey",
  "RoyalBlue",
  "Crimson",
  "Blue",
  "Sienna",
  "Indigo",
  "Green",
  "Violet",
  "GoldenRod",
  "OrangeRed",
  "Khaki",
  "Teal",
  "Purple",
  "Orange",
  "Pink",
  "Black",
  "DarkTurquoise"
];

export const AVAILABLE_MANUFACTURES = [
  "Pontiac",
  "Kia",
  "Lotus",
  "Subaru",
  "Jeep",
  "Isuzu",
  "Mitsubishi",
  "Oldsmobile",
  "Chevrolet",
  "Chrysler",
  "Audi",
  "Suzuki",
  "GMC",
  "Cadillac",
  "Infinity",
  "Mercury",
  "Dodge",
  "Ram",
  "Lexus",
  "Lamborghini",
  "Honda",
  "Nissan",
  "Ford",
  "Hyundai",
  "Saab",
  "Toyota"
];
