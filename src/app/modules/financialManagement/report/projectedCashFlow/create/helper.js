// create page

// init data
export const initData = {
  viewType: "import",
  paymentName: "",
  paymentNameDDL: "",
  amount: "",
  date: "",
  fromDate: "",
  toDate: "",
  poLc: "",
  shipment: "",
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
