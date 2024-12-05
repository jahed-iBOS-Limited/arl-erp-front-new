// create page

// init data
export const initData = {
  // global
  viewType: "import",

  // common
  poLC: "",
  sbu: "",
  bankName: "",
  bankAccount: "",
  paymentType: "",
  amount: "",
  paymentDate: "",
  remarks: "",

  // margin & at sight payment
  marginType: "",


  // margin
  beneficiary: "",
  poValue: "",
  paymentName: "",

  // at sight payment
  lcType: "",
  margin: "",
  docValue: "",
  exchangeRate: "",

  // payment & income
  partnerType: "",
  transaction:"",
  dueDate:""
};

export const importPaymentType = [
  { value: "Duty", label: "Duty" },
  {
    value: "At sight payment",
    label: "At sight payment",
  },
  {
    value: "Margin",
    label: "Margin",
  },
];

// get po lc number
export const fetchPOLCNumber = (obj) => {
  const { getPOLCNumberData, profileData, selectedBusinessUnit, value } = obj;
  if (value?.length < 3) return [];
  getPOLCNumberData(
    `/imp/ImportCommonDDL/GetPONOLcNoforLCSummeryDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${value}`
  );
};
