import { _todayDate } from "../../../../_helper/_todayDate";

// export const isIBBLZakat = ({values}) => {
//   if (
//     values?.bankAccountNo?.bankId === 23 &&
//     values?.adviceType?.value === 15 &&
//     values?.advice?.value === 1
//   )
//     return true;
//   return false;
// };


export const initData = {
  dateTime: _todayDate(),
  businessUnit: "",
  bankAccountNo: "",
  adviceType: "",
  mandatory: "",
  advice: "",
  voucherPosting: "",
};

export const adviceTypeDDL = [
  { value: 2, label: "Party Payment" },
  { value: 3, label: "Party Advance" },
  { value: 4, label: "Advance For Internal Expense" },
  { value: 5, label: "Internal Expense" },
  { value: 6, label: "Salary Advice" },
];

export const mandatoryDDL = [
  { value: 1, label: "Yes", info: true },
  { value: 2, label: "No", info: false },
];

export const _adviceDDL = [
  { value: 1, label: "IBBL", info: "ibbl" },
  { value: 2, label: "IBBL-BEFTN", info: "ibblBEFTN" },
  { value: 3, label: "SCB", info: "scb" },
  { value: 4, label: "JAMUNA-BEFTN", info: "jamunaBEFTN" },
  { value: 8, label: "PRIME", info: "prime" },
  { value: 9, label: "PRIME-BEFTN", info: "primeBEFTN" },
];

export const voucherPostingDDL = [
  { value: 1, label: "All" },
  { value: 2, label: "Complete" },
  { value: 3, label: "Not Complete" },
];

export const pageStyle = `
margin-top: 50px;
margin-bottom: 50px;
`;
