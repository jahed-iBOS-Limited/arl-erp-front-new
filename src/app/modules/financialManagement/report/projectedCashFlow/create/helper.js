import axios from "axios";
import { toast } from "react-toastify";
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

  // at sight payment
  lcType: "",
  margin: "",
  docValue: "",
  exchangeRate: "",

  // payment & income
  partnerType: "",
  transaction: "",
  dueDate: "",

  // others
  businessPartner: "",
};

export const generateSaveURL = (viewType) => {
  if (!viewType) toast.warn("Select a view type");
  // generate url
  switch (viewType) {
    case "income":
    case "import":
    case "payment":
      return "/fino/FundManagement/SaveProjectedCashFlow?partName=SaveProjectedCashFlow";
    default:
      return "";
  }
};

// fetch POLC And Set Form Field
export const fetchPOLCAndSetFormField = (obj) => {
  const { lcPoId, getPOLCNumberData, setValues, initData } = obj;
  getPOLCNumberData(
    `/fino/FundManagement/GetProjectedCashFlow?partName=GetLcInfoByLcId&lcId=${lcPoId}`,
    (res) => {
      // destrcuture from array of obj
      const desData = res[0];

      // generate form value from response value
      const responseData = {
        bankAccount: {
          value: desData?.bankAccountId || 0,
          label: desData?.bankAccountNo || "",
        },
        bankName: {
          value: desData?.bankId || 0,
          label: desData?.bankName || "",
        },
        exchangeRate: desData?.exchangeRate || "",
        poLC: {
          ...initData?.poLC,
          lcId: desData?.lcId || "",
          lcMarginValue: desData?.lcMarginValue || 0,
          lcNumber: desData?.lcNo || 0,
          poAmount: desData?.poValue || 0,
          poId: desData?.purchaseOrderId || 0,
          poNumber: desData?.purchaseOrderNo || "",
          label: desData?.purchaseOrderNo || "",
          value: desData?.purchaseOrderId || 0,
        },
        lcType: {
          label: desData?.lcTypeName || "",
          value: desData?.lcTypeId || 0,
        },
        margin: desData?.marginPercentage || 0,
        businessPartner: {
          label: desData?.businessPartnerName || "",
          value: desData?.businessPartnerId || 0,
        },
      };
      // set to formik (init data & response data)
      setValues({
        ...initData,
        ...responseData,
      });
    }
  );
};

// generate save payload
export const generateSavePayloadAndURL = (obj) => {
  // destrcuture
  const { values, profileData } = obj;
  // values
  const {
    viewType,
    poLC,
    sbu,
    bankName,
    bankAccount,
    paymentType,
    amount,
    paymentDate,
    remarks,
    marginType,
    // beneficiary,
    poValue,
    lcType,
    margin,
    docValue,
    exchangeRate,
    partnerType,
    transaction,
    dueDate,
    businessPartner,
  } = values;

  const payload = {
    // global
    actionBy: profileData?.userUd,
    cashFlowType: viewType,

    // common
    lcId: poLC?.lcId,
    lcNo: poLC?.lcNumber,
    purchaseOrderId: poLC?.poId,
    purchaseOrderNo: poLC?.poNumber,
    businessUnitId: sbu?.value,
    bankName: bankName?.label,
    bankId: bankName?.value,
    bankAccountId: bankAccount?.value,
    bankAccountNo: bankAccount?.label,
    paymentType: paymentType?.value,
    paymentDate: paymentDate,
    projectedAmount: amount || 0,
    remarks: remarks || "",

    // margin & at sight payment
    marginTypeId: marginType?.value,
    marginTypeName: marginType?.label,

    // margin
    purchaseOrderAmount: poValue,

    // at sight payment
    lcTypeId: lcType?.value,
    lcTypeName: lcType?.label,
    lcMarginPercentage: margin || 0,
    docValue: docValue || 0,
    exchangeRate: exchangeRate,

    // payment & income
    partnerType: partnerType?.label || "",
    transactionId: transaction?.value || 0,
    transactionName: transaction?.label || 0,
    dueDate: dueDate,
    businessPartnerId: businessPartner?.value || 0,
    businessPartnerName: businessPartner?.label || "",
  };
  return payload;
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
  const { profileData, selectedBusinessUnit, v } = obj;
  if (v?.length < 3) return [];
  return axios
    .get(
      `/imp/ImportCommonDDL/GetPONOLcNoforLCSummeryDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
    )
    .then((res) => res?.data)
    .catch((err) => []);
};

export const fetchTransactionList = (obj) => {
  const { v, profileData, values } = obj;
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
