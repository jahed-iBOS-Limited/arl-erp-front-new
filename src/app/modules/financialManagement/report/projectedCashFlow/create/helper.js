import axios from "axios";
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
  transaction: "",
  dueDate: "",
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

export const marginTypeDDL = [
  { value: 1, label: "Cash Margin" },
  { value: 2, label: "Fdr Margin" },
];

// get po lc number
export const fetchPOLCNumber = (obj) => {
  const { profileData, values, value } = obj;
  if (value?.length < 3) return [];
  return axios
    .get(
      `/imp/ImportCommonDDL/GetPONOLcNoforLCSummeryDDL?accountId=${profileData?.accountId}&businessUnitId=${values?.sbu?.value}&searchTerm=${value}`
    )
    .then((res) => {
      return res?.data;
    })
    .catch((err) => []);
};

export const fetchTransactionList = (obj) => {
  const { v, profileData, values } = obj;
  console.log(values);
 
  if (v?.length < 3) return [];
  return axios
    .get(
      `/partner/BusinessPartnerPurchaseInfo/GetTransactionByTypeSearchDDL?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${values?.sbu?.value ||
        0}&Search=${v}&PartnerTypeName=${""}&RefferanceTypeId=${values
        ?.partnerType?.value || 0}`
    )
    .then((res) => {
      return res?.data;
    })
    .catch((err) => []);
};

// fetch bank name ddl
export const fetchBankNameDDL = (obj) => {
  const { getBankNameDDL, profileData, buUnId } = obj;

  getBankNameDDL(
    `/imp/ImportCommonDDL/GetBankListDDL?accountId=${
      profileData?.accountId
    }&businessUnitId=${buUnId || 0}`
  );
};

// fetch bank account ddl
export const fetchBankAccountDDL = (obj) => {
  const { getBankAccountDDL, profileData, values, bankId } = obj;
  const { sbu } = values;

  getBankAccountDDL(
    `/imp/ImportCommonDDL/GetBankAccountIdNameDDL?AccountId=${
      profileData?.accountId
    }&BusinessUnitId=${sbu?.value}&BankId=${bankId || 0}`
  );
};
